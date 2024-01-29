import { SyntheticEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
	// 	Autocomplete,
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	Box,
	Button,
	createFilterOptions,
	// 	CardHeader,
	// 	Chip,
	Divider,
	FilterOptionsState,
	// 	FormHelperText,
	Grid,
	// 	InputLabel,
	// 	MenuItem,
	// 	Select,
	// 	SelectChangeEvent,
	Stack
	// 	TextField
} from '@mui/material';

import dayjs from 'dayjs';
import { KeyedObject } from 'types/root';
import { z } from 'zod';

import {
	AutocompleteElement,
	DatePickerElement,
	FormContainer,
	TextFieldElement
} from '@app/components/rhfmui';
// project import
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import MainCard from '@components/MainCard';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@hooks/useAuth';
import useThrottle from '@hooks/useThrottle';
// *** COUNTRY *** //
import { useCountrySlice } from '@pages/master/countries/store/slice';
import { countrySelector } from '@pages/master/countries/store/slice/country.selectors';
import { countryState } from '@pages/master/countries/store/slice/types';
import { useUserSlice } from '@pages/profile/store/user/slice';
import { userSelector } from '@pages/profile/store/user/slice/user.selectors';
import { difference, hasError } from '@utils/helpers';

interface InitialState {
	isValid: boolean;
	values: KeyedObject;
	touched: KeyedObject | null;
	errors: KeyedObject | null;
}

// // styles & constant
// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
// 	PaperProps: {
// 		style: {
// 			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
// 		}
// 	}
// };

// add your validation requirements 👿
const FormSchema = z.object({
	// FirstName: z.string().max(32, 'FirsName must be less than 32 characters').optional(),
	FirstName: z
		.string({ required_error: 'FirstName is required' })
		.min(1, { message: 'FirstName is required' })
		.max(32, 'FirsName must be less than 32 characters'),
	LastName: z.string().max(32, 'LastName must be less than 32 characters').optional(),
	Email: z.string().email({ message: 'Must be a valid email' }).optional(),
	DOB: z.coerce
		.date()
		.refine(data => data < new Date(), { message: 'Start date must be in the past' })
		.optional(),
	MobileNumber: z.union([
		z.literal(''),
		z
			.string()
			.min(8, { message: 'Mobile number must be atleast 8 characters' })
			.regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)
	]),
	Country: z
		.object({
			idCountry: z.string({ required_error: 'Country is required' }),
			Name: z.string().nullable().optional(),
			Code: z.string().nullable().optional()
		})
		.nullable()
		.default(null),
	Avatar: z.union([z.literal(''), z.string().trim().url()])
});

type IFormInput = z.infer<typeof FormSchema>;

const filter = createFilterOptions();

// ==============================|| TAB - PERSONAL ||============================== //

