import { SyntheticEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material-ui
import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	Box,
	Button,
	CircularProgress,
	createFilterOptions,
	Divider,
	FilterOptionsState,
	FormControl,
	Grid,
	InputAdornment,
	Link,
	Stack,
	Typography
} from '@mui/material';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';
// import de from 'dayjs/locale/de';
// import en from 'dayjs/locale/en-gb';
// import en from 'date-fns/locale/en-IN';
// import match from 'autosuggest-highlight/match';
// import parse from 'autosuggest-highlight/parse';
// types
import { StringColorProps } from 'types/password';

// import { KeyedObject } from 'types/root';
// import { z } from 'zod';
import {
	AutocompleteElement,
	// DateFnsProvider,
	DatePickerElement,
	FormContainer,
	NumericFormatElement,
	PasswordElement,
	SelectElement,
	TextFieldElement
} from '@app/components/rhfmui';
import { useAuthSlice } from '@app/store/slice/auth';
import { authSelector } from '@app/store/slice/auth/auth.selectors';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import AnimateButton from '@components/@extended/AnimateButton';
import IconButton from '@components/@extended/IconButton';
import { zodResolver } from '@hookform/resolvers/zod';
// project import
import useAuth from '@hooks/useAuth';
import useThrottle from '@hooks/useThrottle';
// *** COUNTRY *** //
import { useCountrySlice } from '@pages/master/countries/store/slice';
import { countrySelector } from '@pages/master/countries/store/slice/country.selectors';
import { countryState } from '@pages/master/countries/store/slice/types';
// *** ORGANISTION *** //
import { useOrganisationSlice } from '@pages/master/organisations/store/slice';
import { organisationSelector } from '@pages/master/organisations/store/slice/organisation.selectors';
// import { organisationsState } from '@pages/master/organisations/store/slice/types';
import { hasError } from '@utils/helpers';
import { InitialState } from '@utils/helpers';
// import useScriptRef from '@hooks/useScriptRef';
import { strengthColor, strengthIndicator } from '@utils/password-strength';

import { FormSchema, IFormInput } from '../../models/AuthRegister';

// interface InitialState {
// 	isValid: boolean;
// 	values: KeyedObject;
// 	touched: KeyedObject | null;
// 	errors: KeyedObject | null;
// }

// // add your validation requirements 👿
// const FormSchema = z.object({
// 	FirstName: z
// 		.string({ required_error: 'FirstName is required' })
// 		.min(1, { message: 'FirstName is required' })
// 		.max(32, 'FirsName must be less than 32 characters'),
// 	LastName: z
// 		.string({ required_error: 'LastName is required' })
// 		.min(1, { message: 'LastName is required' })
// 		.max(32, 'LastName must be less than 32 characters'),
// 	Company: z.string().optional(),
// 	idOrganisation: z.string({ required_error: 'Organisation is required' }),
// 	Country: z
// 		.object({
// 			idCountry: z.string({ required_error: 'Country is required' }),
// 			Name: z.string().nullable().optional(),
// 			Code: z.string().nullable().optional()
// 		})
// 		.nullable()
// 		.default(null),
// 	// z.string({ required_error: 'Country is required' }).optional(),
// 	DOB: z.coerce
// 		.date()
// 		.refine(data => data < new Date(), { message: 'Start date must be in the past' }),
// 	// idCountry: z.string({ required_error: 'Country is required' }).optional(),
// 	Email: z
// 		.string({ required_error: 'Email is required' })
// 		.min(1, { message: 'Email is required' })
// 		.email({
// 			message: 'Must be a valid email'
// 		}),
// 	Password: z
// 		.string({ required_error: 'Password is required' })
// 		.min(1, 'Password is required')
// 		.min(8, 'Password must be more than 8 characters')
// 		.max(32, 'Password must be less than 32 characters')
// });

// type IFormInput = z.infer<typeof FormSchema>;

const filter = createFilterOptions();

// ============================|| REGISTER ||============================ //

