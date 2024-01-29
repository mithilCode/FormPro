import { SyntheticEvent, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	Box,
	Button,
	Grid,
	Paper,
	Tab,
	Tabs,
	Typography,
	CircularProgress,
	createFilterOptions,
	FilterOptionsState
} from '@mui/material';
import dayjs from 'dayjs';

import {
	AutocompleteElement,
	DatePickerElement,
	FormContainer,
	TextFieldElement,
	TimePickerElement
} from '@app/components/rhfmui';

import { FormSchema, IFormInput } from '@pages/master/invoice/models/Invoices';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfiniteDrawer } from '@components/drawer';
import { InitialState } from '@utils/helpers';

import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { useInvoicesSlice } from '../store/slice';
import { invoicesSelector } from '../store/slice/invoices.selectors';

// *** CURRENCIES *** //
import { useCurrenciesSlice } from '@pages/master/currencies/store/slice';
import { currenciesSelector } from '@pages/master/currencies/store/slice/currencies.selectors';
import { currenciesState } from '@pages/master/currencies/store/slice/types';

// *** COMPANY *** //
import { useCompanysSlice } from '@pages/master/company/store/slice';
import { companysSelector } from '@pages/master/company/store/slice/companys.selectors';
import { companysState } from '@pages/master/company/store/slice/types';

import useFocusOnEnter from '@hooks/useFocusOnEnter';
import { useConfirm } from 'material-ui-confirm';
import useThrottle from '@hooks/useThrottle';

import InvoiceDetail from './InvoiceDetail';
import InvoiceDocument from './InvoiceDocument';
import Invoices from './Invoices';

import MainCard from '@components/MainCard';

const acCurFilter = createFilterOptions();
const partyFilter = createFilterOptions();
const companyFilter = createFilterOptions();
const brokerFilter = createFilterOptions();

import './invoice.css';
import { invoicesState } from '../store/slice/types';

