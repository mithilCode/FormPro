import { SyntheticEvent, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	Box,
	Button,
	CircularProgress,
	createFilterOptions,
	FilterOptionsState,
	Grid,
	Stack
} from '@mui/material';

import {
	AutocompleteElement,
	//CheckboxElement,
	//CheckboxButtonGroup,
	//DateTimePickerElement,
	FormContainer,
	//MultiSelectElement,
	TextFieldElement
	//TimePickerElement
} from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { zodResolver } from '@hookform/resolvers/zod';
import useThrottle from '@hooks/useThrottle';

// *** STATE *** //
import { useStateSlice } from '@pages/master/states/store/slice';
import { stateSelector } from '@pages/master/states/store/slice/state.selectors';
import { stateState } from '@pages/master/states/store/slice/types';

// *** COUNTRY *** //
import { useCountrySlice } from '@pages/master/countries/store/slice';
import { countrySelector } from '@pages/master/countries/store/slice/country.selectors';
import { countryState } from '@pages/master/countries/store/slice/types';
import { hasError, InitialState } from '@utils/helpers';
import useFocusOnEnter from '@hooks/useFocusOnEnter';

import { FormSchema, IFormInput } from '../models/City';
import { useCitySlice } from '../store/slice';
import { citySelector } from '../store/slice/city.selectors';

const stateFilter = createFilterOptions();
const countryFilter = createFilterOptions();

// ***==============================|| CITY ||==============================*** //

interface Props {
	passProps?: any;
	handleDrawerToggle?: any;
	edit?: boolean;
	selectedData?: any;
}