const AuthRegister = () => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { authActions } = useAuthSlice();
	const { actions: countryActions } = useCountrySlice();
	const { actions: organisationActions } = useOrganisationSlice();
	const { actions } = useSnackBarSlice();

	// add your Slice Selector  👿
	// *** Auth State *** //
	const authState = useSelector(authSelector);
	const { apiError, apiSuccess } = authState;

	// *** Organisation State *** //
	const organisationState = useSelector(organisationSelector);
	const { getError: getOrganisationError, getSuccess: getOrganisationSuccess } =
		organisationState;

	// *** Country State *** //
	const countryState = useSelector(countrySelector);
	const { getError: getCountryError, getSuccess: getCountrySuccess } = countryState;

	const { register } = useAuth();

	// add your Locale  👿
	const { formatMessage } = useIntl();

	const navigation = useNavigate();

	// const [defaultRHFValue, setDefaultRHFValue] = useState(null);

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onSubmit',
		reValidateMode: 'onSubmit'
		// defaultValues: useMemo(() => defaultRHFValue, [defaultRHFValue])
	});

	const {
		formState,
		formState: { errors, isSubmitting },
		// reset,
		setFocus
		// setError
	} = formContext;

	// add your States  👿
	const [capsWarning, setCapsWarning] = useState(false);
	const [organisations, setOrganisations] = useState([]);
	const [countryLoading, setCountryLoading] = useState(false);
	// const [countryValue, setCountryValue] = useState<countryState>([]);
	const [countryInputValue, setCountryInputValue] = useState('');
	const [countryOptions, setCountryOptions] = useState<countryState[]>([]);
	// const loaded = useRef(false);

	const [level, setLevel] = useState<StringColorProps>();
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});
	const [showPassword, setShowPassword] = useState(false);

	const throttledInputCountryValue = useThrottle(countryInputValue, 400);

	// add your useEffect ( Order must be empty dependancy first, ... , success, error)  👿

	useEffect(() => {
		changePassword('');

		// reset({
		// 	FirstName: 'Dharmesh',
		// 	//	LastName: 'Patel',
		// 	Email: 'abc@dharmesh.com',
		// 	Password: 'A12346sd'
		// 	//	DOB: dayjs(new Date())
		// });

		dispatch(organisationActions.get({}));

		return () => {
			dispatch(authActions.reset());
			dispatch(countryActions.reset());
		};
	}, []);

	// useEffect(() => {
	// 	console.log('touchedFields', formState.touchedFields);
	// }, [formState]); // use entire formState object as optional array arg in useEffect, not individual properties of it

	// *** ORGANISTION *** //

	useEffect(() => {
		if (getOrganisationSuccess) {
			console.log('Organisation Success', getOrganisationSuccess);
			if (getOrganisationSuccess?.results) {
				setOrganisations(getOrganisationSuccess?.results);
			} else {
				setOrganisations([]);
			}
		}
	}, [getOrganisationSuccess]);

	useEffect(() => {
		if (getOrganisationError) {
			console.log('Organisaition Error', getOrganisationError);
			setOrganisations([]);
		}
	}, [getOrganisationError]);

	// *** COUNTRY *** //

	useEffect(() => {
		if (getCountrySuccess) {
			console.log('COUTRY Success', getCountrySuccess);
			if (getCountrySuccess?.results) {
				setCountryOptions(getCountrySuccess?.results);
			} else {
				setCountryOptions([]);
			}
			setCountryLoading(false);
		}
	}, [getCountrySuccess]);

	useEffect(() => {
		if (getCountryError) {
			console.log('COUTRY Error', getCountryError);
			setCountryOptions([]);
		}
		setCountryLoading(false);
	}, [getCountryError]);

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

	// *** AUTH - SUBMIT *** //

	useEffect(() => {
		if (apiSuccess) {
			console.log('Api Success', apiSuccess);
			navigation('/apps/invoice/list');
			// submitLogin(apiSuccess);
		}
	}, [apiSuccess]);

	useEffect(() => {
		if (apiError) {
			const { message } = apiError.apiError;

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
	}, [apiError]);

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

	// add your Event Handler ..., handleChange, OnSubmit  👿

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event: SyntheticEvent) => {
		event.preventDefault();
	};

	const changePassword = (value: string) => {
		const temp = strengthIndicator(value);
		setLevel(strengthColor(temp));
	};

	const onKeyDown = (keyEvent: any) => {
		if (keyEvent.getModifierState('CapsLock')) {
			setCapsWarning(true);
		} else {
			setCapsWarning(false);
		}
	};

	// const hanldeAcOnKeyDown = (event: any) => {
	// 	if (event.keyCode === 13) {
	// 		event.preventDefault();
	// 		return false;
	// 	}
	// };

	const handleFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		console.log('options', options);
		console.log('state', state);
		const filtered = filter(options, state);

		const { inputValue } = state;

		// Suggest the creation of a new value
		const isExisting = options.some(
			option => inputValue.toLowerCase() === option.Name.toLowerCase()
		);
		if (inputValue !== '' && !isExisting) {
			filtered.push({
				inputValue,
				Name: `Add "${inputValue}"`
			});
		}

		// // Suggest the creation of a new value
		// if (state.inputValue !== '') {
		// 	const result = filtered.map((a: any) => a.Name);
		// 	const found = result.includes(state.inputValue);
		// 	if (!found) {
		// 		filtered.push({
		// 			inputValue: state.inputValue,
		// 			Name: `Add "${state.inputValue}"`
		// 		});
		// 	}
		// }

		console.log('FILTRED', filtered);

		return filtered;
	};

	const handleCountryChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const CountryVal = {
			idCountry: newValue && newValue.idCountry ? newValue.idCountry : null,
			Name: newValue && newValue.Name ? newValue.Name : '',
			Code: newValue && newValue.Code ? newValue.Code : ''
		};

		console.log('newVALUE', newValue);
		console.log('reason', reason);
		console.log('details', details);

		// console.log('event', event.target);
		// console.log('value', newValue);
		// console.log('reason', reason);
		// console.log('details', details);
		// const idCountry = newValue ? newValue.idCountry : null;

		// if (typeof newValue === 'string') {
		// 	setCountryValue({
		// 		label: newValue
		// 	});
		// } else if (newValue && newValue.inputValue) {
		// 	// Create a new value from the user input
		// 	setCountryValue({
		// 		idCountry: -1,
		// 		label: newValue.inputValue
		// 	});
		// } else {
		// 	setCountryValue(newValue);
		// }

		// setCountryValue(newValue);

		dispatch(countryActions.reset());

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				Country: CountryVal
			},
			touched: {
				...pageState.touched,
				Country: true
			}
		}));

		// setPageState(pageState => ({
		// 	...pageState,
		// 	values: {
		// 		...pageState.values,
		// 		idCountry
		// 	},
		// 	touched: {
		// 		...pageState.touched,
		// 		idCountry: true
		// 	}
		// }));

		if (!newValue) {
			dispatch(countryActions.get({ QueryParams: `limit=10` }));
		}
	};

	const handleDateChange = (newValue: any) => {
		// console.log('DATE CHANGE', newValue.$d);
		if (newValue?.$d) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					DOB: dayjs(new Date(newValue.$d))
				}
			}));
		}
	};

	const handleChangeDx = (data: any) => {
		console.log('HAHAHAHA Currency', data);
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

	const onSubmit = async () => {
		console.log('SUBMIT', pageState);

		// on save time
		console.log('formState Touch', formState.touchedFields);
		console.log('formState Dirty', formState.dirtyFields);

		setPageState(frmPageState => ({
			...frmPageState,
			isValid: !errors,
			errors: errors || {}
		}));

		await register(pageState?.values);
	};

	return (
		<FormContainer
			onSuccess={() => onSubmit()}
			formContext={formContext}
			FormProps={{ autoComplete: 'off' }}>
			<Grid container spacing={1}>
				<Grid item xs={2} md={6}>
					<Stack spacing={1}>
						<TextFieldElement
							id="firstname-register"
							type="firstname"
							name="FirstName"
							label={formatMessage({ id: 'FirstName' }) + ' *'}
							fullWidth
							onChange={handleChange}
							error={hasError<IFormInput>('FirstName', formState, errors)}
							helperText={
								hasError<IFormInput>('FirstName', formState, errors)
									? (errors['FirstName'] as unknown as string)
									: ' '
							}
							autoFocus={true}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} md={6}>
					<Stack spacing={1}>
						<TextFieldElement
							id="lastname-register"
							type="lastname"
							name="LastName"
							label={formatMessage({ id: 'LastName' }) + ' *'}
							fullWidth
							onChange={handleChange}
							error={hasError<IFormInput>('LastName', formState, errors)}
							helperText={
								hasError<IFormInput>('LastName', formState, errors)
									? (errors['LastName'] as unknown as string)
									: ' '
							}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12}>
					<Stack spacing={1}>
						<NumericFormatElement
							id="company-register"
							// type="text"
							name="Company"
							prefix="$"
							// suffix="Rs"
							label={formatMessage({ id: 'Company' })}
							fullWidth
							onChange={handleChangeDx}
							myCustomProps={{ thousandSeparator: '-' }}
							// onChange={handleChange}
							error={hasError<IFormInput>('Company', formState, errors)}
							helperText={
								hasError<IFormInput>('Company', formState, errors)
									? (errors['Company'] as unknown as string)
									: ' '
							}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} md={6}>
					<Stack spacing={10}>
						<SelectElement
							id="organisation-register"
							label={formatMessage({ id: 'Organisation' })}
							name="idOrganisation"
							options={organisations}
							error={hasError<IFormInput>('idOrganisation', formState, errors)}
							helperText={
								hasError<IFormInput>('idOrganisation', formState, errors)
									? (errors['idOrganisation'] as unknown as string)
									: ' '
							}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} md={6}>
					<Stack spacing={1}>
						<AutocompleteElement
							loading={countryLoading}
							autocompleteProps={{
								disabled: false,
								selectOnFocus: true,
								clearOnBlur: true,
								handleHomeEndKeys: true,
								freeSolo: true,
								forcePopupIcon: true,
								autoHighlight: true,
								openOnFocus: true,
								// value: { countryValue },
								// onChange: { handleChangeAC(event: any, value: any, reason: AutocompleteChangeReason, details: AutocompleteChangeDetails<any>) }
								onChange: (event, value, reason, details) =>
									handleCountryChange(event, value, reason, details),
								filterOptions: (options, state) =>
									handleFilterOptions(options, state),
								getOptionLabel: option => {
									// Value selected with enter, right from the input
									if (typeof option === 'string') {
										return option;
									}
									// Add "xxx" option created dynamically
									if (option.inputValue) {
										return option.inputValue;
									}
									// Regular option
									return option.Name;
								},
								renderOption: (props, option) => (
									<Box
										component="li"
										sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
										{...props}>
										{option && option.Code && (
											<img
												loading="lazy"
												width="20"
												src={`https://flagcdn.com/w20/${option.Code.toLowerCase()}.png`}
												srcSet={`https://flagcdn.com/w40/${option.Code.toLowerCase()}.png 2x`}
												alt=""
											/>
										)}
										{option.Name}
									</Box>
								)
							}}
							label={formatMessage({ id: 'Country' })}
							name="Country"
							options={countryOptions}
							textFieldProps={{
								InputProps: {
									//endAdornment: <>{InputProps.endAdornment}</>
								},
								// onKeyDown: e => hanldeAcOnKeyDown(e),
								onChange: e => setCountryInputValue(e.target.value),
								onFocus: () => {
									if (countryOptions && countryOptions.length === 0) {
										dispatch(countryActions.get({ QueryParams: `limit=10` }));
									}
								},
								error: hasError<IFormInput>('Country', formState, errors),
								helperText: hasError<IFormInput>('Country', formState, errors)
									? (errors['Country'] as unknown as string)
									: ' '
							}}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12}>
					<Stack spacing={1}>
						{/* <DateFnsProvider> */}
						<DatePickerElement
							// autoFocus={hasError<IFormInput>('DOB', formState, errors)}
							label="Basic date picker"
							name="DOB"
							format="DD/MM/YYYY"
							// defaultValue={dayjs('2022-04-17')}
							// format="DD/MM/YYYY"
							// views={['day']}
							// defaultValue={dayjs('2022-04-17')}
							// defaultValue={dayjs('2022-04-17')}
							onChange={newValue => handleDateChange(newValue)}
							slotProps={{
								// field: { shouldRespectLeadingZeros: true },
								// toolbar: { toolbarFormat: 'ddd DD MMMM', hidden: false },
								textField: {
									variant: 'filled',
									size: 'small',
									error: hasError<IFormInput>('DOB', formState, errors),
									helperText: hasError<IFormInput>('DOB', formState, errors)
										? (errors['DOB'] as unknown as string)
										: ' '

									// 	error: hasError<IFormInput>('LastName', formState, errors)
									// 	// helperText: hasError<IFormInput>('LastName', formState, errors)
									// 	// 	? (errors['LastName'] as unknown as string)
									// 	// 	: ' '
								}
							}}
							helperText=" "
							// helperText={
							// 	hasError<IFormInput>('LastName', formState, errors)
							// 		? (errors['LastName'] as unknown as string)
							// 		: ' '
							// }
						/>
						{/* <DatePickerElement
								autoFocus
								disabled={false}
								label="Date Picker"
								name="basic"
								// closeOnSelect
								// defaultValue={new Date()}
								format="DD-MM-YYYY"
								// value={DOBValue}
								// loading={true}
								// view="day"
								// slotProps={{
								// 	textField: {
								// 		helperText: 'MM/DD/YYYY'
								// 	}
								// }}
								// renderInput={params => <TextField {...params} />}
								// slotProps={{
								// 	format:{"DD/MM/YYYY"}
								// }}
								//	format="DD/MM/YYYY"
								onChange={newValue => handleDateChange(newValue)}
							/> */}
						{/* </DateFnsProvider> */}
					</Stack>
				</Grid>

				<Grid item xs={12}>
					<Stack spacing={1}>
						<TextFieldElement
							id="email-register"
							type="email"
							name="Email"
							label={formatMessage({ id: 'Email' }) + ' *'}
							fullWidth
							onChange={handleChange}
							error={hasError<IFormInput>('Email', formState, errors)}
							helperText={
								hasError<IFormInput>('Email', formState, errors)
									? (errors['Email'] as unknown as string)
									: ' '
							}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12}>
					<Stack spacing={1}>
						<PasswordElement
							id="password-register"
							name="Password"
							label={formatMessage({ id: 'Password' }) + ' *'}
							fullWidth
							color={capsWarning ? 'warning' : 'primary'}
							type={showPassword ? 'text' : 'password'}
							onKeyDown={onKeyDown}
							onChange={e => {
								handleChange(e);
								changePassword(e.target.value);
							}}
							InputProps={
								<>
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge="end"
											color="secondary">
											{showPassword ? (
												<EyeOutlined />
											) : (
												<EyeInvisibleOutlined />
											)}
										</IconButton>
									</InputAdornment>
								</>
							}
						/>
						{capsWarning && (
							<Typography
								variant="caption"
								sx={{ color: 'warning.main' }}
								id="warning-helper-text-password-login">
								{formatMessage({ id: 'Password' })}
							</Typography>
						)}
					</Stack>
					<FormControl fullWidth sx={{ mt: 2 }}>
						<Grid container spacing={2} alignItems="center">
							<Grid item>
								<Box
									sx={{
										bgcolor: level?.color,
										width: 85,
										height: 8,
										borderRadius: '7px'
									}}
								/>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1" fontSize="0.75rem">
									{level?.label}
								</Typography>
							</Grid>
						</Grid>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="body2">
						By Signing up, you agree to our &nbsp;
						<Link variant="subtitle2" component={RouterLink} to="#">
							Terms of Service
						</Link>
						&nbsp; and &nbsp;
						<Link variant="subtitle2" component={RouterLink} to="#">
							Privacy Policy
						</Link>
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<AnimateButton>
						<Button
							disableElevation
							disabled={isSubmitting}
							fullWidth
							size="large"
							type="submit"
							variant="contained"
							color="primary">
							{isSubmitting ? (
								<CircularProgress size={24} color="success" />
							) : (
								formatMessage({ id: 'Create-account' })
							)}
						</Button>
					</AnimateButton>
				</Grid>
				<Grid item xs={12}>
					<Divider>
						<Typography variant="caption">Sign up with</Typography>
					</Divider>
				</Grid>
				<Grid item xs={12}>
					{/* <FirebaseSocial /> */}
				</Grid>
			</Grid>
		</FormContainer>
	);
};

