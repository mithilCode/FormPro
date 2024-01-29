import { SyntheticEvent, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
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
	Stack,
	Typography
} from '@mui/material';

import {
	AutocompleteElement,
	FormContainer,
	TextFieldElement
	// TimePickerElement
} from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { zodResolver } from '@hookform/resolvers/zod';
import useThrottle from '@hooks/useThrottle';

// *** CITY *** //
import { useCitySlice } from '@pages/master/cities/store/slice';
import { citySelector } from '@pages/master/cities/store/slice/city.selectors';
import { cityState } from '@pages/master/cities/store/slice/types';

// *** COUNTRY *** //
import { useCountrySlice } from '@pages/master/countries/store/slice';
import { countrySelector } from '@pages/master/countries/store/slice/country.selectors';
import { countryState } from '@pages/master/countries/store/slice/types';
import { InitialState } from '@utils/helpers';
import { FormSchema, IFormInput } from '../models/Tender';
import { useTenderSlice } from '../store/slice';
import { tenderSelector } from '../store/slice/tender.selectors';
import { tenderState } from '../store/slice/types';
import { useHotkeys } from 'react-hotkeys-hook';
import useFocusOnEnter from '@hooks/useFocusOnEnter';

import './tender.css';

const stateFilter = createFilterOptions();
const countryFilter = createFilterOptions();

// ***==============================|| TENDER ||==============================*** //

interface Props {
	passProps?: any;
	handleDrawerToggle?: any;
	edit?: boolean;
	selectedData?: any;
}

// static opetionSet
const staticOptions = ['AUCTION', 'TENDER'];

