import { SyntheticEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
// material-ui
import {
	Box,
	Button,
	CircularProgress,
	// FormHelperText,
	Grid,
	InputAdornment,
	// InputLabel,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	// OutlinedInput,
	Stack,
	Typography
} from '@mui/material';
import { CheckOutlined, EyeInvisibleOutlined, EyeOutlined, LineOutlined } from '@ant-design/icons';

import { KeyedObject } from 'types/root';
import { z } from 'zod';

import { FormContainer, PasswordElement } from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import IconButton from '@components/@extended/IconButton';
import MainCard from '@components/MainCard';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserSlice } from '@pages/profile/store/user/slice';
import { userSelector } from '@pages/profile/store/user/slice/user.selectors';
import { hasError } from '@utils/helpers';
import {
	isLowercaseChar,
	isNumber,
	isSpecialChar,
	isUppercaseChar,
	minLength
} from '@utils/password-validation';

interface InitialState {
	isValid: boolean;
	values: KeyedObject;
	touched: KeyedObject | null;
	errors: KeyedObject | null;
}

// add your validation requirements 👿
const FormSchema = z
	.object({
		OldPassword: z
			.string({ required_error: 'Old Password is required' })
			.min(1, 'Old Password is required')
			.min(8, 'Old Password must be more than 8 characters')
			.max(32, 'Old Password must be less than 32 characters'),
		NewPassword: z
			.string({ required_error: 'New Password is required' })
			.min(8, { message: 'New Password must be atleast 8 characters' })
			.regex(
				/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
				'Password must contain at least 8 characters, one uppercase, one number and one special case character'
			),
		ConfirmPassword: z
			.string({ required_error: 'Confirm Password is required' })
			.min(1, { message: 'Confirm Password is required' })
	})
	.refine(data => data.NewPassword === data.ConfirmPassword, {
		message: "Password doesn't match",
		path: ['ConfirmPassword']
	});

type IFormInput = z.infer<typeof FormSchema>;

// ==============================|| TAB - PASSWORD CHANGE ||============================== //

