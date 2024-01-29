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
	CheckboxElement,
	DatePickerElement,
	FormContainer,
	TextFieldElement
} from '@app/components/rhfmui';

import { FormSchema, IFormInput } from '@pages/master/company/models/Companys';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfiniteDrawer } from '@components/drawer';
import { InitialState } from '@utils/helpers';

import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { useCompanysSlice } from '../store/slice';
import { companysSelector } from '../store/slice/companys.selectors';

// *** COUNTRY *** //
import { useCountrySlice } from '@pages/master/countries/store/slice';
import { countrySelector } from '@pages/master/countries/store/slice/country.selectors';
import { countryState } from '@pages/master/countries/store/slice/types';

// *** STATE *** //
import { useStateSlice } from '@pages/master/states/store/slice';
import { stateSelector } from '@pages/master/states/store/slice/state.selectors';
import { stateState } from '@pages/master/states/store/slice/types';

// *** CITY *** //
import { useCitySlice } from '@pages/master/cities/store/slice';
import { citySelector } from '@pages/master/cities/store/slice/city.selectors';
import { cityState } from '@pages/master/cities/store/slice/types';

// *** CITY *** //
import { useCurrenciesSlice } from '@pages/master/currencies/store/slice';
import { currenciesSelector } from '@pages/master/currencies/store/slice/currencies.selectors';
import { currenciesState } from '@pages/master/currencies/store/slice/types';

import useFocusOnEnter from '@hooks/useFocusOnEnter';
import { useConfirm } from 'material-ui-confirm';
import useThrottle from '@hooks/useThrottle';

import BankDetail from './BankDetail';
import Contacts from './Contacts';
import Companys from './Companys';

import MainCard from '@components/MainCard';

const stateFilter = createFilterOptions();
const countryFilter = createFilterOptions();
const cityFilter = createFilterOptions();
const currencyFilter = createFilterOptions();
const acCurFilter = createFilterOptions();

import './company.css';

