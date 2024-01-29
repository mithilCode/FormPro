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
	Radio,
	RadioGroup,
	FormControlLabel,
	Typography,
	CircularProgress
} from '@mui/material';

import dayjs from 'dayjs';

import {
	AutocompleteElement,
	CheckboxElement,
	DatePickerElement,
	// AutocompleteElement,
	FormContainer,
	TextFieldElement,
	TimePickerElement
} from '@app/components/rhfmui';

import { FormSchema, IFormInput } from '@pages/master/packetcreation/models/PacketCreation';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfiniteDrawer } from '@components/drawer';
import { InitialState } from '@utils/helpers';

import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { usePacketcreationsSlice } from '@pages/master/packetcreation/store/slice';
import { packetcreationsSelector } from '@pages/master/packetcreation/store/slice/packetcreations.selectors';
import { useDepartmentSlice } from '@pages/master/departments/store/slice';
import { departmentSelector } from '@pages/master/departments/store/slice/department.selectors';
import { useTenderSlice } from '@pages/master/tenders/store/slice';

import useFocusOnEnter from '@hooks/useFocusOnEnter';
import { useConfirm } from 'material-ui-confirm';
import PacketCreationDetail from './PacketCreationDetail';
import PacketCreations from './PacketCreations';

// import '@pages/master/party/sections/party.css';
import './packetcreation.css';
import { tenderSelector } from '@pages/master/tenders/store/slice/tender.selectors';
import { empsSelector } from '@pages/master/emp/store/slice/emps.selectors';
import { useEmpsSlice } from '@pages/master/emp/store/slice';

import { kapansActions, useKapansSlice } from '@pages/master/kapan/store/slice';
import { kapansSelector } from '@pages/master/kapan/store/slice/kapans.selectors';

