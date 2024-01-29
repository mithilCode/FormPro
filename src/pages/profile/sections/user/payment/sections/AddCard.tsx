import { SyntheticEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { Button, Grid, InputAdornment, Stack } from '@mui/material';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';

import {
	DatePickerElement,
	FormContainer,
	PasswordElement,
	PatternFormatElement,
	TextFieldElement
} from '@app/components/rhfmui';
// import { FormSchema, IFormInput } from '../../../../models/Paypal';
import { FormSchema, IFormInput } from '@app/pages/profile/models/Card';
import IconButton from '@components/@extended/IconButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { hasError } from '@utils/helpers';
import { InitialState } from '@utils/helpers';

// ==============================|| PAYMENT - PAYPAL ||============================== //

const AddCard = ({ setMethod }: any) => {
	// add your Locale  👿
	const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onSubmit',
		reValidateMode: 'onSubmit'
	});

	// add your React Hook Form  👿
	const {
		formState,
		formState: { errors, isSubmitting },
		setFocus
	} = formContext;

	// add your States  👿

	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});
	const [showPassword, setShowPassword] = useState(false);

	// add your useEffect ( Order must be empty dependancy first, ... , success, error)  👿

	useEffect(() => {
		// return () => {};
	}, []);

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

	const handleChangeDx = (data: any) => {
		console.log('HAHAHAHA Currency', data);
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event: SyntheticEvent) => {
		event.preventDefault();
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
		console.log('SUBMIT', data);
		console.log('formState Touch', formState.touchedFields);
		console.log('formState Dirty', formState.dirtyFields);
	};

	return (
		<Grid item xs={12}>
			<FormContainer
				onSuccess={data => onSubmit(data)}
				formContext={formContext}
				FormProps={{ autoComplete: 'off' }}>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<Stack spacing={1.25}>
							<TextFieldElement
								id="payment-card-name"
								// type="email"
								name="CardName"
								label={formatMessage({ id: 'Email' })}
								fullWidth
								onChange={handleChange}
								placeholder="Name on Card"
								error={hasError<IFormInput>('CardName', formState, errors)}
								helperText={
									hasError<IFormInput>('CardName', formState, errors)
										? (errors['CardName'] as unknown as string)
										: ' '
								}
								autoFocus={true}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack spacing={1.25}>
							<PatternFormatElement
								id="payment-card-number"
								name="CardNumber"
								label={formatMessage({ id: 'Company' })}
								fullWidth
								myCustomProps={{ format: '#### #### #### ####' }}
								// placeholder="Card Number"
								onChange={handleChangeDx}
								error={hasError<IFormInput>('CardNumber', formState, errors)}
								helperText={
									hasError<IFormInput>('CardNumber', formState, errors)
										? (errors['CardNumber'] as unknown as string)
										: ' '
								}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={12} md={4}>
						<Stack spacing={1.25}>
							<DatePickerElement
								label="Expiry Date"
								name="Expiry"
								minDate={dayjs(new Date())}
								views={['year', 'month']}
								format="MM/YYYY"
								// mask={'_/__'}
								// mask=""
								//	onChange={newValue => handleDateChange(newValue)}
								slotProps={{
									textField: {
										variant: 'filled',
										size: 'small',
										error: hasError<IFormInput>('Expiry', formState, errors),
										helperText: hasError<IFormInput>(
											'Expiry',
											formState,
											errors
										)
											? (errors['Expiry'] as unknown as string)
											: ' '
									}
								}}
								helperText=" "
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<Stack spacing={1.25}>
							<PatternFormatElement
								id="payment-card-cvv"
								name="CVV"
								label={formatMessage({ id: 'Company' })}
								fullWidth
								myCustomProps={{ format: '###' }}
								onChange={handleChangeDx}
								error={hasError<IFormInput>('CVV', formState, errors)}
								helperText={
									hasError<IFormInput>('CVV', formState, errors)
										? (errors['CVV'] as unknown as string)
										: ' '
								}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<Stack spacing={1.25}>
							<PasswordElement
								id="password-register"
								name="Password"
								label={formatMessage({ id: 'Password' }) + ' *'}
								fullWidth
								type={showPassword ? 'text' : 'password'}
								onChange={e => {
									handleChange(e);
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
								inputProps={{ maxLength: 8 }}
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
									<Button
										disabled={isSubmitting}
										variant="contained"
										type="submit">
										Save
									</Button>
								</Stack>
							</Grid>
						</Stack>
					</Grid>
				</Grid>
			</FormContainer>
		</Grid>
	);
};

export default AddCard;
