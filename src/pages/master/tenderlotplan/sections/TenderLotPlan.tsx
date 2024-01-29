/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
	useCallback,
	useEffect,
	useState,
	SyntheticEvent,
	createContext,
	useRef
} from 'react'; //, useRef
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useIntl } from 'react-intl';
import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	createFilterOptions,
	FilterOptionsState,
	Grid,
	Typography,
	Stack,
	Button,
	CircularProgress,
	TextField
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { AutocompleteElement } from '@app/components/rhfmui';
import { zodResolver } from '@hookform/resolvers/zod';
import useThrottle from '@hooks/useThrottle';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';

import { FormSchema, IFormInput } from '@pages/master/tenderlotplan/models/TenderLotPlan';
import { useTenderlotplansSlice } from '@pages/master/tenderlotplan/store/slice';
import { tenderlotplansSelector } from '@pages/master/tenderlotplan/store/slice/tenderlotplans.selectors';
import { tenderlotplansState } from '@pages/master/tenderlotplan/store/slice/types';

import { InitialState, ObjecttoQueryString, InitialQueryParam, delay } from '@utils/helpers';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import '@inovua/reactdatagrid-community/index.css';

import TenderLotPlanComments from './TenderLotPlanComments';
import './tenderlotplan.css';
import TenderLotAssortment from './TenderLotAssortment';
import TenderlotPlanning from './TenderlotPlanning';
import { AutocompleteEditor } from '@components/table/editors';
import TenderLotPlanSumms from './TenderLotPlanSumm';

import '@pages/master/tenderView/sections/tenderlotview.css';
import TenderDropdown from '@pages/master/tenderView/sections/TenderLotViewDropdown';
import { Box } from '@mui/system';

const gridStyle = { minHeight: 168 };
const totalStyle = { minHeight: 21 };

const Filter = createFilterOptions();

export const tempDataStore = createContext<any>(null);
const tableRefSeq: any = {
	lotSeq: 0,
	tenderLotComSeq: 0,
	tenderLotAssortSeq: 0,
	tenderLotSummSeq: 0
};
let lotDataArray: any = {};
const initParams = {
	page: 1,
	limit: 10000,
	pagination: 'true'
} as InitialQueryParam;

