/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react'; // useRef,
import { useForm } from 'react-hook-form';
// import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
// import { EditOutlined } from '@ant-design/icons';
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import MainCard from '@components/MainCard';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import { AutocompleteEditor, DatePickerEditor, TextFieldEditor } from '@components/table/editors';
import { FormSchema, IFormInput } from '@pages/master/packetcreation/models/packetDetail';
import { usePacketcreationsSlice } from '@pages/master/packetcreation/store/slice';
import { packetcreationsSelector } from '@pages/master/packetcreation/store/slice/packetcreations.selectors';
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
import { useLabsSlice } from '@pages/master/labs/store/slice';
import { labsSelector } from '@pages/master/labs/store/slice/labs.selectors';

import {
	InitialQueryParam,
	InitialState,
	// ObjecttoQueryString,
	onTableKeyDown,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';

import '@inovua/reactdatagrid-community/index.css';
import './PacketCreation';
import dayjs from 'dayjs';

const gridStyle = { minHeight: 400 };
let inEdit: boolean;
let newRowDataSource: any;
let initialFocus = false;

const initParams = {
	page: 1,
	limit: 10000,
	pagination: 'true'
} as InitialQueryParam;
console.log(initParams);

// ==============================|| PACKETCREATION ||============================== //

interface Props {
	passProps?: any;
	selectedData?: any | null;
	packetCreationOptions?: any;
	currentAction?: any;
	editMode?: any;
	diaSeq?: any;
}

const PacketCreationDetail = ({
	passProps,
	packetCreationOptions,
	currentAction,
	editMode,
	diaSeq
}: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();
	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});
	const confirm = useConfirm();
	const [gridRef, setGridRef] = useState<any>(null);
	// const refPage = useHotkeys<any>('alt+s', () => buttonRef.current.click());

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>([]);
	const [activeCell, setActiveCell] = useState<any>([1, 0]);
	const [groups, setGroups] = useState<any>([]);
	// add your Slice Action  👿
	const { actions: packetcreationsActions } = usePacketcreationsSlice();
	const { actions: shapesActions } = useShapesSlice();
	const { actions: colorsActions } = useColorsSlice();
	const { actions: puritiesActions } = usePuritiesSlice();
	const { actions: flssActions } = useFlssSlice();
	const { actions: cutsActions } = useCutsSlice();
	const { actions: polishsActions } = usePolishsSlice();
	const { actions: symmsActions } = useSymmsSlice();
	const { actions: labsActions } = useLabsSlice();

	const { actions } = useSnackBarSlice();
	// *** PACKETCREATION State *** //
	const packetcreationsState = useSelector(packetcreationsSelector);
	const { getSuccess, getColumnsSettingSuccess, getTensionSuccess } = packetcreationsState;
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
	const { getSuccess: getFlsSuccess, getSuccess: getMachineFlsSuccess } = flsState;

	// *** Cuts State *** //
	const cutState = useSelector(cutsSelector);
	const { getSuccess: getCutSuccess } = cutState;

	// *** Polishs State *** //
	const polishState = useSelector(polishsSelector);
	const { getSuccess: getPolishSuccess } = polishState;

	// *** Symms State *** //
	const symmState = useSelector(symmsSelector);
	const { getSuccess: getSymmSuccess } = symmState;

	// *** Symms State *** //
	const labState = useSelector(labsSelector);
	const { getSuccess: getLabSuccess } = labState;

	const { addError } = packetcreationsState;

	// // add your refrence  👿
	// const buttonRef = useRef<any>(null);

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		// formState: { isSubmitting },
		reset
	} = formContext;

	const footerRows = [
		{
			render: {
				packet_no: <b>Total</b>,
				pcs: ({ summary }: any) => (
					<div>
						<b>{summary.pcs}</b>
					</div>
				),
				wgt: ({ summary }: any) => (
					<div>
						<b>{summary.wgt}</b>
					</div>
				),
				exp_wgt: ({ summary }: any) => (
					<div>
						<b>{summary.exp_wgt}</b>
					</div>
				)
			}
		}
	];

	const summaryReducer = {
		initialValue: { wgt: 0, pcs: 0, exp_wgt: 0 },
		reducer: (acc: any, item: any) => ({
			wgt: acc.wgt + (item.wgt || 0),
			pcs: acc.pcs + (item.pcs || 0),
			exp_wgt: acc.exp_wgt + (item.exp_wgt || 0)
		})
	};

	// //get columns
	// const getColumns = () => {
	// 	return [
	// 		{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
	// 		{
	// 			name: 'sr_no',
	// 			header: 'Sr',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 10,
	// 			maxWidth: 30,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <TextFieldEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				type: 'number'
	// 			},
	// 			editable: false
	// 		},
	// 		{
	// 			name: 'packet_no',
	// 			header: 'Packet No',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 40,
	// 			maxWidth: 80,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <TextFieldEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				type: 'number'
	// 			}
	// 		},
	// 		{
	// 			name: 'rfid_no',
	// 			header: 'RFID No',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 40,
	// 			maxWidth: 80,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <TextFieldEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				type: 'number'
	// 			}
	// 		},
	// 		{
	// 			name: 'pcs',
	// 			header: 'Pieces',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 30,
	// 			maxWidth: 60,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <TextFieldEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				type: 'number'
	// 			},
	// 			render: ({ data }: any) => {
	// 				let netAmt = parseFloat(data.pol_size);
	// 				if (!isNaN(netAmt)) {
	// 					let result = netAmt.toFixed(2);
	// 					return <Typography>{String(result)}</Typography>;
	// 				} else {
	// 					return <Typography>{''}</Typography>;
	// 				}
	// 			}
	// 		},
	// 		{
	// 			name: 'wgt',
	// 			header: 'Weight',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 20,
	// 			maxWidth: 50,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <TextFieldEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				type: 'number'
	// 			},
	// 			render: ({ data }: any) => {
	// 				let weight = parseFloat(data.wgt);
	// 				if (!isNaN(weight)) {
	// 					let result = weight.toFixed(2);
	// 					return <Typography>{String(result)}</Typography>;
	// 				} else {
	// 					return <Typography>{''}</Typography>;
	// 				}
	// 			}
	// 		},
	// 		{
	// 			name: 'exp_wgt',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 40,
	// 			maxWidth: 70,
	// 			sortable: false,
	// 			renderHeader: (params: any) => {
	// 				return (
	// 					<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
	// 						Exp
	// 						<br />
	// 						Weight
	// 					</div>
	// 				);
	// 			},
	// 			renderEditor: (editorProps: any) => {
	// 				return <TextFieldEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				type: 'number'
	// 			}
	// 		},
	// 		{
	// 			name: 'shape',
	// 			header: 'Shape',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 30,
	// 			maxWidth: 75,
	// 			addInHidden: true,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return (
	// 					<AutocompleteEditor
	// 						key={'countrydemo' + Math.floor(Math.random() * 100 + 10000)}
	// 						{...editorProps}
	// 					/>
	// 				);
	// 			},
	// 			onEditComplete: (selected: any, allConfig: any) => {
	// 				allConfig.editorProps.dataSource = [];
	// 			},
	// 			editorProps: {
	// 				idProperty: 'seq_no',
	// 				dataSource: [],
	// 				collapseOnSelect: true,
	// 				clearIcon: null
	// 			},
	// 			render: ({ data, value }: any) => {
	// 				return (
	// 					<Typography>
	// 						{data && data.shape && data.shape.name ? data.shape.name : ''}
	// 					</Typography>
	// 				);
	// 			}
	// 		},
	// 		{
	// 			name: 'color',
	// 			header: 'Col',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 30,
	// 			maxWidth: 50,
	// 			addInHidden: true,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <AutocompleteEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				idProperty: 'seq_no',
	// 				dataSource: [],
	// 				collapseOnSelect: true,
	// 				clearIcon: null
	// 			},
	// 			render: ({ data, value }: any) => {
	// 				return (
	// 					<Typography>
	// 						{data && data.color && data.color.name ? data.color.name : ''}
	// 					</Typography>
	// 				);
	// 			}
	// 		},
	// 		{
	// 			name: 'purity',
	// 			header: 'Pur',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 30,
	// 			maxWidth: 50,
	// 			addInHidden: true,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <AutocompleteEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				idProperty: 'seq_no',
	// 				dataSource: [],
	// 				collapseOnSelect: true,
	// 				clearIcon: null
	// 			},
	// 			render: ({ data, value }: any) => {
	// 				return (
	// 					<Typography>
	// 						{data && data.purity && data.purity.name ? data.purity.name : ''}
	// 					</Typography>
	// 				);
	// 			}
	// 		},
	// 		{
	// 			name: 'cut',
	// 			header: 'Cut',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 30,
	// 			maxWidth: 40,
	// 			addInHidden: true,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <AutocompleteEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				idProperty: 'seq_no',
	// 				dataSource: [],
	// 				collapseOnSelect: true,
	// 				clearIcon: null
	// 			},
	// 			render: ({ data, value }: any) => {
	// 				return (
	// 					<Typography>
	// 						{data && data.cut && data.cut.name ? data.cut.name : ''}
	// 					</Typography>
	// 				);
	// 			}
	// 		},
	// 		{
	// 			name: 'polish',
	// 			header: 'Pol',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 30,
	// 			maxWidth: 40,
	// 			addInHidden: true,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <AutocompleteEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				idProperty: 'seq_no',
	// 				dataSource: [],
	// 				collapseOnSelect: true,
	// 				clearIcon: null
	// 			},
	// 			render: ({ data, value }: any) => {
	// 				return (
	// 					<Typography>
	// 						{data && data.polish && data.polish.name ? data.polish.name : ''}
	// 					</Typography>
	// 				);
	// 			}
	// 		},
	// 		{
	// 			name: 'symm',
	// 			header: 'Sym',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 30,
	// 			maxWidth: 40,
	// 			addInHidden: true,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <AutocompleteEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				idProperty: 'seq_no',
	// 				dataSource: [],
	// 				collapseOnSelect: true,
	// 				clearIcon: null
	// 			},
	// 			render: ({ data, value }: any) => {
	// 				return (
	// 					<Typography>
	// 						{data && data.symm && data.symm.name ? data.symm.name : ''}
	// 					</Typography>
	// 				);
	// 			}
	// 		},
	// 		{
	// 			name: 'fls',
	// 			header: 'Fls',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 30,
	// 			maxWidth: 50,
	// 			addInHidden: true,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <AutocompleteEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				idProperty: 'seq_no',
	// 				dataSource: [],
	// 				collapseOnSelect: true,
	// 				clearIcon: null
	// 			},
	// 			render: ({ data, value }: any) => {
	// 				return (
	// 					<Typography>
	// 						{data && data.fls && data.fls.name ? data.fls.name : ''}
	// 					</Typography>
	// 				);
	// 			}
	// 		},
	// 		{
	// 			name: 'lab',
	// 			header: 'Lab',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 30,
	// 			maxWidth: 50,
	// 			addInHidden: true,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <AutocompleteEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				idProperty: 'seq_no',
	// 				dataSource: [],
	// 				collapseOnSelect: true,
	// 				clearIcon: null
	// 			},
	// 			render: ({ data, value }: any) => {
	// 				return (
	// 					<Typography>
	// 						{data && data.lab && data.lab.name ? data.lab.name : ''}
	// 					</Typography>
	// 				);
	// 			}
	// 		},
	// 		{
	// 			name: 'tension',
	// 			header: 'Tension',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 30,
	// 			maxWidth: 70,
	// 			addInHidden: true,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <AutocompleteEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				idProperty: 'seq_no',
	// 				dataSource: [],
	// 				collapseOnSelect: true,
	// 				clearIcon: null
	// 			},
	// 			render: ({ data, value }: any) => {
	// 				return (
	// 					<Typography>
	// 						{data && data.tension && data.tension.name ? data.tension.name : ''}
	// 					</Typography>
	// 				);
	// 			}
	// 		},
	// 		{
	// 			name: 'machine_color',
	// 			// header: 'Machine Color',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 30,
	// 			maxWidth: 75,
	// 			addInHidden: true,
	// 			sortable: false,
	// 			renderHeader: (params: any) => {
	// 				return (
	// 					<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
	// 						Machine
	// 						<br />
	// 						Color
	// 					</div>
	// 				);
	// 			},
	// 			renderEditor: (editorProps: any) => {
	// 				return <AutocompleteEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				idProperty: 'seq_no',
	// 				dataSource: [],
	// 				collapseOnSelect: true,
	// 				clearIcon: null
	// 			},
	// 			render: ({ data, value }: any) => {
	// 				return (
	// 					<Typography>
	// 						{data && data.machine_color && data.machine_color.name
	// 							? data.machine_color.name
	// 							: ''}
	// 					</Typography>
	// 				);
	// 			}
	// 		},
	// 		{
	// 			name: 'machine_fls',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 40,
	// 			maxWidth: 80,
	// 			sortable: false,
	// 			renderHeader: (params: any) => {
	// 				return (
	// 					<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
	// 						Machine
	// 						<br />
	// 						Fls
	// 					</div>
	// 				);
	// 			},
	// 			renderEditor: (editorProps: any) => {
	// 				return <AutocompleteEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				type: 'text'
	// 			},
	// 			render: ({ data, value }: any) => {
	// 				return (
	// 					<Typography>
	// 						{data && data.machine_fls && data.machine_fls.name
	// 							? data.machine_fls.name
	// 							: ''}
	// 					</Typography>
	// 				);
	// 			}
	// 		},
	// 		{
	// 			name: 'target_rate',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 40,
	// 			maxWidth: 80,
	// 			sortable: false,
	// 			renderHeader: (params: any) => {
	// 				return (
	// 					<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
	// 						Target
	// 						<br />
	// 						Rate
	// 					</div>
	// 				);
	// 			},
	// 			renderEditor: (editorProps: any) => {
	// 				return <TextFieldEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				type: 'text'
	// 			}
	// 		},
	// 		{
	// 			name: 'comments',
	// 			header: 'Comments',
	// 			headerAlign: 'center',
	// 			textAlign: 'center',
	// 			minWidth: 40,
	// 			maxWidth: 120,
	// 			sortable: false,
	// 			renderEditor: (editorProps: any) => {
	// 				return <TextFieldEditor {...editorProps} />;
	// 			},
	// 			editorProps: {
	// 				type: 'text'
	// 			}
	// 		},

	// 		{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
	// 	];
	// };

	useEffect(() => {
		if (columns.length == 0) {
			const addUrl = 'Packet Creation';
			dispatch(
				packetcreationsActions.getColumnsSetting({ QueryParams: `'${addUrl}'/0/0/0` })
			);
			//setLoadHeader(false);
		}
	}, []);

	//GETCOLUMN FUNCTION AND GETSUCCESS FOR COLUMN SETTING

	const getColumns = async (columns: any) => {
		let arrColums = [];
		for (let index = 0; index < columns.length; index++) {
			const element = columns[index];

			const column = {
				...element,
				...(element.renderEditor &&
					element.renderEditor === 'TextFieldEditor' && {
						renderEditor: (editorProps: any) => {
							return <TextFieldEditor {...editorProps} />;
						}
					}),
				...(element.render &&
					(element.render === 'N0' ||
						element.render === 'N1' ||
						element.render === 'N2' ||
						element.render === 'N3' ||
						element.render === 'N4') && {
						render: ({ data }: any) => {
							return (
								<Typography align="center">
									{data && data[element.name]
										? parseFloat(data[element.name]).toFixed(
												element.render.split('N')[1]
										  )
										: null}
								</Typography>
							);
						}
					}),
				...(element.renderEditor &&
					element.renderEditor === 'DatePickerEditor' && {
						renderEditor: (editorProps: any) => {
							return <DatePickerEditor {...editorProps} />;
						}
					}),
				...(element.render &&
					element.render === 'DD-MM-YYYY' && {
						render: ({ data, value }: any) => {
							return (
								<Typography align="center">
									{data && data.element && data.element
										? dayjs(data.element).format('DD-MM-YYYY')
										: value
										? dayjs(value).format('DD-MM-YYYY')
										: ''}
								</Typography>
							);
						}
					}),
				...(element.renderEditor &&
					element.renderEditor === 'AutocompleteEditor' && {
						renderEditor: (editorProps: any) => {
							return <AutocompleteEditor {...editorProps} />;
						}
					}),
				...(element.render &&
					element.render === 'AutoComplete' && {
						render: ({ data }: any) => {
							return data &&
								data[element.name] &&
								data[element.name][element.display_member]
								? data[element.name][element.display_member]
								: '';
						}
					}),
				...(element.renderHeader &&
					element.renderHeader !== '' && {
						renderHeader: (params: any) => {
							return (
								<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
									{element.renderHeader}
								</div>
							);
						}
					})
			};

			arrColums.push(column);
		}
		setColumns(arrColums);
	};
	/**GRT GRUOP FUNCTION FOR CREATE GROUP**/
	const getGroups = async (columns: any) => {
		let arrColums = [];
		for (let index = 0; index < columns.length; index++) {
			const element = columns[index];

			const group = {
				...element,
				...(element.header && {
					header: (
						<span
							style={{
								color: '#ff595e',
								fontWeight: 'bold',
								display: 'flex',
								justifyContent: 'center',
								height: '15px'
							}}>
							{element.header}
						</span>
					)
				})
			};

			arrColums.push(group);
		}

		setGroups(arrColums);
	};
	useEffect(() => {
		if (getColumnsSettingSuccess) {
			if (
				!getColumnsSettingSuccess?.columnType ||
				getColumnsSettingSuccess?.columnType === null
			) {
				if (getColumnsSettingSuccess) {
					if (getColumnsSettingSuccess?.columns != null) {
						getColumns(getColumnsSettingSuccess?.columns);
					} else {
						setColumns([]);
					}

					if (getColumnsSettingSuccess?.groups != null) {
						getGroups(getColumnsSettingSuccess?.groups);
					} else {
						setGroups([]);
					}
				} else {
					setColumns([]);
					setGroups([]);
				}

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
				fetchDataByColumnName({ colName: 'lab' });

				setTimeout(() => {
					fetchDataByColumnName({ colName: 'machine_color' });
					fetchDataByColumnName({ colName: 'machine_fls' });
				}, 1000);
			}
		}
		// setLoading(false);
	}, [getColumnsSettingSuccess]);

	// *** REDUCER *** //

	useEffect(() => {
		if (
			currentAction &&
			(currentAction === 'Add' ||
				currentAction === 'Save' ||
				currentAction === 'Cancel' ||
				currentAction === 'View' ||
				currentAction === 'View1')
		) {
			reset({
				arr: [{ name: null }] as any
			});
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});
			setDataSource([]);
		}
	}, [currentAction]);

	useEffect(() => {
		// *** set state for api
		if (packetCreationOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: packetCreationOptions
				}
			}));
			setDataSource(packetCreationOptions);
		}
	}, [packetCreationOptions]);

	useEffect(() => {
		newRowDataSource = dataSource;
		passProps(newRowDataSource);
	}, [dataSource]);

	useEffect(() => {
		if (gridRef && !initialFocus) {
			requestAnimationFrame(() => {
				initialFocus = true;
				gridRef.current.focus();
			});
		}
	}, [gridRef]);

	useEffect(() => {
		if (addError) {
			const message = addError && addError.error ? addError.error.errors[0] : '';
			dispatch(
				actions.openSnackbar({
					open: true,
					message: message,
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
	}, [addError]);

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
		setConfigForGetLabSuccess(getLabSuccess);
	}, [getLabSuccess]);

	// *** SYMM *** //
	const setConfigForGetLabSuccess = (getSymmSuccess: any) => {
		if (getSymmSuccess) {
			if (getSymmSuccess?.results) {
				if (getSymmSuccess?.columnType === 'lab') {
					let symmData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'lab'
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

	const onSubmit = async () => {
		/* empty */
	};

	// *** EVENT HANDDLERS  👿

	// Editable React data table
	const onEditStart = () => {
		inEdit = true;
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
			} else if (edited.colName === 'machine_fls') {
				dispatch(flssActions.reset());

				dispatch(
					flssActions.get({
						QueryParams: 'page=1&limit=500&pagination=false&columnType=machine_fls'
					})
				);
			} else if (edited.colName === 'lab') {
				dispatch(labsActions.reset());

				dispatch(
					labsActions.get({
						QueryParams: 'page=1&limit=500&pagination=false&columnType=lab'
					})
				);
			} else if (edited.colName === 'tension') {
				dispatch(packetcreationsActions.reset());
				dispatch(packetcreationsActions.getTension('TENSION'));
			}
		}
	};

	const onKeyDown = async (event: any) => {
		const edited = await onTableKeyDown(event, inEdit, gridRef);
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
					description: 'Are you sure delete packet ?',
					confirmationButtonProps: { autoFocus: true },
					confirmationText: 'Yes',
					cancellationText: 'No'
				})
					.then(() => {
						const stateArr = deleteRow(pageState, 'seq_no', data, rowIndex);
						return stateArr;
					})
					.then(stateArr => {
						setPageState(value => ({
							...value,
							values: {
								...pageState.values,
								para: stateArr
							}
						}));

						data.splice(rowIndex, 1);
						setDataSource(data);
					})
					.catch(() => {
						/* */
					});
			}

			if (event.key === 'Insert' || (event.key === 'Enter' && rowIndex === rowCount - 1)) {
				let isLastEditableColumn = false;
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
				// debugger;

				const { insertNew, data, stateArr } = await insertNewRow(
					pageState, // State for track row insert, update or delete
					FormSchema, // for validation
					newRowDataSource, // table data
					rowIndex, // row number
					isLastEditableColumn,
					event.key,
					{ sr_no: rowCount + 1, det_seq: diaSeq + rowCount }
				);

				event.preventDefault();

				if (insertNew) {
					// *** set table with new data
					setDataSource(data);

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
					setTimeout(() => {
						const column = grid.getColumnBy(1);
						grid.startEdit({ columnId: column.name, rowIndex: data.length - 1 });
					}, 0);
				}
			}
		}
	};

	const onEditComplete = useCallback(
		async ({ value, columnId, rowIndex }: any) => {
			if (value === '' || value || typeof value === 'boolean') {
				if (typeof value === 'string') {
					value = value.trim();
				}

				const { stateArr, data } = await prepareOnEditComplete(
					columns,
					dataSource,
					value,
					columnId,
					rowIndex,
					pageState,
					'seq_no'
				);
				// Add rows to in pageState
				console.log(data);

				setPageState(value => ({
					...value,
					values: {
						...pageState.values,
						para: stateArr
					}
				}));

				setDataSource(stateArr);
			}
		},
		[dataSource]
	);

	// ref={refPage as any} tabIndex={-1}

	return (
		<>
			<MainCard content={false}>
				<FormContainer
					onSuccess={() => onSubmit()}
					formContext={formContext}
					FormProps={{ autoComplete: 'off' }}>
					<MainCard content={false} tabIndex="0">
						<ReactDataGrid
							handle={setGridRef}
							idProperty="seq_no"
							nativeScroll={true}
							style={gridStyle}
							columns={columns}
							dataSource={dataSource}
							editable={editMode}
							activeCell={activeCell}
							onActiveCellChange={setActiveCell}
							onEditStart={onEditStart}
							onEditStop={onEditStop}
							onKeyDown={onKeyDown}
							onEditComplete={onEditComplete}
							summaryReducer={summaryReducer}
							footerRows={footerRows}
							rowHeight={21}
							headerHeight={22}
							showColumnMenuTool={false}
						/>
					</MainCard>
					<button type="submit" hidden />
				</FormContainer>
			</MainCard>
		</>
	);
};

export default PacketCreationDetail;
