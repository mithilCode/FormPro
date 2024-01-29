import React, { useMemo, memo, useRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import './comboBox.css';

export interface CustomTableProps {
	data: any[];
	columns: any[];
	title?: string;
	searchable?: boolean;
	isFetching?: boolean;
	skeletonCount?: number;
	skeletonHeight?: number;
	onRowSelect: (obj: any) => void;
	onEscapeClick?: () => void;
	headerComponent?: JSX.Element;
	isLoading?: boolean;
	selectedColumn?: any;
	onFillInputBox: (obj: any) => void;
}

const CustomTable: React.FC<CustomTableProps> = ({
	data: tableData,
	columns: tableColumns,
	skeletonCount = 10,
	onRowSelect,
	onEscapeClick,
	headerComponent,
	selectedColumn,
	onFillInputBox
}) => {
	const data = useMemo(() => tableData, [tableData]);
	const columns = useMemo(() => tableColumns, [tableColumns]);

	const handleKeyDown = (event: any, row: any) => {
		const { target } = event;
		if (!(event.target instanceof Element)) return;
		if (!(target instanceof Element)) return;
		event.stopPropagation();

		const currentRow = event.target.closest('[role="row"],tr') as any;

		switch (event.key) {
			case 'ArrowUp':
				currentRow?.previousElementSibling?.focus();
				break;
			case 'ArrowDown':
				currentRow?.nextElementSibling?.focus();
				break;
			case 'Enter':
				handleRowSelect(row);
				break;
			case 'Escape':
				onEscapeClick?.();
				break;
			case 'Backspace':
				onFillInputBox({ selectedColumn, input: 'Backspace' });
				break;
			default:
				const isAlphanumeric = /^[a-zA-Z0-9]$/;
				if (isAlphanumeric.test(event.key)) {
					onFillInputBox({ selectedColumn, input: event.key });
				}
				break;
		}
		event.preventDefault();
	};

	const handleRowSelect = (obj: any) => {
		onRowSelect({ selectedColumn, originData: obj.original });
	};

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel()
	});

	const tableRef = useRef<any>(null);

	useEffect(() => {
		if (tableRef.current) {
			const firstRow = tableRef.current.querySelector('[tabIndex="0"]');
			if (firstRow) {
				firstRow.focus();
			}
		}
	}, [data]);

	return (
		<Box sx={{ width: '100%' }}>
			<TableContainer component={Paper}>
				<Table
					ref={tableRef}
					className="table-scroll"
					sx={{
						'& .MuiTableRow-root:focus': {
							backgroundColor: 'primary.light'
						}
					}}
					aria-label="simple table">
					<TableHead>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header, idx) => {
									return (
										<TableCell
											key={header.id}
											colSpan={header.colSpan}
											style={{ lineHeight: '0px' }}>
											{header.isPlaceholder ? null : (
												<div>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
												</div>
											)}
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableHead>

					<TableBody>
						{table.getRowModel().rows.map(row => {
							return (
								<TableRow
									key={row.id}
									id={row.id}
									tabIndex={0}
									onKeyDown={e => handleKeyDown(e, row)}>
									{row.getVisibleCells().map(cell => {
										return (
											<TableCell
												key={cell.id}
												style={{ lineHeight: '0px' }}
												onClick={() => handleRowSelect(row)}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default memo(CustomTable);
