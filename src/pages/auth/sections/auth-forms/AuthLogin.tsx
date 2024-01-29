import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
// material-ui
import { Button, CircularProgress, Grid, InputAdornment, Stack, Typography } from '@mui/material';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

// import { KeyedObject } from 'types/root';
// import { z } from 'zod';
import { FormContainer, PasswordElement, TextFieldElement } from '@app/components/rhfmui';
import { useAuthSlice } from '@app/store/slice/auth';
import { authSelector } from '@app/store/slice/auth/auth.selectors';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import AnimateButton from '@components/@extended/AnimateButton';
import IconButton from '@components/@extended/IconButton';
import { zodResolver } from '@hookform/resolvers/zod';
// // project import
import useAuth from '@hooks/useAuth';
import { hasError } from '@utils/helpers';
import { InitialState } from '@utils/helpers';

import { FormSchema, IFormInput } from '../../models/AuthLogin';

// interface InitialState {
// 	isValid: boolean;
// 	values: KeyedObject;
// 	touched: KeyedObject | null;
// 	errors: KeyedObject | null;
// }

// // add your validation requirements 👿
// const FormSchema = z.object({
// 	UserName: z
// 		.string({ required_error: 'Username is required' })
// 		.min(1, { message: 'Email is required' })
// 		.email({
// 			message: 'Must be a valid email'
// 		}),
// 	Password: z
// 		.string({ required_error: 'Password is required' })
// 		.min(1, 'Password is required')
// 		.min(8, 'Password must be more than 8 characters')
// 		.max(32, 'Password must be less than 32 characters'),
// 	persistUser: z.literal(true).optional()
// });

// type IFormInput = z.infer<typeof FormSchema>;

// ============================|| JWT - LOGIN ||============================ //

const AuthLogin = () => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { authActions } = useAuthSlice();
	const { actions } = useSnackBarSlice();

	// add your Slice Selector  👿
	const authState = useSelector(authSelector);
	const { apiError, apiSuccess } = authState;

	const { login, submitLogin } = useAuth();

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
		formState: { errors, isDirty, isSubmitting }
		// setError
	} = formContext;

	// add your States  👿
	const [capsWarning, setCapsWarning] = useState(false);
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});
	const [showPassword, setShowPassword] = useState(false);

	// add your useEffect ( Order must be empty dependancy first, ... , success, error)  👿
	useEffect(() => {
		// setError('UserName', {
		// 	types: {
		// 		required: 'This is required',
		// 		minLength: 'This is minLength'
		// 	},
		// 	message: 'Email is invalid chhe'
		// });

		return () => {
			dispatch(authActions.reset());
		};
	}, []);

	useEffect(() => {
		console.log('errors', errors);
	}, [errors]);

	useEffect(() => {
		console.log('isDirty', isDirty);
	}, [isDirty]);

	useEffect(() => {
		console.log('isSubmitting', isSubmitting);
	}, [isSubmitting]);

	useEffect(() => {
		if (apiSuccess) {
			submitLogin(apiSuccess);
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
		// setState(authState);
	}, [apiError]);

	// add your Event Handler ..., handleChange, OnSubmit  👿

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event: React.SyntheticEvent) => {
		event.preventDefault();
	};

	const onKeyDown = (keyEvent: any) => {
		if (keyEvent.getModifierState('CapsLock')) {
			setCapsWarning(true);
		} else {
			setCapsWarning(false);
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

		await login(pageState?.values);
	};

	// const hasError = field => !!formState1.errors[field] || null;

	// const hasError = (field: string) => {
	// 	const str = field as string;

	// 	return Boolean(
	// 		formState.touchedFields[str as keyof typeof formState.touchedFields] &&
	// 			errors[str as keyof IFormInput]
	// 	);
	// 	// https://bobbyhadz.com/blog/typescript-element-implicitly-has-any-type-expression#element-implicitly-has-an-any-type-because-expression-of-type-string-cant-be-used-to-index-type
	// };

	// console.log('Repeate', hasError('email'));

	return (
		<FormContainer
			// defaultValues={{ name: '' }}
			onSuccess={() => onSubmit()}
			formContext={formContext}
			FormProps={{ autoComplete: 'off' }}>
			<Grid container spacing={1}>
				<Grid item xs={12}>
					<Stack spacing={1}>
						<TextFieldElement
							id="username-login"
							type="text"
							name="userName"
							label={formatMessage({ id: 'Username' })}
							fullWidth
							onChange={handleChange}
							error={hasError<IFormInput>('UserName', formState, errors)}
							helperText={
								hasError<IFormInput>('UserName', formState, errors)
									? (errors['userName'] as unknown as string)
									: ' '
							}
							autoFocus={true}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12}>
					<Stack spacing={1}>
						<PasswordElement
							id="password-login"
							name="password"
							label={formatMessage({ id: 'Password' })}
							fullWidth
							color={capsWarning ? 'warning' : 'primary'}
							type={showPassword ? 'text' : 'password'}
							onKeyDown={onKeyDown}
							onChange={handleChange}
							error={hasError<IFormInput>('Password', formState, errors)}
							helperText={
								hasError<IFormInput>('Password', formState, errors)
									? (errors['password'] as unknown as string)
									: ' '
							}
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
								formatMessage({ id: 'Login' })
							)}
						</Button>
					</AnimateButton>
				</Grid>
			</Grid>
		</FormContainer>
	);
};

