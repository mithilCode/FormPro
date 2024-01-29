/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { Grid, Stack, Typography } from '@mui/material'; // IconButton,
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { AutocompleteEditor, TextFieldEditor } from '@components/table/editors';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { FormSchema, IFormInput } from '@pages/master/party/models/Process';
import { usePartiesSlice } from '@pages/master/party/store/slice';
import { partiesSelector } from '@pages/master/party/store/slice/parties.selectors';
import {
	//InitialQueryParam,
	InitialState,
	// ObjecttoQueryString,
	onTableKeyDown,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';

import '@inovua/reactdatagrid-community/index.css';

const gridStyle = { minHeight: 150 };
let inEdit: boolean;
let newRowDataSource: any;
let initialFocus = false;

// const initParams = {
// 	page: 1,
// 	limit: 10000,
// 	pagination: 'true'
// } as InitialQueryParam;
// console.log(initParams)

// ==============================|| PROCESS ||============================== //

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
	const { actions: partiesActions } = usePartiesSlice();

	// *** Parties State *** //
	const partiesState = useSelector(partiesSelector);
	const { getProcSuccess } = partiesState;

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
				headerAlign: 'center',
				defaultFlex: 1,
				minWidth: 20,
				maxWidth: 60,
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
	const [activeCell, setActiveCell] = useState<any>([0, 0]);

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
		passProps(pageState.values.para);
		// passProps(newRowDataSource);
	}, [dataSource]);

	useEffect(() => {
		if (gridRef && !initialFocus) {
			requestAnimationFrame(() => {
				initialFocus = true;
				gridRef.current.focus();
			});
		}
	}, [gridRef]);

	const onSubmit = async () => {
		/* empty */
	};

	// *** EVENT HANDDLERS  👿

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
			dispatch(partiesActions.reset());

			dispatch(
				partiesActions.getProc({
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
					description: 'Are you sure delete party ?',
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
					{
						sr_no: rowCount + 1
					}
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
				console.log(stateArr);
				setDataSource(data);
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