export default AuthRegister;

// import { SyntheticEvent, useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link as RouterLink } from 'react-router-dom';
// // material-ui
// import {
// 	Box,
// 	Button,
// 	CircularProgress,
// 	Divider,
// 	FormControl,
// 	FormHelperText,
// 	Grid,
// 	InputAdornment,
// 	Link,
// 	Stack,
// 	Typography
// } from '@mui/material';
// import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

// // types
// import { StringColorProps } from 'types/password';
// import { object, string } from 'zod';

// import { FormContainer, PasswordElement, TextFieldElement } from '@app/components/rhfmui';
// import { useAuthSlice } from '@app/store/slice/auth';
// import { authSelector } from '@app/store/slice/auth/auth.selectors';
// import { useSnackBarSlice } from '@app/store/slice/snackbar';
// import AnimateButton from '@components/@extended/AnimateButton';
// import IconButton from '@components/@extended/IconButton';
// import { zodResolver } from '@hookform/resolvers/zod';
// // project import
// import useAuth from '@hooks/useAuth';
// // import useScriptRef from '@hooks/useScriptRef';
// import { strengthColor, strengthIndicator } from '@utils/password-strength';

// // import FirebaseSocial from './FirebaseSocial';

// interface IFormInput {
// 	firstname: string;
// 	lastname: string;
// 	email: string;
// 	company: string;
// 	password: string;
// }

