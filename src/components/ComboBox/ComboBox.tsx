import { memo, useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { Button, Divider, DialogActions, DialogContent, DialogContentText } from '@mui/material';

import DebouncedInput from './DebouncedInput';
import CustomTable from './CustomTable';

export interface CustomComboBoxProps {
	isOpen: boolean;
	title: string;
	subtitle?: string;
	handleClose: any;
	width?: number;
	minHeight?: number;
	maxHeight?: number;
	placeholder?: string;
	inputValue?: string;
	tableData: any[];
	tableColumns: any[];
	tableTitle?: string;
	onTableRowSelect: (obj: any) => void;
	onTableEscapeClick?: () => void;
	onChange: (value: string) => void;
	selectedColumn: any;
	position: any;
}

export const CustomComboBox: React.FC<CustomComboBoxProps> = ({
	isOpen = false,
	subtitle,
	handleClose,
	width = 30,
	minHeight = 265,
	maxHeight = 265,
	placeholder = 'search',
	inputValue = '',
	tableData,
	tableColumns,
	tableTitle = 'Table Title',
	onTableRowSelect,
	onTableEscapeClick,
	onChange,
	selectedColumn,
	position
}) => {
	const [fillInputBox, setFillInputBox] = useState<any>('');

	const handleFillInputBox = async (obj: any) => {
		setFillInputBox(obj);
	};

	const inputBox = useMemo(() => {
		return (
			<DebouncedInput
				value={inputValue ?? ''}
				onChange={(value: any) => onChange(value)}
				placeholder={placeholder}
				selectedColumn={selectedColumn}
				fillInputBox={fillInputBox}
			/>
		);
	}, [fillInputBox]);

	const dataTable = useMemo(() => {
		return (
			<CustomTable
				data={tableData}
				columns={tableColumns}
				title={tableTitle}
				onRowSelect={onTableRowSelect}
				onEscapeClick={onTableEscapeClick}
				selectedColumn={selectedColumn}
				onFillInputBox={handleFillInputBox}
			/>
		);
	}, [tableData, tableColumns]);

	const handleKeyDown = (event: any) => {
		switch (event.key) {
			case 'Backspace':
				setFillInputBox({ selectedColumn: {}, input: 'Backspace' });
				break;
			default:
				const isAlphanumeric = /^[a-zA-Z0-9]$/;
				if (isAlphanumeric.test(event.key)) {
					setFillInputBox({ selectedColumn: {}, input: event.key });
				}
				break;
		}
	};

	return (
		<Dialog
			id="lina"
			PaperProps={{
				sx: {
					top: position?.top + 20, // Use top from props
					left: position?.left, // Use left from props
					width: `${width}%`,
					maxHeight: { maxHeight },
					minHeight: { minHeight },
					position: 'absolute',
					margin: '0px'
				}
			}}
			fullWidth
			maxWidth={'lg'}
			open={isOpen}
			onClose={handleClose}
			tabIndex={1}
			onKeyDown={e => handleKeyDown(e)}>
			<DialogContent style={{ padding: '2px', overflow: 'hidden' }}>
				<DialogContentText>{subtitle}</DialogContentText>
				{inputBox}
				<Divider />
				{dataTable}
				<Divider />
			</DialogContent>
			<DialogActions style={{ borderTop: '1px solid #ccc', padding: '1px' }}>
				<Button
					onClick={handleClose}
					color="primary"
					style={{ height: '20px', margin: '2px' }}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default memo(CustomComboBox);
