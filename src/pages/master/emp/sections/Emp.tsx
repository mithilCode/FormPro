// import { Paper, TextField, Tab, Tabs } from '@mui/material';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
// SyntheticEvent
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
	Box,
	Button,
	Grid,
	Paper,
	Tab,
	Tabs,
	Typography,
	CircularProgress,
	AutocompleteChangeDetails,
	AutocompleteChangeReason
} from '@mui/material';
import { useConfirm } from 'material-ui-confirm';

import dayjs from 'dayjs';

import { FormSchema, IFormInput } from '@pages/master/emp/models/Emps';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfiniteDrawer } from '@components/drawer';

import { InitialState } from '@utils/helpers';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import './Employee.css';
import RefrenceDetails from './RefrenceDetails';
import PrevInfo from './PrevInfo';
import Process from './Process';
import Contact from './Contact';
import Department from './Department';
import Skill from './Skill';
import Visa from './Visa';
import {
	FormContainer,
	TextFieldElement,
	DatePickerElement,
	AutocompleteElement,
	CheckboxElement
} from '@components/rhfmui';
import { useEmpsSlice } from '../store/slice';
import { empsSelector } from '../store/slice/emps.selectors';

import useFocusOnEnter from '@hooks/useFocusOnEnter';
import Address from '@pages/master/emp/sections/Address';
import Emps from './Emps';
import { useIntl } from 'react-intl';
import { useHotkeys } from 'react-hotkeys-hook';
import MainCard from '@components/MainCard';