const TenderLotPlan = () => {
	// add your Dispatch 👿
	const dispatch = useDispatch();
	// add your Slice Action  👿
	const tenderlotplansState = useSelector(tenderlotplansSelector);

	// *** Tenderlotplans State *** //
	const { actions: tenderlotplansActions } = useTenderlotplansSlice();
	const { actions } = useSnackBarSlice();
	const {
		getOneSuccess,
		getSupplierSuccess,
		getTenderNoSuccess,
		getTenderNoSelectSuccess,
		getOneDetSuccess,
		addError,
		addSuccess
	} = tenderlotplansState;

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

	const footerRows = [
		{
			render: {
				lot_no: (
					<div style={totalStyle}>
						<b>Total</b>
					</div>
				),
				wgt: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.wgt.toFixed(2)}</b>
					</div>
				),
				pcs: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.pcs}</b>
					</div>
				),
				value: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.value.toFixed(0)}</b>
					</div>
				),
				rate: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{(summary.value ? summary.value / summary.wgt : 0).toFixed(0)}</b>
					</div>
				)
			}
		}
	];

	const summaryReducer = {
		initialValue: { wgt: 0, pcs: 0, value: 0 },
		reducer: (acc: any, item: any) => ({
			wgt: (acc.wgt || 0) + (item.wgt || 0),
			pcs: (acc.pcs || 0) + (item.pcs || 0),
			value: (acc.value || 0) + (item.value || 0)
		})
	};

	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'sr_no',
				header: 'Sr',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 20,
				maxWidth: 30,
				sortable: false
			},
			{
				name: 'priority',
				header: 'Priority',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 60,
				sortable: false
			},
			{
				name: 'minimum_checker',
				header: 'Mini Checker',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 90,
				sortable: false
			},
			{
				name: 'lot_no',
				header: 'Lot No',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 80,
				sortable: false
			},
			{
				name: 'parcel_no',
				header: 'Parcel No',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 70,
				sortable: false
			},
			{
				name: 'pcs',
				header: 'Pcs',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 40,
				sortable: false
			},
			{
				name: 'wgt',
				header: 'Wgt',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 60,
				sortable: false
			},
			{
				name: 'rough_size',
				header: 'Rough Size',
				headerAlign: 'start',
				textAlign: 'left',
				minWidth: 40,
				maxWidth: 110,
				sortable: false
			},
			{
				name: 'rough_article',
				header: 'Rough Article',
				headerAlign: 'start',
				textAlign: 'left',
				minWidth: 200,
				sortable: false
			},
			{
				name: 'lot_description',
				header: 'Lot Description',
				minWidth: 200,
				sortable: false
			},
			{
				name: 'rate',
				header: 'Rate',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 50,
				sortable: false
			},
			{
				name: 'value',
				header: 'Value',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 70,
				sortable: false,
				render: ({ data, value }: any) => {
					let val = parseFloat(data.value);
					if (!isNaN(val)) {
						let result = val.toFixed(0);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'supplier_comments',
				header: 'Supplier Remark',
				minWidth: 230,
				sortable: false
			},
			{
				name: 'media',
				header: 'Media',
				minWidth: 50,
				maxWidth: 100,
				sortable: false
			},
			{
				name: 'emp_1',
				header: 'Checker 1',
				minWidth: 50,
				maxWidth: 110,
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
							{data && data.emp_1 && data.emp_1.name ? data.emp_1.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'emp_2',
				header: 'Checker 2',
				minWidth: 50,
				maxWidth: 110,
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
							{data && data.emp_2 && data.emp_2.name ? data.emp_2.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'emp_3',
				header: 'Checker 3',
				minWidth: 50,
				maxWidth: 110,
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
							{data && data.emp_3 && data.emp_3.name ? data.emp_3.name : ''}
						</Typography>
					);
				}
			},
			{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
		];
	};

	const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
	const [popupKey, setPopupKey] = useState(0);
	const [gridConfig, setGridConfig] = useState({});
	const [currentAction, setCurrentAction] = useState<number>(0);
	const [currentAction1, setCurrentAction1] = useState<number>(0);
	const [currentAction2, setCurrentAction2] = useState<number>(0);
	const [currentAction3, setCurrentAction3] = useState<number>(0);
	const [currentAction4, setCurrentAction4] = useState<number>(0);
	const [currentFocus, setCurrentFocus] = useState(1);

	const handleGridOpen = (event: any) => {
		dispatch(
			tenderlotplansActions.getTenderNo({
				QueryParams: queryStirng
			})
		);
		const cellPosition = event.target.getBoundingClientRect();
		setPopupPosition({
			x: cellPosition.left,
			y: cellPosition.bottom
		});
		setPopupKey(popupKey + 1);
		setPopupVisible(true);
	};

	const [isPopupVisible, setPopupVisible] = useState(false);
	const closeCellPopup = () => {
		setPopupVisible(false);
	};

	const [selectCellPopupData, setSelectCellPopupData] = useState<any>([]);

	const selectCellPopupCallback = (data: any) => {
		setSelectCellPopupData(data);
		if (selectCellPopupData !== data) {
			setTenderLotSeq('');
			setAssortSeq('');
			setTenderLotCommSeq('');
			setCommentsDataOptions([]);
			setAssortmentDataOptions([]);
			setAssortmentPlanning([]);
			setSummaryDataOption([]);
		}
	};

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});

	const queryParams = initParams;
	const queryStirng = ObjecttoQueryString(queryParams);

	const [dataSource, setDataSource] = useState<any>([]);
	const [commentsDataOptions, setCommentsDataOptions] = useState<any>([]);
	const [assortmentDataOptions, setAssortmentDataOptions] = useState<any>([]);
	const [assortmentDataHideCol, setAssortmentDataHideCol] = useState<any>([]);
	const [assortmentPlanning, setAssortmentPlanning] = useState<any>([]);
	const [summaryDataOption, setSummaryDataOption] = useState<any>([]);
	const [assortFinalPlanSumm, setassortFinalPlanSumm] = useState<any>([]);

	const [columns] = useState<any>(getColumns());
	const [enableSelection] = useState(true);
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [tenderLotSeq, setTenderLotSeq] = useState('');
	const [assortSeq, setAssortSeq] = useState('');
	const [tenderLotCommSeq, setTenderLotCommSeq] = useState('');

	const [supplierInputValue, setSupplierInputValue] = useState('');
	const [supplierOptions, setSupplierOptions] = useState<tenderlotplansState[]>([]);
	const throttledInputSupplierValue = useThrottle(supplierInputValue, 400);

	const [tenderNoInputValue, setTenderNoInputValue] = useState('');
	const [tenderNoOptions, setTenderNoOptions] = useState<tenderlotplansState[]>([]);
	const throttledInputTenderNoValue = useThrottle(tenderNoInputValue, 400);

	const [filterValue, setFilterValue] = useState('All');

	const saveButtonRef = useRef<any>(null);
	let refPage = [useHotkeys<any>('alt+s', () => saveButtonRef.current.click())];

	const tenderLotComSeq = (seqNo: any) => {
		tableRefSeq.tenderLotAssortSeq = 0;
		tableRefSeq.tenderLotComSeq = seqNo;

		setAssortmentDataOptions(
			lotDataArray?.tender_assort?.filter(
				(e: any) => e.tender_lot_comm_seq === seqNo && e.action !== 'delete'
			)
		);
		setAssortmentPlanning(
			lotDataArray?.tender_plan?.filter(
				(e: any) => e.assort_seq === tableRefSeq.tenderLotAssortSeq && e.action !== 'delete'
			)
		);
		setSummaryDataOption(
			lotDataArray?.tender_lot_plan_summ?.filter(
				(e: any) =>
					e.tender_lot_assort_seq === tableRefSeq.tenderLotAssortSeq &&
					e.action !== 'delete'
			)
		);
	};
	const tenderLotAssortSeq = (seqNo: any) => {
		tableRefSeq.tenderLotAssortSeq = seqNo;
		setAssortmentPlanning(
			lotDataArray?.tender_plan?.filter(
				(e: any) => e.assort_seq === tableRefSeq.tenderLotAssortSeq
			)
		);
		setSummaryDataOption(
			lotDataArray?.tender_lot_plan_summ?.filter(
				(e: any) => e.tender_lot_assort_seq === tableRefSeq.tenderLotAssortSeq
			)
		);
	};
	const tenderLotSummSeq = (seqNo: any) => {
		tableRefSeq.tenderLotSummSeq = seqNo;
	};
	const handleRowSelect = useCallback(
		(rowData: any) => {
			setSelectedRow(rowData.data);
			if (selectedRow !== rowData.data) {
				setTenderLotSeq('');
				setAssortSeq('');
				setTenderLotCommSeq('');
				setCommentsDataOptions([]);
				setAssortmentDataOptions([]);
				setAssortmentPlanning([]);
				setSummaryDataOption([]);
				tableRefSeq.lotSeq = rowData.data.seq_no;
			}
		},
		[selectedRow]
	);

	useEffect(() => {
		return () => {
			dispatch(tenderlotplansActions.reset());
		};
	}, []);

	useEffect(() => {
		dispatch(
			tenderlotplansActions.getTenderNoSelect({
				QueryParams: `${selectCellPopupData[0]?.seq_no}`
			})
		);
	}, [selectCellPopupData[0]?.seq_no]);

	useEffect(() => {
		dispatch(tenderlotplansActions.getOne(selectedRow?.seq_no));
		setTenderLotSeq(selectedRow?.seq_no);
	}, [selectedRow]);

	useEffect(() => {
		if (getOneSuccess) {
			if (getOneSuccess?.results) {
				lotDataArray = getOneSuccess.results;
				setCommentsDataOptions(getOneSuccess?.results.tender_lot_comments);
				setAssortmentDataOptions(
					lotDataArray?.tender_assort.filter(
						(e: any) => e.tender_lot_comm_seq === tableRefSeq.tenderLotComSeq
					)
				);
				setAssortmentPlanning(
					lotDataArray?.tender_plan.filter(
						(e: any) => e.assort_seq === tableRefSeq.tenderLotAssortSeq
					)
				);
				setSummaryDataOption(
					lotDataArray?.tender_lot_plan_summ.filter(
						(e: any) => e.tender_lot_assort_seq === tableRefSeq.tenderLotAssortSeq
					)
				);
				//setAssortmentDataOptions(getOneSuccess?.results.tender_assort);
				//setAssortmentPlanning(getOneSuccess?.results.tender_plan);
				//setSummaryDataOption(getOneSuccess?.results.tender_lot_plan_summ);
			}
		}
	}, [getOneSuccess]);

	useEffect(() => {
		dispatch(tenderlotplansActions.reset());
		if (throttledInputSupplierValue === '' && pageState?.touched?.supplier) {
			dispatch(
				tenderlotplansActions.getSupplier({
					QueryParams: `pagination=false&q=supplier='true'`
				})
			);
			return undefined;
		} else if (throttledInputSupplierValue !== '') {
			dispatch(
				tenderlotplansActions.getSupplier({
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
	}, [getSupplierSuccess]);

	// tender no function
	useEffect(() => {
		dispatch(tenderlotplansActions.reset());
		if (throttledInputTenderNoValue === '' && pageState?.touched?.tender) {
			dispatch(
				tenderlotplansActions.getTenderNo({
					QueryParams: `page=1&limit=5000000&pagination=false`
				})
			);
			return undefined;
		} else if (throttledInputTenderNoValue !== '') {
			dispatch(
				tenderlotplansActions.getTenderNo({
					QueryParams: `q=${throttledInputTenderNoValue}`
				})
			);
		}
	}, [throttledInputTenderNoValue]);

	useEffect(() => {
		if (getTenderNoSuccess) {
			if (getTenderNoSuccess?.results && getTenderNoSuccess?.results.length > 0) {
				let gridPopupDataFormate: any = [];
				getTenderNoSuccess?.results.forEach((item: any) => {
					gridPopupDataFormate.push({
						seq_no: item.seq_no,
						city_name: item.city.name,
						tender_full_name: item.tender.name,
						tender_name: item.tender_name,
						supplier_name: item.supplier.name,
						tenderno: item.tender_no,
						tender_lot_mas_seq: item.tender_lot_mas_seq
					});
				});

				setGridConfig({
					columns: [
						// {
						// 	valueField: 'seq_no',
						// 	displayField: 'Seq No',
						// 	uniqField: true
						// },
						{
							valueField: 'tenderno',
							displayField: 'Tender No',
							uniqField: true
						},
						{
							valueField: 'tender_name',
							displayField: 'Tender Name'
						},
						{
							valueField: 'tender_full_name',
							displayField: 'Description'
						}
					],
					data: gridPopupDataFormate
				});
				// setActiveCell([0, 0]);
			}
		}
	}, [getTenderNoSuccess]);

	useEffect(() => {
		if (getTenderNoSelectSuccess) {
			if (getTenderNoSelectSuccess?.results) {
				setPageState(pageState => ({
					...pageState,
					values: {
						...pageState.values,
						supplier: getTenderNoSelectSuccess?.results.supplier,
						tender_name: getTenderNoSelectSuccess?.results.tender_name
					},
					touched: {
						...pageState.touched,
						tender: true
					}
				}));
			}
			reset(getTenderNoSelectSuccess?.results);
			dispatch(tenderlotplansActions.reset());
			dispatch(
				tenderlotplansActions.getOneDet(
					getTenderNoSelectSuccess?.results.tender_lot_mas_seq
				)
			);
		}
	}, [getTenderNoSelectSuccess]);

	useEffect(() => {
		if (getOneDetSuccess) {
			if (getOneDetSuccess?.results) {
				setDataSource(getOneDetSuccess?.results.tender_lot_det);
			}
		}
	}, [getOneDetSuccess]);

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

			//reset()
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});

			dispatch(tenderlotplansActions.getOne(tableRefSeq?.lotSeq));
			setTenderLotSeq(tableRefSeq?.lotSeq);
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

	const onSubmit = async () => {
		/* empty */
	};

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
			name: newValue && newValue.name ? newValue.name : ''
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
				tenderlotplansActions.getSupplier({
					QueryParams: `pagination=false&q=supplier='true`
				})
			);
		}
	};

	const childProps = (array: any) => {
		const mergedArray: any = array;
		if (array && array.length > 0) {
			const array1 = array;
			const array2 = lotDataArray.tender_lot_comments;

			// Loop through array1
			for (const obj of array1) {
				if (!mergedArray.some((existingObj: any) => existingObj.seq_no === obj.seq_no)) {
					mergedArray.push(obj);
				}
			}
			// Loop through array2
			for (const obj of array2) {
				if (!mergedArray.some((existingObj: any) => existingObj.seq_no === obj.seq_no)) {
					mergedArray.push(obj);
				}
			}

			lotDataArray = {
				...lotDataArray,
				tender_lot_comments: mergedArray
			};
		}
	};

	const childAssortmentProps = (array: any) => {
		const mergedArray: any = [];
		if (array && array.length > 0) {
			const array1 = array;
			const array2 = lotDataArray.tender_assort;

			// Loop through array1
			for (const obj of array1) {
				if (!mergedArray.some((existingObj: any) => existingObj.seq_no === obj.seq_no)) {
					mergedArray.push(obj);
				}
			}
			// Loop through array2
			for (const obj of array2) {
				if (!mergedArray.some((existingObj: any) => existingObj.seq_no === obj.seq_no)) {
					mergedArray.push(obj);
				}
			}

			lotDataArray = {
				...lotDataArray,
				tender_assort: mergedArray
			};
		}
	};

	const childPlanningProps = (array: any) => {
		const mergedArray: any = [];
		if (array && array.length > 0) {
			const array1 = array;
			const array2 = lotDataArray.tender_plan;

			// Loop through array1
			for (const obj of array1) {
				if (!mergedArray.some((existingObj: any) => existingObj.seq_no === obj.seq_no)) {
					mergedArray.push(obj);
				}
			}
			// Loop through array2
			for (const obj of array2) {
				if (!mergedArray.some((existingObj: any) => existingObj.seq_no === obj.seq_no)) {
					mergedArray.push(obj);
				}
			}

			lotDataArray = {
				...lotDataArray,
				tender_plan: mergedArray
			};
		}
	};
	const childSummProps = (array: any) => {
		const mergedArray: any = [];
		if (array && array.length > 0) {
			const array1 = array;
			const array2 = lotDataArray.tender_lot_plan_summ;

			// Loop through array1
			for (const obj of array1) {
				if (!mergedArray.some((existingObj: any) => existingObj.seq_no === obj.seq_no)) {
					mergedArray.push(obj);
				}
			}
			// Loop through array2
			for (const obj of array2) {
				if (!mergedArray.some((existingObj: any) => existingObj.seq_no === obj.seq_no)) {
					mergedArray.push(obj);
				}
			}

			lotDataArray = {
				...lotDataArray,
				tender_lot_plan_summ: mergedArray
			};
		}
	};
	const childfinalPlanSumm = (array: any) => {
		setassortFinalPlanSumm(array);
	};

	const childCommentsToAssorHideColProps = (obj: any) => {
		setAssortmentDataHideCol(obj);
	};

	const childAssortmentToPlanProps = (obj: { assortSeq: string; data: object }) => {
		setAssortmentPlanning(obj.data);
	};

	const childAssortmentToPlanSummProps = (obj: { assortSeq: string; data: object }) => {
		setSummaryDataOption(obj.data);
	};

	const childAssortmentPlanSummProps = (obj: { assortSeq: string; data: object }) => {
		setAssortmentPlanning(obj.data);
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		dispatch(tenderlotplansActions.add(lotDataArray));
	};
	const childCurrentFocus = (currentFocus: any) => {
		setCurrentFocus(currentFocus);
	};
	const handleKeyPress = async (event: any) => {
		if (event.key == 'PageDown' || event.key == 'PageUp') {
			if (currentFocus == 5 && event.key == 'PageDown') {
				setCurrentFocus(1);
				setCurrentAction(1);
				setCurrentAction1(0);
				setCurrentAction2(0);
				setCurrentAction3(0);
				setCurrentAction4(0);
			}
			if (currentFocus == 2 && event.key == 'PageUp') {
				setCurrentFocus(6);
				setCurrentAction(6);
				setCurrentAction1(0);
				setCurrentAction2(0);
				setCurrentAction3(0);
				setCurrentAction4(0);
			}
			let current: any =
				event.key == 'PageDown' && currentFocus == 5
					? 1
					: event.key == 'PageUp' && currentFocus == 2
					? 6
					: currentFocus;
			//setCurrentAction(0);
			if (event.key == 'PageDown') {
				current = current + 1;
			} else if (event.key == 'PageUp') {
				current = current - 1;
			}
			if (current == 2) {
				setCurrentAction1(current);
				setCurrentFocus(current);
				setCurrentAction2(0);
				setCurrentAction3(0);
				setCurrentAction4(0);
			}
			if (current == 3) {
				setCurrentAction2(current);
				setCurrentFocus(current);
				setCurrentAction1(0);
				setCurrentAction3(0);
				setCurrentAction4(0);
			}
			if (current == 4) {
				setCurrentAction3(current);
				setCurrentFocus(current);
				setCurrentAction1(0);
				setCurrentAction2(0);
				setCurrentAction4(0);
			}
			if (current == 5) {
				setCurrentAction4(current);
				setCurrentFocus(current);
				setCurrentAction1(0);
				setCurrentAction2(0);
				setCurrentAction3(0);
			}
		}
	};

	return (
		<>
			<tempDataStore.Provider
				value={{
					tableRefSeq: tableRefSeq,
					tenderLotAssortSeq: tenderLotAssortSeq,
					tenderLotComSeq: tenderLotComSeq,
					tenderLotSummSeq: tenderLotSummSeq
				}}>
				<Box onKeyDown={event => handleKeyPress(event)}>
					<MainCard content={false} tabIndex={-1} ref={refPage as any}>
						<FormContainer formContext={formContext}>
							<Grid container spacing={1} style={{ marginTop: '1px' }}>
								<Grid
									item
									xs={3}
									container
									alignItems="center"
									id="textfield-margin">
									<Grid item xs={4}>
										<Typography variant="subtitle1">Tender No</Typography>
									</Grid>
									<Grid item xs={7}>
										<div>
											<TextField
												className="tenderno"
												value={selectCellPopupData[0]?.tenderno}
												onClick={e => handleGridOpen(e)}
											/>
											{isPopupVisible && (
												<TenderDropdown
													key={popupKey} // Set a unique key to force re-render
													popupPosition={popupPosition}
													isFindVisible={false}
													closeCellPopup={closeCellPopup}
													selectCellPopupCallback={
														selectCellPopupCallback
													}
													viewType="table_without_checkbox" // new prop for specifying the view type: 'table_with_checkbox', 'table_without_checkbox', 'list_view'
													gridConfig={gridConfig}
												/>
											)}
										</div>
									</Grid>
								</Grid>
								<Grid
									item
									xs={2}
									container
									alignItems="center"
									id="textfield-margin">
									<Grid item xs={5}>
										<Typography variant="subtitle1">Lot Selected</Typography>
									</Grid>
									<Grid item xs={7}>
										<select
											style={{
												outline: 'none',
												width: '5rem',
												height: '1.6rem',
												borderRadius: '3px',
												border: '1px solid #ccc'
											}}
											value={filterValue}
											onChange={e => setFilterValue(e.target.value)}>
											<option value="All">ALL</option>
											<option value="Yes">YES</option>
											<option value="No">NO</option>
										</select>
									</Grid>
								</Grid>
								<Grid
									item
									xs={3}
									container
									alignItems="center"
									id="textfield-margin">
									<Grid item xs={5}>
										<Typography variant="subtitle1">Supplier Name</Typography>
									</Grid>
									<Grid item xs={7}>
										<AutocompleteElement
											//loading={supplierLoading}
											classname="common-auto"
											autocompleteProps={{
												selectOnFocus: true,
												clearOnBlur: true,
												handleHomeEndKeys: true,
												disabled: true,
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
															tenderlotplansActions.getSupplier({
																QueryParams: `pagination=false&q=supplier='true'`
															})
														);
													}
												}
											}}
										/>
									</Grid>
								</Grid>
								<Grid item xs={4} container></Grid>
								<Grid item xs={8}>
									<Stack spacing={1}>
										<MainCard content={false} tabIndex="0">
											<ReactDataGrid
												idProperty="seq_no"
												nativeScroll={true}
												style={gridStyle}
												// activeCell={activeCell}
												// onActiveCellChange={setActiveCell}
												// onKeyDown={onKeyDown}
												// onEditComplete={onEditComplete}
												// onEditStart={onEditStart}
												// onEditStop={onEditStop}
												enableSelection={enableSelection}
												columns={columns}
												keyPageStep={0}
												// dataSource={dataSource}
												dataSource={filteredData}
												rowHeight={21}
												headerHeight={22}
												onRowClick={(e: any) => handleRowSelect(e)}
												summaryReducer={summaryReducer}
												footerRows={footerRows}
												showColumnMenuTool={false}
												showZebraRows={false}
											/>
										</MainCard>
									</Stack>
								</Grid>
								<Grid item xs={4}>
									<TenderLotPlanComments
										passProps={childProps}
										//selectedData={selectedRow}
										CommemtsOptions={commentsDataOptions}
										tenderLotSeq={tenderLotSeq}
										editMode={true}
										// currentAction={currentAction}
										//CommemtsToAssortmentOptions={childCommentsToAssortmentProps}
										CommemtsToAssorHideCol={childCommentsToAssorHideColProps}
										currentAction={currentAction1}
										currentFocus={childCurrentFocus}
									/>
								</Grid>
							</Grid>

							<Grid item xs={12} container spacing={1} style={{ marginTop: '5px' }}>
								<Grid item xs={3}>
									<Stack>
										<TenderLotAssortment
											passProps={childAssortmentProps}
											assortmentOptions={assortmentDataOptions}
											tenderLotSeq={tenderLotSeq}
											editMode={true}
											assortmentToPlanOptions={childAssortmentToPlanProps}
											assortmentToPlanSummOptions={
												childAssortmentToPlanSummProps
											}
											assortmentHideCol={assortmentDataHideCol}
											assortFinalPlanSumm={assortFinalPlanSumm}
											tenderLotCommSeq={tenderLotCommSeq}
											currentAction={currentAction2}
											currentFocus={childCurrentFocus}
										/>
									</Stack>
								</Grid>
								<Grid item xs={9}>
									<Stack>
										<TenderLotPlanSumms
											passProps={childSummProps}
											summsOptions={summaryDataOption}
											assortSeq={assortSeq}
											tenderLotSeq={tenderLotSeq}
											assortmentSumOptions={childAssortmentPlanSummProps}
											editMode={true}
											currentAction={currentAction3}
											currentFocus={childCurrentFocus}
										/>
									</Stack>
								</Grid>
							</Grid>
							<Grid item xs={12} container spacing={1} style={{ marginTop: '5px' }}>
								<Grid item xs={12}>
									<Stack>
										<TenderlotPlanning
											passProps={childPlanningProps}
											planningOptions={assortmentPlanning}
											assortSeq={assortSeq}
											tenderLotSeq={tenderLotSeq}
											finalPlansumm={childfinalPlanSumm}
											currentAction={currentAction4}
											currentFocus={childCurrentFocus}
										/>
									</Stack>
								</Grid>
							</Grid>

							<button type="submit" hidden />
						</FormContainer>
						<Grid container>
							<Grid item xs={12}>
								<Button
									onClick={e => {
										handleSubmit(e);
									}}
									ref={saveButtonRef}
									// disableElevation
									// className={`custom-button ${
									// 	enableButton ? 'disabled-textfield' : ''
									// }`}
									style={{ margin: '3px' }}
									type="submit"
									variant="outlined"
									color="primary"
									size="small"
									//disabled={enableButton}
									tabIndex={-1}>
									{isSubmitting ? (
										<CircularProgress size={24} color="success" />
									) : (
										formatMessage({ id: 'Save' })
									)}
								</Button>
							</Grid>
						</Grid>
					</MainCard>
				</Box>
			</tempDataStore.Provider>
		</>
	);
};

export default TenderLotPlan;
