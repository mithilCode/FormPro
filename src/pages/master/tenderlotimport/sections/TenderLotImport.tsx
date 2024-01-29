import { useCallback, useEffect, useState, SyntheticEvent, useRef } from 'react';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import GoldenRetriever from '@uppy/golden-retriever';
import XHR from '@uppy/xhr-upload';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/audio/dist/style.css';
import '@uppy/screen-capture/dist/style.css';
import '@uppy/image-editor/dist/style.css';
import { useForm } from 'react-hook-form';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { useHotkeys } from 'react-hotkeys-hook';
import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	Button,
	createFilterOptions,
	FilterOptionsState,
	Grid,
	Checkbox,
	Box,
	Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AutocompleteElement, FormContainer, TextFieldElement } from '@app/components/rhfmui';
import {
	AutocompleteEditor,
	CheckBoxEditor,
	TextFieldEditor,
	DDTextFieldEditor
} from '@components/table/editors';
import MainCard from '@components/MainCard';
import { zodResolver } from '@hookform/resolvers/zod';
import useThrottle from '@hooks/useThrottle';
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
import { FormSchema, IFormInput } from '@pages/master/tenderlotimport/models/TenderLotImport';
import { useTenderlotimportsSlice } from '@pages/master/tenderlotimport/store/slice';
import { tenderlotimportsSelector } from '@pages/master/tenderlotimport/store/slice/tenderlotimports.selectors';
import { tenderlotimportsState } from '@pages/master/tenderlotimport/store/slice/types';

import TenderLotImports from './TenderLotImports';
import { createColumnHelper } from '@tanstack/react-table';
//import '@inovua/reactdatagrid-community/index.css';
import { InfiniteDrawer } from '@components/drawer';
import dayjs from 'dayjs';
import './tenderlot.css';
import { InfiniteDataGrid, licenceType } from '@components/table';
import useFocusOnEnter from '@hooks/useFocusOnEnter';
import { useConfirm } from 'material-ui-confirm';

const initParams = {
	page: 1,
	limit: 10,
	pagination: 'true'
} as InitialQueryParam;

const columnHelper = createColumnHelper<any>();

const dialogColumns = [
	columnHelper.accessor('name', {
		cell: (info: any) => info.getValue(),
		header: () => <span>Name (by Page)</span>
	})
];

const Filter = createFilterOptions();

const UPLOADER = 's3';

let ENDPOINT_BASE_URL: any;
const Url = window.location.host;
if (Url == 'dev.dxl.one') {
	const { REACT_APP_ENDPOINT_URL } = process.env;
	ENDPOINT_BASE_URL = REACT_APP_ENDPOINT_URL;
} else {
	const { REACT_APP_ENDPOINT_URL_TEST } = process.env;
	ENDPOINT_BASE_URL = REACT_APP_ENDPOINT_URL_TEST;
}
const RESTORE = false;

