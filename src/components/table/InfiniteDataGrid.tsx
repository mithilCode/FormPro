import { useEffect, useCallback, useState, lazy } from 'react';

import MainCard from '@components/MainCard';
import ScrollX from '@components/ScrollX';
import { CustomComboBox } from '../ComboBox';
import { useConfirm } from 'material-ui-confirm';
// import ReactDataGrid from '@inovua/reactdatagrid-community';
const ReactDataGrid = lazy(() => import('@inovua/reactdatagrid-community'));
const ReactDataGridEnterprise = lazy(() => import('@inovua/reactdatagrid-enterprise'));
import { createColumnHelper } from '@tanstack/react-table';
import { TypeDataGridProps } from '@inovua/reactdatagrid-community/types';

import { onOpenDropDown, onTableKeyDown, delay } from '@utils/helpers';

// import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-enterprise/index.css';

const gridStyle = { minHeight: 600 };
let inEdit: boolean;
// let refDataSource: any;

const columnHelper = createColumnHelper<any>();

const defaultDialogColumns = [
	columnHelper.accessor('name', {
		cell: (info: any) => info.getValue(),
		header: () => <span>Name (Default)</span>
	})
];

export enum licenceType {
	'community',
	'enterprise'
}

interface HasConstructor {
	onTableDataChange: any;
	defaultFilterValue?: any;
	initParams?: any;
	onRowClick?: any;
	gridActiveCell?: any;
	dropDownDataSource?: any;
	tableName?: string;
	idProperty?: string;
	dialogColumns?: any;
	licence?: licenceType;
	focus?: boolean;
	dropDownWidth?: number;
	dropDownHeight?: number;
	addAllowed?: boolean;
	updateAllowed?: boolean;
	deleteAllowed?: boolean;
	// footerRows?: any;
	// summaryReducer?: any;
}

