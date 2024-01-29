import { SyntheticEvent, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import {
	Box,
	Button,
	Grid,
	Typography,
	CircularProgress,
	AutocompleteChangeReason,
	AutocompleteChangeDetails,
	FilterOptionsState,
	createFilterOptions
} from '@mui/material';
import { AutocompleteElement, FormContainer, TextFieldElement } from '@app/components/rhfmui';
import { FormSchema, IFormInput } from '@pages/master/formtopricing/models/FormToPricing';
import { zodResolver } from '@hookform/resolvers/zod';
import { InitialState } from '@utils/helpers';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { useFormToPricingsSlice } from '@pages/master/formtopricing/store/slice';
import { formtopricingsSelector } from '@pages/master/formtopricing/store/slice/formtopricings.selectors';
import useFocusOnEnter from '@hooks/useFocusOnEnter';
import { useConfirm } from 'material-ui-confirm';
import FormToPricingDetail from './FormToPricingDetails';
import MainCard from '@components/MainCard';
import useThrottle from '@hooks/useThrottle';

// *** PARA *** //
import { useParaSlice } from '@pages/master/paras/store/slice';
const parasFilter = createFilterOptions();

// *** SHAPE *** //
import { useShapesSlice } from '@pages/master/shapes/store/slice';
import { shapesSelector } from '@pages/master/shapes/store/slice/shapes.selectors';
import { shapesState } from '@pages/master/shapes/store/slice/types';
const shapesFilter = createFilterOptions();

import './formtopricing.css';
import { formtopricingsState } from '../store/slice/types';

function FormToPricing() {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: formtopricingsActions } = useFormToPricingsSlice();
	const { actions } = useSnackBarSlice();
	const { actions: parasActions } = useParaSlice();
	const { actions: shapesActions } = useShapesSlice();

	// *** FormToPricing State *** //
	const formtopricingsState = useSelector(formtopricingsSelector);
	const { addSuccess, getParaError, getParaSuccess, getFTparaTypeSuccess, getFTparaViewSuccess } =
		formtopricingsState;

	// *** Shapes State *** //
	const shapesState = useSelector(shapesSelector);
	const { getError: getShapeError, getSuccess: getShapeSuccess } = shapesState;

	// add your Locale  👿
	const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		formState: { errors, isSubmitting },
		setFocus,
		reset,
		trigger
	} = formContext;

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});

	//add your reference
	const formRef = useRef();

	const { onEnterKey } = useFocusOnEnter(formRef, formContext.formState.errors);

	const [gridData, setGridData] = useState<any>([]);

	// *** Paras State *** //
	const [paraLoading, setParaLoading] = useState(false);
	const [paraInputValue, setParaInputValue] = useState('');
	const [paraOptions, setParaOptions] = useState<formtopricingsState[]>([]);
	const throttledInputParaValue = useThrottle(paraInputValue, 400);
	const [typeSelect, setTypeSelect] = useState<any>('');

	//* Shape State *//
	const [shapeLoading, setShapeLoading] = useState(false);
	const [shapeInputValue, setShapeInputValue] = useState('');
	const [shapeOptions, setShapeOptions] = useState<shapesState[]>([]);
	const [shapeSeq, setShapeSeq] = useState<any>('');
	const [shapeObject, setShapeObject] = useState<any>({});
	const throttledInputShapeValue = useThrottle(shapeInputValue, 400);

	//* Caption State *//
	const [, setCaptionLoading] = useState(false);
	const [captionInputValue, setCaptionInputValue] = useState('');
	const throttledInputCaptionValue = useThrottle(captionInputValue, 400);
	const [parameter, setParameter] = useState<any>([]);
	const [priceParaSeq, setPriceParaSeq] = useState<any>('');

	//* select ParaName *//
	const [paraName, setParaName] = useState<any>('');
	const [ftParaType, setftParaType] = useState<any>('');
	const [paraType1, setParaType1] = useState<any>('');
	const [paraType2, setParaType2] = useState<any>('');
	const [nParaType, setnParaType] = useState<any>('');

	//* state fior track editmode*//
	const [editMode, setEditMode] = useState<any>(true);

	// add your refrence  👿
	const viewButtonRef = useRef<any>(null);
	const saveButtonRef = useRef<any>(null);
	const cancelButtonRef = useRef<any>(null);

	let refPage = [
		useHotkeys<any>('alt+v', () => viewButtonRef.current.click()),
		useHotkeys<any>('alt+s', () => saveButtonRef.current.click()),
		useHotkeys<any>('alt+c', () => cancelButtonRef.current.click())
	];

	const confirm = useConfirm();
	const handleKeyDown = (event: any) => {
		if (event.altKey && event.key === 'e') {
			event.preventDefault();
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			dispatch(formtopricingsActions.reset());
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	// *** PARA *** //
	useEffect(() => {
		if (getParaSuccess) {
			if (getParaSuccess?.results) {
				setParaOptions(getParaSuccess?.results);
			} else {
				setParaOptions([]);
			}
		}
		if (getParaError) {
			setParaOptions([]);
		}
		setParaLoading(false);
	}, [getParaError, getParaSuccess]);

	useEffect(() => {
		dispatch(parasActions.reset());
		if (throttledInputParaValue === '' && pageState?.touched?.Paras) {
			setParaLoading(false);
			dispatch(formtopricingsActions.getPara(`'DISC_TYPE'?page=1&limit=10&pagination=false`));
			return undefined;
		} else if (throttledInputParaValue !== '') {
			setParaLoading(false);
			dispatch(
				formtopricingsActions.getPara(
					`'DISC_TYPE'?page=1&limit=10&pagination=false&q=${throttledInputParaValue}`
				)
			);
		}
	}, [throttledInputParaValue]);

	useEffect(() => {
		if (getFTparaTypeSuccess) {
			if (getFTparaTypeSuccess?.price_para) {
				setParameter(getFTparaTypeSuccess?.price_para);
			}
			//reset(getFTparaTypeSuccess?.price_para);
		}
	}, [getFTparaTypeSuccess]);

	// *** SHAPE *** //
	useEffect(() => {
		if (getShapeSuccess) {
			if (getShapeSuccess?.results) {
				setShapeOptions(getShapeSuccess?.results);
			} else {
				setShapeOptions([]);
			}
		}
		if (getShapeError) {
			setShapeOptions([]);
		}
		setShapeLoading(false);
	}, [getShapeError, getShapeSuccess]);

	useEffect(() => {
		dispatch(shapesActions.reset());
		if (throttledInputShapeValue === '' && pageState?.touched?.Shapes) {
			setShapeLoading(true);
			dispatch(shapesActions.get({ QueryParams: `limit=10` }));
			return undefined;
		} else if (throttledInputShapeValue !== '') {
			setShapeLoading(true);
			dispatch(shapesActions.get({ QueryParams: `q=${throttledInputShapeValue}` }));
		}
	}, [throttledInputShapeValue]);

	useEffect(() => {
		dispatch(formtopricingsActions.reset());
		if (throttledInputCaptionValue === '' && pageState?.touched?.caption) {
			setCaptionLoading(true);
			dispatch(formtopricingsActions.get({ QueryParams: `limit=10` }));
			return undefined;
		} else if (throttledInputCaptionValue !== '') {
			setCaptionLoading(true);
			dispatch(formtopricingsActions.get({ QueryParams: `q=${throttledInputCaptionValue}` }));
		}
	}, [throttledInputCaptionValue]);

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

	useEffect(() => {
		if (addSuccess) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Save successfully.',
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
		}
	}, [addSuccess]);

	const handleTypeChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		setTypeSelect(newValue?.name);
		if (newValue && newValue.name) {
			dispatch(formtopricingsActions.getFTparaType(`'${newValue.name}'`));
		} else {
			newValue = '';
			reset(newValue);
		}

		if (!newValue) {
			dispatch(formtopricingsActions.getPara(`'DISC_TYPE'?page=1&limit=10&pagination=false`));
		}
	};

	useEffect(() => {
		if (getFTparaViewSuccess) {
			if (getFTparaViewSuccess?.results) {
				setGridData(getFTparaViewSuccess?.results);
			} else {
				setGridData([]);
			}
			//reset(getFTparaTypeSuccess?.price_para);
		}
	}, [getFTparaViewSuccess]);

	/*para type handle-change & filter*/
	const handleFilterOptionsPara = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = parasFilter(options, state);
		return filtered;
	};

	/*Shape handle-change & filter*/
	const handleFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = shapesFilter(options, state);
		return filtered;
	};

	const handleShapeChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		setShapeSeq(newValue?.seq_no);
		setShapeObject(newValue);
		if (!newValue) {
			dispatch(shapesActions.get({ QueryParams: `page=1&limit=10` }));
		}
	};

	/*HANDLE PARAMETER CHANGE*/
	const handleParameterChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		if (newValue) {
			setPriceParaSeq(newValue?.seq_no);
			setParaName(newValue.para_name);
			setftParaType(newValue?.ft_para_type?.name);
			setParaType1(newValue?.para_type_1?.name);
			setParaType2(newValue?.para_type_2?.name);
			setnParaType(newValue?.npara_type?.name);
		} else {
			setPriceParaSeq('');
			setParaName('');
		}
	};

	/*HANDLE VIEW CHANGE*/
	const handleViewButtonChange = () => {
		dispatch(
			formtopricingsActions.getFTparaView(
				`type=${typeSelect}&Shape_seq=${shapeSeq}&price_para_seq=${priceParaSeq}`
			)
		);
		setEditMode(false);
	};

	const childPropsContact = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				para: array
			}
		}));
	};

	const handleCancel = async (event: any) => {
		if (
			Object.keys(pageState.values).length !== 0 &&
			pageState.values.para.length > 0 &&
			pageState.values.para.some((item: any) => item.action !== null)
		) {
			confirm({
				description: 'Do you want to discard changes ?',
				cancellationButtonProps: { autoFocus: true },
				confirmationText: 'Yes',
				cancellationText: 'No'
			})
				.then(() => {
					setGridData([]);
					setEditMode(true);
				})

				.catch(() => {
					/* */
				});
		} else {
			setGridData([]);
			setEditMode(true);
		}
	};
	// const onSubmit = async () => {};

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		if (Object.keys(pageState.values).length === 0) {
			return;
		} else {
			let errorMessage = null;
			for (let i in pageState.values.para) {
				if (
					(errorMessage === null && pageState.values.para[i].action === 'insert') ||
					pageState.values.para[i].action === 'update'
				) {
					if (
						pageState.values.para[i].from_prop === null ||
						(pageState.values.para[i].from_prop !== null &&
							Number(pageState.values.para[i].from_prop?.seq_no) === 0)
					) {
						if (
							pageState.values.para[i].to_prop !== null &&
							pageState.values.para[i].to_prop?.seq_no !== null &&
							pageState.values.para[i].to_prop?.seq_no > 0
						) {
							errorMessage = `From Prop compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
						}
					} else if (
						pageState.values.para[i].to_prop === null ||
						(pageState.values.para[i].to_prop !== null &&
							Number(pageState.values.para[i].to_prop?.seq_no) === 0)
					) {
						if (
							pageState.values.para[i].from_prop !== null &&
							pageState.values.para[i].from_prop?.seq_no !== null &&
							pageState.values.para[i].from_prop?.seq_no > 0
						) {
							errorMessage = `To Prop compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
						}
					} else if (
						pageState.values.para[i].from_fls === null ||
						(pageState.values.para[i].from_fls !== null &&
							Number(pageState.values.para[i].from_fls?.seq_no) === 0)
					) {
						if (
							pageState.values.para[i].to_fls !== null &&
							pageState.values.para[i].to_fls?.seq_no !== null &&
							pageState.values.para[i].to_fls?.seq_no > 0
						) {
							errorMessage = `From Fls compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
						}
					} else if (
						pageState.values.para[i].to_fls === null ||
						(pageState.values.para[i].to_fls !== null &&
							Number(pageState.values.para[i].to_fls?.seq_no) === 0)
					) {
						if (
							pageState.values.para[i].from_fls !== null &&
							pageState.values.para[i].from_fls?.seq_no !== null &&
							pageState.values.para[i].from_fls?.seq_no > 0
						) {
							errorMessage = `To Fls compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
						}
					} else if (
						pageState.values.para[i].from_purity === null ||
						(pageState.values.para[i].from_purity !== null &&
							Number(pageState.values.para[i].from_purity?.seq_no) === 0)
					) {
						if (
							pageState.values.para[i].to_purity !== null &&
							pageState.values.para[i].to_purity?.seq_no !== null &&
							pageState.values.para[i].to_purity?.seq_no > 0
						) {
							errorMessage = `From Purity compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
						}
					} else if (
						pageState.values.para[i].to_purity === null ||
						(pageState.values.para[i].to_purity !== null &&
							Number(pageState.values.para[i].to_purity?.seq_no) === 0)
					) {
						if (
							pageState.values.para[i].from_purity !== null &&
							pageState.values.para[i].from_purity?.seq_no !== null &&
							pageState.values.para[i].from_purity?.seq_no > 0
						) {
							errorMessage = `To Purity compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
						}
					} else if (
						pageState.values.para[i].from_color === null ||
						(pageState.values.para[i].from_color !== null &&
							Number(pageState.values.para[i].from_color?.seq_no) === 0)
					) {
						if (
							pageState.values.para[i].to_color !== null &&
							pageState.values.para[i].to_color?.seq_no !== null &&
							pageState.values.para[i].to_color?.seq_no > 0
						) {
							errorMessage = `From Color compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
						}
					} else if (
						pageState.values.para[i].to_color === null ||
						(pageState.values.para[i].to_color !== null &&
							Number(pageState.values.para[i].to_color?.seq_no) === 0)
					) {
						if (
							pageState.values.para[i].from_color !== null &&
							pageState.values.para[i].from_color?.seq_no !== null &&
							pageState.values.para[i].from_color?.seq_no > 0
						) {
							errorMessage = `To Color compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
						}
					}

					// *******//// DISC ftParaType paraType1 paraType2 nParaType //// *********
					if (
						pageState.values.para[i].disc_per == null ||
						pageState.values.para[i].name == ''
					) {
						errorMessage = `Disc Per compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
					}
					if (
						ftParaType != '' &&
						(pageState.values.para[i].para_from_value == null ||
							pageState.values.para[i].para_from_value.name == '')
					) {
						errorMessage = `${ftParaType} compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
					}
					if (
						ftParaType != '' &&
						(pageState.values.para[i].para_to_value == null ||
							pageState.values.para[i].para_to_value.name == '')
					) {
						errorMessage = `${ftParaType} compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
					}
					if (
						paraType1 != '' &&
						(pageState.values.para[i].para_value_1 == null ||
							pageState.values.para[i].para_value_1.name == '')
					) {
						errorMessage = `${paraType1} compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
					}
					if (
						paraType2 != '' &&
						(pageState.values.para[i].para_value_2 == null ||
							pageState.values.para[i].para_value_2.name == '')
					) {
						errorMessage = `${paraType2} compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
					}
					if (
						nParaType != '' &&
						(pageState.values.para[i].npara_value == null ||
							pageState.values.para[i].npara_value.name == '')
					) {
						errorMessage = `${nParaType} compulsary Filled for Sr no ${pageState.values.para[i].sr_no}`;
					}
				}
			}

			if (errorMessage == null) {
				dispatch(formtopricingsActions.add(pageState.values));
			} else {
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
	};

	return (
		<>
			<div id="scroll-container">
				<div id="FormTo-container" ref={refPage as any} tabIndex={-1}>
					<Box id="form-main" ref={formRef} onKeyUp={event => onEnterKey(event)}>
						<MainCard content={false} ref={refPage as any} tabIndex={-1}>
							<FormContainer
								formContext={formContext}
								FormProps={{ autoComplete: 'off' }}>
								<Grid container xs={12} spacing={0.5} style={{ margin: '10px' }}>
									<Grid item xs={2.5}>
										<Grid container alignItems="center">
											<Grid item xs={4}>
												<Typography variant="subtitle1">Type</Typography>
											</Grid>
											<Grid item xs={7}>
												<AutocompleteElement
													loading={paraLoading}
													classname={`custom-textfield ${
														!editMode ? 'disabled-textfield' : ''
													}`}
													autocompleteProps={{
														disabled: !editMode,
														selectOnFocus: true,
														clearOnBlur: true,
														handleHomeEndKeys: true,
														freeSolo: true,
														forcePopupIcon: true,
														autoHighlight: true,
														openOnFocus: true,
														onChange: (event, value, reason, details) =>
															handleTypeChange(
																event,
																value,
																reason,
																details
															),
														filterOptions: (options, state) =>
															handleFilterOptionsPara(options, state),
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
													name="type"
													options={paraOptions}
													textFieldProps={{
														InputProps: {},
														onChange: e =>
															setParaInputValue(e.target.value),
														onFocus: () => {
															if (
																paraOptions &&
																paraOptions.length === 0
															) {
																dispatch(
																	formtopricingsActions.getPara(
																		`'DISC_TYPE'?page=1&limit=10&pagination=false`
																	)
																);
															}
														}
													}}
												/>
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs={2.5}>
										<Grid container alignItems="center">
											<Grid item xs={4}>
												<Typography variant="subtitle1">Shape</Typography>
											</Grid>
											<Grid item xs={7}>
												<AutocompleteElement
													loading={shapeLoading}
													classname={`custom-textfield ${
														!editMode ? 'disabled-textfield' : ''
													}`}
													autocompleteProps={{
														disabled: !editMode,
														selectOnFocus: true,
														clearOnBlur: true,
														handleHomeEndKeys: true,
														freeSolo: true,
														forcePopupIcon: true,
														autoHighlight: true,
														openOnFocus: true,
														onChange: (event, value, reason, details) =>
															handleShapeChange(
																event,
																value,
																reason,
																details
															),
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
														}
													}}
													name="shape"
													options={shapeOptions}
													textFieldProps={{
														InputProps: {},
														onChange: e =>
															setShapeInputValue(e.target.value),
														onFocus: () => {
															if (
																shapeOptions &&
																shapeOptions.length === 0
															) {
																dispatch(
																	shapesActions.get({
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
									<Grid item xs={2.5}>
										<Grid container alignItems="center">
											<Grid item xs={4}>
												<Typography variant="subtitle1">
													Parameter
												</Typography>
											</Grid>
											<Grid item xs={7}>
												<AutocompleteElement
													classname={`custom-textfield ${
														!editMode ? 'disabled-textfield' : ''
													}`}
													autocompleteProps={{
														disabled: !editMode,
														selectOnFocus: true,
														clearOnBlur: true,
														handleHomeEndKeys: true,
														freeSolo: true,
														forcePopupIcon: true,
														autoHighlight: true,
														openOnFocus: true,
														autoFocus: true,
														onChange: (event, value, reason, details) =>
															handleParameterChange(
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
															return option.caption;
														}
													}}
													name="caption"
													options={parameter}
													textFieldProps={{
														InputProps: {},
														onChange: e =>
															setCaptionInputValue(e.target.value),
														onFocus: () => {
															if (
																parameter &&
																parameter.length === 0
															) {
																//Do Nothing
															}
														}
													}}
												/>
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs={2.5}>
										<Grid container alignItems="center" spacing={2}>
											<Grid item xs={4}>
												<Button
													ref={viewButtonRef}
													className="custom-button-view"
													variant={
														typeSelect === '' ? 'outlined' : 'contained'
													}
													disabled={typeSelect === ''}
													fullWidth
													placeholder="VIEW"
													onClick={handleViewButtonChange}>
													View
												</Button>
											</Grid>
											<Grid item xs={4}>
												<Button
													ref={cancelButtonRef}
													className="custom-button-view"
													variant={
														typeSelect === '' ? 'outlined' : 'contained'
													}
													disabled={typeSelect === ''}
													onClick={e => handleCancel(e)}
													tabIndex={-1}>
													{formatMessage({ id: 'Cancel' })}
												</Button>
											</Grid>
										</Grid>
									</Grid>
								</Grid>

								<FormToPricingDetail
									passProps={childPropsContact}
									formToPricingOptions={gridData}
									paraName={paraName}
									priceParaSeq={priceParaSeq}
									ftParaType={ftParaType}
									paraType1={paraType1}
									paraType2={paraType2}
									nParaType={nParaType}
									typeSelect={typeSelect}
									shapeObject={shapeObject}
								/>

								{/* -------------- Footer Button start from Below -------------- */}
							</FormContainer>
							<Grid>
								<Grid container spacing={0.5} className="footer-main-dev-button">
									<Grid item xs={0.85}>
										<Button
											onClick={e => {
												handleSubmit(e);
											}}
											ref={saveButtonRef}
											// disableElevation
											className="custom-button"
											type="submit"
											variant="contained"
											color="primary"
											tabIndex={-1}>
											{isSubmitting ? (
												<CircularProgress size={24} color="success" />
											) : (
												formatMessage({ id: 'Save' })
											)}
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</MainCard>
					</Box>
				</div>
			</div>
		</>
	);
}

export default FormToPricing;