const City = ({ passProps, handleDrawerToggle, edit, selectedData }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: cityActions } = useCitySlice();
	const { actions: stateActions } = useStateSlice();
	const { actions: countryActions } = useCountrySlice();
	const { actions } = useSnackBarSlice();

	// *** CITY State *** //
	const cityState = useSelector(citySelector);
	const { addError, addSuccess, editError, editSuccess, getOneSuccess } = cityState;

	// *** State State *** //
	const stateState = useSelector(stateSelector);
	const { getError: getStateError, getSuccess: getStateSuccess } = stateState;

	// *** Country State *** //
	const countryState = useSelector(countrySelector);
	const { getError: getCountryError, getSuccess: getCountrySuccess } = countryState;

	// add your Locale  👿
	// const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		formState,
		formState: { errors, isSubmitting },
		reset,
		trigger,
		setError,
		setFocus
	} = formContext;

	// add your refrence  👿
	const formRef = useRef();

	// refrence for button shortkey
	const saveButtonRef = useRef<any>(null);
	const cancelButtonRef = useRef<any>(null);

	// for Tab key replace by Enter
	const { onEnterKey } = useFocusOnEnter(formRef, formContext.formState.errors);

	// hotkey for button shortkey
	let refPage = [
		useHotkeys<any>('alt+s', () => saveButtonRef.current.click()),
		useHotkeys<any>('alt+c', () => cancelButtonRef.current.click())
	];

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});

	const [stateLoading, setStateLoading] = useState(false);
	const [stateInputValue, setStateInputValue] = useState('');
	const [stateOptions, setStateOptions] = useState<stateState[]>([]);
	const throttledInputStateValue = useThrottle(stateInputValue, 400);

	const [countryLoading, setCountryLoading] = useState(false);
	const [countryInputValue, setCountryInputValue] = useState('');
	const [countryOptions, setCountryOptions] = useState<countryState[]>([]);
	const throttledInputCountryValue = useThrottle(countryInputValue, 400);

	// DHARMESH PATEL Multi Select Autocomplete Sample
	const [multiOptions, setMultiOptions] = useState<any[]>([]);

	useEffect(() => {
		if (edit) {
			dispatch(cityActions.getOne(selectedData));
		}

		// DHARMESH PATEL Multi Select Autocomplete Sample
		setMultiOptions([
			{ id: 1, name: 'dharmesh' },
			{ id: 2, name: 'patel' },
			{ id: 3, name: 'abc' },
			{ id: 4, name: 'bcd' },
			{ id: 5, name: 'cde' },
			{ id: 6, name: 'def' },
			{ id: 7, name: 'efg' }
		]);

		const timer = setTimeout(() => {
			setFocus('name');
			clearTimeout(timer);
		}, 500);

		return () => {
			dispatch(cityActions.reset());
			dispatch(stateActions.reset());
			dispatch(countryActions.reset());
		};
	}, []);

	// *** REDUCER *** //

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

	useEffect(() => {
		if (addSuccess || editSuccess) {
			passProps({
				type: addSuccess ? 'ADD' : 'EDIT',
				data: addSuccess ? addSuccess : editSuccess
			});

			dispatch(
				actions.openSnackbar({
					open: true,
					message: addSuccess ? 'City add successfully.' : 'City edit successfully.',
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
				dispatch(cityActions.reset());
				reset();
				const timer = setTimeout(() => {
					setFocus('name');
					clearTimeout(timer);
				}, 500);
			} else if (editSuccess) {
				const timer = setTimeout(() => {
					clearTimeout(timer);
					handleDrawerToggle();
				}, 700);
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
				setError('name', {
					message
				});
			}
		}
	}, [addError, editError]);

	useEffect(() => {
		if (getOneSuccess) {
			setPageState({
				isValid: false,
				values: getOneSuccess,
				touched: {},
				errors: {}
			});
			reset(getOneSuccess);
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
			setFocus(firstError as any);
		}
	}, [errors, setFocus]);

	// add your Event Handler ..., handleChange, OnSubmit  👿

	const onClose = () => {
		handleDrawerToggle();
	};

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

		dispatch(stateActions.reset());

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				state: StateVal
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
				country: CountryVal
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

	// DHARMESH PATEL Multi Select Autocomplete Sample
	const handleMultiChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				multi: newValue
			},
			touched: {
				...pageState.touched,
				multi: true
			}
		}));
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
			if (edit) {
				dispatch(cityActions.edit(pageState.values));
			} else {
				dispatch(cityActions.add(pageState.values));
			}
		}
	};

	return (
		<div ref={refPage as any} tabIndex={-1} style={{ outline: 'none' }}>
			<Box id="form-main" ref={formRef} onKeyUp={event => onEnterKey(event)}>
				<FormContainer
					onSuccess={() => onSubmit()}
					formContext={formContext}
					FormProps={{ autoComplete: 'off' }}>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Stack spacing={1}>
								<TextFieldElement
									id="name-city"
									name="name"
									label="Name"
									fullWidth
									onChange={handleChange}
									error={hasError<IFormInput>('name', formState, errors)}
									helperText={
										hasError<IFormInput>('name', formState, errors)
											? (errors['name'] as unknown as string)
											: ' '
									}
								/>
								<TextFieldElement
									id="short_name"
									name="short_name"
									label="Short Name"
									fullWidth
									onChange={handleChange}
									error={hasError<IFormInput>('short_name', formState, errors)}
									helperText={
										hasError<IFormInput>('short_name', formState, errors)
											? (errors['short_name'] as unknown as string)
											: ' '
									}
								/>
								<TextFieldElement
									id="code"
									name="code"
									label="Code"
									fullWidth
									onChange={handleChange}
									error={hasError<IFormInput>('code', formState, errors)}
									helperText={
										hasError<IFormInput>('code', formState, errors)
											? (errors['code'] as unknown as string)
											: ' '
									}
								/>
								<TextFieldElement
									id="sort_no"
									name="sort_no"
									label="Sort No."
									fullWidth
									onChange={handleChange}
									error={hasError<IFormInput>('sort_no', formState, errors)}
									helperText={
										hasError<IFormInput>('sort_no', formState, errors)
											? (errors['sort_no'] as unknown as string)
											: ' '
									}
								/>
							</Stack>
						</Grid>

						<Grid item xs={12}>
							<Stack spacing={1}>
								<AutocompleteElement
									loading={stateLoading}
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
											handleStateChange(event, value, reason, details),
										filterOptions: (options, state) =>
											handleStateFilterOptions(options, state),
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
											return option.name;
										},
										renderOption: (props, option) => (
											<Box
												component="li"
												sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
												{...props}>
												{option && option.short_name && (
													<img
														loading="lazy"
														width="20"
														src={`https://flagcdn.com/w20/${option.short_name.toLowerCase()}.png`}
														srcSet={`https://flagcdn.com/w40/${option.short_name.toLowerCase()}.png 2x`}
														alt=""
													/>
												)}
												{option.name}
											</Box>
										)
									}}
									// label={formatMessage({ id: 'State' })}
									label="State"
									name="state"
									options={stateOptions}
									textFieldProps={{
										InputProps: {
											//endAdornment: <>{InputProps.endAdornment}</>
										},
										// onKeyDown: e => hanldeAcOnKeyDown(e),
										onChange: e => setStateInputValue(e.target.value),
										onFocus: () => {
											if (stateOptions && stateOptions.length === 0) {
												dispatch(
													stateActions.get({
														QueryParams: `page=1&limit=10`
													})
												);
											}
										},
										error: hasError<IFormInput>('state', formState, errors),
										helperText: hasError<IFormInput>('state', formState, errors)
											? (errors['state'] as unknown as string)
											: ' '
									}}
								/>
							</Stack>
						</Grid>

						<Grid item xs={12}>
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
											return option.name;
										},
										renderOption: (props, option) => (
											<Box
												component="li"
												sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
												{...props}>
												{option && option.short_name && (
													<img
														loading="lazy"
														width="20"
														src={`https://flagcdn.com/w20/${option.short_name.toLowerCase()}.png`}
														srcSet={`https://flagcdn.com/w40/${option.short_name.toLowerCase()}.png 2x`}
														alt=""
													/>
												)}
												{option.name}
											</Box>
										)
									}}
									// label={formatMessage({ id: 'Country' })}
									label="Country"
									name="country"
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
													countryActions.get({
														QueryParams: `page=1&limit=10`
													})
												);
											}
										},
										error: hasError<IFormInput>('country', formState, errors),
										helperText: hasError<IFormInput>(
											'country',
											formState,
											errors
										)
											? (errors['country'] as unknown as string)
											: ' '
									}}
								/>
							</Stack>
						</Grid>
						{/* // DHARMESH PATEL Multi Select Autocomplete Sample */}
						<Grid item xs={12}>
							<Stack spacing={1}>
								<AutocompleteElement
									loading={countryLoading}
									multiple
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
											handleMultiChange(event, value, reason, details),
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
											return option.name;
										},
										renderOption: (props, option) => (
											<Box
												component="li"
												sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
												{...props}>
												{option.name}
											</Box>
										)
									}}
									label="multi"
									name="multi"
									options={multiOptions}
									textFieldProps={{
										InputProps: {
											//endAdornment: <>{InputProps.endAdornment}</>
										},
										// onKeyDown: e => hanldeAcOnKeyDown(e),
										onChange: e => setCountryInputValue(e.target.value),
										error: hasError<IFormInput>('multi', formState, errors),
										helperText: hasError<IFormInput>('multi', formState, errors)
											? (errors['multi'] as unknown as string)
											: ' '
									}}
								/>
							</Stack>
						</Grid>
						<button type="submit" hidden />
					</Grid>
				</FormContainer>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Stack
							direction="row"
							spacing={1}
							justifyContent="left"
							alignItems="center">
							<Button
								style={{ height: '30px', width: '70px' }}
								ref={saveButtonRef}
								onClick={e => handleSubmit(e)}
								onKeyDown={e => (e.key === 'Enter' ? handleSubmit(e) : '')}
								disableElevation
								disabled={isSubmitting}
								type="submit"
								variant="contained"
								color="primary">
								{isSubmitting ? (
									<CircularProgress size={24} color="success" />
								) : (
									'Save'
								)}
							</Button>
							<Button
								style={{ height: '30px', width: '70px' }}
								ref={cancelButtonRef}
								variant="outlined"
								color="secondary"
								onClick={onClose}>
								Cancel
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
};
export default City;