const TabPassword = () => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: userActions } = useUserSlice();
	const { actions } = useSnackBarSlice();

	// add your Slice Selector  👿
	const userState = useSelector(userSelector);
	const { passwordChangeError, passwordChangeSuccess } = userState;

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
		reset,
		setFocus
		// setError
	} = formContext;

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// add your useEffect ( Order must be empty dependancy first, ... , success, error)  👿
	useEffect(() => {
		return () => {
			dispatch(userActions.reset());
		};
	}, []);

	// useEffect(() => {
	// 	console.log('errors', errors);
	// }, [errors]);

	// useEffect(() => {
	// 	console.log('isDirty', isDirty);
	// }, [isDirty]);

	useEffect(() => {
		console.log('isSubmitting', isSubmitting);
	}, [isSubmitting]);

	useEffect(() => {
		if (passwordChangeSuccess) {
			console.log('apiSuccess', passwordChangeSuccess);
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Password changed successfully.',
					variant: 'alert',
					alert: {
						color: 'success'
					},
					close: false
				})
			);
			reset();
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});
			const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
				dispatch(userActions.reset());
				setFocus('OldPassword');
				clearTimeout(timeout);
			}, 700);
		}
	}, [passwordChangeSuccess]);

	useEffect(() => {
		if (passwordChangeError) {
			const { message } = passwordChangeError.error;

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
	}, [passwordChangeError]);

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

	const handleClickShowOldPassword = () => {
		setShowOldPassword(!showOldPassword);
	};

	const handleClickShowNewPassword = () => {
		setShowNewPassword(!showNewPassword);
	};

	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword);
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

		dispatch(userActions.passwordChange(pageState?.values));

		// await login(pageState?.values);
	};

	return (
		<MainCard title="Change Password">
			<FormContainer
				onSuccess={() => onSubmit()}
				formContext={formContext}
				FormProps={{ autoComplete: 'off' }}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<Grid item xs={12}>
							<Stack spacing={1.25}>
								<PasswordElement
									id="password-change-old"
									name="OldPassword"
									label={formatMessage({ id: 'Password' }) + ' *'}
									fullWidth
									type={showOldPassword ? 'text' : 'password'}
									onChange={e => {
										handleChange(e);
									}}
									InputProps={
										<>
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={handleClickShowOldPassword}
													onMouseDown={handleMouseDownPassword}
													edge="end"
													color="secondary">
													{showOldPassword ? (
														<EyeOutlined />
													) : (
														<EyeInvisibleOutlined />
													)}
												</IconButton>
											</InputAdornment>
										</>
									}
									error={hasError<IFormInput>('OldPassword', formState, errors)}
									helperText={
										hasError<IFormInput>('OldPassword', formState, errors)
											? (errors['OldPassword'] as unknown as string)
											: ' '
									}
									autoFocus
								/>
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={1.25}>
								<PasswordElement
									id="password-change-new"
									name="NewPassword"
									label={formatMessage({ id: 'Password' }) + ' *'}
									fullWidth
									type={showNewPassword ? 'text' : 'password'}
									onChange={e => {
										handleChange(e);
									}}
									InputProps={
										<>
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={handleClickShowNewPassword}
													onMouseDown={handleMouseDownPassword}
													edge="end"
													color="secondary">
													{showNewPassword ? (
														<EyeOutlined />
													) : (
														<EyeInvisibleOutlined />
													)}
												</IconButton>
											</InputAdornment>
										</>
									}
									error={hasError<IFormInput>('NewPassword', formState, errors)}
									helperText={
										hasError<IFormInput>('NewPassword', formState, errors)
											? (errors['NewPassword'] as unknown as string)
											: ' '
									}
								/>
							</Stack>
						</Grid>

						<Grid item xs={12}>
							<Stack spacing={1.25}>
								<PasswordElement
									id="password-change-confirm"
									name="ConfirmPassword"
									label={formatMessage({ id: 'Password' }) + ' *'}
									fullWidth
									type={showConfirmPassword ? 'text' : 'password'}
									onChange={e => {
										handleChange(e);
									}}
									InputProps={
										<>
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={handleClickShowConfirmPassword}
													onMouseDown={handleMouseDownPassword}
													edge="end"
													color="secondary">
													{showConfirmPassword ? (
														<EyeOutlined />
													) : (
														<EyeInvisibleOutlined />
													)}
												</IconButton>
											</InputAdornment>
										</>
									}
									error={hasError<IFormInput>(
										'ConfirmPassword',
										formState,
										errors
									)}
									helperText={
										hasError<IFormInput>('ConfirmPassword', formState, errors)
											? (errors['ConfirmPassword'] as unknown as string)
											: ' '
									}
								/>
							</Stack>
						</Grid>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Box sx={{ p: { xs: 0, sm: 2, md: 4, lg: 5 } }}>
							<Typography variant="h5">New password must contain:</Typography>
							<List sx={{ p: 0, mt: 1 }}>
								<ListItem divider>
									<ListItemIcon
										sx={{
											color: minLength(
												pageState.values.NewPassword
													? pageState.values.NewPassword
													: ''
											)
												? 'success.main'
												: 'inherit'
										}}>
										{minLength(
											pageState.values.NewPassword
												? pageState.values.NewPassword
												: ''
										) ? (
											<CheckOutlined />
										) : (
											<LineOutlined />
										)}
									</ListItemIcon>
									<ListItemText primary="At least 8 characters" />
								</ListItem>
								<ListItem divider>
									<ListItemIcon
										sx={{
											color: isLowercaseChar(
												pageState.values.NewPassword
													? pageState.values.NewPassword
													: ''
											)
												? 'success.main'
												: 'inherit'
										}}>
										{isLowercaseChar(
											pageState.values.NewPassword
												? pageState.values.NewPassword
												: ''
										) ? (
											<CheckOutlined />
										) : (
											<LineOutlined />
										)}
									</ListItemIcon>
									<ListItemText primary="At least 1 lower letter (a-z)" />
								</ListItem>
								<ListItem divider>
									<ListItemIcon
										sx={{
											color: isUppercaseChar(
												pageState.values.NewPassword
													? pageState.values.NewPassword
													: ''
											)
												? 'success.main'
												: 'inherit'
										}}>
										{isUppercaseChar(
											pageState.values.NewPassword
												? pageState.values.NewPassword
												: ''
										) ? (
											<CheckOutlined />
										) : (
											<LineOutlined />
										)}
									</ListItemIcon>
									<ListItemText primary="At least 1 uppercase letter (A-Z)" />
								</ListItem>
								<ListItem divider>
									<ListItemIcon
										sx={{
											color: isNumber(
												pageState.values.NewPassword
													? pageState.values.NewPassword
													: ''
											)
												? 'success.main'
												: 'inherit'
										}}>
										{isNumber(
											pageState.values.NewPassword
												? pageState.values.NewPassword
												: ''
										) ? (
											<CheckOutlined />
										) : (
											<LineOutlined />
										)}
									</ListItemIcon>
									<ListItemText primary="At least 1 number (0-9)" />
								</ListItem>
								<ListItem>
									<ListItemIcon
										sx={{
											color: isSpecialChar(
												pageState.values.NewPassword
													? pageState.values.NewPassword
													: ''
											)
												? 'success.main'
												: 'inherit'
										}}>
										{isSpecialChar(
											pageState.values.NewPassword
												? pageState.values.NewPassword
												: ''
										) ? (
											<CheckOutlined />
										) : (
											<LineOutlined />
										)}
									</ListItemIcon>
									<ListItemText primary="At least 1 special characters" />
								</ListItem>
							</List>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Stack
							direction="row"
							justifyContent="flex-end"
							alignItems="center"
							spacing={2}>
							<Button variant="outlined" color="secondary">
								Cancel
							</Button>
							<Button
								disabled={isSubmitting} // || Object.keys(errors).length !== 0
								type="submit"
								variant="contained">
								{isSubmitting ? (
									<CircularProgress size={24} color="success" />
								) : (
									formatMessage({ id: 'Create-account' })
								)}
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</FormContainer>
		</MainCard>
	);
};

export default TabPassword;
