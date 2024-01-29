import { useCallback, useEffect, useState } from 'react'; // useRef,
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import MainCard from '@components/MainCard';
import { TextFieldEditor, AutocompleteEditor } from '@components/table/editors';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { FormSchema, IFormInput } from '@pages/master/formtopricing/models/FormToPricing';
import { useFormToPricingsSlice } from '@pages/master/formtopricing/store/slice';
import { formtopricingsSelector } from '@pages/master/formtopricing/store/slice/formtopricings.selectors';
import {
	InitialState,
	onTableKeyDown,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';
import dayjs from 'dayjs';

import { useColorsSlice } from '@pages/master/colors/store/slice';
import { colorsSelector } from '@pages/master/colors/store/slice/colors.selectors';
import { usePuritiesSlice } from '@pages/master/purities/store/slice';
import { puritiesSelector } from '@pages/master/purities/store/slice/purities.selectors';
import { useFlssSlice } from '@pages/master/flss/store/slice';
import { flssSelector } from '@pages/master/flss/store/slice/flss.selectors';
import { useLabsSlice } from '@pages/master/labs/store/slice';
import { labsSelector } from '@pages/master/labs/store/slice/labs.selectors';
import { usePropSlice } from '@pages/master/props/store/slice';
import { propsSelector } from '@pages/master/props/store/slice/props.selectors';

import '@inovua/reactdatagrid-community/index.css';
import './FormToPricing';
import { Typography } from '@mui/material';

const gridStyle = { minHeight: 400 };
let inEdit: boolean;
let newRowDataSource: any;
let initialFocus = false;

// ==============================|| FORMTOPRICINGS ||============================== //

interface Props {
	passProps?: any;
	addressType?: string;
	selectedData?: any | null;
	formToPricingOptions?: any;
	priceParaSeq?: any;
	paraName?: any;
	shapeObject?: any;
	ftParaType?: any;
	paraType1?: any;
	paraType2?: any;
	nParaType?: any;
	typeSelect?: any;
	pricingHideCol?: any;
}

const FormToPricingDetails = ({
	passProps,
	formToPricingOptions,
	priceParaSeq,
	paraName,
	shapeObject,
	ftParaType,
	paraType1,
	paraType2,
	nParaType,
	typeSelect,
	pricingHideCol
}: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: formtopricingsActions } = useFormToPricingsSlice();
	const { actions } = useSnackBarSlice();

	/*Extra Action From Master*/
	const { actions: colorsActions } = useColorsSlice();
	const { actions: puritiesActions } = usePuritiesSlice();
	const { actions: flssActions } = useFlssSlice();
	const { actions: labsActions } = useLabsSlice();
	const { actions: propsActions } = usePropSlice();

	// *** FormToPricing State *** //
	const formtopricingsState = useSelector(formtopricingsSelector);
	const { getParaOneSuccess } = formtopricingsState;
	const { addError } = formtopricingsState;

	// *** Purities State *** //
	const puritieState = useSelector(puritiesSelector);
	const { getSuccess: getPuritySuccess } = puritieState;

	// *** Colors State *** //
	const colorState = useSelector(colorsSelector);
	const { getSuccess: getColorSuccess } = colorState;

	// *** Flss State *** //
	const flsState = useSelector(flssSelector);
	const { getSuccess: getFlsSuccess } = flsState;

	// *** Labs State *** //
	const labState = useSelector(labsSelector);
	const { getSuccess: getLabSuccess } = labState;

	// *** Props State *** //
	const propState = useSelector(propsSelector);
	const { getSuccess: getPropSuccess } = propState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const { reset } = formContext;

	//get columns
	const getColumns = () => {
		return [
			{
				name: 'seq_no',
				header: 'seq_no',
				defaultVisible: false
			},
			{
				name: 'sr_no',
				header: 'Sr',
				headerAlign: 'center',
				minWidth: 20,
				maxWidth: 30,
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
				name: 'para_from_value',
				header: 'From',
				group: 'fts',
				headerAlign: 'center',
				minWidth: 60,
				maxWidth: 80,
				sortable: false,
				addInHidden: true,
				visible: ftParaType !== '',
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					return (
						<Typography align="center">
							{data.para_from_value
								? parseFloat(data.para_from_value).toFixed(2)
								: null}
						</Typography>
					);
				}
			},
			{
				name: 'para_to_value',
				header: 'To',
				group: 'fts',
				headerAlign: 'center',
				minWidth: 40,
				maxWidth: 60,
				sortable: false,
				visible: ftParaType !== '',
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					return (
						<Typography align="center">
							{data.para_to_value ? parseFloat(data.para_to_value).toFixed(2) : null}
						</Typography>
					);
				}
			},
			{
				name: 'para_value_1',
				header:
					paraType1 !== '' ? (
						<span
							style={{
								display: 'flex',
								justifyContent: 'center',
								textTransform: 'capitalize'
							}}>
							{paraType1.split('_', 1)}
						</span>
					) : (
						'Para Value 1'
					),
				headerAlign: 'left',
				addInHidden: true,
				sortable: false,
				minWidth: 50,
				maxWidth: 80,
				visible: paraType1 !== '',
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
					return data && data.para_value_1 && data.para_value_1.name
						? data.para_value_1.name
						: '';
				}
			},
			{
				name: 'para_value_2',
				header: paraType2 !== '' ? paraType2.split('_', 1) : 'Para Value 2',
				headerAlign: 'left',
				addInHidden: true,
				sortable: false,
				minWidth: 50,
				maxWidth: 80,
				visible: paraType2 !== '',
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
					return data && data.para_value_2 && data.para_value_2.name
						? data.para_value_2.name
						: '';
				}
			},
			{
				name: 'npara_value',
				header: nParaType !== '' ? nParaType : 'nPara Value',
				headerAlign: 'left',
				addInHidden: true,
				sortable: false,
				minWidth: 50,
				maxWidth: 75,
				visible: nParaType !== '',
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
					return data && data.npara_value && data.npara_value.name
						? data.npara_value.name
						: '';
				}
			},
			{
				name: 'lab',
				header: 'Lab',
				addInHidden: true,
				sortable: false,
				minWidth: 40,
				maxWidth: 50,
				visible: true,
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
					return data && data.lab && data.lab.name ? data.lab.name : '';
				}
			},
			{
				name: 'from_wgt',
				header: 'From',
				group: 'wgt',
				headerAlign: 'center',
				minWidth: 40,
				maxWidth: 50,
				sortable: false,
				addInHidden: true,
				visible: true,
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
				minWidth: 40,
				maxWidth: 50,
				visible: true,
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
				name: 'from_color',
				header: 'From',
				group: 'color',
				headerAlign: 'center',
				minWidth: 40,
				maxWidth: 60,
				addInHidden: true,
				sortable: false,
				// visible: true,
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
				minWidth: 40,
				maxWidth: 60,
				addInHidden: true,
				sortable: false,
				// visible: true,
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
				minWidth: 40,
				maxWidth: 60,
				addInHidden: true,
				sortable: false,
				visible: true,
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
				minWidth: 40,
				maxWidth: 60,
				addInHidden: true,
				sortable: false,
				visible: true,
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
				minWidth: 55,
				maxWidth: 70,
				addInHidden: true,
				sortable: false,
				visible: true,
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
				minWidth: 55,
				maxWidth: 70,
				addInHidden: true,
				sortable: false,
				visible: true,
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
				name: 'from_prop',
				header: 'From',
				group: 'prop',
				headerAlign: 'center',
				minWidth: 40,
				maxWidth: 50,
				addInHidden: true,
				sortable: false,
				visible: true,
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
							{data && data.from_prop && data.from_prop.name
								? data.from_prop.name
								: ''}
						</Typography>
					);
				}
			},
			{
				name: 'to_prop',
				header: 'To',
				group: 'prop',
				headerAlign: 'center',
				minWidth: 40,
				maxWidth: 50,
				addInHidden: true,
				sortable: false,
				visible: true,
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
							{data && data.to_prop && data.to_prop.name ? data.to_prop.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'disc_per',
				headerAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
				sortable: false,
				visible: true,
				// type: 'text',
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					// type: 'text'
				},
				renderHeader: () => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Disc
							<br />%
						</div>
					);
				},
				render: ({ data }: any) => {
					return (
						<Typography align="center">
							{data && data.disc_per ? parseFloat(data.disc_per).toFixed(2) : null}
						</Typography>
					);
				}
			},
			{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
		];
	};

	const groups = [
		{
			name: 'fts',
			header: (
				<span
					style={{
						display: 'flex',
						justifyContent: 'center',
						textTransform: 'capitalize'
					}}>
					{ftParaType.split('_', 1)}
				</span>
			)
		},
		{
			name: 'wgt',
			header: (
				<span
					style={{
						display: 'flex',
						justifyContent: 'center'
					}}>
					Wgt
				</span>
			)
		},
		{
			name: 'color',
			header: (
				<span
					style={{
						display: 'flex',
						justifyContent: 'center'
					}}>
					Color
				</span>
			)
		},
		{
			name: 'purity',
			header: (
				<span
					style={{
						display: 'flex',
						justifyContent: 'center'
					}}>
					Purity
				</span>
			)
		},
		{
			name: 'fls',
			header: (
				<span
					style={{
						display: 'flex',
						justifyContent: 'center'
					}}>
					Fls
				</span>
			)
		},
		{
			name: 'prop',
			header: (
				<span
					style={{
						display: 'flex',
						justifyContent: 'center'
					}}>
					Prop
				</span>
			)
		}
	];

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});
	const confirm = useConfirm();
	const [gridRef, setGridRef] = useState<any>(null);
	const [dataSource, setDataSource] = useState<any>([]);
	let [columns, setColumns] = useState<any>(getColumns());
	const [activeCell, setActiveCell] = useState<any>([0, 1]);

	// *** REDUCER *** //

	useEffect(() => {
		return () => {
			dispatch(formtopricingsActions.reset());
		};
	}, []);

	useEffect(() => {
		// *** set state for api
		if (formToPricingOptions) {
			setColumns([]);
			setColumns(getColumns());
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: formToPricingOptions
				}
			}));
			setDataSource(formToPricingOptions);
		}
	}, [formToPricingOptions]);

	useEffect(() => {
		newRowDataSource = dataSource;
		passProps(pageState.values.para);
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

	// *** PARA VALUES *** //
	useEffect(() => {
		if (getParaOneSuccess) {
			if (getParaOneSuccess?.columnType === 'para_value_1') {
				let paraValueOneData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'para_value_1'
				);

				if (getParaOneSuccess?.results && getParaOneSuccess?.results.length > 0) {
					paraValueOneData = getParaOneSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: paraValueOneData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (getParaOneSuccess?.columnType === 'para_value_2') {
				let paraValueTwoData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'para_value_2'
				);

				if (getParaOneSuccess?.results && getParaOneSuccess?.results.length > 0) {
					paraValueTwoData = getParaOneSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: paraValueTwoData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			} else if (getParaOneSuccess?.columnType === 'npara_value') {
				let nparaValueData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'npara_value'
				);

				if (getParaOneSuccess?.results && getParaOneSuccess?.results.length > 0) {
					nparaValueData = getParaOneSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: nparaValueData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			}
		}
	}, [getParaOneSuccess]);

	// *** LAB *** //
	useEffect(() => {
		if (getLabSuccess) {
			if (getLabSuccess?.results) {
				if (getLabSuccess?.columnType === 'lab') {
					let labData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'lab'
					);

					if (getLabSuccess?.results && getLabSuccess?.results.length > 0) {
						labData = getLabSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: labData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	}, [getLabSuccess]);

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
					let colorToData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'to_color'
					);

					if (getColorSuccess?.results && getColorSuccess?.results.length > 0) {
						colorToData = getColorSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: colorToData,
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
					let purityData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'from_purity'
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
				} else if (getPuritySuccess?.columnType === 'to_purity') {
					let purityToData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'to_purity'
					);

					if (getPuritySuccess?.results && getPuritySuccess?.results.length > 0) {
						purityToData = getPuritySuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: purityToData,
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
					let flsToData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'to_fls'
					);

					if (getFlsSuccess?.results && getFlsSuccess?.results.length > 0) {
						flsToData = getFlsSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: flsToData,
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
				if (getPropSuccess?.columnType === 'from_prop') {
					let propData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'from_prop'
					);

					if (getPropSuccess?.results && getPropSuccess?.results.length > 0) {
						propData = getPropSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: propData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				} else if (getPropSuccess?.columnType === 'to_prop') {
					let propToData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'to_prop'
					);

					if (getPropSuccess?.results && getPropSuccess?.results.length > 0) {
						propToData = getPropSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: propToData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	}, [getPropSuccess]);

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

		if (edited && edited.colName === 'para_value_1') {
			dispatch(formtopricingsActions.reset());

			dispatch(
				formtopricingsActions.getParaOne(
					`'${paraType1}'/true?page=1&limit=10&pagination=false&columnType=para_value_1`
				)
			);
		}
		if (edited && edited.colName === 'para_value_2') {
			dispatch(formtopricingsActions.reset());

			dispatch(
				formtopricingsActions.getParaOne(
					`'${paraType2}'/true?page=1&limit=10&pagination=false&columnType=para_value_2`
				)
			);
		}
		if (edited && edited.colName === 'npara_value') {
			dispatch(formtopricingsActions.reset());

			dispatch(
				formtopricingsActions.getParaOne(
					`'${nParaType}'/true?page=1&limit=10&pagination=false&columnType=npara_value`
				)
			);
		}
		if (edited && edited.colName === 'lab') {
			dispatch(labsActions.reset());

			dispatch(
				labsActions.get({
					QueryParams:
						edited.input.length != 0
							? `columnType=lab&limit=10&q=` + edited.input
							: `columnType=lab&page=1&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'from_color') {
			dispatch(colorsActions.reset());

			dispatch(
				colorsActions.get({
					QueryParams:
						edited.input.length != 0
							? `columnType=from_color&limit=10&q=` + edited.input
							: `columnType=from_color&page=1&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'to_color') {
			dispatch(colorsActions.reset());

			dispatch(
				colorsActions.get({
					QueryParams:
						edited.input.length != 0
							? `columnType=to_color&limit=10&q=` + edited.input
							: `columnType=to_color&page=1&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'from_purity') {
			dispatch(puritiesActions.reset());

			dispatch(
				puritiesActions.get({
					QueryParams:
						edited.input.length != 0
							? `columnType=from_purity&limit=10&q=` + edited.input
							: `columnType=from_purity&page=1&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'to_purity') {
			dispatch(puritiesActions.reset());

			dispatch(
				puritiesActions.get({
					QueryParams:
						edited.input.length != 0
							? `columnType=to_purity&limit=10&q=` + edited.input
							: `columnType=to_purity&page=1&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'from_fls') {
			dispatch(flssActions.reset());

			dispatch(
				flssActions.get({
					QueryParams:
						edited.input.length != 0
							? `columnType=from_fls&limit=10&q=` + edited.input
							: `columnType=from_fls&page=1&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'to_fls') {
			dispatch(flssActions.reset());

			dispatch(
				flssActions.get({
					QueryParams:
						edited.input.length != 0
							? `columnType=to_fls&limit=10&q=` + edited.input
							: `columnType=to_fls&page=1&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'from_prop') {
			dispatch(propsActions.reset());

			dispatch(
				propsActions.get({
					QueryParams:
						edited.input.length != 0
							? `columnType=from_prop&limit=10&q=` + edited.input
							: `columnType=from_prop&page=1&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'to_prop') {
			dispatch(propsActions.reset());

			dispatch(
				propsActions.get({
					QueryParams:
						edited.input.length != 0
							? `columnType=to_prop&limit=10&q=` + edited.input
							: `columnType=to_prop&page=1&limit=10`
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
					description: 'Are you sure delete Form to Price ?',
					cancellationButtonProps: { autoFocus: true },
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
						type: typeSelect,
						ft_para_type: ftParaType,
						para_type_1: paraType1,
						para_type_2: paraType2,
						nParaType: nParaType,
						trans_date: dayjs().format(),
						price_para: {
							seq_no: priceParaSeq
						},
						shape: shapeObject,
						sr_no: rowCount + 1
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
					setTimeout(() => {
						const column = grid.getColumnBy(1);
						grid.startEdit({ columnId: column.name, rowIndex: data.length - 1 });
					}, 20);
				}
			}
		}
	};

	const onEditComplete = useCallback(
		async ({ value, columnId, rowIndex }: any) => {
			if (typeof value === 'string') {
				value = value.trim();
			}

			if (value?.length > 0 && columnId === 'disc_per') {
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

			// *** VALIDATION FOR to_wgt ***
			let validation = true;
			let type = 'N';
			let Msg = '';

			const grid = gridRef.current;
			const colIndex = columns.findIndex(function (clm: any) {
				return clm?.name === columnId;
			});
			let colind = colIndex;

			let hideIndex = 6;

			if (columnId == 'para_from_value' || columnId == 'para_to_value') hideIndex = 7;

			if (ftParaType != '') hideIndex = hideIndex - 2;
			if (paraType1 != '') hideIndex = hideIndex - 1;
			if (paraType2 != '') hideIndex = hideIndex - 1;
			if (nParaType != '') hideIndex = hideIndex - 1;

			if (columnId == 'para_from_value' || columnId == 'para_to_value')
				colind = hideIndex - colind;
			else colind = colind - hideIndex;

			if (columnId === 'to_wgt') {
				let from: number = Number(dataSource[rowIndex].from_wgt);
				let to: number = Number(value);

				if (from == 0 && to > 0) {
					validation = false;
					type = 'M';
					colind--;
					columnId = 'from_wgt';
					Msg = 'Please enter from wgt.';
				} else if (from > 0 && to < from) {
					validation = false;
					type = 'M';
					Msg = 'to wgt should be greater than from wgt.';
				}
			} else if (columnId === 'para_to_value') {
				let from: number = Number(dataSource[rowIndex].para_from_value);
				let to: number = Number(value);

				if (from == 0 && to > 0) {
					validation = false;
					type = 'M';
					colind--;
					columnId = 'para_from_value';
					Msg = 'Please enter from Value.';
				} else if (from > 0 && to < from) {
					validation = false;
					type = 'M';
					Msg = 'to Value should be greater than from Value.';
				}
			}

			// *** VALIDATION FOR to_color ***
			if (columnId === 'to_color') {
				let from: number = Number(dataSource[rowIndex].from_color?.sort_no);
				let to: number = 0;

				if (value != null && value?.seq_no != null) to = Number(value?.sort_no);

				if (from == 0 && to > 0) {
					validation = false;
					type = 'M';
					colind--;
					columnId = 'from_color';
					Msg = 'Please select from color.';
				} else if (from > 0 && to < from) {
					validation = false;
					type = 'M';
					Msg = 'to color should be greater than from color.';
				}
			}

			// *** VALIDATION FOR to_purity ***
			if (columnId === 'to_purity') {
				let from: number = Number(dataSource[rowIndex].from_purity?.sort_no);
				let to: number = 0;

				if (value != null && value?.seq_no != null) to = Number(value?.sort_no);

				if (from == 0 && to > 0) {
					validation = false;
					type = 'M';
					colind--;
					columnId = 'from_purity';
					Msg = 'Please select from purity.';
				} else if (from > 0 && to < from) {
					validation = false;
					type = 'M';
					Msg = 'to purity should be greater than from purity.';
				}
			}

			// *** VALIDATION FOR to_prop ***
			if (columnId === 'to_prop') {
				let from: number = Number(dataSource[rowIndex].from_prop?.sort_no);
				let to: number = 0;

				if (value != null && value?.seq_no != null) to = Number(value?.sort_no);

				if (from == 0 && to > 0) {
					validation = false;
					type = 'M';
					colind--;
					columnId = 'from_prop';
					Msg = 'Please select from prop.';
				} else if (from > 0 && to < from) {
					validation = false;
					type = 'M';
					Msg = 'to prop should be greater than from prop.';
				}
			}

			// *** VALIDATION FOR to_fls ***
			if (columnId === 'to_fls') {
				let from: number = Number(dataSource[rowIndex].from_fls?.sort_no);
				let to: number = 0;

				if (value != null && value?.seq_no != null) to = Number(value?.sort_no);

				if (from == 0 && to > 0) {
					validation = false;
					type = 'M';
					colind--;
					columnId = 'from_fls';
					Msg = 'Please select from fls.';
				} else if (from > 0 && to < from) {
					validation = false;
					type = 'M';
					Msg = 'to fls should be greater than from fls.';
				}
			}

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
				setActiveCell([rowIndex, colind]);
				setTimeout(() => {
					grid.startEdit({ columnId, rowIndex });
				}, 0);
				// setTimeout(() => {
				// 	grid.startEdit({ columnId, rowIndex });
				// }, 0);
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
		},
		[dataSource]
	);

	const onSubmit = async () => {
		/* empty */
	};

	return (
		<>
			<MainCard content={false}>
				<FormContainer
					onSuccess={() => onSubmit()}
					formContext={formContext}
					FormProps={{ autoComplete: 'off' }}>
					<MainCard content={false} tabIndex={-1}>
						<ReactDataGrid
							handle={setGridRef}
							idProperty="seq_no"
							style={gridStyle}
							activeCell={activeCell}
							onActiveCellChange={setActiveCell}
							onKeyDown={onKeyDown}
							groups={groups}
							onEditComplete={onEditComplete}
							onEditStart={onEditStart}
							onEditStop={onEditStop}
							editable={true}
							columns={columns}
							dataSource={dataSource}
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

export default FormToPricingDetails;
