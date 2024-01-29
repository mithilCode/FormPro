import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	Button,
	CircularProgress,
	createFilterOptions,
	FilterOptionsState,
	Grid,
	Stack,
	Typography,
	Box
} from '@mui/material';

import { AutocompleteElement, FormContainer, TextFieldElement } from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { zodResolver } from '@hookform/resolvers/zod';
import useThrottle from '@hooks/useThrottle';
import { InitialState } from '@utils/helpers';
import { FormSchema, IFormInput } from '../models/Appointment';
import { useAppointmentSlice } from '../store/slice';
import { appointmentSelector } from '../store/slice/appointment.selectors';
import { appointmentState } from '../store/slice/types';
import './appointment.css';
const countryFilter = createFilterOptions();
import { useHotkeys } from 'react-hotkeys-hook';
import useFocusOnEnter from '@hooks/useFocusOnEnter';

// ***==============================|| APPOINTMENT ||==============================*** //

interface Props {
	passProps?: any;
	handleDrawerToggle?: any;
	edit?: boolean;
	selectedData?: any;
}

const Appointment = ({ passProps, handleDrawerToggle, edit, selectedData }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const { actions: appointmentActions } = useAppointmentSlice();
	const { actions } = useSnackBarSlice();

	// *** appointment State *** //
	const appointmentState = useSelector(appointmentSelector);
	const {
		addError,
		addSuccess,
		editError,
		editSuccess,
		getOneSuccess,
		getSupplierSuccess,
		getSupplierError,
		getTenderNoSuccess,
		getTenderNoError,
		getTenderNoSelectSuccess,
		getAttendeeSuccess,
		getAttendeeError
	} = appointmentState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		formState: { errors, isSubmitting },
		reset,
		setValue,
		trigger,
		setFocus
	} = formContext;

	// add your appointment state  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});
	useHotkeys('alt+s', event => {
		event.preventDefault();
		buttonRef.current.click();
	});

	//add your reference
	const formRef = useRef();

	const { onFirstElementFocus, onEnterKey } = useFocusOnEnter(
		formRef,
		formContext.formState.errors
	);

	const [supplierLoading, setSupplierLoading] = useState(false);
	const [supplierInputValue, setSupplierInputValue] = useState('');
	const [supplierOptions, setSupplierOptions] = useState<appointmentState[]>([]);
	const throttledInputSupplierValue = useThrottle(supplierInputValue, 400);

	const [tenderNoLoading, setTenderNoLoading] = useState(false);
	const [tenderNoInputValue, setTenderNoInputValue] = useState('');
	const [tenderNoOptions, setTenderNoOptions] = useState<appointmentState[]>([]);
	const throttledInputTenderNoValue = useThrottle(tenderNoInputValue, 400);

	const [attendeeLoading, setAttendeeLoading] = useState(false);
	const [attendeeInputValue, setAttendeeInputValue] = useState('');
	const [attendeeOptions, setAttendeeOptions] = useState<appointmentState[]>([]);
	const throttledInputAttendeeValue = useThrottle(attendeeInputValue, 400);

	const [attendeeTwoLoading, setAttendeeTwoLoading] = useState(false);
	const [attendeeTwoInputValue, setAttendeeTwoInputValue] = useState('');
	const [attendeeTwoOptions, setAttendeeTwoOptions] = useState<appointmentState[]>([]);
	const throttledInputAttendeeTwoValue = useThrottle(attendeeTwoInputValue, 400);

	const [attendeeThreeLoading, setAttendeeThreeLoading] = useState(false);
	const [attendeeThreeInputValue, setAttendeeThreeInputValue] = useState('');
	const [attendeeThreeOptions, setAttendeeThreeOptions] = useState<appointmentState[]>([]);
	const throttledInputAttendeeThreeValue = useThrottle(attendeeThreeInputValue, 400);

	const [attendeeFourLoading, setAttendeeFourLoading] = useState(false);
	const [attendeeFourInputValue, setAttendeeFourInputValue] = useState('');
	const [attendeeFourOptions, setAttendeeFourOptions] = useState<appointmentState[]>([]);
	const throttledInputAttendeeFourValue = useThrottle(attendeeFourInputValue, 400);

	useEffect(() => {
		if (edit) {
			dispatch(appointmentActions.getOne(selectedData));
		}
		const timer = setTimeout(() => {
			clearTimeout(timer);
			onFirstElementFocus();
		}, 500);

		return () => {
			dispatch(appointmentActions.reset());
			reset();
		};
	}, []);

	// *** REDUCER *** //

	// *** SUPPLIER *** //
	useEffect(() => {
		if (getSupplierSuccess) {
			if (getSupplierSuccess?.results) {
				setSupplierOptions(getSupplierSuccess?.results);
			} else {
				setSupplierOptions([]);
			}
		}
		if (getSupplierError) {
			setSupplierOptions([]);
		}
		setSupplierLoading(false);
	}, [getSupplierError, getSupplierSuccess]);

	useEffect(() => {
		dispatch(appointmentActions.reset());
		if (throttledInputSupplierValue === '' && pageState?.touched?.supplier) {
			setSupplierLoading(true);
			dispatch(
				appointmentActions.getSupplier({
					QueryParams: `pagination=false&q=supplier='true'`
				})
			);
			return undefined;
		} else if (throttledInputSupplierValue !== '') {
			setSupplierLoading(true);
			dispatch(
				appointmentActions.getSupplier({
					QueryParams: `q=supplier = 'True' and name like '%${throttledInputSupplierValue}%'`
				})
			);
		}
	}, [throttledInputSupplierValue]);

	// *** ATTENDEE *** //
	useEffect(() => {
		if (getAttendeeSuccess) {
			if (getAttendeeSuccess?.results) {
				setAttendeeOptions(getAttendeeSuccess?.results);
			} else {
				setAttendeeOptions([]);
			}
		}
		if (getAttendeeError) {
			setAttendeeOptions([]);
		}
		setAttendeeLoading(false);
	}, [getAttendeeError, getAttendeeSuccess]);

	useEffect(() => {
		dispatch(appointmentActions.reset());
		if (throttledInputAttendeeValue === '' && pageState?.touched?.attendeeOne) {
			setAttendeeLoading(true);
			dispatch(
				appointmentActions.getAttendee({
					QueryParams: `pagination=false&q=type='E'`
				})
			);
			return undefined;
		} else if (throttledInputAttendeeValue !== '') {
			setAttendeeLoading(true);
			dispatch(
				appointmentActions.getAttendee({
					QueryParams: `q=type='E'and name like '%${throttledInputAttendeeValue}%'`
				})
			);
		}
	}, [throttledInputAttendeeValue]);

	useEffect(() => {
		if (getAttendeeSuccess) {
			if (getAttendeeSuccess?.results) {
				setAttendeeTwoOptions(getAttendeeSuccess?.results);
			} else {
				setAttendeeTwoOptions([]);
			}
		}
		if (getAttendeeError) {
			setAttendeeTwoOptions([]);
		}
		setAttendeeTwoLoading(false);
	}, [getAttendeeError, getAttendeeSuccess]);

	useEffect(() => {
		dispatch(appointmentActions.reset());
		if (throttledInputAttendeeTwoValue === '' && pageState?.touched?.attendeeTwo) {
			setAttendeeTwoLoading(true);
			dispatch(
				appointmentActions.getAttendee({
					QueryParams: `pagination=false&q=type='E'`
				})
			);
			return undefined;
		} else if (throttledInputAttendeeTwoValue !== '') {
			setAttendeeTwoLoading(true);
			dispatch(
				appointmentActions.getAttendee({
					QueryParams: `q=type='E'and name like '%${throttledInputAttendeeTwoValue}%'`
				})
			);
		}
	}, [throttledInputAttendeeTwoValue]);

	useEffect(() => {
		if (getAttendeeSuccess) {
			if (getAttendeeSuccess?.results) {
				setAttendeeThreeOptions(getAttendeeSuccess?.results);
			} else {
				setAttendeeThreeOptions([]);
			}
		}
		if (getAttendeeError) {
			setAttendeeThreeOptions([]);
		}
		setAttendeeThreeLoading(false);
	}, [getAttendeeError, getAttendeeSuccess]);

	useEffect(() => {
		dispatch(appointmentActions.reset());
		if (
			throttledInputAttendeeThreeValue === '' &&
			pageState?.touched?.attendeegetAttendeeSuccessThree
		) {
			setAttendeeThreeLoading(true);
			dispatch(
				appointmentActions.getAttendee({
					QueryParams: `pagination=false&q=type='E'`
				})
			);
			return undefined;
		} else if (throttledInputAttendeeThreeValue !== '') {
			setAttendeeThreeLoading(true);
			dispatch(
				appointmentActions.getAttendee({
					QueryParams: `q=type='E'and name like '%${throttledInputAttendeeThreeValue}%'`
				})
			);
		}
	}, [throttledInputAttendeeThreeValue]);

	useEffect(() => {
		if (getAttendeeSuccess) {
			if (getAttendeeSuccess?.results) {
				setAttendeeFourOptions(getAttendeeSuccess?.results);
			} else {
				setAttendeeFourOptions([]);
			}
		}
		if (getAttendeeError) {
			setAttendeeFourOptions([]);
		}
		setAttendeeFourLoading(false);
	}, [getAttendeeError, getAttendeeSuccess]);

	useEffect(() => {
		dispatch(appointmentActions.reset());
		if (throttledInputAttendeeFourValue === '' && pageState?.touched?.attendeeFour) {
			setAttendeeFourLoading(true);
			dispatch(
				appointmentActions.getAttendee({
					QueryParams: `pagination=false&q=type='E'`
				})
			);
			return undefined;
		} else if (throttledInputAttendeeFourValue !== '') {
			setAttendeeFourLoading(true);
			dispatch(
				appointmentActions.getAttendee({
					QueryParams: `q=type='E'and name like '%${throttledInputAttendeeFourValue}%'`
				})
			);
		}
	}, [throttledInputAttendeeFourValue]);

	useEffect(() => {
		if (getTenderNoSuccess) {
			if (getTenderNoSuccess?.results) {
				setTenderNoOptions(getTenderNoSuccess?.results);
			} else {
				setTenderNoOptions([]);
			}
		}
		if (getTenderNoError) {
			setTenderNoOptions([]);
		}
		setTenderNoLoading(false);
	}, [getTenderNoError, getTenderNoSuccess]);

	useEffect(() => {
		dispatch(appointmentActions.reset());
		if (throttledInputTenderNoValue === '' && pageState?.touched?.tender) {
			setTenderNoLoading(true);
			dispatch(
				appointmentActions.getTenderNo({
					QueryParams: `page=1&limit=5000000&pagination=false`
				})
			);
			return undefined;
		} else if (throttledInputTenderNoValue !== '') {
			setTenderNoLoading(true);
			dispatch(
				appointmentActions.getTenderNo({ QueryParams: `q=${throttledInputTenderNoValue}` })
			);
		}
	}, [throttledInputTenderNoValue]);

	useEffect(() => {
		if (getTenderNoSelectSuccess) {
			if (getTenderNoSelectSuccess?.results) {
				setPageState(pageState => ({
					...pageState,
					values: {
						...pageState.values,
						tender_name: getTenderNoSelectSuccess.tender_name,
						comments: getTenderNoSelectSuccess?.results.comments
					},
					touched: {
						...pageState.touched,
						tender: true
					}
				}));
			}
			reset(getTenderNoSelectSuccess?.results);
		}
	}, [getTenderNoSelectSuccess]);

	useEffect(() => {
		if (addSuccess || editSuccess) {
			passProps({
				type: addSuccess ? 'ADD' : 'EDIT',
				data: addSuccess ? addSuccess : editSuccess
			});

			dispatch(
				actions.openSnackbar({
					open: true,
					message: addSuccess
						? 'Appointment add successfully.'
						: 'Appointment edit successfully.',
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

			if (addSuccess) {
				dispatch(appointmentActions.reset());
				const timer = setTimeout(() => {
					clearTimeout(timer);
					handleDrawerToggle();
				}, 500);
				reset();
			} else if (editSuccess) {
				const timer = setTimeout(() => {
					clearTimeout(timer);
					handleDrawerToggle();
				}, 500);
			}
		}
	}, [addSuccess, editSuccess]);

	useEffect(() => {
		if (addError || editError) {
			const { message } =
				addError && addError.error
					? addError.error
					: editError && editError.error
					? editError.error
					: '';

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

			if (addError) {
			}
		}
	}, [addError, editError]);

	useEffect(() => {
		if (getOneSuccess?.results) {
			setPageState({
				isValid: false,
				values: getOneSuccess?.results,
				touched: {},
				errors: {}
			});
			reset(getOneSuccess?.results);
		}
	}, [getOneSuccess]);

	useEffect(() => {
		const firstError = (Object.keys(errors) as Array<keyof typeof errors>).reduce<
			keyof typeof errors | null
		>((field, a) => {
			const fieldKey = field as keyof typeof errors;
			return errors[fieldKey] ? fieldKey : a;
		}, null);

		if (firstError) {
		}
	}, [errors, setFocus]);

	// // *** EVENT HANDDLERS  👿 add your Event Handler ..., handleChange, OnSubmit  👿
	useEffect(() => {
		console.log(pageState.values, 'pageState.valuespageState.values');
	}, [pageState]);

	const onClose = () => {
		handleDrawerToggle();
		// // setTenderNoOptions([]);
		// reset(pageState.values);
		// setPageState({
		// 	isValid: false,
		// 	values: {},
		// 	touched: null,
		// 	errors: null
		// });
	};

	const handleFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = countryFilter(options, state);
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
				appointmentActions.getSupplier({ QueryParams: `pagination=false&q=supplier='true` })
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
			dispatch(appointmentActions.getTenderNoSelect({ QueryParams: `${newValue.seq_no}` }));
			setPageState(pageState => ({
				...pageState,
				values: {
					...pageState.values,
					tender: {
						seq_no: newValue.seq_no,
						name: newValue.name
					}
				},
				touched: {
					...pageState.touched,
					tender: true
				}
			}));
		} else {
			newValue = '';
			reset(newValue);
		}

		if (!newValue) {
			dispatch(
				appointmentActions.getTenderNo({
					QueryParams: `page=1&limit=5000000&pagination=false`
				})
			);
		}
	};

	const handleAttendeeChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		if (
			newValue &&
			(newValue.name === pageState.values.attendee_2?.name ||
				newValue.name === pageState.values.attendee_3?.name ||
				newValue.name === pageState.values.attendee_4?.name)
		) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'This attendee is already selected in another field.',
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
			setValue('attendee_1', null);
			// return;
		} else {
			const AttendeeVal = {
				seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
				name: newValue && newValue.name ? newValue.name : ''
			};

			setPageState(pageState => ({
				...pageState,
				values: {
					...pageState.values,
					attendee_1: AttendeeVal
				},
				touched: {
					...pageState.touched,
					attendee_1: true
				}
			}));

			if (!newValue) {
				dispatch(
					appointmentActions.getAttendee({ QueryParams: `pagination=false&q=type='E'` })
				);
			}
		}
	};

	const handleAttendeeTwoChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		if (
			newValue &&
			(newValue.name === pageState.values.attendee_1?.name ||
				newValue.name === pageState.values.attendee_3?.name ||
				newValue.name === pageState.values.attendee_4?.name)
		) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: `This attendee ${newValue.name} is already selected in another field.`,
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
			setValue('attendee_2', null);
		} else {
			const AttendeeVal = {
				seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
				name: newValue && newValue.name ? newValue.name : ''
			};

			setPageState(pageState => ({
				...pageState,
				values: {
					...pageState.values,
					attendee_2: AttendeeVal
				},

				touched: {
					...pageState.touched,
					attendee_2: true
				}
			}));

			if (!newValue) {
				dispatch(
					appointmentActions.getAttendee({ QueryParams: `pagination=false&q=type='E'` })
				);
			}
		}
	};
	const handleAttendeeThreeChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		if (
			newValue &&
			(newValue.name === pageState.values.attendee_1?.name ||
				newValue.name === pageState.values.attendee_2?.name ||
				newValue.name === pageState.values.attendee_4?.name)
		) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: `This attendee ${newValue.name} is already selected in another field.`,
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
			setValue('attendee_3', null);
		} else {
			const AttendeeVal = {
				seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
				name: newValue && newValue.name ? newValue.name : ''
			};

			setPageState(pageState => ({
				...pageState,
				values: {
					...pageState.values,
					attendee_3: AttendeeVal
				},
				touched: {
					...pageState.touched,
					attendee_3: true
				}
			}));

			if (!newValue) {
				dispatch(
					appointmentActions.getAttendee({ QueryParams: `pagination=false&q=type='E'` })
				);
			}
		}
	};

	const handleAttendeeFourChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		if (
			newValue &&
			(newValue.name === pageState.values.attendee_1?.name ||
				newValue.name === pageState.values.attendee_2?.name ||
				newValue.name === pageState.values.attendee_3?.name)
		) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: `This attendee ${newValue.name} is already selected in another field.`,
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
			setValue('attendee_4', null);
		} else {
			const AttendeeVal = {
				seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
				name: newValue && newValue.name ? newValue.name : ''
			};

			setPageState(pageState => ({
				...pageState,
				values: {
					...pageState.values,
					attendee_4: AttendeeVal
				},
				touched: {
					...pageState.touched,
					attendee_4: true
				}
			}));

			if (!newValue) {
				dispatch(
					appointmentActions.getAttendee({ QueryParams: `pagination=false&q=type='E'` })
				);
			}
		}
	};

	const handleChange = (event: any) => {
		event.persist();

		setPageState(value => ({
			...value,
			values: {
				...pageState.values,
				[event.target.name]:
					event.target.type === 'checkbox' ? event.target.checked : event.target.value
			},
			touched: {
				...pageState.touched,
				[event.target.name]: true
			}
		}));
	};

	const onSubmit = async () => {};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		const validation = await trigger();

		if (validation) {
			const updatedValues = { ...pageState.values };
			const selectedAttendees = [
				updatedValues.attendee_1?.name,
				updatedValues.attendee_2?.name,
				updatedValues.attendee_3?.name,
				updatedValues.attendee_4?.name
			];

			const duplicateAttendee = selectedAttendees.find((attendee, index) => {
				const otherAttendees = selectedAttendees
					.slice(0, index)
					.concat(selectedAttendees.slice(index + 1));
				return attendee && otherAttendees.includes(attendee);
			});

			if (duplicateAttendee) {
				dispatch(
					actions.openSnackbar({
						open: true,
						message: `The attendee '${duplicateAttendee}' is selected in multiple fields.`,
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
				const fromDate = new Date(updatedValues.appointment_from_date);
				const toDate = new Date(updatedValues.appointment_to_date);
				if (fromDate > toDate) {
					dispatch(
						actions.openSnackbar({
							open: true,
							message:
								'Appointment To Date should be greater than or equal to Appointment From Date',
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
					if (edit) {
						dispatch(appointmentActions.edit(updatedValues));
					} else {
						dispatch(appointmentActions.add(updatedValues));
					}
				}
			}
		}
	};

	return (
		<>
			<div className="appointment-main-container">
				<Box id="form-main" ref={formRef} onKeyUp={(event: any) => onEnterKey(event)}>
					<FormContainer
						onSuccess={() => onSubmit()}
						formContext={formContext}
						FormProps={{ autoComplete: 'off' }}>
						<Grid container spacing={1}>
							<Grid item xs={12}>
								<Grid container alignItems="center">
									<Grid item xs={2}>
										<Typography variant="subtitle1">Tender No.</Typography>
									</Grid>
									<Grid item xs={3} className="error-hide-tender-no">
										<AutocompleteElement
											loading={tenderNoLoading}
											classname="custom-textfield"
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
															appointmentActions.getTenderNo({
																QueryParams: `page=1&limit=5000000&pagination=false`
															})
														);
													}
												}
											}}
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={12}>
								<Grid container alignItems="center">
									<Grid item xs={2}>
										<Typography variant="subtitle1">Tender Name</Typography>
									</Grid>
									<Grid item xs={4}>
										<TextFieldElement
											className="custom-textfield"
											name="tender_name"
											disabled
											fullWidth
											onChange={handleChange}
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={12}>
								<Grid container alignItems="center">
									<Grid item xs={2}>
										<Typography variant="subtitle1">Supplier Name</Typography>
									</Grid>
									<Grid item xs={4} className="common-auto">
										<AutocompleteElement
											classname="custom-textfield"
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
															appointmentActions.getSupplier({
																QueryParams: `pagination=false&q=supplier='true'`
															})
														);
													}
												}
											}}
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={4.5}>
								<Grid container alignItems="center">
									<Grid item xs={5.45}>
										<Typography variant="subtitle1">Start Date</Typography>
									</Grid>
									<Grid item xs={4}>
										<TextFieldElement
											type="date"
											className="custom-textfield-common"
											name="start_date"
											disabled
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={5}>
								<Grid container alignItems="center">
									<Grid item xs={3.1}>
										<Typography variant="subtitle1">End Date</Typography>
									</Grid>
									<Grid item xs={8}>
										<TextFieldElement
											type="date"
											className="custom-textfield-common"
											name="end_date"
											disabled
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={12}>
								<Grid container alignItems="center">
									<Grid item xs={2}>
										<Typography variant="subtitle1">Attendee 1</Typography>
									</Grid>
									<Grid item xs={3} className="common-auto">
										<AutocompleteElement
											loading={attendeeLoading}
											autocompleteProps={{
												disabled: false,
												selectOnFocus: true,
												clearOnBlur: true,
												handleHomeEndKeys: true,
												freeSolo: true,
												forcePopupIcon: true,
												autoHighlight: true,
												openOnFocus: true,
												onChange: (event, value, reason, details) =>
													handleAttendeeChange(
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
											name="attendee_1"
											options={attendeeOptions}
											textFieldProps={{
												InputProps: {},
												onChange: e =>
													setAttendeeInputValue(e.target.value),
												onFocus: () => {
													if (
														attendeeOptions &&
														attendeeOptions.length === 0
													) {
														dispatch(
															appointmentActions.getAttendee({
																QueryParams: `pagination=false&q=type='E'`
															})
														);
													}
												}
											}}
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={12}>
								<Grid container alignItems="center">
									<Grid item xs={2}>
										<Typography variant="subtitle1">Attendee 2</Typography>
									</Grid>
									<Grid item xs={3} className="common-auto">
										<AutocompleteElement
											loading={attendeeTwoLoading}
											autocompleteProps={{
												disabled: false,
												selectOnFocus: true,
												clearOnBlur: true,
												handleHomeEndKeys: true,
												freeSolo: true,
												forcePopupIcon: true,
												autoHighlight: true,
												openOnFocus: true,
												onChange: (event, value, reason, details) =>
													handleAttendeeTwoChange(
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
											name="attendee_2"
											options={attendeeTwoOptions}
											textFieldProps={{
												InputProps: {},
												onChange: e =>
													setAttendeeTwoInputValue(e.target.value),
												onFocus: () => {
													if (
														attendeeTwoOptions &&
														attendeeTwoOptions.length === 0
													) {
														dispatch(
															appointmentActions.getAttendee({
																QueryParams: `pagination=false&q=type='E'`
															})
														);
													}
												}
											}}
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={12}>
								<Grid container alignItems="center">
									<Grid item xs={2}>
										<Typography variant="subtitle1">Attendee 3</Typography>
									</Grid>
									<Grid item xs={3} className="common-auto">
										<AutocompleteElement
											loading={attendeeThreeLoading}
											autocompleteProps={{
												disabled: false,
												selectOnFocus: true,
												clearOnBlur: true,
												handleHomeEndKeys: true,
												freeSolo: true,
												forcePopupIcon: true,
												autoHighlight: true,
												openOnFocus: true,
												onChange: (event, value, reason, details) =>
													handleAttendeeThreeChange(
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
											name="attendee_3"
											options={attendeeThreeOptions}
											textFieldProps={{
												InputProps: {},
												onChange: e =>
													setAttendeeThreeInputValue(e.target.value),
												onFocus: () => {
													if (
														attendeeThreeOptions &&
														attendeeThreeOptions.length === 0
													) {
														dispatch(
															appointmentActions.getAttendee({
																QueryParams: `pagination=false&q=type='E'`
															})
														);
													}
												}
											}}
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={12}>
								<Grid container alignItems="center">
									<Grid item xs={2}>
										<Typography variant="subtitle1">Attendee 4 </Typography>
									</Grid>
									<Grid item xs={3} className="common-auto">
										<AutocompleteElement
											loading={attendeeFourLoading}
											autocompleteProps={{
												disabled: false,
												selectOnFocus: true,
												clearOnBlur: true,
												handleHomeEndKeys: true,
												freeSolo: true,
												forcePopupIcon: true,
												autoHighlight: true,
												openOnFocus: true,
												onChange: (event, value, reason, details) =>
													handleAttendeeFourChange(
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
											name="attendee_4"
											options={attendeeFourOptions}
											textFieldProps={{
												InputProps: {},
												onChange: e =>
													setAttendeeFourInputValue(e.target.value),
												onFocus: () => {
													if (
														attendeeFourOptions &&
														attendeeFourOptions.length === 0
													) {
														dispatch(
															appointmentActions.getAttendee({
																QueryParams: `pagination=false&q=type='E'`
															})
														);
													}
												}
											}}
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={4.5}>
								<Grid container alignItems="center">
									<Grid item xs={5.45}>
										<Typography variant="subtitle1">From Date</Typography>
									</Grid>
									<Grid item xs={4}>
										<TextFieldElement
											type="date"
											className="custom-textfield-common"
											name="appointment_from_date"
											onChange={handleChange}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={5}>
								<Grid container alignItems="center">
									<Grid item xs={3.1}>
										<Typography variant="subtitle1">To Date</Typography>
									</Grid>
									<Grid item xs={8}>
										<TextFieldElement
											type="date"
											className="custom-textfield-common"
											name="appointment_to_date"
											onChange={handleChange}
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={12}>
								<Grid container alignItems="center">
									<Grid item xs={2}>
										<Typography variant="subtitle1">Comment</Typography>
									</Grid>
									<Grid item xs={6.3}>
										<TextFieldElement
											// className="custom-textfield"
											name="comments"
											fullWidth
											multiline
											onChange={handleChange}
										/>
									</Grid>
								</Grid>
							</Grid>
						</Grid>

						<button type="submit" hidden />
					</FormContainer>
				</Box>
			</div>
			<Grid container sx={{ mt: 1.5, mb: 1.5 }}>
				<Grid item xs={12}>
					<Stack
						sx={{ mr: 1.5 }}
						direction="row"
						spacing={1}
						justifyContent="left"
						alignItems="center">
						<Button
							onClick={e => handleSubmit(e)}
							onKeyDown={e => (e.key === 'Enter' ? handleSubmit(e) : '')}
							disableElevation
							disabled={isSubmitting}
							type="submit"
							variant="contained"
							color="primary"
							className="custom-button"
							ref={buttonRef}>
							{isSubmitting ? <CircularProgress size={24} color="success" /> : 'Save'}
						</Button>
						<Button
							className="custom-button"
							variant="outlined"
							color="secondary"
							onClick={onClose}>
							Cancel
						</Button>
					</Stack>
				</Grid>
			</Grid>
		</>
	);
};
export default Appointment;
