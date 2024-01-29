import { useEffect, useState } from 'react'; // SyntheticEvent
import { useForm } from 'react-hook-form'; // SubmitHandler,
// import { useIntl } from 'react-intl';
// import NumberFormat from 'react-number-format';
// import { PatternFormat } from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
// material-ui
import {
	// Box,
	Button,
	// FormControlLabel,
	// FormHelperText,
	Grid,
	// InputAdornment,
	// InputLabel,
	// OutlinedInput,
	// Radio,
	//	RadioGroup,
	Stack,
	// TextField,
	Tooltip
	// Typography
} from '@mui/material';
// assets
import { PlusOutlined } from '@ant-design/icons'; // EyeInvisibleOutlined, EyeOutlined, DeleteOutlined,

import masterCard from 'assets/images/icons/master-card.png';
import paypal from 'assets/images/icons/paypal.png';
// import visaCard from 'assets/images/icons/visa-card.png';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';

// import { Formik } from 'formik';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { KeyedObject } from 'types/root';
// import { z } from 'zod';
import { FormContainer, RadioButtonGroup } from '@app/components/rhfmui'; // TextFieldElement
// project import
// import { openSnackbar } from 'store/reducers/snackbar';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserSlice } from '@pages/profile/store/user/slice';
import { userSelector } from '@pages/profile/store/user/slice/user.selectors';
import { InitialState } from '@utils/helpers';

// import { hasError } from '@utils/helpers';
import { FormSchema, IFormInput } from '../../../models/TabPayment';
import AddCard from './sections/AddCard';
import PaymentCard from './sections/PaymentCard';
import Paypal from './sections/Paypal';
// third party
// import * as Yup from 'yup';

// style & constant
const buttonStyle = { color: 'text.primary', fontWeight: 600 };

// ==============================|| TAB - PAYMENT ||============================== //

