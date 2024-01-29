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
	CircularProgress
} from '@mui/material';

import dayjs from 'dayjs';

import {
	AutocompleteElement,
	CheckboxElement,
	DatePickerElement,
	FormContainer,
	TextFieldElement
} from '@app/components/rhfmui';

import { FormSchema, IFormInput } from '@pages/master/party/models/Parties';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfiniteDrawer } from '@components/drawer';
import { InitialState } from '@utils/helpers';

import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { usePartiesSlice } from '../store/slice';
import { partiesSelector } from '../store/slice/parties.selectors';

import useFocusOnEnter from '@hooks/useFocusOnEnter';
import { useConfirm } from 'material-ui-confirm';
import TenderDropdown from '@pages/master/tenderView/sections/TenderLotViewDropdown';
import '@pages/master/tenderView/sections/tenderlotview.css';
import Address from './Address';
import BankDetail from './BankDetail';
import Contacts from './Contacts';
import Process from './Process';
import Partys from './Partys';

import './party.css';
import MainCard from '@components/MainCard';
import { TextField } from '@mui/material';
// import '../tenderlotview.css';
import '@pages/master/tenderView/sections/tenderlotview.css';

function Party() {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: partiesActions } = usePartiesSlice();
	const { actions } = useSnackBarSlice();

	// *** Parties State *** //
	const partiesState = useSelector(partiesSelector);
	const {
		getAlabSuccess,
		getParaSuccess,
		getOneDetSuccess,
		addSuccess,
		deleteSuccess,
		getVerifySuccess,
		getKycsSuccess,
		getProgramsSuccess
	} = partiesState;
	// addSuccess

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
		setValue,
		trigger
	} = formContext;

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {
			name_mas: {
				join_date: dayjs(new Date()),
				//leave_date: dayjs(new Date()),
				is_active: true
			}
		},
		touched: null,
		errors: null
	});

	//add your reference
	const formRef = useRef();

	const { onEnterKey } = useFocusOnEnter(formRef, formContext.formState.errors);

	const [selectedTab, setSelectedTab] = useState<number>(0);
	const [selectedAddress, setSelectedAddress] = useState<any>(null);
	const [selectedAddressType, setSelectedAddressType] = useState('');

	const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false);

	const [editMode, setEditMode] = useState<boolean>(false);
	const [enableButton, setEnableButton] = useState<boolean>(true);
	const [enableButton1, setEnableButton1] = useState<boolean>(true);
	const [enableSaveButton, setEnableSaveButton] = useState(false);
	const [, setEnableSaveButton1] = useState<boolean>(false); // enableSaveButton1

	const [associateOptions, setAssociateOptions] = useState<any>([]);
	const [addressDataOptions, setAddressDataOptions] = useState<any>([]);
	const [addressOptions, setAddressOptions] = useState<any>([]);
	const [contactOptions, setContactOptions] = useState<any>([]);
	const [bankOptions, setBankOptions] = useState<any>([]);
	const [processOptions, setProcessOptions] = useState<any>([]);
	const [currentAction, setCurrentAction] = useState('');
	const [verifyOptions, setVerifyOptions] = useState<any>([]);
	const [kycsOptions, setKycsOptions] = useState<any>([]);

	// add your refrence  👿
	const addButtonRef = useRef<any>(null);
	const editButtonRef = useRef<any>(null);
	const deleteButtonRef = useRef<any>(null);
	const viewButtonRef = useRef<any>(null);
	const saveButtonRef = useRef<any>(null);
	const cancelButtonRef = useRef<any>(null);
	const panInputRef = useRef<any>(null);

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
		dispatch(partiesActions.getPara('ADDRESS_TYPE'));
		dispatch(partiesActions.getAlab(''));
		dispatch(partiesActions.getKycs('KYC_STATUS'));
		dispatch(partiesActions.getPrograms('PROGRAMS'));
		dispatch(
			partiesActions.getVerifyBy({
				QueryParams: `columnType=kyc_verify_by&pagination=false&q=type='E'`
			})
		);

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			dispatch(partiesActions.reset());
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		if (getAlabSuccess) {
			if (getAlabSuccess?.results) {
				setAssociateOptions(getAlabSuccess?.results);
			} else {
				setAssociateOptions([]);
			}
		}
	}, [getAlabSuccess]);

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
		if (getProgramsSuccess) {
			if (getProgramsSuccess?.results) {
				let gridPopupDataFormate: any = [];
				let prevSelected: any;
				getProgramsSuccess?.results.forEach((item: any) => {
					if (pageState.values.name_mas.programs) {
						let Findinde = pageState.values.name_mas.programs.findIndex(
							(column: any) => column.seq_no === item.seq_no
						);
						if (Findinde !== -1) {
							prevSelected = true;
						} else {
							prevSelected = false;
						}
					}
					gridPopupDataFormate.push({
						seq_no: item.seq_no,
						name: item.name,
						show_value: item.show_value,
						short_value: item.short_value,
						prev_selected: prevSelected
					});
				});
				setGridConfig({
					columns: [
						{
							valueField: 'name',
							displayField: 'Name',
							uniqField: true
						},
						{
							valueField: 'short_value',
							displayField: 'Short Name'
						}
						// {
						// 	valueField: 'show_value',
						// 	displayField: 'Show Value'
						// }
					],
					data: gridPopupDataFormate
				});
			}
		}
	}, [getProgramsSuccess]);

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

						name_mas: {
							...getOneDetSuccess?.results.name_mas
						},
						name_document: getOneDetSuccess?.results.name_document,

						name_address: getOneDetSuccess?.results.name_address?.map(
							(address: any) => ({
								...address,
								action: 'update'
							})
						),
						name_contact: getOneDetSuccess?.results.name_contact,
						name_bank: getOneDetSuccess?.results.name_bank,
						name_proc: getOneDetSuccess?.results.name_proc
					}
				}));
				setGetProgramData(
					getOneDetSuccess?.results.name_mas.programs?.map(
						(program: any) => program?.name
					)
				);

				let result = JSON.parse(JSON.stringify(getOneDetSuccess?.results));
				result['name_mas']['join_date'] = dayjs(result.name_mas.join_date);
				result['name_mas']['leave_date'] = dayjs(result.name_mas.leave_date);
				result['name_document']['kyc_verify_date'] = dayjs(
					result.name_document.kyc_verify_date
				);
				result['name_document']['kyc_expiry_date'] = dayjs(
					result.name_document.kyc_expiry_date
				);

				reset(result);
				setAddressDataOptions(getOneDetSuccess?.results.name_address);
				reset(getOneDetSuccess?.results.name_address.data);

				setContactOptions(getOneDetSuccess?.results.name_contact);
				setBankOptions(getOneDetSuccess?.results.name_bank);
				setProcessOptions(getOneDetSuccess?.results.name_proc);
				setSelectedAddress({
					type:
						getOneDetSuccess?.results?.name_address.length != 0
							? getOneDetSuccess.results.name_address[0].address_type
							: 'BILLING'
				});
				setSelectedAddressType(
					getOneDetSuccess?.results?.name_address.length != 0
						? getOneDetSuccess.results.name_address[0].address_type
						: 'BILLING'
				);
			}
		}
	}, [getOneDetSuccess]);

	useEffect(() => {
		if (editMode) {
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('name_mas.name');
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
				name_mas: { name: null, is_active: true, join_date: dayjs(new Date()) } as any,
				name_document: { kyc_verify_date: null } as any
			});
			setEnableSaveButton1(false);
			setEnableSaveButton(false);
			setEnableButton(true);
			setEnableButton1(true);
			setEditMode(false);
			setSelectCellPopupData([]);
			setGetProgramData([]);
			setSelectedAddress({
				type: 'BILLING',
				data: null
			});
			setSelectedAddressType('BILLING');
			setCurrentAction('Save');
			setAddressDataOptions(null);
			setContactOptions(null);
			setBankOptions(null);
			setProcessOptions(null);
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
				name_document: { kyc_verify_date: null } as any
			});
			setEnableSaveButton1(false);
			setSelectCellPopupData([]);
			setGetProgramData([]);
			setEnableSaveButton(false);
			setEnableButton(true);
			setEnableButton1(true);
			setEditMode(false);
			setSelectedAddress({
				type: 'BILLING',
				data: null
			});
			setSelectedAddressType('BILLING');
			setCurrentAction('Save');
			setAddressDataOptions(null);
			setContactOptions(null);
			setBankOptions(null);
			setProcessOptions(null);
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
		setSelectedAddressType('BILLING');
		reset({
			name_mas: { name: null, is_active: true, join_date: dayjs(new Date()) } as any,
			name_document: { kyc_verify_date: null } as any
		});
		setAddressDataOptions([]);
		setContactOptions([]);
		setBankOptions([]);
		setProcessOptions([]);
		setSelectCellPopupData([]);
		setGetProgramData([]);

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
				name_mas: {
					action: 'insert',
					is_active: true,
					join_date: dayjs(new Date())
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

	//Associate lab
	const handleAssociateChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const AssociateVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					prf_lab: AssociateVal
				}
			}
		}));
	};

	const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
	const [popupKey, setPopupKey] = useState(0);
	const [gridConfig, setGridConfig] = useState({});
	const [isPopupVisible, setPopupVisible] = useState(false);
	const [selectCellPopupData, setSelectCellPopupData] = useState<any>([]);
	const [getProgramData, setGetProgramData] = useState<any>([]);

	const closeCellPopup = () => {
		setPopupVisible(false);
	};
	const selectCellPopupCallback = (data: any, arrName?: any) => {
		setSelectCellPopupData(data);
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				['name_mas']: {
					...pageState.values['name_mas'],
					programs: data
				}
			}
		}));
	};

	const handleGridOpen = (event: any) => {
		dispatch(partiesActions.getPrograms('PROGRAMS'));
		const cellPosition = event.target.getBoundingClientRect();
		setPopupPosition({
			x: cellPosition.left - 100,
			y: cellPosition.bottom
		});
		setPopupKey(popupKey + 1);

		setPopupVisible(true);
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

	// handle function for tabs
	const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setSelectedTab(newValue);
		setContactOptions(pageState.values?.name_contact);
		setBankOptions(pageState.values?.name_bank);
		setProcessOptions(pageState.values?.name_proc);
	};

	const handleAdd = (event: any, arrName: string) => {
		setEnableButton1(true);
		setEnableButton(true);
		setSelectedAddressType('BILLING');
		event.persist();
		setSelectCellPopupData([]);
		setGetProgramData([]);
		reset({
			name_mas: {
				name: null,
				is_active: true,
				join_date: dayjs(new Date())
			} as any,
			name_document: { kyc_verify_date: null } as any
		});
		setAddressDataOptions(null);
		setContactOptions(null);
		setBankOptions(null);
		setProcessOptions(null);

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
				[arrName]: {
					action: 'insert',
					is_active: true,
					join_date: dayjs(new Date()),
					programs: []
				},
				['name_document']: {
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
				description: 'Are you sure delete party ?',
				confirmationButtonProps: { autoFocus: true },
				confirmationText: 'Yes',
				cancellationText: 'No'
			})
				.then(() => {
					// const stateArr = deleteRow(pageState, 'seq_no', data, rowIndex);
					// return stateArr;
					dispatch(partiesActions.delete({ seq_no: pageState.values.name_mas.seq_no }));
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

	const handleVerifyChange = (newValue: any) => {
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,

					['name_document']: {
						...pageState.values['name_document'],
						kyc_verify_date: dayjs(new Date(newValue.$d)).format('YYYY-MM-DD')
					}
				}
			}));
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('name_document.kyc_verify_date');
			}, 100);
		}
	};

	const handleExpiryChange = (newValue: any) => {
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,

					['name_document']: {
						...pageState.values['name_document'],
						kyc_expiry_date: dayjs(new Date(newValue.$d)).format('YYYY-MM-DD')
					}
				}
			}));
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('name_document.kyc_expiry_date');
			}, 100);
		}
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
				['name_document']: {
					...pageState.values['name_document'],
					gst_no: gstNumber
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

	// const handleSubmit = async (event: any) => {
	// 	event.preventDefault();
	// 	const validation = await trigger();
	// 	if (validation) {
	// 		dispatch(partiesActions.add(pageState.values));
	// 	}
	// };

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

	const isAadharValid = (aadharNumber: string) => {
		return (
			aadharNumber !== null &&
			aadharNumber?.trim().length === 12 && // Ensure Aadhar number is 12 digits long
			/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/.test(aadharNumber)
		);
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		const panValid = isPanValid(pageState.values['name_document'].pan_no);
		const gstValid = isGstValid(pageState.values['name_document'].gst_no);
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
				dispatch(partiesActions.add(pageState.values));
			}
		}
	};

	const handleCancel = async (event: any) => {
		event.persist();
		setEnableSaveButton1(false);
		setEnableSaveButton(false);
		setEnableButton(true);
		setEnableButton1(true);
		setEditMode(false);
		setSelectCellPopupData([]);
		setGetProgramData([]);
		reset({
			name_mas: { name: null, is_active: true, join_date: dayjs(new Date()) } as any,
			name_document: { kyc_verify_date: null } as any
		});
		setSelectedAddress({
			type: 'BILLING',
			data: null
		});
		setSelectedAddressType('BILLING');
		setCurrentAction('Cancel');
		setAddressDataOptions([]);
		setContactOptions([]);
		setBankOptions([]);
		setProcessOptions([]);
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

	const childPropsContact = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				name_contact: array
			}
		}));
	};

	const childPropsBank = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				name_bank: array
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

	const childPropsPartys = (array: any, data?: any) => {
		dispatch(partiesActions.getOneDet(array?.seq_no));
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
								<Grid container spacing={0.5}>
									<fieldset className="fieldset-size">
										<legend>Party Details</legend>
										<Grid container>
											<Grid item xs={6} container alignItems="center">
												<Grid item xs={2}>
													<Typography variant="subtitle1">
														Name
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<TextFieldElement
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="name_mas.name"
														fullWidth
														variant="outlined"
														placeholder="Enter Name"
														onChange={handleChange}
													/>
												</Grid>
											</Grid>
											<Grid item xs={6} container alignItems="center">
												<Grid item xs={2}>
													<Typography variant="subtitle1">
														Legal Name
													</Typography>
												</Grid>
												<Grid item xs={9}>
													<TextFieldElement
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="name_mas.legal_name"
														fullWidth
														variant="outlined"
														placeholder="Enter Legal Name"
														onChange={handleChange}
													/>
												</Grid>
											</Grid>
											<Grid item xs={6} container alignItems="center">
												<Grid item xs={2}>
													<Typography variant="subtitle1">
														Short Name
													</Typography>
												</Grid>
												<Grid item xs={3.2}>
													<TextFieldElement
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="name_mas.short_name"
														fullWidth
														variant="outlined"
														placeholder="Enter Short Name"
														onChange={handleChange}
													/>
												</Grid>

												<Grid item xs={1.7} style={{ marginLeft: '42px' }}>
													<Typography variant="subtitle1">
														Party Code
													</Typography>
												</Grid>
												<Grid item xs={3.2}>
													<TextFieldElement
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="name_mas.party_code"
														fullWidth
														variant="outlined"
														placeholder="Enter Party Code"
														onChange={handleChange}
													/>
												</Grid>
											</Grid>
											<Grid item xs={6} container alignItems="center">
												<Grid item xs={1.7}>
													<Typography variant="subtitle1">
														Join Date
													</Typography>
												</Grid>
												<Grid item xs={3.2} style={{ marginLeft: '14px' }}>
													<DatePickerElement
														className={`custom-textfield ${
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
												<Grid item xs={2}>
													<Typography
														variant="subtitle1"
														style={{ marginLeft: '10px' }}>
														Leave Date
													</Typography>
												</Grid>
												<Grid item xs={0.6}>
													<CheckboxElement
														className="checkbox-hight"
														disabled={!editMode}
														name="name_mas.is_active"
														onChange={e => {
															handleCheckBoxChange(
																e,
																'name_mas.is_active'
															);
														}}
														tabIndex={-1}
													/>
												</Grid>
												<Grid item xs={3.2}>
													<DatePickerElement
														className={`custom-textfield ${
															!editMode ||
															pageState.values.name_mas?.is_active
																? 'disabled-textfield'
																: ''
														}`}
														name="name_mas.leave_date"
														format="DD-MM-YYYY"
														onChange={newValue => {
															handleLeaveDateChange(newValue);
														}}
														disabled={
															!editMode ||
															pageState.values.name_mas?.is_active
														}
														readOnly={
															!editMode ||
															pageState.values.name_mas?.is_active
														}
													/>
												</Grid>
											</Grid>

											{/* -------- CheckBox part------- */}
											{/* <fieldset style={{ borderRadius: '5px' }}> */}
											{/* <hr style={{ width: '100%' }} /> */}
											<Grid
												item
												container
												xs={11}
												alignItems="center"
												className="isactive-margin">
												<Grid item xs={1.5}>
													<CheckboxElement
														label="Supplier"
														disabled={!editMode}
														name="name_mas.supplier"
														onChange={e =>
															handleCheckBoxChange(
																e,
																'name_mas.supplier'
															)
														}
													/>
												</Grid>
												<Grid item xs={1.8}>
													<CheckboxElement
														label="Manufacturer"
														disabled={!editMode}
														name="name_mas.mfg"
														onChange={e =>
															handleCheckBoxChange(e, 'name_mas.mfg')
														}
													/>
												</Grid>
												<Grid item xs={1.8}>
													<CheckboxElement
														label="Pre Manufacturer"
														disabled={!editMode}
														name="name_mas.pre_mfg"
														onChange={e =>
															handleCheckBoxChange(
																e,
																'name_mas.pre_mfg'
															)
														}
													/>
												</Grid>
												<Grid item xs={1.2}>
													<CheckboxElement
														label="Safe"
														disabled={!editMode}
														name="name_mas.safe"
														onChange={e =>
															handleCheckBoxChange(e, 'name_mas.safe')
														}
													/>
												</Grid>
												<Grid item xs={1.2}>
													<CheckboxElement
														label="Branch"
														disabled={!editMode}
														name="name_mas.branch"
														onChange={e =>
															handleCheckBoxChange(
																e,
																'name_mas.branch'
															)
														}
													/>
												</Grid>
												<Grid item xs={1.2}>
													<CheckboxElement
														label="Broker"
														disabled={!editMode}
														name="name_mas.broker"
														onChange={e =>
															handleCheckBoxChange(
																e,
																'name_mas.broker'
															)
														}
													/>
												</Grid>
												<Grid item xs={1.2}>
													<CheckboxElement
														label="Bank"
														disabled={!editMode}
														name="name_mas.bank"
														onChange={e =>
															handleCheckBoxChange(e, 'name_mas.bank')
														}
													/>
												</Grid>

												<Grid item container xs={12} alignItems="center">
													<Grid item xs={1.5}>
														<CheckboxElement
															label="Customer"
															disabled={!editMode}
															name="name_mas.customer"
															onChange={e =>
																handleCheckBoxChange(
																	e,
																	'name_mas.customer'
																)
															}
														/>
													</Grid>
													<Grid item xs={1.8}>
														<CheckboxElement
															label="Courier"
															disabled={!editMode}
															name="name_mas.courier"
															onChange={e =>
																handleCheckBoxChange(
																	e,
																	'name_mas.courier'
																)
															}
														/>
													</Grid>
													<Grid item xs={1.8}>
														<CheckboxElement
															label="Insurance"
															disabled={!editMode}
															name="name_mas.insurance"
															onChange={e =>
																handleCheckBoxChange(
																	e,
																	'name_mas.insurance'
																)
															}
														/>
													</Grid>
													<Grid item xs={0.8}>
														<CheckboxElement
															label="Lab"
															disabled={!editMode}
															name="name_mas.lab"
															checked={pageState.values.name_mas?.lab}
															onChange={e => {
																handleCheckBoxChange(
																	e,
																	'name_mas.lab'
																);
															}}
														/>
													</Grid>

													<Grid item xs={1.2}>
														<Typography variant="subtitle1">
															Associate Lab
														</Typography>
													</Grid>
													<Grid
														item
														xs={1.2}
														className="custom-textfield">
														<AutocompleteElement
															name="name_mas.prf_lab"
															options={associateOptions}
															autocompleteProps={{
																id: 'associate',
																disabled:
																	!pageState.values.name_mas?.lab,
																clearIcon: false,

																onChange: (
																	event,
																	value,
																	reason,
																	details
																) =>
																	handleAssociateChange(
																		event,
																		value,
																		reason,
																		details,
																		'name_mas'
																	),
																getOptionLabel: option => {
																	// Regular option
																	return option.name;
																}
															}}
														/>
													</Grid>
													<Grid item xs={1.2}>
														<Typography
															variant="subtitle1"
															style={{ marginLeft: '26px' }}>
															Programs
														</Typography>
													</Grid>
													<Grid item xs={2.1}>
														<div>
															<TextField
																className={`tenderno ${
																	!editMode
																		? 'disabled-textfield'
																		: ''
																}`}
																disabled={!editMode}
																value={
																	selectCellPopupData
																		?.map(
																			(data: any) =>
																				data?.show_value
																		)
																		.join(', ') ||
																	getProgramData
																}
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
																	viewType="table_with_checkbox" // new prop for specifying the view type: 'table_with_checkbox', 'table_without_checkbox', 'list_view'
																	gridConfig={gridConfig}
																	className="partypage_tender_dropdown"
																/>
															)}
														</div>
													</Grid>
												</Grid>
											</Grid>
											{/* </fieldset> */}
										</Grid>
									</fieldset>
								</Grid>
								{/*----------------- //Address start from below ---------------- */}
								<Grid container>
									<Address
										passProps={childProps}
										selectedData={selectedAddress}
										addressOptions={addressDataOptions}
										editMode={editMode}
										currentAction={currentAction}
									/>
								</Grid>
								{/*----------------- //Documents Details start from below ---------------- */}
								<Grid container spacing={0.5}>
									<fieldset className="fieldset-size-document">
										<legend>Document Details</legend>
										<Grid container spacing={0.5}>
											<Grid
												item
												xs={4}
												spacing={0.5}
												container
												alignItems="center">
												<Grid item xs={3}>
													<Typography variant="subtitle1">
														Gst No
													</Typography>
												</Grid>
												<Grid item xs={5}>
													<TextFieldElement
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="name_document.gst_no"
														fullWidth
														variant="outlined"
														placeholder="Enter GST NO"
														// onChange={handleChange}
														onChange={handleGstChange}
													/>
												</Grid>
												<Grid xs={3}></Grid>
												<Grid item xs={3}>
													<Typography variant="subtitle1">
														Pan No
													</Typography>
												</Grid>
												<Grid item xs={5} className="error-hide-pan">
													<TextFieldElement
														ref={panInputRef}
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="name_document.pan_no"
														fullWidth
														variant="outlined"
														placeholder="Enter PAN NO"
														// onChange={handleChange}
														onChange={handlePanChange}
													/>
												</Grid>
												<Grid xs={3}></Grid>
												<Grid item xs={3}>
													<Typography variant="subtitle1">
														Vat No
													</Typography>
												</Grid>
												<Grid item xs={5}>
													<TextFieldElement
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="name_document.vat_no"
														fullWidth
														variant="outlined"
														placeholder="Enter VAT NO"
														onChange={handleChange}
													/>
												</Grid>
												<Grid xs={3}></Grid>
												<Grid item xs={3}>
													<Typography variant="subtitle1">
														Tax No
													</Typography>
												</Grid>
												<Grid item xs={5}>
													<TextFieldElement
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="name_document.tax_no"
														fullWidth
														variant="outlined"
														placeholder="Enter TAX NO"
														onChange={handleChange}
													/>
												</Grid>
											</Grid>
											<Grid
												item
												xs={4}
												spacing={0.5}
												container
												alignItems="center">
												<Grid item xs={4}>
													<Typography variant="subtitle1">
														Aadhar No
													</Typography>
												</Grid>
												<Grid item xs={5}>
													<TextFieldElement
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="name_document.aadhar_no"
														fullWidth
														variant="outlined"
														placeholder="Enter Aadhar No"
														// onChange={handleChange}
														onChange={handleAadharChange}
													/>
												</Grid>
												<Grid xs={1}></Grid>
												<Grid item xs={4}>
													<Typography variant="subtitle1">
														Kyc No
													</Typography>
												</Grid>
												<Grid item xs={5}>
													<TextFieldElement
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="name_document.kyc_no"
														fullWidth
														variant="outlined"
														placeholder="Enter Kyc No"
														onChange={handleChange}
													/>
												</Grid>
												<Grid xs={1}></Grid>
												<Grid item xs={4}>
													<Typography variant="subtitle1">
														Kyc Verify Date
													</Typography>
												</Grid>
												<Grid item xs={5}>
													<DatePickerElement
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														readOnly={!editMode}
														name="name_document.kyc_verify_date"
														format="DD-MM-YYYY"
														onChange={newValue =>
															handleVerifyChange(newValue)
														}
													/>
												</Grid>
												<Grid xs={1}></Grid>
												<Grid item xs={4}>
													<Typography variant="subtitle1">
														Kyc Verify By
													</Typography>
												</Grid>
												<Grid item xs={5}>
													<AutocompleteElement
														classname={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="name_document.kyc_verify_by"
														options={verifyOptions}
														autocompleteProps={{
															id: 'kyc_verify',
															disabled: !editMode,
															clearIcon: false,

															onChange: (
																event,
																value,
																reason,
																details
															) =>
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
											<Grid
												item
												xs={4}
												// spacing={0.5}
												container
												alignItems="center">
												<Grid item xs={4}>
													<Typography variant="subtitle1">
														Kyc Status
													</Typography>
												</Grid>
												<Grid item xs={5}>
													<AutocompleteElement
														classname={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="name_document.kyc_status"
														options={kycsOptions}
														autocompleteProps={{
															id: 'kycs',
															disabled: !editMode,
															clearIcon: false,

															onChange: (
																event,
																value,
																reason,
																details
															) =>
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
												<Grid xs={1}></Grid>
												<Grid item xs={4}>
													<Typography variant="subtitle1">
														Kyc Expiry Date
													</Typography>
												</Grid>
												<Grid item xs={5}>
													<DatePickerElement
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														readOnly={!editMode}
														name="name_document.kyc_expiry_date"
														format="DD-MM-YYYY"
														onChange={newValue =>
															handleExpiryChange(newValue)
														}
													/>
												</Grid>
												<Grid xs={1}></Grid>
												<Grid item xs={4}>
													<Typography
														variant="subtitle1"
														className="commentstop">
														Kyc Comments
													</Typography>
												</Grid>
												<Grid item xs={8}>
													<TextFieldElement
														multiline
														rows={1}
														className={`custom-textfieldcomments ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="name_document.kyc_comments"
														fullWidth
														variant="outlined"
														placeholder="Enter Comments"
														onChange={handleChange}
													/>
												</Grid>
											</Grid>
										</Grid>
									</fieldset>
								</Grid>

								<Grid item className="address">
									<div id="Address-div-blank">
										{addressOptions?.map((addr: any, index?: any) => {
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

								{/* ---------------Tab start from below-------------- */}

								<div className="marginTop">
									<Paper>
										<Tabs value={selectedTab} onChange={handleTabChange}>
											<Tab label="contact" />
											<Tab label="bank details" />
											<Tab label="process" />
										</Tabs>
									</Paper>

									{selectedTab === 0 && (
										<Contacts
											passProps={childPropsContact}
											contactOptions={contactOptions}
											currentAction={currentAction}
											editMode={editMode}
										/>
									)}
									{selectedTab === 1 && (
										<BankDetail
											passProps={childPropsBank}
											bankOptions={bankOptions}
											currentAction={currentAction}
											editMode={editMode}
										/>
									)}
									{selectedTab === 2 && (
										<Process
											passProps={childPropsProcess}
											processOptions={processOptions}
											currentAction={currentAction}
											editMode={editMode}
										/>
									)}
								</div>

								{/* --------------Footer Button start from Below -------------- */}
							</FormContainer>

							<div>
								<Grid>
									<Grid
										container
										spacing={0.5}
										className="footer-main-dev-button">
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
													handleAdd(e, 'name_mas');
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
													handleUpdate(e, 'name_mas');
													// handleUpdate(e, 'name_address');
												}}
												tabIndex={-1}>
												Edit
											</Button>
										</Grid>
										<Grid item xs={0.85} className="address-btn">
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
										<Grid item xs={0.85} className="address-btn">
											<Button
												style={{ outline: 'none' }}
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
											component={Partys}
											handleDrawerToggle={handleDrawerToggle}
											passProps={childPropsPartys}
											setEnableButton1={setEnableButton1}
										/>
									)}
								</Grid>
							</div>
						</MainCard>
					</Box>
				</div>
			</div>
		</>
	);
}

export default Party;