function PacketCreation() {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: packetcreationsActions } = usePacketcreationsSlice();
	const { actions: departmentActions } = useDepartmentSlice();
	const { actions: tenderActions } = useTenderSlice();
	const { actions } = useSnackBarSlice();
	const { actions: kapansActions } = useKapansSlice();

	// *** packetCreation State *** //
	const packetcreationsState = useSelector(packetcreationsSelector);
	const { getOneDetSuccess, addSuccess, deleteSuccess } = packetcreationsState;

	// kapan state
	// *** kapan State *** //
	const kapansState = useSelector(kapansSelector);
	const { getSuccess } = kapansState;

	// getSupplierSuccess

	// *** Department State *** //
	const departmentState = useSelector(departmentSelector);
	const { getSuccess: getDepartmentSuccess } = departmentState;

	// *** PartyName State *** //
	const tenderState = useSelector(tenderSelector);
	const { getSupplierSuccess } = tenderState;

	const { actions: empsActions } = useEmpsSlice();

	// *** Process State *** //
	const empsState = useSelector(empsSelector);
	const { getProcSuccess } = empsState;

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
		trigger
	} = formContext;

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});

	//add your reference
	const formRef = useRef();

	const { onEnterKey } = useFocusOnEnter(formRef, formContext.formState.errors);

	const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false);

	const [editMode, setEditMode] = useState<boolean>(false);
	const [enableButton, setEnableButton] = useState<boolean>(true);
	const [enableButton1, setEnableButton1] = useState<boolean>(true);
	const [enableSaveButton, setEnableSaveButton] = useState(false);
	const [, setEnableSaveButton1] = useState<boolean>(false); // enableSaveButton1

	const [packetCreationOptions, setPacketCreationOptions] = useState<any>([]);
	const [packetDetailOptions, setPacketDetailOptions] = useState<any>([]);
	const [currentAction, setCurrentAction] = useState('');
	const [deptOptions, setDeptOptions] = useState([]);
	const [supplierOptions, setSupplierOptions] = useState([]);
	const [processOptions, setProcessOptions] = useState([]);
	const [kapanOptions, setKapanOptions] = useState([]);
	const [chkRadioOptions, setChkRadioOptions] = useState(1);

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
		dispatch(
			packetcreationsActions.get({
				QueryParams: `columnType=kyc_verify_by&pagination=false&q=type='E'`
			})
		);

		dispatch(
			departmentActions.get({
				QueryParams: `columnType=dept&pagination=false&q=type='D'`
			})
		);

		dispatch(tenderActions.getSupplier({ QueryParams: `pagination=false&q=supplier='true'` }));

		dispatch(
			empsActions.getProc({
				QueryParams: `page=1&limit=11&pagination=false`
			})
		);

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			dispatch(packetcreationsActions.reset());
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		dispatch(kapansActions.get({ QueryParams: 'page=1&limit=11&pagination=true' }));
		return () => {
			dispatch(kapansActions.reset());
		};
	}, []);

	useEffect(() => {
		if (getSuccess) {
			if (getSuccess?.results && getSuccess?.results.length > 0) {
				setKapanOptions(getSuccess?.results);
			} else {
				setKapanOptions([]);
			}
		}
	}, [getSuccess]);

	useEffect(() => {
		if (getDepartmentSuccess) {
			if (getDepartmentSuccess?.results) {
				setDeptOptions(getDepartmentSuccess?.results);
			} else {
				setDeptOptions([]);
			}
		}
	}, [getDepartmentSuccess]);

	useEffect(() => {
		if (getSupplierSuccess) {
			if (getSupplierSuccess?.results) {
				setSupplierOptions(getSupplierSuccess?.results);
			} else {
				setSupplierOptions([]);
			}
		}
	}, [getSupplierSuccess]);

	useEffect(() => {
		if (getProcSuccess) {
			if (getProcSuccess?.results) {
				setProcessOptions(getProcSuccess?.results);
			} else {
				setProcessOptions([]);
			}
		}
	}, [getProcSuccess]);

	useEffect(() => {
		if (getOneDetSuccess) {
			if (getOneDetSuccess?.results) {
				setPageState(pageState => ({
					...pageState,
					values: {
						...pageState.values,

						inv_mas: {
							...getOneDetSuccess?.results.inv_mas
						},
						dia_para: {
							...getOneDetSuccess?.results.dia_para
						},
						inv_det: {
							...getOneDetSuccess?.results.inv_det
						}
					}
				}));

				let result = JSON.parse(JSON.stringify(getOneDetSuccess?.results));
				result['inv_mas']['trans_date'] = dayjs(result.inv_mas.join_date);
				reset(result);

				setPacketCreationOptions(getOneDetSuccess?.results.inv_mas);
				let mergeObjects = getOneDetSuccess?.results.inv_det.map((seqNo: any) => {
					const matchingSeqNo = getOneDetSuccess?.results.dia_para.find((detSeq: any) => {
						return detSeq.det_seq === seqNo.seq_no;
					});
					return { ...seqNo, ...matchingSeqNo };
				});
				setPacketDetailOptions(mergeObjects);
			}
		}
	}, [getOneDetSuccess]);

	useEffect(() => {
		if (editMode) {
			const timeout = setTimeout(() => {
				clearTimeout(timeout);
				setFocus('inv_mas.invoice_no');
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
				inv_mas: { name: null, is_active: true, join_date: dayjs(new Date()) } as any
			});
			setEnableSaveButton1(false);
			setEnableSaveButton(false);
			setEnableButton(true);
			setEnableButton1(true);
			setEditMode(false);

			setCurrentAction('Save');

			setPacketCreationOptions(null);

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
				inv_mas: { seq_no: null, join_date: dayjs(new Date()) } as any
			});
			setEnableSaveButton1(false);
			setEnableSaveButton(false);
			setEnableButton(true);
			setEnableButton1(true);
			setEditMode(false);

			setCurrentAction('Save');

			setPacketCreationOptions(null);

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
			inv_mas: { name: null, is_active: true, join_date: dayjs(new Date()) } as any
		});

		setPacketCreationOptions([]);

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
		reset({
			inv_mas: { seq_no: -1 * Math.floor(Math.random() * 100 + 10000) } as any
		});

		setPacketCreationOptions(null);

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
					seq_no: -1 * Math.floor(Math.random() * 100 + 10000)
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
				description: 'Are you sure delete invoice ?',
				confirmationButtonProps: { autoFocus: true },
				confirmationText: 'Yes',
				cancellationText: 'No'
			})
				.then(() => {
					dispatch(
						packetcreationsActions.delete({ seq_no: pageState.values.inv_mas.seq_no })
					);
				})
				.catch(() => {
					/* */
				});
		}
	};

	const handleDeptChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const deptVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					inv_type: deptVal
				}
			}
		}));
	};

	const handlePartyChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const partyVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					from: partyVal
				}
			}
		}));
	};

	const handleProcessChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		const processVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
		};
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				[arrName]: {
					...pageState.values[arrName],
					proc: processVal
				}
			}
		}));
	};
	const handleKapanChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined,
		arrName: any
	) => {
		// const processVal = {
		// 	show_value: newValue && newValue.show_value ? newValue.show_value : null,
		// 	name: newValue && newValue.name ? newValue.name : ''
		// };
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				kapan_no: newValue?.kapan_no
			}
		}));
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

	useEffect(() => {
		console.log(pageState.values, 'pagestate');
	}, [pageState]);

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

	const handleRadioChange = (event: any) => {
		event.persist();
		setChkRadioOptions(Number(event.target.value));
		setPageState(value => ({
			...value,
			values: {
				...pageState.values,
				[event.target.name]: { seq_no: Number(event.target.value) }
			}
		}));
		// const splitEleName = event.target.name.split('.');
		// if (splitEleName.length > 1) {
		// 	const objName = splitEleName[0];
		// 	const eleName = splitEleName[1];

		// 	setPageState(value => ({
		// 		...value,
		// 		values: {
		// 			...pageState.values,
		// 			[objName]: {
		// 				...pageState.values[objName],
		// 				[eleName]:
		// 					event.target.type === 'checkbox'
		// 						? event.target.checked
		// 						: event.target.value.toUpperCase()
		// 			}
		// 		}
		// 	}));
		// } else {
		// 	setPageState(value => ({
		// 		...value,
		// 		values: {
		// 			...pageState.values,
		// 			[event.target.name]:
		// 				event.target.type === 'checkbox'
		// 					? event.target.checked
		// 					: event.target.value.toUpperCase()
		// 		}
		// 	}));
		// }
	};
	// const onSubmit = async () => {};

	const handleSubmit = async (event: any) => {
		// event.preventDefault();
		// const validation = await trigger();
		// if (validation) {
		// 	dispatch(packetcreationsActions.add(pageState.values));
		// }
		dispatch(packetcreationsActions.add(pageState.values));
	};

	const handleCancel = async (event: any) => {
		event.persist();
		setEnableSaveButton1(false);
		setEnableSaveButton(false);
		setEnableButton(true);
		setEnableButton1(true);
		setEditMode(false);
		reset({
			inv_mas: { trans_date: dayjs(new Date()) } as any
		});

		setCurrentAction('Cancel');
		setPacketCreationOptions([]);

		//reset()
		setPageState({
			isValid: false,
			values: {},
			touched: null,
			errors: null
		});
	};

	const diaSeq = pageState.values?.inv_mas?.seq_no;
	const [invDetSeqNo, setInvDetSeqNo] = useState(Math.floor(Math.random() * 100 + 10000) * -1);

	const childPropsPacketDetail = (array: any) => {
		setInvDetSeqNo(invDetSeqNo);
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				dia_para: array,
				inv_det: array.map((item: any, index: number) => ({
					...item,
					seq_no: item.action === 'update' ? item.seq_no : invDetSeqNo + index,
					inv_seq: diaSeq
				}))
			}
		}));
	};

	const childPropsCreation = (array: any, data?: any) => {
		dispatch(packetcreationsActions.getOneDet(array?.seq_no));
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
							<Grid container>
								{/* <div className="checkbox-box">
									<CheckboxElement
										label="Single Spliting"
										disabled={!editMode}
										name="inv_mas.mfg"
										onChange={e => handleCheckBoxChange(e, 'inv_mas.mfg')}
									/>
									<CheckboxElement
										label="Job Work Inward"
										disabled={!editMode}
										name="inv_mas.mfg"
										onChange={e => handleCheckBoxChange(e, 'inv_mas.mfg')}
									/>
									<CheckboxElement
										label="Reparing Inward"
										disabled={!editMode}
										name="inv_mas.mfg"
										onChange={e => handleCheckBoxChange(e, 'inv_mas.mfg')}
									/>
								</div> */}
								<RadioGroup
									row
									aria-labelledby="demo-row-radio-buttons-group-label"
									name="trans_type"
									style={{ margin: 'auto', display: 'block' }}
									onChange={handleRadioChange}>
									<FormControlLabel
										checked={chkRadioOptions === 1}
										value={1}
										control={<Radio />}
										label="Single Spliting"
									/>
									<FormControlLabel
										checked={chkRadioOptions === 2}
										value={2}
										control={<Radio />}
										label="Job Work Inward"
									/>
									<FormControlLabel
										checked={chkRadioOptions === 3}
										value={3}
										control={<Radio />}
										label="Reparing Inward"
									/>
								</RadioGroup>
								<fieldset className="fieldset-size-packet">
									{/* <legend>Invoice</legend>  */}
									<Grid container spacing={0.5}>
										<Grid item xs={6}>
											<Grid container alignItems="center">
												<Grid item xs={1.48}>
													<Typography variant="subtitle1">
														Trans ID
													</Typography>
												</Grid>
												<Grid item xs={2}>
													<TextFieldElement
														id="type"
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="inv_mas.seq_no"
														fullWidth
														onChange={handleChange}
													/>
												</Grid>
											</Grid>
										</Grid>

										<Grid item xs={6}>
											<Grid container alignItems="center">
												<Grid item xs={1.8}>
													<Typography variant="subtitle1">
														Date
													</Typography>
												</Grid>
												<Grid item xs={2.3}>
													<DatePickerElement
														name="inv_mas.trans_date"
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														readOnly={!editMode}
														disabled={!editMode}
														format="DD-MM-YYYY"
														onChange={newValue =>
															handleTransDateChange(newValue)
														}
													/>
												</Grid>
												<Grid item xs={1.2}>
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
												<Grid item xs={1.48}>
													<Typography variant="subtitle1">
														Dept Name
													</Typography>
												</Grid>
												<Grid item xs={4}>
													<AutocompleteElement
														classname={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="inv_mas.inv_type "
														options={deptOptions}
														autocompleteProps={{
															id: 'dept',
															disabled: !editMode,
															clearIcon: false,

															onChange: (
																event,
																value,
																reason,
																details
															) =>
																handleDeptChange(
																	event,
																	value,
																	reason,
																	details,
																	'inv_mas'
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
										<Grid item xs={6}>
											<Grid container alignItems="center">
												<Grid item xs={1.8}>
													<Typography variant="subtitle1">
														Party Name
													</Typography>
												</Grid>
												<Grid item xs={4}>
													<AutocompleteElement
														classname={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="inv_mas.from"
														options={supplierOptions}
														autocompleteProps={{
															id: 'suppl',
															disabled: !editMode,
															clearIcon: false,

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
																	details,
																	'inv_mas'
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
										<Grid item xs={6}>
											<Grid container alignItems="center">
												<Grid item xs={1.48}>
													<Typography variant="subtitle1">
														Process
													</Typography>
												</Grid>
												<Grid item xs={3}>
													<AutocompleteElement
														classname={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="inv_mas.proc"
														options={processOptions}
														autocompleteProps={{
															id: 'process',
															disabled: !editMode,
															clearIcon: false,

															onChange: (
																event,
																value,
																reason,
																details
															) =>
																handleProcessChange(
																	event,
																	value,
																	reason,
																	details,
																	'inv_mas'
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
										<Grid item xs={6}>
											<Grid container alignItems="center">
												<Grid item xs={1.8}>
													<Typography variant="subtitle1">
														Jangad No
													</Typography>
												</Grid>
												<Grid item xs={2}>
													<TextFieldElement
														id="type"
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="inv_mas.jangad_no"
														fullWidth
														onChange={handleChange}
													/>
												</Grid>
											</Grid>
										</Grid>

										<Grid item xs={6}>
											<Grid container alignItems="center">
												<Grid item xs={1.48}>
													<Typography variant="subtitle1">
														Comments
													</Typography>
												</Grid>
												<Grid item xs={5}>
													<TextFieldElement
														id="comment"
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="inv_mas.comments"
														fullWidth
														onChange={handleChange}
													/>
												</Grid>
											</Grid>
										</Grid>

										<Grid item xs={6}>
											<Grid container alignItems="center">
												<Grid item xs={1.8}>
													<Typography variant="subtitle1">
														Jangad Value
													</Typography>
												</Grid>
												<Grid item xs={3}>
													<TextFieldElement
														id="comment"
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="inv_mas.jangad_value"
														fullWidth
														onChange={handleChange}
													/>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</fieldset>
								<fieldset className="fieldset-size-packet">
									{/* <legend>Invoice</legend>  */}
									<Grid container spacing={0.5}>
										<Grid item xs={3}>
											<Grid container alignItems="center">
												<Grid item xs={3}>
													<Typography variant="subtitle1">
														Kapan No
													</Typography>
												</Grid>
												<Grid item xs={4}>
													<AutocompleteElement
														classname={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														name="kapan_no "
														options={kapanOptions}
														autocompleteProps={{
															id: 'dept',
															disabled: !editMode,
															clearIcon: false,

															onChange: (
																event,
																value,
																reason,
																details
															) =>
																handleKapanChange(
																	event,
																	value,
																	reason,
																	details,
																	'inv_mas'
																),
															getOptionLabel: option => {
																// Regular option
																return option.kapan_no;
															}
														}}
													/>
												</Grid>
											</Grid>
										</Grid>
										<Grid item xs={3}>
											<Grid container alignItems="center">
												<Grid item xs={3}>
													<Typography variant="subtitle1">
														Pieces
													</Typography>
												</Grid>
												<Grid item xs={3}>
													<TextFieldElement
														id="type"
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="inv_det.pcs"
														fullWidth
														//onChange={handleChange}
													/>
												</Grid>
											</Grid>
										</Grid>
										<Grid item xs={3}>
											<Grid container alignItems="center">
												<Grid item xs={3}>
													<Typography variant="subtitle1">
														Weight
													</Typography>
												</Grid>
												<Grid item xs={3}>
													<TextFieldElement
														id="type"
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="inv_det.wgt"
														fullWidth
														//onChange={handleChange}
													/>
												</Grid>
											</Grid>
										</Grid>
										<Grid item xs={3}></Grid>

										<Grid item xs={3}>
											<Grid container alignItems="center">
												<Grid item xs={3}>
													<Typography variant="subtitle1">
														Loss Weight
													</Typography>
												</Grid>
												<Grid item xs={4}>
													<TextFieldElement
														id="type"
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="type"
														fullWidth
														// onChange={handleChange}
													/>
												</Grid>
											</Grid>
										</Grid>
										<Grid item xs={3}>
											<Grid container alignItems="center">
												<Grid item xs={3}>
													<Typography variant="subtitle1">
														Bal Pieces
													</Typography>
												</Grid>
												<Grid item xs={3}>
													<TextFieldElement
														id="type"
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="type"
														fullWidth
														// onChange={handleChange}
													/>
												</Grid>
											</Grid>
										</Grid>
										<Grid item xs={3}>
											<Grid container alignItems="center">
												<Grid item xs={3}>
													<Typography variant="subtitle1">
														Bal Weight
													</Typography>
												</Grid>
												<Grid item xs={3}>
													<TextFieldElement
														id="type"
														className={`custom-textfield ${
															!editMode ? 'disabled-textfield' : ''
														}`}
														disabled={!editMode}
														name="type"
														fullWidth
														// onChange={handleChange}
													/>
												</Grid>
											</Grid>
										</Grid>
										<Grid item xs={3}></Grid>
									</Grid>
								</fieldset>
							</Grid>
							{/* <fieldset className="fieldset-size-invoice">
								<legend>Invoice Details</legend> */}
							<div className="fieldset-size-packet">
								<PacketCreationDetail
									passProps={childPropsPacketDetail}
									packetCreationOptions={packetDetailOptions}
									currentAction={currentAction}
									editMode={editMode}
									diaSeq={invDetSeqNo}
								/>
							</div>
							{/* </fieldset> */}

							{/* --------------Footer Button start from Below -------------- */}
						</FormContainer>
						<Grid>
							<Grid container spacing={0.5} className="footer-main-dev-button">
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
											handleAdd(e, 'inv_mas');
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
											handleUpdate(e, 'inv_mas');
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
										variant={enableButton ? 'outlined' : 'contained'}
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
									component={PacketCreations}
									handleDrawerToggle={handleDrawerToggle}
									passProps={childPropsCreation}
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

export default PacketCreation;