export default AuthLogin;
// DX
// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useDispatch, useSelector } from 'react-redux';
// // import { Link as RouterLink } from 'react-router-dom';
// // // material-ui
// import {
// 	Button,
// 	// 	Checkbox,
// 	// 	Divider,
// 	// 	FormControlLabel,
// 	CircularProgress,
// 	// FormHelperText,
// 	Grid,
// 	InputAdornment,
// 	// 	InputLabel,
// 	// 	Link,
// 	// OutlinedInput,
// 	Stack,
// 	Typography
// } from '@mui/material';
// // // assets
// import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

// import { KeyedObject } from 'types/root';
// // import * as yup from 'yup';
// // import { literal, object, string } from 'zod';
// import { z } from 'zod';

// // import {
// // 	FormContainer,
// // 	PasswordElement,
// // 	//	PasswordRepeatElement,
// // 	TextFieldElement
// // } from 'react-hook-form-mui';
// import {
// 	FormContainer,
// 	PasswordElement,
// 	//	PasswordRepeatElement,
// 	TextFieldElement
// } from '@app/components/rhfmui';
// import { useAuthSlice } from '@app/store/slice/auth';
// import { authSelector } from '@app/store/slice/auth/auth.selectors';
// import { useSnackBarSlice } from '@app/store/slice/snackbar';
// import AnimateButton from '@components/@extended/AnimateButton';
// import IconButton from '@components/@extended/IconButton';
// // import { Formik } from 'formik';
// // // third party
// // import { yupResolver } from '@hookform/resolvers/yup';
// import { zodResolver } from '@hookform/resolvers/zod';
// // // project import
// import useAuth from '@hooks/useAuth';
// // import useScriptRef from '@hooks/useScriptRef';

// // import FirebaseSocial from './FirebaseSocial';

// // ============================|| FIREBASE - LOGIN ||============================ //

// // interface IFormInput {
// // 	UserName: string;
// // 	Password: string;
// // }

// // interface keyable {
// // 	[key: string]: any;
// // }

// interface InitialState {
// 	isValid: boolean;
// 	values: KeyedObject;
// 	touched: KeyedObject | null;
// 	errors: KeyedObject | null;
// }
// // const schema = yup
// // 	.object({
// // 		email: yup.string().email('Must be a valid email re').max(255).required('Email is required')
// // 	})
// // 	.required();

// // 👇 Login Schema with Zod
// // const schema = object({
// // 	email: string().min(1, 'Email is required').email('Email is invalid'),
// // 	password: string()
// // 		.min(1, 'Password is required')
// // 		.min(8, 'Password must be more than 8 characters')
// // 		.max(32, 'Password must be less than 32 characters'),
// // 	persistUser: literal(true).optional()
// // });

