/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Stack, Typography, Checkbox } from '@mui/material'; // IconButton,
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { AutocompleteEditor, CheckBoxEditor, TextFieldEditor } from '@components/table/editors';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { FormSchema, IFormInput } from '@pages/master/emp/models/Process';
import { useEmpsSlice } from '@pages/master/emp/store/slice';
import {
	InitialState,
	onTableKeyDown,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';

import '@inovua/reactdatagrid-community/index.css';
import { empsSelector } from '../store/slice/emps.selectors';
const gridStyle = { minHeight: 150 };
let inEdit: boolean;
let newRowDataSource: any;
let initialFocus = false;

// ==============================|| Process ||============================== //

interface Props {
	passProps?: any;
	addressType?: string;
	selectedData?: any | null;
	processOptions?: any;
	currentAction?: any;
	editMode?: any;
}

const Process = ({ passProps, processOptions, currentAction, editMode }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const { actions: empsActions } = useEmpsSlice();

	// *** emps State *** //
	const empsState = useSelector(empsSelector);
	const { getProcSuccess } = empsState;

	// add your Locale  👿
	// const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		// formState: { isSubmitting },
		reset
	} = formContext;

	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'sr_no',
				header: 'Sr',
				width: 80,
				editable: false,
				skipNavigation: true,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					return <Typography align="center">{data.sr_no}</Typography>;
				}
			},

			{
				name: 'proc',
				header: 'Name',
				width: 150,
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
				render: ({ data }: any) => {
					return data && data.proc && data.proc.name ? data.proc.name : '';
				}
			},
			{
				name: 'is_active',
				header: 'Status',
				width: 120,
				// editable: false,
				skipNavigation: true,
				textAlign: 'center',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <CheckBoxEditor {...editorProps} />;
				},
				editorProps: {},
				render: ({ value }: any) => {
					return <Checkbox checked={value} />;
				}
				// render: ({ value }: any) => (value ? 'True' : 'False')
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
	console.log(refPage);

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());
	const [activeCell, setActiveCell] = useState<any>([0, 1]);

	// *** REDUCER *** //

	useEffect(() => {
		if (
			currentAction &&
			(currentAction === 'Add' ||
				currentAction === 'Save' ||
				currentAction === 'Cancel' ||
				currentAction === 'View' ||
				currentAction === 'View1')
		) {
			reset({
				arr: [{ name: null }] as any
			});
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});
			setDataSource([]);
		}
	}, [currentAction]);

	useEffect(() => {
		if (getProcSuccess) {
			if (getProcSuccess?.columnType === 'proc_seq') {
				let ProcData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'proc'
				);

				if (getProcSuccess?.results && getProcSuccess?.results.length > 0) {
					ProcData = getProcSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: ProcData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			}
		}
	}, [getProcSuccess]);

	useEffect(() => {
		if (processOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: processOptions
				}
			}));
			setDataSource(processOptions);
		}
	}, [processOptions]);

	useEffect(() => {
		newRowDataSource = dataSource;
		passProps(newRowDataSource);
	}, [dataSource]);

	useEffect(() => {
		if (gridRef && !initialFocus) {
			requestAnimationFrame(() => {
				initialFocus = true;
				gridRef.current.focus();
			});
		}
	}, [gridRef]);

	// *** EVENT HANDDLERS  👿

	const onSubmit = async () => {
		/* empty */
	};

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

	const onKeyDown = async (event: any) => {
		const edited = await onTableKeyDown(event, inEdit, gridRef);
		if (edited && edited.colName === 'proc') {
			dispatch(empsActions.reset());

			dispatch(
				empsActions.getProc({
					QueryParams:
						edited.input.length !== 0
							? `columnType=proc_seq&limit=10&q=` + edited.input
							: `columnType=proc_seq&limit=10`
				})
			);
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

				confirm({
					description: 'Are you sure delete process ?',
					confirmationButtonProps: { autoFocus: true },
					confirmationText: 'Yes',
					cancellationText: 'No'
				})
					.then(() => {
						const stateArr = deleteRow(pageState, 'seq_no', data, rowIndex);
						return stateArr;
					})
					.then(stateArr => {
						setPageState(value => ({
							...value,
							values: {
								...pageState.values,
								para: stateArr
							}
						}));

						data.splice(rowIndex, 1);
						setDataSource(data);
					})
					.catch(() => {
						/* */
					});
			}

			if (event.key === 'Insert' || (event.key === 'Enter' && rowIndex === rowCount - 1)) {
				let isLastEditableColumn = false;
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

				const { insertNew, data, stateArr } = await insertNewRow(
					pageState, // State for track row insert, update or delete
					FormSchema, // for validation
					newRowDataSource, // table data
					rowIndex, // row number
					isLastEditableColumn,
					event.key,
					{ sr_no: rowCount + 1, is_active: true }
				);

				event.preventDefault();

				if (insertNew) {
					// *** set table with new data
					setDataSource(data);

					// *** set state for api
					setPageState(value => ({
						...value,
						values: {
							...pageState.values,
							para: stateArr
						}
					}));

					let LastEditCol = Math.floor(Math.random() * 100 + 10000);
					for (let index = 0; index < columns.length - 1; index++) {
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
					// *** Focus on first cell of new added row
					setActiveCell([data.length - 1, LastEditCol]);
					await delay(20);

					// // *** Focus on first cell of new added row
					setTimeout(() => {
						const column = grid.getColumnBy(1);
						grid.startEdit({ columnId: column?.name, rowIndex: data.length - 1 });
					}, 0);
				}
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
				// Add rows to in pageState
				setPageState(value => ({
					...value,
					values: {
						...pageState.values,
						para: stateArr
					}
				}));

				console.log(data);
				setDataSource(stateArr);
			}
		},
		[dataSource]
	);

	return (
		<>
			<MainCard content={false}>
				<FormContainer
					onSuccess={() => onSubmit()}
					formContext={formContext}
					FormProps={{ autoComplete: 'off' }}>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Stack spacing={1}>
								<MainCard content={false} tabIndex="0">
									<ReactDataGrid
										handle={setGridRef}
										idProperty="seq_no"
										nativeScroll={true}
										style={gridStyle}
										activeCell={activeCell}
										onActiveCellChange={setActiveCell}
										onKeyDown={onKeyDown}
										onEditComplete={onEditComplete}
										onEditStart={onEditStart}
										onEditStop={onEditStop}
										editable={editMode}
										columns={columns}
										dataSource={dataSource}
										rowHeight={21}
										headerHeight={22}
										showColumnMenuTool={false}
									/>
								</MainCard>
							</Stack>
						</Grid>
					</Grid>
					<button type="submit" hidden />
				</FormContainer>
			</MainCard>
		</>
	);
};

export default Process;
