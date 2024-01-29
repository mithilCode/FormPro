/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// import { useHotkeys } from 'react-hotkeys-hook';
import { useSelector } from 'react-redux';
import { Grid, Stack } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { FormSchema, IFormInput } from '@pages/master/emp/models/Refrence';
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
import { TextFieldEditor } from '@components/table/editors';

const gridStyle = { minHeight: 150 };
let inEdit: boolean;
let newRowDataSource: any;
let initialFocus = false;

// ==============================|| RefrenceDetails ||============================== //

interface Props {
	passProps?: any;
	addressType?: string;
	selectedData?: any | null;
	refOptions?: any;
	currentAction?: any;
	editMode?: any;
}

const RefrenceDetails = ({ passProps, refOptions, currentAction, editMode }: Props) => {
	// add your refrence  👿
	// const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const { actions: empsActions } = useEmpsSlice();
	console.log(empsActions);

	// *** emps State *** //
	const empsState = useSelector(empsSelector);
	const { addError } = empsState;
	console.log(addError);

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
				name: 'comp_name',
				header: 'Comp Name',
				width: 150,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Comp Name '
				}
			},
			{
				name: 'ref_name',
				header: 'Ref Name',
				width: 250,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Ref Name '
				}
			},
			{
				name: 'mobile_no',
				header: 'Mobile No',
				width: 150,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					placeholder: 'Name '
				}
			},
			{
				name: 'address',
				header: 'Address',
				width: 200,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Address '
				}
			},
			{
				name: 'comments',
				header: 'Comments',
				width: 200,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Comments '
				}
			},
			{
				name: 'hidden',
				header: 'Id',
				defaultVisible: false,
				defaultWidth: 80,
				headerAlign: 'center'
			}
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
	// const refPage = useHotkeys<any>('alt+s', () => buttonRef.current.click());

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns] = useState<any>(getColumns()); //setColumns
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
				arr: [{ comp_name: null }] as any
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
		if (refOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: refOptions
				}
			}));
			setDataSource(refOptions);
		}
	}, [refOptions]);

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
					description: 'Are you sure delete refrence detail ?',
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
					event.key
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

					// *** Focus on first cell of new added row
					setActiveCell([data.length - 1, 0]);
					setTimeout(() => {
						const column = grid.getColumnBy(0);
						grid.startEdit({ columnId: column.name, rowIndex: data.length - 1 });
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
				</FormContainer>
			</MainCard>
		</>
	);
};

export default RefrenceDetails;
