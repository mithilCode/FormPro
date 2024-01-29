/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Stack, Typography, Checkbox } from '@mui/material';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { FormSchema, IFormInput } from '@pages/master/tenderlotplan/models/TenderLotPlanComments';
import { AutocompleteEditor, CheckBoxEditor, TextFieldEditor } from '@components/table/editors';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useTenderlotplansSlice } from '@pages/master/tenderlotplan/store/slice';
// import { tenderlotplansSelector } from '@pages/master/tenderlotplan/store/slice/tenderlotplans.selectors';

import {
	//InitialQueryParam,
	InitialState,
	onTableKeyDown,
	insertNewRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';
import '@inovua/reactdatagrid-community/index.css';
import { tenderlotplansSelector } from '@pages/master/tenderlotplan/store/slice/tenderlotplans.selectors';

const gridStyle = { minHeight: 160 };
let newRowDataSource: any;
let inEdit: boolean;

// ==============================|| TENDER LOT PLAN COMMENTS ||============================== //

interface Props {
	passProps?: any;
	tenderLotSeq?: any;
	CommemtsOptions?: any;
	currentAction?: any;
	editMode?: any;
	viewAssortOptions?: any;
}

const TenderViewComments = ({
	passProps,
	CommemtsOptions,
	viewAssortOptions,
	tenderLotSeq,
	currentAction,
	editMode
}: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// *** Tenderlotplans State *** //
	const { actions: tenderlotplansActions } = useTenderlotplansSlice();
	const tenderlotplansState = useSelector(tenderlotplansSelector);
	const { getOneAssortmentSuccess } = tenderlotplansState;
	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const { reset } = formContext;

	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'sr_no',
				header: 'Sr',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 10,
				maxWidth: 30,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				editable: false
			},
			{
				name: 'final',
				header: 'Final',
				headerAlign: 'center',
				textAlign: 'center',
				sortable: false,
				width: 40,
				renderEditor: (editorProps: any) => {
					return <CheckBoxEditor {...editorProps} />;
				},
				editorProps: {},
				render: ({ value }: any) => {
					return <Checkbox checked={value} style={{ backgroundColor: 'transparent' }} />;
				}
			},
			{
				name: 'emp',
				header: 'Checker',
				minWidth: 50,
				maxWidth: 80,
				sortable: false,
				editable: false,
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
							{data && data.emp && data.emp.name ? data.emp.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'assort_type',
				minWidth: 50,
				maxWidth: 60,
				headerAlign: 'center',
				textAlign: 'center',
				sortable: false,
				editable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Assort
							<br />
							Type
						</div>
					);
				},
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.assort_type && data.assort_type.name
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
				maxWidth: 60,
				sortable: false,
				editable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				},
				render: ({ data }: any) => {
					let yiel = parseFloat(data.yield);
					let result = yiel.toFixed(2);
					if (!isNaN(yiel)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'comments',
				header: 'Comments',
				minWidth: 30,
				maxWidth: 106,
				sortable: false,
				editable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'wgt',
				header: 'Wgt',
				minWidth: 30,
				maxWidth: 50,
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				editable: false,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				}
			},
			{
				name: 'net_rate',
				header: 'Avg',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 70,
				sortable: false,
				editable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					let netRate = parseFloat(data.net_rate);
					let result = netRate.toFixed(0);
					if (!isNaN(netRate)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'net_value',
				header: 'Value',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 70,
				sortable: false,
				editable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					let values = parseFloat(data.net_value);
					let result = values.toFixed(0);
					if (!isNaN(values)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'rough_rate',
				header: 'Rgh Avg',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 80,
				sortable: false,
				editable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				render: ({ data }: any) => {
					let rate = parseFloat(data.rough_rate);
					let result = rate.toFixed(0);
					if (!isNaN(rate)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				},
				editorProps: {
					type: 'number'
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

	const groups = [{ name: 'pol', header: 'Polish' }];

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns] = useState<any>(getColumns());
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [userSeq, setUserSeq] = useState('');
	const [gridRef, setGridRef] = useState<any>(null);
	const [activeCell, setActiveCell] = useState<any>([0, 0]);
	const [finalColumnStatus, setFinalColumnStatus] = useState<{ [key: string]: boolean }>({});

	const handleRowSelect = useCallback(
		(rowData: any) => {
			setSelectedRow(rowData.data);
			setUserSeq(rowData.data?.ins_user.seq_no);
		},
		[selectedRow]
	);

	useEffect(() => {
		return () => {
			dispatch(tenderlotplansActions.reset());
		};
	}, []);

	useEffect(() => {
		if (selectedRow) {
			dispatch(
				tenderlotplansActions.getOneAssortment(
					`'${selectedRow?.tender_lot_det_seq}'/'${selectedRow?.seq_no}'`
				)
			);
		}
	}, [selectedRow]);

	useEffect(() => {
		if (getOneAssortmentSuccess) {
			if (getOneAssortmentSuccess?.results) {
				viewAssortOptions({
					userseq: userSeq, //userSeq
					data: getOneAssortmentSuccess?.results.tender_assort
				});
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
			setDataSource(CommemtsOptions);
		}
	}, [CommemtsOptions]);

	useEffect(() => {
		newRowDataSource = dataSource;
		passProps(newRowDataSource);
	}, [dataSource]);

	const onEditStart = () => {
		inEdit = true;
	};

	const onEditStop = () => {
		requestAnimationFrame(() => {
			inEdit = false;
			gridRef?.current?.focus();
		});
	};

	const onKeyDown = async (event: any) => {
		const edited = await onTableKeyDown(event, inEdit, gridRef);
		if (edited && edited.colName === 'lot_status') {
			dispatch(tenderlotplansActions.reset());
			dispatch(tenderlotplansActions.getLotStatus('LOT_STATUS'));
		}
		if (!edited) {
			const grid = gridRef?.current;
			const [rowIndex, colIndex] = grid.computedActiveCell;
			const rowCount = grid.count;
			if (event.key === 'Tab') {
				event.preventDefault();
			}
			if (event.key === 'Enter1' && rowIndex === rowCount - 1) {
				let isLastEditableColumn = false;
				if (event.key === 'Enter1') {
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
				const dataArray = stateArr.map((elem: any, index: any) => {
					return Object.assign({}, elem, {
						final:
							stateArr[rowIndex].final === true && index === rowIndex ? true : false,
						action: 'update'
					});
				});
				debugger;
				setDataSource(dataArray);
			}
		},
		[dataSource]
	);

	return (
		<MainCard content={false} tabIndex={-1}>
			<FormContainer>
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
									editable={true}
									columns={columns}
									dataSource={dataSource}
									rowHeight={21}
									headerHeight={22}
									onRowClick={(e: any) => handleRowSelect(e)}
									showColumnMenuTool={false}
									showZebraRows={false}
									groups={groups.map(group => ({
										name: group.name,
										header: (
											<span
												key={group.name}
												style={{
													display: 'flex',
													justifyContent: 'center'
												}}>
												{group.header}
											</span>
										)
									}))}
								/>
							</MainCard>
						</Stack>
					</Grid>
				</Grid>
				<button type="submit" hidden />
			</FormContainer>
		</MainCard>
	);
};

export default TenderViewComments;
