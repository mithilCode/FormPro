import { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import {
	Grid,
	Typography,
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	FilterOptionsState,
	createFilterOptions,
	Box
	// FormControlLabel,
	// Checkbox
} from '@mui/material';

import { AutocompleteElement, FormContainer, TextFieldElement } from '@components/rhfmui';
import { FormSchema, IFormInput } from '../models/Address';

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

import { InitialState } from '@utils/helpers';
import useThrottle from '@hooks/useThrottle';
// import { Button } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';

const countryFilter = createFilterOptions();
const stateFilter = createFilterOptions();

interface Props {
	passProps?: any;
	selectedData?: any | null;
	editMode?: any;
	addressOptions?: any;
	currentAction?: any;
	// action: string;
}

const Address = ({ passProps, selectedData, addressOptions, editMode, currentAction }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: countryActions } = useCountrySlice();
	const { actions: stateActions } = useStateSlice();
	const { actions: cityActions } = useCitySlice();

	// *** Country State *** //
	const countryState = useSelector(countrySelector);
	const { getError: getCountryError, getSuccess: getCountrySuccess } = countryState;

	// *** State State *** //
	const stateState = useSelector(stateSelector);
	const { getError: getStateError, getSuccess: getStateSuccess } = stateState;

	// *** City State *** //
	const cityState = useSelector(citySelector);
	const { getError: getCityError, getSuccess: getCitySuccess } = cityState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const { reset } = formContext;

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});

	//country
	const [countryLoading, setCountryLoading] = useState(false);
	const [countryInputValue, setCountryInputValue] = useState('');
	const [countryOptions, setCountryOptions] = useState<countryState[]>([]);
	const throttledInputCountryValue = useThrottle(countryInputValue, 400);

	//state
	const [stateLoading, setStateLoading] = useState(false);
	const [stateInputValue, setStateInputValue] = useState('');
	const [stateOptions, setStateOptions] = useState<stateState[]>([]);
	const throttledInputStateValue = useThrottle(stateInputValue, 400);

	//city
	const [cityLoading, setCityLoading] = useState(false);
	const [cityInputValue, setCityInputValue] = useState('');
	const [cityOptions, setCityOptions] = useState<cityState[]>([]);
	const throttledInputCityValue = useThrottle(cityInputValue, 400);

	//Date

	useEffect(() => {
		return () => {
			reset();
		};
	}, []);

	useEffect(() => {
		if (
			currentAction &&
			(currentAction === 'Add' ||
				currentAction === 'Save' ||
				currentAction === 'Cancel' ||
				currentAction === 'View' ||
				currentAction === 'View1')
		) {
			reset({
				name_address: [{ address_1: null }] as any
			});
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});
			setPageState(value => ({
				...value,
				values: {
					address_type: 'BILLING'
				}
			}));
		}
	}, [currentAction]);

	useEffect(() => {
		if (selectedData && selectedData.type && addressOptions) {
			const addrArrIndex = addressOptions.findIndex(
				(obj: any) => obj.address_type === selectedData.type
			);

			if (addrArrIndex < 0) {
				setTimeout(() => {
					setPageState(pageState => ({
						...pageState,
						values: {
							//...pageState.values,
							address_type: selectedData.type
						}
					}));
					reset(selectedData);
				}, 0);
			} else {
				setTimeout(() => {
					reset(addressOptions[addrArrIndex]);

					setPageState(pageState => ({
						...pageState,
						values: {
							...pageState.values,
							...addressOptions[addrArrIndex]
						}
					}));
				}, 0);
			}
		}
	}, [selectedData]);

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

	const handleFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = countryFilter(options, state);

		return filtered;
	};

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
		if (getStateError) {
			setCityOptions([]);
		}
		setCityLoading(false);
	}, [getCityError, getCitySuccess]);

	useEffect(() => {
		dispatch(cityActions.reset());
		if (throttledInputCityValue === '' && pageState?.touched?.State) {
			setStateLoading(true);
			dispatch(cityActions.get({ QueryParams: `limit=10` }));
			return undefined;
		} else if (throttledInputCityValue !== '') {
			setStateLoading(true);
			dispatch(cityActions.get({ QueryParams: `q=${throttledInputCityValue}` }));
		}
	}, [throttledInputCityValue]);

	const handleStateFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = stateFilter(options, state);

		return filtered;
	};

	const handleCountryChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
		// arrName: any
	) => {
		const CountryVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
			// code: newValue && newValue.code ? newValue.code : ''
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

		let addrArrIndex = -1;
		if (addressOptions) {
			addrArrIndex = addressOptions.findIndex(
				(obj: any) => obj.address_type === selectedData.type
			);
		}
		const action =
			currentAction === 'Add' || (currentAction === 'Edit' && addrArrIndex == -1)
				? 'insert'
				: 'update';

		passProps({
			type: selectedData?.type,
			data: { ...pageState.values, country: CountryVal, action }
		});
		// if (addressOptions) {
		// 	setTimeout(() => {
		// 		reset(addressOptions[addrArrIndex]);

		// 		setPageState(pageState => ({
		// 			...pageState,
		// 			values: {
		// 				...pageState.values,
		// 				...addressOptions[addrArrIndex]
		// 			}
		// 		}));
		// 	}, 0);
		// }

		if (!newValue) {
			dispatch(countryActions.get({ QueryParams: `page=1&limit=10` }));
		}
	};

	const handleStateChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
		// arrName: any
	) => {
		const StateVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
			// code: newValue && newValue.code ? newValue.code : ''
		};

		//dispatch(stateActions.reset());

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

		let addrArrIndex = -1;
		if (addressOptions) {
			addrArrIndex = addressOptions.findIndex(
				(obj: any) => obj.address_type === selectedData.type
			);
		}
		const action =
			currentAction === 'Add' || (currentAction === 'Edit' && addrArrIndex == -1)
				? 'insert'
				: 'update';

		passProps({
			type: selectedData?.type,
			data: { ...pageState.values, state: StateVal, action }
		});
		// if (addressOptions) {
		// 	setTimeout(() => {
		// 		reset(addressOptions[addrArrIndex]);

		// 		setPageState(pageState => ({
		// 			...pageState,
		// 			values: {
		// 				...pageState.values,
		// 				...addressOptions[addrArrIndex]
		// 			}
		// 		}));
		// 	}, 0);
		// }

		if (!newValue) {
			dispatch(stateActions.get({ QueryParams: `page=1&limit=10` }));
		}
	};

	//city
	const handleCityChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		const CityVal = {
			seq_no: newValue && newValue.seq_no ? newValue.seq_no : null,
			name: newValue && newValue.name ? newValue.name : ''
			// code: newValue && newValue.code ? newValue.code : ''
		};

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

		let addrArrIndex = -1;
		if (addressOptions) {
			addrArrIndex = addressOptions.findIndex(
				(obj: any) => obj.address_type === selectedData.type
			);
		}
		const action =
			currentAction === 'Add' || (currentAction === 'Edit' && addrArrIndex == -1)
				? 'insert'
				: 'update';

		passProps({
			type: selectedData?.type,
			data: { ...pageState.values, city: CityVal, action }
		});
		// if (addressOptions) {
		// 	setTimeout(() => {
		// 		reset(addressOptions[addrArrIndex]);

		// 		setPageState(pageState => ({
		// 			...pageState,
		// 			values: {
		// 				...pageState.values,
		// 				...addressOptions[addrArrIndex]
		// 			}
		// 		}));
		// 	}, 0);
		// }
		if (!newValue) {
			dispatch(cityActions.get({ QueryParams: `page=1&limit=10` }));
		}
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

		let addrArrIndex = -1;
		if (addressOptions) {
			addrArrIndex = addressOptions.findIndex(
				(obj: any) => obj.address_type === selectedData.type
			);
		}
		const action =
			currentAction === 'Add' || (currentAction === 'Edit' && addrArrIndex == -1)
				? 'insert'
				: 'update';

		passProps({
			type: selectedData?.type,
			data: { ...pageState.values, action }
		});
	};

	// const handleClick = (event: any) => {
	// 	event.persist();
	// 	let addrArrIndex = -1;
	// 	if (addressOptions) {
	// 		addrArrIndex = addressOptions.findIndex(
	// 			(obj: any) => obj.address_type === selectedData.type
	// 		);
	// 	}
	// 	const action =
	// 		currentAction === 'Add' || (currentAction === 'Edit' && addrArrIndex == -1)
	// 			? 'insert'
	// 			: 'update';

	// 	reset(pageState.values);

	// 	passProps({
	// 		type: selectedData?.type,
	// 		data: { ...pageState.values, action }
	// 	});

	// 	setPageState({
	// 		isValid: false,
	// 		values: {},
	// 		touched: null,
	// 		errors: null
	// 	});

	// 	// reset();
	// };

	// const onSubmit = async () => {};

	return (
		<FormContainer
			// onSuccess={() => onSubmit()}
			formContext={formContext}
			FormProps={{ autoComplete: 'off' }}>
			<Grid container spacing={0.5}>
				<fieldset className="fieldset-size-second">
					<legend>
						<span style={{ textTransform: 'capitalize' }}>
							{selectedData?.type?.toLowerCase()}
						</span>{' '}
						Address
					</legend>
					<Grid container>
						<Grid
							item
							xs={5}
							container
							spacing={0.5}
							alignItems="center"
							id="textfield-margin">
							<Grid item xs={2.3}>
								<Typography variant="subtitle1">Address</Typography>
							</Grid>
							<Grid item xs={9}>
								<TextFieldElement
									className={`custom-textfield ${
										!editMode ? 'disabled-textfield' : ''
									}`}
									disabled={!editMode}
									fullWidth
									variant="outlined"
									placeholder="Enter address"
									name="address_1"
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={2.3}>
								<Typography variant="subtitle1"></Typography>
							</Grid>
							<Grid item xs={9}>
								<TextFieldElement
									className={`custom-textfield ${
										!editMode ? 'disabled-textfield' : ''
									}`}
									disabled={!editMode}
									fullWidth
									variant="outlined"
									placeholder="Enter address"
									name="address_2"
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={2.3}>
								<Typography variant="subtitle1"></Typography>
							</Grid>
							<Grid item xs={9}>
								<TextFieldElement
									className={`custom-textfield ${
										!editMode ? 'disabled-textfield' : ''
									}`}
									disabled={!editMode}
									fullWidth
									variant="outlined"
									placeholder="Enter address"
									name="address_3"
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={2.3}>
								<Typography variant="subtitle1">Country</Typography>
							</Grid>
							<Grid item xs={3.4}>
								<AutocompleteElement
									loading={countryLoading}
									classname={`custom-textfield ${
										!editMode ? 'disabled-textfield' : 'custom-textfield'
									}`}
									autocompleteProps={{
										clearIcon: false,
										selectOnFocus: true,
										clearOnBlur: true,
										handleHomeEndKeys: true,
										freeSolo: true,
										forcePopupIcon: true,
										autoHighlight: true,
										openOnFocus: true,
										disabled: !editMode,
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
											return option.name;
										},
										renderOption: (props, option) => (
											<Box
												component="li"
												sx={{
													'& > img': {
														mr: 2,
														flexShrink: 0
													}
												}}
												{...props}>
												{option.name}
											</Box>
										)
									}}
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
										}
									}}
								/>
							</Grid>
							<Grid item xs={2} className="address-btn-left">
								<Typography variant="subtitle1">State</Typography>
							</Grid>
							<Grid item xs={3.358}>
								<AutocompleteElement
									loading={stateLoading}
									classname={`custom-textfield ${
										!editMode ? 'disabled-textfield' : 'custom-textfield'
									}`}
									autocompleteProps={{
										clearIcon: false,
										disabled: !editMode,
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
												sx={{
													'& > img': {
														mr: 2,
														flexShrink: 0
													}
												}}
												{...props}>
												{option.name}
											</Box>
										)
									}}
									// label={formatMessage({ id: 'State' })}
									// label="State"
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
										}
									}}
								/>
							</Grid>
						</Grid>
						<Grid
							item
							xs={5.5}
							spacing={0.5}
							container
							alignItems="center"
							className="marginTop">
							<Grid item xs={2}>
								<Typography variant="subtitle1">City</Typography>
							</Grid>
							<Grid item xs={3.5}>
								<AutocompleteElement
									loading={cityLoading}
									classname={`custom-textfield ${
										!editMode ? 'disabled-textfield' : 'custom-textfield'
									}`}
									autocompleteProps={{
										clearIcon: false,
										disabled: !editMode,
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
											handleCityChange(event, value, reason, details),
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
												sx={{
													'& > img': {
														mr: 2,
														flexShrink: 0
													}
												}}
												{...props}>
												{option.name}
											</Box>
										)
									}}
									// label={formatMessage({ id: 'Country' })}
									// label="City"
									name="city"
									options={cityOptions}
									textFieldProps={{
										InputProps: {
											//endAdornment: <>{InputProps.endAdornment}</>
										},
										// onKeyDown: e => hanldeAcOnKeyDown(e),
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
							<Grid item xs={2} className="address-btn-left">
								<Typography variant="subtitle1">Pin Code</Typography>
							</Grid>
							<Grid item xs={3.5}>
								<TextFieldElement
									className={`custom-textfield ${
										!editMode ? 'disabled-textfield' : ''
									}`}
									disabled={!editMode}
									fullWidth
									variant="outlined"
									placeholder="Pin Code"
									name="pin_code"
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="subtitle1">Phone No.1</Typography>
							</Grid>
							<Grid item xs={3.5}>
								<TextFieldElement
									type="number"
									className={`custom-textfield ${
										!editMode ? 'disabled-textfield' : ''
									}`}
									disabled={!editMode}
									fullWidth
									variant="outlined"
									placeholder="Enter Phone No."
									name="phone_no_1"
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={2} className="address-btn-left">
								<Typography variant="subtitle1">Phone No.2</Typography>
							</Grid>
							<Grid item xs={3.5}>
								<TextFieldElement
									type="number"
									className={`custom-textfield ${
										!editMode ? 'disabled-textfield' : ''
									}`}
									disabled={!editMode}
									fullWidth
									variant="outlined"
									placeholder="Enter Phone No."
									name="phone_no_2"
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="subtitle1">Mobile No.1</Typography>
							</Grid>
							<Grid item xs={3.5}>
								<TextFieldElement
									type="number"
									className={`custom-textfield ${
										!editMode ? 'disabled-textfield' : ''
									}`}
									disabled={!editMode}
									fullWidth
									variant="outlined"
									placeholder="Enter Mobile No."
									name="mobile_no_1"
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={2} className="address-btn-left">
								<Typography variant="subtitle1">Mobile No.2</Typography>
							</Grid>
							<Grid item xs={3.5}>
								<TextFieldElement
									type="number"
									className={`custom-textfield ${
										!editMode ? 'disabled-textfield' : ''
									}`}
									disabled={!editMode}
									fullWidth
									variant="outlined"
									placeholder="Enter Mobile No."
									name="mobile_no_2"
									onChange={handleChange}
								/>
							</Grid>
							{/* <Grid item xs={2}>
								<Typography variant="subtitle1">PAN No.</Typography>
							</Grid>
							<Grid item xs={3.5}>
								<TextFieldElement
									className={`custom-textfield ${
										!editMode ? 'disabled-textfield' : ''
									}`}
									disabled={!editMode}
									fullWidth
									variant="outlined"
									placeholder="Enter PAN No."
									name="pan_no"
									onChange={handleChange}
								/>
							</Grid> */}
							{/* <Grid item xs={2} className="address-btn-left">
								<Typography variant="subtitle1">VAT No.</Typography>
							</Grid>
							<Grid item xs={3.5}>
								<TextFieldElement
									className={`custom-textfield ${
										!editMode ? 'disabled-textfield' : ''
									}`}
									disabled={!editMode}
									fullWidth
									variant="outlined"
									placeholder="Enter VAT No"
									name="vat_no"
									onChange={handleChange}
								/>
							</Grid> */}
							{/* <Grid item xs={2}>
								<Typography variant="subtitle1">GST No</Typography>
							</Grid>
							<Grid item xs={3.5}>
								<TextFieldElement
									className={`custom-textfield ${
										!editMode ? 'disabled-textfield' : ''
									}`}
									disabled={!editMode}
									fullWidth
									variant="outlined"
									placeholder="Enter GST No."
									name="gst_no"
									onChange={handleChange}
								/>
							</Grid> */}
							{/* <Grid item xs={2} className="address-btn-left">
								<Typography variant="subtitle1">TAX No.</Typography>
							</Grid>
							<Grid item xs={3.5}>
								<TextFieldElement
									className={`custom-textfield ${
										!editMode ? 'disabled-textfield' : ''
									}`}
									disabled={!editMode}
									fullWidth
									variant="outlined"
									placeholder="Enter TAX No."
									name="tax_no"
									onChange={handleChange}
								/>
							</Grid> */}
							<Grid item xs={2}>
								<Typography variant="subtitle1">Email ID</Typography>
							</Grid>
							<Grid item xs={9.22}>
								<TextFieldElement
									className={`custom-textfield ${
										!editMode ? 'disabled-textfield' : ''
									}`}
									disabled={!editMode}
									fullWidth
									variant="outlined"
									placeholder="Enter Email"
									name="email_id_1"
									onChange={handleChange}
								/>
							</Grid>
						</Grid>

						{/* <Grid item xs={1}>
							<Button
								className="selected"
								variant="contained"
								onClick={e => handleClick(e)}>
								+
							</Button>
						</Grid> */}
					</Grid>
				</fieldset>
			</Grid>
		</FormContainer>
	);
};

export default Address;
