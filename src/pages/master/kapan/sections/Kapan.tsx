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
	Typography,
	CircularProgress
} from '@mui/material';

import dayjs from 'dayjs';

import {
	AutocompleteElement,
	// AutocompleteElement,
	DatePickerElement,
	FormContainer,
	TextFieldElement
} from '@app/components/rhfmui';

import { FormSchema, IFormInput } from '@pages/master/kapan/models/Kapan';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfiniteDrawer } from '@components/drawer';
import { InitialState } from '@utils/helpers';

import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { useKapansSlice } from '../store/slice';
import { kapansSelector } from '../store/slice/kapans.selectors';

//INVOICE NUMBER
import { useInvoicesSlice } from '@pages/master/invoice/store/slice';
import { invoicesSelector } from '@pages/master/invoice/store/slice/invoices.selectors';

// *** CURRENCIES *** //
import { useCurrenciesSlice } from '@pages/master/currencies/store/slice';
import { currenciesSelector } from '@pages/master/currencies/store/slice/currencies.selectors';

import useFocusOnEnter from '@hooks/useFocusOnEnter';
import { useConfirm } from 'material-ui-confirm';
// import KapanDetail from './KapanDetail';
import Kapans from './Kapans';
import './kapan.css';
import TextFieldElementNumber from '@components/rhfmui/TextFieldElementNumber';

