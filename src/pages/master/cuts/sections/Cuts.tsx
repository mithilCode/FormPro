import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, CircularProgress, Dialog, Grid, IconButton, Stack } from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { PopupTransition } from '@components/@extended/Transitions';
import MainCard from '@components/MainCard';
import { CheckBoxEditor, TextFieldEditor, DDTextFieldEditor } from '@components/table/editors';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema, IFormInput } from '@pages/master/cuts/models/cuts';
import { useCutsSlice } from '@pages/master/cuts/store/slice';
import { cutsSelector } from '@pages/master/cuts/store/slice/cuts.selectors';
import {
	InitialQueryParam,
	InitialState,
	ObjecttoQueryString,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	onColumnEditComplete,
	preparePageStateArr
} from '@utils/helpers';

import { InfiniteDataGrid, licenceType } from '@components/table';
import SynonymList from '@components/common/SynonymList';
const gridStyle = {
	minHeight: 400
};

// ==============================|| CUTS ||============================== //

const initParams = {
	page: 1,
	limit: 100,
	pagination: 'true'
} as InitialQueryParam;

const Cuts = () => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const { actions: cutsActions } = useCutsSlice();
	const { actions } = useSnackBarSlice();

	// *** Cuts State *** //
	const cutsState = useSelector(cutsSelector);
	const { addError, addSuccess, getSuccess } = cutsState;

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
				name: 'disc',
				header: 'Base Disc',
				addInHidden: true,
				sortable: false,
				width: 120,
				openInDialog: true,
				renderEditor: (editorProps: any) => {
					return <DDTextFieldEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},

				render: ({ data }: any) => {
					return data && data.disc && data.disc.name ? data.disc.name : '';
				}
			},
			{
				name: 'price_chart',
				header: 'Price Chart',
				headerAlign: 'center',
				textAlign: 'center',
				width: 120,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <CheckBoxEditor {...editorProps} />;
				},
				editorProps: {},
				render: ({ value }: any) => {
					return <Checkbox checked={value} style={{ backgroundColor: 'transparent' }} />;
				}
			},
			{
				name: 'sort_no',
				header: 'Sort No',
				type: 'number',
				headerAlign: 'center',
				textAlign: 'center',
				sortable: false,
				width: 80,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					placeholder: 'Sort No *'
				}
			},
			{
				name: 'is_active',
				header: 'Active',
				headerAlign: 'center',
				textAlign: 'center',
				skipNavigation: true,
				sortable: false,
				width: 80,
				renderEditor: (editorProps: any) => {
					return <CheckBoxEditor {...editorProps} />;
				},
				editorProps: {},
				render: ({ value }: any) => {
					return <Checkbox checked={value} style={{ backgroundColor: 'transparent' }} />;
				}
			},
			{
				name: 'synonym_list',
				header: 'Synonym List',
				sortable: false,
				editable: false,
				width: 130,
				headerAlign: 'center',
				textAlign: 'center',

				render: ({ data }: any) => {
					return (
						<span>
							<IconButton
								onClick={(ev: any) => {
									ev.stopPropagation();
									onEditClick(data);
								}}>
								<EditOutlined />
							</IconButton>
						</span>
					);
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

	const [dialog, setDialog] = useState<boolean>(false);
	const [rowObj, setRowObj] = useState<string>('');

	/*** Dialogbox */
	const [dropDownData, setDropDownData] = useState([]);

	const [gridActiveCell, setGridActiveCell] = useState<any>({});

	useEffect(() => {
		const queryStirng = ObjecttoQueryString(initParams);
		dispatch(cutsActions.get({ QueryParams: queryStirng }));
		return () => {
			dispatch(cutsActions.reset());
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

			dispatch(cutsActions.get({ QueryParams: queryStirng }));
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
			if (getSuccess?.columnType === 'disc_seq') {
				if (getSuccess?.results && getSuccess?.results.length > 0) {
					setDropDownData(getSuccess?.results);
				} else {
					setDropDownData([]);
				}
			} else if (!getSuccess?.columnType || getSuccess?.columnType === null) {
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
	// const onEditStart = () => {
	// 	inEdit = true;
	// };

	// const onEditStop = () => {
	// 	requestAnimationFrame(() => {
	// 		inEdit = false;
	// 		gridRef.current.focus();
	// 	});
	// };

	// const onKeyDown = async (event: any) => {
	// 	const edited = await onTableKeyDown(event, inEdit, gridRef);
	// 	if (edited && edited.colName === 'disc') {
	// 		dispatch(cutsActions.reset());
	// 		dispatch(
	// 			cutsActions.get({
	// 				QueryParams:
	// 					edited.input.length !== 0
	// 						? `columnType=disc_seq&limit=10&q=` + edited.input
	// 						: `columnType=disc_seq&limit=10`
	// 			})
	// 		);
	// 	}

	// 	if (!edited) {
	// 		const grid = gridRef.current;
	// 		const [rowIndex, colIndex] = grid.computedActiveCell;
	// 		const rowCount = grid.count;

	// 		if (event.key === 'Tab') {
	// 			event.preventDefault();
	// 		}

	// 		if (event.key === 'Delete') {
	// 			const data = [...dataSource];

	// 			confirm({
	// 				description: 'Are you sure delete cut ?',
	// 				confirmationButtonProps: { autoFocus: true },
	// 				confirmationText: 'Yes',
	// 				cancellationText: 'No'
	// 			})
	// 				.then(() => {
	// 					const stateArr = deleteRow(pageState, 'seq_no', data, rowIndex);
	// 					return stateArr;
	// 				})
	// 				.then(stateArr => {
	// 					setPageState(value => ({
	// 						...value,
	// 						values: {
	// 							...pageState.values,
	// 							para: stateArr
	// 						}
	// 					}));

	// 					data.splice(rowIndex, 1);
	// 					setDataSource(data);
	// 				})
	// 				.catch(() => {
	// 					/* */
	// 				});
	// 		}

	// 		if (event.key === 'Insert' || (event.key === 'Enter' && rowIndex === rowCount - 1)) {
	// 			let isLastEditableColumn = false;
	// 			if (event.key === 'Enter') {
	// 				let LastEditCol = Math.floor(Math.random() * 100 + 10000);

	// 				for (let index = columns.length - 1; index >= 0; index--) {
	// 					const column = grid.getColumnBy(index);

	// 					if (column) {
	// 						if (column.editable === false || column.skipNavigation === true) {
	// 							/* empty */
	// 						} else {
	// 							LastEditCol = index;
	// 							break;
	// 						}
	// 					}
	// 				}

	// 				if (colIndex === LastEditCol) {
	// 					isLastEditableColumn = true;
	// 					await delay(20);
	// 				}
	// 			}

	// 			const { insertNew, data, stateArr } = await insertNewRow(
	// 				pageState, // State for track row insert, update or delete
	// 				FormSchema, // for validation
	// 				newRowDataSource, // table data
	// 				rowIndex, // row number
	// 				isLastEditableColumn,
	// 				event.key,
	// 				{ is_active: true }
	// 			);

	// 			event.preventDefault();

	// 			if (insertNew) {
	// 				// *** set table with new data
	// 				setDataSource(data);

	// 				// *** set state for api
	// 				setPageState(value => ({
	// 					...value,
	// 					values: {
	// 						...pageState.values,
	// 						para: stateArr
	// 					}
	// 				}));

	// 				// *** Focus on first cell of new added row
	// 				setActiveCell([data.length - 1, 0]);
	// 				setTimeout(() => {
	// 					const column = grid.getColumnBy(0);
	// 					grid.startEdit({ columnId: column.name, rowIndex: data.length - 1 });
	// 				}, 0);
	// 			}
	// 		}
	// 	}
	// };

	// const onEditComplete = useCallback(
	// 	async ({ value, columnId, rowIndex }: any) => {
	// 		if (value === '' || value || typeof value === 'boolean') {
	// 			if (typeof value === 'string') {
	// 				value = value.trim();
	// 			}

	// 			const { stateArr, data } = await prepareOnEditComplete(
	// 				columns,
	// 				dataSource,
	// 				value,
	// 				columnId,
	// 				rowIndex,
	// 				pageState,
	// 				'seq_no'
	// 			);
	// 			// Add rows to in pageState
	// 			setPageState(value => ({
	// 				...value,
	// 				values: {
	// 					...pageState.values,
	// 					para: stateArr
	// 				}
	// 			}));

	// 			setDataSource(data);
	// 		}
	// 	},
	// 	[dataSource]
	// );

	const onEditClick = (rowObj: any) => {
		setDialog(!dialog);
		if (rowObj) setRowObj(rowObj);
	};

	const handleDialog = () => {
		setDialog(!dialog);
		if (rowObj && !dialog) setRowObj('');
	};

	const childProps = (obj: any) => {
		const data = [...dataSource];

		const rowIndex = data.findIndex(object => {
			return object.seq_no === obj.rowObj.seq_no;
		});

		onColumnEditComplete(columns, dataSource, {
			value: obj.str,
			columnId: 'synonym_list',
			rowIndex
		}).then(data => {
			preparePageStateArr(pageState, 'seq_no', data, rowIndex, 'update').then(stateArr => {
				setPageState(value => ({
					...value,
					values: {
						...pageState.values,
						para: stateArr
					}
				}));
				setDataSource(data);
			});
		});
	};

	const onSubmit = async () => {};

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
				dispatch(cutsActions.add(pageState.values));
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
			console.log('INFINITE-DATAGRID', 'SHAPE PAGE', 'onTableDataChange', obj);
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

						console.log('HELLLLLLOO insert row', obj.eventKey);

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
						dispatch(cutsActions.reset());
						if (dialogObj && dialogObj.selectedColumn.column.name === 'disc') {
							dispatch(
								cutsActions.get({
									QueryParams:
										dialogObj.value.length !== 0
											? `columnType=disc_seq&limit=10&q=` + dialogObj.value
											: `page=1&limit=500&pagination=false&columnType=disc_seq`
								})
							);
						}
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

			{/* add customer dialog */}
			{dialog && (
				<Dialog
					disableEscapeKeyDown
					disableRestoreFocus
					maxWidth="sm"
					TransitionComponent={PopupTransition}
					keepMounted
					fullWidth
					onClose={handleDialog}
					open={dialog}
					sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
					aria-describedby="alert-dialog-slide-description">
					<SynonymList
						rowObj={rowObj}
						objKey="synonym_list"
						dialogTitle={'Cut Synonym'}
						onCancel={handleDialog}
						passProps={childProps}
					/>
				</Dialog>
			)}
		</>
	);
};

export default Cuts;
