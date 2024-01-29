/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch } from 'react-redux';
import { Grid, Stack } from '@mui/material'; // IconButton,

import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { AutocompleteEditor, TextFieldEditor } from '@components/table/editors';
console.log(AutocompleteEditor);
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { FormSchema, IFormInput } from '@pages/master/emp/models/Skill';

import {
	InitialState,
	onTableKeyDown,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';

import '@inovua/reactdatagrid-community/index.css';
import { useEmpsSlice } from '../store/slice';

// import SynonymList from '@components/common/SynonymList';
const gridStyle = { minHeight: 150 };
let inEdit: boolean;
let newRowDataSource: any;
let initialFocus = false;

// ==============================|| Skill ||============================== //

interface Props {
	passProps?: any;
	addressType?: string;
	selectedData?: any | null;
	skillOptions?: any;
	currentAction?: any;
	editMode?: any;
}

const Skill = ({ passProps, skillOptions, currentAction, editMode }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your refrence  👿
	// const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const { actions: empsActions } = useEmpsSlice();
	// const { actions } = useSnackBarSlice();

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
				name: 'skill',
				header: 'Skill',
				width: 150,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'skill '
				}
			},

			{
				name: 'experience',
				header: 'Experience',
				width: 150,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'experience '
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
	// const refPage = useHotkeys<any>('alt+s', () => buttonRef.current.click());

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns] = useState<any>(getColumns()); // , setColumns
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
		if (skillOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: skillOptions
				}
			}));
			setDataSource(skillOptions);
		}
	}, [skillOptions]);

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
	// *** REDUCER *** //

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
				empsActions.add({
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
					{ is_active: true }
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
					<button type="submit" hidden />
				</FormContainer>
			</MainCard>
		</>
	);
};

export default Skill;