// interface keyable {
// 	[key: string]: any;
// }

// interface InitialState {
// 	isValid: boolean;
// 	values: null | keyable;
// 	touched: null | keyable;
// 	errors: null | keyable;
// }

// const schema = object({
// 	firstname: string().min(1, 'First Name is required').max(255),
// 	lastname: string().min(1, 'Last Name is required').max(255),
// 	email: string().min(1, 'Email is required').max(255).email('Email is invalid'),
// 	password: string()
// 		.min(1, 'Password is required')
// 		.min(8, 'Password must be more than 8 characters')
// 		.max(32, 'Password must be less than 32 characters')
// });

// // ============================|| REGISTER ||============================ //

// const AuthRegister = () => {
// 	const dispatch = useDispatch();
// 	const { authActions } = useAuthSlice();
// 	const { actions } = useSnackBarSlice();

// 	const authState = useSelector(authSelector);

// 	const { register } = useAuth();

// 	const { apiError } = authState;

// 	const formContext = useForm<IFormInput>({
// 		resolver: zodResolver(schema),
// 		mode: 'onSubmit',
// 		reValidateMode: 'onSubmit'
// 	});

// 	const [formState1, setFormState1] = useState<InitialState>({
// 		isValid: false,
// 		values: null,
// 		touched: null,
// 		errors: null
// 	});
// 	const [capsWarning, setCapsWarning] = useState(false);