function Company() {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: companysActions } = useCompanysSlice();
	//*** ExtraActions ***//
	const { actions: countryActions } = useCountrySlice();
	const { actions: stateActions } = useStateSlice();
	const { actions: cityActions } = useCitySlice();
	const { actions: currenciesActions } = useCurrenciesSlice();
	const { actions } = useSnackBarSlice();

	// *** Companys State *** //
	const companysState = useSelector(companysSelector);
	const { getOneDetSuccess, addSuccess, deleteSuccess } = companysState;
	// addSuccess

	// *** Country State *** //
	const countryState = useSelector(countrySelector);
	const { getError: getCountryError, getSuccess: getCountrySuccess } = countryState;

	// *** State State *** //
	const stateState = useSelector(stateSelector);
	const { getError: getStateError, getSuccess: getStateSuccess } = stateState;

	// *** CITY State *** //
	const cityState = useSelector(citySelector);
	const { getError: getCityError, getSuccess: getCitySuccess } = cityState;

	// *** CURRENCY State *** //
	const currenciesState = useSelector(currenciesSelector);
	const { getError: getCurrenciesError, getSuccess: getCurrenciesSuccess } = currenciesState;

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
			comp_mas: {
				is_active: true
			}
		},
		touched: null,
		errors: null
	});

	//***COUNTRY */
	const [countryLoading, setCountryLoading] = useState(false);
	const [countryInputValue, setCountryInputValue] = useState('');
	const [countryOptions, setCountryOptions] = useState<countryState[]>([]);
	const throttledInputCountryValue = useThrottle(countryInputValue, 400);

	//***STATE */
	const [stateLoading, setStateLoading] = useState(false);
	const [stateInputValue, setStateInputValue] = useState('');
	const [stateOptions, setStateOptions] = useState<stateState[]>([]);
	const throttledInputStateValue = useThrottle(stateInputValue, 400);

	//***CITY */
	const [cityLoading, setCityLoading] = useState(false);
	const [cityInputValue, setCityInputValue] = useState('');
	const [cityOptions, setCityOptions] = useState<cityState[]>([]);
	const throttledInputCityValue = useThrottle(cityInputValue, 400);

	//***BUSS CURRENCY */
	const [businessLoading, setBusinessLoading] = useState(false);
	const [businessInputValue, setBusinessInputValue] = useState('');
	const [businessOptions, setBusinessOptions] = useState<currenciesState[]>([]);
	const throttledInputBusinessValue = useThrottle(businessInputValue, 400);

	//***A/C CURRENCY */
	const [accountLoading, setAccountLoading] = useState(false);
	const [accountInputValue, setAccountInputValue] = useState('');
	const [accountOptions, setAccountOptions] = useState<currenciesState[]>([]);
	const throttledInputAccountValue = useThrottle(accountInputValue, 400);

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
	const [contactOptions, setContactOptions] = useState<any>([]);
	const [bankOptions, setBankOptions] = useState<any>([]);
	const [currentAction, setCurrentAction] = useState('');

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
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			dispatch(companysActions.reset());
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	// *** COUNTRY *** //
	useEffect(() => {
		if (getCountrySuccess) {
			if (getCountrySuccess?.results) {
				setCountryOptions(getCountrySuccess?.results);
			} else {
				setCountryOptions([]);
			}
		}
		if (getCountryError) {
			setCountryOptions([]);
		}
		setCountryLoading(false);
	}, [getCountryError, getCountrySuccess]);

	useEffect(() => {
		dispatch(countryActions.reset());
		if (throttledInputCountryValue === '' && pageState?.touched?.Country) {
			setCountryLoading(true);
			dispatch(countryActions.get({ QueryParams: `limit=10` }));
			return undefined;
		} else if (throttledInputCountryValue !== '') {
			setCountryLoading(true);
			dispatch(countryActions.get({ QueryParams: `q=${throttledInputCountryValue}` }));
		}
	}, [throttledInputCountryValue]);

	// *** STATE *** //
	useEffect(() => {
		if (getStateSuccess) {
			if (getStateSuccess?.results) {
				setStateOptions(getStateSuccess?.results);
			} else {
				setStateOptions([]);
			}
		}
		if (getStateError) {
			setStateOptions([]);
		}
		setStateLoading(false);
	}, [getStateError, getStateSuccess]);

	useEffect(() => {
		dispatch(stateActions.reset());
		if (throttledInputStateValue === '' && pageState?.touched?.State) {
			setStateLoading(true);
			dispatch(stateActions.get({ QueryParams: `limit=10` }));
			return undefined;
		} else if (throttledInputStateValue !== '') {
			setStateLoading(true);
			dispatch(stateActions.get({ QueryParams: `q=${throttledInputStateValue}` }));
		}
	}, [throttledInputStateValue]);

	// *** CITY *** //
	useEffect(() => {
		if (getCitySuccess) {
			if (getCitySuccess?.results) {
				setCityOptions(getCitySuccess?.results);
			} else {
				setCityOptions([]);
			}
		}
		if (getCityError) {
			setCityOptions([]);
		}
		setCityLoading(false);
	}, [getCityError, getCitySuccess]);

	useEffect(() => {
		dispatch(cityActions.reset());
		if (throttledInputCityValue === '' && pageState?.touched?.City) {
			setCityLoading(true);
			dispatch(cityActions.get({ QueryParams: `limit=10` }));
			return undefined;
		} else if (throttledInputCityValue !== '') {
			setCityLoading(true);
			dispatch(cityActions.get({ QueryParams: `q=${throttledInputCityValue}` }));
		}
	}, [throttledInputCityValue]);

	// *** BUSINESS CURRENCY *** //
	useEffect(() => {
		if (getCurrenciesSuccess) {
			if (getCurrenciesSuccess?.results) {
				setBusinessOptions(getCurrenciesSuccess?.results);
			} else {
				setBusinessOptions([]);
			}
		}
		if (getCurrenciesError) {
			setBusinessOptions([]);
		}
		setBusinessLoading(false);
	}, [getCurrenciesError, getCurrenciesSuccess]);

	useEffect(() => {
		dispatch(currenciesActions.reset());
		if (throttledInputBusinessValue === '' && pageState?.touched?.base_currency) {
			setBusinessLoading(true);
			dispatch(currenciesActions.get({ QueryParams: `limit=10` }));
			return undefined;
		} else if (throttledInputBusinessValue !== '') {
			setBusinessLoading(true);
			dispatch(currenciesActions.get({ QueryParams: `q=${throttledInputBusinessValue}` }));
		}
	}, [throttledInputBusinessValue]);

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

	useEffect(() => {
		if (getOneDetSuccess) {
			if (getOneDetSuccess?.results) {
				setPageState(pageState => ({
					...pageState,
					values: {
						...pageState.values,

						comp_mas: {
							...getOneDetSuccess?.results.comp_mas
						},
						comp_contact: getOneDetSuccess?.results.comp_contact,
						comp_bank: getOneDetSuccess?.results.comp_bank
					}
				}));

				let result = JSON.parse(JSON.stringify(getOneDetSuccess?.results));
				result['comp_mas']['start_date'] = dayjs(result.comp_mas.start_date);
				reset(result);
				setContactOptions(getOneDetSuccess?.results.comp_contact);
				setBankOptions(getOneDetSuccess?.results.comp_bank);
			}
		}
	}, [getOneDetSuccess]);

	useEffect(() => {
		if (editMode) {
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('comp_mas.name');
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
				comp_mas: { name: null, is_active: true } as any
			});
			setEnableSaveButton1(false);
			setEnableSaveButton(false);
			setEnableButton(true);
			setEnableButton1(true);
			setEditMode(false);
			setCurrentAction('Save');
			setContactOptions(null);
			setBankOptions(null);
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
				comp_mas: { name: null, is_active: true } as any
			});
			setEnableSaveButton1(false);
			setEnableSaveButton(false);
			setEnableButton(true);
			setEnableButton1(true);
			setEditMode(false);
			setCurrentAction('Save');
			setContactOptions(null);
			setBankOptions(null);
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
			comp_mas: { name: null, is_active: true } as any
		});
		setContactOptions([]);
		setBankOptions([]);
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
				comp_mas: {
					action: 'insert',
					is_active: true
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
		setContactOptions(pageState.values?.comp_contact);
		setBankOptions(pageState.values?.comp_bank);
	};

	const handleAdd = (event: any, arrName: string) => {
		setEnableButton1(true);
		setEnableButton(true);
		event.persist();
		reset({
			comp_mas: { name: null, is_active: true } as any
		});
		setContactOptions(null);
		setBankOptions(null);
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
					is_active: true
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
				}
			}
		}));
		setEnableSaveButton(true);
		setCurrentAction('Edit');
	};

	const handleDelete = (event: any) => {
		if (pageState.values) {
			confirm({
				description: 'Are you sure delete company ?',
				cancellationButtonProps: { autoFocus: true },
				confirmationText: 'Yes',
				cancellationText: 'No'
			})
				.then(() => {
					dispatch(companysActions.delete({ seq_no: pageState.values.comp_mas.seq_no }));
				})
				.catch(() => {
					/* */
				});
		}
	};

	const handleStartDateChange = (newValue: any) => {
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,

					['comp_mas']: {
						...pageState.values['comp_mas'],
						start_date: dayjs(new Date(newValue.$d)).format('YYYY-MM-DD')
					}
				}
			}));
		}
	};
	// COUNTRY
	const handleFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = countryFilter(options, state);
		return filtered;
	};
	const handleCountryChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const CountryVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			country: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				comp_mas: {
					...pageState.values.comp_mas,
					country: CountryVal
				}
			},
			touched: {
				...pageState.touched,
				country: true
			}
		}));

		if (!newValue) {
			dispatch(countryActions.get({ QueryParams: `page=1&limit=10` }));
		}
	};

	// State
	const handleStateFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = stateFilter(options, state);
		return filtered;
	};
	const handleStateChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const StateVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			state: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				comp_mas: {
					...pageState.values.comp_mas,
					state: StateVal
				}
			},
			touched: {
				...pageState.touched,
				state: true
			}
		}));

		if (!newValue) {
			dispatch(stateActions.get({ QueryParams: `page=1&limit=10` }));
		}
	};

	// CITY
	const handleCityFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = cityFilter(options, state);
		return filtered;
	};
	const handleCityChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const CityVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			city: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				comp_mas: {
					...pageState.values.comp_mas,
					city: CityVal
				}
			},
			touched: {
				...pageState.touched,
				city: true
			}
		}));

		if (!newValue) {
			dispatch(cityActions.get({ QueryParams: `page=1&limit=10` }));
		}
	};

	// BUSINESS CURRENCY CHANGE
	const businessCurOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = currencyFilter(options, state);
		return filtered;
	};
	const handleBusinessCurChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const currencyVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			base_currency: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				comp_mas: {
					...pageState.values.comp_mas,
					base_currency: currencyVal
				}
			},
			touched: {
				...pageState.touched,
				base_currency: true
			}
		}));

		if (!newValue) {
			dispatch(currenciesActions.get({ QueryParams: `page=1&limit=10` }));
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
				comp_mas: {
					...pageState.values.comp_mas,
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

	const handlePanChange = (e: any) => {
		const panNumber = e.target.value;
		const panRegex = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
		if (panNumber !== '' && !panRegex.test(panNumber)) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Please enter a valid PAN No',
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

		setPageState(value => ({
			...value,
			values: {
				...pageState.values,
				['comp_mas']: {
					...pageState.values['comp_mas'],
					pan_no: panNumber
				}
			}
		}));
	};

	const handleGstChange = (e: any) => {
		const gstNumber = e.target.value;
		const gstRegex =
			/^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9A-Za-z]{1}$/;

		if (gstNumber !== '' && !gstRegex.test(gstNumber)) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Please enter a valid GST No',
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

		setPageState(value => ({
			...value,
			values: {
				...pageState.values,
				['comp_mas']: {
					...pageState.values['comp_mas'],
					gst_no: gstNumber
				}
			}
		}));
	};

	const isPanValid = (panNumber: string) => {
		return (
			panNumber === '' ||
			panNumber === null ||
			/^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/.test(panNumber)
		);
	};

	const isGstValid = (gstNumber: string) => {
		return (
			gstNumber === '' ||
			gstNumber === null ||
			/^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9A-Za-z]{1}$/.test(
				gstNumber
			)
		);
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		const panValid = isPanValid(pageState.values['comp_mas'].pan_no);
		const gstValid = isGstValid(pageState.values['comp_mas'].gst_no);

		if (!panValid) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Please enter a valid PAN No',
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
		} else if (!gstValid) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Please enter a valid GST No',
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
		} else {
			const validation = await trigger();
			if (validation) {
				dispatch(companysActions.add(pageState.values));
			}
		}
	};
	// const onSubmit = async () => {};

	// const handleSubmit = async (event: any) => {
	// 	event.preventDefault();
	// 	const validation = await trigger();
	// 	if (validation) {
	// 		dispatch(companysActions.add(pageState.values));
	// 	}
	// };

	const handleCancel = async (event: any) => {
		event.persist();
		setEnableSaveButton1(false);
		setEnableSaveButton(false);
		setEnableButton(true);
		setEnableButton1(true);
		setEditMode(false);
		reset({
			comp_mas: { name: null, is_active: true } as any
		});

		setCurrentAction('Cancel');
		setContactOptions([]);
		setBankOptions([]);
		//reset()
		setPageState({
			isValid: false,
			values: {},
			touched: null,
			errors: null
		});
	};

	const childPropsContact = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				comp_contact: array
			}
		}));
	};

	const childPropsBank = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				comp_bank: array
			}
		}));
	};

	const childPropsCompanys = (array: any, data?: any) => {
		dispatch(companysActions.getOneDet(array?.seq_no));
	};

	return (
		<>
			<div id="scroll-container">
				<div id="party-container" ref={refPage as any} tabIndex={-1}>
					<Box id="form-main" ref={formRef} onKeyUp={event => onEnterKey(event)}>
						<MainCard content={false} ref={refPage as any} tabIndex={-1}>
							<FormContainer
								// ref={formRef}
								// onKeyDown={handleFormKeyDown}
								// onSuccess={() => onSubmit()}
								formContext={formContext}
								FormProps={{ autoComplete: 'off' }}>
								<Grid container spacing={0}>
									<fieldset className="fieldset-size">
										<legend>Company Details</legend>
										<Grid container className="details-div">
											<Grid
												item
												spacing={0}
												xs={6}
												container
												alignItems="center">
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={2.5}>
														<Typography variant="subtitle1">
															Name
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
															fullWidth
															variant="outlined"
															name="comp_mas.name"
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={2.5}>
														<Typography variant="subtitle1">
															Address 1
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
															fullWidth
															variant="outlined"
															name="comp_mas.address_1"
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={2.5}>
														<Typography variant="subtitle1">
															Address 2
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
															fullWidth
															variant="outlined"
															name="comp_mas.address_2"
															onChange={handleChange}
														/>
													</Grid>
												</Grid>

												<Grid container spacing={2} alignItems="center">
													<Grid item xs={2.5}>
														<Typography variant="subtitle1">
															Address 3
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
															fullWidth
															variant="outlined"
															name="comp_mas.address_3"
															onChange={handleChange}
														/>
													</Grid>
												</Grid>

												<Grid container spacing={2} alignItems="center">
													<Grid item xs={2.5}>
														<Typography variant="subtitle1">
															Email ID
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
															fullWidth
															variant="outlined"
															name="comp_mas.email_id"
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
											</Grid>
											<Grid
												item
												xs={6}
												spacing={0.5}
												container
												alignItems="center">
												<Grid item xs={12}>
													<Grid container alignItems="center">
														<Grid item xs={1.98}>
															<Typography variant="subtitle1">
																Short Name
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
																fullWidth
																variant="outlined"
																name="comp_mas.short_name"
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={4}>
															<Typography variant="subtitle1">
																Country
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<AutocompleteElement
																loading={countryLoading}
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
																		handleCountryChange(
																			event,
																			value,
																			reason,
																			details
																		),
																	filterOptions: (
																		options,
																		state
																	) =>
																		handleFilterOptions(
																			options,
																			state
																		),
																	getOptionLabel: option => {
																		if (
																			typeof option ===
																			'string'
																		) {
																			return option;
																		}
																		if (option.inputValue) {
																			return option.inputValue;
																		}
																		return option.name;
																	}
																}}
																name="comp_mas.country"
																options={countryOptions}
																textFieldProps={{
																	InputProps: {},
																	onChange: e =>
																		setCountryInputValue(
																			e.target.value
																		),
																	onFocus: () => {
																		if (
																			countryOptions &&
																			countryOptions.length ===
																				0
																		) {
																			dispatch(
																				countryActions.get({
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

												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={4}>
															<Typography variant="subtitle1">
																State
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<AutocompleteElement
																loading={stateLoading}
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
																		handleStateChange(
																			event,
																			value,
																			reason,
																			details
																		),
																	filterOptions: (
																		options,
																		state
																	) =>
																		handleStateFilterOptions(
																			options,
																			state
																		),
																	getOptionLabel: option => {
																		if (
																			typeof option ===
																			'string'
																		) {
																			return option;
																		}
																		if (option.inputValue) {
																			return option.inputValue;
																		}
																		return option.name;
																	}
																}}
																name="comp_mas.state"
																options={stateOptions}
																textFieldProps={{
																	InputProps: {},
																	onChange: e =>
																		setStateInputValue(
																			e.target.value
																		),
																	onFocus: () => {
																		if (
																			stateOptions &&
																			stateOptions.length ===
																				0
																		) {
																			dispatch(
																				stateActions.get({
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
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={4}>
															<Typography variant="subtitle1">
																City
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<AutocompleteElement
																loading={cityLoading}
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
																		handleCityChange(
																			event,
																			value,
																			reason,
																			details
																		),
																	filterOptions: (
																		options,
																		state
																	) =>
																		handleCityFilterOptions(
																			options,
																			state
																		),
																	getOptionLabel: option => {
																		if (
																			typeof option ===
																			'string'
																		) {
																			return option;
																		}
																		if (option.inputValue) {
																			return option.inputValue;
																		}
																		return option.name;
																	}
																}}
																name="comp_mas.city"
																options={cityOptions}
																textFieldProps={{
																	InputProps: {},
																	onChange: e =>
																		setCityInputValue(
																			e.target.value
																		),
																	onFocus: () => {
																		if (
																			cityOptions &&
																			cityOptions.length === 0
																		) {
																			dispatch(
																				cityActions.get({
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
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={4}>
															<Typography variant="subtitle1">
																Pin Code
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
																fullWidth
																variant="outlined"
																name="comp_mas.pin_code"
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={4}>
															<Typography variant="subtitle1">
																Phone No
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
																fullWidth
																variant="outlined"
																name="comp_mas.phone_no"
																type="number"
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={4}>
															<Typography variant="subtitle1">
																Mobile No
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
																fullWidth
																variant="outlined"
																name="comp_mas.mobile_no"
																type="number"
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={6}>
													<Grid container alignItems="center">
														<Grid item xs={4}>
															<Typography variant="subtitle1">
																Website
															</Typography>
														</Grid>
														<Grid item xs={8}>
															<TextFieldElement
																className={`custom-textfield ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																disabled={!editMode}
																fullWidth
																variant="outlined"
																name="comp_mas.website"
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</fieldset>
								</Grid>

								{/*----------------- //Documents Details start from below ---------------- */}

								<Grid container spacing={0.5}>
									<fieldset className="fieldset-size">
										<legend>Document Details</legend>
										<Grid container spacing={0.5} className="details-div">
											<Grid item xs={3}>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={5}>
														<Typography variant="subtitle1">
															PAN No
														</Typography>
													</Grid>
													<Grid item xs={7}>
														<TextFieldElement
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															fullWidth
															variant="outlined"
															name="comp_mas.pan_no"
															// onChange={handleChange}
															onChange={handlePanChange}
														/>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={3}>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															GST No
														</Typography>
													</Grid>
													<Grid item xs={8}>
														<TextFieldElement
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															fullWidth
															variant="outlined"
															name="comp_mas.gst_no"
															// onChange={handleChange}
															onChange={handleGstChange}
														/>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={3}>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															Reg No
														</Typography>
													</Grid>
													<Grid item xs={8}>
														<TextFieldElement
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															fullWidth
															variant="outlined"
															name="comp_mas.business_reg_no"
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={3}>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															VAT No
														</Typography>
													</Grid>
													<Grid item xs={8}>
														<TextFieldElement
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															fullWidth
															variant="outlined"
															name="comp_mas.vat_no"
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={3}>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={5}>
														<Typography variant="subtitle1">
															Tax No
														</Typography>
													</Grid>
													<Grid item xs={7}>
														<TextFieldElement
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															fullWidth
															variant="outlined"
															name="comp_mas.tax_no"
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={3}>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															CIN No
														</Typography>
													</Grid>
													<Grid item xs={8}>
														<TextFieldElement
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															fullWidth
															variant="outlined"
															name="comp_mas.cin_no"
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={3}>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															RBI Code No
														</Typography>{' '}
													</Grid>
													<Grid item xs={8}>
														<TextFieldElement
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															fullWidth
															variant="outlined"
															name="comp_mas.rbi_code_no"
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={3}>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															IEC Code
														</Typography>
													</Grid>
													<Grid item xs={8}>
														<TextFieldElement
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															fullWidth
															variant="outlined"
															name="comp_mas.iec_code"
															onChange={handleChange}
														/>
													</Grid>
												</Grid>
											</Grid>

											<Grid item xs={3}>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={5}>
														<Typography variant="subtitle1">
															Start Date
														</Typography>
													</Grid>
													<Grid item xs={5}>
														<DatePickerElement
															className={`custom-textfield ${
																!editMode
																	? 'disabled-textfield'
																	: ''
															}`}
															disabled={!editMode}
															readOnly={!editMode}
															name="comp_mas.start_date"
															// onChange={handleChange}
															format="DD-MM-YYYY"
															onChange={newValue =>
																handleStartDateChange(newValue)
															}
														/>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={3}>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															Bus.Currency
														</Typography>
													</Grid>
													<Grid item xs={5}>
														<AutocompleteElement
															loading={businessLoading}
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
																	handleBusinessCurChange(
																		event,
																		value,
																		reason,
																		details
																	),
																filterOptions: (options, state) =>
																	businessCurOptions(
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
															name="comp_mas.base_currency"
															options={businessOptions}
															textFieldProps={{
																InputProps: {},
																onChange: e =>
																	setBusinessInputValue(
																		e.target.value
																	),
																onFocus: () => {
																	if (
																		businessOptions &&
																		businessOptions.length === 0
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
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															A/C Currency
														</Typography>
													</Grid>
													<Grid item xs={5}>
														<AutocompleteElement
															loading={businessLoading}
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
																	acCurFilter(options, state),
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
															name="comp_mas.ac_currency"
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
											<Grid item xs={3} tabIndex={-1}>
												<Grid container spacing={2} alignItems="center">
													<Grid item xs={4}>
														<Typography variant="subtitle1">
															Is Active
														</Typography>
													</Grid>
													<Grid item xs={8} tabIndex={-1}>
														<CheckboxElement
															disabled={!editMode}
															name="comp_mas.is_active"
															tabIndex={-1}
														/>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</fieldset>
								</Grid>

								{/* ---------------Tab start from below-------------- */}

								<div className="marginTop">
									<Paper>
										<Tabs value={selectedTab} onChange={handleTabChange}>
											<Tab label="bank details" />
											<Tab label="contact" />
										</Tabs>
									</Paper>

									{selectedTab === 0 && (
										<BankDetail
											passProps={childPropsBank}
											bankOptions={bankOptions}
											currentAction={currentAction}
											editMode={editMode}
										/>
									)}
									{selectedTab === 1 && (
										<Contacts
											passProps={childPropsContact}
											contactOptions={contactOptions}
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
												handleAdd(e, 'comp_mas');
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
												handleUpdate(e, 'comp_mas');
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
										component={Companys}
										handleDrawerToggle={handleDrawerToggle}
										passProps={childPropsCompanys}
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

export default Company;