function Kapan() {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: kapansActions } = useKapansSlice();
	const { actions } = useSnackBarSlice();

	const invoicesState = useSelector(invoicesSelector);
	const { actions: invoicesActions } = useInvoicesSlice();

	//curriences
	const { actions: currenciesActions } = useCurrenciesSlice();

	// *** Kapan State *** //
	const kapansState = useSelector(kapansSelector);
	const { addSuccess, deleteSuccess, getOneDetSuccess } = kapansState;
	const {
		getInvoiceSuccess,
		getSupplierSuccess,
		getParaSuccess,
		getRoughSizeSuccess,
		getRoughQltySuccess,
		getMonthSuccess,
		getYearSuccess,
		getCountrySuccess,
		getSourceSuccess,
		getMineSuccess,
		getProgramSuccess
	} = invoicesState;

	// add your Slice Action  👿

	// *** Currency State *** //
	const currenciesState = useSelector(currenciesSelector);
	const { getSuccess: getCurrenciesSuccess } = currenciesState;

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
			kapan_mas: {
				trans_date: dayjs(new Date())
			}
		},
		touched: null,
		errors: null
	});

	//add your reference
	const formRef = useRef();

	const { onFirstElementFocus, onEnterKey } = useFocusOnEnter(
		formRef,
		formContext.formState.errors
	);

	const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false);

	const [editMode, setEditMode] = useState<boolean>(false);
	const [enableButton, setEnableButton] = useState<boolean>(true);
	const [enableButton1, setEnableButton1] = useState<boolean>(true);
	const [enableSaveButton, setEnableSaveButton] = useState(false);
	const [, setEnableSaveButton1] = useState<boolean>(false); // enableSaveButton1
	const [kapanOptions, setKapanOptions] = useState<any>([]);
	const [currentAction, setCurrentAction] = useState('');

	const [invoiceOptions, setInvoiceOptions] = useState<any>([]);
	const [supplierOptions, setSupplierOptions] = useState<any>([]);
	const [currencyOptions, setCurrencyOptions] = useState<any>([]);
	const [roughTypeOptions, setRoughTypeOptions] = useState<any>([]);
	const [roughSizeOptions, setRoughSizeOptions] = useState<any>([]);
	const [roughQltyOptions, setRoughQltyOptions] = useState<any>([]);
	const [monthOptions, setMonthOptions] = useState<any>([]);
	const [yearOptions, setYearOptions] = useState<any>([]);
	const [countryOptions, setCountryOptions] = useState<any>([]);
	const [sourceOptions, setSourceOptions] = useState<any>([]);
	const [mineOptions, setMineOptions] = useState<any>([]);
	const [programOptions, setProgramOptions] = useState<any>([]);
	const [resetAction, setResetAction] = useState(0);
	const [invSeq, setInvSeq] = useState<any>({ invSeq: null, invDet: null });

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

	useEffect(() => {
		if (getOneDetSuccess) {
			if (getOneDetSuccess?.results) {
				setPageState(pageState => ({
					...pageState,
					values: {
						...pageState.values,

						kapan_mas: {
							...getOneDetSuccess?.results.kapan_mas
						},
						inv_mas: getOneDetSuccess?.results?.inv_mas,
						bill_info: getOneDetSuccess?.results?.bill_info,
						inv_det: getOneDetSuccess?.results?.inv_det,
						inv_det_info: getOneDetSuccess?.results?.inv_det_info
					}
				}));

				let result = JSON.parse(JSON.stringify(getOneDetSuccess?.results));
				result['kapan_mas']['trans_date'] = dayjs(result.kapan_mas?.trans_date);
				result['kapan_mas']['premfg_end_date'] = dayjs(result.kapan_mas?.premfg_end_date);
				result['kapan_mas']['mfg_end_date'] = dayjs(result.kapan_mas?.mfg_end_date);
				result['kapan_mas']['close_date'] = dayjs(result.kapan_mas?.close_date);
				result['kapan_mas']['wgt'] = result.kapan_mas?.wgt?.toFixed(2);
				result['kapan_mas']['exch_rate'] = result.kapan_mas?.exch_rate?.toFixed(2);
				result['kapan_mas']['rate'] = result.kapan_mas?.rate?.toFixed(2);
				result['kapan_mas']['value'] = result.kapan_mas?.value?.toFixed(2);
				reset(result);
			}
		}
	}, [getOneDetSuccess]);

	useEffect(() => {
		dispatch(invoicesActions.getInvoice({ QueryParams: `page=1&limit=11&pagination=false` }));
		dispatch(
			currenciesActions.get({
				QueryParams: `page=1&limit=11&pagination=false`
			})
		);
		dispatch(
			invoicesActions.getPara(
				`'ROUGH_TYPE'/?page=1&limit=10&pagination=false&columnType=rough_type`
			)
		);
		dispatch(
			invoicesActions.getRoughSize(
				`'ROUGH_SIZE'/?page=1&limit=10&pagination=false&columnType=rough_size`
			)
		);
		dispatch(
			invoicesActions.getRoughQlty(
				`'ROUGH_QUALITY'/?page=1&limit=10&pagination=false&columnType=rough_quality`
			)
		);
		dispatch(
			invoicesActions.getMonth(
				`'ORIGIN_MONTH'/?page=1&limit=10&pagination=false&columnType=origin_month`
			)
		);
		dispatch(
			invoicesActions.getYear(
				`'ORIGIN_YEAR'/?page=1&limit=10&pagination=false&columnType=origin_year`
			)
		);
		dispatch(
			invoicesActions.getCountry(`'COO'/?page=1&limit=10&pagination=false&columnType=coo`)
		);
		dispatch(
			invoicesActions.getSource(`'SOO'/?page=1&limit=10&pagination=false&columnType=soo`)
		);
		dispatch(invoicesActions.getMine(`'MOO'/?page=1&limit=10&pagination=false&columnType=moo`));
		dispatch(
			invoicesActions.getProgram(
				`'PROGRAMS'/?page=1&limit=10&pagination=false&columnType=elig_brand`
			)
		);

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			dispatch(kapansActions.reset());
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		if (getInvoiceSuccess) {
			if (getInvoiceSuccess?.results) {
				setInvoiceOptions(getInvoiceSuccess?.results);
			} else {
				setInvoiceOptions([]);
			}
		}
	}, [getInvoiceSuccess]);

	useEffect(() => {
		if (getSupplierSuccess) {
			if (getSupplierSuccess?.results) {
				setPageState(pageState => ({
					...pageState,
					values: {
						...pageState.values,
						kapan_mas: {
							...pageState.values['kapan_mas'],
							trans_date: dayjs(new Date()),
							inv_seq: invSeq.invSeq,
							inv_det_seq: invSeq.invDet,
							origin_month: getSupplierSuccess?.results?.inv_det_info[0].origin_month,
							origin_year: getSupplierSuccess?.results?.inv_det_info[0].origin_year,
							coo: getSupplierSuccess?.results?.inv_det_info[0].coo,
							soo: getSupplierSuccess?.results?.inv_det_info[0].soo,
							moo: getSupplierSuccess?.results?.inv_det_info[0].moo,
							elig_brand: getSupplierSuccess?.results?.inv_det_info[0].elig_brand,
							rough_quality:
								getSupplierSuccess?.results?.inv_det_info[0].rough_quality,
							rough_type: getSupplierSuccess?.results?.inv_det_info[0].rough_type,
							rough_size: getSupplierSuccess?.results?.inv_det_info[0].rough_size,
							pcs: getSupplierSuccess?.results?.inv_det[0].pcs,
							wgt: getSupplierSuccess?.results?.inv_det[0].wgt?.toFixed(2),
							rate: getSupplierSuccess?.results?.inv_det[0].rate?.toFixed(2),
							value: getSupplierSuccess?.results?.inv_det[0].value?.toFixed(2),
							exch_rate:
								getSupplierSuccess?.results?.inv_det[0].exch_rate?.toFixed(2),
							from: getSupplierSuccess?.results?.inv_mas.from,
							invoice_no: getSupplierSuccess?.results?.bill_info.invoice_no
						}
					}
				}));

				//reset(pageState.values);
				// setTimeout(() => {
				// 	reset(pageState.values);
				// }, 1000);
				const timeout = setTimeout(() => {
					clearTimeout(timeout);
					setResetAction(1);
				}, 10);
			}
		}
	}, [getSupplierSuccess]);

	useEffect(() => {
		if (resetAction == 1) {
			reset(pageState.values);
			setResetAction(0);
		}
	}, [resetAction]);

	useEffect(() => {
		if (getCurrenciesSuccess) {
			if (getCurrenciesSuccess?.results) {
				setCurrencyOptions(getCurrenciesSuccess?.results);
			} else {
				setCurrencyOptions([]);
			}
		}
	}, [getCurrenciesSuccess]);

	useEffect(() => {
		if (getParaSuccess) {
			if (getParaSuccess?.results) {
				setRoughTypeOptions(getParaSuccess?.results);
			} else {
				setRoughTypeOptions([]);
			}
		}
	}, [getParaSuccess]);

	useEffect(() => {
		if (getRoughSizeSuccess) {
			if (getRoughSizeSuccess?.results) {
				setRoughSizeOptions(getRoughSizeSuccess?.results);
			} else {
				setRoughSizeOptions([]);
			}
		}
	}, [getRoughSizeSuccess]);

	useEffect(() => {
		if (getRoughQltySuccess) {
			if (getRoughQltySuccess?.results) {
				setRoughQltyOptions(getRoughQltySuccess?.results);
			} else {
				setRoughQltyOptions([]);
			}
		}
	}, [getRoughQltySuccess]);

	useEffect(() => {
		if (getMonthSuccess) {
			if (getMonthSuccess?.results) {
				setMonthOptions(getMonthSuccess?.results);
			} else {
				setMonthOptions([]);
			}
		}
	}, [getMonthSuccess]);

	useEffect(() => {
		if (getYearSuccess) {
			if (getYearSuccess?.results) {
				setYearOptions(getYearSuccess?.results);
			} else {
				setYearOptions([]);
			}
		}
	}, [getYearSuccess]);

	useEffect(() => {
		if (getCountrySuccess) {
			if (getCountrySuccess?.results) {
				setCountryOptions(getCountrySuccess?.results);
			} else {
				setCountryOptions([]);
			}
		}
	}, [getCountrySuccess]);

	useEffect(() => {
		if (getSourceSuccess) {
			if (getSourceSuccess?.results) {
				setSourceOptions(getSourceSuccess?.results);
			} else {
				setSourceOptions([]);
			}
		}
	}, [getSourceSuccess]);

	useEffect(() => {
		if (getMineSuccess) {
			if (getMineSuccess?.results) {
				setMineOptions(getMineSuccess?.results);
			} else {
				setMineOptions([]);
			}
		}
	}, [getMineSuccess]);

	useEffect(() => {
		if (getProgramSuccess) {
			if (getProgramSuccess?.results) {
				setProgramOptions(getProgramSuccess?.results);
			} else {
				setProgramOptions([]);
			}
		}
	}, [getProgramSuccess]);

	useEffect(() => {
		if (editMode) {
			const timer = setTimeout(() => {
				clearTimeout(timer);
				onFirstElementFocus();
			}, 500);
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
				kapan_mas: {
					invoice_no: '',
					trans_date: dayjs(new Date()),
					group_name: null
				} as any
			});
			setEnableSaveButton1(false);
			setEnableSaveButton(false);
			setEnableButton(true);
			setEnableButton1(true);
			setEditMode(false);

			setCurrentAction('Save');

			setKapanOptions(null);

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
				kapan_mas: { invoice_no: '', trans_date: dayjs(new Date()) } as any
			});
			setEnableSaveButton1(false);
			setEnableSaveButton(false);
			setEnableButton(true);
			setEnableButton1(true);
			setEditMode(false);

			setCurrentAction('Save');

			setKapanOptions(null);

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

	const handleInvoiceChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName?: any
	) => {
		if (newValue && newValue.seq_no) {
			setInvSeq({ invSeq: newValue.seq_no, invDet: newValue.inv_det_seq });
			dispatch(
				invoicesActions.getSupplier(
					`${newValue.seq_no}?inv_det_seq=${newValue.inv_det_seq}`
				)
			);
			setPageState(pageState => ({
				...pageState,
				values: {
					...pageState.values,
					kapan_mas: {
						...pageState.values['kapan_mas'],
						invoice_no: newValue.invoice_no
					}
				}
			}));
		}
	};

	const handleSupplierChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName?: any
	) => {
		const supplier = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				kapan_mas: {
					...pageState.values['kapan_mas'],
					from: supplier
				}
			}
		}));
	};

	const handleCurrencyChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const currencyVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				kapan_mas: {
					...pageState.values['kapan_mas'],
					currency: currencyVal
				}
			},
			touched: {
				...pageState.touched,
				currency: true
			}
		}));

		if (!newValue) {
			dispatch(currenciesActions.get({ QueryParams: `page=1&limit=10` }));
		}
	};

	const handleRoughTypeChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const roughTypeVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				kapan_mas: {
					...pageState.values['kapan_mas'],
					rough_type: roughTypeVal
				}
			},
			touched: {
				...pageState.touched,
				rough_type: true
			}
		}));
	};

	const handleRoughSizeChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const roughSizeVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				kapan_mas: {
					...pageState.values['kapan_mas'],
					rough_size: roughSizeVal
				}
			},
			touched: {
				...pageState.touched,
				rough_size: true
			}
		}));
	};

	const handleRoughQltyChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const roughQltyVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				kapan_mas: {
					...pageState.values['kapan_mas'],
					rough_quality: roughQltyVal
				}
			},
			touched: {
				...pageState.touched,
				rough_quality: true
			}
		}));
	};

	const handleMonthChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const monthVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				kapan_mas: {
					...pageState.values['kapan_mas'],
					origin_month: monthVal
				}
			},
			touched: {
				...pageState.touched,
				origin_month: true
			}
		}));
	};

	const handleYearChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const yearVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				kapan_mas: {
					...pageState.values['kapan_mas'],
					origin_year: yearVal
				}
			},
			touched: {
				...pageState.touched,
				origin_year: true
			}
		}));
	};

	const handleCountryChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const countryVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				kapan_mas: {
					...pageState.values['kapan_mas'],
					coo: countryVal
				}
			},
			touched: {
				...pageState.touched,
				coo: true
			}
		}));
	};

	const handleSourceChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const sourceVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				kapan_mas: {
					...pageState.values['kapan_mas'],
					soo: sourceVal
				}
			},
			touched: {
				...pageState.touched,
				soo: true
			}
		}));
	};

	const handleMineChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const mineVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				kapan_mas: {
					...pageState.values['kapan_mas'],
					moo: mineVal
				}
			},
			touched: {
				...pageState.touched,
				moo: true
			}
		}));
	};

	const handleProgramChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const programVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				kapan_mas: {
					...pageState.values['kapan_mas'],
					elig_brand: programVal
				}
			},
			touched: {
				...pageState.touched,
				elig_brand: true
			}
		}));
	};

	const toggleEditMode = () => {
		setEditMode(!editMode);
	};

	const onEditClick = () => {
		setOpenAddDrawer(true);

		reset({
			kapan_mas: { invoice_no: '', kapan_no: null, trans_date: dayjs(new Date()) } as any
		});

		setKapanOptions([]);

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
				kapan_mas: {
					action: 'insert'
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

	const handleAdd = (event: any, arrName: string) => {
		setEnableButton1(true);
		setEnableButton(true);

		event.persist();
		setKapanOptions(null);

		reset({
			kapan_mas: {
				invoice_no: '',
				trans_date: dayjs(new Date())
			} as any
		});
		setPageState({
			isValid: false,
			values: {},
			touched: null,
			errors: null
		});
		// //reset(pageState.values);
		setPageState(value => ({
			...value,
			values: {
				['kapan_mas']: {
					action: 'insert',
					trans_date: dayjs(new Date())
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

				['kapan_mas']: {
					...pageState.values['kapan_mas'],
					action: 'update',
					trans_date: dayjs(new Date())
				}
			}
		}));
		setEnableSaveButton(true);
		setCurrentAction('Edit');
	};

	const handleDelete = (event: any) => {
		if (pageState.values) {
			confirm({
				description: 'Are you sure delete Kapan ?',
				confirmationButtonProps: { autoFocus: true },
				confirmationText: 'Yes',
				cancellationText: 'No'
			})
				.then(() => {
					dispatch(kapansActions.delete({ seq_no: pageState.values.kapan_mas.seq_no }));
				})
				.catch(() => {
					/* */
				});
		}
	};
	const handleCreateDateChange = (newValue: any) => {
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					['kapan_mas']: {
						...pageState.values['kapan_mas'],
						trans_date: dayjs(new Date(newValue.$d))
					}
				}
			}));
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('kapan_mas.trans_date');
			}, 100);
		}
	};

	const handlePreMfgChange = (newValue: any) => {
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,

					['kapan_mas']: {
						...pageState.values['kapan_mas'],
						premfg_end_date: dayjs(new Date(newValue.$d)).format('YYYY-MM-DD')
					}
				}
			}));
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('kapan_mas.premfg_end_date');
			}, 100);
		}
	};

	const handleMfgChange = (newValue: any) => {
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,

					['kapan_mas']: {
						...pageState.values['kapan_mas'],
						mfg_end_date: dayjs(new Date(newValue.$d)).format('YYYY-MM-DD')
					}
				}
			}));
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('kapan_mas.mfg_end_date');
			}, 100);
		}
	};

	const handleCloseChange = (newValue: any) => {
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					['kapan_mas']: {
						...pageState.values['kapan_mas'],
						close_date: dayjs(new Date(newValue.$d)).format('YYYY-MM-DD')
					}
				}
			}));
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('kapan_mas.close_date');
			}, 100);
		}
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
					['kapan_mas']: {
						...pageState.values['kapan_mas'],
						[eleName]:
							event.target.type === 'checkbox'
								? event.target.checked
								: // : event.target.type === 'number'
								  // ? parseFloat(event.target.value).toFixed(2)
								  event.target.value.toUpperCase()
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
							: // : event.target.type === 'number'
							  // ? parseFloat(event.target.value).toFixed(2)
							  event.target.value.toUpperCase()
				}
			}));
		}
	};
	// const onSubmit = async () => {};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		// const validation = await trigger();
		// if (validation) {
		// 	dispatch(kapansActions.add(pageState.values));
		// }
		dispatch(kapansActions.add(pageState.values));
	};

	const handleCancel = async (event: any) => {
		event.persist();
		setEnableSaveButton1(false);
		setEnableSaveButton(false);
		setEnableButton(true);
		setEnableButton1(true);
		setEditMode(false);
		reset({
			kapan_mas: { invoice_no: '', trans_date: dayjs(new Date()) } as any
		});

		setCurrentAction('Cancel');
		setKapanOptions([]);

		//reset()
	};

	const childPropsKapans = (array: any, data?: any) => {
		dispatch(kapansActions.getOneDet(array?.seq_no));
	};

	return (
		<>
			<div id="scroll-container">
				<div
					id="party-container"
					ref={refPage as any}
					tabIndex={-1}
					style={{ outline: 'none' }}>
					<Box id="form-main" ref={formRef} onKeyUp={event => onEnterKey(event)}>
						<FormContainer
							formContext={formContext}
							FormProps={{ autoComplete: 'off' }}>
							<Grid container spacing={0.5}>
								<fieldset className="fieldset-size">
									<legend>Invoice Details</legend>
									<div className="test">
										<div className="inner-test">
											<Grid container className="margin-bottom">
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={4.5}>
															<Typography variant="subtitle1">
																Invoice No
															</Typography>
														</Grid>
														<Grid
															item
															xs={7.5}
															className="zodErrorHide">
															<AutocompleteElement
																classname={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																name="kapan_mas"
																options={invoiceOptions}
																autocompleteProps={{
																	id: 'seq_no',
																	disabled: !editMode,
																	clearIcon: false,
																	onChange: (
																		event,
																		value,
																		reason,
																		details
																	) =>
																		handleInvoiceChange(
																			event,
																			value,
																			reason,
																			details
																		),
																	getOptionLabel: option => {
																		// Regular option
																		return option?.invoice_no;
																	}
																}}
															/>
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={6}>
													<Grid
														container
														alignItems="center"
														className="gap1">
														<Grid item xs={4.4}>
															<Typography variant="subtitle1">
																Supplier Name
															</Typography>
														</Grid>
														<Grid item xs={7.6}>
															<AutocompleteElement
																classname={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: 'disabled-textfield'
																}`}
																name="kapan_mas.from"
																options={supplierOptions}
																autocompleteProps={{
																	id: 'inv',
																	disabled: true,
																	clearIcon: false,
																	onChange: (
																		event,
																		value,
																		reason,
																		details
																	) =>
																		handleSupplierChange(
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
											</Grid>
											<Grid container className="margin-bottom">
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={4.5}>
															<Typography variant="subtitle1">
																Pieces
															</Typography>
														</Grid>
														<Grid item xs={4}>
															<TextFieldElement
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																disabled={!editMode}
																name="kapan_mas.pcs"
																fullWidth
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={6}>
													<Grid
														container
														alignItems="center"
														className="gap1">
														<Grid item xs={4.4}>
															<Typography variant="subtitle1">
																Currency
															</Typography>
														</Grid>
														<Grid item xs={4}>
															<AutocompleteElement
																classname={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																name="kapan_mas.currency"
																options={currencyOptions}
																autocompleteProps={{
																	id: 'currency',
																	disabled: !editMode,
																	clearIcon: false,

																	onChange: (
																		event,
																		value,
																		reason,
																		details
																	) =>
																		handleCurrencyChange(
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
											</Grid>

											<Grid container className="margin-bottom">
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={4.5}>
															<Typography variant="subtitle1">
																Weight
															</Typography>
														</Grid>
														<Grid item xs={4}>
															<TextFieldElementNumber
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																type="number"
																disabled={!editMode}
																name="kapan_mas.wgt"
																fullWidth
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={6}>
													<Grid
														container
														alignItems="center"
														className="gap1">
														<Grid item xs={4.4}>
															<Typography variant="subtitle1">
																Exch Rate
															</Typography>
														</Grid>
														<Grid item xs={3}>
															<TextFieldElementNumber
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																disabled={!editMode}
																type="number"
																name="kapan_mas.exch_rate"
																fullWidth
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
											</Grid>

											<Grid container className="margin-bottom">
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={4.5}>
															<Typography variant="subtitle1">
																Bal Pieces
															</Typography>
														</Grid>
														<Grid item xs={4}>
															<TextFieldElement
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																disabled={!editMode}
																name="kapan_mas.bal_pcs"
																fullWidth
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={6}>
													<Grid
														container
														alignItems="center"
														className="gap1">
														<Grid item xs={4.4}>
															<Typography variant="subtitle1">
																Rate
															</Typography>
														</Grid>
														<Grid item xs={4}>
															<TextFieldElementNumber
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																disabled={!editMode}
																type="number"
																name="kapan_mas.rate"
																fullWidth
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
											</Grid>

											<Grid container className="margin-bottom">
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={4.5}>
															<Typography variant="subtitle1">
																Bal Weight
															</Typography>
														</Grid>
														<Grid item xs={4}>
															<TextFieldElement
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																// style={{ width: '20rem' }}
																disabled={!editMode}
																name="kapan_mas.bal_wgt"
																fullWidth
																// multiline
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>

												<Grid item xs={6}>
													<Grid
														container
														alignItems="center"
														className="gap1">
														<Grid item xs={4.4}>
															<Typography variant="subtitle1">
																Value
															</Typography>
														</Grid>
														<Grid item xs={4}>
															<TextFieldElementNumber
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																disabled={!editMode}
																type="number"
																name="kapan_mas.value"
																fullWidth
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
											</Grid>
										</div>
									</div>
								</fieldset>
							</Grid>
							<Grid container spacing={0.5}>
								<fieldset className="fieldset-size-Kapan">
									<legend>Kapan Details</legend>
									<div className="test">
										<div className="inner-test">
											<Grid container className="margin-bottom">
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={3.85}>
															<Typography variant="subtitle1">
																Kapan No
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<TextFieldElement
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																disabled={!editMode}
																name="kapan_mas.kapan_no"
																fullWidth
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={6}>
													<Grid
														container
														alignItems="center"
														className="gap">
														<Grid item xs={3.8}>
															<Typography variant="subtitle1">
																Create Date
															</Typography>
														</Grid>
														<Grid item xs={4.5}>
															<DatePickerElement
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																disabled={!editMode}
																readOnly={!editMode}
																name="kapan_mas.trans_date"
																format="DD-MM-YYYY"
																onChange={newValue =>
																	handleCreateDateChange(newValue)
																}
															/>
														</Grid>
													</Grid>
												</Grid>
											</Grid>
											<Grid container className="margin-bottom">
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={3.85}>
															<Typography variant="subtitle1">
																Group Name
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<TextFieldElement
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																disabled={!editMode}
																name="kapan_mas.group_name"
																fullWidth
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={6}>
													<Grid
														container
														alignItems="center"
														className="gap">
														<Grid item xs={3.8}>
															<Typography variant="subtitle1">
																Rough Article
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<AutocompleteElement
																classname={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																name="kapan_mas.rough_type"
																options={roughTypeOptions}
																autocompleteProps={{
																	id: 'type',
																	disabled: !editMode,
																	clearIcon: false,

																	onChange: (
																		event,
																		value,
																		reason,
																		details
																	) =>
																		handleRoughTypeChange(
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
											</Grid>

											<Grid container className="margin-bottom">
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={3.85}>
															<Typography variant="subtitle1">
																Rough Size
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<AutocompleteElement
																classname={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																name="kapan_mas.rough_size"
																options={roughSizeOptions}
																autocompleteProps={{
																	id: 'size',
																	disabled: !editMode,
																	clearIcon: false,

																	onChange: (
																		event,
																		value,
																		reason,
																		details
																	) =>
																		handleRoughSizeChange(
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
												<Grid item xs={6}>
													<Grid
														container
														alignItems="center"
														className="gap">
														<Grid item xs={3.8}>
															<Typography variant="subtitle1">
																Rough Quality
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<AutocompleteElement
																classname={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																name="kapan_mas.rough_quality"
																options={roughQltyOptions}
																autocompleteProps={{
																	id: 'qlty',
																	disabled: !editMode,
																	clearIcon: false,

																	onChange: (
																		event,
																		value,
																		reason,
																		details
																	) =>
																		handleRoughQltyChange(
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
											</Grid>

											<Grid container className="margin-bottom">
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={3.85}>
															<Typography variant="subtitle1">
																Origin Month
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<AutocompleteElement
																classname={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																name="kapan_mas.origin_month"
																options={monthOptions}
																autocompleteProps={{
																	id: 'month',
																	disabled: !editMode,
																	clearIcon: false,

																	onChange: (
																		event,
																		value,
																		reason,
																		details
																	) =>
																		handleMonthChange(
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
												<Grid item xs={6}>
													<Grid
														container
														alignItems="center"
														className="gap">
														<Grid item xs={3.8}>
															<Typography variant="subtitle1">
																Origin Year
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<AutocompleteElement
																classname={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																name="kapan_mas.origin_year"
																options={yearOptions}
																autocompleteProps={{
																	id: 'year',
																	disabled: !editMode,
																	clearIcon: false,

																	onChange: (
																		event,
																		value,
																		reason,
																		details
																	) =>
																		handleYearChange(
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
											</Grid>

											<Grid container className="margin-bottom">
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={3.85}>
															<Typography variant="subtitle1">
																Country of Origin
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<AutocompleteElement
																classname={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																name="kapan_mas.coo"
																options={countryOptions}
																autocompleteProps={{
																	id: 'coo',
																	disabled: !editMode,
																	clearIcon: false,

																	onChange: (
																		event,
																		value,
																		reason,
																		details
																	) =>
																		handleCountryChange(
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
												<Grid item xs={6}>
													<Grid
														container
														alignItems="center"
														className="gap">
														<Grid item xs={3.8}>
															<Typography variant="subtitle1">
																Source of Origin
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<AutocompleteElement
																classname={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																name="kapan_mas.soo"
																options={sourceOptions}
																autocompleteProps={{
																	id: 'soo',
																	disabled: !editMode,
																	clearIcon: false,

																	onChange: (
																		event,
																		value,
																		reason,
																		details
																	) =>
																		handleSourceChange(
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
											</Grid>

											<Grid container className="margin-bottom">
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={3.85}>
															<Typography variant="subtitle1">
																Mines of Origin
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<AutocompleteElement
																classname={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																name="kapan_mas.moo"
																options={mineOptions}
																autocompleteProps={{
																	id: 'mine',
																	disabled: !editMode,
																	clearIcon: false,

																	onChange: (
																		event,
																		value,
																		reason,
																		details
																	) =>
																		handleMineChange(
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
												<Grid item xs={6}>
													<Grid
														container
														alignItems="center"
														className="gap">
														<Grid item xs={3.8}>
															<Typography variant="subtitle1">
																Elig Brand
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<AutocompleteElement
																classname={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																name="kapan_mas.elig_brand"
																options={programOptions}
																autocompleteProps={{
																	id: 'program',
																	disabled: !editMode,
																	clearIcon: false,

																	onChange: (
																		event,
																		value,
																		reason,
																		details
																	) =>
																		handleProgramChange(
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
											</Grid>

											<Grid container className="margin-bottom">
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={3.85}>
															<Typography variant="subtitle1">
																Pre Mfg End Date
															</Typography>
														</Grid>
														<Grid item xs={4.5}>
															<DatePickerElement
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																readOnly={!editMode}
																disabled={!editMode}
																name="kapan_mas.premfg_end_date"
																format="DD-MM-YYYY"
																onChange={newValue =>
																	handlePreMfgChange(newValue)
																}
															/>
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={6}>
													<Grid
														container
														alignItems="center"
														className="gap">
														<Grid item xs={3.8}>
															<Typography variant="subtitle1">
																Mfg End Date
															</Typography>
														</Grid>
														<Grid item xs={4.5}>
															<DatePickerElement
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																disabled={!editMode}
																readOnly={!editMode}
																name="kapan_mas.mfg_end_date"
																format="DD-MM-YYYY"
																onChange={newValue =>
																	handleMfgChange(newValue)
																}
															/>
														</Grid>
													</Grid>
												</Grid>
											</Grid>

											<Grid container className="margin-bottom">
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={3.85}>
															<Typography variant="subtitle1">
																Close Date
															</Typography>
														</Grid>
														<Grid item xs={4.5}>
															<DatePickerElement
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																disabled={!editMode}
																readOnly={!editMode}
																name="kapan_mas.close_date"
																format="DD-MM-YYYY"
																onChange={newValue =>
																	handleCloseChange(newValue)
																}
															/>
														</Grid>
													</Grid>
												</Grid>

												<Grid item xs={6}>
													<Grid
														container
														alignItems="center"
														className="gap">
														<Grid item xs={3.8}>
															<Typography variant="subtitle1">
																Comments
															</Typography>
														</Grid>
														<Grid item xs={8.2}>
															<TextFieldElement
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																disabled={!editMode}
																name="kapan_mas.comments"
																fullWidth
																// multiline
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
											</Grid>
										</div>
									</div>
								</fieldset>
							</Grid>

							{/* --------------Footer Button start from Below -------------- */}
						</FormContainer>
						<Grid>
							<Grid container spacing={0.5} className="marginTop">
								<Grid item xs={0.85} className="address-btn">
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
											handleAdd(e, 'kapan_mas');
											setEnableButton(false);
										}}
										tabIndex={-1}>
										+ Add
									</Button>
								</Grid>
								<Grid item xs={0.85} className="address-btn">
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
											handleUpdate(e, 'kapan_mas');
										}}
										tabIndex={-1}>
										Edit
									</Button>
								</Grid>
								<Grid item xs={0.85} className="address-btn">
									<Button
										ref={deleteButtonRef}
										className="custom-button"
										style={{ outline: 'none' }}
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
								<Grid item xs={0.85} className="address-btn">
									<Button
										ref={viewButtonRef}
										className="custom-button"
										style={{ outline: 'none' }}
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
								<Grid item xs={0.85} className="address-btn">
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
										style={{ outline: 'none' }}
										disabled={enableButton}
										tabIndex={-1}>
										{isSubmitting ? (
											<CircularProgress size={24} color="success" />
										) : (
											formatMessage({ id: 'Save' })
										)}
									</Button>
								</Grid>

								<Grid item xs={0.85} className="address-btn">
									<Button
										ref={cancelButtonRef}
										className="custom-button"
										style={{ outline: 'none' }}
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
									component={Kapans}
									handleDrawerToggle={handleDrawerToggle}
									passProps={childPropsKapans}
									setEnableButton1={setEnableButton1}
								/>
							)}
						</Grid>
					</Box>
				</div>
			</div>
		</>
	);
}

export default Kapan;