function TenderLotImport() {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: tenderlotimportsActions } = useTenderlotimportsSlice();
	const { actions } = useSnackBarSlice();

	// *** tenderlotimports State *** //
	const tenderlotimportsState = useSelector(tenderlotimportsSelector);
	const {
		addSuccess,
		getSuccess,
		getSupplierSuccess,
		getTenderNoSuccess,
		getTenderNoSelectSuccess,
		getOneDetSuccess,
		getAttendeeSuccess
	} = tenderlotimportsState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		formState: { errors, isSubmitting },
		reset,
		setFocus
	} = formContext;

	// const confirm = useConfirm();
	const [gridRef, setGridRef] = useState<any>(null); // setGridRef

	// add your refrence  👿
	const buttonRef = useRef<any>(null);
	const formRef = useRef();
	const { onFirstElementFocus, onEnterKey } = useFocusOnEnter(
		formRef,
		formContext.formState.errors
	);
	const addButtonRef = useRef<any>(null);
	const viewButtonRef = useRef<any>(null);
	const cancelButtonRef = useRef<any>(null);

	let refPage = [
		useHotkeys<any>('alt+a', () => addButtonRef.current.click()),
		useHotkeys<any>('alt+v', () => viewButtonRef.current.click()),
		useHotkeys<any>('alt+c', () => cancelButtonRef.current.click()),
		useHotkeys<any>('alt+s', () => buttonRef.current.click())
	];

	const [filterValue, setFilterValue] = useState('All');

	//style your drawer
	const gridStyle = { minHeight: 380 };
	// let inEdit: boolean;
	// let newRowDataSource: any;
	// let initialFocus = false;
	const totalStyle = { minHeight: 21 };

	const footerRows = [
		{
			render: {
				parcel_no: (
					<div style={totalStyle}>
						<b>Total</b>
					</div>
				),
				wgt: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.wgt !== 0 ? summary.wgt.toFixed(2) : 0}</b>
					</div>
				),
				pcs: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.pcs}</b>
					</div>
				),
				value: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.value}</b>
					</div>
				)
			}
		}
	];

	const summaryReducer = {
		initialValue: { wgt: 0, pcs: 0, value: 0 },
		reducer: (acc: any, item: any) => ({
			wgt: parseFloat(acc.wgt || 0) + parseFloat(item.wgt || 0),
			pcs: parseInt(acc.pcs || 0) + parseInt(item.pcs || 0),
			value: parseInt(acc.value || 0) + parseInt(item.value || 0)
		})
	};

	//get columns
	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'selection',
				header: 'Select',
				width: 50,
				headerAlign: 'center',
				textAlign: 'center',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <CheckBoxEditor {...editorProps} />;
				},
				editorProps: {},
				render: ({ value }: any) => {
					return <Checkbox checked={value} style={{ backgroundColor: 'transparent' }} />;
				}
			},
			{
				name: 'priority_no',
				header: 'Priority',
				minWidth: 50,
				maxWidth: 70,
				sortable: false,
				headerAlign: 'center',
				textAlign: 'center',
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'minimum_checker',
				minWidth: 50,
				maxWidth: 80,
				sortable: false,
				headerAlign: 'center',
				textAlign: 'center',
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Minimum
							<br />
							Checker
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
				name: 'lot_no',
				header: 'Lot No',
				minWidth: 80,
				maxWidth: 120,
				sortable: false,
				editable: false,
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'parcel_no',
				header: 'Parcel No',
				minWidth: 80,
				maxWidth: 120,
				sortable: false,
				editable: false,
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'pcs',
				header: 'Pcs',
				minWidth: 50,
				maxWidth: 60,
				sortable: false,
				editable: false,
				skipNavigation: true,
				headerAlign: 'end',
				textAlign: 'right',
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'wgt',
				header: 'Wgt',
				minWidth: 50,
				maxWidth: 60,
				sortable: false,
				editable: false,
				skipNavigation: true,
				headerAlign: 'end',
				textAlign: 'right',
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'rough_size',
				header: 'Rough Size',
				minWidth: 80,
				maxWidth: 120,
				sortable: false,
				editable: false,
				skipNavigation: true,
				headerAlign: 'start',
				textAlign: 'left',
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'rough_article',
				header: 'Rough Article',
				minWidth: 200,
				sortable: false,
				editable: false,
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'lot_description',
				header: 'Lot Description',
				minWidth: 260,
				sortable: false,
				editable: false,
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'rate',
				header: 'Rate',
				minWidth: 40,
				maxWidth: 60,
				sortable: false,
				editable: false,
				skipNavigation: true,
				headerAlign: 'end',
				textAlign: 'right',
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'value',
				header: 'Value',
				minWidth: 60,
				maxWidth: 70,
				sortable: false,
				editable: false,
				skipNavigation: true,
				headerAlign: 'end',
				textAlign: 'right',
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				},
				render: ({ data }: any) => {
					return (
						<Typography align="right">
							{data.value ? parseFloat(data.value).toFixed(0) : null}
						</Typography>
					);
				}
			},
			{
				name: 'supplier_comments',
				header: 'Supplier Remark',
				minWidth: 260,
				sortable: false,
				editable: false,
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'emp_1',
				header: 'Checker 1',
				headerAlign: 'start',
				textAlign: 'left',
				minWidth: 50,
				maxWidth: 110,
				addInHidden: true,
				sortable: false,
				openInDialog: true,
				renderEditor: (editorProps: any) => {
					return <DDTextFieldEditor {...editorProps} />;
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
							{data && data.emp_1 && data.emp_1.name ? data.emp_1.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'emp_2',
				header: 'Checker 2',
				headerAlign: 'start',
				textAlign: 'left',
				minWidth: 50,
				maxWidth: 110,
				addInHidden: true,
				sortable: false,
				openInDialog: true,
				renderEditor: (editorProps: any) => {
					return <DDTextFieldEditor {...editorProps} />;
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
							{data && data.emp_2 && data.emp_2.name ? data.emp_2.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'emp_3',
				header: 'Checker 3',
				headerAlign: 'start',
				textAlign: 'left',
				minWidth: 50,
				maxWidth: 110,
				addInHidden: true,
				sortable: false,
				openInDialog: true,
				renderEditor: (editorProps: any) => {
					return <DDTextFieldEditor {...editorProps} />;
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
							{data && data.emp_3 && data.emp_3.name ? data.emp_3.name : ''}
						</Typography>
					);
				}
			},
			{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
		];
	};

	// add your appointment state  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {
			trans_date: dayjs(new Date()).format('YYYY-MM-DD')
		},
		touched: null,
		errors: null
	});

	console.log(isSubmitting, errors);

	const [supplierLoading, setSupplierLoading] = useState(false);
	const [supplierInputValue, setSupplierInputValue] = useState('');
	const [supplierOptions, setSupplierOptions] = useState<tenderlotimportsState[]>([]);
	const throttledInputSupplierValue = useThrottle(supplierInputValue, 400);

	const [tenderNoLoading, setTenderNoLoading] = useState(false);
	const [tenderNoInputValue, setTenderNoInputValue] = useState('');
	const [tenderNoOptions, setTenderNoOptions] = useState<tenderlotimportsState[]>([]);
	const throttledInputTenderNoValue = useThrottle(tenderNoInputValue, 400);

	/*** Dialogbox */
	const [dropDownData, setDropDownData] = useState([]);

	const [gridActiveCell, setGridActiveCell] = useState<any>({});

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());
	const [fileName, setFileName] = useState<any>([]);
	const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false);
	const [uppyDashboard, setUppyDashboard] = useState<any>(null);
	const [checkTender, setCheckTender] = useState<any>(false);

	const [editMode, setEditMode] = useState<boolean>(false);

	const [recordEdit, setRecordEdit] = useState<any>(false);
	const confirm = useConfirm();
	const [viewButton, setViewButton] = useState<any>(false);
	const [editButton, setEditButton] = useState<any>(true);
	const [deleteButton, setDeleteButton] = useState<any>(true);
	const [cancelButton, setCancelButton] = useState<any>(false);
	console.log(setCancelButton);
	const [saveButton, setSaveButton] = useState<any>(true);
	const [addButton, setAddButton] = useState<any>(false);
	const [seq, setSeq] = useState<any>('');

	// *** REDUCER *** //

	// *** add your useEffect ( Order must be empty dependancy first, ... , success, error)  👿

	useEffect(() => {
		return () => {
			dispatch(tenderlotimportsActions.reset());
		};
	}, []);

	useEffect(() => {
		const uppy = new Uppy({
			restrictions: {
				maxNumberOfFiles: 2,
				minNumberOfFiles: 1,
				allowedFileTypes: ['.xls', '.xlsx']
			}
		}).use(Dashboard, {
			inline: false,
			showProgressDetails: true,
			proudlyDisplayPoweredByUppy: false
		});

		switch (UPLOADER) {
			case 's3':
				uppy.use(XHR, { endpoint: ENDPOINT_BASE_URL });
				break;
			default:
		}

		if (RESTORE) {
			uppy.use(GoldenRetriever, { serviceWorker: true });
		}

		uppy.on('complete', result => {
			if (result.failed.length === 0) {
			} else {
			}
			const successfulFileNames = result.successful.map(file => file.name);
			setFileName(successfulFileNames.join(', '));
		});

		setUppyDashboard(uppy);
	}, []);

	const openUppyDashboard = () => {
		if (uppyDashboard && checkTender === true) {
			uppyDashboard.getPlugin('Dashboard').openModal();
		} else {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Select tender number first',
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
	};
	//checker success code
	useEffect(() => {
		if (getAttendeeSuccess) {
			if (getAttendeeSuccess?.results) {
				if (getAttendeeSuccess?.columnType === 'emp_1') {
					if (getAttendeeSuccess?.results && getAttendeeSuccess?.results.length > 0) {
						setDropDownData(getAttendeeSuccess?.results);
					} else {
						setDropDownData([]);
					}
				} else if (getAttendeeSuccess?.columnType === 'emp_2') {
					if (getAttendeeSuccess?.results && getAttendeeSuccess?.results.length > 0) {
						setDropDownData(getAttendeeSuccess?.results);
					} else {
						setDropDownData([]);
					}
				} else if (getAttendeeSuccess?.columnType === 'emp_3') {
					if (getAttendeeSuccess?.results && getAttendeeSuccess?.results.length > 0) {
						setDropDownData(getAttendeeSuccess?.results);
					} else {
						setDropDownData([]);
					}
				}
			}
		}
	}, [getAttendeeSuccess]);

	useEffect(() => {
		if (getSuccess) {
			if (getSuccess?.results) {
				setDataSource(getSuccess?.results);
			} else {
				setDataSource([]);
			}
		}
	}, [getSuccess]);

	// useEffect(() => {
	// 	if (gridRef && !initialFocus) {
	// 		requestAnimationFrame(() => {
	// 			initialFocus = true;
	// 			gridRef?.current.focus();
	// 		});
	// 	}
	// }, [gridRef]);

	useEffect(() => {
		dispatch(tenderlotimportsActions.reset());
		if (throttledInputSupplierValue === '' && pageState?.touched?.supplier) {
			setSupplierLoading(true);
			dispatch(
				tenderlotimportsActions.getSupplier({
					QueryParams: `pagination=false&q=supplier='true'`
				})
			);
			return undefined;
		} else if (throttledInputSupplierValue !== '') {
			setSupplierLoading(true);
			dispatch(
				tenderlotimportsActions.getSupplier({
					QueryParams: `q=supplier = 'True' and name like '%${throttledInputSupplierValue}%'`
				})
			);
		}
	}, [throttledInputSupplierValue]);

	// supplier function
	useEffect(() => {
		if (getSupplierSuccess) {
			if (getSupplierSuccess?.results) {
				setSupplierOptions(getSupplierSuccess?.results);
			} else {
				setSupplierOptions([]);
			}
		}
		setSupplierLoading(false);
	}, [getSupplierSuccess]);

	// tender no function
	useEffect(() => {
		dispatch(tenderlotimportsActions.reset());
		if (throttledInputTenderNoValue === '' && pageState?.touched?.tender) {
			setTenderNoLoading(true);
			dispatch(
				tenderlotimportsActions.getTenderNo({
					QueryParams: `page=1&limit=5000000&pagination=false`
				})
			);
			return undefined;
		} else if (throttledInputTenderNoValue !== '') {
			setTenderNoLoading(true);
			dispatch(
				tenderlotimportsActions.getTenderNo({
					QueryParams: `q=${throttledInputTenderNoValue}`
				})
			);
		}
	}, [throttledInputTenderNoValue]);

	useEffect(() => {
		if (getTenderNoSuccess) {
			if (getTenderNoSuccess?.results) {
				setTenderNoOptions(getTenderNoSuccess?.results);
			} else {
				setTenderNoOptions([]);
			}
		}
		setTenderNoLoading(false);
	}, [getTenderNoSuccess]);

	const handleFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = Filter(options, state);
		return filtered;
	};

	// Filter Based On Checked and Unchecked
	const filteredData = dataSource.filter((data: { selection: boolean }) => {
		if (filterValue === 'All') {
			return true; // Show all rows
		} else if (filterValue === 'Yes') {
			return data.selection === true;
		} else if (filterValue === 'No') {
			return data.selection === false;
		}
		return false;
	});

	const handleSupplierChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const SupplierVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			supplier: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				supplier: SupplierVal
			},
			touched: {
				...pageState.touched,
				supplier: true
			}
		}));

		if (!newValue) {
			dispatch(
				tenderlotimportsActions.getSupplier({
					QueryParams: `pagination=false&q=supplier='true`
				})
			);
		}
	};

	const handleTenderNoChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		if (newValue && newValue.seq_no) {
			dispatch(
				tenderlotimportsActions.getTenderNoSelect({ QueryParams: `${newValue.seq_no}` })
			);
			setPageState(pageState => ({
				...pageState,
				values: {
					...pageState.values,
					tender: {
						seq_no: newValue.seq_no,
						tender: newValue.name
					}
				},
				touched: {
					...pageState.touched,
					tender: true
				}
			}));
			setCheckTender(true);
		} else {
			setPageState(pageState => ({
				...pageState,
				values: {
					...pageState.values,
					tender: 'TenderNoVal'
				},
				touched: {
					...pageState.touched,
					tender: true
				}
			}));
			setCheckTender(false);
		}

		if (!newValue) {
			dispatch(
				tenderlotimportsActions.getTenderNo({
					QueryParams: `page=1&limit=5000000&pagination=false`
				})
			);
		}
	};

	const handleView = () => {
		setOpenAddDrawer(true);
	};

	const handleDrawerToggle = () => {
		setOpenAddDrawer(false);
	};

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

			dispatch(tenderlotimportsActions.get({ QueryParams: queryStirng }));
		}
	}, [addSuccess]);

	const handleLoadButtonChange = () => {
		if (fileName.length > 0) {
			dispatch(
				tenderlotimportsActions.get({
					QueryParams: `'${fileName}'&${pageState.values?.supplier.seq_no}`
				})
			);
			// setFileName([]);
		} else {
			setDataSource([]);
		}
		dispatch(tenderlotimportsActions.reset());
	};

	// set value to grid and form

	useEffect(() => {
		if (getOneDetSuccess) {
			if (getOneDetSuccess?.results) {
				setPageState(pageState => ({
					...pageState,
					values: {
						...pageState.values,

						tender_lot_mas: {
							...getOneDetSuccess?.results.tender_lot_mas
						},
						tender_lot_det: {
							...getOneDetSuccess?.results.tender_lot_det
						}
					}
				}));
			}

			reset(getOneDetSuccess?.results.tender_lot_mas);
			reset(getOneDetSuccess?.results.tender_lot_Det);
			setDataSource(getOneDetSuccess?.results.tender_lot_det);
		}
	}, [getOneDetSuccess]);

	// tender no select function
	useEffect(() => {
		if (getTenderNoSelectSuccess) {
			if (getTenderNoSelectSuccess?.results) {
				setPageState(pageState => ({
					...pageState,
					values: {
						...pageState.values,
						supplier: getTenderNoSelectSuccess?.results.supplier,
						tender_name: getTenderNoSelectSuccess.results.tender_name,
						end_date: getTenderNoSelectSuccess?.results.end_date,
						start_date: getTenderNoSelectSuccess?.results.start_date
					},
					touched: {
						...pageState.touched,
						tender: true
					}
				}));
			}
			// reset(getTenderNoSelectSuccess?.results);
			let result = JSON.parse(JSON.stringify(getTenderNoSelectSuccess?.results));
			result['trans_date'] = dayjs(new Date()).format('YYYY-MM-DD');
			reset(result);
			dispatch(tenderlotimportsActions.reset());
		}
	}, [getTenderNoSelectSuccess]);

	useEffect(() => {});

	useEffect(() => {
		if (recordEdit) {
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				//setFocus('tender_no');
			}, 100);
		}
	}, [recordEdit]);

	const handleChange = (event: any) => {
		event.persist();

		if (recordEdit) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					['tender_lot_mas']: {
						...pageState.values['tender_lot_mas'],
						['trans_date']:
							event.target.type === 'checkbox'
								? event.target.checked
								: event.target.value
					}
				}
			}));
		} else {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					[event.target.name]:
						event.target.type === 'checkbox'
							? event.target.checked
							: event.target.value.toUpperCase()
				},
				touched: {
					...pageState.touched,
					[event.target.name]: true
				}
			}));
		}
	};

	const childPropsTenderLot = (array: any, data?: any) => {
		dispatch(tenderlotimportsActions.getOneDet(array?.seq_no));
	};

	const handleEditClick = () => {
		setRecordEdit(true);
		setEditMode(true);
		setSaveButton(false);
		setAddButton(true);
		setDeleteButton(true);
		setViewButton(true);
		setEditButton(true);
	};

	const handleAddClick = () => {
		setEditMode(false);
		setSaveButton(false);
		setViewButton(true);
		setAddButton(true);
		setEditButton(true);
		setDeleteButton(true);
		setDataSource([]);
		setPageState({
			isValid: false,
			values: {
				trans_date: dayjs(new Date()).format('YYYY-MM-DD')
			},
			touched: null,
			errors: null
		});
		reset(pageState.values);
		setEditMode(!editMode);
		const timer = setTimeout(() => {
			clearTimeout(timer);
			onFirstElementFocus();
		}, 500);
	};

	const handleCancel = () => {
		setEditMode(false);
		setEditButton(true);
		setDeleteButton(true);
		setSaveButton(true);
		setAddButton(false);
		setViewButton(false);
		setDataSource([]);

		reset(pageState.values.tender);
		setPageState({
			isValid: false,
			values: {
				trans_date: dayjs(new Date()).format('YYYY-MM-DD')
			},
			touched: null,
			errors: null
		});
		reset();
	};

	const handleDelete = (event: any) => {
		if (pageState.values) {
			confirm({
				description: 'Are you sure delete tender details ?',
				confirmationButtonProps: { autoFocus: true },
				confirmationText: 'Yes',
				cancellationText: 'No'
			})
				.then(() => {
					// const stateArr = deleteRow(pageState, 'seq_no', data, rowIndex);
					// return stateArr;

					dispatch(
						tenderlotimportsActions.delete({
							seq_no: pageState.values.tender_lot_mas.seq_no
						})
					);
					setDataSource([]);
					setPageState({
						isValid: false,
						values: {},
						touched: null,
						errors: null
					});
					reset(pageState.values);
					dispatch(
						actions.openSnackbar({
							open: true,
							message: 'Record Delete Successfully',
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
					setEditButton(true);
					setDeleteButton(true);
					setEditMode(false);
				})
				.catch(() => {
					/* */
				});
		}
	};

	// Editable React Data table

	// const onEditStart = () => {
	// 	inEdit = true;
	// };

	// const onEditStop = () => {
	// 	requestAnimationFrame(() => {
	// 		inEdit = false;
	// 		gridRef.current.focus();
	// 	});
	// };

	// const onKeyDown = async (event: any) => {
	// 	const edited = await onTableKeyDown(event, inEdit, gridRef);

	// 	if (edited && edited.colName === 'emp_1') {
	// 		dispatch(
	// 			tenderlotimportsActions.getAttendee({
	// 				QueryParams: `columnType=emp_1&pagination=false&q=type='E'`
	// 			})
	// 		);
	// 	}
	// 	if (edited && edited.colName === 'emp_2') {
	// 		dispatch(
	// 			tenderlotimportsActions.getAttendee({
	// 				QueryParams: `columnType=emp_2&pagination=false&q=type='E'`
	// 			})
	// 		);
	// 	}
	// 	if (edited && edited.colName === 'emp_3') {
	// 		dispatch(
	// 			tenderlotimportsActions.getAttendee({
	// 				QueryParams: `columnType=emp_3&pagination=false&q=type='E'`
	// 			})
	// 		);
	// 	}
	// 	if (!edited) {
	// 		const grid = gridRef.current;
	// 		const [rowIndex, colIndex] = grid.computedActiveCell;
	// 		const rowCount = grid.count;

	// 		if (event.key === 'Tab') {
	// 			event.preventDefault();
	// 		}

	// 		if (event.key === 'Delete') {
	// 			const data = [...dataSource];

	// 			confirm({
	// 				description: 'Are you sure delete Checker ?',
	// 				confirmationButtonProps: { autoFocus: true },
	// 				confirmationText: 'Yes',
	// 				cancellationText: 'No'
	// 			})
	// 				.then(() => {
	// 					const stateArr = deleteRow(pageState, 'seq_no', data, rowIndex);
	// 					return stateArr;
	// 				})
	// 				.then(stateArr => {
	// 					setPageState(value => ({
	// 						...value,
	// 						values: {
	// 							...pageState.values,
	// 							para: stateArr
	// 						}
	// 					}));

	// 					data.splice(rowIndex, 1);
	// 					setDataSource(data);
	// 				})
	// 				.catch(() => {
	// 					/* */
	// 				});
	// 		}

	// 		if (event.key === 'Insert' || (event.key === 'Enter' && rowIndex === rowCount - 1)) {
	// 			let isLastEditableColumn = false;
	// 			if (event.key === 'Enter') {
	// 				let LastEditCol = Math.floor(Math.random() * 100 + 10000);

	// 				for (let index = columns.length - 1; index >= 0; index--) {
	// 					const column = grid.getColumnBy(index);

	// 					if (column) {
	// 						if (column.editable === false || column.skipNavigation === true) {
	// 							/* empty */
	// 						} else {
	// 							LastEditCol = index;
	// 							break;
	// 						}
	// 					}
	// 				}

	// 				if (colIndex === LastEditCol) {
	// 					isLastEditableColumn = true;
	// 					await delay(20);
	// 				}
	// 			}

	// 			const { insertNew, data, stateArr } = await insertNewRow(
	// 				pageState,
	// 				FormSchema,
	// 				newRowDataSource,
	// 				rowIndex,
	// 				isLastEditableColumn,
	// 				event.key
	// 				// { is_active: true }
	// 			);

	// 			event.preventDefault();

	// 			if (insertNew) {
	// 				// *** set table with new data
	// 				setDataSource(data);

	// 				// *** set state for api
	// 				setPageState(value => ({
	// 					...value,
	// 					values: {
	// 						...pageState.values,
	// 						para: stateArr
	// 					}
	// 				}));

	// 				// *** Focus on first cell of new added row
	// 				setActiveCell([data.length - 1, 0]);
	// 				setTimeout(() => {
	// 					const column = grid.getColumnBy(0);
	// 					grid.startEdit({ columnId: column.name, rowIndex: data.length - 1 });
	// 				}, 0);
	// 			}
	// 		}
	// 	}
	// };

	// const onEditComplete = useCallback(
	// 	async ({ value, columnId, rowIndex }: any) => {
	// 		if (value === '' || value || typeof value === 'boolean') {
	// 			if (typeof value === 'string') {
	// 				value = value.trim();
	// 			}

	// 			const { stateArr, data } = await prepareOnEditComplete(
	// 				columns,
	// 				dataSource,
	// 				value,
	// 				columnId,
	// 				rowIndex,
	// 				pageState,
	// 				'seq_no'
	// 			);
	// 			// Add rows to in pageState
	// 			setPageState(value => ({
	// 				...value,
	// 				values: {
	// 					...pageState.values,
	// 					para: stateArr
	// 				}
	// 			}));
	// 			setDataSource(data);
	// 		}
	// 	},
	// 	[dataSource]
	// );
	const onSubmit = async () => {};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		if (dataSource.length > 0) {
			if (recordEdit) {
				const updatedTenderLotMas = {
					trans_date: pageState.values.tender_lot_mas.trans_date,
					supplier: pageState.values.tender_lot_mas.supplier,
					end_date: pageState.values.tender_lot_mas.end_date,
					start_date: pageState.values.tender_lot_mas.start_date,
					tender: pageState.values.tender_lot_mas.tender,
					action: 'update'
				};

				const updatedTenderLotDet = dataSource.map((data: any) => ({
					...data,
					action: 'update'
				}));

				const updatedData = {
					tender_lot_mas: updatedTenderLotMas,
					tender_lot_det: updatedTenderLotDet
				};
				dispatch(tenderlotimportsActions.add(updatedData));
			} else {
				const tender_lot_mas = {
					trans_date: pageState.values.trans_date,
					supplier: pageState.values.supplier,
					tender_name: pageState.values.tender_name,
					end_date: pageState.values.end_date,
					start_date: pageState.values.start_date,
					tender: pageState.values.tender,
					action: 'insert'
				};

				const tender_lot_det = dataSource.map((data: any) => ({
					...data,
					action: 'insert'
				}));

				const postData = {
					tender_lot_mas,
					tender_lot_det
				};

				dispatch(tenderlotimportsActions.add(postData));
			}
			setRecordEdit(false);
			setEditMode(!editMode);
			setAddButton(false);
			setViewButton(false);
			setSaveButton(!saveButton);
			setFileName([]);
			setDataSource([]);
			const emptyPageState = {
				isValid: false,
				values: {},
				touched: null,
				errors: null
			};

			setPageState(emptyPageState);
			reset(emptyPageState.values);
		} else {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Detail must be filled',
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
	};

	const onTableDataChange = useCallback(
		async (obj: any) => {
			console.log('INFINITE-DATAGRID', 'SHAPE PAGE', 'onTableDataChange', obj);
			const { table, type, subType, data, rowIndex, colIndex } = obj;
			switch (type) {
				case 'delete-row':
					const stateArr = await deleteRow(pageState, 'seq_no', data, rowIndex);

					setPageState(value => ({
						...value,
						values: {
							...pageState.values,
							para: stateArr
						}
					}));

					const deleteData = [...data];
					deleteData.splice(rowIndex, 1);
					setDataSource(deleteData);
					break;

				case 'insert-row':
					const {
						insertNew,
						data: insertData,
						stateArr: insertStateArr
					} = await insertNewRow(
						pageState, // State for track row insert, update or delete
						FormSchema, // for validation
						dataSource, // table data
						rowIndex, // row number
						obj.isLastEditableColumn,
						obj.eventKey,
						{ is_active: true }
					);

					if (insertNew) {
						// *** set table with new data
						setDataSource(insertData);

						// *** set state for api
						setPageState(value => ({
							...value,
							values: {
								...pageState.values,
								para: insertStateArr
							}
						}));

						console.log('HELLLLLLOO insert row', obj.eventKey);

						// *** Focus on first cell of new added row
						setGridActiveCell({
							type: 'insert-row',
							row: insertData.length - 1,
							col: 0
						});
					}

					break;
				case 'dialog-data-change':
					const { dialogObj, rowSelectedObj } = obj;

					if (subType === 'handle-change') {
						// **** NOTE ***
						// *** Static Data in ComboBox then Just filter data and set State of dropDownData here
						dispatch(tenderlotimportsActions.reset());
						if (dialogObj && dialogObj.selectedColumn.column.name === 'emp_1') {
							dispatch(
								tenderlotimportsActions.getAttendee({
									QueryParams: `columnType=emp_1&pagination=false&q=type='E'`
								})
							);
						}
						if (dialogObj && dialogObj.selectedColumn.column.name === 'emp_2') {
							dispatch(
								tenderlotimportsActions.getAttendee({
									QueryParams: `columnType=emp_2&pagination=false&q=type='E'`
								})
							);
						}
						if (dialogObj && dialogObj.selectedColumn.column.name === 'emp_3') {
							dispatch(
								tenderlotimportsActions.getAttendee({
									QueryParams: `columnType=emp_3&pagination=false&q=type='E'`
								})
							);
						}

						// if (
						// 	dialogObj &&
						// 	(dialogObj.selectedColumn.column.name === 'price' ||
						// 		dialogObj.selectedColumn.column.name === 'disc')
						// ) {
						// 	const columnName =
						// 		dialogObj.selectedColumn.column.name === 'price'
						// 			? 'price_seq'
						// 			: 'disc_seq';
						// 	dispatch(
						// 		shapeActions.get({
						// 			QueryParams:
						// 				dialogObj.value.length !== 0
						// 					? `columnType=${columnName}&limit=10&q=` +
						// 					  dialogObj.value
						// 					: `page=1&limit=500&pagination=false&columnType=${columnName}`
						// 		})
						// 	);
						// }
					} else if (subType === 'handle-row-selected') {
						const { stateArr: dialogStateArr, data: dialogData } =
							await prepareOnEditComplete(
								columns,
								dataSource,
								rowSelectedObj.originData,
								rowSelectedObj.selectedColumn.column.name,
								rowSelectedObj.selectedColumn.rowIndex,
								pageState,
								'seq_no'
							);
						// Add rows to in pageState
						setPageState(value => ({
							...value,
							values: {
								...pageState.values,
								para: dialogStateArr
							}
						}));

						setDataSource(dialogData);

						setGridActiveCell({
							type: 'dialog-data-change',
							subType: 'handle-row-selected',
							rowIndex,
							colIndex
						});
					}
					break;
				case 'on-edit-complete':
					const { value, columnId } = obj;

					const { stateArr: onEditStateArr, data: onEditData } =
						await prepareOnEditComplete(
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
							para: onEditStateArr
						}
					}));

					setDataSource(onEditData);
					break;

				default:
					break;
			}
		},
		[dataSource]
	);

	return (
		<>
			<div id="tender-lot-main-box">
				<div id="tenderLot-container">
					<Box id="form-main" ref={formRef} onKeyUp={(event: any) => onEnterKey(event)}>
						<MainCard content={false} ref={refPage as any} tabIndex={-1}>
							<FormContainer
								onSuccess={() => onSubmit()}
								formContext={formContext}
								FormProps={{ autoComplete: 'off' }}>
								<Grid
									container
									spacing={0.5}
									alignItems="center"
									style={{ marginTop: '5px' }}>
									<Grid item xs={2}></Grid>
									<Grid
										item
										xs={4}
										container
										alignItems="center"
										id="textfield-margin">
										<Grid item xs={3}>
											<Typography variant="subtitle1">ID</Typography>
										</Grid>
										<Grid item xs={3.5}>
											<TextFieldElement
												className="custom-textfield
												 disabled-textfield"
												disabled={true}
												fullWidth
												variant="outlined"
												placeholder="Enter id"
												name="tender.seq_no"
											/>
										</Grid>
									</Grid>
									<Grid
										item
										xs={4}
										container
										alignItems="center"
										id="textfield-margin">
										<Grid item xs={3}>
											<Typography variant="subtitle1">Date</Typography>
										</Grid>
										<Grid item xs={3}>
											<TextFieldElement
												className={`custom-textfield ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												type="date"
												disabled={!editMode}
												fullWidth
												variant="outlined"
												name="trans_date"
												onChange={handleChange}
											/>
										</Grid>
									</Grid>
									<Grid item xs={2}></Grid>
									<Grid item xs={2}></Grid>
									<Grid
										item
										xs={4}
										container
										alignItems="center"
										id="textfield-margin">
										<Grid item xs={3}>
											<Typography variant="subtitle1">Tender No</Typography>
										</Grid>
										<Grid
											item
											xs={5}
											className={`common-auto ${
												!editMode ? 'disabled-textfield' : ''
											}`}>
											<AutocompleteElement
												loading={tenderNoLoading}
												autocompleteProps={{
													disabled: !editMode,
													selectOnFocus: true,
													clearOnBlur: true,
													handleHomeEndKeys: true,
													freeSolo: true,
													forcePopupIcon: true,
													autoHighlight: true,
													openOnFocus: true,
													autoFocus: true,
													onChange: (event, value, reason, details) =>
														handleTenderNoChange(
															event,
															value,
															reason,
															details
														),
													filterOptions: (options, state) =>
														handleFilterOptions(options, state),
													getOptionLabel: option => {
														if (typeof option === 'string') {
															return option;
														}
														if (option.inputValue) {
															return option.inputValue;
														}
														return option.tender.name;
													}
												}}
												name="tender_no"
												options={tenderNoOptions}
												textFieldProps={{
													InputProps: {},
													onChange: e =>
														setTenderNoInputValue(e.target.value),
													onFocus: () => {
														if (
															tenderNoOptions &&
															tenderNoOptions.length === 0
														) {
															dispatch(
																tenderlotimportsActions.getTenderNo(
																	{
																		QueryParams: `page=1&limit=5000000&pagination=false`
																	}
																)
															);
														}
													}
												}}
											/>
										</Grid>
									</Grid>
									<Grid
										item
										xs={4}
										container
										alignItems="center"
										id="textfield-margin">
										<Grid item xs={3}>
											<Typography variant="subtitle1">
												Supplier Name
											</Typography>
										</Grid>
										<Grid
											item
											xs={5}
											// className="common-auto"
											className={`common-auto ${
												!editMode ? 'disabled-textfield' : ''
											}`}>
											<AutocompleteElement
												loading={supplierLoading}
												autocompleteProps={{
													disabled: true,
													selectOnFocus: true,
													clearOnBlur: true,
													handleHomeEndKeys: true,
													freeSolo: true,
													forcePopupIcon: true,
													autoHighlight: true,
													openOnFocus: true,
													onChange: (event, value, reason, details) =>
														handleSupplierChange(
															event,
															value,
															reason,
															details
														),
													filterOptions: (options, state) =>
														handleFilterOptions(options, state),
													getOptionLabel: option => {
														if (typeof option === 'string') {
															return option;
														}
														if (option.inputValue) {
															return option.inputValue;
														}
														return option.name;
													}
												}}
												name="supplier"
												options={supplierOptions}
												textFieldProps={{
													InputProps: {},
													onChange: e =>
														setSupplierInputValue(e.target.value),
													onFocus: () => {
														if (
															supplierOptions &&
															supplierOptions.length === 0
														) {
															dispatch(
																tenderlotimportsActions.getSupplier(
																	{
																		QueryParams: `pagination=false&q=supplier='true'`
																	}
																)
															);
														}
													}
												}}
											/>
										</Grid>
									</Grid>
									<Grid item xs={2}></Grid>
									<Grid item xs={2}></Grid>
									<Grid
										item
										xs={4}
										container
										alignItems="center"
										id="textfield-margin">
										<Grid item xs={3}>
											<Typography variant="subtitle1">Start Date</Typography>
										</Grid>
										<Grid item xs={3}>
											<TextFieldElement
												className={`custom-textfield ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												// className="custom-textfield"
												type="date"
												fullWidth
												variant="outlined"
												name="start_date"
												disabled
											/>
										</Grid>
									</Grid>
									<Grid
										item
										xs={4}
										container
										alignItems="center"
										id="textfield-margin">
										<Grid item xs={3}>
											<Typography variant="subtitle1">End Date</Typography>
										</Grid>
										<Grid item xs={3}>
											<TextFieldElement
												className={`custom-textfield ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												// className="custom-textfield"
												type="date"
												fullWidth
												variant="outlined"
												name="end_date"
												disabled
											/>
										</Grid>
									</Grid>
									<Grid item xs={2}></Grid>
									<Grid item xs={2}></Grid>
									<Grid
										item
										xs={4}
										container
										alignItems="center"
										id="textfield-margin">
										<Grid item xs={3}>
											<Typography variant="subtitle1"></Typography>
										</Grid>
										<Button
											className="custom-button-load"
											variant="contained"
											onClick={openUppyDashboard}>
											Import
										</Button>

										<Grid item xs={5}>
											<Button
												className="custom-button-load"
												variant="contained"
												style={{ marginLeft: '10px' }}
												onClick={handleLoadButtonChange}>
												Load
											</Button>
										</Grid>
									</Grid>
									<Grid
										item
										xs={4}
										container
										alignItems="center"
										id="textfield-margin">
										<Grid item xs={3}>
											<Typography variant="subtitle1">
												Lot Selected
											</Typography>
										</Grid>
										<Grid item xs={8}>
											<select
												style={{
													outline: 'none',
													width: '5rem',
													height: '1.6rem',
													borderRadius: '3px'
												}}
												className={`custom-textfield ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												disabled={!editMode}
												value={filterValue}
												onChange={e => setFilterValue(e.target.value)}>
												<option value="All">All</option>
												<option value="Yes">Yes</option>
												<option value="No">No</option>
											</select>
										</Grid>
									</Grid>

									<Grid item xs={2}></Grid>
									<Grid item xs={2}></Grid>
									<Grid
										item
										xs={4}
										container
										alignItems="center"
										id="textfield-margin">
										<Grid item xs={3}>
											<Typography variant="subtitle1"></Typography>
										</Grid>
										<Grid item xs={5}></Grid>
									</Grid>
								</Grid>
								<div>
									<p className="xls-file-para">{fileName}</p>
								</div>
								<div>
									{/* <MainCard content={false} ref={refPage as any} tabIndex={-1}> */}
									{/* <ReactDataGrid
										handle={setGridRef}
										idProperty="seq_no"
										style={gridStyle}
										columns={columns}
										dataSource={filteredData}
										editable={editMode}
										activeCell={activeCell}
										onActiveCellChange={setActiveCell}
										onEditStart={onEditStart}
										onEditStop={onEditStop}
										onKeyDown={onKeyDown}
										onEditComplete={onEditComplete}
										rowHeight={21}
										summaryReducer={summaryReducer}
										footerRows={footerRows}
										showColumnMenuTool={false}
										showZebraRows={false}
									/> */}
									<InfiniteDataGrid
										tableName={'primary'}
										idProperty="seq_no"
										nativeScroll={true}
										initParams={initParams}
										columns={columns}
										dataSource={dataSource}
										onTableDataChange={onTableDataChange}
										style={gridStyle}
										gridActiveCell={gridActiveCell}
										dropDownDataSource={dropDownData}
										editable={true}
										groups={[
											{
												name: 'base',
												header: (
													<span
														style={{
															display: 'flex',
															justifyContent: 'center'
														}}>
														Base
													</span>
												)
											}
										]}
										rowHeight={21}
										headerHeight={22}
										showColumnMenuTool={false}
										showZebraRows={false}
										dialogColumns={dialogColumns}
										//focus={true}
										licence={licenceType.enterprise}
										footerRows={footerRows}
										summaryReducer={summaryReducer}
									/>
								</div>
							</FormContainer>
							<Grid container spacing={0.5} className="footer-main-dev-button">
								<Grid item xs={0.85} className="address-btn">
									<Button
										ref={addButtonRef}
										className="custom-button"
										variant="outlined"
										fullWidth
										placeholder="ADD"
										disabled={addButton}
										onClick={handleAddClick}
										size="small">
										+ Add
									</Button>
								</Grid>
								<Grid item xs={0.85} className="address-btn">
									<Button
										className="custom-button"
										variant="outlined"
										fullWidth
										placeholder="edit"
										onClick={handleEditClick}
										disabled={editButton}
										size="small">
										Edit
									</Button>
								</Grid>
								<Grid item xs={0.85} className="address-btn">
									<Button
										className="custom-button"
										variant="outlined"
										fullWidth
										placeholder="edit"
										size="small"
										disabled={deleteButton}
										onClick={handleDelete}>
										Delete
									</Button>
								</Grid>
								<Grid item xs={0.85} className="address-btn">
									<Button
										ref={viewButtonRef}
										onClick={handleView}
										className="custom-button"
										variant="outlined"
										fullWidth
										placeholder="VIEW"
										disabled={viewButton}
										size="small">
										View
									</Button>
								</Grid>
								<Grid item xs={0.85} className="address-btn">
									<Button
										className="custom-button"
										onClick={e => handleSubmit(e)}
										onKeyDown={e => (e.key === 'Enter' ? handleSubmit(e) : '')}
										disableElevation
										type="submit"
										variant={saveButton ? 'outlined' : 'contained'}
										color="primary"
										disabled={saveButton}
										ref={buttonRef}>
										Save
									</Button>
								</Grid>
								<Grid item xs={0.85} className="address-btn">
									<Button
										ref={cancelButtonRef}
										className="custom-button"
										variant="outlined"
										fullWidth
										placeholder="cancel"
										disabled={cancelButton}
										onClick={handleCancel}
										size="small">
										Cancel
									</Button>
								</Grid>
							</Grid>
						</MainCard>
						{/* --------------Footer Button start from Below -------------- */}

						{openAddDrawer && (
							<InfiniteDrawer
								width={80}
								component={TenderLotImports}
								handleDrawerToggle={handleDrawerToggle}
								passProps={childPropsTenderLot}
								setSaveButton={setSaveButton}
								setEditButton={setEditButton}
								setDeleteButton={setDeleteButton}
							/>
						)}
					</Box>
				</div>
			</div>
		</>
	);
}

export default TenderLotImport;

// import { useCallback, useEffect, useState, SyntheticEvent, useRef } from 'react';
// import Uppy from '@uppy/core';
// import Dashboard from '@uppy/dashboard';
// import GoldenRetriever from '@uppy/golden-retriever';
// import XHR from '@uppy/xhr-upload';
// import '@uppy/core/dist/style.css';
// import '@uppy/dashboard/dist/style.css';
// import '@uppy/audio/dist/style.css';
// import '@uppy/screen-capture/dist/style.css';
// import '@uppy/image-editor/dist/style.css';
// import { useForm } from 'react-hook-form';
// import { useSnackBarSlice } from '@app/store/slice/snackbar';
// import { useHotkeys } from 'react-hotkeys-hook';
// import {
// 	AutocompleteChangeDetails,
// 	AutocompleteChangeReason,
// 	Button,
// 	createFilterOptions,
// 	FilterOptionsState,
// 	Grid,
// 	Checkbox,
// 	Box,
// 	Typography
// } from '@mui/material';
// import { useDispatch, useSelector } from 'react-redux';
// import { AutocompleteElement, FormContainer, TextFieldElement } from '@app/components/rhfmui';
// import { AutocompleteEditor, CheckBoxEditor, TextFieldEditor } from '@components/table/editors';
// import MainCard from '@components/MainCard';
// import { zodResolver } from '@hookform/resolvers/zod';
// import useThrottle from '@hooks/useThrottle';
// import {
// 	InitialQueryParam,
// 	InitialState,
// 	ObjecttoQueryString,
// 	onTableKeyDown,
// 	insertNewRow,
// 	deleteRow,
// 	prepareOnEditComplete,
// 	delay
// } from '@utils/helpers';
// import { FormSchema, IFormInput } from '@pages/master/tenderlotimport/models/TenderLotImport';
// import { useTenderlotimportsSlice } from '@pages/master/tenderlotimport/store/slice';
// import { tenderlotimportsSelector } from '@pages/master/tenderlotimport/store/slice/tenderlotimports.selectors';
// import { tenderlotimportsState } from '@pages/master/tenderlotimport/store/slice/types';

// import TenderLotImports from './TenderLotImports';
// import '@inovua/reactdatagrid-community/index.css';
// import { InfiniteDrawer } from '@components/drawer';
// import dayjs from 'dayjs';
// import './tenderlot.css';
// import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
// import useFocusOnEnter from '@hooks/useFocusOnEnter';
// import { useConfirm } from 'material-ui-confirm';

// const initParams = {
// 	page: 1,
// 	limit: 10,
// 	pagination: 'true'
// } as InitialQueryParam;

// const Filter = createFilterOptions();

// const UPLOADER = 's3';

// let ENDPOINT_BASE_URL: any;
// const Url = window.location.host;
// if (Url == 'dev.dxl.one') {
// 	const { REACT_APP_ENDPOINT_URL } = process.env;
// 	ENDPOINT_BASE_URL = REACT_APP_ENDPOINT_URL;
// } else {
// 	const { REACT_APP_ENDPOINT_URL_TEST } = process.env;
// 	ENDPOINT_BASE_URL = REACT_APP_ENDPOINT_URL_TEST;
// }
// const RESTORE = false;

// function TenderLotImport() {
// 	// add your Dispatch 👿
// 	const dispatch = useDispatch();

// 	// add your Slice Action  👿
// 	const { actions: tenderlotimportsActions } = useTenderlotimportsSlice();
// 	const { actions } = useSnackBarSlice();

// 	// *** tenderlotimports State *** //
// 	const tenderlotimportsState = useSelector(tenderlotimportsSelector);
// 	const {
// 		addSuccess,
// 		getSuccess,
// 		getSupplierSuccess,
// 		getTenderNoSuccess,
// 		getTenderNoSelectSuccess,
// 		getOneDetSuccess,
// 		getAttendeeSuccess
// 	} = tenderlotimportsState;

// 	// add your React Hook Form  👿
// 	const formContext = useForm<IFormInput>({
// 		resolver: zodResolver(FormSchema),
// 		mode: 'onChange',
// 		reValidateMode: 'onChange'
// 	});

// 	const {
// 		formState: { errors, isSubmitting },
// 		reset
// 	} = formContext;

// 	// const confirm = useConfirm();
// 	const [gridRef, setGridRef] = useState<any>(null); // setGridRef

// 	// add your refrence  👿
// 	const buttonRef = useRef<any>(null);
// 	const formRef = useRef();
// 	const { onFirstElementFocus, onEnterKey } = useFocusOnEnter(
// 		formRef,
// 		formContext.formState.errors
// 	);
// 	const addButtonRef = useRef<any>(null);
// 	const viewButtonRef = useRef<any>(null);
// 	const cancelButtonRef = useRef<any>(null);

// 	let refPage = [
// 		useHotkeys<any>('alt+a', () => addButtonRef.current.click()),
// 		useHotkeys<any>('alt+v', () => viewButtonRef.current.click()),
// 		useHotkeys<any>('alt+c', () => cancelButtonRef.current.click()),
// 		useHotkeys<any>('alt+s', () => buttonRef.current.click())
// 	];

// 	const [filterValue, setFilterValue] = useState('All');

// 	//style your drawer
// 	const gridStyle = { minHeight: 380 };
// 	let inEdit: boolean;
// 	let newRowDataSource: any;
// 	let initialFocus = false;
// 	const totalStyle = { minHeight: 21 };

// 	const footerRows = [
// 		{
// 			render: {
// 				parcel_no: (
// 					<div style={totalStyle}>
// 						<b>Total</b>
// 					</div>
// 				),
// 				wgt: ({ summary }: any) => (
// 					<div style={totalStyle}>
// 						<b>{summary.wgt !== 0 ? summary.wgt.toFixed(2) : 0}</b>
// 					</div>
// 				),
// 				pcs: ({ summary }: any) => (
// 					<div style={totalStyle}>
// 						<b>{summary.pcs}</b>
// 					</div>
// 				),
// 				value: ({ summary }: any) => (
// 					<div style={totalStyle}>
// 						<b>{summary.value}</b>
// 					</div>
// 				)
// 			}
// 		}
// 	];

// 	const summaryReducer = {
// 		initialValue: { wgt: 0, pcs: 0, value: 0 },
// 		reducer: (acc: any, item: any) => ({
// 			wgt: parseFloat(acc.wgt || 0) + parseFloat(item.wgt || 0),
// 			pcs: parseInt(acc.pcs || 0) + parseInt(item.pcs || 0),
// 			value: parseInt(acc.value || 0) + parseInt(item.value || 0)
// 		})
// 	};

// 	//get columns
// 	const getColumns = () => {
// 		return [
// 			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
// 			{
// 				name: 'selection',
// 				header: 'Select',
// 				width: 50,
// 				headerAlign: 'center',
// 				textAlign: 'center',
// 				sortable: false,
// 				renderEditor: (editorProps: any) => {
// 					return <CheckBoxEditor {...editorProps} />;
// 				},
// 				editorProps: {},
// 				render: ({ value }: any) => {
// 					return <Checkbox checked={value} style={{ backgroundColor: 'transparent' }} />;
// 				}
// 			},
// 			{
// 				name: 'priority_no',
// 				header: 'Priority',
// 				minWidth: 50,
// 				maxWidth: 70,
// 				sortable: false,
// 				headerAlign: 'center',
// 				textAlign: 'center',
// 				renderEditor: (editorProps: any) => {
// 					return <TextFieldEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					type: 'text'
// 				}
// 			},
// 			{
// 				name: 'minimum_checker',
// 				minWidth: 50,
// 				maxWidth: 80,
// 				sortable: false,
// 				headerAlign: 'center',
// 				textAlign: 'center',
// 				renderHeader: (params: any) => {
// 					return (
// 						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
// 							Minimum
// 							<br />
// 							Checker
// 						</div>
// 					);
// 				},
// 				renderEditor: (editorProps: any) => {
// 					return <TextFieldEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					type: 'text'
// 				}
// 			},
// 			{
// 				name: 'lot_no',
// 				header: 'Lot No',
// 				minWidth: 80,
// 				maxWidth: 120,
// 				sortable: false,
// 				editable: false,
// 				skipNavigation: true,
// 				renderEditor: (editorProps: any) => {
// 					return <TextFieldEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					type: 'text'
// 				}
// 			},
// 			{
// 				name: 'parcel_no',
// 				header: 'Parcel No',
// 				minWidth: 80,
// 				maxWidth: 120,
// 				sortable: false,
// 				editable: false,
// 				skipNavigation: true,
// 				renderEditor: (editorProps: any) => {
// 					return <TextFieldEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					type: 'text'
// 				}
// 			},
// 			{
// 				name: 'pcs',
// 				header: 'Pcs',
// 				minWidth: 50,
// 				maxWidth: 60,
// 				sortable: false,
// 				editable: false,
// 				skipNavigation: true,
// 				headerAlign: 'end',
// 				textAlign: 'right',
// 				renderEditor: (editorProps: any) => {
// 					return <TextFieldEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					type: 'text'
// 				}
// 			},
// 			{
// 				name: 'wgt',
// 				header: 'Wgt',
// 				minWidth: 50,
// 				maxWidth: 60,
// 				sortable: false,
// 				editable: false,
// 				skipNavigation: true,
// 				headerAlign: 'end',
// 				textAlign: 'right',
// 				renderEditor: (editorProps: any) => {
// 					return <TextFieldEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					type: 'text'
// 				}
// 			},
// 			{
// 				name: 'rough_size',
// 				header: 'Rough Size',
// 				minWidth: 80,
// 				maxWidth: 120,
// 				sortable: false,
// 				editable: false,
// 				skipNavigation: true,
// 				headerAlign: 'start',
// 				textAlign: 'left',
// 				renderEditor: (editorProps: any) => {
// 					return <TextFieldEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					type: 'text'
// 				}
// 			},
// 			{
// 				name: 'rough_article',
// 				header: 'Rough Article',
// 				minWidth: 200,
// 				sortable: false,
// 				editable: false,
// 				skipNavigation: true,
// 				renderEditor: (editorProps: any) => {
// 					return <TextFieldEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					type: 'text'
// 				}
// 			},
// 			{
// 				name: 'lot_description',
// 				header: 'Lot Description',
// 				minWidth: 260,
// 				sortable: false,
// 				editable: false,
// 				skipNavigation: true,
// 				renderEditor: (editorProps: any) => {
// 					return <TextFieldEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					type: 'text'
// 				}
// 			},
// 			{
// 				name: 'rate',
// 				header: 'Rate',
// 				minWidth: 40,
// 				maxWidth: 60,
// 				sortable: false,
// 				editable: false,
// 				skipNavigation: true,
// 				headerAlign: 'end',
// 				textAlign: 'right',
// 				renderEditor: (editorProps: any) => {
// 					return <TextFieldEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					type: 'text'
// 				}
// 			},
// 			{
// 				name: 'value',
// 				header: 'Value',
// 				minWidth: 60,
// 				maxWidth: 70,
// 				sortable: false,
// 				editable: false,
// 				skipNavigation: true,
// 				headerAlign: 'end',
// 				textAlign: 'right',
// 				renderEditor: (editorProps: any) => {
// 					return <TextFieldEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					type: 'text'
// 				},
// 				render: ({ data }: any) => {
// 					return (
// 						<Typography align="right">
// 							{data.value ? parseFloat(data.value).toFixed(0) : null}
// 						</Typography>
// 					);
// 				}
// 			},
// 			{
// 				name: 'supplier_comments',
// 				header: 'Supplier Remark',
// 				minWidth: 260,
// 				sortable: false,
// 				editable: false,
// 				skipNavigation: true,
// 				renderEditor: (editorProps: any) => {
// 					return <TextFieldEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					type: 'text'
// 				}
// 			},
// 			{
// 				name: 'emp_1',
// 				header: 'Checker 1',
// 				headerAlign: 'start',
// 				textAlign: 'left',
// 				minWidth: 50,
// 				maxWidth: 110,
// 				addInHidden: true,
// 				sortable: false,
// 				renderEditor: (editorProps: any) => {
// 					return <AutocompleteEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					idProperty: 'seq_no',
// 					dataSource: [],
// 					collapseOnSelect: true,
// 					clearIcon: null
// 				},
// 				render: ({ data, value }: any) => {
// 					return (
// 						<Typography>
// 							{data && data.emp_1 && data.emp_1.name ? data.emp_1.name : ''}
// 						</Typography>
// 					);
// 				}
// 			},
// 			{
// 				name: 'emp_2',
// 				header: 'Checker 2',
// 				headerAlign: 'start',
// 				textAlign: 'left',
// 				minWidth: 50,
// 				maxWidth: 110,
// 				addInHidden: true,
// 				sortable: false,
// 				renderEditor: (editorProps: any) => {
// 					return <AutocompleteEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					idProperty: 'seq_no',
// 					dataSource: [],
// 					collapseOnSelect: true,
// 					clearIcon: null
// 				},
// 				render: ({ data, value }: any) => {
// 					return (
// 						<Typography>
// 							{data && data.emp_2 && data.emp_2.name ? data.emp_2.name : ''}
// 						</Typography>
// 					);
// 				}
// 			},
// 			{
// 				name: 'emp_3',
// 				header: 'Checker 3',
// 				headerAlign: 'start',
// 				textAlign: 'left',
// 				minWidth: 50,
// 				maxWidth: 110,
// 				addInHidden: true,
// 				sortable: false,
// 				renderEditor: (editorProps: any) => {
// 					return <AutocompleteEditor {...editorProps} />;
// 				},
// 				editorProps: {
// 					idProperty: 'seq_no',
// 					dataSource: [],
// 					collapseOnSelect: true,
// 					clearIcon: null
// 				},
// 				render: ({ data, value }: any) => {
// 					return (
// 						<Typography>
// 							{data && data.emp_3 && data.emp_3.name ? data.emp_3.name : ''}
// 						</Typography>
// 					);
// 				}
// 			},
// 			{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
// 		];
// 	};

// 	// add your appointment state  👿
// 	const [pageState, setPageState] = useState<InitialState>({
// 		isValid: false,
// 		values: {
// 			trans_date: dayjs(new Date()).format('YYYY-MM-DD')
// 		},
// 		touched: null,
// 		errors: null
// 	});

// 	console.log(isSubmitting, errors);

// 	const [supplierLoading, setSupplierLoading] = useState(false);
// 	const [supplierInputValue, setSupplierInputValue] = useState('');
// 	const [supplierOptions, setSupplierOptions] = useState<tenderlotimportsState[]>([]);
// 	const throttledInputSupplierValue = useThrottle(supplierInputValue, 400);

// 	const [tenderNoLoading, setTenderNoLoading] = useState(false);
// 	const [tenderNoInputValue, setTenderNoInputValue] = useState('');
// 	const [tenderNoOptions, setTenderNoOptions] = useState<tenderlotimportsState[]>([]);
// 	const throttledInputTenderNoValue = useThrottle(tenderNoInputValue, 400);

// 	const [activeCell, setActiveCell] = useState<any>([0, 1]);

// 	const [dataSource, setDataSource] = useState<any>([]);
// 	const [columns, setColumns] = useState<any>(getColumns());
// 	const [fileName, setFileName] = useState<any>([]);
// 	const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false);
// 	const [uppyDashboard, setUppyDashboard] = useState<any>(null);
// 	const [checkTender, setCheckTender] = useState<any>(false);

// 	const [editMode, setEditMode] = useState<boolean>(false);

// 	const [recordEdit, setRecordEdit] = useState<any>(false);
// 	const confirm = useConfirm();
// 	const [viewButton, setViewButton] = useState<any>(false);
// 	const [editButton, setEditButton] = useState<any>(true);
// 	const [deleteButton, setDeleteButton] = useState<any>(true);
// 	const [cancelButton, setCancelButton] = useState<any>(false);
// 	console.log(setCancelButton);
// 	const [saveButton, setSaveButton] = useState<any>(true);
// 	const [addButton, setAddButton] = useState<any>(false);
// 	const [seq, setSeq] = useState<any>('');

// 	// *** REDUCER *** //

// 	// *** add your useEffect ( Order must be empty dependancy first, ... , success, error)  👿

// 	useEffect(() => {
// 		return () => {
// 			dispatch(tenderlotimportsActions.reset());
// 		};
// 	}, []);

// 	useEffect(() => {
// 		const uppy = new Uppy({
// 			restrictions: {
// 				maxNumberOfFiles: 2,
// 				minNumberOfFiles: 1,
// 				allowedFileTypes: ['.xls', '.xlsx']
// 			}
// 		}).use(Dashboard, {
// 			inline: false,
// 			showProgressDetails: true,
// 			proudlyDisplayPoweredByUppy: false
// 		});

// 		switch (UPLOADER) {
// 			case 's3':
// 				uppy.use(XHR, { endpoint: ENDPOINT_BASE_URL });
// 				break;
// 			default:
// 		}

// 		if (RESTORE) {
// 			uppy.use(GoldenRetriever, { serviceWorker: true });
// 		}

// 		uppy.on('complete', result => {
// 			if (result.failed.length === 0) {
// 			} else {
// 			}
// 			const successfulFileNames = result.successful.map(file => file.name);
// 			setFileName(successfulFileNames.join(', '));
// 		});

// 		setUppyDashboard(uppy);
// 	}, []);

// 	useEffect(() => {
// 		newRowDataSource = dataSource;
// 	}, [dataSource]);

// 	const openUppyDashboard = () => {
// 		if (uppyDashboard && checkTender === true) {
// 			uppyDashboard.getPlugin('Dashboard').openModal();
// 		} else {
// 			dispatch(
// 				actions.openSnackbar({
// 					open: true,
// 					message: 'Select tender number first',
// 					variant: 'alert',
// 					alert: {
// 						color: 'error'
// 					},
// 					close: false,
// 					anchorOrigin: {
// 						vertical: 'top',
// 						horizontal: 'center'
// 					}
// 				})
// 			);
// 		}
// 	};
// 	//checker success code
// 	useEffect(() => {
// 		if (getAttendeeSuccess) {
// 			if (getAttendeeSuccess?.results) {
// 				if (getAttendeeSuccess?.columnType === 'emp_1') {
// 					let Emp1Data = [];
// 					const updatedColumns = [...columns];

// 					const editorTypeColumnIndex = updatedColumns.findIndex(
// 						column => column.name === 'emp_1'
// 					);

// 					if (getAttendeeSuccess?.results && getAttendeeSuccess?.results.length > 0) {
// 						Emp1Data = getAttendeeSuccess?.results;
// 					}

// 					if (editorTypeColumnIndex !== -1) {
// 						updatedColumns[editorTypeColumnIndex].editorProps = {
// 							idProperty: 'seq_no',
// 							dataSource: Emp1Data,
// 							collapseOnSelect: true,
// 							clearIcon: null
// 						};
// 						setColumns(updatedColumns);
// 					}
// 				} else if (getAttendeeSuccess?.columnType === 'emp_2') {
// 					let Emp1Data = [];
// 					const updatedColumns = [...columns];

// 					const editorTypeColumnIndex = updatedColumns.findIndex(
// 						column => column.name === 'emp_2'
// 					);

// 					if (getAttendeeSuccess?.results && getAttendeeSuccess?.results.length > 0) {
// 						Emp1Data = getAttendeeSuccess?.results;
// 					}

// 					if (editorTypeColumnIndex !== -1) {
// 						updatedColumns[editorTypeColumnIndex].editorProps = {
// 							idProperty: 'seq_no',
// 							dataSource: Emp1Data,
// 							collapseOnSelect: true,
// 							clearIcon: null
// 						};
// 						setColumns(updatedColumns);
// 					}
// 				} else if (getAttendeeSuccess?.columnType === 'emp_3') {
// 					let Emp1Data = [];
// 					const updatedColumns = [...columns];

// 					const editorTypeColumnIndex = updatedColumns.findIndex(
// 						column => column.name === 'emp_3'
// 					);

// 					if (getAttendeeSuccess?.results && getAttendeeSuccess?.results.length > 0) {
// 						Emp1Data = getAttendeeSuccess?.results;
// 					}

// 					if (editorTypeColumnIndex !== -1) {
// 						updatedColumns[editorTypeColumnIndex].editorProps = {
// 							idProperty: 'seq_no',
// 							dataSource: Emp1Data,
// 							collapseOnSelect: true,
// 							clearIcon: null
// 						};
// 						setColumns(updatedColumns);
// 					}
// 				}
// 			}
// 		}
// 	}, [getAttendeeSuccess]);

// 	useEffect(() => {
// 		if (getSuccess) {
// 			if (getSuccess?.results) {
// 				setDataSource(getSuccess?.results);
// 			} else {
// 				setDataSource([]);
// 			}
// 		}
// 	}, [getSuccess]);

// 	useEffect(() => {
// 		if (gridRef && !initialFocus) {
// 			requestAnimationFrame(() => {
// 				initialFocus = true;
// 				gridRef?.current.focus();
// 			});
// 		}
// 	}, [gridRef]);

// 	useEffect(() => {
// 		dispatch(tenderlotimportsActions.reset());
// 		if (throttledInputSupplierValue === '' && pageState?.touched?.supplier) {
// 			setSupplierLoading(true);
// 			dispatch(
// 				tenderlotimportsActions.getSupplier({
// 					QueryParams: `pagination=false&q=supplier='true'`
// 				})
// 			);
// 			return undefined;
// 		} else if (throttledInputSupplierValue !== '') {
// 			setSupplierLoading(true);
// 			dispatch(
// 				tenderlotimportsActions.getSupplier({
// 					QueryParams: `q=supplier = 'True' and name like '%${throttledInputSupplierValue}%'`
// 				})
// 			);
// 		}
// 	}, [throttledInputSupplierValue]);

// 	// supplier function
// 	useEffect(() => {
// 		if (getSupplierSuccess) {
// 			if (getSupplierSuccess?.results) {
// 				setSupplierOptions(getSupplierSuccess?.results);
// 			} else {
// 				setSupplierOptions([]);
// 			}
// 		}
// 		setSupplierLoading(false);
// 	}, [getSupplierSuccess]);

// 	// tender no function
// 	useEffect(() => {
// 		dispatch(tenderlotimportsActions.reset());
// 		if (throttledInputTenderNoValue === '' && pageState?.touched?.tender) {
// 			setTenderNoLoading(true);
// 			dispatch(
// 				tenderlotimportsActions.getTenderNo({
// 					QueryParams: `page=1&limit=5000000&pagination=false`
// 				})
// 			);
// 			return undefined;
// 		} else if (throttledInputTenderNoValue !== '') {
// 			setTenderNoLoading(true);
// 			dispatch(
// 				tenderlotimportsActions.getTenderNo({
// 					QueryParams: `q=${throttledInputTenderNoValue}`
// 				})
// 			);
// 		}
// 	}, [throttledInputTenderNoValue]);

// 	useEffect(() => {
// 		if (getTenderNoSuccess) {
// 			if (getTenderNoSuccess?.results) {
// 				setTenderNoOptions(getTenderNoSuccess?.results);
// 			} else {
// 				setTenderNoOptions([]);
// 			}
// 		}
// 		setTenderNoLoading(false);
// 	}, [getTenderNoSuccess]);

// 	const handleFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
// 		const filtered = Filter(options, state);
// 		return filtered;
// 	};

// 	// Filter Based On Checked and Unchecked
// 	const filteredData = dataSource.filter((data: { selection: boolean }) => {
// 		if (filterValue === 'All') {
// 			return true; // Show all rows
// 		} else if (filterValue === 'Yes') {
// 			return data.selection === true;
// 		} else if (filterValue === 'No') {
// 			return data.selection === false;
// 		}
// 		return false;
// 	});

// 	const handleSupplierChange = (
// 		event: SyntheticEvent,
// 		newValue: any,
// 		reason: AutocompleteChangeReason,
// 		details: AutocompleteChangeDetails<any> | undefined
// 	) => {
// 		const SupplierVal = {
// 			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
// 			supplier: newValue && newValue.name ? newValue.name : ''
// 		};

// 		setPageState(pageState => ({
// 			...pageState,
// 			values: {
// 				...pageState.values,
// 				supplier: SupplierVal
// 			},
// 			touched: {
// 				...pageState.touched,
// 				supplier: true
// 			}
// 		}));

// 		if (!newValue) {
// 			dispatch(
// 				tenderlotimportsActions.getSupplier({
// 					QueryParams: `pagination=false&q=supplier='true`
// 				})
// 			);
// 		}
// 	};

// 	const handleTenderNoChange = (
// 		event: SyntheticEvent,
// 		newValue: any,
// 		reason: AutocompleteChangeReason,
// 		details: AutocompleteChangeDetails<any> | undefined
// 	) => {
// 		if (newValue && newValue.seq_no) {
// 			dispatch(
// 				tenderlotimportsActions.getTenderNoSelect({ QueryParams: `${newValue.seq_no}` })
// 			);
// 			setPageState(pageState => ({
// 				...pageState,
// 				values: {
// 					...pageState.values,
// 					tender: {
// 						seq_no: newValue.seq_no,
// 						tender: newValue.name
// 					}
// 				},
// 				touched: {
// 					...pageState.touched,
// 					tender: true
// 				}
// 			}));
// 			setCheckTender(true);
// 		} else {
// 			setPageState(pageState => ({
// 				...pageState,
// 				values: {
// 					...pageState.values,
// 					tender: 'TenderNoVal'
// 				},
// 				touched: {
// 					...pageState.touched,
// 					tender: true
// 				}
// 			}));
// 			setCheckTender(false);
// 		}

// 		if (!newValue) {
// 			dispatch(
// 				tenderlotimportsActions.getTenderNo({
// 					QueryParams: `page=1&limit=5000000&pagination=false`
// 				})
// 			);
// 		}
// 	};

// 	const handleView = () => {
// 		setOpenAddDrawer(true);
// 	};

// 	const handleDrawerToggle = () => {
// 		setOpenAddDrawer(false);
// 	};

// 	useEffect(() => {
// 		if (addSuccess) {
// 			dispatch(
// 				actions.openSnackbar({
// 					open: true,
// 					message: 'Save successfully.',
// 					variant: 'alert',
// 					alert: {
// 						color: 'success'
// 					},
// 					close: false,
// 					anchorOrigin: {
// 						vertical: 'top',
// 						horizontal: 'center'
// 					}
// 				})
// 			);
// 			reset();
// 			setPageState({
// 				isValid: false,
// 				values: {},
// 				touched: null,
// 				errors: null
// 			});
// 			const queryStirng = ObjecttoQueryString(initParams);

// 			dispatch(tenderlotimportsActions.get({ QueryParams: queryStirng }));
// 		}
// 	}, [addSuccess]);

// 	const handleLoadButtonChange = () => {
// 		if (fileName.length > 0) {
// 			dispatch(
// 				tenderlotimportsActions.get({
// 					QueryParams: `'${fileName}'&${pageState.values?.supplier.seq_no}`
// 				})
// 			);
// 			// setFileName([]);
// 		} else {
// 			setDataSource([]);
// 		}
// 		dispatch(tenderlotimportsActions.reset());
// 	};

// 	// set value to grid and form

// 	useEffect(() => {
// 		if (getOneDetSuccess) {
// 			if (getOneDetSuccess?.results) {
// 				setPageState(pageState => ({
// 					...pageState,
// 					values: {
// 						...pageState.values,

// 						tender_lot_mas: {
// 							...getOneDetSuccess?.results.tender_lot_mas
// 						},
// 						tender_lot_det: {
// 							...getOneDetSuccess?.results.tender_lot_det
// 						}
// 					}
// 				}));
// 			}

// 			reset(getOneDetSuccess?.results.tender_lot_mas);
// 			reset(getOneDetSuccess?.results.tender_lot_Det);
// 			setDataSource(getOneDetSuccess?.results.tender_lot_det);
// 		}
// 	}, [getOneDetSuccess]);

// 	// tender no select function
// 	useEffect(() => {
// 		if (getTenderNoSelectSuccess) {
// 			if (getTenderNoSelectSuccess?.results) {
// 				setPageState(pageState => ({
// 					...pageState,
// 					values: {
// 						...pageState.values,
// 						supplier: getTenderNoSelectSuccess?.results.supplier,
// 						tender_name: getTenderNoSelectSuccess.results.tender_name,
// 						end_date: getTenderNoSelectSuccess?.results.end_date,
// 						start_date: getTenderNoSelectSuccess?.results.start_date
// 					},
// 					touched: {
// 						...pageState.touched,
// 						tender: true
// 					}
// 				}));
// 			}
// 			// reset(getTenderNoSelectSuccess?.results);
// 			let result = JSON.parse(JSON.stringify(getTenderNoSelectSuccess?.results));
// 			result['trans_date'] = dayjs(new Date()).format('YYYY-MM-DD');
// 			reset(result);
// 			dispatch(tenderlotimportsActions.reset());
// 		}
// 	}, [getTenderNoSelectSuccess]);

// 	useEffect(() => {});

// 	useEffect(() => {
// 		if (recordEdit) {
// 			const timeout = setTimeout(() => {
// 				clearTimeout(timeout);
// 				// setFocus('tender_no');
// 			}, 100);
// 		}
// 	}, [recordEdit]);

// 	const handleChange = (event: any) => {
// 		event.persist();

// 		if (recordEdit) {
// 			setPageState(value => ({
// 				...value,
// 				values: {
// 					...pageState.values,
// 					['tender_lot_mas']: {
// 						...pageState.values['tender_lot_mas'],
// 						['trans_date']:
// 							event.target.type === 'checkbox'
// 								? event.target.checked
// 								: event.target.value
// 					}
// 				}
// 			}));
// 		} else {
// 			setPageState(value => ({
// 				...value,
// 				values: {
// 					...pageState.values,
// 					[event.target.name]:
// 						event.target.type === 'checkbox'
// 							? event.target.checked
// 							: event.target.value.toUpperCase()
// 				},
// 				touched: {
// 					...pageState.touched,
// 					[event.target.name]: true
// 				}
// 			}));
// 		}
// 	};

// 	const childPropsTenderLot = (array: any, data?: any) => {
// 		dispatch(tenderlotimportsActions.getOneDet(array?.seq_no));
// 	};

// 	const handleEditClick = () => {
// 		setRecordEdit(true);
// 		setEditMode(true);
// 		setSaveButton(false);
// 		setAddButton(true);
// 		setDeleteButton(true);
// 		setViewButton(true);
// 		setEditButton(true);
// 	};

// 	const handleAddClick = () => {
// 		setEditMode(false);
// 		setSaveButton(false);
// 		setViewButton(true);
// 		setAddButton(true);
// 		setEditButton(true);
// 		setDeleteButton(true);
// 		setDataSource([]);
// 		setPageState({
// 			isValid: false,
// 			values: {
// 				trans_date: dayjs(new Date()).format('YYYY-MM-DD')
// 			},
// 			touched: null,
// 			errors: null
// 		});
// 		reset(pageState.values);
// 		setEditMode(!editMode);
// 		const timer = setTimeout(() => {
// 			clearTimeout(timer);
// 			onFirstElementFocus();
// 		}, 500);
// 	};

// 	const handleCancel = () => {
// 		setEditMode(false);
// 		setEditButton(true);
// 		setDeleteButton(true);
// 		setSaveButton(true);
// 		setAddButton(false);
// 		setViewButton(false);
// 		setDataSource([]);

// 		reset(pageState.values.tender);
// 		setPageState({
// 			isValid: false,
// 			values: {
// 				trans_date: dayjs(new Date()).format('YYYY-MM-DD')
// 			},
// 			touched: null,
// 			errors: null
// 		});
// 		reset();
// 	};

// 	const handleDelete = (event: any) => {
// 		if (pageState.values) {
// 			confirm({
// 				description: 'Are you sure delete tender details ?',
// 				confirmationButtonProps: { autoFocus: true },
// 				confirmationText: 'Yes',
// 				cancellationText: 'No'
// 			})
// 				.then(() => {
// 					// const stateArr = deleteRow(pageState, 'seq_no', data, rowIndex);
// 					// return stateArr;

// 					dispatch(
// 						tenderlotimportsActions.delete({
// 							seq_no: pageState.values.tender_lot_mas.seq_no
// 						})
// 					);
// 					setDataSource([]);
// 					setPageState({
// 						isValid: false,
// 						values: {},
// 						touched: null,
// 						errors: null
// 					});
// 					reset(pageState.values);
// 					dispatch(
// 						actions.openSnackbar({
// 							open: true,
// 							message: 'Record Delete Successfully',
// 							variant: 'alert',
// 							alert: {
// 								color: 'success'
// 							},
// 							close: false,
// 							anchorOrigin: {
// 								vertical: 'top',
// 								horizontal: 'center'
// 							}
// 						})
// 					);
// 					setEditButton(true);
// 					setDeleteButton(true);
// 					setEditMode(false);
// 				})
// 				.catch(() => {
// 					/* */
// 				});
// 		}
// 	};

// 	// Editable React Data table
// 	const onEditStart = () => {
// 		inEdit = true;
// 	};

// 	const onEditStop = () => {
// 		requestAnimationFrame(() => {
// 			inEdit = false;
// 			gridRef.current.focus();
// 		});
// 	};

// 	const onKeyDown = async (event: any) => {
// 		const edited = await onTableKeyDown(event, inEdit, gridRef);

// 		if (edited && edited.colName === 'emp_1') {
// 			dispatch(
// 				tenderlotimportsActions.getAttendee({
// 					QueryParams: `columnType=emp_1&pagination=false&q=type='E'`
// 				})
// 			);
// 		}
// 		if (edited && edited.colName === 'emp_2') {
// 			dispatch(
// 				tenderlotimportsActions.getAttendee({
// 					QueryParams: `columnType=emp_2&pagination=false&q=type='E'`
// 				})
// 			);
// 		}
// 		if (edited && edited.colName === 'emp_3') {
// 			dispatch(
// 				tenderlotimportsActions.getAttendee({
// 					QueryParams: `columnType=emp_3&pagination=false&q=type='E'`
// 				})
// 			);
// 		}
// 		if (!edited) {
// 			const grid = gridRef.current;
// 			const [rowIndex, colIndex] = grid.computedActiveCell;
// 			const rowCount = grid.count;

// 			if (event.key === 'Tab') {
// 				event.preventDefault();
// 			}

// 			if (event.key === 'Delete') {
// 				const data = [...dataSource];

// 				confirm({
// 					description: 'Are you sure delete Checker ?',
// 					confirmationButtonProps: { autoFocus: true },
// 					confirmationText: 'Yes',
// 					cancellationText: 'No'
// 				})
// 					.then(() => {
// 						const stateArr = deleteRow(pageState, 'seq_no', data, rowIndex);
// 						return stateArr;
// 					})
// 					.then(stateArr => {
// 						setPageState(value => ({
// 							...value,
// 							values: {
// 								...pageState.values,
// 								para: stateArr
// 							}
// 						}));

// 						data.splice(rowIndex, 1);
// 						setDataSource(data);
// 					})
// 					.catch(() => {
// 						/* */
// 					});
// 			}

// 			if (event.key === 'Insert' || (event.key === 'Enter' && rowIndex === rowCount - 1)) {
// 				let isLastEditableColumn = false;
// 				if (event.key === 'Enter') {
// 					let LastEditCol = Math.floor(Math.random() * 100 + 10000);

// 					for (let index = columns.length - 1; index >= 0; index--) {
// 						const column = grid.getColumnBy(index);

// 						if (column) {
// 							if (column.editable === false || column.skipNavigation === true) {
// 								/* empty */
// 							} else {
// 								LastEditCol = index;
// 								break;
// 							}
// 						}
// 					}

// 					if (colIndex === LastEditCol) {
// 						isLastEditableColumn = true;
// 						await delay(20);
// 					}
// 				}

// 				const { insertNew, data, stateArr } = await insertNewRow(
// 					pageState,
// 					FormSchema,
// 					newRowDataSource,
// 					rowIndex,
// 					isLastEditableColumn,
// 					event.key
// 					// { is_active: true }
// 				);

// 				event.preventDefault();

// 				if (insertNew) {
// 					// *** set table with new data
// 					setDataSource(data);

// 					// *** set state for api
// 					setPageState(value => ({
// 						...value,
// 						values: {
// 							...pageState.values,
// 							para: stateArr
// 						}
// 					}));

// 					// *** Focus on first cell of new added row
// 					setActiveCell([data.length - 1, 0]);
// 					setTimeout(() => {
// 						const column = grid.getColumnBy(0);
// 						grid.startEdit({ columnId: column.name, rowIndex: data.length - 1 });
// 					}, 0);
// 				}
// 			}
// 		}
// 	};

// 	const onEditComplete = useCallback(
// 		async ({ value, columnId, rowIndex }: any) => {
// 			if (value === '' || value || typeof value === 'boolean') {
// 				if (typeof value === 'string') {
// 					value = value.trim();
// 				}

// 				const { stateArr, data } = await prepareOnEditComplete(
// 					columns,
// 					dataSource,
// 					value,
// 					columnId,
// 					rowIndex,
// 					pageState,
// 					'seq_no'
// 				);
// 				// Add rows to in pageState
// 				setPageState(value => ({
// 					...value,
// 					values: {
// 						...pageState.values,
// 						para: stateArr
// 					}
// 				}));
// 				setDataSource(data);
// 			}
// 		},
// 		[dataSource]
// 	);
// 	const onSubmit = async () => {};

// 	const handleSubmit = async (event: any) => {
// 		event.preventDefault();
// 		if (dataSource.length > 0) {
// 			if (recordEdit) {
// 				const updatedTenderLotMas = {
// 					trans_date: pageState.values.tender_lot_mas.trans_date,
// 					supplier: pageState.values.tender_lot_mas.supplier,
// 					end_date: pageState.values.tender_lot_mas.end_date,
// 					start_date: pageState.values.tender_lot_mas.start_date,
// 					tender: pageState.values.tender_lot_mas.tender,
// 					action: 'update'
// 				};

// 				const updatedTenderLotDet = dataSource.map((data: any) => ({
// 					...data,
// 					action: 'update'
// 				}));

// 				const updatedData = {
// 					tender_lot_mas: updatedTenderLotMas,
// 					tender_lot_det: updatedTenderLotDet
// 				};
// 				dispatch(tenderlotimportsActions.add(updatedData));
// 			} else {
// 				const tender_lot_mas = {
// 					trans_date: pageState.values.trans_date,
// 					supplier: pageState.values.supplier,
// 					tender_name: pageState.values.tender_name,
// 					end_date: pageState.values.end_date,
// 					start_date: pageState.values.start_date,
// 					tender: pageState.values.tender,
// 					action: 'insert'
// 				};

// 				const tender_lot_det = dataSource.map((data: any) => ({
// 					...data,
// 					action: 'insert'
// 				}));

// 				const postData = {
// 					tender_lot_mas,
// 					tender_lot_det
// 				};

// 				dispatch(tenderlotimportsActions.add(postData));
// 			}
// 			setRecordEdit(false);
// 			setEditMode(!editMode);
// 			setAddButton(false);
// 			setViewButton(false);
// 			setSaveButton(!saveButton);
// 			setFileName([]);
// 			setDataSource([]);
// 			const emptyPageState = {
// 				isValid: false,
// 				values: {},
// 				touched: null,
// 				errors: null
// 			};

// 			setPageState(emptyPageState);
// 			reset(emptyPageState.values);
// 		} else {
// 			dispatch(
// 				actions.openSnackbar({
// 					open: true,
// 					message: 'Detail must be filled',
// 					variant: 'alert',
// 					alert: {
// 						color: 'error'
// 					},
// 					close: false,
// 					anchorOrigin: {
// 						vertical: 'top',
// 						horizontal: 'center'
// 					}
// 				})
// 			);
// 		}
// 	};

// 	return (
// 		<>
// 			<div id="tender-lot-main-box">
// 				<div id="tenderLot-container">
// 					<Box id="form-main" ref={formRef} onKeyUp={(event: any) => onEnterKey(event)}>
// 						<MainCard content={false} ref={refPage as any} tabIndex={-1}>
// 							<FormContainer
// 								onSuccess={() => onSubmit()}
// 								formContext={formContext}
// 								FormProps={{ autoComplete: 'off' }}>
// 								<Grid
// 									container
// 									spacing={0.5}
// 									alignItems="center"
// 									style={{ marginTop: '5px' }}>
// 									<Grid item xs={2}></Grid>
// 									<Grid
// 										item
// 										xs={4}
// 										container
// 										alignItems="center"
// 										id="textfield-margin">
// 										<Grid item xs={3}>
// 											<Typography variant="subtitle1">ID</Typography>
// 										</Grid>
// 										<Grid item xs={3.5}>
// 											<TextFieldElement
// 												className="custom-textfield
// 												 disabled-textfield"
// 												disabled={true}
// 												fullWidth
// 												variant="outlined"
// 												placeholder="Enter id"
// 												name="tender.seq_no"
// 											/>
// 										</Grid>
// 									</Grid>
// 									<Grid
// 										item
// 										xs={4}
// 										container
// 										alignItems="center"
// 										id="textfield-margin">
// 										<Grid item xs={3}>
// 											<Typography variant="subtitle1">Date</Typography>
// 										</Grid>
// 										<Grid item xs={3}>
// 											<TextFieldElement
// 												className={`custom-textfield ${
// 													!editMode ? 'disabled-textfield' : ''
// 												}`}
// 												type="date"
// 												disabled={!editMode}
// 												fullWidth
// 												variant="outlined"
// 												name="trans_date"
// 												onChange={handleChange}
// 											/>
// 										</Grid>
// 									</Grid>
// 									<Grid item xs={2}></Grid>
// 									<Grid item xs={2}></Grid>
// 									<Grid
// 										item
// 										xs={4}
// 										container
// 										alignItems="center"
// 										id="textfield-margin">
// 										<Grid item xs={3}>
// 											<Typography variant="subtitle1">Tender No</Typography>
// 										</Grid>
// 										<Grid
// 											item
// 											xs={5}
// 											className={`common-auto ${
// 												!editMode ? 'disabled-textfield' : ''
// 											}`}>
// 											<AutocompleteElement
// 												loading={tenderNoLoading}
// 												autocompleteProps={{
// 													disabled: !editMode,
// 													selectOnFocus: true,
// 													clearOnBlur: true,
// 													handleHomeEndKeys: true,
// 													freeSolo: true,
// 													forcePopupIcon: true,
// 													autoHighlight: true,
// 													openOnFocus: true,
// 													autoFocus: true,
// 													onChange: (event, value, reason, details) =>
// 														handleTenderNoChange(
// 															event,
// 															value,
// 															reason,
// 															details
// 														),
// 													filterOptions: (options, state) =>
// 														handleFilterOptions(options, state),
// 													getOptionLabel: option => {
// 														if (typeof option === 'string') {
// 															return option;
// 														}
// 														if (option.inputValue) {
// 															return option.inputValue;
// 														}
// 														return option.tender.name;
// 													}
// 												}}
// 												name="tender_no"
// 												options={tenderNoOptions}
// 												textFieldProps={{
// 													InputProps: {},
// 													onChange: e =>
// 														setTenderNoInputValue(e.target.value),
// 													onFocus: () => {
// 														if (
// 															tenderNoOptions &&
// 															tenderNoOptions.length === 0
// 														) {
// 															dispatch(
// 																tenderlotimportsActions.getTenderNo(
// 																	{
// 																		QueryParams: `page=1&limit=5000000&pagination=false`
// 																	}
// 																)
// 															);
// 														}
// 													}
// 												}}
// 											/>
// 										</Grid>
// 									</Grid>
// 									<Grid
// 										item
// 										xs={4}
// 										container
// 										alignItems="center"
// 										id="textfield-margin">
// 										<Grid item xs={3}>
// 											<Typography variant="subtitle1">
// 												Supplier Name
// 											</Typography>
// 										</Grid>
// 										<Grid
// 											item
// 											xs={5}
// 											// className="common-auto"
// 											className={`common-auto ${
// 												!editMode ? 'disabled-textfield' : ''
// 											}`}>
// 											<AutocompleteElement
// 												loading={supplierLoading}
// 												autocompleteProps={{
// 													disabled: true,
// 													selectOnFocus: true,
// 													clearOnBlur: true,
// 													handleHomeEndKeys: true,
// 													freeSolo: true,
// 													forcePopupIcon: true,
// 													autoHighlight: true,
// 													openOnFocus: true,
// 													onChange: (event, value, reason, details) =>
// 														handleSupplierChange(
// 															event,
// 															value,
// 															reason,
// 															details
// 														),
// 													filterOptions: (options, state) =>
// 														handleFilterOptions(options, state),
// 													getOptionLabel: option => {
// 														if (typeof option === 'string') {
// 															return option;
// 														}
// 														if (option.inputValue) {
// 															return option.inputValue;
// 														}
// 														return option.name;
// 													}
// 												}}
// 												name="supplier"
// 												options={supplierOptions}
// 												textFieldProps={{
// 													InputProps: {},
// 													onChange: e =>
// 														setSupplierInputValue(e.target.value),
// 													onFocus: () => {
// 														if (
// 															supplierOptions &&
// 															supplierOptions.length === 0
// 														) {
// 															dispatch(
// 																tenderlotimportsActions.getSupplier(
// 																	{
// 																		QueryParams: `pagination=false&q=supplier='true'`
// 																	}
// 																)
// 															);
// 														}
// 													}
// 												}}
// 											/>
// 										</Grid>
// 									</Grid>
// 									<Grid item xs={2}></Grid>
// 									<Grid item xs={2}></Grid>
// 									<Grid
// 										item
// 										xs={4}
// 										container
// 										alignItems="center"
// 										id="textfield-margin">
// 										<Grid item xs={3}>
// 											<Typography variant="subtitle1">Start Date</Typography>
// 										</Grid>
// 										<Grid item xs={3}>
// 											<TextFieldElement
// 												className={`custom-textfield ${
// 													!editMode ? 'disabled-textfield' : ''
// 												}`}
// 												// className="custom-textfield"
// 												type="date"
// 												fullWidth
// 												variant="outlined"
// 												name="start_date"
// 												disabled
// 											/>
// 										</Grid>
// 									</Grid>
// 									<Grid
// 										item
// 										xs={4}
// 										container
// 										alignItems="center"
// 										id="textfield-margin">
// 										<Grid item xs={3}>
// 											<Typography variant="subtitle1">End Date</Typography>
// 										</Grid>
// 										<Grid item xs={3}>
// 											<TextFieldElement
// 												className={`custom-textfield ${
// 													!editMode ? 'disabled-textfield' : ''
// 												}`}
// 												// className="custom-textfield"
// 												type="date"
// 												fullWidth
// 												variant="outlined"
// 												name="end_date"
// 												disabled
// 											/>
// 										</Grid>
// 									</Grid>
// 									<Grid item xs={2}></Grid>
// 									<Grid item xs={2}></Grid>
// 									<Grid
// 										item
// 										xs={4}
// 										container
// 										alignItems="center"
// 										id="textfield-margin">
// 										<Grid item xs={3}>
// 											<Typography variant="subtitle1"></Typography>
// 										</Grid>
// 										<Button
// 											className="custom-button-load"
// 											variant="contained"
// 											onClick={openUppyDashboard}>
// 											Import
// 										</Button>

// 										<Grid item xs={5}>
// 											<Button
// 												className="custom-button-load"
// 												variant="contained"
// 												style={{ marginLeft: '10px' }}
// 												onClick={handleLoadButtonChange}>
// 												Load
// 											</Button>
// 										</Grid>
// 									</Grid>
// 									<Grid
// 										item
// 										xs={4}
// 										container
// 										alignItems="center"
// 										id="textfield-margin">
// 										<Grid item xs={3}>
// 											<Typography variant="subtitle1">
// 												Lot Selected
// 											</Typography>
// 										</Grid>
// 										<Grid item xs={8}>
// 											<select
// 												style={{
// 													outline: 'none',
// 													width: '5rem',
// 													height: '1.6rem',
// 													borderRadius: '3px'
// 												}}
// 												className={`custom-textfield ${
// 													!editMode ? 'disabled-textfield' : ''
// 												}`}
// 												disabled={!editMode}
// 												value={filterValue}
// 												onChange={e => setFilterValue(e.target.value)}>
// 												<option value="All">All</option>
// 												<option value="Yes">Yes</option>
// 												<option value="No">No</option>
// 											</select>
// 										</Grid>
// 									</Grid>

// 									<Grid item xs={2}></Grid>
// 									<Grid item xs={2}></Grid>
// 									<Grid
// 										item
// 										xs={4}
// 										container
// 										alignItems="center"
// 										id="textfield-margin">
// 										<Grid item xs={3}>
// 											<Typography variant="subtitle1"></Typography>
// 										</Grid>
// 										<Grid item xs={5}></Grid>
// 									</Grid>
// 								</Grid>
// 								<div>
// 									<p className="xls-file-para">{fileName}</p>
// 								</div>
// 								<div>
// 									{/* <MainCard content={false} ref={refPage as any} tabIndex={-1}> */}
// 									<ReactDataGrid
// 										handle={setGridRef}
// 										idProperty="seq_no"
// 										style={gridStyle}
// 										columns={columns}
// 										dataSource={filteredData}
// 										editable={editMode}
// 										activeCell={activeCell}
// 										onActiveCellChange={setActiveCell}
// 										onEditStart={onEditStart}
// 										onEditStop={onEditStop}
// 										onKeyDown={onKeyDown}
// 										onEditComplete={onEditComplete}
// 										rowHeight={21}
// 										summaryReducer={summaryReducer}
// 										footerRows={footerRows}
// 										showColumnMenuTool={false}
// 										showZebraRows={false}
// 									/>
// 								</div>
// 							</FormContainer>
// 							<Grid container spacing={0.5} className="footer-main-dev-button">
// 								<Grid item xs={0.85} className="address-btn">
// 									<Button
// 										ref={addButtonRef}
// 										className="custom-button"
// 										variant="outlined"
// 										fullWidth
// 										placeholder="ADD"
// 										disabled={addButton}
// 										onClick={handleAddClick}
// 										size="small">
// 										+ Add
// 									</Button>
// 								</Grid>
// 								<Grid item xs={0.85} className="address-btn">
// 									<Button
// 										className="custom-button"
// 										variant="outlined"
// 										fullWidth
// 										placeholder="edit"
// 										onClick={handleEditClick}
// 										disabled={editButton}
// 										size="small">
// 										Edit
// 									</Button>
// 								</Grid>
// 								<Grid item xs={0.85} className="address-btn">
// 									<Button
// 										className="custom-button"
// 										variant="outlined"
// 										fullWidth
// 										placeholder="edit"
// 										size="small"
// 										disabled={deleteButton}
// 										onClick={handleDelete}>
// 										Delete
// 									</Button>
// 								</Grid>
// 								<Grid item xs={0.85} className="address-btn">
// 									<Button
// 										ref={viewButtonRef}
// 										onClick={handleView}
// 										className="custom-button"
// 										variant="outlined"
// 										fullWidth
// 										placeholder="VIEW"
// 										disabled={viewButton}
// 										size="small">
// 										View
// 									</Button>
// 								</Grid>
// 								<Grid item xs={0.85} className="address-btn">
// 									<Button
// 										className="custom-button"
// 										onClick={e => handleSubmit(e)}
// 										onKeyDown={e => (e.key === 'Enter' ? handleSubmit(e) : '')}
// 										disableElevation
// 										type="submit"
// 										variant={saveButton ? 'outlined' : 'contained'}
// 										color="primary"
// 										disabled={saveButton}
// 										ref={buttonRef}>
// 										Save
// 									</Button>
// 								</Grid>
// 								<Grid item xs={0.85} className="address-btn">
// 									<Button
// 										ref={cancelButtonRef}
// 										className="custom-button"
// 										variant="outlined"
// 										fullWidth
// 										placeholder="cancel"
// 										disabled={cancelButton}
// 										onClick={handleCancel}
// 										size="small">
// 										Cancel
// 									</Button>
// 								</Grid>
// 							</Grid>
// 						</MainCard>
// 						{/* --------------Footer Button start from Below -------------- */}

// 						{openAddDrawer && (
// 							<InfiniteDrawer
// 								width={80}
// 								component={TenderLotImports}
// 								handleDrawerToggle={handleDrawerToggle}
// 								passProps={childPropsTenderLot}
// 								setSaveButton={setSaveButton}
// 								setEditButton={setEditButton}
// 								setDeleteButton={setDeleteButton}
// 							/>
// 						)}
// 					</Box>
// 				</div>
// 			</div>
// 		</>
// 	);
// }

// export default TenderLotImport;