const Tender = ({ passProps, handleDrawerToggle, edit, selectedData }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const { actions: tenderActions } = useTenderSlice();
	const { actions: cityActions } = useCitySlice();
	const { actions: countryActions } = useCountrySlice();
	const { actions } = useSnackBarSlice();

	// *** TENDER State *** //
	const tenderState = useSelector(tenderSelector);
	const {
		addError,
		addSuccess,
		editError,
		editSuccess,
		getOneSuccess,
		getSupplierSuccess,
		getSupplierError
	} = tenderState;

	// *** City State *** //
	const cityState = useSelector(citySelector);
	const { getError: getCityError, getSuccess: getCitySuccess } = cityState;

	// *** Country State *** //
	const countryState = useSelector(countrySelector);
	const { getError: getCountryError, getSuccess: getCountrySuccess } = countryState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		// formState,
		formState: { errors, isSubmitting },
		reset,
		trigger,
		// setError,
		setFocus
	} = formContext;

	// add your TENDER  👿
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

	const [cityLoading, setCityLoading] = useState(false);
	const [cityInputValue, setCityInputValue] = useState('');
	const [cityOptions, setCityOptions] = useState<cityState[]>([]);
	const throttledInputCityValue = useThrottle(cityInputValue, 400);

	const [countryLoading, setCountryLoading] = useState(false);
	const [countryInputValue, setCountryInputValue] = useState('');
	const [countryOptions, setCountryOptions] = useState<countryState[]>([]);
	const throttledInputCountryValue = useThrottle(countryInputValue, 400);

	const [supplierLoading, setSupplierLoading] = useState(false);
	const [supplierInputValue, setSupplierInputValue] = useState('');
	const [supplierOptions, setSupplierOptions] = useState<tenderState[]>([]);
	const throttledInputSupplierValue = useThrottle(supplierInputValue, 400);

	useEffect(() => {
		if (edit) {
			dispatch(tenderActions.getOne(selectedData));
		}
		const timer = setTimeout(() => {
			clearTimeout(timer);
			onFirstElementFocus();
		}, 500);
		return () => {
			dispatch(tenderActions.reset());
			dispatch(cityActions.reset());
			dispatch(countryActions.reset());
		};
	}, []);

	// *** REDUCER *** //

	// *** STATE *** //

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
		if (throttledInputCityValue === '' && pageState?.touched?.State) {
			setCityLoading(true);
			dispatch(cityActions.get({ QueryParams: `limit=10` }));
			return undefined;
		} else if (throttledInputCityValue !== '') {
			setCityLoading(true);
			dispatch(cityActions.get({ QueryParams: `q=${throttledInputCityValue}` }));
		}
	}, [throttledInputCityValue]);

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
		dispatch(tenderActions.reset());
		if (throttledInputSupplierValue === '' && pageState?.touched?.supplier) {
			setSupplierLoading(true);
			dispatch(
				tenderActions.getSupplier({ QueryParams: `pagination=false&q=supplier='true'` })
			);
			return undefined;
		} else if (throttledInputSupplierValue !== '') {
			setSupplierLoading(true);
			dispatch(
				tenderActions.getSupplier({
					QueryParams: `q=supplier='True' and name like '%${throttledInputSupplierValue}%'`
				})
			);
		}
	}, [throttledInputSupplierValue]);

	useEffect(() => {
		if (addSuccess || editSuccess) {
			passProps({
				type: addSuccess ? 'ADD' : 'EDIT',
				data: addSuccess ? addSuccess : editSuccess
			});

			dispatch(
				actions.openSnackbar({
					open: true,
					message: addSuccess ? 'Tender add successfully.' : 'Tender edit successfully.',
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
				dispatch(tenderActions.reset());
				reset();
				handleDrawerToggle();
			} else if (editSuccess) {
				const timer = setTimeout(() => {
					clearTimeout(timer);
					handleDrawerToggle();
				}, 700);
			}
		}
	}, [addSuccess, editSuccess]);

	// addError or EditError
	useEffect(() => {
		if (addError || editError) {
			const errorMessage =
				(addError?.error?.errors?.[0] ?? editError?.error?.errors?.[0]) || '';

			if (errorMessage) {
				dispatch(
					actions.openSnackbar({
						open: true,
						message: errorMessage,
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

	const onClose = () => {
		handleDrawerToggle();
	};

	const handleStateFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = stateFilter(options, state);

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

		dispatch(cityActions.reset());

		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				city: CityVal
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

	// supplier change
	const handleSupplierChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const SupplierVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			supplier: newValue && newValue.name ? newValue.name : ''
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
				tenderActions.getSupplier({ QueryParams: `pagination=false&q=supplier='true` })
			);
		}
	};

	// TYPE change
	const handleStaticChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				tender_type: newValue
			},
			touched: {
				...pageState.touched,
				tender_type: true
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
					event.target.type === 'checkbox'
						? event.target.checked
						: event.target.value.toUpperCase()
			},
			touched: {
				...pageState.touched,
				[event.target.name]: true
			}
		}));
	};

	// submit change
	const onSubmit = async () => {};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		const validation = await trigger();
		if (validation) {
			const updatedValues = { ...pageState.values };

			if (updatedValues.result_only_date && updatedValues.result_only_time) {
				updatedValues.result_time = `${updatedValues.result_only_date}T${updatedValues.result_only_time}`;
			} else if (updatedValues.result_only_date) {
				updatedValues.result_time = `${updatedValues.result_only_date}`;
			} else {
				updatedValues.result_time = null;
			}

			if (updatedValues.local_result_only_date && updatedValues.local_result_only_time) {
				updatedValues.local_result_time = `${updatedValues.local_result_only_date}T${updatedValues.local_result_only_time}`;
			} else if (updatedValues.local_result_only_date) {
				updatedValues.local_result_time = `${updatedValues.local_result_only_date}`;
			} else {
				updatedValues.local_result_time = null;
			}

			if (edit) {
				dispatch(tenderActions.edit(updatedValues));
			} else {
				dispatch(tenderActions.add(updatedValues));
			}
		}
	};

	return (
		<>
			<div className="tender-main-container">
				<Box id="form-main" ref={formRef} onKeyUp={(event: any) => onEnterKey(event)}>
					<FormContainer
						onSuccess={() => onSubmit()}
						formContext={formContext}
						FormProps={{ autoComplete: 'off' }}>
						<Grid container spacing={1}>
							<Grid item xs={12}>
								<Grid container alignItems="center">
									<Grid item xs={2}>
										<Typography variant="subtitle1">Supplier Name*</Typography>
									</Grid>
									<Grid item xs={5} className="error-hide-supplier">
										<AutocompleteElement
											loading={supplierLoading}
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
															tenderActions.getSupplier({
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

							<Grid item xs={6}>
								<Grid container alignItems="center">
									<Grid item xs={4}>
										<Typography variant="subtitle1">Tender No.</Typography>
									</Grid>
									<Grid item xs={8}>
										<TextFieldElement
											className="custom-textfield"
											name="tender_no"
											onChange={handleChange}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={6}>
								<Grid container alignItems="center">
									<Grid item xs={4}>
										<Typography variant="subtitle1">Type</Typography>
									</Grid>
									<Grid item xs={8} className="error-hide-type">
										<AutocompleteElement
											loading={false}
											options={staticOptions}
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
												onChange: (event, value, reason, details) =>
													handleStaticChange(
														event,
														value,
														reason,
														details
													),
												getOptionLabel: option => option
											}}
											name="tender_type"
											textFieldProps={{
												InputProps: {}
											}}
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={6}>
								<Grid container alignItems="center">
									<Grid item xs={4}>
										<Typography variant="subtitle1">Name</Typography>
									</Grid>
									<Grid item xs={8}>
										<TextFieldElement
											className="custom-textfield"
											name="tender_name"
											fullWidth
											onChange={handleChange}
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={6}>
								<Grid container alignItems="center">
									<Grid item xs={4}>
										<Typography variant="subtitle1">Sub Name</Typography>
									</Grid>
									<Grid item xs={8}>
										<TextFieldElement
											className="custom-textfield"
											name="sub_tender_name"
											onChange={handleChange}
											fullWidth
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={6}>
								<Grid container alignItems="center">
									<Grid item xs={4}>
										<Typography variant="subtitle1">Start Date</Typography>
									</Grid>
									<Grid item xs={8}>
										<TextFieldElement
											type="date"
											className="custom-textfield-date"
											name="start_date"
											onChange={handleChange}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={6}>
								<Grid container alignItems="center">
									<Grid item xs={4}>
										<Typography variant="subtitle1">End Date</Typography>
									</Grid>
									<Grid item xs={8}>
										<TextFieldElement
											type="date"
											className="custom-textfield-date"
											name="end_date"
											onChange={handleChange}
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={6}>
								<Grid container alignItems="center">
									<Grid item xs={4}>
										<Typography variant="subtitle1">Result Date</Typography>
									</Grid>
									<Grid item xs={8}>
										<TextFieldElement
											type="date"
											className="custom-textfield-date"
											name="result_only_date"
											onChange={handleChange}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={6}>
								<Grid container alignItems="center">
									<Grid item xs={4}>
										<Typography variant="subtitle1">Result Time</Typography>
									</Grid>
									<Grid item xs={8}>
										<TextFieldElement
											type="time"
											className="custom-textfield-time"
											name="result_only_time"
											onChange={handleChange}
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={6}>
								<Grid container alignItems="center">
									<Grid item xs={4}>
										<Typography variant="subtitle1">Local Date</Typography>
									</Grid>
									<Grid item xs={8}>
										<TextFieldElement
											type="date"
											className="custom-textfield-date"
											name="local_result_only_date"
											onChange={handleChange}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={6}>
								<Grid container alignItems="center">
									<Grid item xs={4}>
										<Typography variant="subtitle1">Local Time</Typography>
									</Grid>
									<Grid item xs={8}>
										<TextFieldElement
											type="time"
											className="custom-textfield-time"
											name="local_result_only_time"
											onChange={handleChange}
										/>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={6}>
								<Grid container alignItems="center">
									<Grid item xs={4}>
										<Typography variant="subtitle1">Country</Typography>
									</Grid>
									<Grid item xs={8}>
										<AutocompleteElement
											loading={countryLoading}
											classname="country-auto"
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
													handleCountryChange(
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
											name="country"
											options={countryOptions}
											textFieldProps={{
												InputProps: {},
												onChange: e => setCountryInputValue(e.target.value),
												onFocus: () => {
													if (
														countryOptions &&
														countryOptions.length === 0
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
										<Typography variant="subtitle1">City</Typography>
									</Grid>
									<Grid item xs={8} className="city-auto">
										<AutocompleteElement
											loading={cityLoading}
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
													handleCityChange(event, value, reason, details),
												filterOptions: (options, state) =>
													handleStateFilterOptions(options, state),
												getOptionLabel: option => {
													if (typeof option === 'string') {
														return option;
													}
													if (option.inputValue) {
														return option.inputValue;
													}
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
											name="city"
											options={cityOptions}
											textFieldProps={{
												InputProps: {},

												onChange: e => setCityInputValue(e.target.value),
												onFocus: () => {
													if (cityOptions && cityOptions.length === 0) {
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

							<Grid item xs={12}>
								<Grid container alignItems="center">
									<Grid item xs={2}>
										<Typography variant="subtitle1">Comment</Typography>
									</Grid>
									<Grid item xs={10}>
										<TextFieldElement
											className="comment-css"
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
export default Tender;
