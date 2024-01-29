import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import dayjs from 'dayjs';
import { FormContainer } from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import MainCard from '@components/MainCard';
import { AutocompleteEditor, DatePickerEditor, TextFieldEditor } from '@components/table/editors';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { FormSchema, IFormInput } from '@pages/master/nonesaleables/models/nonesaleables';
import { useNonesaleablesSlice } from '@pages/master/nonesaleables/store/slice';
import { nonesaleablesSelector } from '@pages/master/nonesaleables/store/slice/nonesaleables.selectors';

import { useColorsSlice } from '@pages/master/colors/store/slice';
import { colorsSelector } from '@pages/master/colors/store/slice/colors.selectors';
import { usePuritiesSlice } from '@pages/master/purities/store/slice';
import { puritiesSelector } from '@pages/master/purities/store/slice/purities.selectors';
import { useShapesSlice } from '@pages/master/shapes/store/slice';
import { shapesSelector } from '@pages/master/shapes/store/slice/shapes.selectors';
import { useFlssSlice } from '@pages/master/flss/store/slice';
import { flssSelector } from '@pages/master/flss/store/slice/flss.selectors';

import {
	InitialQueryParam,
	InitialState,
	ObjecttoQueryString,
	onTableKeyDown,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';

import '@inovua/reactdatagrid-community/index.css';

const gridStyle = {
	minHeight: 400
};
let inEdit: boolean;
let newRowDataSource: any;
let initialFocus = false;

// ==============================|| NONESALEABLES ||============================== //

const initParams = {
	page: 1,
	limit: 10000,
	// sortBy: [],
	// filterBy: [],
	pagination: 'true'
} as InitialQueryParam;

const Nonesaleables = () => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const { actions: nonesaleablesActions } = useNonesaleablesSlice();
	const { actions } = useSnackBarSlice();
	const { actions: colorsActions } = useColorsSlice();
	const { actions: puritiesActions } = usePuritiesSlice();
	const { actions: shapesActions } = useShapesSlice();
	const { actions: flssActions } = useFlssSlice();

	// *** Nonesaleables State *** //
	const nonesaleablesState = useSelector(nonesaleablesSelector);
	const {
		addError,
		addSuccess,
		getSuccess,
		getTensionSuccess,
		getMilkySuccess,
		getNattsSuccess
	} = nonesaleablesState;

	// *** Purities State *** //
	const puritieState = useSelector(puritiesSelector);
	const { getSuccess: getPuritySuccess } = puritieState;

	// *** Colors State *** //
	const colorState = useSelector(colorsSelector);
	const { getSuccess: getColorSuccess } = colorState;

	// *** Shapes State *** //
	const shapeState = useSelector(shapesSelector);
	const { getSuccess: getShapeSuccess } = shapeState;

	// *** Flss State *** //
	const flsState = useSelector(flssSelector);
	const { getSuccess: getFlsSuccess } = flsState;

	// add your Locale  👿
	const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		formState: { isSubmitting },
		reset
	} = formContext;

	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'sr_no',
				header: 'Sr',
				headerAlign: 'center',
				minWidth: 20,
				maxWidth: 60,
				editable: false,
				skipNavigation: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					return <Typography align="center">{data.sr_no}</Typography>;
				}
			},
			{
				name: 'trans_date',
				header: 'Date',
				headerAlign: 'center',
				minWidth: 70,
				maxWidth: 80,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <DatePickerEditor {...editorProps} />;
				},
				editorProps: {
					type: 'date'
					// maxLength: 5
				},
				render: ({ data, value }: any) => {
					return (
						<Typography align="center">
							{data && data.trans_date && data.trans_date
								? dayjs(data.trans_date).format('DD-MM-YYYY')
								: value
								? dayjs(value).format('DD-MM-YYYY')
								: ''}
						</Typography>
					);
				}
			},
			{
				name: 'from_wgt',
				header: 'From',
				group: 'wgt',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
				sortable: false,
				addInHidden: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					return (
						<Typography align="center">
							{data.from_wgt ? parseFloat(data.from_wgt).toFixed(2) : null}
						</Typography>
					);
				}
			},
			{
				name: 'to_wgt',
				header: 'To',
				group: 'wgt',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					return (
						<Typography align="center">
							{data.to_wgt ? parseFloat(data.to_wgt).toFixed(2) : null}
						</Typography>
					);
				}
			},
			{
				name: 'shape',
				header: 'Shape',
				headerAlign: 'center',
				minWidth: 60,
				maxWidth: 80,
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
						<Typography align="center">
							{data && data.shape && data.shape.name ? data.shape.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'from_color',
				header: 'From',
				group: 'color',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
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
						<Typography align="center">
							{data && data.from_color && data.from_color.name
								? data.from_color.name
								: ''}
						</Typography>
					);
				}
			},
			{
				name: 'to_color',
				header: 'To',
				group: 'color',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
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
				render: ({ data }: any) => {
					return (
						<Typography align="center">
							{data && data.to_color && data.to_color.name ? data.to_color.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'from_purity',
				header: 'From',
				group: 'purity',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
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
						<Typography align="center">
							{data && data.from_purity && data.from_purity.name
								? data.from_purity.name
								: value
								? value?.name
								: ''}
						</Typography>
					);
				}
			},
			{
				name: 'to_purity',
				header: 'To',
				group: 'purity',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
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

				render: ({ data }: any) => {
					return (
						<Typography align="center">
							{data && data.to_purity && data.to_purity.name
								? data.to_purity.name
								: ''}
						</Typography>
					);
				}
			},
			{
				name: 'from_fls',
				header: 'From',
				group: 'fls',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
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
						<Typography align="center">
							{data && data.from_fls && data.from_fls.name ? data.from_fls.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'to_fls',
				header: 'To',
				group: 'fls',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
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

				render: ({ data }: any) => {
					return (
						<Typography align="center">
							{data && data.to_fls && data.to_fls.name ? data.to_fls.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'from_tension',
				header: 'From',
				group: 'tension',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
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
						<Typography align="center">
							{data && data.from_tension && data.from_tension.name
								? data.from_tension.name
								: ''}
						</Typography>
					);
				}
			},
			{
				name: 'to_tension',
				header: 'To',
				group: 'tension',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
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
				render: ({ data }: any) => {
					return (
						<Typography align="center">
							{data && data.to_tension && data.to_tension.name
								? data.to_tension.name
								: ''}
						</Typography>
					);
				}
			},
			{
				name: 'from_milky',
				header: 'From',
				group: 'milky',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
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
						<Typography align="center">
							{data && data.from_milky && data.from_milky.name
								? data.from_milky.name
								: ''}
						</Typography>
					);
				}
			},
			{
				name: 'to_milky',
				header: 'To',
				group: 'milky',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
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
				render: ({ data }: any) => {
					return (
						<Typography align="center">
							{data && data.to_milky && data.to_milky.name ? data.to_milky.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'from_natts',
				header: 'From',
				group: 'natts',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
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
						<Typography align="center">
							{data && data.from_natts && data.from_natts.name
								? data.from_natts.name
								: ''}
						</Typography>
					);
				}
			},
			{
				name: 'to_natts',
				header: 'To',
				group: 'natts',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
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
				render: ({ data }: any) => {
					return (
						<Typography align="center">
							{data && data.to_natts && data.to_natts.name ? data.to_natts.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'comments',
				header: 'Comments',
				sortable: false,
				defaultFlex: 1,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
		];
	};

	const groups = [
		{ name: 'wgt', header: 'Wgt' },
		{ name: 'color', header: 'Color' },
		{ name: 'purity', header: 'Purity' },
		{ name: 'fls', header: 'Fls' },
		{ name: 'tension', header: 'Tension' },
		{ name: 'milky', header: 'Milky' },
		{ name: 'natts', header: 'Natts' }
	];
	// add your States  👿
	console.log(dayjs, DatePickerEditor);
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});
	const confirm = useConfirm();
	const [gridRef, setGridRef] = useState<any>(null);
	const refPage = useHotkeys<any>('alt+s', () => buttonRef.current.click());

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());
	const [activeCell, setActiveCell] = useState<any>([0, 1]);

	useEffect(() => {
		const queryStirng = ObjecttoQueryString(initParams);
		dispatch(nonesaleablesActions.get({ QueryParams: queryStirng }));
		return () => {
			dispatch(nonesaleablesActions.reset());
		};
	}, []);

	useEffect(() => {
		newRowDataSource = dataSource;
	}, [dataSource]);

	useEffect(() => {
		if (gridRef && !initialFocus) {
			requestAnimationFrame(() => {
				initialFocus = true;
				gridRef.current.focus();
			});
		}
	}, [gridRef]);

	// *** REDUCER *** //

	useEffect(() => {
		if (addSuccess) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Save successfully.',
					variant: 'alert',
					alert: {
						color: 'success'
					},
					close: false,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					}
				})
			);

			reset();
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});
			const queryStirng = ObjecttoQueryString(initParams);

			dispatch(nonesaleablesActions.get({ QueryParams: queryStirng }));
		}
	}, [addSuccess]);

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

	useEffect(() => {
		if (getSuccess) {
			if (getSuccess?.columnType === 'from_color_seq') {
				let nonesaleablesData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'from_color'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					nonesaleablesData = getSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: nonesaleablesData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (getSuccess?.columnType === 'to_color_seq') {
				let nonesaleablesData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'to_color'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					nonesaleablesData = getSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: nonesaleablesData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (getSuccess?.columnType === 'from_purity') {
				let nonesaleablesData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'from_purity'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					nonesaleablesData = getSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: nonesaleablesData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (getSuccess?.columnType === 'to_purity_seq') {
				let nonesaleablesData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'to_purity'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					nonesaleablesData = getSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: nonesaleablesData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (!getSuccess?.columnType || getSuccess?.columnType === null) {
				if (getSuccess?.results && getSuccess?.results.length > 0) {
					setDataSource(getSuccess?.results);
				} else {
					setDataSource([]);
				}
			}
		}
	}, [getSuccess]);

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

	// *** COLOR *** //
	useEffect(() => {
		if (getColorSuccess) {
			if (getColorSuccess?.results) {
				if (getColorSuccess?.columnType === 'from_color') {
					let colorData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'from_color'
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
				} else if (getColorSuccess?.columnType === 'to_color') {
					let colorData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'to_color'
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
				if (getPuritySuccess?.columnType === 'from_purity') {
					let colorData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'from_purity'
					);

					if (getPuritySuccess?.results && getPuritySuccess?.results.length > 0) {
						colorData = getPuritySuccess?.results;
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
				} else if (getPuritySuccess?.columnType === 'to_purity') {
					let colorData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'to_purity'
					);

					if (getPuritySuccess?.results && getPuritySuccess?.results.length > 0) {
						colorData = getPuritySuccess?.results;
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
	}, [getPuritySuccess]);

	// *** FLSS *** //
	useEffect(() => {
		if (getFlsSuccess) {
			if (getFlsSuccess?.results) {
				if (getFlsSuccess?.columnType === 'from_fls') {
					let flsData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'from_fls'
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
				} else if (getFlsSuccess?.columnType === 'to_fls') {
					let flsData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'to_fls'
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

	// *** Tension *** //
	useEffect(() => {
		if (getTensionSuccess) {
			let tensionData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'from_tension'
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
	}, [getTensionSuccess]);
	useEffect(() => {
		if (getTensionSuccess) {
			let tensionData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'to_tension'
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
	}, [getTensionSuccess]);

	// *** MILKY *** //
	useEffect(() => {
		if (getMilkySuccess) {
			let milkyData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'from_milky'
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
	}, [getMilkySuccess]);
	useEffect(() => {
		if (getMilkySuccess) {
			let milkyData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'to_milky'
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
	}, [getMilkySuccess]);

	// *** NATTS *** //
	useEffect(() => {
		if (getNattsSuccess) {
			let nattsData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'from_natts'
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
	}, [getNattsSuccess]);
	useEffect(() => {
		if (getNattsSuccess) {
			let nattsData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'to_natts'
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
	}, [getNattsSuccess]);

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

	const onKeyDown = async (event: any) => {
		const edited = await onTableKeyDown(event, inEdit, gridRef);

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
		if (edited && edited.colName === 'from_color') {
			dispatch(colorsActions.reset());

			dispatch(
				colorsActions.get({
					QueryParams:
						edited.input.length !== 0
							? `columnType=from_color&limit=10&q=` + edited.input
							: `columnType=from_color&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'to_color') {
			dispatch(colorsActions.reset());

			dispatch(
				colorsActions.get({
					QueryParams:
						edited.input.length !== 0
							? `columnType=to_color&limit=10&q=` + edited.input
							: `columnType=to_color&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'from_purity') {
			dispatch(puritiesActions.reset());

			dispatch(
				puritiesActions.get({
					QueryParams:
						edited.input.length !== 0
							? `columnType=from_purity&limit=10&q=` + edited.input
							: `columnType=from_purity&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'to_purity') {
			dispatch(puritiesActions.reset());

			dispatch(
				puritiesActions.get({
					QueryParams:
						edited.input.length !== 0
							? `columnType=to_purity&limit=10&q=` + edited.input
							: `columnType=to_purity&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'from_fls') {
			dispatch(flssActions.reset());

			dispatch(
				flssActions.get({
					QueryParams:
						edited.input.length !== 0
							? `columnType=from_fls&limit=10&q=` + edited.input
							: `columnType=from_fls&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'to_fls') {
			dispatch(flssActions.reset());

			dispatch(
				flssActions.get({
					QueryParams:
						edited.input.length !== 0
							? `columnType=to_fls&limit=10&q=` + edited.input
							: `columnType=to_fls&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'from_tension') {
			dispatch(nonesaleablesActions.reset());

			dispatch(nonesaleablesActions.getTension('TENSION'));
		}
		if (edited && edited.colName === 'to_tension') {
			dispatch(nonesaleablesActions.reset());

			dispatch(nonesaleablesActions.getTension('TENSION'));
		}
		if (edited && edited.colName === 'from_milky') {
			dispatch(nonesaleablesActions.reset());

			dispatch(nonesaleablesActions.getMilky('MILKY'));
		}
		if (edited && edited.colName === 'to_milky') {
			dispatch(nonesaleablesActions.reset());

			dispatch(nonesaleablesActions.getMilky('MILKY'));
		}
		if (edited && edited.colName === 'from_natts') {
			dispatch(nonesaleablesActions.reset());

			dispatch(nonesaleablesActions.getNatts('NATTS'));
		}
		if (edited && edited.colName === 'to_natts') {
			dispatch(nonesaleablesActions.reset());

			dispatch(nonesaleablesActions.getNatts('NATTS'));
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
					description: 'Are you sure delete nonesaleables ?',
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

				const { insertNew, data, stateArr } = await insertNewRow(
					pageState, // State for track row insert, update or delete
					FormSchema, // for validation
					newRowDataSource, // table data
					rowIndex, // row number
					isLastEditableColumn,
					event.key,
					{
						sr_no: rowCount + 1,
						trans_date: dayjs(new Date()).format('YYYY-MM-DD')
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

					let LastEditCol = Math.floor(Math.random() * +10000);
					for (let index = 0; index < columns.length - 1; index++) {
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
					// *** Focus on first cell of new added row
					setActiveCell([data.length - 1, LastEditCol]);
					await delay(20);

					// // *** Focus on first cell of new added row
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
			if (typeof value === 'string') {
				value = value.trim();
			}

			// *** VALIDATION FOR to_wgt ***
			let validation = true;
			let type = 'N';
			let Msg = '';

			const grid = gridRef.current;
			const colIndex = columns.findIndex(function (clm: any) {
				return clm.name === columnId;
			});
			let colind = colIndex;

			if (columnId === 'to_wgt') {
				const from_wgtVal = dataSource[rowIndex].from_wgt;
				const curVal = parseInt(value, 10);
				const targetVal = parseInt(from_wgtVal, 10);
				if (curVal < targetVal) {
					validation = false;
					type = 'M';
					Msg = 'to wgt should be greater than from color.';
				}
				if (from_wgtVal == null) {
					validation = false;
					type = 'M';
					colind--;
					columnId = 'from_wgt';
					Msg = 'Please enter from wgt.';
				}
			}
			// *** VALIDATION FOR to_color ***
			// if (columnId === "to_color"){
			// 	const from_colorVal = dataSource[rowIndex].from_color?.seq_no;
			// 	const curVal = parseInt(value?.seq_no ? value.seq_no : 0 , 10)
			// 	const targetVal = parseInt(from_colorVal, 10)

			// 	if (curVal < targetVal ){
			// 		validation = false
			// 		type = "M"
			// 		Msg ="to color should be greater than from color."
			// 	}
			// 	if (from_colorVal == null) {
			// 		validation = false
			// 		type = "M"
			// 		colind--
			// 		columnId ="from_color"
			// 		Msg ="Please select from color."
			// 	}
			// }
			// // *** VALIDATION FOR to_color ***
			// if (columnId === "to_purity"){
			// 	const from_purityVal = dataSource[rowIndex].from_color?.seq_no;
			// 	const curVal = parseInt(value?.seq_no ? value.seq_no : 0, 10)
			// 	const targetVal = parseInt(from_purityVal, 10)

			// 	if (curVal < targetVal ){
			// 		validation = false
			// 		type = "M"
			// 		Msg ="to purity should be greater than from purity."
			// 	}
			// 	if (from_purityVal == null) {
			// 		validation = false
			// 		type = "M"
			// 		colind--
			// 		columnId ="from_purity"
			// 		Msg ="Please select from purity."
			// 	}
			// }

			if (!validation) {
				// *** Focus on first cell of new added row
				if (type === 'M') {
					dispatch(
						actions.openSnackbar({
							open: true,
							message: Msg,
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
				await delay(10);
				setActiveCell([rowIndex, colind - 1]);
				setTimeout(() => {
					grid.startEdit({ columnId, rowIndex });
				}, 0);
				return;
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
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: stateArr
				}
			}));

			setDataSource(data);
			//}
		},
		[dataSource]
	);

	const onSubmit = async () => {
		/* empty */
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		if (Object.keys(pageState.values).length === 0) {
			return;
		} else {
			let errorMessage = null;
			for (let i in pageState.values.para) {
				if (pageState.values.para[i].action != 'delete') {
					// if (
					// 	pageState.values.para[i].name == null ||
					// 	pageState.values.para[i].name == ''
					// ) {
					// 	errorMessage = 'Name must be required.';
					// } else if (
					// 	pageState.values.para[i].short_name == null ||
					// 	pageState.values.para[i].short_name == ''
					// ) {
					// 	errorMessage = 'Short Name must be required.';
					// } else if (
					// 	pageState.values.para[i].sort_no == null ||
					// 	pageState.values.para[i].sort_no == ''
					// ) {
					// 	errorMessage = 'Sort No must be required.';
					// }
				}
			}

			if (errorMessage == null) {
				dispatch(nonesaleablesActions.add(pageState.values));
			} else {
				dispatch(
					actions.openSnackbar({
						open: true,
						message: errorMessage,
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

	return (
		<>
			<MainCard content={false} ref={refPage as any} tabIndex={-1}>
				<FormContainer
					onSuccess={() => onSubmit()}
					formContext={formContext}
					FormProps={{ autoComplete: 'off' }}>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Stack spacing={1}>
								<MainCard content={false} tabIndex="0">
									<ReactDataGrid
										handle={setGridRef}
										idProperty="seq_no"
										nativeScroll={true}
										style={gridStyle}
										activeCell={activeCell}
										onActiveCellChange={setActiveCell}
										onKeyDown={onKeyDown}
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
										onEditComplete={onEditComplete}
										onEditStart={onEditStart}
										onEditStop={onEditStop}
										editable={true}
										columns={columns}
										dataSource={dataSource}
										rowHeight={21}
										headerHeight={22}
										showColumnMenuTool={false}
										showZebraRows={false}
									/>
								</MainCard>
							</Stack>
						</Grid>
					</Grid>
					<button type="submit" hidden />
				</FormContainer>
				<Grid container sx={{ mt: 1.5, mb: 1.5 }}>
					<Grid item xs={12}>
						<Stack
							sx={{ mr: 1.5 }}
							direction="row"
							spacing={2}
							justifyContent="left"
							alignItems="center">
							<Button
								ref={buttonRef}
								onClick={e => handleSubmit(e)}
								onKeyDown={e => (e.key === 'Enter' ? handleSubmit(e) : '')}
								disableElevation
								disabled={isSubmitting}
								type="submit"
								variant="contained"
								style={{ height: '30px' }}
								color="primary">
								{isSubmitting ? (
									<CircularProgress size={24} color="success" />
								) : (
									formatMessage({ id: 'Save' })
								)}
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</MainCard>
		</>
	);
};

export default Nonesaleables;