// // const validationSchema = z
// //   .object({
// //     firstName: z.string().min(1, { message: "Firstname is required" }),
// //     lastName: z.string().min(1, { message: "Lastname is required" }),
// //     email: z.string().min(1, { message: "Email is required" }).email({
// //       message: "Must be a valid email",
// //     }),
// //     password: z
// //       .string()
// //       .min(6, { message: "Password must be atleast 6 characters" }),
// //     confirmPassword: z
// //       .string()
// //       .min(1, { message: "Confirm Password is required" }),
// //     terms: z.literal(true, {
// //       errorMap: () => ({ message: "You must accept Terms and Conditions" }),
// //     }),
// //   })
// //   .refine((data) => data.password === data.confirmPassword, {
// //     path: ["confirmPassword"],
// //     message: "Password don't match",
// //   });

// const FormSchema = z.object({
// 	// email: z.string().email('Please enter a valid email address.'),
// 	UserName: z
// 		.string({ required_error: 'Username is required' })
// 		.min(1, { message: 'Email is required' })
// 		.email({
// 			message: 'Must be a valid email'
// 		}),
// 	Password: z
// 		.string({ required_error: 'Password is required' })
// 		.min(1, 'Password is required')
// 		.min(8, 'Password must be more than 8 characters')
// 		.max(32, 'Password must be less than 32 characters'),
// 	persistUser: z.literal(true).optional()
// 	// add your fancy password requirements 👿
// });

// // interface IFormInput {
// // 	UserName: string;
// // 	Password: string;
// // }

// type IFormInput = z.infer<typeof FormSchema>;

// // Password: {
// // 	presence: { allowEmpty: false, message: 'is required' },
// // 	length: {
// // 		maximum: 20
// // 	}
// // }

// const AuthLogin = () => {
// 	const dispatch = useDispatch();
// 	const { authActions } = useAuthSlice();
// 	const { actions } = useSnackBarSlice();

// 	const authState = useSelector(authSelector);

// 	const { login } = useAuth();

// 	const { apiError } = authState;

// 	const formContext = useForm<IFormInput>({
// 		resolver: zodResolver(FormSchema),
// 		mode: 'onSubmit',
// 		reValidateMode: 'onSubmit'
// 	});

// 	const [pageState, setPageState] = useState<InitialState>({
// 		isValid: false,
// 		values: {},
// 		touched: null,
// 		errors: null
// 	});

// 	// const formContext = useForm<{
// 	// 	email: string;
// 	// 	name: string;
// 	// }>({
// 	// 	defaultValues: {
// 	// 		email: '',
// 	// 		name: ''
// 	// 	}
// 	// });

// 	const {
// 		formState,
// 		//	watch,
// 		formState: { errors, isDirty, isSubmitting },
// 		setError
// 	} = formContext;

// 	// const emailValue = watch('email');

// 	useEffect(() => {
// 		setError('UserName', {
// 			types: {
// 				required: 'This is required',
// 				minLength: 'This is minLength'
// 			},
// 			message: 'Email is invalid chhe'
// 		});

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

// 	// useEffect(() => {
// 	// 	console.log('email changed', emailValue);
// 	// }, [emailValue]);

// 	// useEffect(() => {
// 	// 	console.log('formState changed', formState.touchedFields);
// 	// }, [formState]);

// 	// const [checked, setChecked] = useState(false);
// 	const [capsWarning, setCapsWarning] = useState(false);

// 	// // const { isLoggedIn, firebaseEmailPasswordSignIn } = useAuth();
// 	// const { isLoggedIn, login } = useAuth(); // , login
// 	// const scriptedRef = useScriptRef();

// 	const [showPassword, setShowPassword] = useState(false);

// 	useEffect(() => {
// 		console.log('APIs RESPONSE WITH ERROR AUTH FORM PAGE ===========> LOGIN', apiError);
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
// 					close: false,
// 					anchorOrigin: {
// 						vertical: 'top',
// 						horizontal: 'center'
// 					}
// 				})
// 			);
// 		}
// 		// setState(authState);
// 	}, [apiError]);

// 	// const handlesubmit = (data: { name: string }) => {
// 	// 	console.log('handlesubmit', data);
// 	// };

// 	// const parseError = (err: any) => {
// 	// 	console.log('parseError', err);
// 	// };

// 	const handleChange = (event: any) => {
// 		event.persist();

// 		setPageState(value => ({
// 			...value,
// 			values: {
// 				...pageState.values,
// 				[event.target.name]:
// 					event.target.type === 'checkbox' ? event.target.checked : event.target.value
// 			},
// 			touched: {
// 				...pageState.touched,
// 				[event.target.name]: true
// 			}
// 		}));
// 	};