// 	const {
// 		formState,
// 		//	watch,
// 		formState: { errors, isDirty, isSubmitting }
// 	} = formContext;

// 	// const emailValue = watch('email');

// 	useEffect(() => {
// 		return () => {
// 			dispatch(authActions.reset());
// 		};
// 	}, []);

// 	useEffect(() => {
// 		console.log('errors', errors);
// 	}, [errors]);

// 	useEffect(() => {
// 		console.log('isDirty', isDirty);
// 	}, [isDirty]);

// 	useEffect(() => {
// 		console.log('isSubmitting', isSubmitting);
// 	}, [isSubmitting]);

// 	useEffect(() => {
// 		console.log('APIs RESPONSE WITH ERROR AUTH FORM PAGE ===========> REGISTER', apiError);
// 		if (apiError) {
// 			const { message } = apiError.apiError;

// 			dispatch(
// 				actions.openSnackbar({
// 					open: true,
// 					message: message,
// 					variant: 'alert',
// 					alert: {
// 						color: 'error'
// 					},
// 					close: true,
// 					anchorOrigin: {
// 						vertical: 'top',
// 						horizontal: 'center'
// 					}
// 				})
// 			);
// 		}
// 		// setState(authState);
// 	}, [apiError]);

// 	//const { firebaseRegister } = useAuth();
// 	// const scriptedRef = useScriptRef();