const TabPersonal = () => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions } = useSnackBarSlice();
	const { actions: countryActions } = useCountrySlice();
	const { actions: userActions } = useUserSlice();

	// *** User Profile State *** //
	const userState = useSelector(userSelector);
	const {
		getError: getOneProfileError,
		getSuccess: getOneProfileSuccess,
		editError,
		editSuccess
	} = userState;

	// *** Country State *** //
	const countryState = useSelector(countrySelector);
	const { getError: getCountryError, getSuccess: getCountrySuccess } = countryState;

	const { updateProfile } = useAuth();

	// add your Locale  👿
	const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onSubmit',
		reValidateMode: 'onSubmit'
	});

	const {
		formState,
		formState: { errors, isSubmitting },
		setFocus,
		reset
	} = formContext;

	// const { miniDrawer, themeDirection, onChangeDirection, onChangeMiniDrawer, menuOrientation } =
	// 	useConfig();

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});
	const [countryLoading, setCountryLoading] = useState(false);
	// const [countryValue] = useState<countryState>([]); // , setCountryValue
	const [countryInputValue, setCountryInputValue] = useState('');
	const [countryOptions, setCountryOptions] = useState<countryState[]>([]);

	const throttledInputCountryValue = useThrottle(countryInputValue, 400);

	// add your useEffect ( Order must be empty dependancy first, ... , success, error)  👿

	useEffect(() => {
		dispatch(userActions.getOneProfile({}));
		// dispatch(organisationActions.get({}));

		return () => {
			dispatch(userActions.reset());
			dispatch(countryActions.reset());
		};
	}, []);

	// *** COUNTRY EFFECT*** //

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

	// *** PROFILE *** //

	useEffect(() => {
		if (getOneProfileSuccess) {
			console.log('Profile Success', getOneProfileSuccess.DOB);
			const getProfile = { ...getOneProfileSuccess };
			getProfile.DOB = dayjs(getOneProfileSuccess.DOB) as any;

			// setCountryValue({
			// 	id: getOneProfileSuccess.id,
			// 	idCountry: getOneProfileSuccess.id,
			// 	label: getOneProfileSuccess.label,
			// 	code: getOneProfileSuccess.code
			// });

			// setCountryValue(getOneProfileSuccess.CountryName);

			// if (!getOneProfileSuccess.Country) {
			// 	getProfile.Country = [];
			// } else {
			// 	const newArr: any[] = [];
			// 	const { Country } = getOneProfileSuccess;
			// 	// eslint-disable-next-line func-names
			// 	Country.forEach(function (item: any) {
			// 		const obj = { ...item, Name: item.NiceName };
			// 		newArr.push(obj);
			// 	});
			// 	setCountryValue(newArr);
			// 	getProfile.Country = newArr;
			// }

			console.log('GET PROFILE', getProfile);

			reset(getProfile);

			setPageState(value => ({
				...value,
				values: getOneProfileSuccess
			}));
		}
	}, [getOneProfileSuccess]);

	useEffect(() => {
		if (getOneProfileError) {
			console.log('Profile Error', getOneProfileError);
			// setOrganisations([]);
		}
	}, [getOneProfileError]);

	// *** EDIT *** //

	useEffect(() => {
		if (editSuccess) {
			console.log('apiSuccess', editSuccess);
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Profile Update successfully.',
					variant: 'alert',
					alert: {
						color: 'success'
					},
					close: false
				})
			);
			setPageState({
				isValid: false,
				values: editSuccess,
				touched: null,
				errors: null
			});
			dispatch(userActions.reset());
			reset(editSuccess);

			const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
				setFocus('FirstName');
				clearTimeout(timeout);
				updateProfile(editSuccess);
			}, 200);
		}
	}, [editSuccess]);

	useEffect(() => {
		if (editError) {
			const { message } = editError.error;

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
		// setState(authState);
	}, [editError]);

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

	// *** COUNTRY HANDLER *** //

	const handleFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
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

		console.log('FILTERED', filtered);

		return filtered;
	};

	const handleCountryChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		// const CountryVal = newValue ? newValue : null;

		const CountryVal = {
			idCountry: newValue && newValue.idCountry ? newValue.idCountry : null,
			Name: newValue && newValue.Name ? newValue.Name : '',
			Code: newValue && newValue.Code ? newValue.Code : ''
		};

		console.log('newVALUE', newValue);
		console.log('reason', reason);
		console.log('details', details);

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

	const onSubmit: SubmitHandler<IFormInput> = async data => {
		console.log('SUBMIT', data, pageState);
		console.log('formState Touch', formState.touchedFields);
		console.log('formState Dirty', formState.dirtyFields);

		const dirtyPageState = difference(pageState.values, formState.dirtyFields);

		if (Object.keys(dirtyPageState).length > 0) {
			dispatch(userActions.edit(dirtyPageState));
		} else {
			console.log('Nothing to be change');
		}

		// const assignState = {
		// 	...diffFormState,
		// 	...{
		// 		ParentCompany,
		// 		idEmployee: formState.values.idEmployee,
		// 		Regions: formState.values.Regions
		// 	}
		// };

		console.log('dirtyPageState', dirtyPageState);
	};

	return (
		<MainCard
			content={false}
			title="Personal Information"
			sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}>
			<FormContainer
				onSuccess={data => onSubmit(data)}
				formContext={formContext}
				FormProps={{ autoComplete: 'off' }}>
				<Box sx={{ p: 2.5 }}>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6}>
							<Stack spacing={1.25}>
								<TextFieldElement
									id="firstname-personal"
									type="firstname"
									name="FirstName"
									label={formatMessage({ id: 'FirstName' })}
									fullWidth
									onChange={handleChange}
									error={hasError<IFormInput>('FirstName', formState, errors)}
									helperText={
										hasError<IFormInput>('FirstName', formState, errors)
											? (errors['FirstName'] as unknown as string)
											: ' '
									}
									autoFocus
								/>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Stack spacing={1.25}>
								<TextFieldElement
									id="firstname-personal"
									type="lastname"
									name="LastName"
									label={formatMessage({ id: 'LastName' })}
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
						<Grid item xs={12} sm={6}>
							<Stack spacing={1.25}>
								<TextFieldElement
									id="email-personal"
									type="email"
									name="Email"
									label={formatMessage({ id: 'Email' })}
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
						<Grid item xs={12} sm={6}>
							<Stack spacing={1.25}>
								<DatePickerElement
									label={formatMessage({ id: 'DOB' })}
									name="DOB"
									format="DD/MM/YYYY"
									onChange={newValue => handleDateChange(newValue)}
									slotProps={{
										textField: {
											variant: 'filled',
											size: 'small',
											error: hasError<IFormInput>('DOB', formState, errors),
											helperText: hasError<IFormInput>(
												'DOB',
												formState,
												errors
											)
												? (errors['DOB'] as unknown as string)
												: ' '
										}
									}}
									helperText=" "
								/>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Stack spacing={1.25}>
								<TextFieldElement
									id="mobilenumber-personal"
									type="mobilenumber"
									name="MobileNumber"
									label={formatMessage({ id: 'MobileNumber' })}
									fullWidth
									onChange={handleChange}
									error={hasError<IFormInput>('MobileNumber', formState, errors)}
									helperText={
										hasError<IFormInput>('MobileNumber', formState, errors)
											? (errors['MobileNumber'] as unknown as string)
											: ' '
									}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Stack spacing={1.25}>
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
												dispatch(
													countryActions.get({ QueryParams: `limit=10` })
												);
											}
										},
										error: hasError<IFormInput>('Country', formState, errors),
										helperText: hasError<IFormInput>(
											'Country',
											formState,
											errors
										)
											? (errors['Country'] as unknown as string)
											: ' '
									}}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={1.25}>
								<TextFieldElement
									id="avatar-personal"
									type="avatar"
									name="Avatar"
									label={formatMessage({ id: 'Avatar' }) + ' *'}
									fullWidth
									onChange={handleChange}
									error={hasError<IFormInput>('Avatar', formState, errors)}
									helperText={
										hasError<IFormInput>('Avatar', formState, errors)
											? (errors['Avatar'] as unknown as string)
											: ' '
									}
								/>
							</Stack>
						</Grid>
					</Grid>
				</Box>
				<Divider />
				<Box sx={{ p: 2.5 }}>
					<Stack
						direction="row"
						justifyContent="flex-end"
						alignItems="center"
						spacing={2}
						sx={{ mt: 2.5 }}>
						<Button variant="outlined" color="secondary">
							Cancel
						</Button>
						<Button disabled={isSubmitting} type="submit" variant="contained">
							Save
						</Button>
					</Stack>
				</Box>
			</FormContainer>
		</MainCard>
	);
};

export default TabPersonal;
