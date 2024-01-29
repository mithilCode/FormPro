/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Stack } from '@mui/material'; // IconButton,
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { TextFieldEditor, AutocompleteEditor } from '@components/table/editors';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { FormSchema, IFormInput } from '@pages/master/party/models/Bank';
import { usePartiesSlice } from '@pages/master/party/store/slice';
import { partiesSelector } from '@pages/master/party/store/slice/parties.selectors';

import {
	InitialQueryParam,
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

const initParams = {
	page: 1,
	limit: 10000,
	pagination: 'true'
} as InitialQueryParam;
console.log(initParams);

// ==============================|| BANKDETAILS ||============================== //

interface Props {
	passProps?: any;
	addressType?: string;
	selectedData?: any | null;
	bankOptions?: any;
	currentAction?: any;
	editMode?: any;
}

const BankDetail = ({ passProps, bankOptions, currentAction, editMode }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const partiesState = useSelector(partiesSelector);

	// *** Parties State *** //
	const { actions: partiesActions } = usePartiesSlice();
	const { getParaAcTypeSuccess } = partiesState;

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
				name: 'bank_name',
				header: 'Name',
				defaultFlex: 1,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: ' Name '
				}
			},

			{
				name: 'branch_name',
				header: 'Branch Name',
				defaultFlex: 1,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Branch Name '
				}
			},
			{
				name: 'ac_type',
				header: 'Ac Type',
				defaultFlex: 1,
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
					return data && data.ac_type && data.ac_type.name ? data.ac_type.name : '';
				}
			},
			{
				name: 'ac_name',
				header: 'Ac Name',
				defaultFlex: 1,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Ac Name '
				}
			},
			{
				name: 'ac_no',
				header: 'Ac No.',
				defaultFlex: 1,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					placeholder: 'Ac No '
				}
			},
			{
				name: 'ifsc_code',
				header: 'IFSC Code',
				defaultFlex: 1,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'IFSC Code '
				}
			},
			{
				name: 'swift_code',
				header: 'SWIFT Code',
				defaultFlex: 1,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					placeholder: 'SWIFT Code '
				}
			},

			{
				name: 'comments',
				header: 'Comments',
				defaultFlex: 1,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Comments'
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
		if (bankOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: bankOptions
				}
			}));
			setDataSource(bankOptions);
		}
	}, [bankOptions]);

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

	useEffect(() => {
		if (getParaAcTypeSuccess) {
			let ParaData = [];
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'ac_type'
			);

			if (getParaAcTypeSuccess?.results && getParaAcTypeSuccess?.results.length > 0) {
				ParaData = getParaAcTypeSuccess?.results;
			}

			if (editorTypeColumnIndex !== -1) {
				updatedColumns[editorTypeColumnIndex].editorProps = {
					idProperty: 'seq_no',
					dataSource: ParaData,
					collapseOnSelect: true,
					clearIcon: null
				};
				setColumns(updatedColumns);
			}
		}
	}, [getParaAcTypeSuccess]);
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

		//dispatch(partiesActions.reset());
		if (edited && edited.colName === 'ac_type') {
			dispatch(partiesActions.getParaAcType('BANK_AC_TYPE'));
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

export default BankDetail;