function Invoice() {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: invoicesActions } = useInvoicesSlice();
	//*** ExtraActions ***//
	const { actions: currenciesActions } = useCurrenciesSlice();
	const { actions: companysActions } = useCompanysSlice();
	const { actions } = useSnackBarSlice();

	// *** Invoices State *** //
	const invoicesState = useSelector(invoicesSelector);
	const {
		getOneDetSuccess,
		addSuccess,
		deleteSuccess,
		getPartySuccess,
		getPartyError,
		getBrokerSuccess,
		getBrokerError,
		getBillTypeSuccess,
		getBillTypeError
	} = invoicesState;
	// addSuccess

	// *** CURRENCY State *** //
	const currenciesState = useSelector(currenciesSelector);
	const { getError: getCurrenciesError, getSuccess: getCurrenciesSuccess } = currenciesState;

	// *** COMPANY State *** //
	const companysState = useSelector(companysSelector);
	const { getError: getCompanysError, getSuccess: getCompanysSuccess } = companysState;

	// add your Locale  👿
	const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		//formState,
		formState: { errors, isSubmitting },
		setFocus,
		reset,
		trigger
	} = formContext;

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {
			inv_mas: {
				trans_date: dayjs(new Date()),
				trans_time: dayjs(new Date())
			}
		},
		touched: null,
		errors: null
	});

	//***A/C CURRENCY */
	const [accountLoading, setAccountLoading] = useState(false);
	const [accountInputValue, setAccountInputValue] = useState('');
	const [accountOptions, setAccountOptions] = useState<currenciesState[]>([]);
	const throttledInputAccountValue = useThrottle(accountInputValue, 400);

	//***COMPANY*/
	const [companyLoading, setCompanyLoading] = useState(false);
	const [companyInputValue, setCompanyInputValue] = useState('');
	const [companyOptions, setCompanyOptions] = useState<companysState[]>([]);
	const throttledInputCompanyValue = useThrottle(companyInputValue, 400);

	//add your reference
	const formRef = useRef();

	const { onEnterKey } = useFocusOnEnter(formRef, formContext.formState.errors);

	const [selectedTab, setSelectedTab] = useState<number>(0);
	const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [enableButton, setEnableButton] = useState<boolean>(true);
	const [enableButton1, setEnableButton1] = useState<boolean>(true);
	const [enableSaveButton, setEnableSaveButton] = useState(false);
	const [, setEnableSaveButton1] = useState<boolean>(false);
	const [documentOptions, setDocumentOptions] = useState<any>([]);
	const [invoiceDetailOptions, setInvoiceDetailOptions] = useState<any>([]);
	const [currentAction, setCurrentAction] = useState('');

	// PARTY
	const [partyLoading, setPartyLoading] = useState(false);
	const [partyInputValue, setPartyInputValue] = useState('');
	const [partyOptions, setPartyOptions] = useState<invoicesState[]>([]);
	const throttledInputPartyValue = useThrottle(partyInputValue, 400);

	// BROKER
	const [brokerLoading, setBrokerLoading] = useState(false);
	const [brokerInputValue, setBrokerInputValue] = useState('');
	const [brokerOptions, setBrokerOptions] = useState<invoicesState[]>([]);
	const throttledInputBrokerValue = useThrottle(brokerInputValue, 400);

	const [loadHeader, setLoadHeader] = useState<boolean>(true);
	const [billTypeOptions, setBillTypeOptions] = useState<any>([]);

	// add your refrence  👿
	const addButtonRef = useRef<any>(null);
	const editButtonRef = useRef<any>(null);
	const deleteButtonRef = useRef<any>(null);
	const viewButtonRef = useRef<any>(null);
	const saveButtonRef = useRef<any>(null);
	const cancelButtonRef = useRef<any>(null);

	let refPage = [
		useHotkeys<any>('alt+a', () => addButtonRef.current.click()),
		useHotkeys<any>('alt+e', () => editButtonRef.current.click()),
		useHotkeys<any>('alt+d', () => deleteButtonRef.current.click()),
		useHotkeys<any>('alt+v', () => viewButtonRef.current.click()),
		useHotkeys<any>('alt+s', () => saveButtonRef.current.click()),
		useHotkeys<any>('alt+c', () => cancelButtonRef.current.click())
	];

	const confirm = useConfirm();
	const handleKeyDown = (event: any) => {
		if (event.altKey && event.key === 'e') {
			event.preventDefault();
		}
	};

	//** FIRST USEEFFECT WITH [] */
	useEffect(() => {
		//API COMES FROM PARA
		dispatch(
			invoicesActions.getBillType(
				`'PUR_BILL_TYPE'/?page=1&limit=10&pagination=false&columnType=bill_type`
			)
		);
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			dispatch(invoicesActions.reset());
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	// *** ACCOUNT CURRENCY *** //
	useEffect(() => {
		if (getCurrenciesSuccess) {
			if (getCurrenciesSuccess?.results) {
				setAccountOptions(getCurrenciesSuccess?.results);
			} else {
				setAccountOptions([]);
			}
		}
		if (getCurrenciesError) {
			setAccountOptions([]);
		}
		setAccountLoading(false);
	}, [getCurrenciesError, getCurrenciesSuccess]);

	useEffect(() => {
		dispatch(currenciesActions.reset());
		if (throttledInputAccountValue === '' && pageState?.touched?.ac_currency) {
			setAccountLoading(true);
			dispatch(currenciesActions.get({ QueryParams: `limit=10` }));
			return undefined;
		} else if (throttledInputAccountValue !== '') {
			setAccountLoading(true);
			dispatch(currenciesActions.get({ QueryParams: `q=${throttledInputAccountValue}` }));
		}
	}, [throttledInputAccountValue]);

	// *** COMPANY *** //
	useEffect(() => {
		if (getCompanysSuccess) {
			if (getCompanysSuccess?.results) {
				setCompanyOptions(getCompanysSuccess?.results);
			} else {
				setCompanyOptions([]);
			}
		}
		if (getCompanysError) {
			setCompanyOptions([]);
		}
		setCompanyLoading(false);
	}, [getCompanysError, getCompanysSuccess]);

	useEffect(() => {
		dispatch(companysActions.reset());
		if (throttledInputCompanyValue === '' && pageState?.touched?.company) {
			setCompanyLoading(true);
			dispatch(companysActions.get({ QueryParams: `limit=10` }));
			return undefined;
		} else if (throttledInputCompanyValue !== '') {
			setCompanyLoading(true);
			dispatch(companysActions.get({ QueryParams: `q=${throttledInputAccountValue}` }));
		}
	}, [throttledInputCompanyValue]);

	// *** Bill Type *** //
	useEffect(() => {
		if (getBillTypeSuccess) {
			if (getBillTypeSuccess?.results) {
				setBillTypeOptions(getBillTypeSuccess?.results);
				console.log(billTypeOptions, 'billTypeOptions');
			} else {
				setBillTypeOptions([]);
			}
		}
	}, [getBillTypeSuccess, getBillTypeError]);

	// ** HANDLE VIEW SUCCESS ** //
	useEffect(() => {
		if (getOneDetSuccess) {
			if (getOneDetSuccess?.results) {
				console.log(getOneDetSuccess?.results, 'getOneDetSuccess?.results');
				setPageState(pageState => ({
					...pageState,
					values: {
						...pageState.values,

						inv_mas: {
							...getOneDetSuccess?.results.inv_mas
						},
						inv_det_info: getOneDetSuccess?.results.inv_det_info,
						inv_det: getOneDetSuccess?.results.inv_det,
						doc_det: getOneDetSuccess?.results.doc_det,
						bill_info: getOneDetSuccess?.results.bill_info
					}
				}));

				let result = JSON.parse(JSON.stringify(getOneDetSuccess?.results));
				result['inv_mas']['trans_date'] = dayjs(result.inv_mas.trans_date);
				// result['inv_mas']['trans_time'] = dayjs(result.inv_mas.trans_time);
				result['bill_info']['invoice_date'] = dayjs(result.bill_info.invoice_date);
				result['bill_info']['due_date'] = dayjs(result.bill_info.due_date);
				reset(result);
				setDocumentOptions(getOneDetSuccess?.results.doc_det);
				let mergedObject = getOneDetSuccess?.results.inv_det_info.map((infoItem: any) => {
					const matchingDetItem = getOneDetSuccess?.results.inv_det.find(
						(detItem: any) => detItem.seq_no === infoItem.seq_no
					);
					return { ...infoItem, ...matchingDetItem };
				});
				setInvoiceDetailOptions(mergedObject);
			}
		}
	}, [getOneDetSuccess]);

	// *** PARTY SUCCESS *** //
	useEffect(() => {
		if (getPartySuccess) {
			if (getPartySuccess?.results) {
				setPartyOptions(getPartySuccess?.results);
			} else {
				setPartyOptions([]);
			}
		}
		if (getPartyError) {
			setPartyOptions([]);
		}
		setPartyLoading(false);
	}, [getPartyError, getPartySuccess]);

	useEffect(() => {
		dispatch(invoicesActions.reset());
		if (throttledInputPartyValue === '' && pageState?.touched?.party) {
			setPartyLoading(true);
			dispatch(invoicesActions.getParty({ QueryParams: `pagination=false&q=party='true'` }));
			return undefined;
		} else if (throttledInputPartyValue !== '') {
			setPartyLoading(true);
			dispatch(
				invoicesActions.getParty({
					QueryParams: `q=party='True' and name like '%${throttledInputPartyValue}%'`
				})
			);
		}
	}, [throttledInputPartyValue]);

	// *** BROKER SUCCESS *** //
	useEffect(() => {
		if (getBrokerSuccess) {
			if (getBrokerSuccess?.results) {
				setBrokerOptions(getBrokerSuccess?.results);
			} else {
				setBrokerOptions([]);
			}
		}
		if (getBrokerError) {
			setBrokerOptions([]);
		}
		setBrokerLoading(false);
	}, [getBrokerError, getBrokerSuccess]);

	useEffect(() => {
		dispatch(invoicesActions.reset());
		if (throttledInputBrokerValue === '' && pageState?.touched?.broker) {
			setBrokerLoading(true);
			dispatch(
				invoicesActions.getBroker({ QueryParams: `pagination=false&q=broker='true'` })
			);
			return undefined;
		} else if (throttledInputBrokerValue !== '') {
			setBrokerLoading(true);
			dispatch(
				invoicesActions.getBroker({
					QueryParams: `q=broker='True' and name like '%${throttledInputPartyValue}%'`
				})
			);
		}
	}, [throttledInputBrokerValue]);

	useEffect(() => {
		if (editMode) {
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('inv_mas.name');
			}, 100);
		}
	}, [editMode]);

	useEffect(() => {
		const firstError = (Object.keys(errors) as Array<keyof typeof errors>).reduce<
			keyof typeof errors | null
		>((field, a) => {
			const fieldKey = field as keyof typeof errors;
			return errors[fieldKey] ? fieldKey : a;
		}, null);

		if (firstError) {
			setFocus(firstError as any);
		}
	}, [errors, setFocus]);

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
			reset({
				inv_mas: { name: null, trans_date: dayjs(new Date()) } as any
			});
			setEnableSaveButton1(false);
			setEnableSaveButton(false);
			setEnableButton(true);
			setEnableButton1(true);
			setEditMode(false);
			setCurrentAction('Save');
			setDocumentOptions(null);
			setInvoiceDetailOptions(null);
			//reset()
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});
		}
	}, [addSuccess]);

	useEffect(() => {
		if (deleteSuccess) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Deleted successfully.',
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
			reset({
				inv_mas: { name: null, trans_date: dayjs(new Date()) } as any
			});
			setEnableSaveButton1(false);
			setEnableSaveButton(false);
			setEnableButton(true);
			setEnableButton1(true);
			setEditMode(false);
			setCurrentAction('Save');
			setDocumentOptions(null);
			setInvoiceDetailOptions(null);
			//reset()
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});
		}
	}, [deleteSuccess]);

	// add your Event Handler ..., handleChange, OnSubmit  👿

	const toggleEditMode = () => {
		setEditMode(!editMode);
	};

	const onEditClick = () => {
		setOpenAddDrawer(true);
		reset({
			inv_mas: {
				name: null,
				trans_date: dayjs(new Date()),
				trans_time: dayjs(new Date())
			} as any
		});
		setDocumentOptions([]);
		setInvoiceDetailOptions([]);
		setPageState({
			isValid: false,
			values: {},
			touched: null,
			errors: null
		});
		reset();
		setPageState(value => ({
			...value,
			values: {
				inv_mas: {
					action: 'insert',
					trans_date: dayjs(new Date()),
					trans_time: dayjs(new Date())
				}
			}
		}));
		if (currentAction == 'View') {
			setCurrentAction('View1');
		} else {
			setCurrentAction('View');
		}
	};

	const handleDrawerToggle = () => {
		setOpenAddDrawer(false);
	};

	// Enable the Save button and disable the Edit button
	const handleEdit = () => {
		setEnableSaveButton1(true);
		setEnableSaveButton(true);
		setEnableButton1(true);
		setEnableButton(false);
		setEditMode(true);
	};

	// handle function for tabs
	const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setSelectedTab(newValue);
		setDocumentOptions(pageState.values?.doc_det);
		setInvoiceDetailOptions(pageState.values?.inv_det_info);
	};

	const handleAdd = (event: any, arrName: string) => {
		setEnableButton1(true);
		setEnableButton(true);
		event.persist();
		reset({
			inv_mas: {
				name: null,
				trans_date: dayjs(new Date()),
				trans_time: dayjs(new Date())
			} as any
		});
		setDocumentOptions(null);
		setInvoiceDetailOptions(null);
		//reset()
		setPageState({
			isValid: false,
			values: {},
			touched: null,
			errors: null
		});
		setPageState(value => ({
			...value,
			values: {
				[arrName]: {
					action: 'insert',
					trans_date: dayjs(new Date()),
					trans_time: dayjs(new Date())
				},
				['bill_info']: {
					...pageState.values['bill_info'],
					action: 'insert'
				}
			}
		}));

		setEnableSaveButton(true);
		setCurrentAction('Add');
	};

	const handleUpdate = (event: any, arrName: string) => {
		// event.persist();
		setPageState(value => ({
			...value,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					action: 'update'
				},
				['bill_info']: {
					...pageState.values['bill_info'],
					action: 'update'
				}
			}
		}));
		setEnableSaveButton(true);
		setCurrentAction('Edit');
	};

	const handleCancel = async (event: any) => {
		event.persist();
		setEnableSaveButton1(false);
		setEnableSaveButton(false);
		setEnableButton(true);
		setEnableButton1(true);
		setEditMode(false);
		reset({
			inv_mas: {
				name: null,
				trans_date: dayjs(new Date()),
				trans_time: dayjs(new Date())
			} as any
		});

		setCurrentAction('Cancel');
		setDocumentOptions([]);
		setInvoiceDetailOptions([]);
		//reset()
		setPageState({
			isValid: false,
			values: {},
			touched: null,
			errors: null
		});
	};

	const handleDelete = (event: any) => {
		if (pageState.values) {
			confirm({
				description: 'Are you sure delete invoice ?',
				cancellationButtonProps: { autoFocus: true },
				confirmationText: 'Yes',
				cancellationText: 'No'
			})
				.then(() => {
					dispatch(invoicesActions.delete({ seq_no: pageState.values.inv_mas.seq_no }));
				})
				.catch(() => {
					/* */
				});
		}
	};

	const handleTransDateChange = (newValue: any) => {
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					['inv_mas']: {
						...pageState.values['inv_mas'],
						trans_date: dayjs(new Date(newValue.$d)).format('YYYY-MM-DD')
					}
				}
			}));
		}
	};
	const handleTransTimeChange = (newValue: any) => {
		if (newValue?.$d) {
			const formattedTime = dayjs(new Date(newValue.$d)).format('HH:mm:ss');
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					['inv_mas']: {
						...pageState.values['inv_mas'],
						trans_time: formattedTime
					}
				}
			}));
		}
	};
	const handleInvoiceDateChange = (newValue: any) => {
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					['bill_info']: {
						...pageState.values['bill_info'],
						invoice_date: dayjs(new Date(newValue.$d)).format('YYYY-MM-DD')
					}
				}
			}));
		}
	};
	const handleDueDateChange = (newValue: any) => {
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					['bill_info']: {
						...pageState.values['bill_info'],
						due_date: dayjs(new Date(newValue.$d)).format('YYYY-MM-DD')
					}
				}
			}));
		}
	};
	// Party change
	const handleFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = partyFilter(options, state);
		return filtered;
	};
	const handlePartyChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const PartyVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				inv_mas: {
					...pageState.values['inv_mas'],
					from: PartyVal
				}
			}
		}));

		if (!newValue) {
			dispatch(
				invoicesActions.getParty({ QueryParams: `pagination=false&q=customer='true` })
			);
		}
	};

	// ACCOUNT CURRENCY CHANGE
	const AcountCurOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = acCurFilter(options, state);
		return filtered;
	};
	const handleAccountCurChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const currencyVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			ac_currency: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				inv_mas: {
					...pageState.values.inv_mas,
					ac_currency: currencyVal
				}
			},
			touched: {
				...pageState.touched,
				ac_currency: true
			}
		}));

		if (!newValue) {
			dispatch(currenciesActions.get({ QueryParams: `page=1&limit=10` }));
		}
	};

	// COMPANY CHANGE
	const CompanyCurOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = companyFilter(options, state);
		return filtered;
	};
	const handleCompanyChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const companyVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				inv_mas: {
					...pageState.values.inv_mas,
					sub_comp: companyVal
				}
			},
			touched: {
				...pageState.touched,
				sub_comp: true
			}
		}));

		if (!newValue) {
			dispatch(companysActions.get({ QueryParams: `page=1&limit=10` }));
		}
	};

	// BROKER change
	const handleBrokerCurOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = brokerFilter(options, state);
		return filtered;
	};
	const handleBrokerChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const brokerVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				bill_info: {
					...pageState.values.bill_info,
					broker: brokerVal
				}
			}
		}));

		if (!newValue) {
			dispatch(invoicesActions.getBroker({ QueryParams: `pagination=false&q=broker='true` }));
		}
	};

	// BILL TYPE change
	const handleBillTypeChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const billTypeVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				bill_info: {
					...pageState.values['bill_info'],
					bill_type: billTypeVal
				}
			},
			touched: {
				...pageState.touched,
				bill_type: true
			}
		}));
	};

	const handleChange = (event: any) => {
		event.persist();

		const splitEleName = event.target.name.split('.');
		if (splitEleName.length > 1) {
			const objName = splitEleName[0];
			const eleName = splitEleName[1];

			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					[objName]: {
						...pageState.values[objName],
						[eleName]:
							event.target.type === 'checkbox'
								? event.target.checked
								: event.target.value.toUpperCase()
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
				}
			}));
		}
	};

	// const onSubmit = async () => {};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		dispatch(invoicesActions.add(pageState.values));
	};

	const childPropsInvoiceDocument = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				doc_det: array
			}
		}));
	};

	const childPropsInvoiceDetail = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				inv_det_info: array,
				inv_det: array
			}
		}));
	};

	useEffect(() => {
		console.log(pageState.values, 'pageState.valueeeeeeeee');
	}, [pageState]);

	const childPropsInvoices = (array: any, data?: any) => {
		dispatch(invoicesActions.getOneDet(array?.seq_no));
	};

	console.log(billTypeOptions, 'billTypeOptions');

	return (
		<>
			<div id="scroll-container">
				<div id="party-container" ref={refPage as any} tabIndex={-1}>
					<Box id="form-main" ref={formRef} onKeyUp={event => onEnterKey(event)}>
						<MainCard content={false} ref={refPage as any} tabIndex={-1}>
							<FormContainer
								formContext={formContext}
								FormProps={{ autoComplete: 'off' }}>
								<Grid container>
									<fieldset className="fieldset-size">
										<legend>Invoice</legend>
										<Grid container spacing={0.5}>
											<Grid item xs={4.5}>
												<Grid container alignItems="center">
													<Grid item xs={2.5}>
														<Typography variant="subtitle1">
															Date
														</Typography>
													</Grid>
													<Grid item xs={3} id="date-picker">
														<DatePickerElement
															name="inv_mas.trans_date"
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															readOnly={!editMode}
															disabled={!editMode}
															format="DD-MM-YYYY"
															onChange={newValue =>
																handleTransDateChange(newValue)
															}
														/>
													</Grid>
													<Grid item xs={2} id="time-picker">
														<TimePickerElement
															className="custom-textfield disabled-textfield"
															readOnly={true}
															disabled={true}
															format="HH:mm"
															name="inv_mas.trans_time"
															onChange={newValue =>
																handleTransTimeChange(newValue)
															}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={6}>
												<Grid container alignItems="center">
													<Grid item xs={2}>
														<Typography variant="subtitle1">
															Type
														</Typography>
													</Grid>
													<Grid item xs={3}>
														<AutocompleteElement
															// loading={tenderNoLoading}
															classname={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															autocompleteProps={{
																disabled: !editMode,
																selectOnFocus: true,
																clearOnBlur: true,
																handleHomeEndKeys: true,
																freeSolo: true,
																forcePopupIcon: true,
																autoHighlight: true,
																openOnFocus: true,
																autoFocus: true
																// 	onChange: (event, value, reason, details) =>
																// 		handleTenderNoChange(
																// 			event,
																// 			value,
																// 			reason,
																// 			details
																// 		),
																// 	filterOptions: (options, state) =>
																// 		handleFilterOptions(options, state),
																// 	getOptionLabel: option => {
																// 		if (typeof option === 'string') {
																// 			return option;
																// 		}
																// 		if (option.inputValue) {
																// 			return option.inputValue;
																// 		}
																// 		return option.tender.name;
																// 	}
																// }}
																// name="tender_no"
																// options={tenderNoOptions}
																// textFieldProps={{
																// 	InputProps: {},
																// 	onChange: e =>
																// 		setTenderNoInputValue(e.target.value),
																// 	onFocus: () => {
																// 		if (
																// 			tenderNoOptions &&
																// 			tenderNoOptions.length === 0
																// 		) {
																// 			dispatch(
																// 				tenderlotimportsActions.getTenderNo({
																// 					QueryParams: `page=1&limit=5000000&pagination=false`
																// 				})
																// 			);
																// 		}
																// 	}
															}}
															name="inv_mas.trans_type.name"
															options={[]}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={4.5}>
												<Grid container alignItems="center">
													<Grid item xs={2.5}>
														<Typography variant="subtitle1">
															Party Name
														</Typography>
													</Grid>
													<Grid item xs={8}>
														<AutocompleteElement
															classname={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															loading={partyLoading}
															autocompleteProps={{
																disabled: false,
																selectOnFocus: true,
																clearOnBlur: true,
																handleHomeEndKeys: true,
																freeSolo: true,
																forcePopupIcon: true,
																autoHighlight: true,
																openOnFocus: true,
																autoFocus: true,
																onChange: (
																	event,
																	value,
																	reason,
																	details
																) =>
																	handlePartyChange(
																		event,
																		value,
																		reason,
																		details
																	),
																filterOptions: (options, state) =>
																	handleFilterOptions(
																		options,
																		state
																	),
																getOptionLabel: option => {
																	if (
																		typeof option === 'string'
																	) {
																		return option;
																	}
																	if (option.inputValue) {
																		return option.inputValue;
																	}
																	return option.name;
																}
															}}
															name="inv_mas.from"
															options={partyOptions}
															textFieldProps={{
																InputProps: {},
																onChange: e =>
																	setPartyInputValue(
																		e.target.value
																	),
																onFocus: () => {
																	if (
																		partyOptions &&
																		partyOptions.length === 0
																	) {
																		dispatch(
																			invoicesActions.getParty(
																				{
																					QueryParams: `pagination=false&q=customer='true'`
																				}
																			)
																		);
																	}
																}
															}}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={4}>
												<Grid container alignItems="center">
													<Grid item xs={3}>
														<Typography variant="subtitle1">
															Sub Company
														</Typography>
													</Grid>
													<Grid item xs={8}>
														<AutocompleteElement
															loading={accountLoading}
															classname={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															autocompleteProps={{
																disabled: !editMode,
																selectOnFocus: true,
																clearOnBlur: true,
																handleHomeEndKeys: true,
																freeSolo: true,
																forcePopupIcon: true,
																autoHighlight: true,
																openOnFocus: true,
																onChange: (
																	event,
																	value,
																	reason,
																	details
																) =>
																	handleCompanyChange(
																		event,
																		value,
																		reason,
																		details
																	),
																filterOptions: (options, state) =>
																	CompanyCurOptions(
																		options,
																		state
																	),
																getOptionLabel: option => {
																	if (
																		typeof option === 'string'
																	) {
																		return option;
																	}
																	if (option.inputValue) {
																		return option.inputValue;
																	}
																	return option.name;
																}
															}}
															name="inv_mas.sub_comp"
															options={companyOptions}
															textFieldProps={{
																InputProps: {},
																onChange: e =>
																	setCompanyInputValue(
																		e.target.value
																	),
																onFocus: () => {
																	if (
																		companyOptions &&
																		companyOptions.length === 0
																	) {
																		dispatch(
																			companysActions.get({
																				QueryParams: `page=1&limit=10`
																			})
																		);
																	}
																}
															}}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={3.5}>
												<Grid container alignItems="center">
													<Grid item xs={3}>
														<Typography variant="subtitle1">
															Comments
														</Typography>
													</Grid>
													<Grid item xs={9}>
														<TextFieldElement
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															name="inv_mas.comments"
															fullWidth
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</fieldset>

									<fieldset className="fieldset-size">
										<legend>Bill Information</legend>
										<Grid container spacing={0.5}>
											<Grid item xs={3}>
												<Grid container alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															Invoice Date
														</Typography>
													</Grid>
													<Grid item xs={4.5} id="date-picker">
														<DatePickerElement
															name="bill_info.invoice_date"
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															readOnly={!editMode}
															disabled={!editMode}
															format="DD-MM-YYYY"
															onChange={newValue =>
																handleInvoiceDateChange(newValue)
															}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={3}>
												<Grid container alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															Invoice No
														</Typography>
													</Grid>
													<Grid item xs={4.5}>
														<TextFieldElement
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															name="bill_info.invoice_no"
															fullWidth
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={3}>
												<Grid container alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															Bill type
														</Typography>
													</Grid>
													<Grid item xs={5}>
														<AutocompleteElement
															classname={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															name="bill_info.bill_type"
															options={billTypeOptions}
															autocompleteProps={{
																disabled: !editMode,
																clearIcon: false,

																onChange: (
																	event,
																	value,
																	reason,
																	details
																) =>
																	handleBillTypeChange(
																		event,
																		value,
																		reason,
																		details
																	),
																getOptionLabel: option => {
																	// Regular option
																	return option?.name;
																}
															}}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={3}>
												<Grid container alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															Currency
														</Typography>
													</Grid>
													<Grid item xs={4.5}>
														<AutocompleteElement
															loading={accountLoading}
															classname={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															autocompleteProps={{
																disabled: !editMode,
																selectOnFocus: true,
																clearOnBlur: true,
																handleHomeEndKeys: true,
																freeSolo: true,
																forcePopupIcon: true,
																autoHighlight: true,
																openOnFocus: true,
																onChange: (
																	event,
																	value,
																	reason,
																	details
																) =>
																	handleAccountCurChange(
																		event,
																		value,
																		reason,
																		details
																	),
																filterOptions: (options, state) =>
																	AcountCurOptions(
																		options,
																		state
																	),
																getOptionLabel: option => {
																	if (
																		typeof option === 'string'
																	) {
																		return option;
																	}
																	if (option.inputValue) {
																		return option.inputValue;
																	}
																	return option.name;
																}
															}}
															name="bill_info.currency"
															options={accountOptions}
															textFieldProps={{
																InputProps: {},
																onChange: e =>
																	setAccountInputValue(
																		e.target.value
																	),
																onFocus: () => {
																	if (
																		accountOptions &&
																		accountOptions.length === 0
																	) {
																		dispatch(
																			currenciesActions.get({
																				QueryParams: `page=1&limit=10`
																			})
																		);
																	}
																}
															}}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={3}>
												<Grid container alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															Exch Rate
														</Typography>
													</Grid>
													<Grid item xs={3}>
														<TextFieldElement
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															name="bill_info.exch_rate"
															fullWidth
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={3}>
												<Grid container alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															Broker Name
														</Typography>
													</Grid>
													<Grid item xs={7}>
														<AutocompleteElement
															classname={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															loading={brokerLoading}
															autocompleteProps={{
																disabled: false,
																selectOnFocus: true,
																clearOnBlur: true,
																handleHomeEndKeys: true,
																freeSolo: true,
																forcePopupIcon: true,
																autoHighlight: true,
																openOnFocus: true,
																autoFocus: true,
																onChange: (
																	event,
																	value,
																	reason,
																	details
																) =>
																	handleBrokerChange(
																		event,
																		value,
																		reason,
																		details
																	),
																filterOptions: (options, state) =>
																	handleBrokerCurOptions(
																		options,
																		state
																	),
																getOptionLabel: option => {
																	if (
																		typeof option === 'string'
																	) {
																		return option;
																	}
																	if (option.inputValue) {
																		return option.inputValue;
																	}
																	return option.name;
																}
															}}
															name="bill_info.broker"
															options={brokerOptions}
															textFieldProps={{
																InputProps: {},
																onChange: e =>
																	setBrokerInputValue(
																		e.target.value
																	),
																onFocus: () => {
																	if (
																		brokerOptions &&
																		brokerOptions.length === 0
																	) {
																		dispatch(
																			invoicesActions.getBroker(
																				{
																					QueryParams: `pagination=false&q=broker='true'`
																				}
																			)
																		);
																	}
																}
															}}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={3}>
												<Grid container alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															Terms
														</Typography>
													</Grid>
													<Grid item xs={5}>
														<AutocompleteElement
															// loading={tenderNoLoading}
															classname={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															autocompleteProps={{
																disabled: !editMode,
																selectOnFocus: true,
																clearOnBlur: true,
																handleHomeEndKeys: true,
																freeSolo: true,
																forcePopupIcon: true,
																autoHighlight: true,
																openOnFocus: true,
																autoFocus: true
																// 	onChange: (event, value, reason, details) =>
																// 		handleTenderNoChange(
																// 			event,
																// 			value,
																// 			reason,
																// 			details
																// 		),
																// 	filterOptions: (options, state) =>
																// 		handleFilterOptions(options, state),
																// 	getOptionLabel: option => {
																// 		if (typeof option === 'string') {
																// 			return option;
																// 		}
																// 		if (option.inputValue) {
																// 			return option.inputValue;
																// 		}
																// 		return option.tender.name;
																// 	}
																// }}
																// name="tender_no"
																// options={tenderNoOptions}
																// textFieldProps={{
																// 	InputProps: {},
																// 	onChange: e =>
																// 		setTenderNoInputValue(e.target.value),
																// 	onFocus: () => {
																// 		if (
																// 			tenderNoOptions &&
																// 			tenderNoOptions.length === 0
																// 		) {
																// 			dispatch(
																// 				tenderlotimportsActions.getTenderNo({
																// 					QueryParams: `page=1&limit=5000000&pagination=false`
																// 				})
																// 			);
																// 		}
																// 	}
															}}
															name="bill_info.terms.name"
															options={[]}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={3}>
												<Grid container alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															Due Date
														</Typography>
													</Grid>
													<Grid item xs={4.5} id="date-picker">
														<DatePickerElement
															name="bill_info.due_date"
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															readOnly={!editMode}
															disabled={!editMode}
															format="DD-MM-YYYY"
															onChange={newValue =>
																handleDueDateChange(newValue)
															}
														/>
													</Grid>
													<Grid item xs={2}>
														<TextFieldElement
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															name="bill_info.due_days"
															fullWidth
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={3}>
												<Grid container alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															Expense
														</Typography>
													</Grid>
													<Grid item xs={6}>
														<TextFieldElement
															id="due_day"
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															name="bill_info.expense"
															fullWidth
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</fieldset>
								</Grid>

								<div className="marginTop">
									<Paper>
										<Tabs value={selectedTab} onChange={handleTabChange}>
											<Tab label="invoice details" />
											<Tab label="invoice document" />
										</Tabs>
									</Paper>

									{selectedTab === 0 && (
										<InvoiceDetail
											passProps={childPropsInvoiceDetail}
											invoiceDetailOptions={invoiceDetailOptions}
											currentAction={currentAction}
											editMode={editMode}
											loadHeader={loadHeader}
											setLoadHeader={setLoadHeader}
										/>
									)}
									{selectedTab === 1 && (
										<InvoiceDocument
											passProps={childPropsInvoiceDocument}
											documentOptions={documentOptions}
											currentAction={currentAction}
											editMode={editMode}
										/>
									)}
								</div>

								{/* --------------Footer Button start from Below -------------- */}
							</FormContainer>

							<Grid className="footer-main-dev-button">
								<Grid container spacing={0.5} className="marginTop">
									<Grid item xs={0.95}>
										<Button
											ref={addButtonRef}
											className="custom-button"
											variant="outlined"
											fullWidth
											// font-weight="bolder"
											placeholder="ADD"
											color="primary"
											size="small"
											disabled={enableSaveButton}
											onClick={e => {
												toggleEditMode();
												handleAdd(e, 'inv_mas');
												setEnableButton(false);
											}}
											tabIndex={-1}>
											+ Add
										</Button>
									</Grid>
									<Grid item xs={0.95}>
										<Button
											ref={editButtonRef}
											className="custom-button"
											variant="outlined"
											fullWidth
											placeholder="EDIT"
											size="small"
											disabled={enableButton1}
											onClick={e => {
												handleEdit();
												handleUpdate(e, 'inv_mas');
											}}
											tabIndex={-1}>
											Edit
										</Button>
									</Grid>
									<Grid item xs={0.95}>
										<Button
											ref={deleteButtonRef}
											className="custom-button"
											variant="outlined"
											fullWidth
											placeholder="DELETE"
											size="small"
											disabled={enableButton1}
											onClick={handleDelete}
											tabIndex={-1}>
											Delete
										</Button>
									</Grid>
									<Grid item xs={0.95}>
										<Button
											ref={viewButtonRef}
											className="custom-button"
											variant="outlined"
											fullWidth
											placeholder="VIEW"
											size="small"
											disabled={enableSaveButton}
											onClick={onEditClick}
											tabIndex={-1}>
											View
										</Button>
									</Grid>
									<Grid item xs={0.95}>
										<Button
											onClick={e => {
												handleSubmit(e);
											}}
											ref={saveButtonRef}
											disableElevation
											className={`custom-button ${
												enableButton ? 'disabled-textfield' : ''
											}`}
											type="submit"
											variant="outlined"
											color="primary"
											size="small"
											disabled={enableButton}
											tabIndex={-1}>
											{isSubmitting ? (
												<CircularProgress size={24} color="success" />
											) : (
												formatMessage({ id: 'Save' })
											)}
										</Button>
									</Grid>

									<Grid item xs={1}>
										<Button
											ref={cancelButtonRef}
											className="custom-button"
											variant="outlined"
											fullWidth
											placeholder="CANCEL"
											size="small"
											onClick={handleCancel}
											// disabled={enableButton1}
											tabIndex={-1}>
											Cancel
										</Button>
									</Grid>
								</Grid>
								{openAddDrawer && (
									<InfiniteDrawer
										width={80}
										component={Invoices}
										handleDrawerToggle={handleDrawerToggle}
										passProps={childPropsInvoices}
										setEnableButton1={setEnableButton1}
									/>
								)}
							</Grid>
						</MainCard>
					</Box>
				</div>
			</div>
		</>
	);
}

export default Invoice;
