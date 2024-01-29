import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { Box, Button, CircularProgress, Grid, Stack } from '@mui/material';

import { FormContainer, TextFieldElement } from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { zodResolver } from '@hookform/resolvers/zod';
import { hasError, InitialState } from '@utils/helpers';
import useFocusOnEnter from '@hooks/useFocusOnEnter';

import { FormSchema, IFormInput } from '../models/Country';
import { useCountrySlice } from '../store/slice';
import { countrySelector } from '../store/slice/country.selectors';

// ==============================|| COUNTRY ||============================== //

interface Props {
	passProps?: any;
	handleDrawerToggle?: any;
	edit?: boolean;
	selectedData?: any;
}

const Country = ({ passProps, handleDrawerToggle, edit, selectedData }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: countryActions } = useCountrySlice();
	const { actions } = useSnackBarSlice();

	// *** Country State *** //
	const countryState = useSelector(countrySelector);
	const { addError, addSuccess, editError, editSuccess, getOneSuccess } = countryState;

	// add your Locale  👿

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
		// defaultValues: useMemo(() => defaultRHFValue, [defaultRHFValue])
	});

	const {
		formState,
		formState: { errors, isSubmitting },
		reset,
		setFocus,
		trigger,
		setError
	} = formContext;

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});

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

	useEffect(() => {
		if (edit) {
			dispatch(countryActions.getOne(selectedData));
		}

		const timer = setTimeout(() => {
			setFocus('name');
			clearTimeout(timer);
		}, 500);

		return () => {
			dispatch(countryActions.reset());
		};
	}, []);

	// *** REDUCER *** //

	useEffect(() => {
		if (addSuccess || editSuccess) {
			passProps({
				type: addSuccess ? 'ADD' : 'EDIT',
				data: addSuccess ? addSuccess : editSuccess
			});

			dispatch(
				actions.openSnackbar({
					open: true,
					message: addSuccess
						? 'Country add successfully.'
						: 'Country edit successfully.',
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
				dispatch(countryActions.reset());
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
				dispatch(countryActions.edit(pageState.values));
			} else {
				dispatch(countryActions.add(pageState.values));
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
									id="name"
									name="name"
									label={'Name *'}
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
									label={'Short Name *'}
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
											? (errors['code'] as unknown as number)
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
											? (errors['sort_no'] as unknown as number)
											: ' '
									}
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

export default Country;
