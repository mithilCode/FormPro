/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// import { useHotkeys } from 'react-hotkeys-hook';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Stack, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { FormSchema, IFormInput } from '@pages/master/emp/models/Visa';
import { useEmpsSlice } from '@pages/master/emp/store/slice';
import dayjs from 'dayjs';
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
import { AutocompleteEditor, DatePickerEditor, TextFieldEditor } from '@components/table/editors';

const gridStyle = { minHeight: 150 };
let inEdit: boolean;
let newRowDataSource: any;
let initialFocus = false;

// ==============================|| RefrenceDetails ||============================== //

interface Props {
	passProps?: any;
	addressType?: string;
	selectedData?: any | null;
	visaOptions?: any;
	currentAction?: any;
	editMode?: any;
}

const Visa = ({ passProps, visaOptions, currentAction, editMode }: Props) => {
	const dispatch = useDispatch();

	// add your refrence  👿
	// const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const { actions: empsActions } = useEmpsSlice();
	console.log(empsActions);

	// *** emps State *** //
	const empsState = useSelector(empsSelector);
	const { getCountrySuccess, getVisaSuccess } = empsState;

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
				name: 'country',
				header: 'Country',
				width: 150,
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
					return data && data.country && data.country.name ? data.country.name : '';
				}
			},
			{
				name: 'visa_type',
				header: 'Visa Type',
				width: 150,
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
					return data && data.visa_type && data.visa_type.name ? data.visa_type.name : '';
				}
			},
			{
				name: 'from_date',
				header: 'From Date',
				defaultFlex: 1,
				minWidth: 60,
				maxWidth: 120,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <DatePickerEditor {...editorProps} />;
				},
				editorProps: {
					type: 'date'
					// maxLength: 5
				},
				render: ({ data, value }: any) => {
					return (
						<Typography align="center">
							{data && data.from_date && data.from_date
								? dayjs(data.from_date).format('DD-MM-YYYY')
								: value
								? dayjs(value).format('DD-MM-YYYY')
								: ''}
						</Typography>
					);
				}
			},
			{
				name: 'to_date',
				header: 'To Date',
				defaultFlex: 1,
				minWidth: 60,
				maxWidth: 120,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <DatePickerEditor {...editorProps} />;
				},
				editorProps: {
					type: 'date'
					// maxLength: 5
				},
				render: ({ data, value }: any) => {
					return (
						<Typography align="center">
							{data && data.to_date && data.to_date
								? dayjs(data.to_date).format('DD-MM-YYYY')
								: value
								? dayjs(value).format('DD-MM-YYYY')
								: ''}
						</Typography>
					);
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
		if (visaOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: visaOptions
				}
			}));
			setDataSource(visaOptions);
		}
	}, [visaOptions]);

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

	useEffect(() => {
		if (getCountrySuccess) {
			let CountryData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'country'
			);

			if (getCountrySuccess?.results && getCountrySuccess?.results.length > 0) {
				CountryData = getCountrySuccess?.results;
			}

			if (editorTypeColumnIndex !== -1) {
				updatedColumns[editorTypeColumnIndex].editorProps = {
					idProperty: 'seq_no',
					dataSource: CountryData,
					collapseOnSelect: true,
					clearIcon: null
				};
				setColumns(updatedColumns);
			}
		}
	}, [getCountrySuccess]);

	useEffect(() => {
		if (getVisaSuccess) {
			let VisaData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'visa_type'
			);

			if (getVisaSuccess?.results && getVisaSuccess?.results.length > 0) {
				VisaData = getVisaSuccess?.results;
			}

			if (editorTypeColumnIndex !== -1) {
				updatedColumns[editorTypeColumnIndex].editorProps = {
					idProperty: 'seq_no',
					dataSource: VisaData,
					collapseOnSelect: true,
					clearIcon: null
				};
				setColumns(updatedColumns);
			}
		}
	}, [getVisaSuccess]);

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
		if (edited && edited.colName === 'country') {
			dispatch(empsActions.getCountry(''));
		}
		if (edited && edited.colName === 'visa_type') {
			dispatch(empsActions.getVisa('VISA_TYPE'));
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
					description: 'Are you sure delete Visa ?',
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
						setDataSource(stateArr);
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
				</FormContainer>
			</MainCard>
		</>
	);
};

export default Visa;