// 	const [level, setLevel] = useState<StringColorProps>();
// 	const [showPassword, setShowPassword] = useState(false);
// 	const handleClickShowPassword = () => {
// 		setShowPassword(!showPassword);
// 	};

// 	const handleMouseDownPassword = (event: SyntheticEvent) => {
// 		event.preventDefault();
// 	};

// 	const changePassword = (value: string) => {
// 		const temp = strengthIndicator(value);
// 		setLevel(strengthColor(temp));
// 	};

// 	useEffect(() => {
// 		changePassword('');
// 	}, []);

// 	const onKeyDown = (keyEvent: any) => {
// 		console.log('ON KEY down', keyEvent);

// 		if (keyEvent.getModifierState('CapsLock')) {
// 			setCapsWarning(true);
// 		} else {
// 			setCapsWarning(false);
// 		}
// 	};

// 	const handleChange = (event: any) => {
// 		event.persist();

// 		setFormState1(value => ({
// 			...value,
// 			values: {
// 				...formState1.values,
// 				[event.target.name]:
// 					event.target.type === 'checkbox' ? event.target.checked : event.target.value
// 			},
// 			touched: {
// 				...formState1.touched,
// 				[event.target.name]: true
// 			}
// 		}));
// 	};

// 	const handleBlur = (event: any) => {
// 		event.persist();
// 		console.log('handleBlur');
// 	};

