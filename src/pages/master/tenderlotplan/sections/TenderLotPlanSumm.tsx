/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { Grid, Stack, Typography, Button } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { FormSchema, IFormInput } from '@pages/master/tenderlotplan/models/TenderLotPlanSumm';
import { AutocompleteEditor, TextFieldEditor } from '@components/table/editors';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useTenderlotplansSlice } from '@pages/master/tenderlotplan/store/slice';
import { useColorsSlice } from '@pages/master/colors/store/slice';
import { colorsSelector } from '@pages/master/colors/store/slice/colors.selectors';
import { usePuritiesSlice } from '@pages/master/purities/store/slice';
import { puritiesSelector } from '@pages/master/purities/store/slice/purities.selectors';
import { useFlssSlice } from '@pages/master/flss/store/slice';
import { flssSelector } from '@pages/master/flss/store/slice/flss.selectors';
import { useShapesSlice } from '@pages/master/shapes/store/slice';
import { shapesSelector } from '@pages/master/shapes/store/slice/shapes.selectors';
import { usePropSlice } from '@pages/master/props/store/slice';
import { propsSelector } from '@pages/master/props/store/slice/props.selectors';
import { tempDataStore } from './TenderLotPlan';
import { useSnackBarSlice } from '@app/store/slice/snackbar';