// 	const onSubmit = async (data: any) => {
// 		console.log('SUBMIT', pageState);

// 		// on save time
// 		console.log('formState Touch', formState.touchedFields);
// 		console.log('formState Dirty', formState.dirtyFields);
// 		// setFormState1(frmState => ({
// 		// 	...frmState,
// 		// 	isValid: !errors,
// 		// 	errors: errors || {}
// 		// }));

// 		// const lenData = Object.keys(data).length;
// 		// const lenTouched = Object.keys(formState.touchedFields).length;

// 		// console.log('lenData', lenData);
// 		// console.log('lenTouched', lenTouched);

// 		setPageState(frmPageState => ({
// 			...frmPageState,
// 			isValid: !errors,
// 			errors: errors || {}
// 		}));

// 		// console.log('!errors', errors);
// 		// console.log('onSubmit', data);

// 		await login(pageState?.values);
// 	};

// 	const handleClickShowPassword = () => {
// 		setShowPassword(!showPassword);
// 	};

// 	const handleMouseDownPassword = (event: React.SyntheticEvent) => {
// 		event.preventDefault();
// 	};

// 	const onKeyDown = (keyEvent: any) => {
// 		// console.log('ON KEY down', keyEvent);

// 		if (keyEvent.getModifierState('CapsLock')) {
// 			setCapsWarning(true);
// 		} else {
// 			setCapsWarning(false);
// 		}
// 	};

// 	// const hasError = field => !!formState1.errors[field] || null;

// 	const hasError = (field: string) => {
// 		const str = field as string;

// 		return Boolean(
// 			formState.touchedFields[str as keyof typeof formState.touchedFields] &&
// 				errors[str as keyof IFormInput]
// 		);
// 		// https://bobbyhadz.com/blog/typescript-element-implicitly-has-any-type-expression#element-implicitly-has-an-any-type-because-expression-of-type-string-cant-be-used-to-index-type
// 	};

// 	console.log('Repeate', hasError('email'));

// 	return (
// 		<FormContainer
// 			// defaultValues={{ name: '' }}
// 			onSuccess={data => onSubmit(data)}
// 			formContext={formContext}
// 			FormProps={{ autoComplete: 'off' }}>
// 			<Grid container spacing={1}>
// 				<Grid item xs={12}>
// 					<Stack spacing={1}>
// 						<TextFieldElement
// 							id="username-login"
// 							type="email"
// 							name="UserName"
// 							label="Username"
// 							fullWidth
// 							onChange={handleChange}
// 							error={hasError('UserName')}
// 							// error={true}
// 							// helperText={'errorDharmesh'}
// 							helperText={
// 								hasError('UserName')
// 									? (errors['UserName'] as unknown as string)
// 									: ' '
// 							}
// 							autoFocus={true}
// 							// parseError={'parseError'}
// 							// error={!!errors[name]}
// 							// helperText={
// 							// 	errors[name] ? (errors[name]?.message as unknown as string) : ''
// 							// }
// 						/>
// 						{/* {formState.touchedFields.email && errors.email && (
// 							<FormHelperText
// 								error
// 								id="standard-weight-helper-text-email-login"></FormHelperText>
// 						)} */}
// 					</Stack>
// 				</Grid>
// 				<Grid item xs={12}>
// 					<Stack spacing={1}>
// 						<PasswordElement
// 							id="password-login"
// 							name="Password"
// 							label="Password"
// 							fullWidth
// 							color={capsWarning ? 'warning' : 'primary'}
// 							type={showPassword ? 'text' : 'password'}
// 							onKeyDown={onKeyDown}
// 							onChange={handleChange}
// 							error={hasError('Password')}
// 							helperText={
// 								hasError('Password')
// 									? (errors['Password'] as unknown as string)
// 									: ' '
// 							}
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
// 				</Grid>
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
// 								'Login'
// 							)}
// 						</Button>
// 					</AnimateButton>
// 				</Grid>
// 			</Grid>
// 		</FormContainer>
// 	);
// };