// 	const onSubmit = async (data: any) => {
// 		console.log('SUBMIT', formState1);

// 		// on save time
// 		console.log('formState changed', formState.touchedFields);
// 		// setFormState1(frmState => ({
// 		// 	...frmState,
// 		// 	isValid: !errors,
// 		// 	errors: errors || {}
// 		// }));

// 		// const lenData = Object.keys(data).length;
// 		// const lenTouched = Object.keys(formState.touchedFields).length;

// 		// console.log('lenData', lenData);
// 		// console.log('lenTouched', lenTouched);

// 		setFormState1(frmState1 => ({
// 			...frmState1,
// 			isValid: !errors,
// 			errors: errors || {}
// 		}));

// 		console.log('!errors', errors);
// 		console.log('onSubmit', data);

// 		await register(data.email, data.password, data.firstname, data.lastname);
// 	};

// 	const hasError = (field: string) => {
// 		const str = field as string;

// 		return Boolean(
// 			formState.touchedFields[str as keyof typeof formState.touchedFields] &&
// 				errors[str as keyof IFormInput]
// 		);
// 	};

// 	return (
// 		<FormContainer
// 			// defaultValues={{ name: '' }}
// 			onSuccess={data => onSubmit(data)}
// 			formContext={formContext}
// 			FormProps={{ autoComplete: 'off' }}>
// 			<Grid container spacing={3}>
// 				<Grid item xs={2} md={6}>
// 					<Stack spacing={1}>
// 						<TextFieldElement
// 							id="firstname-register"
// 							type="firstname"
// 							name="firstname"
// 							label="First Name*"
// 							fullWidth
// 							onChange={handleChange}
// 							onBlur={handleBlur}
// 							error={hasError('firstname')}
// 							helperText={
// 								hasError('firstname')
// 									? (errors['firstname'] as unknown as string)
// 									: null
// 							}
// 							autoFocus={true}
// 						/>
// 						{formState.touchedFields.email && errors.email && (
// 							<FormHelperText
// 								error
// 								id="standard-weight-helper-text-email-login"></FormHelperText>
// 						)}
// 					</Stack>
// 				</Grid>
// 				<Grid item xs={12} md={6}>
// 					<Stack spacing={1}>
// 						<TextFieldElement
// 							id="lastname-register"
// 							type="lastname"
// 							name="lastname"
// 							label="Last Name*"
// 							fullWidth
// 							onChange={handleChange}
// 							onBlur={handleBlur}
// 							error={hasError('lastname')}
// 							helperText={
// 								hasError('lastname')
// 									? (errors['lastname'] as unknown as string)
// 									: null
// 							}
// 						/>
// 					</Stack>
// 				</Grid>
// 				<Grid item xs={12}>
// 					<Stack spacing={1}>
// 						<TextFieldElement
// 							id="company-register"
// 							type="company"
// 							name="company"
// 							label="Company"
// 							fullWidth
// 							onChange={handleChange}
// 							onBlur={handleBlur}
// 							error={hasError('company')}
// 							helperText={
// 								hasError('company')
// 									? (errors['company'] as unknown as string)
// 									: null
// 							}
// 						/>
// 					</Stack>
// 				</Grid>
// 				<Grid item xs={12}>
// 					<Stack spacing={1}>
// 						<TextFieldElement
// 							id="email-register"
// 							type="email"
// 							name="email"
// 							label="Email Address*"
// 							fullWidth
// 							onChange={handleChange}
// 							error={hasError('email')}
// 							helperText={
// 								hasError('email') ? (errors['email'] as unknown as string) : null
// 							}
// 						/>
// 					</Stack>
// 				</Grid>
// 				<Grid item xs={12}>
// 					<Stack spacing={1}>
// 						<PasswordElement
// 							id="password-register"
// 							name="password"
// 							label="Password*"
// 							fullWidth
// 							color={capsWarning ? 'warning' : 'primary'}
// 							type={showPassword ? 'text' : 'password'}
// 							onKeyDown={onKeyDown}
// 							onChange={e => {
// 								handleChange(e);
// 								changePassword(e.target.value);
// 							}}
// 							InputProps={
// 								<>
// 									<InputAdornment position="end">
// 										<IconButton
// 											aria-label="toggle password visibility"
// 											onClick={handleClickShowPassword}
// 											onMouseDown={handleMouseDownPassword}
// 											edge="end"
// 											color="secondary">
// 											{showPassword ? (
// 												<EyeOutlined />
// 											) : (
// 												<EyeInvisibleOutlined />
// 											)}
// 										</IconButton>
// 									</InputAdornment>
// 								</>
// 							}
// 						/>
// 						{capsWarning && (
// 							<Typography
// 								variant="caption"
// 								sx={{ color: 'warning.main' }}
// 								id="warning-helper-text-password-login">
// 								Caps lock on!
// 							</Typography>
// 						)}
// 					</Stack>
// 					<FormControl fullWidth sx={{ mt: 2 }}>
// 						<Grid container spacing={2} alignItems="center">
// 							<Grid item>
// 								<Box
// 									sx={{
// 										bgcolor: level?.color,
// 										width: 85,
// 										height: 8,
// 										borderRadius: '7px'
// 									}}
// 								/>
// 							</Grid>
// 							<Grid item>
// 								<Typography variant="subtitle1" fontSize="0.75rem">
// 									{level?.label}
// 								</Typography>
// 							</Grid>
// 						</Grid>
// 					</FormControl>
// 				</Grid>
// 				<Grid item xs={12}>
// 					<Typography variant="body2">
// 						By Signing up, you agree to our &nbsp;
// 						<Link variant="subtitle2" component={RouterLink} to="#">
// 							Terms of Service
// 						</Link>
// 						&nbsp; and &nbsp;
// 						<Link variant="subtitle2" component={RouterLink} to="#">
// 							Privacy Policy
// 						</Link>
// 					</Typography>
// 				</Grid>
// 				{/* {errors.submit && (
// 					<Grid item xs={12}>
// 						<FormHelperText error>{errors.submit}</FormHelperText>
// 					</Grid>
// 				)} */}
// 				<Grid item xs={12}>
// 					<AnimateButton>
// 						<Button
// 							disableElevation
// 							disabled={isSubmitting}
// 							fullWidth
// 							size="large"
// 							type="submit"
// 							variant="contained"
// 							color="primary">
// 							{isSubmitting ? (
// 								<CircularProgress size={24} color="success" />
// 							) : (
// 								'Create Account'
// 							)}
// 						</Button>
// 					</AnimateButton>
// 				</Grid>
// 				<Grid item xs={12}>
// 					<Divider>
// 						<Typography variant="caption">Sign up with</Typography>
// 					</Divider>
// 				</Grid>
// 				<Grid item xs={12}>
// 					{/* <FirebaseSocial /> */}
// 				</Grid>
// 			</Grid>
// 		</FormContainer>
// 	);
// };

// export default AuthRegister;

// dx
