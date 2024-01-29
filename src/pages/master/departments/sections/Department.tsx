/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress, Grid, IconButton, Checkbox, Stack } from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { InfiniteDrawer } from '@components/drawer';
import MainCard from '@components/MainCard';
import { CheckBoxEditor, DatePickerEditor, TextFieldEditor } from '@components/table/editors';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { FormSchema, IFormInput } from '@pages/master/departments/models/Department';
import { useDepartmentSlice } from '@pages/master/departments/store/slice';
import { departmentSelector } from '@pages/master/departments/store/slice/department.selectors';
import {
	InitialQueryParam,
	InitialState,
	ObjecttoQueryString,
	onTableKeyDown,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';

import departmentProcess from './DepartmentProcess';
import '@inovua/reactdatagrid-community/index.css';
import { Typography } from '@mui/material';

const gridStyle = { minHeight: 400 };

let inEdit: boolean;
let initialFocus = false;
let newRowDataSource: any;

// ==============================|| PROPS ||============================== //

interface Props {
	passProps?: any;
	handleDrawerToggle?: any;
	edit?: boolean;
	selectedData?: any;
}

const initParams = {
	page: 1,
	limit: 100000,
	pagination: 'false'
} as InitialQueryParam;

const Department = ({ edit, selectedData }: Props) => {
	const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false);
	const [selectData, setSelectData] = useState<any>('');

	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const { actions: departmentActions } = useDepartmentSlice();
	const { actions } = useSnackBarSlice();

	// *** Departments State *** //
	const departmentState = useSelector(departmentSelector);
	const { addError, addSuccess, getSuccess } = departmentState;

	// add your Locale  👿
	const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		formState: { isSubmitting },
		reset
	} = formContext;

	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },

			{
				name: 'name_code',
				// header: 'Dept Code',
				width: 70,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Dept
							<br />
							Code
						</div>
					);
				},
				editorProps: {
					type: 'text',
					placeholder: 'Dept Code'
				}
			},
			{
				name: 'name',
				header: 'Dept Name',
				width: 150,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Dept Name'
				}
			},
			{
				name: 'short_name',
				header: 'Short Name',
				width: 130,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Short Name'
				}
			},

			{
				name: 'is_active',
				header: 'Active',
				// editable: false,
				width: 100,
				skipNavigation: true,
				textAlign: 'center',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <CheckBoxEditor {...editorProps} />;
				},
				editorProps: {},
				render: ({ value }: any) => {
					return <Checkbox checked={value} />;
				}
			},
			{
				name: 'leave_date',
				header: 'Close Date',

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
							{data && data.leave_date && data.leave_date
								? dayjs(data.leave_date).format('DD-MM-YYYY')
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
					placeholder: 'Comments'
				}
			},
			{
				name: 'action',
				header: 'Action',
				defaultFlex: 1,
				editable: false,
				headerAlign: 'center',
				textAlign: 'center',
				sortable: false,
				render: ({ data }: any) => {
					return (
						<span className="flex items-center">
							<IconButton
								onClick={ev => {
									ev.stopPropagation();
									onEditClick(data);
								}}>
								<EditOutlined />
							</IconButton>
						</span>
					);
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
	const [columns] = useState<any>(getColumns());
	const [activeCell, setActiveCell] = useState<any>([0, 0]);

	useEffect(() => {
		let queryStirng = ObjecttoQueryString(initParams);
		queryStirng = queryStirng + `&q=type='D'`;
		dispatch(departmentActions.get({ QueryParams: queryStirng }));
		return () => {
			dispatch(departmentActions.reset());
		};
	}, []);

	useEffect(() => {
		newRowDataSource = dataSource;
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

	useEffect(() => {
		if (addSuccess) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Save Successfully.',
					variant: 'alert',
					alert: {
						color: 'success'
					},
					close: false,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					}
				})
			);
			reset();
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});
			let queryStirng = ObjecttoQueryString(initParams);
			queryStirng = queryStirng + `&q=type='D'`;

			dispatch(departmentActions.get({ QueryParams: queryStirng }));
		}
	}, [addSuccess]);

	useEffect(() => {
		if (addError) {
			const message = addError && addError.error ? addError.error.errors[0] : '';

			dispatch(
				actions.openSnackbar({
					open: true,
					message: message,
					variant: 'alert',
					alert: {
						color: 'error'
					},
					close: false,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					}
				})
			);
		}
	}, [addError]);

	useEffect(() => {
		if (getSuccess) {
			if (getSuccess?.columnType !== null) {
				if (getSuccess?.results && getSuccess?.results.length > 0) {
					setDataSource(getSuccess?.results);
				} else {
					setDataSource([]);
				}
			}
		}
	}, [getSuccess]);

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

	const getData = async (obj: any) => {
		// const queryParams = { ...initParams, ...obj };
		const queryParams = obj;
		const queryStirng = ObjecttoQueryString(queryParams);

		dispatch(departmentActions.get({ QueryParams: queryStirng }));
	};

	const childProps = (obj: { type: string; data: object }) => {
		console.log('obj', obj);

		getData(initParams);
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
					description: 'Are you sure delete department ?',
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
					let LastEditCol = 7777777;

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

	const handleDrawerToggle = () => {
		setOpenAddDrawer(!openAddDrawer);
		setSelectData(null);
	};

	const onEditClick = (rowObj: any) => {
		setSelectData(rowObj);
		setOpenAddDrawer(true);

		dispatch(departmentActions.reset());
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

				setDataSource(data);
			}
		},
		[dataSource]
	);
	const onSubmit = async () => {
		/* empty */
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		if (Object.keys(pageState.values).length === 0) {
			return;
		} else {
			let errorMessage = null;
			for (let i in pageState.values.para) {
				if (pageState.values.para[i].action != 'delete') {
					if (
						pageState.values.para[i].name == null ||
						pageState.values.para[i].name == ''
					) {
						errorMessage = 'Name must be required.';
					}
				}
			}

			if (errorMessage == null) {
				dispatch(departmentActions.add(pageState.values));
				dispatch(departmentActions.reset());
			} else {
				dispatch(
					actions.openSnackbar({
						open: true,
						message: errorMessage,
						variant: 'alert',
						alert: {
							color: 'error'
						},
						close: false,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						}
					})
				);
			}
		}
	};

	const handleCancel = async (event: any) => {
		if (Object.keys(pageState.values).length !== 0 && pageState.values.para.length > 0) {
			confirm({
				description: 'Do you want to discard changes ?',
				confirmationButtonProps: { autoFocus: true },
				confirmationText: 'Yes',
				cancellationText: 'No'
			})
				.then(() => {
					window.location.reload();
				})

				.catch(() => {
					/* */
				});
		}
	};

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
										editable={true}
										columns={columns}
										dataSource={dataSource}
										showColumnMenuTool={false}
										rowHeight={21}
										headerHeight={22}
									/>
								</MainCard>
							</Stack>
						</Grid>
					</Grid>
					<button type="submit" hidden />
				</FormContainer>
				<Grid container sx={{ mt: 1.5, mb: 1.5 }}>
					<Grid item xs={12}>
						<Stack
							sx={{ mr: 1.5 }}
							direction="row"
							spacing={2}
							justifyContent="right"
							alignItems="center">
							<Button
								ref={buttonRef}
								onClick={e => handleSubmit(e)}
								onKeyDown={e => (e.key === 'Enter' ? handleSubmit(e) : '')}
								disableElevation
								disabled={isSubmitting}
								type="submit"
								variant="contained"
								color="primary">
								{isSubmitting ? (
									<CircularProgress size={24} color="success" />
								) : (
									formatMessage({ id: 'Save' })
								)}
							</Button>
							<Button
								variant="outlined"
								color="secondary"
								onClick={e => handleCancel(e)}>
								{formatMessage({ id: 'Cancel' })}
							</Button>
						</Stack>
					</Grid>
				</Grid>
				{openAddDrawer && (
					<InfiniteDrawer
						title={
							selectedData && selectedData.Name
								? selectedData.Name
								: 'DepartmentProcess'
						}
						width={80}
						component={departmentProcess}
						handleDrawerToggle={handleDrawerToggle}
						edit={selectedData ? true : false}
						passProps={childProps}
						selectedData={selectData}
					/>
				)}
			</MainCard>
		</>
	);
};

export default Department;