// export default AuthLogin;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux'; //
// import { Link as RouterLink } from 'react-router-dom';
// // material-ui
// import {
// 	Button,
// 	Checkbox,
// 	Divider,
// 	FormControlLabel,
// 	FormHelperText,
// 	Grid,
// 	InputAdornment,
// 	InputLabel,
// 	Link,
// 	OutlinedInput,
// 	Stack,
// 	Typography
// } from '@mui/material';
// // assets
// import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

// import { Formik } from 'formik';
// // third party
// import * as Yup from 'yup';

// // import { useAuthSlice } from '@app/store/slice/auth';
// import { authSelector } from '@app/store/slice/auth/auth.selectors';
// import { useSnackBarSlice } from '@app/store/slice/snackbar';
// import AnimateButton from '@components/@extended/AnimateButton';
// import IconButton from '@components/@extended/IconButton';
// // project import
// import useAuth from '@hooks/useAuth';
// import useScriptRef from '@hooks/useScriptRef';

// // import FirebaseSocial from './FirebaseSocial';

// // ============================|| FIREBASE - LOGIN ||============================ //

// const AuthLogin = () => {
// 	const dispatch = useDispatch();
// 	// const { actions } = useAuthSlice();
// 	const { actions } = useSnackBarSlice();

// 	const authState = useSelector(authSelector);

// 	const { error } = authState;

// 	const [checked, setChecked] = useState(false);
// 	const [capsWarning, setCapsWarning] = useState(false);

// 	// const { isLoggedIn, firebaseEmailPasswordSignIn } = useAuth();
// 	const { isLoggedIn, login } = useAuth(); // , login
// 	const scriptedRef = useScriptRef();

// 	const [showPassword, setShowPassword] = useState(false);

// 	useEffect(() => {
// 		console.log('APIs RESPONSE WITH ERROR AUTH FORM PAGE ===========>', error);
// 		if (error) {
// 			const { message } = error.error;

// 			dispatch(
// 				actions.openSnackbar({
// 					open: true,
// 					message: message,
// 					variant: 'alert',
// 					alert: {
// 						color: 'error'
// 					},
// 					close: false,
// 					anchorOrigin: {
// 						vertical: 'top',
// 						horizontal: 'center'
// 					}
// 				})
// 			);
// 		}
// 		// setState(authState);
// 	}, [error]);

// 	const handleClickShowPassword = () => {
// 		setShowPassword(!showPassword);
// 	};

// 	const handleMouseDownPassword = (event: React.SyntheticEvent) => {
// 		event.preventDefault();
// 	};

// 	const onKeyDown = (keyEvent: any) => {
// 		if (keyEvent.getModifierState('CapsLock')) {
// 			setCapsWarning(true);
// 		} else {
// 			setCapsWarning(false);
// 		}
// 	};

