import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { Button, Grid, Stack } from '@mui/material';

import { FormContainer, TextFieldElement } from '@app/components/rhfmui';
// import { FormSchema, IFormInput } from '../../../../models/Paypal';
import { FormSchema, IFormInput } from '@app/pages/profile/models/Paypal';
import { zodResolver } from '@hookform/resolvers/zod';
import { hasError } from '@utils/helpers';
import { InitialState } from '@utils/helpers';

// ==============================|| PAYMENT - PAYPAL ||============================== //

const Paypal = ({ data, setMethod }: any) => {
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
		formState: { errors }, // , isSubmitting
		setFocus,
		reset
	} = formContext;

	// add your States  👿

	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});

	// add your useEffect ( Order must be empty dependancy first, ... , success, error)  👿

	useEffect(() => {
		if (data && data.length !== 0) {
			reset(data[0]);

			setPageState(value => ({
				...value,
				values: data[0]
			}));
		}
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
		</Grid>
	);
};

export default Paypal;