const TabPayment = () => {
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions } = useSnackBarSlice();
	const { actions: userActions } = useUserSlice();

	// *** User Profile State *** //
	const userState = useSelector(userSelector);
	const { getError: getPaymentsError, getSuccess: getPaymentsSuccess } = userState;

	// add your Locale  👿
	// const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onSubmit',
		reValidateMode: 'onSubmit'
	});

	const {
		// formState,
		formState: { errors }, // , isSubmitting
		setFocus
		// reset
	} = formContext;

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});
	const [cards, setCards] = useState([]);
	const [paypals, setPaypals] = useState([]);
	const [method, setMethod] = useState('card');
	// const [value, setValue] = useState<string | null>('2');
	// const [expiry, setExpiry] = useState<Date | null>(new Date());

	// add your useEffect ( Order must be empty dependancy first, ... , success, error)  👿

	useEffect(() => {
		dispatch(userActions.getPayments({}));
		// dispatch(organisationActions.get({}));

		return () => {
			dispatch(userActions.reset());
		};
	}, []);

	// useEffect(() => {
	// 	console.log('formState', formState);
	// }, [formState]);

	// *** PROFILE *** //

	useEffect(() => {
		if (getPaymentsSuccess) {
			// reset(getPaymentsSuccess);

			// const x =  as any

			setCards(getPaymentsSuccess?.Cards as any);
			setPaypals(getPaymentsSuccess?.Paypal as any);

			setPageState(value => ({
				...value,
				values: getPaymentsSuccess
			}));
		}
	}, [getPaymentsSuccess]);

	useEffect(() => {
		console.log('errors', errors);
	}, [errors]);

	useEffect(() => {
		if (getPaymentsError) {
			console.log('PAyment Error', getPaymentsError, pageState);
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Payment Error.',
					variant: 'alert',
					alert: {
						color: 'success'
					},
					close: false
				})
			);
			// setOrganisations([]);
		}
	}, [getPaymentsError]);

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

	// const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
	// 	setValue(event.target.value);
	// };

	const handleRadioChange = (data: any) => {
		console.log('DATATA', data);
		// event.persist();
		// setPageState(value => ({
		// 	...value,
		// 	values: {
		// 		...pageState.values,
		// 		[event.target.name]:
		// 			event.target.type === 'checkbox' ? event.target.checked : event.target.value
		// 	},
		// 	touched: {
		// 		...pageState.touched,
		// 		[event.target.name]: true
		// 	}
		// }));
	};

	const handleCardRemove = (idCard: any) => {
		console.log('DATATA', idCard);

		// event.persist();
		// setPageState(value => ({
		// 	...value,
		// 	values: {
		// 		...pageState.values,
		// 		[event.target.name]:
		// 			event.target.type === 'checkbox' ? event.target.checked : event.target.value
		// 	},
		// 	touched: {
		// 		...pageState.touched,
		// 		[event.target.name]: true
		// 	}
		// }));
	};

	// const handleChange = (event: any) => {
	// 	event.persist();

	// 	setPageState(value => ({
	// 		...value,
	// 		values: {
	// 			...pageState.values,
	// 			[event.target.name]:
	// 				event.target.type === 'checkbox' ? event.target.checked : event.target.value
	// 		},
	// 		touched: {
	// 			...pageState.touched,
	// 			[event.target.name]: true
	// 		}
	// 	}));
	// };

	// const onSubmit: SubmitHandler<IFormInput> = async data => {
	// 	console.log('SUBMIT', data);
	// 	console.log('formState Touch', formState.touchedFields);
	// 	console.log('formState Dirty', formState.dirtyFields);

	// 	// const dirtyPageState = difference(pageState.values, formState.dirtyFields);

	// 	// if (Object.keys(dirtyPageState).length > 0) {
	// 	// 	dispatch(userActions.edit(dirtyPageState));
	// 	// } else {
	// 	// 	console.log('Nothing to be change');
	// 	// }

	// 	// // const assignState = {
	// 	// // 	...diffFormState,
	// 	// // 	...{
	// 	// // 		ParentCompany,
	// 	// // 		idEmployee: formState.values.idEmployee,
	// 	// // 		Regions: formState.values.Regions
	// 	// // 	}
	// 	// // };

	// 	// console.log('dirtyPageState', dirtyPageState);
	// };

	return (
		<MainCard title="Payment">
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Stack
						spacing={1.25}
						direction="row"
						justifyContent="space-between"
						alignItems="center">
						<Stack direction="row" spacing={1}>
							<Button
								variant="outlined"
								color={
									method === 'card' || method === 'add' ? 'primary' : 'secondary'
								}
								sx={buttonStyle}
								onClick={() => setMethod(method !== 'card' ? 'card' : method)}
								startIcon={<img src={masterCard} alt="master card" />}>
								Card
							</Button>
							<Button
								variant="outlined"
								color={method === 'paypal' ? 'primary' : 'secondary'}
								sx={buttonStyle}
								onClick={() => setMethod(method !== 'paypal' ? 'paypal' : method)}
								startIcon={<img src={paypal} alt="paypal" />}>
								Paypal
							</Button>
						</Stack>
						<Button
							variant="contained"
							startIcon={<PlusOutlined />}
							onClick={() => setMethod(method !== 'add' ? 'add' : method)}
							sx={{ display: { xs: 'none', sm: 'flex' } }}>
							Add New Card
						</Button>
						<Tooltip title="Add New Card">
							<IconButton
								variant="contained"
								onClick={() => setMethod(method !== 'add' ? 'add' : method)}
								sx={{ display: { xs: 'block', sm: 'none' } }}>
								<PlusOutlined />
							</IconButton>
						</Tooltip>
					</Stack>
				</Grid>
				{method === 'card' && (
					<Grid item xs={12}>
						<FormContainer FormProps={{ autoComplete: 'off' }}>
							<Grid item xs={12}>
								<RadioButtonGroup
									name="payment-card"
									labelKey="type"
									valueKey="name"
									onChange={handleRadioChange}
									// row
									options={cards}
									children={
										<Grid item xs container spacing={2.5}>
											{cards?.map((card, index) => (
												<Grid item xs={12} sm={6} key={index}>
													<PaymentCard
														card={card}
														handleCardRemove={handleCardRemove}
													/>
												</Grid>
											))}
										</Grid>
									}
								/>
							</Grid>
						</FormContainer>
					</Grid>
				)}
				{method === 'paypal' && (
					<Grid item xs={12}>
						<Paypal data={paypals} setMethod={setMethod} />
						{/* <Grid item xs={12}>
							<FormContainer
								onSuccess={data => onSubmit(data)}
								formContext={formContext}
								FormProps={{ autoComplete: 'off' }}>
								<Grid item xs={12}>
									<Stack spacing={1.25}>
										<TextFieldElement
											id="payment-card-paypal"
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
											autoFocus={true}
										/>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack
										direction="row"
										justifyContent="flex-end"
										alignItems="center"
										spacing={2}>
										<Grid item xs={12}>
											<Stack
												direction="row"
												justifyContent="flex-end"
												alignItems="center"
												spacing={2}>
												<Button
													variant="outlined"
													color="secondary"
													onClick={() => setMethod('card')}>
													Cancel
												</Button>
												<Button variant="contained" type="submit">
													Save
												</Button>
											</Stack>
										</Grid>
									</Stack>
								</Grid>
							</FormContainer>
						</Grid> */}
					</Grid>
				)}
				{method === 'add' && (
					<Grid item xs={12}>
						<AddCard setMethod={setMethod} />
						{/* <FormContainer
							onSuccess={data => onSubmit(data)}
							formContext={formContext}
							FormProps={{ autoComplete: 'off' }}>
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<Stack spacing={1.25}>
										<TextFieldElement
											id="payment-card-addnew"
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
											autoFocus={true}
										/>
									</Stack>
								</Grid>
							</Grid>
						</FormContainer> */}
					</Grid>
				)}
			</Grid>
		</MainCard>
	);
};

export default TabPayment;
