/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, SyntheticEvent, useCallback, useRef } from 'react'; //, useRef
import { useForm } from 'react-hook-form';
import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	createFilterOptions,
	FilterOptionsState,
	Grid,
	Typography,
	Stack,
	TextField,
	Button,
	CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { TextFieldElement, FormContainer } from '@app/components/rhfmui';
import { matchSorter } from 'match-sorter';
import MainCard from '@components/MainCard';
import { AutocompleteElement } from '@app/components/rhfmui';
import { zodResolver } from '@hookform/resolvers/zod';
import useThrottle from '@hooks/useThrottle';
import { useIntl } from 'react-intl';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import dayjs from 'dayjs';

import { FormSchema, IFormInput } from '@pages/master/tenderView/models/TenderView';
import { useTenderlotplansSlice } from '@pages/master/tenderlotplan/store/slice';
import { tenderlotplansSelector } from '@pages/master/tenderlotplan/store/slice/tenderlotplans.selectors';
import { tenderlotplansState } from '@pages/master/tenderlotplan/store/slice/types';
import { useTenderlotimportsSlice } from '@pages/master/tenderlotimport/store/slice';
import { tenderlotimportsSelector } from '@pages/master/tenderlotimport/store/slice/tenderlotimports.selectors';
import '@inovua/reactdatagrid-community/index.css';
import './tenderlotview.css';
import TenderDropdown from './TenderLotViewDropdown';
import TenderViewComments from '@pages/master/tenderView/sections/TenderLotViewComments';
import { DDTextFieldEditor, TextFieldEditor } from '@components/table/editors';
import TenderViewSumms from './TenderLotViewSumm';
import TenderViewAssortment from './TenderLotViewAssortment';
import { createColumnHelper } from '@tanstack/react-table';
import {
	InitialQueryParam,
	InitialState,
	ObjecttoQueryString,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete
} from '@utils/helpers';
import useFocusOnEnter from '@hooks/useFocusOnEnter';
import { useHotkeys } from 'react-hotkeys-hook';
import { InfiniteDataGrid, licenceType } from '@components/table';

const gridStyle = { minHeight: 200 };

const initParams = {
	page: 1,
	limit: 10000,
	pagination: 'true'
} as InitialQueryParam;

let staticLotDropDownData = [] as any;

const columnHelper = createColumnHelper<any>();

const dialogColumns = [
	columnHelper.accessor('name', {
		cell: (info: any) => info.getValue(),
		header: () => <span>Name (by Page)</span>
	})
];

const Filter = createFilterOptions();

