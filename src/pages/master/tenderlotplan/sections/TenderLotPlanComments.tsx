/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Stack, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { FormSchema, IFormInput } from '@pages/master/tenderlotplan/models/TenderLotPlanComments';
import { AutocompleteEditor, TextFieldEditor } from '@components/table/editors';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useTenderlotplansSlice } from '@pages/master/tenderlotplan/store/slice';
import { tempDataStore } from './TenderLotPlan';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
// import { tenderlotplansSelector } from '@pages/master/tenderlotplan/store/slice/tenderlotplans.selectors';

import {
	//InitialQueryParam,
	InitialState,
	onTableKeyDown,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';
import '@inovua/reactdatagrid-community/index.css';
import { tenderlotplansSelector } from '../store/slice/tenderlotplans.selectors';

const gridStyle = { minHeight: 168 };
let inEdit: boolean;
let newRowDataSource: any;
let newPageState: any;

// ==============================|| TENDER LOT PLAN COMMENTS ||============================== //

interface Props {
	passProps?: any;
	selectedData?: any;
	tenderLotSeq?: any;
	tenderLotcommSeq?: any;
	CommemtsOptions?: any;
	CommemtsToAssortmentOptions?: any;
	CommemtsToAssorHideCol?: any;
	currentAction?: any;
	currentFocus?: any;
	editMode?: any;
}

const TenderLotPlanComments = ({
	passProps,
	CommemtsOptions,
	selectedData,
	CommemtsToAssortmentOptions,
	CommemtsToAssorHideCol,
	tenderLotSeq,
	currentAction,
	currentFocus,
	editMode
}: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();
	const { tableRefSeq, tenderLotComSeq } = useContext(tempDataStore);

	// *** Tenderlotplans State *** //
	const { actions: tenderlotplansActions } = useTenderlotplansSlice();
	const { actions } = useSnackBarSlice();

	const tenderlotplansState: any = useSelector(tenderlotplansSelector);
	const { getCheckerSuccess, getAssortSuccess, getOneAssortmentSuccess } = tenderlotplansState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		formState: { isSubmitting }
	} = formContext;

	const { reset } = formContext;

	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'emp',
				header: 'Checker Name *',
				minWidth: 50,
				maxWidth: 120,
				addInHidden: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.emp && data.emp?.name ? data.emp?.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'assort_type',
				header: 'Assort Type *',
				minWidth: 50,
				maxWidth: 110,
				addInHidden: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.assort_type && data.assort_type?.name
								? data.assort_type.name
								: ''}
						</Typography>
					);
				}
			},
			{
				name: 'yield',
				header: 'Yield',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 40,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					pattern: 'number'
				},
				render: ({ data }: any) => {
					let Yield = parseFloat(data.yield);
					if (!isNaN(Yield)) {
						let result = Yield.toFixed(2);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'comments',
				header: 'Comments',
				minWidth: 300,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
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

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());
	const [activeCell, setActiveCell] = useState<any>([0, 0]);
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [focusActiveCell, setFocusActiveCell] = useState<any>(null);

	const confirm = useConfirm();
	const [gridRef, setGridRef] = useState<any>(null);

	const handleRowSelect = useCallback(
		(rowData: any) => {
			if (selectedRow !== rowData.data) {
				setSelectedRow(rowData.data);
				tenderLotComSeq(rowData.data?.seq_no);
				CommemtsToAssorHideCol(rowData.data?.assort_type?.name.toLocaleLowerCase());
			}
		},
		[selectedRow]
	);

	useEffect(() => {
		return () => {
			dispatch(tenderlotplansActions.reset());
		};
	}, []);

	useEffect(() => {
		if (currentAction == 2) {
			const grid = gridRef.current;
			setActiveCell([0, 0]);
			setTimeout(() => {
				const column = grid.getColumnBy(0);
				grid.startEdit({ columnId: column.name, rowIndex: 0 });
			}, 10);
		}
	}, [currentAction]);

	useEffect(() => {
		if (getOneAssortmentSuccess) {
			if (getOneAssortmentSuccess?.results) {
				//CommemtsToAssortmentOptions(getOneAssortmentSuccess?.results.tender_assort);
				CommemtsToAssortmentOptions({
					tenderLotCommSeq: selectedRow?.seq_no,
					data: getOneAssortmentSuccess?.results.tender_assort
				});
				//tenderLotComSeq(getOneAssortmentSuccess?.results.tender_assort[0]?.seq_no);
			}
		}
	}, [getOneAssortmentSuccess]);

	useEffect(() => {
		if (CommemtsOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: CommemtsOptions
				}
			}));
			let data: any = CommemtsOptions?.filter((e: any) => e.action !== 'delete');
			setDataSource(data);
			if (data.length > 0) {
				setActiveCell([0, 0]);
				CommemtsToAssorHideCol(data[0]?.assort_type?.name.toLocaleLowerCase());
				tenderLotComSeq(data[0]?.seq_no);
				setSelectedRow(data[0]);
			}
		}
	}, [CommemtsOptions]);

	useEffect(() => {
		newRowDataSource = dataSource;
	}, [dataSource]);

	useEffect(() => {
		newPageState = pageState;
		passProps(
			newPageState.values?.para?.filter(
				(e: any) => e.emp != null && e.assort_type != null
				//&& (e.seq_no > 0 || e.action !== 'delete')
			)
		);
	}, [pageState]);

	/*CHECKER DROPDOWN*/
	useEffect(() => {
		if (getCheckerSuccess) {
			if (getCheckerSuccess?.results) {
				if (getCheckerSuccess?.columnType === 'emp') {
					let Emp1Data = [];
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'emp'
					);

					if (getCheckerSuccess?.results && getCheckerSuccess?.results.length > 0) {
						Emp1Data = getCheckerSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: Emp1Data,
							collapseOnSelect: true,
							clearIcon: null
						};
						setColumns(updatedColumns);
					}
				}
			}
		}
	}, [getCheckerSuccess]);

	/*ASSORT TYPE*/
	useEffect(() => {
		if (getAssortSuccess) {
			let assortData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'assort_type'
			);

			if (getAssortSuccess?.results && getAssortSuccess?.results.length > 0) {
				assortData = getAssortSuccess?.results;
			}

			if (editorTypeColumnIndex !== -1) {
				updatedColumns[editorTypeColumnIndex].editorProps = {
					idProperty: 'seq_no',
					dataSource: assortData,
					collapseOnSelect: true,
					clearIcon: null
				};
				setColumns(updatedColumns);
			}
		}
	}, [getAssortSuccess]);

	useEffect(() => {
		if (newRowDataSource.length == 1 && focusActiveCell == 1) {
			setActiveCell([0, 0]);
			const grid = gridRef.current;
			setTimeout(() => {
				grid.startEdit({ columnId: 'emp', rowIndex: 0 });
			}, 0);
			setFocusActiveCell(null);
		}
	}, [focusActiveCell]);

	// Editable React data table
	const onEditStart = () => {
		inEdit = true;
	};

	const onEditStop = () => {
		requestAnimationFrame(() => {
			inEdit = false;
			gridRef.current.focus();
		});
	};
	// key down
	const onKeyDown = async (event: any) => {
		const edited = await onTableKeyDown(event, inEdit, gridRef);
		// let empArray = [];
		if (tableRefSeq?.lotSeq > 0) {
			if (edited && edited.colName === 'emp') {
				// if (selectedData) {
				// 	if (selectedData.emp_1?.seq_no) {
				// 		empArray.push(selectedData.emp_1?.seq_no);
				// 	}
				// 	if (selectedData.emp_2?.seq_no) {
				// 		empArray.push(selectedData.emp_2?.seq_no);
				// 	}
				// 	if (selectedData.emp_3?.seq_no) {
				// 		empArray.push(selectedData.emp_3?.seq_no);
				// 	}
				// }
				//QueryParams: `columnType=emp&pagination=false&q=type='E' and seq_no in(${empArray.join(',')})`
				dispatch(
					tenderlotplansActions.getChecker({
						QueryParams: `columnType=emp&pagination=false&q=type='E'`
					})
				);
			}
			if (edited && edited.colName === 'assort_type') {
				dispatch(tenderlotplansActions.reset());

				dispatch(tenderlotplansActions.getAssort('ASSORT_TYPE'));
			}
			if (!edited) {
				const grid = gridRef.current;
				const [rowIndex, colIndex] = grid.computedActiveCell;
				const rowCount = grid.count;

				if (event.key === 'Tab') {
					event.preventDefault();
				}

				if (event.key === 'Delete') {
					const data = [...dataSource];
					let deleteArray: any;
					confirm({
						description: 'Are you sure delete comment ?',
						cancellationButtonProps: { autoFocus: true },
						confirmationText: 'Yes',
						cancellationText: 'No'
					})
						.then(() => {
							let stateArr: any;
							if (
								pageState.values.para[rowIndex] &&
								pageState.values.para[rowIndex].emp &&
								pageState.values.para[rowIndex].assort_type &&
								pageState.values.para[rowIndex].seq_no < -1
							) {
								stateArr = pageState.values.para ? [...pageState.values.para] : [];
								stateArr[rowIndex].action = 'delete';
							} else {
								stateArr = deleteRow(pageState, 'seq_no', data, rowIndex);
							}
							return stateArr;
						})
						.then(stateArr => {
							setPageState(value => ({
								...value,
								values: {
									...pageState.values,
									para: stateArr //.filter((e: any) => e.action !== 'delete' && e.seq_no > -1)
								}
							}));

							data.splice(rowIndex, 1);
							setDataSource(data);
							setActiveCell([rowIndex - 1, 0]);
							let newRowIndex = rowIndex != 0 ? rowIndex - 1 : 0;
							tenderLotComSeq(data[newRowIndex]?.seq_no);
							setTimeout(() => {
								const column = grid.getColumnBy(0);
								grid.startEdit({
									columnId: column.name,
									rowIndex: newRowIndex
								});
							}, 0);
						})
						.catch(() => {
							/* */
						});
				}

				if (
					event.key === 'Insert' ||
					(event.key === 'Enter' && rowIndex === rowCount - 1) ||
					(event.key === 'ArrowDown' && rowIndex === rowCount - 1)
				) {
					let isLastEditableColumn = false;
					if (event.key === 'ArrowDown') {
						/* discussion to dharmeshbhai for arrow down*/
						event.key = 'Insert';
					}
					if (event.key === 'Enter') {
						let LastEditCol = Math.floor(Math.random() * 100 + 10000);

						for (let index = columns.length - 1; index >= 0; index--) {
							const column = grid.getColumnBy(index);

							if (column) {
								if (column.editable === false || column.skipNavigation === true) {
									/* empty */
								} else {
									LastEditCol = index;
									break;
								}
							}
						}

						if (colIndex === LastEditCol) {
							isLastEditableColumn = true;
							await delay(20);
						}
					}
					event.preventDefault();
					event.stopPropagation();
					const { insertNew, data, stateArr } = await insertNewRow(
						newPageState, // State for track row insert, update or delete
						FormSchema, // for validation
						newRowDataSource, // table data
						rowIndex, // row number
						isLastEditableColumn,
						event.key,
						{ tender_lot_det_seq: tableRefSeq?.lotSeq }
					);

					event.preventDefault();

					if (insertNew) {
						// *** set table with new data
						tableRefSeq.tenderLotComSeq =
							stateArr[stateArr?.length > 0 ? stateArr?.length - 1 : 0].seq_no;
						handleRowSelect({
							data: stateArr[stateArr?.length > 0 ? stateArr?.length - 1 : 0]
						});
						setDataSource(data);

						// *** set state for api
						setPageState(value => ({
							...value,
							values: {
								...pageState.values,
								para: stateArr
							}
						}));

						// *** Focus on first cell of new added row
						setActiveCell([data.length - 1, 0]);
						setTimeout(() => {
							const column = grid.getColumnBy(0);
							grid.startEdit({ columnId: column.name, rowIndex: data.length - 1 });
						}, 0);
					}
				}
			}
		} else {
			if (event.key === 'Insert' || event.key === 'ArrowDown') {
				dispatch(
					actions.openSnackbar({
						open: true,
						message: 'Please select tender lot',
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

	const onEditComplete = useCallback(
		async ({ value, columnId, rowIndex }: any) => {
			if (value === '' || value || typeof value === 'boolean') {
				if (typeof value === 'string') {
					value = value.trim();
				}

				const { stateArr, data } = await prepareOnEditComplete(
					columns,
					dataSource,
					value,
					columnId,
					rowIndex,
					pageState,
					'seq_no'
				);
				if (columnId == 'assort_type') {
					CommemtsToAssorHideCol(value.name.toLowerCase());
				}

				setSelectedRow(stateArr[rowIndex]);
				// Add rows to in pageState
				setPageState(value => ({
					...value,
					values: {
						...pageState.values,
						para: stateArr
					}
				}));
				setDataSource(data.filter((e: any) => e.action !== 'delete'));
			}
		},
		[dataSource]
	);

	const isGridValidForNewBlankRow = (columnNames: string[], data: any): boolean => {
		// Check if data array is not empty
		if (data.length === 0) {
			return false;
		}
		// Get the last row from the data array
		const lastRow = data[data.length - 1];
		// Check if all required fields in the last row are not null or undefined
		const isValid = columnNames.every(columnName => {
			// Assuming required fields are those that are not allowed to be null or undefined
			return lastRow[columnName] !== null && lastRow[columnName] !== undefined;
		});

		return isValid;
	};
	const onFocus = async (event: any) => {
		let isValidForNewRow = newRowDataSource.length === 0 ? true : false;
		if (isValidForNewRow) {
			if (tableRefSeq?.lotSeq > 0) {
				const { insertNew, data, stateArr } = await insertNewRow(
					pageState, // State for track row insert, update or delete
					FormSchema, // for validation
					newRowDataSource, // table data
					0, // row number
					true,
					'Focus',
					{ tender_lot_det_seq: tableRefSeq?.lotSeq }
				);

				event.preventDefault();
				if (insertNew) {
					// *** set table with new data
					tableRefSeq.tenderLotComSeq =
						stateArr[stateArr?.length > 0 ? stateArr?.length - 1 : 0].seq_no;
					handleRowSelect({
						data: stateArr[stateArr?.length > 0 ? stateArr?.length - 1 : 0]
					});
					setDataSource(data);

					// *** set state for api
					setPageState(value => ({
						...value,
						values: {
							...pageState.values,
							para: stateArr
						}
					}));

					setFocusActiveCell(1);
				}
			} else {
				dispatch(
					actions.openSnackbar({
						open: true,
						message: 'Please select tender lot',
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
		currentFocus(2);
	};

	return (
		<MainCard content={false} tabIndex={-1}>
			<FormContainer formContext={formContext}>
				{/* <Grid container spacing={1}>
					<Grid item xs={12}>
						<Stack spacing={1}>
							<MainCard content={false} tabIndex="0">
								
							</MainCard>
						</Stack>
					</Grid>
				</Grid> */}
				<ReactDataGrid
					handle={setGridRef}
					idProperty="seq_no"
					nativeScroll={true}
					style={gridStyle}
					keyPageStep={0}
					activeCell={activeCell}
					onActiveCellChange={setActiveCell}
					onKeyDown={onKeyDown}
					onEditComplete={onEditComplete}
					onEditStart={onEditStart}
					onEditStop={onEditStop}
					onFocus={onFocus}
					editable={editMode}
					columns={columns}
					dataSource={dataSource}
					rowHeight={21}
					headerHeight={22}
					showColumnMenuTool={false}
					onRowClick={(e: any) => handleRowSelect(e)}
					showZebraRows={false}
				/>
				<button type="submit" hidden />
			</FormContainer>
		</MainCard>
	);
};

export default TenderLotPlanComments;
