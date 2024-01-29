/* eslint-disable @typescript-eslint/no-empty-function */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress, Grid, Stack } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import MainCard from '@components/MainCard';
import { TextFieldEditor } from '@components/table/editors';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema, IFormInput } from '@pages/master/currencies/models/Currencies';
import { useCurrenciesSlice } from '@pages/master/currencies/store/slice';
import { currenciesSelector } from '@pages/master/currencies/store/slice/currencies.selectors';
import {
	InitialQueryParam,
	InitialState,
	ObjecttoQueryString,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete
} from '@utils/helpers';

import { InfiniteDataGrid, licenceType } from '@components/table';

const gridStyle = {
	minHeight: 400
};

// ==============================|| CURRENCIES ||============================== //

const initParams = {
	page: 1,
	limit: 10000,
	pagination: 'true'
} as InitialQueryParam;

const Currencies = () => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const { actions: currenciesActions } = useCurrenciesSlice();
	const { actions } = useSnackBarSlice();

	// *** Currency State *** //
	const currenciesState = useSelector(currenciesSelector);
	const { addError, addSuccess, getSuccess } = currenciesState;

	// add your Locale  👿
	const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		formState: { isSubmitting },
		reset
	} = formContext;

	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'name',
				header: 'Name',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Name *'
				}
			},
			{
				name: 'short_name',
				header: 'Short Name',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Short Name *',
					maxLength: 5
				}
			},
			{
				name: 'type',
				header: 'Type',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Type',
					maxLength: 1
				}
			},
			{
				name: 'symbol',
				header: 'Symbol',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Symbol'
				}
			},
			{
				name: 'round_off',
				header: 'Round Off',
				width: 100,
				type: 'number',
				headerAlign: 'center',
				textAlign: 'center',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					placeholder: 'Roundoff'
				}
			},
			{
				name: 'sort_no',
				header: 'Sort No',
				width: 80,
				type: 'number',
				headerAlign: 'center',
				textAlign: 'center',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					placeholder: 'Sort No *'
				}
			},
			{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
		];
	};

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});
	const confirm = useConfirm();
	const [gridRef, setGridRef] = useState<any>(null);
	const refPage = useHotkeys<any>('alt+s', () => buttonRef.current.click());

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());

	/*** Dialogbox */
	const [dropDownData, setDropDownData] = useState([]);

	const [gridActiveCell, setGridActiveCell] = useState<any>({});

	// *** add your useEffect ( Order must be empty dependancy first, ... , success, error)  👿

	useEffect(() => {
		const queryStirng = ObjecttoQueryString(initParams);
		dispatch(currenciesActions.get({ QueryParams: queryStirng }));
		return () => {
			dispatch(currenciesActions.reset());
		};
	}, []);

	// *** REDUCER *** //

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
			reset();
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});

			const queryStirng = ObjecttoQueryString(initParams);

			dispatch(currenciesActions.get({ QueryParams: queryStirng }));
		}
	}, [addSuccess]);

	useEffect(() => {
		if (addError) {
			const message = addError && addError.error ? addError.error.errors[0] : '';

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
	}, [addError]);

	useEffect(() => {
		if (getSuccess) {
			if (!getSuccess?.columnType || getSuccess?.columnType === null) {
				if (getSuccess?.results && getSuccess?.results.length > 0) {
					setDataSource(getSuccess?.results);
				} else {
					setDataSource([]);
				}
			}
		}
	}, [getSuccess]);

	// *** EVENT HANDDLERS  👿

	// Editable React data table

	const onSubmit = async () => {
		/* empty */
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		if (Object.keys(pageState.values).length === 0) {
			return;
		} else {
			let errorMessage = null;
			for (let i in pageState.values.para) {
				if (pageState.values.para[i].action != 'delete') {
					if (
						pageState.values.para[i].name == null ||
						pageState.values.para[i].name == ''
					) {
						errorMessage = 'Name must be required.';
					} else if (
						pageState.values.para[i].short_name == null ||
						pageState.values.para[i].short_name == ''
					) {
						errorMessage = 'Short Name must be required.';
					} else if (
						pageState.values.para[i].sort_no == null ||
						pageState.values.para[i].sort_no == ''
					) {
						errorMessage = 'Sort No must be required.';
					}
				}
			}

			if (errorMessage == null) {
				dispatch(currenciesActions.add(pageState.values));
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

	const handleCancel = async (event: any) => {
		if (Object.keys(pageState.values).length !== 0 && pageState.values.para.length > 0) {
			confirm({
				description: 'Do you want to discard changes ?',
				confirmationButtonProps: { autoFocus: true },
				confirmationText: 'Yes',
				cancellationText: 'No'
			})
				.then(() => {
					window.location.reload();
				})

				.catch(() => {
					/* */
				});
		}
	};

	const onTableDataChange = useCallback(
		async (obj: any) => {
			const { table, type, subType, data, rowIndex, colIndex } = obj;
			switch (type) {
				case 'delete-row':
					const stateArr = await deleteRow(pageState, 'seq_no', data, rowIndex);

					setPageState(value => ({
						...value,
						values: {
							...pageState.values,
							para: stateArr
						}
					}));

					const deleteData = [...data];
					deleteData.splice(rowIndex, 1);
					setDataSource(deleteData);
					break;

				case 'insert-row':
					const {
						insertNew,
						data: insertData,
						stateArr: insertStateArr
					} = await insertNewRow(
						pageState, // State for track row insert, update or delete
						FormSchema, // for validation
						dataSource, // table data
						rowIndex, // row number
						obj.isLastEditableColumn,
						obj.eventKey,
						{ is_active: true }
					);

					if (insertNew) {
						// *** set table with new data
						setDataSource(insertData);

						// *** set state for api
						setPageState(value => ({
							...value,
							values: {
								...pageState.values,
								para: insertStateArr
							}
						}));

						// *** Focus on first cell of new added row
						setGridActiveCell({
							type: 'insert-row',
							row: insertData.length - 1,
							col: 0
						});
					}

					break;
				case 'dialog-data-change':
					const { dialogObj, rowSelectedObj } = obj;

					if (subType === 'handle-change') {
						// **** NOTE ***
						// *** Static Data in ComboBox then Just filter data and set State of dropDownData here
					} else if (subType === 'handle-row-selected') {
						const { stateArr: dialogStateArr, data: dialogData } =
							await prepareOnEditComplete(
								columns,
								dataSource,
								rowSelectedObj.originData,
								rowSelectedObj.selectedColumn.column.name,
								rowSelectedObj.selectedColumn.rowIndex,
								pageState,
								'seq_no'
							);
						// Add rows to in pageState
						setPageState(value => ({
							...value,
							values: {
								...pageState.values,
								para: dialogStateArr
							}
						}));

						setDataSource(dialogData);

						setGridActiveCell({
							type: 'dialog-data-change',
							subType: 'handle-row-selected',
							rowIndex,
							colIndex
						});
					}
					break;
				case 'on-edit-complete':
					const { value, columnId } = obj;

					const { stateArr: onEditStateArr, data: onEditData } =
						await prepareOnEditComplete(
							columns,
							dataSource,
							value,
							columnId,
							rowIndex,
							pageState,
							'seq_no'
						);

					// Add rows to in pageState
					setPageState(value => ({
						...value,
						values: {
							...pageState.values,
							para: onEditStateArr
						}
					}));

					setDataSource(onEditData);
					break;

				default:
					break;
			}
		},
		[dataSource]
	);

	return (
		<>
			<MainCard content={false} ref={refPage as any} tabIndex={-1}>
				<FormContainer
					onSuccess={() => onSubmit()}
					formContext={formContext}
					FormProps={{ autoComplete: 'off' }}>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Stack spacing={1}>
								<MainCard content={false} tabIndex="0">
									<InfiniteDataGrid
										tableName={'primary'}
										idProperty="seq_no"
										nativeScroll={true}
										initParams={initParams}
										columns={columns}
										dataSource={dataSource}
										onTableDataChange={onTableDataChange}
										style={gridStyle}
										gridActiveCell={gridActiveCell}
										dropDownDataSource={dropDownData}
										editable={true}
										groups={[
											{
												name: 'base',
												header: (
													<span
														style={{
															display: 'flex',
															justifyContent: 'center'
														}}>
														Base
													</span>
												)
											}
										]}
										rowHeight={21}
										headerHeight={22}
										showColumnMenuTool={false}
										showZebraRows={false}
										//dialogColumns={dialogColumns}
										focus={true}
									/>
								</MainCard>
							</Stack>
						</Grid>
					</Grid>
					<button type="submit" hidden />
				</FormContainer>
				<Grid container sx={{ mt: 1.5, mb: 1.5 }}>
					<Grid item xs={12}>
						<Stack
							sx={{ mr: 1.5 }}
							direction="row"
							spacing={1}
							justifyContent="left"
							alignItems="center">
							<Button
								style={{ height: '30px', width: '70px' }}
								ref={buttonRef}
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
									formatMessage({ id: 'Save' })
								)}
							</Button>
							<Button
								style={{ height: '30px', width: '70px' }}
								variant="outlined"
								color="secondary"
								onClick={e => handleCancel(e)}>
								{formatMessage({ id: 'Cancel' })}
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</MainCard>
		</>
	);
};

export default Currencies;