const TenderView = () => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const tenderlotplansState = useSelector(tenderlotplansSelector);
	const tenderlotimportsState = useSelector(tenderlotimportsSelector);

	// *** Tenderlotplans State *** //
	const { actions: tenderlotplansActions } = useTenderlotplansSlice();
	const { actions: tenderlotimportsActions } = useTenderlotimportsSlice();
	const { actions } = useSnackBarSlice();
	const {
		getSupplierSuccess,
		getTenderNoSuccess,
		getTenderNoSelectSuccess,
		getOneDetSuccess,
		getOneSuccess,
		getLotStatusSuccess
	} = tenderlotplansState;
	const { addSuccess } = tenderlotimportsState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		formState: { errors, isSubmitting },
		reset
	} = formContext;

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

	const { formatMessage } = useIntl();
	const totalStyle = { minHeight: 21 };

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
					<div style={{ textAlign: 'right', minHeight: 21 }}>
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
			wgt: acc.wgt + (item.wgt || 0),
			pcs: acc.pcs + (item.pcs || 0),
			value: acc.value + (item.value || 0)
		})
	};

	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'sr_no',
				header: 'Sr.',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 20,
				maxWidth: 40,
				sortable: false,
				editable: false,
				locked: true,
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
				minWidth: 40,
				maxWidth: 60,
				sortable: false,
				editable: false,
				locked: true
			},
			{
				name: 'parcel_no',
				header: 'Parcel No',
				minWidth: 40,
				maxWidth: 70,
				sortable: false,
				editable: false,
				locked: true
			},
			{
				name: 'pcs',
				header: 'Pcs',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 40,
				sortable: false,
				editable: false,
				locked: true
			},
			{
				name: 'wgt',
				header: 'Wgt',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 60,
				sortable: false,
				editable: false,
				locked: true
			},
			{
				name: 'rough_size',
				header: 'Rough Size',
				minWidth: 50,
				maxWidth: 100,
				sortable: false,
				editable: false,
				locked: true
			},
			{
				name: 'rough_article',
				header: 'Rough Article',
				minWidth: 260,
				sortable: false,
				editable: false,
				locked: true
			},
			{
				name: 'lot_description',
				header: 'Lot Description',
				minWidth: 160,
				maxWidth: 260,
				sortable: false,
				editable: false
			},
			{
				name: 'rate',
				header: 'Rate',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 60,
				sortable: false,
				editable: false,
				render: ({ data }: any) => {
					let Rate = parseFloat(data.rate);
					let result = Rate.toFixed(0);
					if (!isNaN(Rate)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'value',
				header: 'Value',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 50,
				maxWidth: 80,
				sortable: false,
				editable: false,
				render: ({ data }: any) => {
					let values = parseFloat(data.value);
					let result = values.toFixed(0);
					if (!isNaN(values)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'supplier_comments',
				header: 'Supplier Remark',
				// minWidth: 230,
				minWidth: 50,
				maxWidth: 190,
				sortable: false,
				editable: false
			},
			{
				name: 'Media',
				header: 'Media',
				minWidth: 50,
				maxWidth: 70,
				sortable: false,
				editable: false
			},
			{
				name: 'limit_1',
				header: 'Limit 1',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 50,
				maxWidth: 70,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},

				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					let limit1 = parseFloat(data.limit_1);
					let result = limit1.toFixed(0);
					if (!isNaN(limit1)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'limit_2',
				header: 'Limit 2',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 50,
				maxWidth: 70,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},

				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					let limit2 = parseFloat(data.limit_2);
					let result = limit2.toFixed(0);
					if (!isNaN(limit2)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'limit_3',
				header: 'Limit 3',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 50,
				maxWidth: 70,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},

				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					let limit3 = parseFloat(data.limit_3);
					let result = limit3.toFixed(0);
					if (!isNaN(limit3)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'bid_rate',
				header: 'Bid Rate',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 50,
				maxWidth: 70,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					let bidRate = parseFloat(data.bid_rate);
					let result = bidRate.toFixed(0);
					if (!isNaN(bidRate)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'plan_rate',
				header: 'Plan Rate',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 50,
				maxWidth: 70,
				sortable: false,
				editable: false,
				render: ({ data }: any) => {
					let planRate = parseFloat(data.plan_rate);
					let result = planRate.toFixed(0);
					if (!isNaN(planRate)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'win_rate',
				header: 'Win Rate',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 50,
				maxWidth: 70,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					let winRate = parseFloat(data.win_rate);
					let result = winRate.toFixed(0);
					if (!isNaN(winRate)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'plan_to_bid',
				header: 'Plan To Bid',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 50,
				maxWidth: 80,
				sortable: false,
				editable: false,
				render: ({ data, value }: any) => {
					let bidRate = data && data.plan_rate ? data.plan_rate - data.bid_rate : 0;
					return <Typography>{bidRate.toFixed(0)}</Typography>;
				}
			},
			{
				name: 'plan_to_win',
				header: 'Plan To Win',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 50,
				maxWidth: 80,
				sortable: false,
				editable: false,
				render: ({ data, value }: any) => {
					let plantowin = data && data.plan_rate ? data.plan_rate - data.win_rate : 0;
					return <Typography>{plantowin.toFixed(0)}</Typography>;
				}
			},
			{
				name: 'none_saleable_per',
				header: 'None Saleables',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 50,
				maxWidth: 80,
				sortable: false,
				editable: false,
				render: ({ data }: any) => {
					let nonSale = parseFloat(data.none_saleable_per);
					let result = nonSale.toFixed(2);
					if (!isNaN(nonSale)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'saleable_per',
				header: 'Saleables',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 50,
				maxWidth: 70,
				sortable: false,
				editable: false,
				render: ({ data }: any) => {
					let Sale = parseFloat(data.saleable_per);
					let result = Sale.toFixed(2);
					if (!isNaN(Sale)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'lot_status',
				header: 'Lot Status',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 40,
				maxWidth: 75,
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
							{data && data.lot_status && data.lot_status.name
								? data.lot_status.name
								: ''}
						</Typography>
					);
				}
			},
			{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
		];
	};

	const [isPopupVisible, setPopupVisible] = useState(false);
	const closeCellPopup = () => {
		setPopupVisible(false);
	};

	const [selectCellPopupData, setSelectCellPopupData] = useState<any>([]);

	const selectCellPopupCallback = (data: any) => {
		setSelectCellPopupData(data);
		if (selectCellPopupData !== data) {
			setCommentsDataOptions([]);
			setAssortmentDataOptions([]);
			setAssortmentPlanning([]);
			setSumDataOptions([]);
		}
	};

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {
			tender_lot_trans_date: dayjs().format('YYYY-MM-DD')
		},
		touched: null,
		errors: null
	});

	// add your States  👿
	const [pageStateNew, setPageStateNew] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});

	const queryParams = initParams;
	const queryStirng = ObjecttoQueryString(queryParams);

	/*** Dialogbox */
	const [dropDownData, setDropDownData] = useState([]);

	const [gridActiveCell, setGridActiveCell] = useState<any>({});

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [gridRef, setGridRef] = useState<any>(null);
	const [tenderLotSeq, setTenderLotSeq] = useState('');
	const [commentsDataOptions, setCommentsDataOptions] = useState<any>([]);
	const [sumDataOptions, setSumDataOptions] = useState<any>([]);
	const [view1Options, setView1Options] = useState<any>([]);
	const [assortmentToPlanOptions, setAssortmentToPlanOptions] = useState<any>([]);
	const [assortmentDataOptions, setAssortmentDataOptions] = useState<any>([]);
	const [assortSeq, setAssortSeq] = useState('');
	const [assortmentPlanning, setAssortmentPlanning] = useState<any>([]);

	const [supplierInputValue, setSupplierInputValue] = useState('');
	const [supplierOptions, setSupplierOptions] = useState<tenderlotplansState[]>([]);
	const throttledInputSupplierValue = useThrottle(supplierInputValue, 400);

	const [tenderNoInputValue, setTenderNoInputValue] = useState('');
	const [tenderNoOptions, setTenderNoOptions] = useState<tenderlotplansState[]>([]);
	const throttledInputTenderNoValue = useThrottle(tenderNoInputValue, 400);

	const [filterValue, setFilterValue] = useState('All');

	useEffect(() => {
		dispatch(tenderlotplansActions.getLotStatus('LOT_STATUS'));
		return () => {
			dispatch(tenderlotplansActions.reset());
		};
	}, []);

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
			if (getTenderNoSuccess?.results) {
				setTenderNoOptions(getTenderNoSuccess?.results);
			} else {
				setTenderNoOptions([]);
			}
		}
	}, [getTenderNoSuccess]);

	useEffect(() => {
		if (getTenderNoSelectSuccess) {
			// debugger;
			if (getTenderNoSelectSuccess?.results) {
				setPageState(pageState => ({
					...pageState,
					values: {
						...pageState.values,
						tender_lot_mas: {
							supplier: getTenderNoSelectSuccess?.results.supplier,
							tender_name: getTenderNoSelectSuccess?.results.tender_name
						}
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
					getTenderNoSelectSuccess?.results?.tender_lot_mas_seq
				)
			);
		}
	}, [getTenderNoSelectSuccess]);

	useEffect(() => {
		if (getLotStatusSuccess) {
			if (getLotStatusSuccess?.results && getLotStatusSuccess?.results.length > 0) {
				console.log(getLotStatusSuccess?.results, 'getLotStatusSuccess?.results');
				setDropDownData(getLotStatusSuccess?.results);
				staticLotDropDownData = getLotStatusSuccess?.results;
			}
		}
	}, [getLotStatusSuccess]);

	useEffect(() => {
		if (getOneDetSuccess) {
			if (getOneDetSuccess?.results) {
				setDataSource(getOneDetSuccess?.results.tender_lot_det);
			}
		}
	}, [getOneDetSuccess]);

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
				setGridActiveCell([0, 0]);
			}
		}
	}, [getTenderNoSuccess]);

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
		}
	}, [addSuccess]);

	useEffect(() => {
		dispatch(tenderlotplansActions.getOne(selectedRow?.seq_no));
		setTenderLotSeq(selectedRow?.seq_no);
	}, [selectedRow]);

	useEffect(() => {
		if (assortmentToPlanOptions) {
			setAssortmentToPlanOptions(assortmentToPlanOptions);
		}
	}, [assortmentToPlanOptions]);

	useEffect(() => {
		if (getOneSuccess) {
			if (getOneSuccess?.results) {
				setCommentsDataOptions(getOneSuccess?.results.tender_lot_comments);
				setView1Options(getOneSuccess?.results.tender_plan_checker_wise_summary);
				setSumDataOptions(getOneSuccess?.results.tender_lot_plan_summ);
			}
		}
	}, [getOneSuccess]);

	useEffect(() => {
		dispatch(
			tenderlotplansActions.getTenderNoSelect({
				QueryParams: `${selectCellPopupData[0]?.seq_no}`
			})
		);
	}, [selectCellPopupData[0]?.seq_no]);

	useEffect(() => {
		setPageStateNew(value => ({
			...value,
			values: {
				...pageStateNew.values,
				tender_lot_det: pageState.values.para
			}
		}));
	}, [dataSource]);

	const onSubmit = async () => {
		/* empty */
	};

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

	const handleFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = Filter(options, state);
		return filtered;
	};

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

	const handleRowSelect = useCallback(
		(rowData: any) => {
			setSelectedRow(rowData.data);
			if (selectCellPopupData[0]?.tenderno !== rowData) {
				setCommentsDataOptions([]);
				setView1Options([]);
				setTenderLotSeq('');
				setAssortmentDataOptions([]);
			}
			// if (selectedRow !== rowData.data) {
			// 	setCommentsDataOptions([]);
			// 	setView1Options([]);
			// 	setTenderLotSeq('');
			// 	setAssortmentDataOptions([]);
			// }
		},
		[selectedRow]
	);

	const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
	const [popupKey, setPopupKey] = useState(0);
	const [gridConfig, setGridConfig] = useState({});

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
		//if(selectCellPopupData[0]?.tenderno === rowData)
	};

	// const onEditStart = () => {
	// 	inEdit = true;
	// 	setPageStateNew(value => ({
	// 		...value,
	// 		values: {
	// 			...pageStateNew.values,
	// 			tender_lot_det: pageState.values.para
	// 		}
	// 	}));
	// };

	// const onEditStop = () => {
	// 	requestAnimationFrame(() => {
	// 		inEdit = false;
	// 		gridRef?.current?.focus();
	// 	});
	// 	setPageStateNew(value => ({
	// 		...value,
	// 		values: {
	// 			...pageStateNew.values,
	// 			tender_lot_det: pageState.values.para
	// 		}
	// 	}));
	// };

	// const onKeyDown = async (event: any) => {
	// 	const edited = await onTableKeyDown(event, inEdit, gridRef);
	// 	if (edited && edited.colName === 'lot_status') {
	// 		dispatch(tenderlotplansActions.reset());
	// 		dispatch(tenderlotplansActions.getLotStatus('LOT_STATUS'));
	// 	}
	// 	if (!edited) {
	// 		const grid = gridRef?.current;
	// 		const [rowIndex, colIndex] = grid.computedActiveCell;
	// 		const rowCount = grid.count;
	// 		if (event.key === 'Tab') {
	// 			event.preventDefault();
	// 		}
	// 		if (event.key === 'Enter1' && rowIndex === rowCount - 1) {
	// 			let isLastEditableColumn = false;
	// 			if (event.key === 'Enter1') {
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
	// 				pageState, // State for track row insert, update or delete
	// 				FormSchema, // for validation
	// 				newRowDataSource, // table data
	// 				rowIndex, // row number
	// 				isLastEditableColumn,
	// 				event.key
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
	// 		if (typeof value === 'string') {
	// 			value = value.trim();
	// 		}

	// 		const { stateArr, data } = await prepareOnEditComplete(
	// 			columns,
	// 			dataSource,
	// 			value,
	// 			columnId,
	// 			rowIndex,
	// 			pageState,
	// 			'seq_no'
	// 		);
	// 		// Add rows to in pageState
	// 		setPageState(value => ({
	// 			...value,
	// 			values: {
	// 				...pageState.values,
	// 				para: stateArr
	// 			}
	// 		}));
	// 		setPageStateNew(value => ({
	// 			...value,
	// 			values: {
	// 				...pageStateNew.values,
	// 				tender_lot_det: pageState.values.para
	// 			}
	// 		}));
	// 		setDataSource(data);
	// 		//}
	// 	},
	// 	[dataSource]
	// );

	const getItems = (arr: any, value: any, field: any = ['name']) => {
		if (!value) {
			return arr;
		}

		var words = value.split(' ');
		return words.reduceRight(
			(arr: any, word: any) =>
				matchSorter(arr, word, {
					keys: field as any
				}),
			arr
		);
	};
	const onTableDataChange = useCallback(
		async (obj: any) => {
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
						dispatch(tenderlotplansActions.reset());
						if (dialogObj && dialogObj.selectedColumn.column.name === 'lot_status') {
							const filterLotData = getItems(staticLotDropDownData, dialogObj.value);
							setDropDownData(filterLotData);
						}
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

	const childCommentsToAssortmentProps = (obj: any) => {
		setAssortSeq(obj.userseq);
		setAssortmentDataOptions(obj.data);
	};

	const childViewCommentsProps = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				tender_lot_comments: array
			}
		}));
	};

	const childAssortmentProps = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				tender_assort: array
			}
		}));
	};

	const childViewSumProps = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				tender_lot_plan_summ: array
			}
		}));
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		setPageStateNew(value => ({
			...value,
			values: {
				...pageStateNew.values,
				tender_lot_det: pageState.values.para
			}
		}));

		dispatch(tenderlotimportsActions.add(pageStateNew.values));
		dispatch(tenderlotplansActions.add(pageState.values));
	};

	return (
		<>
			<MainCard content={false} tabIndex={-1}>
				<FormContainer formContext={formContext}>
					<Grid container spacing={1} style={{ marginTop: '1px' }}>
						<Grid item xs={3} container alignItems="center" id="textfield-margin">
							<Grid item xs={2.5}>
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
											selectCellPopupCallback={selectCellPopupCallback}
											viewType="table_without_checkbox" // new prop for specifying the view type: 'table_with_checkbox', 'table_without_checkbox', 'list_view'
											gridConfig={gridConfig}
										/>
									)}
								</div>
							</Grid>
						</Grid>
						<Grid item xs={2.2} container alignItems="center" id="textfield-margin">
							<Grid item xs={4}>
								<Typography variant="subtitle1">Lot Selected</Typography>
							</Grid>
							<Grid item xs={7}>
								<select
									style={{
										outline: 'none',
										width: '5rem',
										height: '24px',
										borderRadius: '3px',
										borderColor: '#bfbfbf'
									}}
									value={filterValue}
									onChange={e => setFilterValue(e.target.value)}>
									<option value="All">ALL</option>
									<option value="Yes">YES</option>
									<option value="No">NO</option>
								</select>
							</Grid>
						</Grid>

						<Grid item xs={2} container alignItems="center" id="textfield-margin">
							<Grid item xs={2}>
								<Typography variant="subtitle1">Date</Typography>
							</Grid>
							<Grid item xs={6}>
								<TextFieldElement
									name="tender_lot_trans_date"
									type="date"
									className="common-auto"
									fullWidth
									variant="outlined"
									disabled={true}
								/>
							</Grid>
						</Grid>

						<Grid item xs={3} container alignItems="center" id="textfield-margin">
							<Grid item xs={3.5}>
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
											handleSupplierChange(event, value, reason, details),
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
										onChange: e => setSupplierInputValue(e.target.value),
										onFocus: () => {
											if (supplierOptions && supplierOptions.length === 0) {
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

						<Grid item xs={12}>
							<Stack spacing={1}>
								<MainCard content={false} tabIndex="0">
									{/* <ReactDataGrid
										handle={setGridRef}
										idProperty="seq_no"
										nativeScroll={true}
										style={gridStyle}
										activeCell={activeCell}
										onActiveCellChange={setActiveCell}
										onKeyDown={onKeyDown}
										onEditComplete={onEditComplete}
										onEditStart={onEditStart}
										onEditStop={onEditStop}
										editable={true}
										columns={columns}
										dataSource={filteredData}
										rowHeight={21}
										headerHeight={22}
										onRowClick={(e: any) => handleRowSelect(e)}
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
										onRowClick={(e: any) => handleRowSelect(e)}
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
								</MainCard>
							</Stack>
						</Grid>
					</Grid>

					<Grid item xs={12} container spacing={1} style={{ marginTop: '5px' }}>
						<Grid item xs={5.5}>
							<Stack>
								<TenderViewComments
									passProps={childViewCommentsProps}
									CommemtsOptions={commentsDataOptions}
									tenderLotSeq={tenderLotSeq}
									viewAssortOptions={childCommentsToAssortmentProps}
								/>
							</Stack>
						</Grid>
						<Grid item xs={6.5}>
							<Stack>
								<TenderViewSumms
									passProps={childViewSumProps}
									SumOptions={sumDataOptions}
									tenderLotSeq={tenderLotSeq}
								/>
							</Stack>
						</Grid>
						{/* <Grid item xs={1.01}></Grid> */}
					</Grid>

					<Stack style={{ marginTop: '10px' }}>
						<TenderViewAssortment
							passProps={childAssortmentProps}
							assortmentOptions={assortmentDataOptions}
							tenderLotSeq={tenderLotSeq}
							insSeq={assortSeq}
						/>
					</Stack>

					<button type="submit" hidden />
				</FormContainer>
				<Grid>
					<Grid container spacing={0.5} style={{ marginTop: '8px' }}>
						<Grid item xs={0.85} className="address-btn">
							<Button
								onClick={e => {
									handleSubmit(e);
								}}
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
				</Grid>
			</MainCard>
		</>
	);
};

export default TenderView;
