/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Checkbox, Grid, Stack, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import dayjs from 'dayjs';
import { FormSchema, IFormInput } from '@pages/master/tenderlotplan/models/TenderlotPlanning';
import { TextFieldEditor, AutocompleteEditor, CheckBoxEditor } from '@components/table/editors';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useTenderlotplansSlice } from '@pages/master/tenderlotplan/store/slice';
import { tenderlotplansSelector } from '@pages/master/tenderlotplan/store/slice/tenderlotplans.selectors';
import { useColorsSlice } from '@pages/master/colors/store/slice';
import { colorsSelector } from '@pages/master/colors/store/slice/colors.selectors';
import { usePuritiesSlice } from '@pages/master/purities/store/slice';
import { puritiesSelector } from '@pages/master/purities/store/slice/purities.selectors';
import { useFlssSlice } from '@pages/master/flss/store/slice';
import { flssSelector } from '@pages/master/flss/store/slice/flss.selectors';
import { useShapesSlice } from '@pages/master/shapes/store/slice';
import { shapesSelector } from '@pages/master/shapes/store/slice/shapes.selectors';
import { useCutsSlice } from '@pages/master/cuts/store/slice';
import { cutsSelector } from '@pages/master/cuts/store/slice/cuts.selectors';
import { usePolishsSlice } from '@pages/master/polishs/store/slice';
import { polishsSelector } from '@pages/master/polishs/store/slice/polishs.selectors';
import { useSymmsSlice } from '@pages/master/symms/store/slice';
import { symmsSelector } from '@pages/master/symms/store/slice/symms.selectors';
import { tempDataStore } from './TenderLotPlan';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import {
	//InitialQueryParam,
	InitialState,
	onTableKeyDown,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';
import '@inovua/reactdatagrid-community/index.css';
import { truncate } from 'fs/promises';

const gridStyle = { minHeight: 300 };
const totalStyle = { minHeight: 21 };
let inEdit: boolean;
let newRowDataSource: any;
let newPageState: any;

// ==============================|| TENDERLOT PLANNING ||============================== //

interface Props {
	passProps?: any;
	assortSeq?: string;
	tenderLotSeq?: any;
	selectedData?: any | null;
	planningOptions?: any;
	finalPlansumm?: any;
	currentAction?: any;
	currentFocus?: any;
	editMode?: any;
}

const TenderlotPlanning = ({
	passProps,
	planningOptions,
	finalPlansumm,
	assortSeq,
	tenderLotSeq,
	currentAction,
	currentFocus,
	editMode
}: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const tenderlotplansState = useSelector(tenderlotplansSelector);

	const {
		getSuccess,
		getTensionSuccess,
		getMilkySuccess,
		getNattsSuccess,
		getOneRapSuccess,
		getOneRapDiscSuccess
	} = tenderlotplansState;

	// *** Tenderlotplans State *** //
	const { actions: tenderlotplansActions } = useTenderlotplansSlice();
	const { actions: shapesActions } = useShapesSlice();
	const { actions: colorsActions } = useColorsSlice();
	const { actions: puritiesActions } = usePuritiesSlice();
	const { actions: flssActions } = useFlssSlice();
	const { actions: cutsActions } = useCutsSlice();
	const { actions: polishsActions } = usePolishsSlice();
	const { actions: symmsActions } = useSymmsSlice();
	const { actions } = useSnackBarSlice();
	// *** Shapes State *** //
	const shapeState = useSelector(shapesSelector);
	const { getSuccess: getShapeSuccess } = shapeState;

	// *** Purities State *** //
	const puritieState = useSelector(puritiesSelector);
	const { getSuccess: getPuritySuccess } = puritieState;

	// *** Colors State *** //
	const colorState = useSelector(colorsSelector);
	const { getSuccess: getPlanColorSuccess, getSuccess: getMachineColorSuccess } = colorState;

	// *** Flss State *** //
	const flsState = useSelector(flssSelector);
	const { getSuccess: getFlsSuccess } = flsState;

	// *** Cuts State *** //
	const cutState = useSelector(cutsSelector);
	const { getSuccess: getCutSuccess } = cutState;

	// *** Polishs State *** //
	const polishState = useSelector(polishsSelector);
	const { getSuccess: getPolishSuccess } = polishState;

	// *** Symms State *** //
	const symmState = useSelector(symmsSelector);
	const { getSuccess: getSymmSuccess } = symmState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const { reset } = formContext;
	const { tableRefSeq } = useContext(tempDataStore);

	const footerRows = [
		{
			render: {
				pol_pcs: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.pol_pcs !== 0 ? summary.pol_pcs.toFixed(2) : 0}</b>
					</div>
				),
				rgh_wgt: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.rgh_wgt}</b>
					</div>
				),
				pol_wgt: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.pol_wgt !== 0 ? summary.pol_wgt.toFixed(2) : 0}</b>
					</div>
				),
				net_rate: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.net_rate !== 0 ? summary.net_rate.toFixed(0) : 0}</b>
					</div>
				),
				net_value: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.net_value !== 0 ? summary.net_value.toFixed(0) : 0}</b>
					</div>
				)
			}
		}
	];

	const summaryReducer = {
		initialValue: { pol_pcs: 0, rgh_wgt: 0, pol_wgt: 0, net_rate: 0, net_value: 0 },
		reducer: (acc: any, item: any) => ({
			pol_pcs: parseFloat(acc.pol_pcs || 0) + parseFloat(item.pol_pcs || 0),
			rgh_wgt: parseInt(acc.rgh_wgt || 0) + parseInt(item.rgh_wgt || 0),
			pol_wgt: parseFloat(acc.pol_wgt || 0) + parseFloat(item.pol_wgt || 0),
			net_rate: parseFloat(acc.net_rate || 0) + parseFloat(item.net_rate || 0),
			net_value: parseFloat(acc.net_value || 0) + parseFloat(item.net_value || 0)
		})
	};
	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'final',
				header: 'Final',
				group: 'plan',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 20,
				maxWidth: 40,
				sortable: false,
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <CheckBoxEditor {...editorProps} />;
				},
				render: ({ value }: any) => {
					return <Checkbox checked={value} style={{ backgroundColor: 'transparent' }} />;
				}
			},
			{
				name: 'plan_no',
				header: 'No *',
				group: 'plan',
				headerAlign: 'start',
				textAlign: 'center',
				minWidth: 20,
				maxWidth: 30,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				}
			},
			{
				name: 'pol_pcs',
				header: 'Pcs *',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 35,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let pol_pcs = parseFloat(data.pol_pcs);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(pol_pcs)) {
						let result = pol_pcs.toFixed(2);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'pol_size',
				header: 'Size *',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 40,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					let netAmt = parseFloat(data.pol_size);
					if (!isNaN(netAmt)) {
						let result = netAmt.toFixed(2);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'pol_wgt',
				header: 'Wgt',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 50,
				sortable: false,
				editable: false,
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					let netAmt = parseFloat(data.pol_wgt);
					if (!isNaN(netAmt)) {
						let result = netAmt.toFixed(2);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'shape',
				header: 'Shape *',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 75,
				addInHidden: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return (
						<AutocompleteEditor
							key={'countrydemo' + Math.floor(Math.random() * 100 + 10000)}
							{...editorProps}
						/>
					);
				},
				onEditComplete: (selected: any, allConfig: any) => {
					allConfig.editorProps.dataSource = [];
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.shape && data.shape.name ? data.shape.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'color',
				header: 'Col *',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.color && data.color.name ? data.color.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'purity',
				header: 'Pur *',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.purity && data.purity.name ? data.purity.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'cut',
				header: 'Cut *',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 40,
				addInHidden: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.cut && data.cut.name ? data.cut.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'polish',
				header: 'Pol *',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 40,
				addInHidden: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.polish && data.polish.name ? data.polish.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'symm',
				header: 'Sym *',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 40,
				addInHidden: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.symm && data.symm.name ? data.symm.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'fls',
				header: 'Fls *',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.fls && data.fls.name ? data.fls.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'tension',
				header: 'Tension',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 70,
				addInHidden: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.tension && data.tension.name ? data.tension.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'natts',
				header: 'Natts',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.natts && data.natts.name ? data.natts.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'milky',
				header: 'Milky',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.milky && data.milky.name ? data.milky.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'machine_color',
				// header: 'Machine Color',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 75,
				addInHidden: true,
				sortable: false,
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Machine
							<br />
							Color
						</div>
					);
				},
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.machine_color && data.machine_color.name
								? data.machine_color.name
								: ''}
						</Typography>
					);
				}
			},
			{
				name: 'machine_comments',
				// header: 'Machine Color Comments',
				headerAlign: 'start',
				textAlign: 'left',
				minWidth: 200,
				maxWidth: 260,
				sortable: false,
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Machine Color
							<br />
							Comments
						</div>
					);
				},
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'width',
				header: 'Width',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'depth_per',
				// header: 'Depth %',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				sortable: false,
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Depth
							<br />%
						</div>
					);
				},
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'rate',
				// header: 'Rap Rate',
				headerAlign: 'center',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 60,
				sortable: false,
				editable: false,
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Rap
							<br />
							Rate
						</div>
					);
				},
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'disc_per',
				// header: 'Disc %',
				headerAlign: 'center',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 35,
				sortable: false,
				editable: true,
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				},
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Disc
							<br />%
						</div>
					);
				}
			},
			{
				name: 'add_disc_per',
				header: 'Add Disc',
				headerAlign: 'center',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 40,
				sortable: false,
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Add
							<br />
							Disc
						</div>
					);
				},
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				},
				render: ({ data }: any) => {
					let add_disc_per = parseFloat(data.add_disc_per);
					if (!isNaN(add_disc_per)) {
						let result = add_disc_per.toFixed(2);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'net_rate',
				header: 'Net Rate',
				headerAlign: 'center',
				textAlign: 'right',
				mminWidth: 50,
				maxWidth: 75,
				sortable: false,
				editable: false,
				skipNavigation: true,
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Net
							<br />
							Rate
						</div>
					);
				},
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				},
				render: ({ data }: any) => {
					let netRate = parseFloat(data.net_rate);
					if (!isNaN(netRate)) {
						let result = netRate.toFixed(0);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'net_value',
				header: 'Net Value',
				headerAlign: 'center',
				textAlign: 'right',
				mminWidth: 50,
				maxWidth: 75,
				sortable: false,
				editable: false,
				skipNavigation: true,
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Net
							<br />
							Value
						</div>
					);
				},
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				},
				render: ({ data }: any) => {
					let netAmt = parseFloat(data.net_value);
					if (!isNaN(netAmt)) {
						let result = netAmt.toFixed(0);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'total_pol_wgt',
				header: 'Total Pol Wgt',
				headerAlign: 'center',
				textAlign: 'right',
				mminWidth: 50,
				maxWidth: 80,
				sortable: false,
				editable: false,
				skipNavigation: true,
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Total
							<br />
							Pol Wgt
						</div>
					);
				},
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				render: ({ data }: any) => {
					let netAmt = parseFloat(data.total_pol_wgt);
					if (!isNaN(netAmt)) {
						let result = netAmt.toFixed(2);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				},
				editorProps: {
					type: 'number'
				},
				rowspan: ({ value, dataSourceArray, rowIndex, column }: any) => {
					let rowspan = 1;
					const prevData = dataSourceArray[rowIndex];
					let currentRowIndex = rowIndex + 1;
					while (
						dataSourceArray[currentRowIndex] &&
						dataSourceArray[currentRowIndex]['plan_no']?.toString() ===
							prevData['plan_no']?.toString()
					) {
						rowspan++;
						currentRowIndex++;
						if (rowspan > 9) {
							break;
						}
					}

					return rowspan;
				}
			},
			{
				name: 'total_net_value',
				header: 'Total Net Value',
				headerAlign: 'center',
				textAlign: 'right',
				minWidth: 50,
				maxWidth: 80,
				sortable: false,
				editable: false,
				skipNavigation: true,
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Total
							<br />
							Net Value
						</div>
					);
				},
				render: ({ data }: any) => {
					let netAmt = parseFloat(data.total_net_value);
					if (!isNaN(netAmt)) {
						let result = netAmt.toFixed(0);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				},
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				rowspan: ({ value, dataSourceArray, rowIndex, column }: any) => {
					let rowspan = 1;
					const prevData = dataSourceArray[rowIndex];
					let currentRowIndex = rowIndex + 1;
					while (
						dataSourceArray[currentRowIndex] &&
						dataSourceArray[currentRowIndex]['plan_no']?.toString() ===
							prevData['plan_no']?.toString()
					) {
						rowspan++;
						currentRowIndex++;
						if (rowspan > 9) {
							break;
						}
					}

					return rowspan;
				},
				editorProps: {
					type: 'number'
				}
			},
			{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
		];
	};

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});

	const groups = [
		{ name: 'plan', header: 'Plan' },
		{ name: 'pol', header: 'Pol' }
	];

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());
	const [activeCell, setActiveCell] = useState<any>([0, 1]);
	const [getRapRow, setGetRapRow] = useState<any>();
	const [getRapRowIndex, setGetRapRowIndex] = useState<any>();

	const confirm = useConfirm();
	const [gridRef, setGridRef] = useState<any>(null);
	const [focusActiveCell, setFocusActiveCell] = useState<any>(null);

	useEffect(() => {
		fetchDataByColumnName({ colName: 'shape' });
		fetchDataByColumnName({ colName: 'color' });
		fetchDataByColumnName({ colName: 'purity' });
		fetchDataByColumnName({ colName: 'fls' });
		fetchDataByColumnName({ colName: 'cut' });
		fetchDataByColumnName({ colName: 'polish' });
		fetchDataByColumnName({ colName: 'symm' });
		fetchDataByColumnName({ colName: 'tension' });
		fetchDataByColumnName({ colName: 'milky' });
		fetchDataByColumnName({ colName: 'natts' });
		setTimeout(() => {
			fetchDataByColumnName({ colName: 'machine_color' });
		}, 1000);

		return () => {
			dispatch(tenderlotplansActions.reset());
		};
	}, []);

	useEffect(() => {
		if (currentAction == 5) {
			const grid = gridRef.current;
			setActiveCell([0, 1]);
			setTimeout(() => {
				const column = grid.getColumnBy(1);
				grid.startEdit({ columnId: column.name, rowIndex: 0 });
			}, 10);
		}
	}, [currentAction]);

	useEffect(() => {
		if (planningOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: planningOptions
				}
			}));
			// setDataSource(planningOptions);
			setActiveCell([0, 1]);
			const finalColumnIndex = planningOptions
				?.filter((e: any) => e.action !== 'delete')
				?.findIndex((row: any) => row.final === true);
			setDataNewSource(
				planningOptions?.filter((e: any) => e.action !== 'delete'),
				finalColumnIndex
			);
		}
	}, [planningOptions]);

	useEffect(() => {
		newRowDataSource = dataSource;
	}, [dataSource]);

	useEffect(() => {
		newPageState = pageState;
		passProps(
			newPageState.values?.para?.filter(
				(e: any) =>
					e.plan_no != null &&
					e.pol_pcs != null &&
					e.shape != null &&
					e.pol_size != null &&
					e.color != null &&
					e.purity != null &&
					e.cut != null &&
					e.polish != null &&
					e.symm != null &&
					e.fls != null
			)
		);
	}, [pageState]);

	useEffect(() => {
		if (newRowDataSource.length == 1 && focusActiveCell == 1) {
			setActiveCell([0, 1]);
			const grid = gridRef.current;
			setTimeout(() => {
				//const column = grid.getColumnBy(0);
				grid.startEdit({ columnId: 'plan_no', rowIndex: 0 });
			}, 0);
			setFocusActiveCell(null);
		}
	}, [focusActiveCell]);

	useEffect(() => {
		if (getSuccess) {
			if (getSuccess?.columnType === 'color') {
				let tenderlotplanningData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'color'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					tenderlotplanningData = getSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: tenderlotplanningData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (getSuccess?.columnType === 'machine_color') {
				let tenderlotplanningData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'machine_color'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					tenderlotplanningData = getSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: tenderlotplanningData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (getSuccess?.columnType === 'purity') {
				let tenderlotplanningData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'purity'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					tenderlotplanningData = getSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: tenderlotplanningData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (getSuccess?.columnType === 'fls') {
				let tenderlotplanningData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'fls'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					tenderlotplanningData = getSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: tenderlotplanningData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (getSuccess?.columnType === 'cut') {
				let tenderlotplanningData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'cut'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					tenderlotplanningData = getSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: tenderlotplanningData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (getSuccess?.columnType === 'polish') {
				let tenderlotplanningData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'polish'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					tenderlotplanningData = getSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: tenderlotplanningData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (getSuccess?.columnType === 'symm') {
				let tenderlotplanningData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'symm'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					tenderlotplanningData = getSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: tenderlotplanningData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (getSuccess?.columnType === 'shape') {
				let tenderlotplanningData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'shape'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					tenderlotplanningData = getSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: tenderlotplanningData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (!getSuccess?.columnType || getSuccess?.columnType === null) {
				if (getSuccess?.results && getSuccess?.results.length > 0) {
					// setDataSource(getSuccess?.results);
					setDataNewSource(getSuccess?.results);
				} else {
					setDataSource([]);
				}
			}
		}
	}, [getSuccess]);

	// *** COLOR *** //
	useEffect(() => {
		setConfigForgetPlanColorSuccess(getPlanColorSuccess);
	}, [getPlanColorSuccess]);

	const setConfigForgetPlanColorSuccess = (getPlanColorSuccess: any) => {
		if (getPlanColorSuccess) {
			if (getPlanColorSuccess?.results) {
				if (getPlanColorSuccess?.columnType === 'color') {
					let colorData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'color'
					);

					if (getPlanColorSuccess?.results && getPlanColorSuccess?.results.length > 0) {
						colorData = getPlanColorSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: colorData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	};

	const setConfigForGetMachineColorSuccess = (getMachineColorSuccess: any) => {
		if (getMachineColorSuccess) {
			if (getMachineColorSuccess?.results) {
				if (getMachineColorSuccess?.columnType === 'machine_color') {
					let machineColorData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'machine_color'
					);

					if (
						getMachineColorSuccess?.results &&
						getMachineColorSuccess?.results.length > 0
					) {
						machineColorData = getMachineColorSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: machineColorData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	};
	useEffect(() => {
		setConfigForGetMachineColorSuccess(getMachineColorSuccess);
	}, [getMachineColorSuccess]);

	// *** PURITY *** //
	const setConfigForGetPuritySuccess = (getPuritySuccess: any) => {
		if (getPuritySuccess) {
			if (getPuritySuccess?.results) {
				if (getPuritySuccess?.columnType === 'purity') {
					let purityData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'purity'
					);

					if (getPuritySuccess?.results && getPuritySuccess?.results.length > 0) {
						purityData = getPuritySuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: purityData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	};

	useEffect(() => {
		setConfigForGetPuritySuccess(getPuritySuccess);
	}, [getPuritySuccess]);

	// *** FLS *** //

	const setConfigForGetFlsSuccess = (getFlsSuccess: any) => {
		if (getFlsSuccess) {
			if (getFlsSuccess?.results) {
				if (getFlsSuccess?.columnType === 'fls') {
					let flsData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'fls'
					);

					if (getFlsSuccess?.results && getFlsSuccess?.results.length > 0) {
						flsData = getFlsSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: flsData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	};

	useEffect(() => {
		setConfigForGetFlsSuccess(getFlsSuccess);
	}, [getFlsSuccess]);

	// *** SHAPE *** //

	const setConfigForGetShapeSuccess = (getShapeSuccess: any) => {
		if (getShapeSuccess) {
			if (getShapeSuccess?.results) {
				if (getShapeSuccess?.columnType === 'shape') {
					let shapeData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'shape'
					);

					if (getShapeSuccess?.results && getShapeSuccess?.results.length > 0) {
						shapeData = getShapeSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: shapeData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	};

	useEffect(() => {
		setConfigForGetShapeSuccess(getShapeSuccess);
	}, [getShapeSuccess]);

	// *** CUT *** //
	const setConfigForGetCutSuccess = (getCutSuccess: any) => {
		if (getCutSuccess) {
			if (getCutSuccess?.results) {
				if (getCutSuccess?.columnType === 'cut') {
					let cutData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'cut'
					);

					if (getCutSuccess?.results && getCutSuccess?.results.length > 0) {
						cutData = getCutSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: cutData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	};
	useEffect(() => {
		setConfigForGetCutSuccess(getCutSuccess);
	}, [getCutSuccess]);

	// *** POLISH *** //
	const setConfigForGetPolishSuccess = (getPolishSuccess: any) => {
		if (getPolishSuccess) {
			if (getPolishSuccess?.results) {
				if (getPolishSuccess?.columnType === 'polish') {
					let polishData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'polish'
					);

					if (getPolishSuccess?.results && getPolishSuccess?.results.length > 0) {
						polishData = getPolishSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: polishData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	};

	useEffect(() => {
		setConfigForGetPolishSuccess(getPolishSuccess);
	}, [getPolishSuccess]);

	// *** SYMM *** //
	const setConfigForGetSymmSuccess = (getSymmSuccess: any) => {
		if (getSymmSuccess) {
			if (getSymmSuccess?.results) {
				if (getSymmSuccess?.columnType === 'symm') {
					let symmData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'symm'
					);

					if (getSymmSuccess?.results && getSymmSuccess?.results.length > 0) {
						symmData = getSymmSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: symmData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	};

	useEffect(() => {
		setConfigForGetSymmSuccess(getSymmSuccess);
	}, [getSymmSuccess]);

	// *** Tension *** //
	const setConfigForGetTensionSuccess = (getTensionSuccess: any) => {
		if (getTensionSuccess) {
			let tensionData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'tension'
			);

			if (getTensionSuccess?.results && getTensionSuccess?.results.length > 0) {
				tensionData = getTensionSuccess?.results;
			}

			if (editorTypeColumnIndex !== -1) {
				updatedColumns[editorTypeColumnIndex].editorProps = {
					idProperty: 'seq_no',
					dataSource: tensionData,
					collapseOnSelect: true,
					clearIcon: null
				};
				setColumns(updatedColumns);
			}
		}
	};

	useEffect(() => {
		setConfigForGetTensionSuccess(getTensionSuccess);
	}, [getTensionSuccess]);

	// *** MILKY *** //
	const setConfigForGetMilkySuccess = (getMilkySuccess: any) => {
		if (getMilkySuccess) {
			let milkyData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'milky'
			);

			if (getMilkySuccess?.results && getMilkySuccess?.results.length > 0) {
				milkyData = getMilkySuccess?.results;
			}

			if (editorTypeColumnIndex !== -1) {
				updatedColumns[editorTypeColumnIndex].editorProps = {
					idProperty: 'seq_no',
					dataSource: milkyData,
					collapseOnSelect: true,
					clearIcon: null
				};
				setColumns(updatedColumns);
			}
		}
	};

	useEffect(() => {
		setConfigForGetMilkySuccess(getMilkySuccess);
	}, [getMilkySuccess]);

	// *** NATTS *** //
	const setConfigForGetNattsSuccess = (getNattsSuccess: any) => {
		if (getNattsSuccess) {
			let nattsData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'natts'
			);

			if (getNattsSuccess?.results && getNattsSuccess?.results.length > 0) {
				nattsData = getNattsSuccess?.results;
			}

			if (editorTypeColumnIndex !== -1) {
				updatedColumns[editorTypeColumnIndex].editorProps = {
					idProperty: 'seq_no',
					dataSource: nattsData,
					collapseOnSelect: true,
					clearIcon: null
				};
				setColumns(updatedColumns);
			}
		}
	};

	useEffect(() => {
		setConfigForGetNattsSuccess(getNattsSuccess);
	}, [getNattsSuccess]);

	// *** RAP *** //
	useEffect(() => {
		if (getOneRapSuccess) {
			getRapRow.rate = getOneRapSuccess.rate;
			dataSource[getRapRowIndex].rate = getOneRapSuccess.rate;
		}
	}, [getOneRapSuccess]);

	// *** RAP DISC *** //
	useEffect(() => {
		if (getOneRapDiscSuccess) {
			dataSource[getRapRowIndex].disc_per = getOneRapDiscSuccess.disc_per;
		}
	}, [getOneRapDiscSuccess]);

	// Editable React data table
	const onEditStart = () => {
		inEdit = true;
		setConfigForGetShapeSuccess(getShapeSuccess);
		setConfigForgetPlanColorSuccess(getPlanColorSuccess);
		setConfigForGetCutSuccess(getCutSuccess);
		setConfigForGetFlsSuccess(getFlsSuccess);
		setConfigForGetMachineColorSuccess(getMachineColorSuccess);
		setConfigForGetMilkySuccess(getMilkySuccess);
		setConfigForGetNattsSuccess(getNattsSuccess);
		setConfigForGetPolishSuccess(getPolishSuccess);
		setConfigForGetPuritySuccess(getPuritySuccess);
		setConfigForGetTensionSuccess(getTensionSuccess);
		setConfigForGetSymmSuccess(getSymmSuccess);
	};

	const onEditStop = () => {
		requestAnimationFrame(() => {
			inEdit = false;
			gridRef.current.focus();
		});
	};

	const fetchDataByColumnName = (edited: any) => {
		if (edited) {
			if (edited.colName === 'shape') {
				dispatch(shapesActions.reset());
				dispatch(
					shapesActions.get({
						QueryParams: 'page=1&limit=500&pagination=false&columnType=shape'
					})
				);
			} else if (edited.colName === 'color') {
				dispatch(colorsActions.reset());

				dispatch(
					colorsActions.get({
						QueryParams: 'page=1&limit=500&pagination=false&columnType=color'
					})
				);
			} else if (edited.colName === 'machine_color') {
				dispatch(colorsActions.reset());

				dispatch(
					colorsActions.get({
						QueryParams: 'page=1&limit=500&pagination=false&columnType=machine_color'
					})
				);
			} else if (edited.colName === 'purity') {
				dispatch(puritiesActions.reset());

				dispatch(
					puritiesActions.get({
						QueryParams: 'page=1&limit=500&pagination=false&columnType=purity'
					})
				);
			} else if (edited.colName === 'cut') {
				dispatch(cutsActions.reset());

				dispatch(
					cutsActions.get({
						QueryParams: 'page=1&limit=500&pagination=false&columnType=cut'
					})
				);
			} else if (edited.colName === 'polish') {
				dispatch(polishsActions.reset());
				dispatch(
					polishsActions.get({
						QueryParams: 'page=1&limit=500&pagination=false&columnType=polish'
					})
				);
			} else if (edited.colName === 'symm') {
				dispatch(symmsActions.reset());

				dispatch(
					symmsActions.get({
						QueryParams: 'page=1&limit=500&pagination=false&columnType=symm'
					})
				);
			} else if (edited.colName === 'fls') {
				dispatch(flssActions.reset());

				dispatch(
					flssActions.get({
						QueryParams: 'page=1&limit=500&pagination=false&columnType=fls'
					})
				);
			} else if (edited.colName === 'tension') {
				dispatch(tenderlotplansActions.reset());
				dispatch(tenderlotplansActions.getTension('TENSION'));
			} else if (edited.colName === 'milky') {
				dispatch(tenderlotplansActions.reset());
				dispatch(tenderlotplansActions.getMilky('MILKY'));
			} else if (edited.colName === 'natts') {
				dispatch(tenderlotplansActions.reset());
				dispatch(tenderlotplansActions.getNatts('NATTS'));
			}
		}
	};

	const onKeyDown = async (event: any) => {
		const edited = await onTableKeyDown(event, inEdit, gridRef);
		if (
			tableRefSeq?.tenderLotAssortSeq &&
			(tableRefSeq?.tenderLotAssortSeq != 0 || tableRefSeq?.tenderLotAssortSeq > -1)
		) {
			if (!edited) {
				const grid = gridRef.current;
				const [rowIndex, colIndex] = grid.computedActiveCell;
				const rowCount = grid.count;

				if (event.key === 'Tab') {
					event.preventDefault();
				}

				if (event.key === 'Delete') {
					const data = [...dataSource];

					confirm({
						description: 'Are you sure delete planning ?',
						cancellationButtonProps: { autoFocus: true },
						confirmationText: 'Yes',
						cancellationText: 'No'
					})
						.then(() => {
							let stateArr: any;
							const validation = FormSchema.safeParse({
								arr: [pageState.values.para ? pageState.values.para[rowIndex] : {}]
							});
							if (validation.success && pageState.values.para[rowIndex].seq_no < -1) {
								stateArr = pageState.values.para ? [...pageState.values.para] : [];
								stateArr[rowIndex].action = 'delete';
							} else {
								stateArr = deleteRow(pageState, 'seq_no', data, rowIndex);
							}
							return stateArr;
						})
						.then(stateArr => {
							setPageState(value => ({
								...value,
								values: {
									...pageState.values,
									para: stateArr //.filter((e: any) => e.action !== 'delete' && e.seq_no > -1)
								}
							}));
							data.splice(rowIndex, 1);
							// setDataSource(data);
							setDataNewSource(stateArr, -1);
							setActiveCell([rowIndex - 1, 1]);
						})
						.catch(() => {
							/* */
						});
				}

				if (
					event.key === 'Insert' ||
					(event.key === 'Enter' && rowIndex === rowCount - 1) ||
					(event.key === 'ArrowDown' && rowIndex === rowCount - 1)
				) {
					let isLastEditableColumn = false;
					if (event.key === 'ArrowDown') {
						/* discussion to dharmeshbhai for arrow down*/
						event.key = 'Insert';
					}
					if (event.key === 'Enter') {
						let LastEditCol = Math.floor(Math.random() * 100 + 10000);

						for (let index = columns.length - 1; index >= 0; index--) {
							const column = grid.getColumnBy(index);

							if (column) {
								if (column.editable === false || column.skipNavigation === true) {
									/* empty */
								} else {
									LastEditCol = index;
									break;
								}
							}
						}

						if (colIndex === LastEditCol) {
							isLastEditableColumn = true;
							await delay(20);
						}
					}
					event.preventDefault();
					event.stopPropagation();
					const { insertNew, data, stateArr } = await insertNewRow(
						newPageState, // State for track row insert, update or delete
						FormSchema, // for validation
						newRowDataSource, // table data
						rowIndex, // row number
						isLastEditableColumn,
						event.key,
						{
							assort_seq: tableRefSeq?.tenderLotAssortSeq,
							tender_lot_det_seq: tableRefSeq?.lotSeq,
							total_pol_wgt: null,
							total_net_value: null,
							tender_lot_plan_summ_seq: null
						}
					);

					event.preventDefault();

					if (insertNew) {
						// *** set table with new data
						// setDataSource(data);
						setDataNewSource(data, rowIndex);

						// *** set state for api
						setPageState(value => ({
							...value,
							values: {
								...pageState.values,
								para: stateArr
							}
						}));

						// *** Focus on first cell of new added row
						setActiveCell([data.length - 1, 1]);
						// setTimeout(() => {
						try {
							const column = grid.getColumnBy(1);
							await grid.startEdit({
								columnId: column.name,
								rowIndex: data.length - 1
							});
						} catch (e) {
							console.log(e);
						}
						// }, 1000);
					}
				}
			}
		} else {
			if (event.key === 'Insert' || event.key === 'ArrowDown') {
				dispatch(
					actions.openSnackbar({
						open: true,
						message: 'Please select assortment',
						variant: 'alert',
						alert: {
							color: 'error'
						},
						close: false,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						}
					})
				);
			}
		}
	};

	const onEditComplete = useCallback(
		async ({ value, columnId, rowIndex }: any) => {
			if (value === '' || value || typeof value === 'boolean') {
				if (typeof value === 'string') {
					value = value.trim();
					if (columnId == 'add_disc_per') {
						if (value.length > 0) {
							if (isNaN(value)) {
								value = null;
							} else {
								let arrPlus = value.split('+');
								if (arrPlus.length > 1) {
									value = value * 1;
								} else {
									let arrMinus = value.split('-');
									if (arrMinus.length <= 1) {
										value = value * -1;
									}
								}
								value = parseFloat(value).toFixed(2);
							}
						}
					}
				}
				// let aa = columns.filter((e: any) => e.name === columnId)[0].editorProps.type;
				// if (aa == 'number' && value != '') {
				// 	value = parseFloat(value);
				// }

				const { stateArr, data } = await prepareOnEditComplete(
					columns,
					dataSource,
					value,
					columnId,
					rowIndex,
					pageState,
					'seq_no'
				);

				let tmpRate = parseFloat(data[rowIndex].rate);
				let tmpDiscPer = parseFloat(data[rowIndex].disc_per || 0);
				let tmpAddDiscPer = parseFloat(data[rowIndex].add_disc_per);
				let tmpPolSize = parseFloat(data[rowIndex].pol_size);
				let tmppcs = parseFloat(data[rowIndex].pol_pcs);

				if (!isNaN(tmpPolSize) && !isNaN(tmppcs) && tmppcs !== 0) {
					let result = (tmpPolSize * tmppcs).toFixed(2);
					stateArr[rowIndex].pol_wgt = result;
					data[rowIndex].pol_wgt = result;
				}
				//Math.Round((rate * (100 + tender_plan.disc_per.ToDecimal())) / 100, 2);
				if (!isNaN(tmpRate) && !isNaN(tmpDiscPer)) {
					let result = (
						(tmpRate * (100 + (tmpDiscPer + (tmpAddDiscPer || 0)))) /
						100
					).toFixed(2);
					stateArr[rowIndex].net_rate = result;
					data[rowIndex].net_rate = result;
				}
				//Math.Round(tender_plan.net_rate * tender_plan.pol_size.ToDecimal(), 2);
				if (!isNaN(tmpRate) && !isNaN(tmpDiscPer)) {
					let result = (stateArr[rowIndex].net_rate * stateArr[rowIndex].pol_wgt).toFixed(
						2
					);
					stateArr[rowIndex].net_value = result;
					data[rowIndex].net_value = result;
				}

				if (!isNaN(tmpRate)) {
					let result = (tmpRate * stateArr[rowIndex].pol_wgt).toFixed(2);
					stateArr[rowIndex].value = result;
					data[rowIndex].value = result;
				}

				// Add rows to in pageState
				setPageState(value => ({
					...value,
					values: {
						...pageState.values,
						para: stateArr
					}
				}));

				if (
					stateArr &&
					stateArr[rowIndex]?.shape?.seq_no &&
					stateArr[rowIndex]?.color?.name &&
					stateArr[rowIndex]?.purity?.name &&
					stateArr[rowIndex]?.pol_size
				) {
					setGetRapRow(stateArr[rowIndex]);
					setGetRapRowIndex(rowIndex);
					dispatch(
						tenderlotplansActions.getOneRap({
							QueryParams: `3/'${dayjs(new Date()).format(
								'YYYY-MM-DD'
							)}'?shape_seq=${stateArr[rowIndex]?.shape.seq_no}&color=${stateArr[
								rowIndex
							]?.color.name}&purity=${stateArr[rowIndex]?.purity.name}&wgt=${stateArr[
								rowIndex
							]?.pol_size}`
						})
					);
				}
				if (
					stateArr &&
					stateArr[rowIndex]?.shape?.seq_no &&
					stateArr[rowIndex]?.color?.name &&
					stateArr[rowIndex]?.purity?.name &&
					stateArr[rowIndex]?.cut?.seq_no &&
					stateArr[rowIndex]?.pol_size
				) {
					setGetRapRow(stateArr[rowIndex]);
					setGetRapRowIndex(rowIndex);
					dispatch(
						tenderlotplansActions.getOneRapDisc({
							QueryParams: `'MFG-DISC'?shape_seq=${stateArr[rowIndex]?.shape.seq_no}&color=${stateArr[rowIndex]?.color.name}&purity=${stateArr[rowIndex]?.purity.name}&prop_seq=${stateArr[rowIndex]?.cut.seq_no}&wgt=${stateArr[rowIndex]?.pol_size}`
						})
					);
				}
				if (columnId == 'final' && value == true) {
					finalPlansumm({
						total_pol_wgt: stateArr[rowIndex].total_pol_wgt,
						total_net_value: stateArr[rowIndex].total_net_value
					});
				} else {
					if (columnId == 'final' && value == false) {
						finalPlansumm({
							total_pol_wgt: 0,
							total_net_value: 0
						});
					}
				}
				// setDataSource(stateArr);
				//columnId
				if (columnId != 'final') {
					rowIndex = -1;
				}
				setDataNewSource(data, rowIndex);
			}
		},
		[dataSource]
	);

	const setDataNewSource = (dataSource: any, rowIndex?: any) => {
		const newDataSource = [...dataSource];

		const dataArray = newDataSource.map(elem => {
			return Object.assign({}, elem, {});
		});
		const netValuesums = dataArray.reduce((acc, item) => {
			const plan_no = item.plan_no;
			acc[plan_no] = (acc[plan_no] || 0) + parseFloat(item.net_value || 0);
			return acc;
		}, {});
		const polWgtSums = dataArray.reduce((acc, item) => {
			const plan_no = item.plan_no;
			acc[plan_no] = (acc[plan_no] || 0) + parseFloat(item.pol_wgt || 0);
			return acc;
		}, {});
		// Convert the object into an array

		const netValuesumsArray = Object.entries(netValuesums).map(([plan_no, netValuesums]) => ({
			plan_no,
			netValuesums
		}));
		const polWgtSumsArray = Object.entries(polWgtSums).map(([plan_no, polWgtSums]) => ({
			plan_no,
			polWgtSums
		}));
		let planNo: any;
		let final: any;
		const newArray = dataArray.map((addelem: any) => {
			// if (final && planNo == addelem.plan_no) {
			// 	planNo = addelem.plan_no;
			// 	addelem.final = final;

			// 	if (addelem.action && addelem.action != 'insert') {
			// 		addelem.action = 'update';
			// 	}
			// } else {
			// 	addelem.final = final;
			// 	if (addelem.action != 'insert') {
			// 		addelem.action = 'update';
			// 	}
			// }
			if (rowIndex != -1) {
				if (
					newDataSource[rowIndex]?.final === true &&
					newDataSource[rowIndex]?.plan_no == addelem.plan_no
				) {
					//pageState.values.para[rowIndex].final = true;
					addelem.final = true;
					if (addelem.action != 'insert' && addelem.action != 'delete') {
						addelem.action = 'update';
					}
				} else {
					addelem.final = false;
					//pageState.values.para[rowIndex].final = false;
					if (addelem.action != 'insert' && addelem.action != 'delete') {
						addelem.action = 'update';
					}
				}
			}

			netValuesumsArray.map(elem => {
				if (addelem.plan_no == elem.plan_no) {
					addelem.total_net_value = elem.netValuesums;
				}
			});
			polWgtSumsArray.map(elem => {
				if (addelem.plan_no == elem.plan_no) {
					addelem.total_pol_wgt = elem.polWgtSums;
				}
			});
			if (addelem.final == true) {
				finalPlansumm({
					total_pol_wgt: addelem.total_pol_wgt,
					total_net_value: addelem.total_net_value
				});
			}

			return Object.assign({}, addelem, {});
		});

		setDataSource(newArray.filter((e: any) => e.action !== 'delete'));
		// change issue delete and final checkbox issue..

		setPageState(value => ({
			...value,
			values: {
				...pageState.values,
				para: newArray
			}
		}));
	};

	const onFocus = async (event: any) => {
		let isValidForNewRow = newRowDataSource.length === 0 ? true : false;
		if (isValidForNewRow) {
			if (
				tableRefSeq?.tenderLotAssortSeq &&
				(tableRefSeq?.tenderLotAssortSeq != 0 || tableRefSeq?.tenderLotAssortSeq > -1)
			) {
				const { insertNew, data, stateArr } = await insertNewRow(
					pageState, // State for track row insert, update or delete
					FormSchema, // for validation
					newRowDataSource, // table data
					0, // row number
					true,
					'Focus',
					{
						assort_seq: tableRefSeq?.tenderLotAssortSeq,
						tender_lot_det_seq: tableRefSeq?.lotSeq,
						total_pol_wgt: null,
						total_net_value: null,
						tender_lot_plan_summ_seq: null
					}
				);

				event.preventDefault();

				if (insertNew) {
					// *** set table with new data
					setDataNewSource(data, 0);

					// *** set state for api
					setPageState(value => ({
						...value,
						values: {
							...pageState.values,
							para: stateArr
						}
					}));

					// *** Focus on first cell of new added row
					// setActiveCell([data.length - 1, 1]);
					setFocusActiveCell(1);
				}
			} else {
				dispatch(
					actions.openSnackbar({
						open: true,
						message: 'Please select assortment',
						variant: 'alert',
						alert: {
							color: 'error'
						},
						close: false,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						}
					})
				);
			}
		}
		currentFocus(5);
	};

	return (
		<MainCard content={false} tabIndex={-1}>
			<FormContainer formContext={formContext}>
				<ReactDataGrid
					handle={setGridRef}
					idProperty="seq_no"
					nativeScroll={true}
					style={gridStyle}
					keyPageStep={0}
					activeCell={activeCell}
					onActiveCellChange={setActiveCell}
					onKeyDown={onKeyDown}
					onEditComplete={onEditComplete}
					onEditStart={onEditStart}
					onEditStop={onEditStop}
					editable={true}
					columns={columns}
					onFocus={onFocus}
					dataSource={dataSource}
					rowHeight={21}
					headerHeight={30}
					showZebraRows={false}
					groups={groups.map(group => ({
						name: group.name,
						header: (
							<span
								key={group.name}
								style={{
									display: 'flex',
									justifyContent: 'center'
								}}>
								{group.header}
							</span>
						)
					}))}
					summaryReducer={summaryReducer}
					footerRows={footerRows}
					showColumnMenuTool={false}
				/>
				<button type="submit" hidden />
			</FormContainer>
		</MainCard>
	);
};

export default TenderlotPlanning;