console.log(Address);
function EmployeeDetail() {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: empsActions } = useEmpsSlice();
	const { actions } = useSnackBarSlice();

	// *** Emps State *** //
	const empsState = useSelector(empsSelector);
	const {
		getParaSuccess,
		getOneDetSuccess,
		addSuccess,
		deleteSuccess,
		getGenderSuccess,
		getBloodSuccess,
		getMaritalSuccess,
		getLanguageSuccess,
		getReligionSuccess,
		getCasteSuccess,
		getSubCasteSuccess,
		getEducationSuccess,
		getTransportSuccess,
		getVehicleSuccess,
		getFuelSuccess,
		getNationSuccess,
		getSalarySuccess,
		getKycsSuccess,
		getVerifySuccess,
		getInchtSuccess,
		getManagerSuccess,
		getDesigRoleSuccess
	} = empsState;

	// add your Locale  👿
	const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	//add your reference
	const formRef = useRef();

	const {
		setFocus,
		reset,
		trigger,
		setValue,
		formState: { isSubmitting }
	} = formContext;

	const { onEnterKey } = useFocusOnEnter(formRef, formContext.formState.errors);

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {
			name_mas: {
				join_date: dayjs(new Date()),
				is_active: true
			}
		},
		touched: null,
		errors: null
	});

	const [selectedTab, setSelectedTab] = useState(0);
	const [selectedAddress, setSelectedAddress] = useState<any>(null);
	const [selectedAddressType, setSelectedAddressType] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);
	const [editMode, setEditMode] = useState(false);

	const [addressOptions, setAddressOptions] = useState<any>([]);
	const [addressDataOptions, setAddressDataOptions] = useState<any>([]);

	const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false);
	const [enableButton, setEnableButton] = useState<boolean>(true);
	const [enableButton1, setEnableButton1] = useState<boolean>(true);
	const [enableSaveButton, setEnableSaveButton] = useState(false);
	const [, setEnableSaveButton1] = useState<boolean>(false); // enableSaveButton1
	const [currentAction, setCurrentAction] = useState('');
	const [contactOptions, setContactOptions] = useState<any>([]);
	const [departmentOptions, setDepartmentOptions] = useState<any>([]);
	const [processOptions, setProcessOptions] = useState<any>([]);
	const [prevOptions, setPrevOptions] = useState<any>([]);
	const [skillOptions, setSkillOptions] = useState<any>([]);
	const [visaOptions, setVisaOptions] = useState<any>([]);
	const [refOptions, setrefOptions] = useState<any>([]);
	const [genderOptions, setGenderOptions] = useState<any>([]);
	const [maritalOptions, setMaritalOptions] = useState<any>([]);
	const [languageOptions, setLanguageOptions] = useState<any>([]);
	const [religionOptions, setReligionOptions] = useState<any>([]);
	const [casteOptions, setCasteOptions] = useState<any>([]);
	const [subCasteOptions, setSubCasteOptions] = useState<any>([]);
	const [educationOptions, setEducationOptions] = useState<any>([]);
	const [transportOptions, setTransportOptions] = useState<any>([]);
	const [vehicleOptions, setVehicleOptions] = useState<any>([]);
	const [fuelOptions, setFuelOptions] = useState<any>([]);
	const [nationOptions, setNationOptions] = useState<any>([]);
	const [bloodOptions, setBloodOptions] = useState<any>([]);
	const [salaryOptions, setSalaryOptions] = useState<any>([]);
	const [kycsOptions, setKycsOptions] = useState<any>([]);
	const [verifyOptions, setVerifyOptions] = useState<any>([]);
	const [inchargetOptions, setInchargetOptions] = useState<any>([]);
	const [managerOptions, setManagerOptions] = useState<any>([]);
	const [desigRoleOptions, setDesigRoleOptions] = useState<any>([]);

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
		dispatch(empsActions.getGender('GENDER'));
		dispatch(empsActions.getMarital('MARITAL_STATUS'));
		dispatch(empsActions.getLanguage('LANGUAGE'));
		dispatch(empsActions.getReligion('RELIGION'));
		dispatch(empsActions.getCaste('CASTE'));
		dispatch(empsActions.getSubCaste('SUB_CASTE'));
		dispatch(empsActions.getEducation('EDUCATION'));
		dispatch(empsActions.getTransport('MODE_OF_TRANSPORT'));
		dispatch(empsActions.getVehicle('VEHICLE_TYPE'));
		dispatch(empsActions.getFuel('FUEL_TYPE'));
		dispatch(empsActions.getNation('NATIONALITY'));
		dispatch(empsActions.getBlood('BLOOD_GROUP'));
		dispatch(empsActions.getSalary('SALARY_BASE'));
		dispatch(empsActions.getKycs('KYC_STATUS'));
		dispatch(empsActions.getManager('DESIGNATION'));
		dispatch(empsActions.getDesigRole('DESIGNATION_ROLE'));
		dispatch(
			empsActions.getVerifyBy({
				QueryParams: `columnType=kyc_verify_by&pagination=false&q=type='E'`
			})
		);
		dispatch(
			empsActions.getIncharget({
				QueryParams: `columnType=inch&pagination=false&q=designation = 'MANAGER'`
			})
		);

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			dispatch(empsActions.reset());
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		if (getGenderSuccess) {
			if (getGenderSuccess?.results) {
				setGenderOptions(getGenderSuccess?.results);
			} else {
				setGenderOptions([]);
			}
		}
	}, [getGenderSuccess]);

	useEffect(() => {
		if (getManagerSuccess) {
			if (getManagerSuccess?.results) {
				setManagerOptions(getManagerSuccess?.results);
			} else {
				setManagerOptions([]);
			}
		}
	}, [getManagerSuccess]);

	useEffect(() => {
		if (getDesigRoleSuccess) {
			if (getDesigRoleSuccess?.results) {
				setDesigRoleOptions(getDesigRoleSuccess?.results);
			} else {
				setDesigRoleOptions([]);
			}
		}
	}, [getDesigRoleSuccess]);

	useEffect(() => {
		if (getVerifySuccess) {
			if (getVerifySuccess?.results) {
				setVerifyOptions(getVerifySuccess?.results);
			} else {
				setVerifyOptions([]);
			}
		}
	}, [getVerifySuccess]);

	useEffect(() => {
		if (getKycsSuccess) {
			if (getKycsSuccess?.results) {
				setKycsOptions(getKycsSuccess?.results);
			} else {
				setKycsOptions([]);
			}
		}
	}, [getKycsSuccess]);

	useEffect(() => {
		if (getInchtSuccess) {
			if (getInchtSuccess?.results) {
				setInchargetOptions(getInchtSuccess?.results);
			} else {
				setInchargetOptions([]);
			}
		}
	}, [getInchtSuccess]);

	useEffect(() => {
		if (getBloodSuccess) {
			if (getBloodSuccess?.results) {
				setBloodOptions(getBloodSuccess?.results);
			} else {
				setBloodOptions([]);
			}
		}
	}, [getBloodSuccess]);

	useEffect(() => {
		if (getSalarySuccess) {
			if (getSalarySuccess?.results) {
				setSalaryOptions(getSalarySuccess?.results);
			} else {
				setSalaryOptions([]);
			}
		}
	}, [getSalarySuccess]);

	useEffect(() => {
		if (getMaritalSuccess) {
			if (getMaritalSuccess?.results) {
				setMaritalOptions(getMaritalSuccess?.results);
			} else {
				setMaritalOptions([]);
			}
		}
	}, [getMaritalSuccess]);

	useEffect(() => {
		if (getLanguageSuccess) {
			if (getLanguageSuccess?.results) {
				setLanguageOptions(getLanguageSuccess?.results);
			} else {
				setLanguageOptions([]);
			}
		}
	}, [getLanguageSuccess]);

	useEffect(() => {
		if (getReligionSuccess) {
			if (getReligionSuccess?.results) {
				setReligionOptions(getReligionSuccess?.results);
			} else {
				setReligionOptions([]);
			}
		}
	}, [getReligionSuccess]);

	useEffect(() => {
		if (getCasteSuccess) {
			if (getCasteSuccess?.results) {
				setCasteOptions(getCasteSuccess?.results);
			} else {
				setCasteOptions([]);
			}
		}
	}, [getCasteSuccess]);

	useEffect(() => {
		if (getSubCasteSuccess) {
			if (getSubCasteSuccess?.results) {
				setSubCasteOptions(getSubCasteSuccess?.results);
			} else {
				setSubCasteOptions([]);
			}
		}
	}, [getSubCasteSuccess]);

	useEffect(() => {
		if (getEducationSuccess) {
			if (getEducationSuccess?.results) {
				setEducationOptions(getEducationSuccess?.results);
			} else {
				setEducationOptions([]);
			}
		}
	}, [getEducationSuccess]);

	useEffect(() => {
		if (getTransportSuccess) {
			if (getTransportSuccess?.results) {
				setTransportOptions(getTransportSuccess?.results);
			} else {
				setTransportOptions([]);
			}
		}
	}, [getTransportSuccess]);

	useEffect(() => {
		if (getVehicleSuccess) {
			if (getVehicleSuccess?.results) {
				setVehicleOptions(getVehicleSuccess?.results);
			} else {
				setVehicleOptions([]);
			}
		}
	}, [getVehicleSuccess]);

	useEffect(() => {
		if (getFuelSuccess) {
			if (getFuelSuccess?.results) {
				setFuelOptions(getFuelSuccess?.results);
			} else {
				setFuelOptions([]);
			}
		}
	}, [getFuelSuccess]);

	useEffect(() => {
		if (getNationSuccess) {
			if (getNationSuccess?.results) {
				setNationOptions(getNationSuccess?.results);
			} else {
				setNationOptions([]);
			}
		}
	}, [getNationSuccess]);

	useEffect(() => {
		dispatch(empsActions.getPara('EMP_ADDRESS_TYPE'));
		return () => {
			dispatch(empsActions.reset());
		};
	}, []);

	useEffect(() => {
		if (getParaSuccess) {
			if (getParaSuccess?.results) {
				setAddressOptions(getParaSuccess?.results);
				setSelectedAddress({ type: getParaSuccess?.results[0].name });
			} else {
				setAddressOptions([]);
			}
		}
	}, [getParaSuccess]);

	useEffect(() => {
		if (getOneDetSuccess) {
			if (getOneDetSuccess?.results) {
				setPageState(pageState => ({
					...pageState,
					values: {
						...pageState.values,

						name_mas: getOneDetSuccess?.results.name_mas,

						name_info: getOneDetSuccess?.results.name_info,
						name_document: getOneDetSuccess?.results.name_document,
						name_address: getOneDetSuccess?.results.name_address.map(
							(address: any) => ({
								...address,
								action: 'update'
							})
						),
						name_ref: getOneDetSuccess?.results.name_ref,
						name_contact: getOneDetSuccess?.results.name_contact,
						name_dept: getOneDetSuccess?.results.name_dept,
						name_proc: getOneDetSuccess?.results.name_proc,
						name_experience: getOneDetSuccess?.results.name_experience,
						name_skill: getOneDetSuccess?.results.name_skill,
						name_visa: getOneDetSuccess?.results.name_visa
					}
				}));

				let result = JSON.parse(JSON.stringify(getOneDetSuccess?.results));

				// if (result?.name_address.length > 0) {
				// 	result['name_address'][0].passport_expiry_date =
				// 		result?.name_address.length > 0
				// 			? dayjs(result.name_address[0].passport_expiry_date)
				// 			: null;
				// }
				result['name_document']['passport_expiry_date'] = dayjs(
					result.name_document.passport_expiry_date
				);
				result['name_document']['kyc_verify_date'] = dayjs(
					result.name_document.kyc_verify_date
				);
				result['name_document']['kyc_expiry_date'] = dayjs(
					result.name_document.kyc_expiry_date
				);
				result['name_info']['date_of_birth'] = dayjs(result.name_info.date_of_birth);
				result['name_mas']['join_date'] = dayjs(result.name_mas.join_date);
				result['name_mas']['leave_date'] = dayjs(result.name_mas.leave_date);

				reset(result);

				setAddressDataOptions(getOneDetSuccess?.results.name_address);
				setContactOptions(getOneDetSuccess?.results.name_contact);
				setProcessOptions(getOneDetSuccess?.results.name_proc);
				setDepartmentOptions(getOneDetSuccess?.results.name_dept);
				setPrevOptions(getOneDetSuccess?.results.name_experience);
				setSkillOptions(getOneDetSuccess?.results.name_skill);
				setVisaOptions(getOneDetSuccess?.results.name_visa);
				setrefOptions(getOneDetSuccess?.results.name_ref);
				setSelectedAddress({
					type:
						getOneDetSuccess?.results?.name_address.length != 0
							? getOneDetSuccess.results.name_address[0].address_type
							: 'PERMANENT'
				});
				setSelectedAddressType(
					getOneDetSuccess?.results?.name_address.length != 0
						? getOneDetSuccess.results.name_address[0].address_type
						: 'PERMANENT'
				);
			}
		}
	}, [getOneDetSuccess]);

	useEffect(() => {
		if (editMode) {
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('name_info.first_name');
			}, 100);
		}
	}, [editMode]);

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
				name_mas: { name: null, is_active: true, join_date: dayjs(new Date()) } as any,
				name_info: { first_name: null } as any,
				name_document: { passport_expiry_date: null } as any
			});
			setEnableSaveButton1(false);
			setEnableSaveButton(false);
			setEnableButton(true);
			setEnableButton1(true);
			setEditMode(false);
			setSelectedAddress({
				type: 'PERMANENT',
				data: null
			});
			setSelectedAddressType('PERMANENT');
			setCurrentAction('Save');
			setAddressDataOptions(null);
			setContactOptions(null);
			setProcessOptions(null);
			setDepartmentOptions(null);
			setPrevOptions(null);
			setSkillOptions(null);
			setVisaOptions(null);
			setrefOptions(null);
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
				name_mas: { name: null, is_active: true, join_date: dayjs(new Date()) } as any,
				name_info: { first_name: null } as any,
				name_document: { passport_expiry_date: null } as any
			});
			setEnableSaveButton1(false);
			setEnableSaveButton(false);
			setEnableButton(true);
			setEnableButton1(true);
			setEditMode(false);
			setSelectedAddress({
				type: 'PERMANENT',
				data: null
			});
			setSelectedAddressType('PERMANENT');
			setCurrentAction('Save');
			setAddressDataOptions(null);
			setContactOptions(null);
			setProcessOptions(null);
			setDepartmentOptions(null);
			setPrevOptions(null);
			setSkillOptions(null);
			setVisaOptions(null);
			setrefOptions(null);
			//reset()
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});
		}
	}, [deleteSuccess]);

	// *** EVENT HANDDLERS  👿

	const handleGenderChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const GenderVal = {
			show_value: newValue && newValue.show_value ? newValue.show_value : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					gender: GenderVal
				}
			}
		}));
	};

	const handleManagerChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const ManagerVal = {
			show_value: newValue && newValue.show_value ? newValue.show_value : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					designation: ManagerVal
				}
			}
		}));
	};

	const handleDesigRoleChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const DesigRoleVal = {
			show_value: newValue && newValue.show_value ? newValue.show_value : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					designation_role: DesigRoleVal
				}
			}
		}));
	};

	const handleBloodChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const BloodVal = {
			show_value: newValue && newValue.show_value ? newValue.show_value : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					blood_group: BloodVal
				}
			}
		}));
	};

	useEffect(() => {
		console.log(pageState.values, 'pageState.values');
	}, [pageState]);

	const handleKycsChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const KycsVal = {
			show_value: newValue && newValue.show_value ? newValue.show_value : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					kyc_status: KycsVal
				}
			}
		}));
	};

	const handleSalaryChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const SalaryVal = {
			show_value: newValue && newValue.show_value ? newValue.show_value : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					salary_base: SalaryVal
				}
			}
		}));
	};

	const handleMaritalChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const MaritalVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					marital_status: MaritalVal
				}
			}
		}));
	};

	const handleLanguageChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const LanguageVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					language: LanguageVal
				}
			}
		}));
	};

	const handleVerifyByChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const VerifyVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					kyc_verify_by: VerifyVal
				}
			}
		}));
	};

	const handleEducationChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const EducationVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					education: EducationVal
				}
			}
		}));
	};

	const handleReligionChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const ReligionVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					religion: ReligionVal
				}
			}
		}));
	};

	const handleCasteChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const CasteVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					caste: CasteVal
				}
			}
		}));
	};

	const handleSubCasteChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const SubCasteVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					sub_caste: SubCasteVal
				}
			}
		}));
	};

	const handleTransportChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const TransportVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					mode_of_transport: TransportVal
				}
			}
		}));
	};

	const handleFuelChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const FuelVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					fuel_type: FuelVal
				}
			}
		}));
	};

	const handleInchtChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const InchVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					inch: InchVal
				}
			}
		}));
	};

	const handleVehicleChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const VehicleVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					vehicle_type: VehicleVal
				}
			}
		}));
	};
	const handleNationChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const NationVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					nationality: NationVal
				}
			}
		}));
	};

	const toggleEditMode = () => {
		setEditMode(!editMode);
	};

	const onEditClick = () => {
		setOpenAddDrawer(true);
		setSelectedAddressType('PERMANENT');
		reset({
			name_mas: { name: null, is_active: true, join_date: dayjs(new Date()) } as any,
			name_info: { first_name: null } as any
		});
		setAddressDataOptions([]);
		setContactOptions([]);
		setProcessOptions([]);
		setDepartmentOptions([]);
		setPrevOptions([]);
		setSkillOptions([]);
		setVisaOptions([]);
		setrefOptions([]);
		//reset()
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
				...pageState.values,
				['name_mas']: {
					action: 'insert',
					is_active: true,
					join_date: dayjs(new Date())
				},
				['name_info']: {
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

	// handle function for tabs
	const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setSelectedTab(newValue);
		setContactOptions(pageState.values?.name_contact);
		setProcessOptions(pageState.values?.name_proc);
		setDepartmentOptions(pageState.values?.name_dept);
		setPrevOptions(pageState.values?.name_experience);
		setSkillOptions(pageState.values?.name_skill);
		setVisaOptions(pageState.values?.name_visa);
		setrefOptions(pageState.values?.name_ref);
	};

	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		setSelectedFile(file);
	};

	const handleAddressButtonClick = (addr: any) => {
		let addrArrIndex = -1;
		if (pageState.values.name_address && pageState.values.name_address.length > 0) {
			addrArrIndex = pageState.values.name_address.findIndex(
				(obj: any) => obj.address_type === addr
			);
		}

		if (addrArrIndex == -1) {
			setPageState(pageState => ({
				...pageState,
				values: {
					...pageState.values,
					address_type: addr
				}
			}));
		}
		setAddressDataOptions(
			pageState.values.name_address && pageState.values.name_address.length > 0
				? pageState.values.name_address
				: null
		);
		setSelectedAddress({
			type: addr,
			data: addrArrIndex > -1 ? pageState.values.name_address[addrArrIndex] : null
		});

		setSelectedAddressType(addr);
	};

	const handleAdd = (event: any, arrName?: string, arrInfo?: string) => {
		setEnableButton1(true);
		setEnableButton(true);
		setSelectedAddressType('PERMANENT');
		event.persist();
		reset({
			name_mas: { name: null, is_active: true, join_date: dayjs(new Date()) } as any,
			name_info: { first_name: null } as any,
			name_document: { kyc_expiry_date: null } as any
		});
		setAddressDataOptions(null);
		setContactOptions(null);
		setProcessOptions(null);
		setDepartmentOptions(null);
		setPrevOptions(null);
		setSkillOptions(null);
		setVisaOptions(null);
		setrefOptions(null);
		//reset()
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
				...pageState.values,
				['name_mas']: {
					action: 'insert',
					is_active: true,
					join_date: dayjs(new Date())
				},
				['name_info']: {
					action: 'insert'
				},
				['name_document']: {
					action: 'insert'
				}
			}
		}));

		setEnableSaveButton(true);
		setCurrentAction('Add');
	};

	const handleUpdate = (event: any, arrName?: string) => {
		// event.persist();

		setPageState(value => ({
			...value,
			values: {
				...pageState.values,
				['name_mas']: {
					...pageState.values['name_mas'],
					action: 'update'
				},
				['name_info']: {
					...pageState.values['name_info'],
					action: 'update'
				},
				['name_document']: {
					...pageState.values['name_document'],
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
				description: 'Are you sure delete Employee ?',
				confirmationButtonProps: { autoFocus: true },
				confirmationText: 'Yes',
				cancellationText: 'No'
			})
				.then(() => {
					dispatch(empsActions.delete({ seq_no: pageState.values.name_mas.seq_no }));
				})
				.catch(() => {
					/* */
				});
		}
	};

	const handleJoinDateChange = (newValue: any) => {
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,

					['name_mas']: {
						...pageState.values['name_mas'],
						join_date: dayjs(new Date(newValue.$d))
					}
				}
			}));
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('name_mas.join_date');
			}, 100);
		}
	};
	const handlePassportChange = (newValue: any) => {
		if (newValue?.$d) {
			const newDate = dayjs(new Date(newValue.$d)).add(1, 'day');

			setPageState(value => ({
				...value,
				values: {
					...pageState.values,

					['name_document']: {
						...pageState.values['name_document'],
						passport_expiry_date: newDate
					}
				}
			}));
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('name_document.passport_expiry_date');
			}, 100);
		}
	};

	const handleKycExpiryChange = (newValue: any) => {
		if (newValue?.$d) {
			const newDate = dayjs(new Date(newValue.$d)).add(1, 'day');

			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					['name_document']: {
						...pageState.values['name_document'],
						kyc_expiry_date: newDate
					}
				}
			}));

			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('name_document.kyc_expiry_date');
			}, 100);
		}
	};
	const handleVerifyChange = (newValue: any) => {
		if (newValue?.$d) {
			const newDate = dayjs(new Date(newValue.$d)).add(1, 'day');
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,

					['name_document']: {
						...pageState.values['name_document'],
						kyc_verify_date: newDate
					}
				}
			}));
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('name_document.kyc_verify_date');
			}, 100);
		}
	};

	const handleLeaveDateChange = (newValue: any) => {
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,

					['name_mas']: {
						...pageState.values['name_mas'],
						leave_date: dayjs(new Date(newValue.$d))
					}
				}
			}));
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('name_mas.leave_date');
			}, 100);
		}
	};

	const handleBirthDateChange = (newValue: any) => {
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					['name_info']: {
						...pageState.values['name_info'],
						date_of_birth: dayjs(new Date(newValue.$d)).format('YYYY-MM-DD')
					}
				}
			}));
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('name_info.date_of_birth');
			}, 100);
		}
	};

	const handleCheckBoxChange = (event: any, targetName: string) => {
		event.persist();

		const splitEleName = targetName.split('.');
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
								: event.target.value,
						leave_date:
							eleName == 'is_active' && event.target.checked == false
								? dayjs(new Date())
								: null
					}
				}
			}));

			if (eleName == 'is_active' && event.target.checked === false) {
				setValue('name_mas.leave_date', dayjs(new Date()));
			} else {
				setValue('name_mas.leave_date', null);
			}
		} else {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					[event.target.name]:
						event.target.type === 'checkbox' ? event.target.checked : event.target.value
				}
			}));
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
				['name_document']: {
					...pageState.values['name_document'],
					pan_no: panNumber
				}
			}
		}));
	};

	const handleAadharChange = (e: any) => {
		const aadharNumber = e.target.value;
		const aadharRegex = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;

		if (aadharNumber !== '' && !aadharRegex.test(aadharNumber)) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Please enter a valid Aadhar Number',
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
				['name_document']: {
					...pageState.values['name_document'],
					aadhar_no: aadharNumber
				}
			}
		}));
	};

	// const onSubmit = async () => {};

	const isPanValid = (panNumber: string) => {
		return (
			panNumber === '' ||
			panNumber === null ||
			/^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/.test(panNumber)
		);
	};

	const isAadharValid = (aadharNumber: string) => {
		return (
			aadharNumber !== null &&
			aadharNumber.trim().length === 12 && // Ensure Aadhar number is 12 digits long
			/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/.test(aadharNumber)
		);
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		const panValid = isPanValid(pageState.values['name_document'].pan_no);
		const aadharValid = isAadharValid(pageState.values['name_document'].aadhar_no);

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
		} else if (!aadharValid) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Please enter a valid Aadhar Number',
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
				dispatch(empsActions.add(pageState.values));
			}
		}
	};

	// const handleSubmit = async (event: any) => {
	// 	event.preventDefault();
	// 	const validation = await trigger();
	// 	if (validation) {
	// 		dispatch(empsActions.add(pageState.values));
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
			name_mas: { name: null, is_active: true, join_date: dayjs(new Date()) } as any,
			name_info: { first_name: null } as any,
			name_document: { kyc_verify_date: null } as any
		});
		setSelectedAddress({
			type: 'PERMANENT',
			data: null
		});
		setSelectedAddressType('PERMANENT');
		setCurrentAction('Cancel');
		setAddressDataOptions([]);
		setContactOptions([]);
		setProcessOptions([]);
		setDepartmentOptions([]);
		setPrevOptions([]);
		setSkillOptions([]);
		setVisaOptions([]);
		setrefOptions([]);
		//reset()
		setPageState({
			isValid: false,
			values: {},
			touched: null,
			errors: null
		});
	};

	const childProps = (obj: { type: string; data: object }) => {
		let addrArrIndex = -1;
		let arr: any[] =
			pageState.values.name_address && pageState.values.name_address.length > 0
				? pageState.values.name_address
				: [];
		if (pageState.values.name_address && pageState.values.name_address.length > 0) {
			addrArrIndex = pageState.values.name_address.findIndex(
				(object: any) => object.address_type === obj.type
			);
		}

		arr = [...arr];

		if (addrArrIndex > -1) {
			arr[addrArrIndex] = obj.data;
		} else {
			arr.push(obj.data);
		}

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				name_address: arr
			}
		}));
	};

	const childPropsReference = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				name_ref: array
			}
		}));
	};

	const childPropsProcess = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				name_proc: array
			}
		}));
	};

	const childPropsPrev = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				name_experience: array
			}
		}));
	};

	const childPropsContacts = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				name_contact: array
			}
		}));
	};

	const childPropsDept = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				name_dept: array
			}
		}));
	};

	const childPropsSkill = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				name_skill: array
			}
		}));
	};

	const childPropsVisa = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				name_visa: array
			}
		}));
	};

	const childPropsEmps = (array: any, data?: any) => {
		dispatch(empsActions.getOneDet(array?.seq_no));
	};

	const onSubmit = async () => {};

	return (
		<div>
			<div
				id="scroll-container"
				ref={refPage as any}
				tabIndex={-1}
				style={{ outline: 'none' }}>
				<Box ref={formRef} onKeyUp={event => onEnterKey(event)}>
					<MainCard content={false}>
						<FormContainer
							onSuccess={() => onSubmit()}
							formContext={formContext}
							FormProps={{ autoComplete: 'off' }}>
							<Grid container spacing={0.5}>
								<fieldset
									style={{
										border: '1px solid rgb(217 203 203 / 75%)',
										borderRadius: '5px',
										borderBottom: 'none'
									}}>
									<legend style={{ color: 'red', fontWeight: 'bolder' }}>
										Employee Details
									</legend>
									<Grid
										item
										xs={12}
										container
										style={{
											display: 'flex',
											// justifyContent: 'center',
											alignItems: 'center'
											// marginLeft: '-25px'
										}}
										alignItems="center">
										<Grid
											xs={11}
											container
											spacing={0.5}
											style={{ display: 'flex' }}
											alignItems="center">
											<Grid
												item
												xs={6}
												container
												alignItems="center"
												className="marginRightone">
												<Grid item xs={2}>
													<Typography variant="subtitle1">
														First Name
													</Typography>
												</Grid>
												<Grid item xs={3.52} className="zodErrorHide">
													<TextFieldElement
														name="name_info.first_name"
														className={`textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														fullWidth
														variant="outlined"
														disabled={!editMode}
														onChange={handleChange}
													/>
												</Grid>
												<Grid item xs={2.3} className="typo-field-left">
													<Typography
														variant="subtitle1"
														style={{ marginLeft: '11px' }}>
														Middle Name
													</Typography>
												</Grid>
												<Grid item xs={3.65}>
													<TextFieldElement
														name="name_info.middle_name"
														className={`textfieldmiddle ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														fullWidth
														variant="outlined"
														disabled={!editMode}
														onChange={handleChange}
													/>
												</Grid>
											</Grid>
											<Grid item xs={4} container alignItems="center">
												<Grid item xs={3} className="marginLeftBig">
													<Typography variant="subtitle1">
														Last Name
													</Typography>
												</Grid>
												<Grid item xs={6.04} className="lastname">
													<TextFieldElement
														name="name_info.last_name"
														className={`textfield2  ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														fullWidth
														variant="outlined"
														disabled={!editMode}
														onChange={handleChange}
													/>
												</Grid>
											</Grid>
											<Grid
												item
												xs={6}
												container
												alignItems="center"
												className="marginRightone">
												<Grid item xs={2}>
													<Typography variant="subtitle1">
														Name
													</Typography>
												</Grid>
												<Grid item xs={9.75}>
													<TextFieldElement
														name="name_mas.name"
														className={`custom-textfieldd ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														fullWidth
														variant="outlined"
														disabled={!editMode}
														style={{
															backgroundColor: !editMode
																? '#f0f0f0'
																: 'inherit'
														}}
														onChange={handleChange}
													/>
												</Grid>
											</Grid>

											<Grid item xs={4} container alignItems="center">
												<Grid item xs={3} className="marginLeftBig">
													<Typography variant="subtitle1">
														Short Name
													</Typography>
												</Grid>
												<Grid item xs={6.04} className="lastname">
													<TextFieldElement
														name="name_mas.short_name"
														className={`textfield2 ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														fullWidth
														variant="outlined"
														disabled={!editMode}
														onChange={handleChange}
													/>
												</Grid>
											</Grid>

											<Grid
												item
												xs={6}
												container
												alignItems="center"
												className="marginRightone">
												<Grid item xs={2}>
													<Typography variant="subtitle1">
														Gender
													</Typography>
												</Grid>
												<Grid item xs={3.76}>
													<AutocompleteElement
														classname={`textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="name_info.gender"
														options={genderOptions}
														autocompleteProps={{
															id: 'gender',
															disabled: !editMode,
															clearIcon: false,

															onChange: (
																event,
																value,
																reason,
																details
															) =>
																handleGenderChange(
																	event,
																	value,
																	reason,
																	details,
																	'name_info'
																),
															getOptionLabel: option => {
																// Regular option
																return option.show_value;
															}
														}}
													/>
												</Grid>
												<Grid item xs={2} className="typo-field-left">
													<Typography variant="subtitle1">
														Date Of Birth
													</Typography>
												</Grid>
												<Grid item xs={3.8}>
													<DatePickerElement
														className={`textfieldbirth ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														readOnly={!editMode}
														name="name_info.date_of_birth"
														format="DD-MM-YYYY"
														onChange={newValue =>
															handleBirthDateChange(newValue)
														}
													/>
												</Grid>
											</Grid>
											<Grid item xs={4} container alignItems="center">
												<Grid item xs={3} className="marginLeftBig">
													<Typography variant="subtitle1">
														Blood Group
													</Typography>
												</Grid>
												<Grid item xs={7.68} className="lastname">
													<AutocompleteElement
														classname={`textfield2 ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="name_info.blood_group"
														options={bloodOptions}
														autocompleteProps={{
															id: 'blood',
															disabled: !editMode,
															clearIcon: false,

															onChange: (
																event,
																value,
																reason,
																details
															) =>
																handleBloodChange(
																	event,
																	value,
																	reason,
																	details,
																	'name_info'
																),
															getOptionLabel: option => {
																// Regular option
																return option.show_value;
															}
														}}
													/>
												</Grid>
											</Grid>

											<Grid
												item
												xs={6}
												container
												alignItems="center"
												className="marginRightone">
												<Grid item xs={2}>
													<Typography
														variant="subtitle1"
														style={{ fontSize: '13.5px' }}>
														Marital Status
													</Typography>
												</Grid>
												<Grid item xs={3.76}>
													<AutocompleteElement
														classname={`textfieldmar ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="name_info.marital_status"
														options={maritalOptions}
														autocompleteProps={{
															id: 'marital',
															disabled: !editMode,
															clearIcon: false,
															onChange: (
																event,
																value,
																reason,
																details
															) =>
																handleMaritalChange(
																	event,
																	value,
																	reason,
																	details,
																	'name_info'
																),
															getOptionLabel: option => {
																// Regular option
																return option.name;
															}
														}}
													/>
												</Grid>
												<Grid item xs={1.95} className="typo-field-left">
													<Typography variant="subtitle1">
														Language
													</Typography>
												</Grid>
												<Grid item xs={3.82}>
													<AutocompleteElement
														classname={`textfieldlan ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="name_info.language"
														options={languageOptions}
														autocompleteProps={{
															id: 'language',
															disabled: !editMode,
															clearIcon: false,

															onChange: (
																event,
																value,
																reason,
																details
															) =>
																handleLanguageChange(
																	event,
																	value,
																	reason,
																	details,
																	'name_info'
																),
															getOptionLabel: option => {
																// Regular option
																return option.name;
															}
														}}
													/>
												</Grid>
											</Grid>
											<Grid item xs={4} container alignItems="center">
												<Grid item xs={3} className="marginLeftBig">
													<Typography variant="subtitle1">
														Education
													</Typography>
												</Grid>
												<Grid item xs={7.65} className="lastname">
													<AutocompleteElement
														classname={`textfield2 ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="name_info.education"
														options={educationOptions}
														autocompleteProps={{
															id: 'education',
															disabled: !editMode,
															clearIcon: false,

															onChange: (
																event,
																value,
																reason,
																details
															) =>
																handleEducationChange(
																	event,
																	value,
																	reason,
																	details,
																	'name_info'
																),
															getOptionLabel: option => {
																// Regular option
																return option.name;
															}
														}}
													/>
												</Grid>
											</Grid>
											<Grid
												item
												xs={6}
												container
												alignItems="center"
												className="marginRightone">
												<Grid item xs={2}>
													<Typography variant="subtitle1">
														Hobby
													</Typography>
												</Grid>
												<Grid item xs={3.52}>
													<TextFieldElement
														name="name_info.hobby"
														className={`textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														fullWidth
														variant="outlined"
														disabled={!editMode}
														onChange={handleChange}
													/>
												</Grid>
												<Grid item xs={2} className="typo-field-left">
													<Typography
														variant="subtitle1"
														style={{ marginLeft: '11px' }}>
														Height
													</Typography>
												</Grid>
												<Grid item xs={3.76}>
													<TextFieldElement
														type="number"
														name="name_info.height"
														className={`textfieldh ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														fullWidth
														variant="outlined"
														disabled={!editMode}
														onChange={handleChange}
													/>
												</Grid>
											</Grid>

											<Grid item xs={0.99} className="marginLeftBig">
												<Typography variant="subtitle1">
													Nationality
												</Typography>
											</Grid>
											<Grid item xs={2.565} className="lastname">
												<AutocompleteElement
													name="name_info.nationality"
													classname={`textfield2 ${
														!editMode ? 'disabled-textfield' : ''
													}`}
													options={nationOptions}
													autocompleteProps={{
														id: 'education',
														disabled: !editMode,
														clearIcon: false,

														onChange: (event, value, reason, details) =>
															handleNationChange(
																event,
																value,
																reason,
																details,
																'name_info'
															),
														getOptionLabel: option => {
															// Regular option
															return option.name;
														}
													}}
												/>
											</Grid>

											<Grid
												item
												xs={6}
												container
												alignItems="center"
												className="marginRightone">
												<Grid item xs={2}>
													<Typography variant="subtitle1">
														Religion
													</Typography>
												</Grid>
												<Grid item xs={3.76}>
													<AutocompleteElement
														classname={`textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="name_info.religion"
														options={religionOptions}
														autocompleteProps={{
															id: 'religion',
															disabled: !editMode,
															clearIcon: false,

															onChange: (
																event,
																value,
																reason,
																details
															) =>
																handleReligionChange(
																	event,
																	value,
																	reason,
																	details,
																	'name_info'
																),
															getOptionLabel: option => {
																// Regular option
																return option.name;
															}
														}}
													/>
												</Grid>
												<Grid xs={1.96} className="typo-field-left">
													<Typography variant="subtitle1">
														Caste
													</Typography>
												</Grid>
												<Grid item xs={3.83}>
													<AutocompleteElement
														classname={`textfieldc ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="name_info.caste"
														options={casteOptions}
														autocompleteProps={{
															id: 'religion',
															disabled: !editMode,
															clearIcon: false,

															onChange: (
																event,
																value,
																reason,
																details
															) =>
																handleCasteChange(
																	event,
																	value,
																	reason,
																	details,
																	'name_info'
																),
															getOptionLabel: option => {
																// Regular option
																return option.name;
															}
														}}
													/>
												</Grid>
											</Grid>
											<Grid item xs={4} container alignItems="center">
												<Grid item xs={3} className="marginLeftBig">
													<Typography variant="subtitle1">
														Sub Caste
													</Typography>
												</Grid>
												<Grid item xs={7.65} className="lastname">
													<AutocompleteElement
														classname={`textfield2 ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="name_info.sub_caste"
														options={subCasteOptions}
														autocompleteProps={{
															id: 'sub_caste',
															disabled: !editMode,
															clearIcon: false,

															onChange: (
																event,
																value,
																reason,
																details
															) =>
																handleSubCasteChange(
																	event,
																	value,
																	reason,
																	details,
																	'name_info'
																),
															getOptionLabel: option => {
																// Regular option
																return option.name;
															}
														}}
													/>
												</Grid>
											</Grid>
										</Grid>

										<Grid xs={1} style={{ marginLeft: '-168px' }}>
											<Paper elevation={3} className="upload-photo-section">
												{selectedFile ? (
													<img
														src={URL.createObjectURL(selectedFile)}
														alt="Selected"
														style={{
															width: '100%',
															height: '100%',
															objectFit: 'contain'
														}}
													/>
												) : (
													<div>Upload a photo</div>
												)}
												<input
													accept="image/*"
													style={{ display: 'none' }}
													id="photo-upload"
													type="file"
													tabIndex={-1}
													onChange={e => handleFileChange(e)}
												/>
												<label htmlFor="photo-upload">
													<Button
														variant="contained"
														disabled={!editMode}
														component="span"
														color="primary"
														style={{
															marginTop: '16px',
															height: '31px',
															flex: 'shrink'
														}}>
														Upload
													</Button>
												</label>
											</Paper>
										</Grid>
									</Grid>
								</fieldset>
							</Grid>
							{/*----------------- //Address start from below ---------------- */}
							<Address
								passProps={childProps}
								selectedData={selectedAddress}
								addressOptions={addressDataOptions}
								currentAction={currentAction}
								editMode={editMode}
							/>

							<Grid item className="address">
								<div id="Address-div-blank">
									{addressOptions.map((addr: any, index?: any) => {
										const isSelected = addr.name
											? addr.name === selectedAddressType
											: addr.address_type === selectedAddressType;
										if (index === 0 && selectedAddressType === '') {
											handleAddressButtonClick(
												addr.name ? addr.name : addr.address_type
											);
										}
										return (
											<li
												key={addr.name || addr.address_type}
												style={{
													listStyle: 'none',
													textTransform: 'capitalize'
												}}>
												<Button
													tabIndex={-1}
													variant="outlined"
													style={{
														marginBottom: '3px',
														color: isSelected ? 'white' : '',
														backgroundColor: isSelected
															? '#1677ff'
															: 'white'
													}}
													fullWidth
													size="small"
													name="address_type"
													onClick={e =>
														handleAddressButtonClick(
															addr.name
																? addr.name
																: addr.address_type
														)
													}>
													{addr.name
														? addr.name?.toLowerCase()
														: addr.address_type?.toLowerCase()}
												</Button>
											</li>
										);
									})}
								</div>
							</Grid>
							<fieldset
								id="fieldset-size-third marginTop"
								style={{
									border: '1px solid rgb(217 203 203 / 75%)',
									borderRadius: '5px',
									borderBottom: 'none',
									marginLeft: '-3px'
								}}>
								<legend style={{ color: 'red', fontWeight: 'bolder' }}>
									Document Details
								</legend>
								<Grid container spacing={0.5} style={{ marginLeft: '1px' }}>
									{/* style={{ marginLeft: '60px' }} */}
									<Grid item xs={3.5} spacing={0.4} container alignItems="center">
										<Grid item xs={3.5}>
											<Typography variant="subtitle1">Aadhar No</Typography>
										</Grid>
										<Grid item xs={6}>
											<TextFieldElement
												type="number"
												className={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_document.aadhar_no"
												fullWidth
												variant="outlined"
												disabled={!editMode}
												// onChange={handleChange}
												onChange={handleAadharChange}
											/>
										</Grid>
										<Grid item xs={3.5}>
											<Typography variant="subtitle1">Pan No</Typography>
										</Grid>
										<Grid item xs={6}>
											<TextFieldElement
												className={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_document.pan_no"
												fullWidth
												variant="outlined"
												disabled={!editMode}
												// onChange={handleChange}
												onChange={handlePanChange}
											/>
										</Grid>
										<Grid item xs={3.5}>
											<Typography variant="subtitle1">
												Driving Lic.
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<TextFieldElement
												className={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_document.driving_lic_no"
												fullWidth
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
										<Grid item xs={3.5}>
											<Typography variant="subtitle1">Emp Tax No</Typography>
										</Grid>
										<Grid item xs={6}>
											<TextFieldElement
												className={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_document.tax_no"
												fullWidth
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
										<Grid item xs={3.5}>
											<Typography variant="subtitle1">
												Social Sec. No
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<TextFieldElement
												className={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_document.social_security_no"
												fullWidth
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
									</Grid>

									<Grid item xs={4} spacing={0.4} container alignItems="center">
										<Grid item xs={3.35}>
											<Typography variant="subtitle1" className="camleft">
												Passport No
											</Typography>
										</Grid>
										<Grid item xs={5.53}>
											<TextFieldElement
												className={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_document.passport_no"
												fullWidth
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
										<Grid item xs={2}></Grid>
										<Grid item xs={3.35}>
											<Typography
												variant="subtitle1"
												style={{ fontSize: '13px' }}
												className="camleft">
												Passport Exp. Date
											</Typography>
										</Grid>
										<Grid item xs={5.53}>
											<DatePickerElement
												className={`textfieldpass ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												disabled={!editMode}
												readOnly={!editMode}
												name="name_document.passport_expiry_date"
												format="DD-MM-YYYY"
												onChange={newValue =>
													handlePassportChange(newValue)
												}
											/>
										</Grid>
										<Grid item xs={2}></Grid>
										<Grid item xs={3.35}>
											<Typography variant="subtitle1" className="camleft">
												Kyc No
											</Typography>
										</Grid>
										<Grid item xs={5.53}>
											<TextFieldElement
												className={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_document.kyc_no"
												fullWidth
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
										<Grid item xs={2}></Grid>
										<Grid item xs={3.35}>
											<Typography variant="subtitle1" className="camleft">
												Kyc Verify Date
											</Typography>
										</Grid>
										<Grid item xs={5.53}>
											<DatePickerElement
												className={`textfieldpass ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												disabled={!editMode}
												readOnly={!editMode}
												name="name_document.kyc_verify_date"
												format="DD-MM-YYYY"
												onChange={newValue => handleVerifyChange(newValue)}
											/>
										</Grid>
										<Grid item xs={2}></Grid>
										<Grid item xs={3.35}>
											<Typography variant="subtitle1" className="camleft">
												Kyc Verify By
											</Typography>
										</Grid>
										<Grid item xs={5.53}>
											<AutocompleteElement
												classname={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_document.kyc_verify_by"
												options={verifyOptions}
												autocompleteProps={{
													id: 'kyc_verify',
													disabled: !editMode,
													clearIcon: false,

													onChange: (event, value, reason, details) =>
														handleVerifyByChange(
															event,
															value,
															reason,
															details,
															'name_document'
														),
													getOptionLabel: option => {
														// Regular option
														return option.name;
													}
												}}
											/>
										</Grid>
									</Grid>

									<Grid item xs={4} container spacing={0.4} alignItems="center">
										<Grid item xs={3.5}>
											<Typography variant="subtitle1">Kyc Status</Typography>
										</Grid>
										<Grid item xs={5.15} style={{ marginLeft: '4px' }}>
											<AutocompleteElement
												classname={`custom-textfielkycstatus ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_document.kyc_status"
												options={kycsOptions}
												autocompleteProps={{
													id: 'kycs',
													disabled: !editMode,
													clearIcon: false,

													onChange: (event, value, reason, details) =>
														handleKycsChange(
															event,
															value,
															reason,
															details,
															'name_document'
														),
													getOptionLabel: option => {
														// Regular option
														return option.show_value;
													}
												}}
											/>
										</Grid>
										<Grid xs={2}></Grid>
										<Grid item xs={3.5} className="designationtext">
											<Typography variant="subtitle1">
												Kyc Exp. Date
											</Typography>
										</Grid>
										<Grid item xs={5.5} className="designation">
											<DatePickerElement
												className={`textfield ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												disabled={!editMode}
												readOnly={!editMode}
												name="name_document.kyc_expiry_date"
												format="DD-MM-YYYY"
												onChange={newValue =>
													handleKycExpiryChange(newValue)
												}
											/>
										</Grid>
										<Grid xs={2}></Grid>
										<Grid item xs={3.5} className="designationtext">
											<Typography variant="subtitle1" className="commentstop">
												Kyc Comments
											</Typography>
										</Grid>
										<Grid item xs={7} className="designation">
											<TextFieldElement
												multiline
												name="name_document.kyc_comments"
												className={`custom-textfielkyc ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												rows={2}
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
										<Grid xs={12}></Grid>
									</Grid>
								</Grid>
							</fieldset>

							<fieldset
								id="fieldset-size-third marginTop"
								style={{
									border: '1px solid rgb(217 203 203 / 75%)',
									borderRadius: '5px',
									borderBottom: 'none',
									marginLeft: '-2px'
								}}>
								<legend style={{ color: 'red', fontWeight: 'bolder' }}>
									Other Details
								</legend>
								<Grid container spacing={0.5} style={{ marginLeft: '1px' }}>
									{/* style={{ marginLeft: '60px' }} */}
									<Grid item xs={4} spacing={0.3} container alignItems="center">
										<Grid item xs={3.5}>
											<Typography variant="subtitle1">Emp Code</Typography>
										</Grid>
										<Grid item xs={6}>
											<TextFieldElement
												className={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_mas.emp_no"
												fullWidth
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
										<Grid item xs={3.5}>
											<Typography variant="subtitle1">Card No</Typography>
										</Grid>
										<Grid item xs={6}>
											<TextFieldElement
												className={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_mas.card_no"
												fullWidth
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
										<Grid item xs={3.5}>
											<Typography variant="subtitle1">Salary Base</Typography>
										</Grid>
										<Grid item xs={6}>
											<AutocompleteElement
												classname={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_info.salary_base"
												options={salaryOptions}
												autocompleteProps={{
													id: 'salary',
													disabled: !editMode,
													clearIcon: false,

													onChange: (event, value, reason, details) =>
														handleSalaryChange(
															event,
															value,
															reason,
															details,
															'name_info'
														),
													getOptionLabel: option => {
														// Regular option
														return option.show_value;
													}
												}}
											/>
										</Grid>
									</Grid>

									<Grid item xs={4} spacing={0.5} container alignItems="center">
										<Grid item xs={3.35}>
											<Typography variant="subtitle1" className="camleft">
												Intercomm
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<TextFieldElement
												className={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_info.intercom_no"
												fullWidth
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
										<Grid item xs={2}></Grid>
										<Grid item xs={3.35}>
											<Typography variant="subtitle1" className="camleft">
												Camera 1
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<TextFieldElement
												className={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_info.camera_1"
												fullWidth
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
										<Grid item xs={2}></Grid>
										<Grid item xs={3.35}>
											<Typography variant="subtitle1" className="camleft">
												Camera 2
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<TextFieldElement
												className={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_info.camera_2"
												fullWidth
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
									</Grid>

									<Grid item xs={4} spacing={0.5} container alignItems="center">
										<Grid item xs={3.68}>
											<Typography variant="subtitle1">Join Date</Typography>
										</Grid>
										<Grid item xs={4.9}>
											<DatePickerElement
												className={`textfield ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												disabled={!editMode}
												readOnly={!editMode}
												name="name_mas.join_date"
												format="DD-MM-YYYY"
												onChange={newValue =>
													handleJoinDateChange(newValue)
												}
											/>
										</Grid>
										<Grid xs={3}></Grid>
										<Grid item xs={4}>
											<Typography variant="subtitle1">Designation</Typography>
										</Grid>
										<Grid item xs={6}>
											<AutocompleteElement
												classname={`custom-textfieldesig ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_mas.designation"
												options={managerOptions}
												autocompleteProps={{
													id: 'designation',
													disabled: !editMode,
													clearIcon: false,

													onChange: (event, value, reason, details) =>
														handleManagerChange(
															event,
															value,
															reason,
															details,
															'name_mas'
														),
													getOptionLabel: option => {
														// Regular option
														return option.show_value;
													}
												}}
											/>
										</Grid>
										<Grid xs={1}></Grid>
										<Grid item xs={4} className="designationtext">
											<Typography variant="subtitle1">
												Incharge Name
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<AutocompleteElement
												classname={`custom-textfieldesig ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_info.inch"
												options={inchargetOptions}
												autocompleteProps={{
													id: 'inch',
													disabled: !editMode,
													clearIcon: false,

													onChange: (event, value, reason, details) =>
														handleInchtChange(
															event,
															value,
															reason,
															details,
															'name_info'
														),
													getOptionLabel: option => {
														// Regular option
														return option.name;
													}
												}}
											/>
										</Grid>

										<Grid xs={6}></Grid>
										<Grid xs={6}></Grid>
									</Grid>

									<Grid item xs={1.2} className="address-btn-leftt">
										<Typography variant="subtitle1">Leave Date</Typography>
									</Grid>
									<Grid
										item
										xs={0.3}
										style={{ marginLeft: '5px', marginTop: '-3px' }}>
										<CheckboxElement
											className="checkbox-hight"
											disabled={!editMode}
											name="name_mas.is_active"
											onChange={e => {
												handleCheckBoxChange(e, 'name_mas.is_active');
											}}
										/>
									</Grid>
									<Grid item xs={1.6}>
										<DatePickerElement
											className={`textfieldleave ${
												!editMode || pageState.values.name_mas?.is_active
													? 'disabled-textfield'
													: ''
											}`}
											name="name_mas.leave_date"
											format="DD-MM-YYYY"
											onChange={newValue => {
												handleLeaveDateChange(newValue);
											}}
											disabled={
												!editMode || pageState.values.name_mas?.is_active
											}
											readOnly={
												!editMode || pageState.values.name_mas?.is_active
											}
										/>
									</Grid>
									<Grid xs={0.6}></Grid>

									{/* </Grid> */}

									<Grid item xs={1.37}>
										<Typography variant="subtitle1">Leave Reason</Typography>
									</Grid>
									<Grid item xs={2.6}>
										<TextFieldElement
											name="name_mas.leave_reason"
											className={`custom-textfielddd ${
												!editMode ? 'disabled-textfield' : ''
											}`}
											fullWidth
											variant="outlined"
											disabled={!editMode}
											onChange={handleChange}
										/>
									</Grid>
									<Grid xs={0.28}></Grid>
									<Grid item xs={1.35}>
										<Typography variant="subtitle1">
											Designation Role
										</Typography>
									</Grid>
									<Grid item xs={1.99}>
										<AutocompleteElement
											classname={`custom-textfieldesig ${
												!editMode ? 'disabled-textfield' : ''
											}`}
											name="name_mas.designation_role"
											options={desigRoleOptions}
											autocompleteProps={{
												disabled: !editMode,
												clearIcon: false,

												onChange: (event, value, reason, details) =>
													handleDesigRoleChange(
														event,
														value,
														reason,
														details,
														'name_mas'
													),
												getOptionLabel: option => {
													return option.show_value;
												}
											}}
										/>
									</Grid>
								</Grid>
							</fieldset>

							<fieldset
								id="fieldset-size-fourth marginTop"
								style={{
									border: '1px solid rgb(217 203 203 / 75%)',
									borderRadius: '5px',
									marginLeft: '-2px'
								}}>
								<legend style={{ color: 'red', fontWeight: 'bolder' }}>
									Transportation Details
								</legend>
								<Grid container spacing={0.5} style={{ marginLeft: '1px' }}>
									<Grid item xs={4} spacing={0.2} container alignItems="center">
										<Grid item xs={4.4}>
											<Typography variant="subtitle1" className="trans">
												Transport Mode
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<AutocompleteElement
												classname={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_info.mode_of_transport"
												options={transportOptions}
												autocompleteProps={{
													id: 'transport',
													disabled: !editMode,
													clearIcon: false,

													onChange: (event, value, reason, details) =>
														handleTransportChange(
															event,
															value,
															reason,
															details,
															'name_info'
														),
													getOptionLabel: option => {
														// Regular option
														return option.name;
													}
												}}
											/>
										</Grid>
										<Grid item xs={4.4}>
											<Typography variant="subtitle1">
												Vehicle Type
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<AutocompleteElement
												classname={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_info.vehicle_type"
												options={vehicleOptions}
												autocompleteProps={{
													id: 'vehicle',
													disabled: !editMode,
													clearIcon: false,

													onChange: (event, value, reason, details) =>
														handleVehicleChange(
															event,
															value,
															reason,
															details,
															'name_info'
														),
													getOptionLabel: option => {
														// Regular option
														return option.name;
													}
												}}
											/>
										</Grid>
									</Grid>

									<Grid item xs={4} spacing={0.2} container alignItems="center">
										<Grid item xs={3.3}>
											<Typography variant="subtitle1">Fuel Type</Typography>
										</Grid>
										<Grid item xs={4.5}>
											<AutocompleteElement
												classname={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_info.fuel_type"
												options={fuelOptions}
												autocompleteProps={{
													id: 'fuel',
													disabled: !editMode,
													clearIcon: false,

													onChange: (event, value, reason, details) =>
														handleFuelChange(
															event,
															value,
															reason,
															details,
															'name_info'
														),
													getOptionLabel: option => {
														// Regular option
														return option.name;
													}
												}}
											/>
										</Grid>
										<Grid item xs={3.5}></Grid>
										<Grid item xs={3.3}>
											<Typography variant="subtitle1">Vehicle No</Typography>
										</Grid>
										<Grid item xs={4.5}>
											<TextFieldElement
												className={`custom-textfielde ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												name="name_info.vehicle_no"
												fullWidth
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
										<Grid item xs={2}></Grid>
									</Grid>

									<Grid item xs={4} spacing={0.5} container alignItems="center">
										<Grid item xs={2}>
											<Typography variant="subtitle1">Kilometers</Typography>
										</Grid>
										<Grid item xs={2} style={{ marginLeft: '4px' }}>
											<TextFieldElement
												name="name_info.killometer"
												className={`custom-textfieldd ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												fullWidth
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
										<Grid xs={6}></Grid>
										<Grid item xs={2}>
											<Typography variant="subtitle1">Route</Typography>
										</Grid>
										<Grid item xs={5} style={{ marginLeft: '4px' }}>
											<TextFieldElement
												name="name_info.route"
												className={`custom-textfieldd ${
													!editMode ? 'disabled-textfield' : ''
												}`}
												fullWidth
												variant="outlined"
												disabled={!editMode}
												onChange={handleChange}
											/>
										</Grid>
										<Grid xs={3}></Grid>
									</Grid>
								</Grid>
							</fieldset>

							<div className="marginTopGrid">
								<Paper>
									<Tabs value={selectedTab} onChange={handleTabChange}>
										<Tab label="Refrence Details" />
										<Tab label="Process" />
										<Tab label="Prev Info" />
										<Tab label="Contact" />
										<Tab label="Department" />
										<Tab label="Skill" />
										<Tab label="Visa" />
									</Tabs>
								</Paper>

								{selectedTab === 0 && (
									<RefrenceDetails
										passProps={childPropsReference}
										refOptions={refOptions}
										currentAction={currentAction}
										editMode={editMode}
									/>
								)}
								{selectedTab === 1 && (
									<Process
										passProps={childPropsProcess}
										processOptions={processOptions}
										currentAction={currentAction}
										editMode={editMode}
									/>
								)}
								{selectedTab === 2 && (
									<PrevInfo
										passProps={childPropsPrev}
										prevOptions={prevOptions}
										currentAction={currentAction}
										editMode={editMode}
									/>
								)}
								{selectedTab === 3 && (
									<Contact
										passProps={childPropsContacts}
										contactOptions={contactOptions}
										currentAction={currentAction}
										editMode={editMode}
									/>
								)}
								{selectedTab === 4 && (
									<Department
										passProps={childPropsDept}
										departmentOptions={departmentOptions}
										currentAction={currentAction}
										editMode={editMode}
									/>
								)}
								{selectedTab === 5 && (
									<Skill
										passProps={childPropsSkill}
										skillOptions={skillOptions}
										currentAction={currentAction}
										editMode={editMode}
									/>
								)}
								{selectedTab === 6 && (
									<Visa
										passProps={childPropsVisa}
										visaOptions={visaOptions}
										currentAction={currentAction}
										editMode={editMode}
									/>
								)}
							</div>

							{/* --------------Footer Button start from Below -------------- */}

							{openAddDrawer && (
								<InfiniteDrawer
									width={80}
									component={Emps}
									handleDrawerToggle={handleDrawerToggle}
									passProps={childPropsEmps}
									setEnableButton1={setEnableButton1}
								/>
							)}
						</FormContainer>
						<Grid container spacing={0.5} className="footer-main-dev-button">
							<Grid item xs={0.85} className="address-btn">
								<Button
									tabIndex={-1}
									ref={addButtonRef}
									className="custom-button"
									variant="outlined"
									fullWidth
									placeholder="ADD"
									size="small"
									disabled={enableSaveButton}
									onClick={e => {
										toggleEditMode();
										handleAdd(e);
										setEnableButton(false);
									}}>
									+ Add
								</Button>
							</Grid>
							<Grid item xs={0.85} className="address-btn">
								<Button
									tabIndex={-1}
									ref={editButtonRef}
									className="custom-button"
									variant="outlined"
									fullWidth
									placeholder="EDIT"
									size="small"
									disabled={enableButton1}
									onClick={e => {
										handleEdit();
										handleUpdate(e);
									}}>
									Edit
								</Button>
							</Grid>
							<Grid item xs={0.85} className="address-btn">
								<Button
									tabIndex={-1}
									ref={deleteButtonRef}
									className="custom-button"
									variant="outlined"
									fullWidth
									placeholder="DELETE"
									size="small"
									disabled={enableButton1}
									onClick={handleDelete}>
									Delete
								</Button>
							</Grid>
							<Grid item xs={0.85} className="address-btn">
								<Button
									style={{ outline: 'none' }}
									tabIndex={-1}
									ref={viewButtonRef}
									className="custom-button"
									variant="outlined"
									fullWidth
									placeholder="VIEW"
									size="small"
									disabled={enableSaveButton}
									onClick={onEditClick}>
									View
								</Button>
							</Grid>
							<Grid item xs={0.85} className="address-btn">
								<Button
									tabIndex={-1}
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
									disabled={enableButton}>
									{isSubmitting ? (
										<CircularProgress size={24} color="success" />
									) : (
										formatMessage({ id: 'Save' })
									)}
								</Button>
							</Grid>
							<Grid item xs={0.85} className="address-btn">
								<Button
									tabIndex={-1}
									ref={cancelButtonRef}
									className="custom-button"
									variant="outlined"
									fullWidth
									placeholder="CANCEL"
									size="small"
									onClick={handleCancel}>
									Cancel
								</Button>
							</Grid>
						</Grid>
					</MainCard>
				</Box>
			</div>
		</div>
	);
}
export default EmployeeDetail;
