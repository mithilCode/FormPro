/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { AutocompleteElement, FormContainer } from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import MainCard from '@components/MainCard';
import { DDTextFieldEditor, TextFieldEditor } from '@components/table/editors';
import { zodResolver } from '@hookform/resolvers/zod';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useRangeSlice } from '@pages/master/ranges/store/slice';
import { rangeSelector } from '@pages/master/ranges/store/slice/ranges.selectors';
import {
	InitialQueryParam,
	InitialState,
	ObjecttoQueryString,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	onColumnEditComplete,
	preparePageStateArr
} from '@utils/helpers';

import { InfiniteDataGrid, licenceType } from '@components/table';

import { FormSchema, IFormInput } from '../models/Ranges';
import { useIntl } from 'react-intl';
import './range.css';

const gridStyle = { minHeight: 200 };

// ==============================|| RANGES ||============================== //

interface Props {
	passProps?: any;
	handleDrawerToggle?: any;
	edit?: boolean;
	selectedData?: any;
}

const initParams = {
	page: 1,
	limit: 10000,
	// sortBy: [],
	// filterBy: [],
	pagination: 'true'
} as InitialQueryParam;
let selectedTypeValue: any;
const Ranges = ({ handleDrawerToggle, edit, selectedData }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	//add your reference
	const buttonRef = useRef<any>(null);

	const [gridRef, setGridRef] = useState<any>(null);

	// add your Slice Action  👿
	const { actions: rangeActions } = useRangeSlice();
	const { actions } = useSnackBarSlice();

	// *** Range state ***//
	const rangeState = useSelector(rangeSelector);
	const { addError, addSuccess, getOneSuccess, getSuccess } = rangeState;

	//add your Locale
	const { formatMessage } = useIntl();

	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },

			{
				name: 'name',
				header: 'Name',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Name *'
				}
			},
			{
				name: 'from_value',
				header: 'From Wgt',
				headerAlign: 'end',
				width: 100,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					placeholder: 'From Value *'
				},
				render: ({ data }: any) => {
					return (
						<Typography align="right">
							{data.from_value ? parseFloat(data.from_value).toFixed(2) : null}
						</Typography>
					);
				}
			},
			{
				name: 'to_value',
				header: 'To Wgt',
				headerAlign: 'end',
				sortable: false,
				width: 100,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					placeholder: 'To Value *'
				},
				render: ({ data }: any) => {
					return (
						<Typography align="right">
							{data.to_value ? parseFloat(data.to_value).toFixed(2) : null}
						</Typography>
					);
				}
			},
			{
				name: 'price',
				header: 'Base Price',
				addInHidden: true,
				sortable: false,
				width: 120,
				openInDialog: true,
				renderEditor: (editorProps: any) => {
					return <DDTextFieldEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},

				render: ({ data }: any) => {
					return data && data.price && data.price.name ? data.price.name : '';
				}
			},
			{
				name: 'sort_no',
				header: 'Sort No',
				type: 'number',
				headerAlign: 'center',
				textAlign: 'center',
				sortable: false,
				width: 80,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					placeholder: 'Sort No *',
					min: 2
				}
			},
			{
				name: 'type',
				header: 'Type',
				editable: false,
				skipNavigation: true,
				sortable: false,
				width: 200,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					placeholder: 'Type *'
				}
			},

			{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
		];
	};

	const [rangeOptions, setRangeOptions] = useState<any>([]);
	const [selectRange, setSelectRange] = useState<any>(null);

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});

	const [newPageState, setNewPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});

	const confirm = useConfirm();

	const refPage = useHotkeys<any>('alt+s', () => buttonRef.current.click());
	selectedTypeValue = selectRange ? selectRange.name : null;
	const [value, setValue] = useState('POINTER');
	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());
	const [dropdownStatus, setDropdownStatus] = useState<any>(0);

	/*** Dialogbox */
	const [dropDownData, setDropDownData] = useState([]);

	const [gridActiveCell, setGridActiveCell] = useState<any>({});

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

	useEffect(() => {
		dispatch(rangeActions.getOne('POINTER'));
		return () => {
			dispatch(rangeActions.reset());
		};
	}, []);

	// *** REDUCER *** //
	useEffect(() => {
		if (addSuccess) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Save successfully.',
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
			//reset();
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});
			dispatch(rangeActions.getOne('POINTER'));
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
			if (getSuccess?.columnType === 'disc_seq') {
				if (getSuccess?.results && getSuccess?.results.length > 0) {
					setDropDownData(getSuccess?.results);
				} else {
					setDropDownData([]);
				}
			} else if (getSuccess?.columnType === 'price_seq') {
				if (getSuccess?.results && getSuccess?.results.length > 0) {
					setDropDownData(getSuccess?.results);
				} else {
					setDropDownData([]);
				}
			} else if (!getSuccess?.columnType || getSuccess?.columnType === null) {
				if (getSuccess?.results && getSuccess?.results.length > 0) {
					setDataSource(getSuccess?.results);
				} else {
					setDataSource([]);
				}
			}
		}
	}, [getSuccess]);

	//Dropdown menu items
	useEffect(() => {
		if (getOneSuccess) {
			if (getOneSuccess?.results) {
				setRangeOptions(getOneSuccess?.results);
				setNewPageState(value => ({
					...value,
					values: {
						...newPageState.values,
						rangename: getOneSuccess?.results[0]
					}
				}));
				setDropdownStatus(1);
			} else {
				setRangeOptions([]);
			}
		}
	}, [getOneSuccess]);
	useEffect(() => {
		if (dropdownStatus == 1) {
			reset(newPageState.values);
			handleRangeChange('', newPageState.values.rangename);
			setDropdownStatus(0);
		}
	}, [dropdownStatus]);

	// *** EVENT HANDDLERS  👿

	// DROPDOWN CHANGES
	const handleRangeChange = (event: any, newValue: any) => {
		setSelectRange(newValue);
		dispatch(
			rangeActions.get({
				QueryParams: `type=${newValue?.name}&page=1&limit=50&pagination=true`
			})
		);

		setPageState({
			isValid: false,
			values: {},
			touched: null,
			errors: null
		});
		return () => {
			dispatch(rangeActions.reset());
		};
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue((event.target as HTMLInputElement).value);
		reset();
		setPageState({
			isValid: false,
			values: {},
			touched: null,
			errors: null
		});
		dispatch(rangeActions.getOne((event.target as HTMLInputElement).value));

		return () => {
			dispatch(rangeActions.reset());
		};
	};

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
					} else if (
						pageState.values.para[i].type == null ||
						pageState.values.para[i].type == ''
					) {
						errorMessage = 'Type must be required.';
					} else if (
						pageState.values.para[i].to_value == null ||
						pageState.values.para[i].to_value == ''
					) {
						errorMessage = 'To Value must be required.';
					} else if (
						pageState.values.para[i].from_value == null ||
						pageState.values.para[i].from_value == ''
					) {
						errorMessage = 'From Value must be required.';
					} else if (
						pageState.values.para[i].sort_no == null ||
						pageState.values.para[i].sort_no == ''
					) {
						errorMessage = 'Sort No must be required.';
					}
				}
			}

			if (errorMessage == null) {
				dispatch(rangeActions.add(pageState.values));
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

	const onTableDataChange = useCallback(
		async (obj: any) => {
			const { table, type, subType, data, rowIndex, colIndex } = obj;
			switch (type) {
				case 'delete-row':
					const stateArr = await deleteRow(pageState, 'seq_no', data, rowIndex);

					setPageState(value => ({
						...value,
						values: {
							...pageState.values,
							para: stateArr
						}
					}));

					const deleteData = [...data];
					deleteData.splice(rowIndex, 1);
					setDataSource(deleteData);
					break;

				case 'insert-row':
					const {
						insertNew,
						data: insertData,
						stateArr: insertStateArr
					} = await insertNewRow(
						pageState, // State for track row insert, update or delete
						FormSchema, // for validation
						dataSource, // table data
						rowIndex, // row number
						obj.isLastEditableColumn,
						obj.eventKey,
						{ is_active: true }
					);

					if (insertNew) {
						// *** set table with new data
						setDataSource(insertData);

						// *** set state for api
						setPageState(value => ({
							...value,
							values: {
								...pageState.values,
								para: insertStateArr
							}
						}));

						// *** Focus on first cell of new added row
						setGridActiveCell({
							type: 'insert-row',
							row: insertData.length - 1,
							col: 0
						});
					}

					break;
				case 'dialog-data-change':
					const { dialogObj, rowSelectedObj } = obj;

					if (subType === 'handle-change') {
						// **** NOTE ***
						// *** Static Data in ComboBox then Just filter data and set State of dropDownData here
						dispatch(rangeActions.reset());
						if (
							dialogObj &&
							(dialogObj.selectedColumn.column.name === 'price' ||
								dialogObj.selectedColumn.column.name === 'disc')
						) {
							const columnName =
								dialogObj.selectedColumn.column.name === 'price'
									? 'price_seq'
									: 'disc_seq';
							dispatch(
								rangeActions.get({
									QueryParams:
										dialogObj.value.length !== 0
											? `type=${selectedTypeValue}&columnType=${columnName}&limit=10&q=` +
											  dialogObj.value
											: `type=${selectedTypeValue}&page=1&limit=500&pagination=false&columnType=${columnName}`
								})
							);
						}
					} else if (subType === 'handle-row-selected') {
						const { stateArr: dialogStateArr, data: dialogData } =
							await prepareOnEditComplete(
								columns,
								dataSource,
								rowSelectedObj.originData,
								rowSelectedObj.selectedColumn.column.name,
								rowSelectedObj.selectedColumn.rowIndex,
								pageState,
								'seq_no'
							);
						// Add rows to in pageState
						setPageState(value => ({
							...value,
							values: {
								...pageState.values,
								para: dialogStateArr
							}
						}));

						setDataSource(dialogData);

						setGridActiveCell({
							type: 'dialog-data-change',
							subType: 'handle-row-selected',
							rowIndex,
							colIndex
						});
					}
					break;
				case 'on-edit-complete':
					const { value, columnId } = obj;

					const { stateArr: onEditStateArr, data: onEditData } =
						await prepareOnEditComplete(
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
							para: onEditStateArr
						}
					}));

					setDataSource(onEditData);
					break;

				default:
					break;
			}
		},
		[dataSource]
	);

	return (
		<>
			<MainCard
				content={false}
				ref={refPage as any}
				tabIndex={-1}
				className="range-main-container">
				<FormContainer
					onSuccess={() => onSubmit()}
					formContext={formContext}
					FormProps={{ autoComplete: 'off' }}>
					<FormControl sx={{ mt: 1, mb: 1, ml: 1.5 }}>
						<Stack
							spacing={2}
							direction="row"
							sx={{ margin: 1.5 }}
							className="custom-field">
							<RadioGroup
								aria-labelledby="demo-controlled-radio-buttons-group"
								name="controlled-radio-buttons-group"
								value={value}
								row={true}
								className="custom-textfield"
								onChange={handleChange}>
								<FormControlLabel
									value="POINTER"
									control={<Radio />}
									label="Pointer"
								/>
								<FormControlLabel
									value="POLISH SIZE"
									control={<Radio />}
									label="Polish Size"
								/>
							</RadioGroup>
							<Stack className="custom-textfield">
								<AutocompleteElement
									name="rangename"
									options={rangeOptions}
									autocompleteProps={{
										id: 'Range',
										onChange: (event, value, reason, details) =>
											handleRangeChange(event, value),
										getOptionLabel: option => {
											// Regular option
											return option.name;
										}
									}}
								/>
							</Stack>
						</Stack>
					</FormControl>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Stack spacing={1}>
								<MainCard content={false} tabIndex="0">
									<InfiniteDataGrid
										tableName={'primary'}
										idProperty="seq_no"
										nativeScroll={true}
										initParams={initParams}
										columns={columns}
										dataSource={dataSource}
										onTableDataChange={onTableDataChange}
										style={gridStyle}
										gridActiveCell={gridActiveCell}
										dropDownDataSource={dropDownData}
										editable={true}
										groups={[
											{
												name: 'base',
												header: (
													<span
														style={{
															display: 'flex',
															justifyContent: 'center'
														}}>
														Base
													</span>
												)
											}
										]}
										rowHeight={21}
										headerHeight={22}
										showColumnMenuTool={false}
										showZebraRows={false}
										//dialogColumns={dialogColumns}
										focus={true}
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
							spacing={1}
							justifyContent="left"
							alignItems="center">
							<Button
								style={{ height: '30px', width: '70px' }}
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
								style={{ height: '30px', width: '70px' }}
								variant="outlined"
								color="secondary"
								onClick={e => handleCancel(e)}>
								{formatMessage({ id: 'Cancel' })}
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</MainCard>
		</>
	);
};

export default Ranges;
