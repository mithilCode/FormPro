/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Stack, Typography } from '@mui/material';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { FormSchema, IFormInput } from '@pages/master/tenderView/models/TenderView3';
import { AutocompleteEditor, CheckBoxEditor, TextFieldEditor } from '@components/table/editors';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useTenderlotplansSlice } from '@pages/master/tenderlotplan/store/slice';
import TenderViewColorwise from './TenderLotViewColorwise';
import TenderViewPuritywise from './TenderLotViewPuritywise';
import { tenderlotplansSelector } from '@pages/master/tenderlotplan/store/slice/tenderlotplans.selectors';

import {
	//InitialQueryParam,
	InitialState
} from '@utils/helpers';
import '@inovua/reactdatagrid-community/index.css';
import { Checkbox } from '@mui/material';

const gridStyle = { minHeight: 250 };
let newRowDataSource: any;

// ==============================|| TENDER LOT PLAN COMMENTS ||============================== //

interface Props {
	passProps?: any;
	tenderLotSeq?: any;
	CommemtsOptions?: any;
	currentAction?: any;
	editMode?: any;
	viewPlanningOptions?: any;
}

const TenderViewPlanning = ({
	passProps,
	CommemtsOptions,
	tenderLotSeq,
	currentAction,
	editMode,
	viewPlanningOptions
}: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// *** Tenderlotplans State *** //
	const { actions: tenderlotplansActions } = useTenderlotplansSlice();
	const tenderlotplansState = useSelector(tenderlotplansSelector);
	const { getOnePlanningSuccess } = tenderlotplansState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const { reset } = formContext;

	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			// {
			// 	name: 'plan_no',
			// 	minWidth: 30,
			// 	maxWidth: 50,
			// 	sortable: false,
			// 	headerAlign: 'center',
			// 	textAlign: 'center',
			// 	renderHeader: (params: any) => {
			// 		return (
			// 			<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
			// 				Plan
			// 				<br />
			// 				No
			// 			</div>
			// 		);
			// 	}
			// },
			{
				name: 'final',
				header: 'Final',
				group: 'plan',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 20,
				maxWidth: 40,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <CheckBoxEditor {...editorProps} />;
				},
				render: ({ value }: any) => {
					return <Checkbox checked={value} style={{ backgroundColor: 'transparent' }} />;
				}
				// rowspan: ({ value, dataSourceArray, rowIndex, column }: any) => {
				// 	let rowspan = 1;
				// 	const prevData = dataSourceArray[rowIndex];
				// 	let currentRowIndex = rowIndex + 1;
				// 	while (
				// 		dataSourceArray[currentRowIndex] &&
				// 		dataSourceArray[currentRowIndex]['plan_no']?.toString() ===
				// 			prevData['plan_no']?.toString()
				// 	) {
				// 		rowspan++;
				// 		currentRowIndex++;
				// 		if (rowspan > 9) {
				// 			break;
				// 		}
				// 	}
				// 	return rowspan;
				// }
			},
			{
				name: 'plan_no',
				header: 'No',
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
				header: 'Pcs',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 40,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				}
			},
			{
				name: 'pol_wgt',
				header: 'Wgt',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 40,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				render: ({ data }: any) => {
					let weight = parseFloat(data.pol_wgt);
					let result = weight.toFixed(2);
					if (!isNaN(weight)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				},
				editorProps: {
					type: 'number'
				}
			},
			{
				name: 'pol_size',
				header: 'Size',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
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
				name: 'shape',
				header: 'Shape',
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
							{data && data.shape && data.shape.name ? data.shape.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'color',
				header: 'Col',
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
				header: 'Pur',
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
				header: 'Cut',
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
				header: 'Pol',
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
				header: 'Sym',
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
				header: 'Fls',
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
				headerAlign: 'center',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 45,
				sortable: false,
				editable: false,
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Disc
							<br />%
						</div>
					);
				},
				editorProps: {
					type: 'text'
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
				render: ({ data, value }: any) => {
					let tmpRate = parseFloat(data.rate);
					let tmpDiscPer = parseFloat(data.disc_per);
					let tmpAddDiscPer = parseFloat(data.add_disc_per);

					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(tmpRate) && !isNaN(tmpDiscPer)) {
						let result = (
							tmpRate -
							(tmpRate * (tmpDiscPer + (tmpAddDiscPer || 0))) / 100
						).toFixed(0);
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
				render: ({ data, value }: any) => {
					let tmpRate = parseFloat(data.rate);
					let tmpDiscPer = parseFloat(data.disc_per);
					let tmpAddDiscPer = parseFloat(data.add_disc_per);
					let tmpPolSize = parseFloat(data.pol_size);

					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(tmpRate) && !isNaN(tmpDiscPer) && !isNaN(tmpPolSize)) {
						let result = (
							(tmpRate - (tmpRate * (tmpDiscPer + (tmpAddDiscPer || 0))) / 100) *
							tmpPolSize
						).toFixed(0);
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
				mminWidth: 40,
				maxWidth: 57,
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

					const prevData = dataSourceArray[rowIndex - 1];
					if (prevData && prevData[column.name] === value) {
						return rowspan;
					}
					let currentRowIndex = rowIndex + 1;
					while (
						dataSourceArray[currentRowIndex] &&
						dataSourceArray[currentRowIndex][column.name] === value
					) {
						rowspan++;
						currentRowIndex++;
						if (rowspan > 100) {
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

					const prevData = dataSourceArray[rowIndex - 1];
					if (prevData && prevData[column.name] === value) {
						return rowspan;
					}
					let currentRowIndex = rowIndex + 1;
					while (
						dataSourceArray[currentRowIndex] &&
						dataSourceArray[currentRowIndex][column.name] === value
					) {
						rowspan++;
						currentRowIndex++;
						if (rowspan > 100) {
							break;
						}
					}
					return rowspan;
				},
				editorProps: {
					type: 'number'
				}
			},
			{
				name: 'saleable_type',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 50,
				maxWidth: 70,
				sortable: false,
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Saleable
							<br />
							Type
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
			{ name: 'id', header: 'Id', defaultVisible: false, defaultWidth: 80 }
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
	const [columns] = useState<any>(getColumns());

	const [colorsDataOptions, setColorsDataOptions] = useState<any>([]);
	const [purityDataOptions, setPurityDataOptions] = useState<any>([]);

	useEffect(() => {
		return () => {
			dispatch(tenderlotplansActions.reset());
		};
	}, []);

	useEffect(() => {
		if (getOnePlanningSuccess) {
			if (getOnePlanningSuccess?.results) {
				setColorsDataOptions(getOnePlanningSuccess?.results.tender_plan_color_wise_summary);
				setPurityDataOptions(
					getOnePlanningSuccess?.results.tender_plan_purity_wise_summary
				);
			}
		}
	}, [getOnePlanningSuccess]);

	useEffect(() => {
		if (!getOnePlanningSuccess || !getOnePlanningSuccess.results) {
			return;
		}

		if (viewPlanningOptions !== getOnePlanningSuccess.results.tender_plan) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: getOnePlanningSuccess.results.tender_plan
				}
			}));
			setDataNewSource(getOnePlanningSuccess.results.tender_plan);
		}
	}, [getOnePlanningSuccess, viewPlanningOptions]);

	useEffect(() => {
		newRowDataSource = dataSource;
		passProps(newRowDataSource);
	}, [dataSource]);

	// const setDataNewSource = (dataSource: any) => {
	// 	const newDataSource = [...dataSource];
	// 	const dataArray = newDataSource.map(elem => {
	// 		let tmpRate = parseFloat(elem.rate);
	// 		let tmpDiscPer = parseFloat(elem.disc_per || 0);
	// 		let tmpAddDiscPer = parseFloat(elem.add_disc_per);
	// 		let tmpPolSize = parseFloat(elem.pol_size);
	// 		let result;
	// 		// Check if tmpwgt and tmppcs are valid numbers
	// 		if (!isNaN(tmpRate) && !isNaN(tmpDiscPer) && !isNaN(tmpPolSize)) {
	// 			result = (
	// 				(tmpRate - (tmpRate * (tmpDiscPer + (tmpAddDiscPer || 0))) / 100) *
	// 				tmpPolSize
	// 			).toFixed(2);
	// 		}
	// 		return Object.assign({}, elem, { net_value: result });
	// 	});

	// 	const netValuesums = dataArray.reduce((acc, item) => {
	// 		const plan_no = item.plan_no;
	// 		acc[plan_no] = (acc[plan_no] || 0) + parseFloat(item.net_value || 0);
	// 		return acc;
	// 	}, {});
	// 	const polWgtSums = dataArray.reduce((acc, item) => {
	// 		const plan_no = item.plan_no;
	// 		acc[plan_no] = (acc[plan_no] || 0) + parseFloat(item.pol_wgt || 0);
	// 		return acc;
	// 	}, {});
	// 	// Convert the object into an array

	// 	const netValuesumsArray = Object.entries(netValuesums).map(([plan_no, netValuesums]) => ({
	// 		plan_no,
	// 		netValuesums
	// 	}));
	// 	const polWgtSumsArray = Object.entries(polWgtSums).map(([plan_no, polWgtSums]) => ({
	// 		plan_no,
	// 		polWgtSums
	// 	}));
	// 	const newArray = dataArray.map((addelem: any) => {
	// 		netValuesumsArray.map(elem => {
	// 			if (addelem.plan_no == elem.plan_no) {
	// 				addelem.total_net_value = elem.netValuesums;
	// 			}
	// 		});
	// 		polWgtSumsArray.map(elem => {
	// 			if (addelem.plan_no == elem.plan_no) {
	// 				addelem.total_pol_wgt = elem.polWgtSums;
	// 			}
	// 		});
	// 		return Object.assign({}, addelem, {});
	// 	});
	// 	setDataSource(newArray);
	// };
	const setDataNewSource = (dataSource: any) => {
		const newDataSource = [...dataSource];

		const dataArray = newDataSource.map(elem => {
			let tmpRate = parseFloat(elem.rate);
			let tmpDiscPer = parseFloat(elem.disc_per || 0);
			let tmpAddDiscPer = parseFloat(elem.add_disc_per);
			let tmpPolSize = parseFloat(elem.pol_size);
			let result;
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
			if (planNo !== addelem.plan_no) {
				planNo = addelem.plan_no;
				final = addelem.final;
			}
			if (final && planNo == addelem.plan_no) {
				planNo = addelem.plan_no;
				addelem.final = final;
			} else {
				addelem.final = final;
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
			// if (addelem.final == true) {
			// 	finalPlansumm({
			// 		total_pol_wgt: addelem.total_pol_wgt,
			// 		total_net_value: addelem.total_net_value
			// 	});
			// }

			return Object.assign({}, addelem, {});
		});

		setDataSource(newArray);
	};
	const childColorProps = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				tender_plan_color_wise_summary: array
			}
		}));
	};

	const childPurityProps = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				tender_plan_purity_wise_summary: array
			}
		}));
	};

	return (
		<MainCard content={false} tabIndex={-1}>
			<FormContainer>
				<Grid container spacing={1}>
					<Grid item xs={6.4}>
						<Stack spacing={1}>
							<MainCard content={false} tabIndex="0">
								<ReactDataGrid
									idProperty="seq_no"
									nativeScroll={true}
									// style={gridStyle}
									editable={editMode}
									columns={columns}
									dataSource={dataSource}
									rowHeight={21}
									headerHeight={22}
									showColumnMenuTool={false}
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
								/>
							</MainCard>
						</Stack>
					</Grid>
					<Grid item xs={2.8}>
						<TenderViewColorwise
							passProps={childColorProps}
							colorsDataOptions={colorsDataOptions}
							tenderLotSeq={tenderLotSeq}
						/>
					</Grid>
					<Grid item xs={2.8}>
						<TenderViewPuritywise
							passProps={childPurityProps}
							purityDataOptions={purityDataOptions}
							tenderLotSeq={tenderLotSeq}
						/>
					</Grid>
				</Grid>
				<button type="submit" hidden />
			</FormContainer>
		</MainCard>
	);
};

export default TenderViewPlanning;