export default function InfiniteDataGrid({
	columns = [],
	dataSource = [],
	onTableDataChange,
	defaultFilterValue,
	initParams,
	onRowClick,
	gridActiveCell,
	dropDownDataSource,
	tableName = 'primary',
	idProperty = 'seq_no',
	dialogColumns = defaultDialogColumns,
	licence = licenceType.community,
	focus = false,
	dropDownHeight = 265,
	dropDownWidth = 30,
	addAllowed = true,
	updateAllowed = true,
	deleteAllowed = true,
	// footerRows = [],
	// summaryReducer = {},
	// skip = 0,
	// filterValue,
	...rest
}: Partial<TypeDataGridProps> & HasConstructor): JSX.Element {
	const confirm = useConfirm();

	const [sortInfo, setSortInfo] = useState([]);
	const [limit, setLimit] = useState(initParams.limit ? initParams.limit : 10);
	const [skip, setSkip] = useState(0);
	const [filterValue, setFilterValue] = useState(defaultFilterValue);
	const [preventDuplicate, setPreventDuplicate] = useState(null);
	const [activeCell, setActiveCell] = useState<any>([0, 0]);
	const [gridRef, setGridRef] = useState<any>(null);

	// const [topPosition, setTopPosition] = useState<any>(null);
	const [rowPosition, setRowPosition] = useState<any>({ row: 0, column: 0 });

	const [selectInputValue, setSelectInputValue] = useState<any>(null);
	const [selectedData, setSelectedData] = useState(null);

	const [dialogOpen, setDialogOpen] = useState(false);
	// const [dropDownData, setDropDownData] = useState([]);
	const [dialogPosition, setDialogPosition] = useState<any>({ top: 0, left: 0 });

	// const [initial, setInitial] = useState(false);

	// const [focused, setFocused] = useState(false);

	// useEffect(() => {
	// 	refDataSource = dataSource;
	// 	// const ds = dataSource as any;
	// 	// if (initial && ds.length === 0) {
	// 	// 	onTableDataChange({
	// 	// 		table: tableName,
	// 	// 		type: 'insert-row',
	// 	// 		isLastEditableColumn: 0,
	// 	// 		rowIndex: 0,
	// 	// 		eventKey: 'Focus',
	// 	// 		extra: {}
	// 	// 	});
	// 	// }
	// 	// console.log('HELLLLLLOO', dataSource, ds.length);
	// }, [dataSource]);

	useEffect(() => {
		if (focus && gridRef) {
			gridRef.current.focus();
		}
	}, [gridRef]);

	// useEffect(() => {
	// 	console.log('USE EFFECTCTTCTCT', initParams);

	// 	// setLimit(initParams.limit);
	// 	// setSkip(initParams.skip);

	// 	// setSortInfo(sortInfo);
	// }, []);

	// console.log('INFINITE-DATAGRID', 'COLUMNS', columns);

	useEffect(() => {
		if (addAllowed) {
			const cpDataSource = dataSource as any;
			if (cpDataSource && cpDataSource.length === 0) {
				onTableDataChange({
					table: tableName,
					type: 'insert-row',
					isLastEditableColumn: true,
					rowIndex: 0,
					eventKey: 'Focus',
					extra: {}
				});
			}
		}
	}, [dataSource]);

	useEffect(() => {
		if (selectedData) {
			handleDialogOpen();
		}
	}, [selectedData]);

	useEffect(() => {
		if (!dialogOpen) {
			setSelectedData(null);
			// setDropDownData([]);
		}
	}, [dialogOpen]);

	useEffect(() => {
		// console.log('INFINITE-DATAGRID', 'gridActiveCell', gridActiveCell);

		if (!gridActiveCell) return;

		const { type, subType } = gridActiveCell;

		switch (type) {
			case 'insert-row':
				const { row, col } = gridActiveCell;
				const grid = gridRef.current;
				setTimeout(() => {
					const column = grid.getColumnBy(0);
					grid.setActiveCell([row, col]);
					grid.startEdit({
						columnId: column.name,
						rowIndex: row
					});
				}, 10);
				break;
			case 'dialog-data-change':
				if (subType === 'handle-row-selected') {
					const grid = gridRef.current;
					let { rowIndex, colIndex } = gridActiveCell;
					const columns1 = grid.visibleColumns;
					const rowCount = grid.count;
					// const column = grid.getColumnBy(colIndex);

					colIndex += 1;
					if (colIndex === -1) {
						colIndex = columns1.length - 1;
						rowIndex -= 1;
					}
					if (colIndex === columns1.length) {
						rowIndex += 1;
						colIndex = 0;
					}
					if (rowIndex < 0 || rowIndex === rowCount) {
						return;
					}

					grid.setActiveCell([rowIndex, colIndex]);
					setTimeout(() => {
						const column = grid.getColumnBy(colIndex);
						grid.startEdit({
							columnId: column.name,
							rowIndex: rowIndex
						});
					}, 0);
					// grid.startEdit({
					// 	columnId: column.name,
					// 	rowIndex
					// });
				}
				break;

			default:
				break;
		}
	}, [gridActiveCell]);

	const onSortInfoChange = useCallback((sortInfo: any) => {
		// console.log('INFINITE-DATAGRID', 'sortInfo', sortInfo);

		onTableDataChange({ sortInfo });
		setSortInfo(sortInfo);

		// setSortInfo(sortInfo);
	}, []);

	const onLimitChange = useCallback((limit: number) => {
		// console.log('INFINITE-DATAGRID', 'LimitInfo', limit);

		onTableDataChange({ limit });
		setLimit(limit);
	}, []);

	const onSkipChange = useCallback((skip: number) => {
		// console.log('INFINITE-DATAGRID', 'SkipInfo', skip);
		onTableDataChange({ page: skip });
		setSkip(skip);
	}, []);

	const onFilterValueChange = (value: any) => {
		// console.log('INFINITE-DATAGRID', 'filterValue', value, preventDuplicate);
		if (JSON.stringify(value) !== JSON.stringify(preventDuplicate)) {
			onTableDataChange({ filterBy: value });
			setFilterValue(value);
		}
		setPreventDuplicate(value);
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
		// console.log('INFINITE-DATAGRID', 'ON key down', event);
		const grid = gridRef.current;
		let [rowIndex, colIndex] = grid.computedActiveCell;
		const column = grid.getColumnBy(colIndex);

		// setTopPosition(event.position);
		if (event.position) {
			const { left, top, bottom } = event.position;
			let newLeft = left;
			let newTop = top;
			var w = window.innerWidth - 100;
			var h = window.innerHeight;

			if (dropDownWidth + left >= w) {
				newLeft = left - dropDownWidth;
			}
			if (dropDownHeight + top > h) {
				newTop = top - dropDownHeight;
			}
			setDialogPosition({ left: newLeft, top: newTop });
		}
		setRowPosition({ row: rowIndex, column: column.name });

		const check_column = await onOpenDropDown(event, gridRef);

		if (
			check_column &&
			check_column &&
			check_column.column.openInDialog &&
			check_column.column.openInDialogDefault
		) {
			const inputValue =
				dataSource[rowIndex as keyof typeof dataSource][check_column.column.name]['name'];
			setSelectInputValue(inputValue);
			setSelectedData(check_column);
		} else {
			const edited = await onTableKeyDown(event, inEdit, gridRef);

			if (edited && edited.column && edited.column.openInDialog) {
				if (event.key !== 'Delete') {
					// console.log('INFINITE-DATAGRID', 'ON key down', 'POPUO KHIL BHAI');
					setSelectInputValue(edited.input);
					setSelectedData(edited);
				}
			} else {
				if (!edited) {
					const grid = gridRef.current;
					const [rowIndex, colIndex] = grid.computedActiveCell;
					const rowCount = grid.count;

					if (event.key === 'Tab') {
						event.preventDefault();
					}

					if (event.key === 'Delete' && deleteAllowed) {
						const data = [...[dataSource]];

						confirm({
							description: 'Are you sure delete shape ?',
							confirmationButtonProps: { autoFocus: true },
							confirmationText: 'Yes',
							cancellationText: 'No'
						})
							.then(() => {
								onTableDataChange({
									table: tableName,
									type: 'delete-row',
									data: data[0],
									rowIndex
								});
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
						if (!addAllowed) return;
						if (event.key === 'ArrowDown') {
							/* discussion to dharmeshbhai for arrow down*/
							event.key = 'Insert';
						}
						let isLastEditableColumn = false;
						if (event.key === 'Enter') {
							let LastEditCol = Math.floor(Math.random() * 100 + 10000);

							for (let index = columns.length - 1; index >= 0; index--) {
								const column = grid.getColumnBy(index);

								if (column) {
									if (
										column.editable === false ||
										column.skipNavigation === true
									) {
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

						onTableDataChange({
							table: tableName,
							type: 'insert-row',
							isLastEditableColumn,
							rowIndex,
							eventKey: event.key,
							extra: { is_active: true }
						});

						// const { insertNew, data, stateArr } = await insertNewRow(
						// 	pageState, // State for track row insert, update or delete
						// 	FormSchema, // for validation
						// 	newRowDataSource, // table data
						// 	rowIndex, // row number
						// 	isLastEditableColumn,
						// 	event.key,
						// 	{ is_active: true }
						// );

						event.preventDefault();

						// if (insertNew) {
						// 	// *** set table with new data
						// 	setDataSource(data);

						// 	// *** set state for api
						// 	setPageState(value => ({
						// 		...value,
						// 		values: {
						// 			...pageState.values,
						// 			para: stateArr
						// 		}
						// 	}));

						// 	// *** Focus on first cell of new added row
						// 	setActiveCell([data.length - 1, 0]);
						// 	setTimeout(() => {
						// 		const column = grid.getColumnBy(0);
						// 		grid.startEdit({
						// 			columnId: column.name,
						// 			rowIndex: data.length - 1
						// 		});
						// 	}, 0);
						// }
					}
				}
			}
		}
	};

	const onEditComplete = useCallback(
		async ({ value, columnId, rowIndex }: any) => {
			// console.log('INFINITE-DATAGRID', 'onEditComplete', value, columnId, rowIndex);
			const grid = gridRef.current;
			const [, colIndex] = grid.computedActiveCell;
			const column = grid.getColumnBy(colIndex);

			if (column.openInDialog) {
				if (typeof value === 'string') {
					value = { seq_no: null, name: '' };
				}
			} else {
				if (typeof value === 'string') {
					value = value.trim();
				}
			}

			onTableDataChange({
				table: tableName,
				type: 'on-edit-complete',
				value,
				columnId,
				rowIndex
			});

			// if (typeof value === 'string') {
			// 	value = value.trim();
			// }
		},
		[dataSource, gridRef]
	);

	const handleDialogOpen = (event?: any) => {
		// const top = topPosition?.top - 235;
		// const left = topPosition?.left - 503;
		// setPosition({ top, left });
		setDialogOpen(true);
	};

	const handleDialogClose = useCallback(() => {
		// console.log('handlecloase called');
		setDialogOpen(false);
	}, []);

	const handleDialogChange = useCallback((obj: any, event?: any) => {
		// console.log('INFINITE-DATAGRID', 'handleDialogChange', obj, event);
		onTableDataChange({
			table: tableName,
			type: 'dialog-data-change',
			subType: 'handle-change',
			dialogObj: obj
		});
	}, []);

	const handleTableEscapeClick = () => {
		setDialogOpen(false);
		const grid = gridRef.current;
		grid.startEdit({
			columnId: rowPosition.column,
			rowIndex: rowPosition.row
		});
		// onEditComplete({ value: '', columnId: rowPosition.column, rowIndex: rowPosition.row });
	};

	const handleTableRowSelected = async (obj: any) => {
		setDialogOpen(false);
		// console.log('INFINITE-DATAGRID', 'handleTableRowSelected', obj);

		const grid = gridRef.current;
		let [rowIndex, colIndex] = grid.computedActiveCell;

		onTableDataChange({
			table: tableName,
			type: 'dialog-data-change',
			subType: 'handle-row-selected',
			rowSelectedObj: obj,
			rowIndex,
			colIndex
		});
	};

	// const OnHandleGridFocus = useCallback((event: any) => {
	// 	// Add logic to insert a blank row into the data source
	// 	let ddd: any = refDataSource;
	// 	console.log('HELLLLLLOO', ddd.length, event);
	// 	let isValidForNewRow = ddd.length === 0 ? true : false;
	// 	//let isValidForNewRow = false;
	// 	if (isValidForNewRow) {
	// 		onTableDataChange({
	// 			table: tableName,
	// 			type: 'insert-row',
	// 			isLastEditableColumn: 0,
	// 			rowIndex: 0,
	// 			eventKey: 'Focus',
	// 			extra: { is_active: true }
	// 		});
	// 	}
	// }, []);

	// const OnHandleGridFocus = async () => {

	// };

	return (
		<>
			<MainCard content={false}>
				<ScrollX>
					{licence === licenceType.community ? (
						<ReactDataGrid
							{...rest}
							handle={setGridRef}
							//style={gridStyle}
							idProperty="seq_no"
							columns={columns}
							dataSource={dataSource}
							activeCell={activeCell}
							onActiveCellChange={setActiveCell}
							sortInfo={sortInfo}
							onSortInfoChange={onSortInfoChange}
							pagination={false}
							limit={limit}
							onLimitChange={onLimitChange}
							skip={skip}
							onSkipChange={onSkipChange}
							filterValue={filterValue}
							onFilterValueChange={onFilterValueChange}
							onRowClick={onRowClick}
							onKeyDown={onKeyDown}
							onEditComplete={onEditComplete}
							onEditStart={onEditStart}
							onEditStop={onEditStop}
							// onFocus={OnHandleGridFocus}
							editable={updateAllowed}
							//enableColumnFilterContextMenu={false}
						/>
					) : (
						<ReactDataGridEnterprise
							{...rest}
							handle={setGridRef}
							//style={gridStyle}
							idProperty="seq_no"
							columns={columns}
							dataSource={dataSource}
							activeCell={activeCell}
							onActiveCellChange={setActiveCell}
							sortInfo={sortInfo}
							onSortInfoChange={onSortInfoChange}
							pagination={false}
							limit={limit}
							onLimitChange={onLimitChange}
							skip={skip}
							onSkipChange={onSkipChange}
							filterValue={filterValue}
							onFilterValueChange={onFilterValueChange}
							onRowClick={onRowClick}
							onKeyDown={onKeyDown}
							onEditComplete={onEditComplete}
							onEditStart={onEditStart}
							onEditStop={onEditStop}
							editable={true}
							// footerRows={footerRows}
							// summaryReducer={summaryReducer}

							//enableColumnFilterContextMenu={false}
						/>
					)}
				</ScrollX>
			</MainCard>

			{/* add customer dialog */}
			{dialogOpen && (
				<CustomComboBox
					isOpen={dialogOpen}
					title="Dharmesh"
					handleClose={handleDialogClose}
					onChange={handleDialogChange}
					tableData={dropDownDataSource}
					tableColumns={dialogColumns}
					onTableRowSelect={handleTableRowSelected}
					onTableEscapeClick={handleTableEscapeClick}
					selectedColumn={selectedData}
					inputValue={selectInputValue}
					position={dialogPosition}
					width={dropDownWidth}
					maxHeight={dropDownHeight}
				/>
			)}
		</>
	);
}

//
