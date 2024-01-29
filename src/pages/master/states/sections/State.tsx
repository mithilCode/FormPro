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

import { AutocompleteElement, FormContainer, TextFieldElement } from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { zodResolver } from '@hookform/resolvers/zod';
import useThrottle from '@hooks/useThrottle';
import useFocusOnEnter from '@hooks/useFocusOnEnter';
// *** COUNTRY *** //
import { useCountrySlice } from '@pages/master/countries/store/slice';
import { countrySelector } from '@pages/master/countries/store/slice/country.selectors';
import { countryState } from '@pages/master/countries/store/slice/types';
import { hasError, InitialState } from '@utils/helpers'; // difference
import { FormSchema, IFormInput } from '../models/State';
import { useStateSlice } from '../store/slice';
import { stateSelector } from '../store/slice/state.selectors';

const filter = createFilterOptions();

// ==============================|| STATE ||============================== //

interface Props {
	passProps?: any;
	handleDrawerToggle?: any;
	edit?: boolean;
	selectedData?: any;
}

const State = ({ passProps, handleDrawerToggle, edit, selectedData }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: stateActions } = useStateSlice();
	const { actions: countryActions } = useCountrySlice();
	const { actions } = useSnackBarSlice();

	// *** State State *** //
	const stateState = useSelector(stateSelector);
	const { addError, addSuccess, editError, editSuccess, getOneSuccess } = stateState;

	// *** Country State *** //
	const countryState = useSelector(countrySelector);
	const { getError: getCountryError, getSuccess: getCountrySuccess } = countryState;

	const [countryLoading, setCountryLoading] = useState(false);
	const [countryInputValue, setCountryInputValue] = useState('');
	const [countryOptions, setCountryOptions] = useState<countryState[]>([]);

	const throttledInputCountryValue = useThrottle(countryInputValue, 400);

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

	useEffect(() => {
		if (edit) {
			dispatch(stateActions.getOne(selectedData));
		}

		const timer = setTimeout(() => {
			setFocus('name');
			clearTimeout(timer);
		}, 500);

		return () => {
			dispatch(stateActions.reset());
			dispatch(countryActions.reset());
		};
	}, []);

	// *** REDUCER *** //

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
					message: addSuccess ? 'State add successfully.' : 'State edit successfully.',
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
				dispatch(stateActions.reset());
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

	// *** EVENT HANDDLERS  👿

	// add your Event Handler ..., handleChange, OnSubmit  👿

	const onClose = () => {
		handleDrawerToggle();
	};

	const handleFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = filter(options, state);
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

		dispatch(countryActions.reset());

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
				dispatch(stateActions.edit(pageState.values));
			} else {
				dispatch(stateActions.add(pageState.values));
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
									id="name-state"
									name="name"
									// label={formatMessage({ id: 'name' }) + ' *'}
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
									// label={formatMessage({ id: 'name' }) + ' *'}
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
									// label={formatMessage({ id: 'name' }) + ' *'}
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
									// label={formatMessage({ id: 'name' }) + ' *'}
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
										InputProps: {},
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

export default State;