// 	return (
// 		<>
// 			<Formik
// 				initialValues={{
// 					email: 'info@dharmesh.com',
// 					password: 'a1234567',
// 					submit: null
// 				}}
// 				validationSchema={Yup.object().shape({
// 					email: Yup.string()
// 						.email('Must be a valid email')
// 						.max(255)
// 						.required('Email is required'),
// 					password: Yup.string().max(255).required('Password is required')
// 				})}
// 				onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
// 					// dispatch(actions.login({ email: values.email, password: values.password }));
// 					try {
// 						await login(values.email, values.password).then(
// 							() => {
// 								// WARNING: do not set any formik state here as formik might be already destroyed here. You may get following error by doing so.
// 								// Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.
// 								// To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
// 								// github issue: https://github.com/formium/formik/issues/2430
// 							},
// 							(err: any) => {
// 								setStatus({ success: false });
// 								setErrors({ submit: err.message });
// 								setSubmitting(false);
// 							}
// 						);
// 					} catch (err: any) {
// 						// eslint-disable-next-line no-console
// 						console.error(err);
// 						if (scriptedRef.current) {
// 							setStatus({ success: false });
// 							setErrors({ submit: err.message });
// 							setSubmitting(false);
// 						}
// 					}
// 				}}>
// 				{({
// 					errors,
// 					handleBlur,
// 					handleChange,
// 					handleSubmit,
// 					isSubmitting,
// 					touched,
// 					values
// 				}) => (
// 					<form noValidate onSubmit={handleSubmit}>
// 						<Grid container spacing={3}>
// 							<Grid item xs={12}>
// 								<Stack spacing={1}>
// 									<InputLabel htmlFor="email-login">Email Address</InputLabel>
// 									<OutlinedInput
// 										id="email-login"
// 										type="email"
// 										value={values.email}
// 										name="email"
// 										onBlur={handleBlur}
// 										onChange={handleChange}
// 										placeholder="Enter email address"
// 										fullWidth
// 										error={Boolean(touched.email && errors.email)}
// 									/>
// 									{touched.email && errors.email && (
// 										<FormHelperText
// 											error
// 											id="standard-weight-helper-text-email-login">
// 											{errors.email}
// 										</FormHelperText>
// 									)}
// 								</Stack>
// 							</Grid>
// 							<Grid item xs={12}>
// 								<Stack spacing={1}>
// 									<InputLabel htmlFor="password-login">Password</InputLabel>
// 									<OutlinedInput
// 										fullWidth
// 										color={capsWarning ? 'warning' : 'primary'}
// 										error={Boolean(touched.password && errors.password)}
// 										id="-password-login"
// 										type={showPassword ? 'text' : 'password'}
// 										value={values.password}
// 										name="password"
// 										onBlur={(event: React.FocusEvent<any, Element>) => {
// 											setCapsWarning(false);
// 											handleBlur(event);
// 										}}
// 										onKeyDown={onKeyDown}
// 										onChange={handleChange}
// 										endAdornment={
// 											<InputAdornment position="end">
// 												<IconButton
// 													aria-label="toggle password visibility"
// 													onClick={handleClickShowPassword}
// 													onMouseDown={handleMouseDownPassword}
// 													edge="end"
// 													color="secondary">
// 													{showPassword ? (
// 														<EyeOutlined />
// 													) : (
// 														<EyeInvisibleOutlined />
// 													)}
// 												</IconButton>
// 											</InputAdornment>
// 										}
// 										placeholder="Enter password"
// 									/>
// 									{capsWarning && (
// 										<Typography
// 											variant="caption"
// 											sx={{ color: 'warning.main' }}
// 											id="warning-helper-text-password-login">
// 											Caps lock on!
// 										</Typography>
// 									)}
// 									{touched.password && errors.password && (
// 										<FormHelperText
// 											error
// 											id="standard-weight-helper-text-password-login">
// 											{errors.password}
// 										</FormHelperText>
// 									)}
// 								</Stack>
// 							</Grid>

// 							<Grid item xs={12} sx={{ mt: -1 }}>
// 								<Stack
// 									direction="row"
// 									justifyContent="space-between"
// 									alignItems="center"
// 									spacing={2}>
// 									<FormControlLabel
// 										control={
// 											<Checkbox
// 												checked={checked}
// 												onChange={event => setChecked(event.target.checked)}
// 												name="checked"
// 												color="primary"
// 												size="small"
// 											/>
// 										}
// 										label={
// 											<Typography variant="h6">Keep me sign in</Typography>
// 										}
// 									/>
// 									<Link
// 										variant="h6"
// 										component={RouterLink}
// 										to={
// 											isLoggedIn
// 												? '/auth/forgot-password'
// 												: '/forgot-password'
// 										}
// 										color="text.primary">
// 										Forgot Password?
// 									</Link>
// 								</Stack>
// 							</Grid>
// 							{errors.submit && (
// 								<Grid item xs={12}>
// 									<FormHelperText error>{errors.submit}</FormHelperText>
// 								</Grid>
// 							)}
// 							<Grid item xs={12}>
// 								<AnimateButton>
// 									<Button
// 										disableElevation
// 										disabled={isSubmitting}
// 										fullWidth
// 										size="large"
// 										type="submit"
// 										variant="contained"
// 										color="primary">
// 										Login
// 									</Button>
// 								</AnimateButton>
// 							</Grid>
// 							<Grid item xs={12}>
// 								<Divider>
// 									<Typography variant="caption"> Login with</Typography>
// 								</Divider>
// 							</Grid>
// 							<Grid item xs={12}>
// 								{/* <FirebaseSocial /> */}
// 								<div>Firebase Social</div>
// 							</Grid>
// 						</Grid>
// 					</form>
// 				)}
// 			</Formik>
// 		</>
// 	);
// };

// export default AuthLogin;