import {
	InitialState,
	onTableKeyDown,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';
import '@inovua/reactdatagrid-community/index.css';
import { tenderlotplansSelector } from '../store/slice/tenderlotplans.selectors';
import { json } from 'react-router';

const gridStyle = { minHeight: 200 };
let inEdit: boolean;
let newRowDataSource: any;
let newPageState: any;

// ==============================|| TENDER LOT PLAN COMMENTS ||============================== //

interface Props {
	passProps?: any;
	assortSeq?: string;
	tenderLotSeq?: any;
	summsOptions?: any;
	currentAction?: any;
	currentFocus?: any;
	editMode?: any;
	assortmentSumOptions?: any;
}

const TenderLotPlanSumms = ({
	passProps,
	summsOptions,
	assortSeq,
	tenderLotSeq,
	currentAction,
	currentFocus,
	editMode,
	assortmentSumOptions
}: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// *** Tenderlotplans State *** //
	const { actions: tenderlotplansActions } = useTenderlotplansSlice();
	const { actions: colorsActions } = useColorsSlice();
	const { actions: puritiesActions } = usePuritiesSlice();
	const { actions: flssActions } = useFlssSlice();
	const { actions: shapesActions } = useShapesSlice();
	const { actions: propsActions } = usePropSlice();
	const { actions } = useSnackBarSlice();

	const tenderlotplansState = useSelector(tenderlotplansSelector);
	const { getCheckerSuccess, getAssortSuccess, getSuccess, getAssortPlanSummSuccess } =
		tenderlotplansState;

	// *** Purities State *** //
	const puritieState = useSelector(puritiesSelector);
	const { getSuccess: getPuritySuccess } = puritieState;

	// *** Colors State *** //
	const colorState = useSelector(colorsSelector);
	const { getSuccess: getColorSuccess } = colorState;

	// *** Flss State *** //
	const flsState = useSelector(flssSelector);
	const { getSuccess: getFlsSuccess } = flsState;

	// *** Shapes State *** //
	const shapeState = useSelector(shapesSelector);
	const { getSuccess: getShapeSuccess } = shapeState;

	// *** Prop State *** //
	const propState = useSelector(propsSelector);
	const { getSuccess: getPropSuccess } = propState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		formState: { isSubmitting }
	} = formContext;

	const { tableRefSeq, tenderLotSummSeq } = useContext(tempDataStore);
	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'shape',
				header: 'Shape *',
				minWidth: 30,
				maxWidth: 70,
				addInHidden: false,
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
				name: 'pol_pcs',
				header: 'Pcs *',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 40,
				addInHidden: false,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				}
			},
			{
				name: 'pol_per',
				header: '%',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 40,
				addInHidden: false,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
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
				addInHidden: false,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let tmpsize = parseFloat(data.pol_size);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(tmpsize)) {
						let result = tmpsize.toFixed(2);
						return <Typography>{result}</Typography>;
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
				maxWidth: 40,
				sortable: false,
				editable: false,
				addInHidden: false,
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let tmpsize = parseFloat(data.pol_size);
					let tmppcs = parseFloat(data.pol_pcs);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(tmpsize) && !isNaN(tmppcs) && tmppcs !== 0) {
						let result = (tmpsize * tmppcs).toFixed(2);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'color_1',
				header: 'Col',
				group: '1',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.color_1 && data.color_1.name ? data.color_1.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'color_1_per',
				header: '%',
				group: '1',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let color_1_per = parseFloat(data.color_1_per);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(color_1_per)) {
						let result = color_1_per.toFixed(2);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'color_2',
				header: 'Col',
				group: '2',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.color_2 && data.color_2.name ? data.color_2.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'color_2_per',
				header: '%',
				group: '2',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let color_2_per = parseFloat(data.color_2_per);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(color_2_per)) {
						let result = color_2_per.toFixed(2);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'purity_1',
				header: 'Pur',
				group: '1',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.purity_1 && data.purity_1.name ? data.purity_1.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'purity_1_per',
				header: '%',
				group: '1',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let purity_1_per = parseFloat(data.purity_1_per);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(purity_1_per)) {
						let result = purity_1_per.toFixed(2);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'purity_2',
				header: 'Pur',
				group: '2',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.purity_2 && data.purity_2.name ? data.purity_2.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'purity_2_per',
				header: '%',
				group: '2',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let purity_2_per = parseFloat(data.purity_2_per);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(purity_2_per)) {
						let result = purity_2_per.toFixed(2);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'fls_1',
				header: 'Fls *',
				group: '1',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.fls_1 && data.fls_1.name ? data.fls_1.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'fls_1_pcs',
				header: 'Pcs',
				group: '1',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let fls_1_pcs = parseFloat(data.fls_1_pcs);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(fls_1_pcs)) {
						let result = fls_1_pcs.toFixed(0);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'fls_2',
				header: 'Fls',
				group: '2',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.fls_2 && data.fls_2.name ? data.fls_2.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'fls_2_pcs',
				header: 'Pcs',
				group: '2',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let fls_2_pcs = parseFloat(data.fls_2_pcs);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(fls_2_pcs)) {
						let result = fls_2_pcs.toFixed(0);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'fls_3',
				header: 'Fls',
				group: '3',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.fls_3 && data.fls_3.name ? data.fls_3.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'fls_3_pcs',
				header: 'Pcs',
				group: '3',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let fls_3_pcs = parseFloat(data.fls_3_pcs);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(fls_3_pcs)) {
						let result = fls_3_pcs.toFixed(0);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'prop',
				header: 'Prop *',
				sortable: false,
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
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
							{data && data.prop && data.prop.name ? data.prop.name : ''}
						</Typography>
					);
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
		{ name: 'pol', header: 'Pol' },
		{ name: '1', header: '1' },
		{ name: '2', header: '2' },
		{ name: '3', header: '3' }
	];

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());
	const [activeCell, setActiveCell] = useState<any>([0, 0]);
	const [focusActiveCell, setFocusActiveCell] = useState<any>(null);

	const generateButtonRef = useRef<any>(null);
	let refPage = [useHotkeys<any>('alt+g', () => generateButtonRef.current.click())];

	const confirm = useConfirm();
	const [gridRef, setGridRef] = useState<any>(null);

	useEffect(() => {
		return () => {
			dispatch(tenderlotplansActions.reset());
		};
	}, []);

	useEffect(() => {
		if (currentAction == 4) {
			const grid = gridRef.current;
			setActiveCell([0, 0]);
			setTimeout(() => {
				const column = grid.getColumnBy(0);
				grid.startEdit({ columnId: column.name, rowIndex: 0 });
			}, 10);
		}
	}, [currentAction]);

	useEffect(() => {
		if (summsOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: summsOptions
				}
			}));
			setActiveCell([0, 0]);
			tenderLotSummSeq(summsOptions[0]?.seq_no);
			//summsOptions
			setDataSource(summsOptions?.filter((e: any) => e.action !== 'delete'));
		}
	}, [summsOptions]);

	useEffect(() => {
		newRowDataSource = dataSource;
	}, [dataSource]);

	useEffect(() => {
		newPageState = pageState;
		passProps(
			newPageState.values?.para?.filter(
				(e: any) => e.shape != null && e.pol_size != null && e.pol_pcs != null
			)
		);
	}, [pageState]);

	useEffect(() => {
		if (newRowDataSource.length == 1 && focusActiveCell == 1) {
			setActiveCell([0, 0]);
			const grid = gridRef.current;
			setTimeout(() => {
				//const column = grid.getColumnBy(0);
				grid.startEdit({ columnId: 'shape', rowIndex: 0 });
			}, 0);
			setFocusActiveCell(null);
		}
	}, [focusActiveCell]);

	// *** COLOR *** //
	useEffect(() => {
		if (getColorSuccess) {
			if (getColorSuccess?.results) {
				if (getColorSuccess?.columnType === 'color_1') {
					let colorData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'color_1'
					);

					if (getColorSuccess?.results && getColorSuccess?.results.length > 0) {
						colorData = getColorSuccess?.results;
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
				} else if (getColorSuccess?.columnType === 'color_2') {
					let colorData = [];
					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'color_2'
					);

					if (getColorSuccess?.results && getColorSuccess?.results.length > 0) {
						colorData = getColorSuccess?.results;
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
	}, [getColorSuccess]);

	// *** PURITY *** //
	useEffect(() => {
		if (getPuritySuccess) {
			if (getPuritySuccess?.results) {
				if (getPuritySuccess?.columnType === 'purity_1') {
					let purityData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'purity_1'
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
				} else if (getPuritySuccess?.columnType === 'purity_2') {
					let purityData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'purity_2'
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
	}, [getPuritySuccess]);

	// *** SHAPE *** //
	useEffect(() => {
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
	}, [getShapeSuccess]);

	// *** FLS *** //
	useEffect(() => {
		if (getFlsSuccess) {
			if (getFlsSuccess?.results) {
				if (getFlsSuccess?.columnType === 'fls_1') {
					let flsData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'fls_1'
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
				} else if (getFlsSuccess?.columnType === 'fls_2') {
					let flsData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'fls_2'
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
				} else if (getFlsSuccess?.columnType === 'fls_3') {
					let flsData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'fls_3'
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
	}, [getFlsSuccess]);

	// *** PROP *** //
	useEffect(() => {
		if (getPropSuccess) {
			if (getPropSuccess?.results) {
				if (getPropSuccess?.columnType === 'prop') {
					let flsData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'prop'
					);

					if (getPropSuccess?.results && getPropSuccess?.results.length > 0) {
						flsData = getPropSuccess?.results;
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
	}, [getPropSuccess]);

	/*CHECKER DROPDOWN*/
	useEffect(() => {
		if (getCheckerSuccess) {
			if (getCheckerSuccess?.results) {
				if (getCheckerSuccess?.columnType === 'emp_1') {
					let Emp1Data = [];
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'emp_1'
					);

					if (getCheckerSuccess?.results && getCheckerSuccess?.results.length > 0) {
						Emp1Data = getCheckerSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: Emp1Data,
							collapseOnSelect: true,
							clearIcon: null
						};
						setColumns(updatedColumns);
					}
				}
			}
		}
	}, [getCheckerSuccess]);

	/*ASSORT TYPE*/
	useEffect(() => {
		if (getAssortSuccess) {
			let assortData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'tension'
			);

			if (getAssortSuccess?.results && getAssortSuccess?.results.length > 0) {
				assortData = getAssortSuccess?.results;
			}

			if (editorTypeColumnIndex !== -1) {
				updatedColumns[editorTypeColumnIndex].editorProps = {
					idProperty: 'seq_no',
					dataSource: assortData,
					collapseOnSelect: true,
					clearIcon: null
				};
				setColumns(updatedColumns);
			}
		}
	}, [getAssortSuccess]);

	/*ASSORT TYPE*/
	useEffect(() => {
		if (getAssortPlanSummSuccess) {
			if (getAssortPlanSummSuccess?.results) {
				assortmentSumOptions({
					assortSeq: assortSeq,
					data: getAssortPlanSummSuccess?.results?.tender_plan
				});
			}
		}
	}, [getAssortPlanSummSuccess]);

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

	const onKeyDown = async (event: any) => {
		const edited = await onTableKeyDown(event, inEdit, gridRef);
		if (
			tableRefSeq?.tenderLotAssortSeq &&
			(tableRefSeq?.tenderLotAssortSeq != 0 || tableRefSeq?.tenderLotAssortSeq > -1)
		) {
			if (edited && edited.colName === 'emp_1') {
				dispatch(
					tenderlotplansActions.getChecker({
						QueryParams: `columnType=emp_1&pagination=false&q=type='E'`
					})
				);
			}
			if (edited && edited.colName === 'tension') {
				dispatch(tenderlotplansActions.reset());

				dispatch(tenderlotplansActions.getAssort('ASSORT_TYPE'));
			}
			if (edited && edited.colName === 'color_1') {
				dispatch(colorsActions.reset());

				dispatch(
					colorsActions.get({
						QueryParams:
							edited.input.length !== 0
								? `columnType=color_1&limit=10&q=` + edited.input
								: `columnType=color_1&limit=10`
					})
				);
			}
			if (edited && edited.colName === 'color_2') {
				dispatch(colorsActions.reset());

				dispatch(
					colorsActions.get({
						QueryParams:
							edited.input.length !== 0
								? `columnType=color_2&limit=10&q=` + edited.input
								: `columnType=color_2&limit=10`
					})
				);
			}
			if (edited && edited.colName === 'purity_1') {
				dispatch(puritiesActions.reset());

				dispatch(
					puritiesActions.get({
						QueryParams:
							edited.input.length !== 0
								? `columnType=purity_1&limit=10&q=` + edited.input
								: `columnType=purity_1&limit=10`
					})
				);
			}
			if (edited && edited.colName === 'purity_2') {
				dispatch(puritiesActions.reset());

				dispatch(
					puritiesActions.get({
						QueryParams:
							edited.input.length !== 0
								? `columnType=purity_2&limit=10&q=` + edited.input
								: `columnType=purity_2&limit=10`
					})
				);
			}
			if (edited && edited.colName === 'shape') {
				dispatch(shapesActions.reset());

				dispatch(
					shapesActions.get({
						QueryParams:
							edited.input.length !== 0
								? `columnType=shape&limit=10&q=` + edited.input
								: `columnType=shape&limit=10`
					})
				);
			}
			if (edited && edited.colName === 'fls_1') {
				dispatch(flssActions.reset());

				dispatch(
					flssActions.get({
						QueryParams:
							edited.input.length !== 0
								? `columnType=fls_1&limit=10&q=` + edited.input
								: `columnType=fls_1&limit=10`
					})
				);
			}
			if (edited && edited.colName === 'fls_2') {
				dispatch(flssActions.reset());

				dispatch(
					flssActions.get({
						QueryParams:
							edited.input.length !== 0
								? `columnType=fls_2&limit=10&q=` + edited.input
								: `columnType=fls_2&limit=10`
					})
				);
			}
			if (edited && edited.colName === 'fls_3') {
				dispatch(flssActions.reset());

				dispatch(
					flssActions.get({
						QueryParams:
							edited.input.length !== 0
								? `columnType=fls_3&limit=10&q=` + edited.input
								: `columnType=fls_3&limit=10`
					})
				);
			}
			if (edited && edited.colName === 'prop') {
				dispatch(propsActions.reset());

				dispatch(
					propsActions.get({
						QueryParams:
							edited.input.length !== 0
								? `columnType=prop&limit=10&q=` + edited.input
								: `columnType=prop&limit=10`
					})
				);
			}

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
						description: 'Are you sure delete summary ?',
						cancellationButtonProps: { autoFocus: true },
						confirmationText: 'Yes',
						cancellationText: 'No'
					})
						.then(() => {
							let stateArr: any;
							if (
								pageState.values.para[rowIndex] &&
								pageState.values.para[rowIndex].seq_no < -1 &&
								pageState.values.para[rowIndex].shape != null &&
								pageState.values.para[rowIndex].pol_size != null &&
								pageState.values.para[rowIndex].pol_pcs != null
							) {
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
									para: stateArr
								}
							}));
							data.splice(rowIndex, 1);
							setDataSource(data.filter((e: any) => e.action !== 'delete'));
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
							tender_lot_assort_seq: tableRefSeq?.tenderLotAssortSeq,
							tender_lot_det_seq: tableRefSeq?.lotSeq
						}
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
						setActiveCell([data.length - 1, 0]);
						setTimeout(() => {
							const column = grid.getColumnBy(0);
							grid.startEdit({ columnId: column.name, rowIndex: data.length - 1 });
						}, 0);
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
				}

				let aa = columns.filter((e: any) => e.name === columnId)[0].editorProps.type;
				if (aa == 'number' && value != '') {
					value = parseFloat(value);
				}
				if (aa == 'number' && value == '') {
					value = parseFloat('0');
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
				const grid = gridRef.current;
				const colIndex = columns.findIndex(function (clm: any) {
					return clm.name === columnId;
				});
				let setColIndex = colIndex + 3;
				let dd = [...data];
				if (columnId == 'color_1_per') {
					if (value == 100) {
						setTimeout(() => {
							setActiveCell([rowIndex, setColIndex - 1]);
							grid.startEdit({ columnId: columns[setColIndex].name, rowIndex });
						}, 0);
						stateArr[rowIndex].color_2_per = null;
						stateArr[rowIndex].color_2 = null;
						dd[rowIndex].color_2_per = null;
						dd[rowIndex].color_2 = null;
					} else {
						stateArr[rowIndex].color_2_per = 100 - value;
						dd[rowIndex].color_2_per = 100 - value;
					}
				}
				if (columnId == 'purity_1_per') {
					if (value == 100) {
						setTimeout(() => {
							setActiveCell([rowIndex, setColIndex - 1]);
							grid.startEdit({ columnId: columns[setColIndex].name, rowIndex });
						}, 0);
						stateArr[rowIndex].purity_2_per = null;
						stateArr[rowIndex].purity_2 = null;
						dd[rowIndex].purity_2_per = null;
						dd[rowIndex].purity_2 = null;
					} else {
						stateArr[rowIndex].purity_2_per = 100 - value;
						dd[rowIndex].purity_2_per = 100 - value;
					}
				}
				const defaultFls = { seq_no: 1, name: 'NONE' };
				if (columnId == 'pol_pcs') {
					stateArr[rowIndex].fls_1 = defaultFls;
					stateArr[rowIndex].fls_1_pcs = value;
					dd[rowIndex].fls_1 = defaultFls;
					dd[rowIndex].fls_1_pcs = value;

					stateArr[rowIndex].fls_2 = null;
					stateArr[rowIndex].fls_2_pcs = null;
					dd[rowIndex].fls_2 = null;
					dd[rowIndex].fls_2_pcs = null;

					stateArr[rowIndex].fls_3 = null;
					stateArr[rowIndex].fls_3_pcs = null;
					dd[rowIndex].fls_3 = null;
					dd[rowIndex].fls_3_pcs = null;
				}
				if (columnId == 'fls_1_pcs') {
					if (
						stateArr[rowIndex].pol_pcs != value &&
						value <= stateArr[rowIndex].pol_pcs
					) {
						stateArr[rowIndex].fls_2 = defaultFls;
						dd[rowIndex].fls_2 = defaultFls;
						dd[rowIndex].fls_2_pcs = stateArr[rowIndex].pol_pcs - value;
						stateArr[rowIndex].fls_2_pcs = stateArr[rowIndex].pol_pcs - value;

						stateArr[rowIndex].fls_3 = null;
						stateArr[rowIndex].fls_3_pcs = null;
						dd[rowIndex].fls_3 = null;
						dd[rowIndex].fls_3_pcs = null;
					} else {
						if (value >= stateArr[rowIndex].pol_pcs) {
							stateArr[rowIndex].fls_1 = defaultFls;
							dd[rowIndex].fls_1 = defaultFls;
							dd[rowIndex].fls_1_pcs = stateArr[rowIndex].pol_pcs;
							stateArr[rowIndex].fls_1_pcs = stateArr[rowIndex].pol_pcs;
						}
						stateArr[rowIndex].fls_2 = null;
						stateArr[rowIndex].fls_2_pcs = null;
						dd[rowIndex].fls_2 = null;
						dd[rowIndex].fls_2_pcs = null;

						stateArr[rowIndex].fls_3 = null;
						stateArr[rowIndex].fls_3_pcs = null;
						dd[rowIndex].fls_3 = null;
						dd[rowIndex].fls_3_pcs = null;
					}
				}
				if (columnId == 'fls_2_pcs') {
					if (stateArr[rowIndex].fls_1_pcs == stateArr[rowIndex].pol_pcs) {
						stateArr[rowIndex].fls_2 = null;
						stateArr[rowIndex].fls_2_pcs = null;
						dd[rowIndex].fls_2 = null;
						dd[rowIndex].fls_2_pcs = null;
					} else {
						if (
							stateArr[rowIndex].pol_pcs != value + stateArr[rowIndex].fls_1_pcs &&
							value + stateArr[rowIndex].fls_1_pcs < stateArr[rowIndex].pol_pcs
						) {
							stateArr[rowIndex].fls_3 = defaultFls;
							stateArr[rowIndex].fls_3_pcs =
								stateArr[rowIndex].pol_pcs - (value + stateArr[rowIndex].fls_1_pcs);
							dd[rowIndex].fls_3 = defaultFls;
							dd[rowIndex].fls_3_pcs =
								dd[rowIndex].pol_pcs - (value + stateArr[rowIndex].fls_1_pcs);
						} else {
							if (value + dd[rowIndex].fls_1_pcs > stateArr[rowIndex].pol_pcs) {
								stateArr[rowIndex].fls_2 = defaultFls;
								stateArr[rowIndex].fls_2_pcs =
									stateArr[rowIndex].pol_pcs - stateArr[rowIndex].fls_1_pcs;
								dd[rowIndex].fls_2 = defaultFls;
								dd[rowIndex].fls_2_pcs =
									stateArr[rowIndex].pol_pcs - stateArr[rowIndex].fls_1_pcs;
							}
							stateArr[rowIndex].fls_3 = null;
							stateArr[rowIndex].fls_3_pcs = null;
							dd[rowIndex].fls_3 = null;
							dd[rowIndex].fls_3_pcs = null;
						}
					}
				}
				if (columnId == 'fls_3_pcs') {
					if (
						stateArr[rowIndex].fls_1_pcs + stateArr[rowIndex].fls_2_pcs ==
						stateArr[rowIndex].pol_pcs
					) {
						stateArr[rowIndex].fls_3 = null;
						stateArr[rowIndex].fls_3_pcs = null;
						dd[rowIndex].fls_3 = null;
						dd[rowIndex].fls_3_pcs = null;
					} else {
						if (
							value + stateArr[rowIndex].fls_1_pcs + stateArr[rowIndex].fls_2_pcs >
							stateArr[rowIndex].pol_pcs
						) {
							stateArr[rowIndex].fls_3 = defaultFls;
							stateArr[rowIndex].fls_3_pcs =
								stateArr[rowIndex].pol_pcs -
								(stateArr[rowIndex].fls_1_pcs + stateArr[rowIndex].fls_2_pcs);
							dd[rowIndex].fls_3 = defaultFls;
							dd[rowIndex].fls_3_pcs =
								stateArr[rowIndex].pol_pcs -
								(stateArr[rowIndex].fls_1_pcs + stateArr[rowIndex].fls_2_pcs);
						} else {
							stateArr[rowIndex].fls_3 = defaultFls;
							stateArr[rowIndex].fls_3_pcs =
								stateArr[rowIndex].pol_pcs -
								(stateArr[rowIndex].fls_1_pcs + stateArr[rowIndex].fls_2_pcs);
							dd[rowIndex].fls_3 = defaultFls;
							dd[rowIndex].fls_3_pcs =
								stateArr[rowIndex].pol_pcs -
								(stateArr[rowIndex].fls_1_pcs + stateArr[rowIndex].fls_2_pcs);
						}
					}
				}
				// Add rows to in pageState

				setPageState(value => ({
					...value,
					values: {
						...pageState.values,
						para: stateArr.filter(
							(e: any) =>
								e.shape != null &&
								e.pol_size != null &&
								e.pol_pcs != null &&
								e.action !== 'delete'
						)
						//filter((e: any) => e.action !== 'delete')
					}
				}));
				// setDataSource(stateArr);
				setDataSource(dd.filter((e: any) => e.action !== 'delete'));
			}
		},
		[dataSource]
	);
	const getPlanSubmit = async () => {
		let Array: any = [];
		for (let index = 0; index < pageState.values.para.length; index++) {
			if (
				pageState.values.para[index].action != 'insert' &&
				pageState.values.para[index].action != 'delete'
			) {
				let data = { ...pageState.values.para[index] };
				data.action = 'update';
				Array.push(data);
			} else {
				Array.push(pageState.values.para[index]);
			}
		}
		setDataSource(Array.filter((e: any) => e.action !== 'delete'));
		setPageState(value => ({
			...value,
			values: {
				...pageState.values,
				para: Array.filter((e: any) => e.action !== 'delete')
			}
		}));
		dispatch(
			tenderlotplansActions.getAssortPlanSumm({ tender_lot_plan_summ: pageState.values.para })
		);
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
						tender_lot_assort_seq: tableRefSeq?.tenderLotAssortSeq,
						tender_lot_det_seq: tableRefSeq?.lotSeq
					}
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
					// setActiveCell([data.length - 1, 0]);
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
		currentFocus(4);
	};
	return (
		<MainCard content={false} tabIndex={-1} ref={refPage as any}>
			<FormContainer formContext={formContext}>
				<Grid container spacing={1}>
					<Grid item xs={11}>
						<Stack spacing={1}>
							<MainCard content={false} tabIndex="0">
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
									editable={editMode}
									columns={columns}
									dataSource={dataSource}
									onFocus={onFocus}
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
									rowHeight={21}
									headerHeight={22}
									showColumnMenuTool={false}
								/>
							</MainCard>
						</Stack>
					</Grid>
					<Grid item xs={1}>
						<Button
							ref={generateButtonRef}
							className="custom-button"
							variant="outlined"
							fullWidth
							size="small"
							style={{
								height: '40px',
								width: '70px',
								lineHeight: 1.4,
								marginLeft: 0
							}}
							//disabled={enableButton1}
							onClick={getPlanSubmit}
							tabIndex={-1}>
							Generate plan
						</Button>
					</Grid>
				</Grid>
				<button type="submit" hidden />
			</FormContainer>
		</MainCard>
	);
};

export default TenderLotPlanSumms;
