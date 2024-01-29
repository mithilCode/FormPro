import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	Stack
} from '@mui/material';

import { useConfirm } from 'material-ui-confirm';

import { useSnackBarSlice } from '@app/store/slice/snackbar';
import MainCard from '@components/MainCard';
import { TextFieldEditor } from '@components/table/editors';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { onColumnEditComplete, onTableKeyDown } from '@utils/helpers';

const gridStyle = { minHeight: 200 };
let inEdit: boolean;
let initialFocus = false;

// ==============================|| SYNONYM LIST||============================== //

export interface Props {
	rowObj?: any;
	passProps?: any;
	objKey: string;
	dialogTitle: string;
	onCancel: () => void;
}

const getColumns = () => {
	return [
		{ name: 'id', header: 'Id', defaultVisible: false, minWidth: 100 },
		{
			name: 'Name',
			header: 'Name',
			defaultFlex: 1,
			renderEditor: (editorProps: any) => {
				return <TextFieldEditor {...editorProps} inEdit={true} />;
			},
			editorProps: {
				/* empty */
			}
		}
	];
};

const SynonymList = ({ rowObj, objKey, passProps, dialogTitle, onCancel }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions } = useSnackBarSlice();

	// add your States  👿
	const [dataSource, setDataSource] = useState<any>([]);
	const [columns] = useState<any>(getColumns()); // , setColumns
	const [activeCell, setActiveCell] = useState<any>([0, 0]);

	const [gridRef, setGridRef] = useState<any>(null);
	// Confirmation Dialog box
	const confirm = useConfirm();

	useEffect(() => {
		const tableData = [];

		if (rowObj) {
			const synonymList = rowObj[objKey];

			if (synonymList) {
				const myArray = synonymList.split('|');
				for (let index = 0; index < myArray.length; index++) {
					const element = myArray[index];
					tableData.push({ id: index, Name: element });
				}
			}
		}

		setDataSource(tableData);

		return () => {
			/* empty */
		};
	}, []);

	useEffect(() => {
		if (gridRef && !initialFocus) {
			requestAnimationFrame(() => {
				initialFocus = true;
				gridRef.current.focus();
			});
		}
	}, [gridRef]);

	const onSubmit = () => {
		dispatch(
			actions.openSnackbar({
				open: true,
				message: 'Synonym update successfully.',
				variant: 'alert',
				alert: {
					color: 'success'
				},
				close: false
			})
		);

		let str = '';
		for (let index = 0; index < dataSource.length; index++) {
			const element = dataSource[index];
			if (element.Name) {
				str = str + element.Name + '|';
			}
		}
		str = str.slice(0, -1);

		passProps({ rowObj, str });

		setTimeout(() => {
			onCancel();
		}, 200);
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
		const grid = gridRef.current;
		const [colIndex] = grid.computedActiveCell; // rowIndex

		if (!edited) {
			const grid = gridRef.current;
			const [rowIndex] = grid.computedActiveCell;
			const rowCount = grid.count;
			const columns = grid.visibleColumns;

			if (event.key === 'Delete') {
				const data = [...dataSource];

				confirm({
					confirmationButtonProps: { autoFocus: true },
					description: 'Do you want to delete?'
				})
					.then(() => {
						data.splice(rowIndex, 1);
						setDataSource(data);
					})
					.catch(() => {
						/* */
					});
			}

			if (event.key === 'Insert' || (event.key === 'Enter' && rowIndex === rowCount - 1)) {
			}

			if (
				event.key === 'Insert' ||
				(colIndex === columns.length - 1 &&
					rowIndex === rowCount - 1 &&
					event.key === 'ArrowDown')
			) {
				const obj = { ...dataSource[0] };
				const newObj = Object.keys(obj).reduce((accumulator, key) => {
					return { ...accumulator, [key]: null };
				}, {}) as any;

				newObj.action = 'insert';
				newObj.id = 7777 + rowIndex;

				setDataSource([...dataSource, newObj]);

				const data = [...dataSource, newObj];

				setActiveCell([data.length - 1, 0]);

				setTimeout(() => {
					const column = grid.getColumnBy(0);
					grid.startEdit({ columnId: column.name, rowIndex: data.length - 1 });
				}, 0);
			}
		}
	};

	const onEditComplete = useCallback(
		async ({ value, columnId, rowIndex }: any) => {
			if (value || value === '' || typeof value === 'boolean') {
				const data = await onColumnEditComplete(columns, dataSource, {
					value,
					columnId,
					rowIndex
				});

				setDataSource(data);
			}
		},
		[dataSource]
	);

	return (
		<>
			<MainCard content={false}>
				<DialogTitle>{dialogTitle ? dialogTitle : ''}</DialogTitle>
				<Divider />
				<DialogContent sx={{ p: 2.5 }}>
					<MainCard content={false} tabIndex="0">
						<ReactDataGrid
							handle={setGridRef}
							idProperty="id"
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
						/>
					</MainCard>
				</DialogContent>
				<Divider />
				<DialogActions sx={{ p: 2.5 }}>
					<Grid container justifyContent="space-between" alignItems="center">
						<Grid item>
							<Stack direction="row" spacing={1} alignItems="center">
								<Button
									type="submit"
									variant="contained"
									onClick={onSubmit}
									style={{ height: '30px' }}>
									{rowObj ? 'Save' : 'Add'}
								</Button>
								<Button
									style={{ border: '1px solid #8c8c8c', height: '30px' }}
									color="error"
									onClick={onCancel}>
									{/* Cancel */}
									Close
								</Button>
							</Stack>
						</Grid>
					</Grid>
				</DialogActions>
			</MainCard>
		</>
	);
};

export default SynonymList;
