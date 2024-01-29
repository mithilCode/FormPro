import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress, Grid, Stack } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { matchSorter } from 'match-sorter';
import { FormContainer } from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import MainCard from '@components/MainCard';
import { TextFieldEditor, DDTextFieldEditor } from '@components/table/editors';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { FormSchemaProp, IFormInputProp } from '@pages/master/props/models/Prop';
import { usePropSlice } from '@pages/master/props/store/slice';
import { propsSelector } from '@pages/master/props/store/slice/props.selectors';
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

import { useCutsSlice } from '@pages/master/cuts/store/slice';
import { cutsSelector } from '@pages/master/cuts/store/slice/cuts.selectors';
import { usePolishsSlice } from '@pages/master/polishs/store/slice';
import { polishsSelector } from '@pages/master/polishs/store/slice/polishs.selectors';
import { useSymmsSlice } from '@pages/master/symms/store/slice';
import { symmsSelector } from '@pages/master/symms/store/slice/symms.selectors';

const gridStyle = { minHeight: 400 };

// ==============================|| PROPS ||============================== //

interface Props {
	selectedData?: any;
}
const initParams = {
	page: 1,
	limit: 10000,
	// sortBy: [],
	// filterBy: [],
	pagination: 'true'
} as InitialQueryParam;

let staticCutDropDownData = [] as any;
let staticPolishDropDownData = [] as any;
let staticSymmDropDownData = [] as any;

const Prop = ({ selectedData }: Props) => {
	const dispatch = useDispatch();

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const { actions: propActions } = usePropSlice();
	const { actions } = useSnackBarSlice();
	const { actions: cutsActions } = useCutsSlice();
	const { actions: polishsActions } = usePolishsSlice();
	const { actions: symmsActions } = useSymmsSlice();

	// *** Prop State *** //
	const propState = useSelector(propsSelector);
	const { addDetError, addDetSuccess, getOneDetSuccess } = propState;

	// *** Cuts State *** //
	const cutsState = useSelector(cutsSelector);
	const { getError: getCutsError, getSuccess: getCutsSuccess } = cutsState;

	// *** Polishs State *** //
	const polishsState = useSelector(polishsSelector);
	const { getError: getPolishsError, getSuccess: getPolishsSuccess } = polishsState;

	// *** Symm State *** //
	const symmsState = useSelector(symmsSelector);
	const { getError: getSymmsError, getSuccess: getSymmsSuccess } = symmsState;

	// add your Locale  👿
	const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInputProp>({
		resolver: zodResolver(FormSchemaProp),
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
				name: 'cut',
				header: 'Cut',
				addInHidden: true,
				sortable: false,
				openInDialog: true,
				renderEditor: (editorProps: any) => {
					return <DDTextFieldEditor {...editorProps} />;
				},
				rops: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},

				render: ({ data }: any) => {
					return data && data.cut && data.cut.name ? data.cut.name : '';
				}
			},
			{
				name: 'polish',
				header: 'Polish',
				addInHidden: true,
				sortable: false,
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
					return data && data.polish && data.polish.name ? data.polish.name : '';
				}
			},
			{
				name: 'symm',
				header: 'Symm',
				addInHidden: true,
				sortable: false,
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
					return data && data.symm && data.symm.name ? data.symm.name : '';
				}
			},
			{
				name: 'sort_no',
				header: 'Sort No',
				type: 'number',
				headerAlign: 'center',
				textAlign: 'center',
				width: 80,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					min: 2
				}
			},

			{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
		];
	};

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

	/*** Dialogbox */
	// const [staticDropDownData, setStaticDropDownData] = useState([]);
	const [dropDownData, setDropDownData] = useState([]);

	const [gridActiveCell, setGridActiveCell] = useState<any>({});

	useEffect(() => {
		dispatch(
			propActions.getOneDet({
				QueryParams: `seq_no=${selectedData.seq_no}&page=1&limit=10&pagination=false`
			})
		);

		// Cuts
		dispatch(
			cutsActions.get({
				QueryParams: `page=1&limit=100&pagination=false`
			})
		);

		// Polishs
		dispatch(
			polishsActions.get({
				QueryParams: `page=1&limit=100&pagination=false`
			})
		);

		// Symms
		dispatch(
			symmsActions.get({
				QueryParams: `page=1&limit=100&pagination=false`
			})
		);

		return () => {
			dispatch(propActions.reset());
		};
	}, []);

	// *** REDUCER *** //

	useEffect(() => {
		if (addDetSuccess) {
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

			reset();
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});

			dispatch(
				propActions.getOneDet({
					QueryParams: `seq_no=${selectedData.seq_no}&page=1&limit=10&pagination=false`
				})
			);
		}
	}, [addDetSuccess]);

	useEffect(() => {
		if (addDetError) {
			const message = addDetError && addDetError.error ? addDetError.error.errors[0] : '';

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
	}, [addDetError]);

	useEffect(() => {
		if (getOneDetSuccess) {
			if (getOneDetSuccess?.results && getOneDetSuccess?.results.length > 0) {
				setDataSource(getOneDetSuccess?.results);
			} else {
				setDataSource([]);
			}
		}
	}, [getOneDetSuccess]);

	useEffect(() => {
		if (getCutsSuccess) {
			if (getCutsSuccess?.results && getCutsSuccess?.results.length > 0) {
				setDropDownData(getCutsSuccess?.results);
				staticCutDropDownData = getCutsSuccess?.results;
			} else {
				setDropDownData([]);
			}
		}

		if (getCutsError) {
		}
	}, [getCutsError, getCutsSuccess]);

	// useEffect(() => {
	// 	console.log('staticDropDownData', staticDropDownData);
	// }, [staticDropDownData]);

	useEffect(() => {
		if (getPolishsSuccess) {
			if (getPolishsSuccess?.results && getPolishsSuccess?.results.length > 0) {
				setDropDownData(getPolishsSuccess?.results);
				staticPolishDropDownData = getPolishsSuccess?.results;
			} else {
				setDropDownData([]);
			}
		}

		if (getPolishsError) {
		}
	}, [getPolishsError, getPolishsSuccess]);

	useEffect(() => {
		if (getSymmsSuccess) {
			if (getSymmsSuccess?.results && getSymmsSuccess?.results.length > 0) {
				setDropDownData(getSymmsSuccess?.results);
				staticSymmDropDownData = getSymmsSuccess?.results;
			} else {
				setDropDownData([]);
			}
		}

		if (getSymmsError) {
		}
	}, [getSymmsError, getSymmsSuccess]);

	// *** EVENT HANDDLERS  👿

	let newValue = selectedData.seq_no;

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
						pageState.values.para[i].prop_seq == null ||
						pageState.values.para[i].prop_seq == ''
					) {
						errorMessage = 'Prop Seq must be required.';
					} else if (
						pageState.values.para[i].sort_no == null ||
						pageState.values.para[i].sort_no == ''
					) {
						errorMessage = 'Sort No must be required.';
					}
				}
			}

			if (errorMessage == null) {
				dispatch(propActions.addDet(pageState.values));
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

	const getItems = (arr: any, value: any, field: any = ['name']) => {
		if (!value) {
			return arr;
		}

		var words = value.split(' ');
		return words.reduceRight(
			(arr: any, word: any) =>
				matchSorter(arr, word, {
					keys: field as any
				}),
			arr
		);
	};

	const onTableDataChange = useCallback(
		async (obj: any) => {
			console.log('INFINITE-DATAGRID', 'SHAPE PAGE', 'onTableDataChange', obj);
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
						FormSchemaProp, // for validation
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

						console.log('HELLLLLLOO insert row', obj.eventKey);

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
						dispatch(propActions.reset());
						if (dialogObj && dialogObj.selectedColumn.column.name === 'cut') {
							const filterCutData = getItems(staticCutDropDownData, dialogObj.value);
							setDropDownData(filterCutData);
						}
						if (dialogObj && dialogObj.selectedColumn.column.name === 'polish') {
							// Polishs
							const filterPolishData = getItems(
								staticPolishDropDownData,
								dialogObj.value
							);
							setDropDownData(filterPolishData);
						}
						if (dialogObj && dialogObj.selectedColumn.column.name === 'symm') {
							// Symms
							const filterSymmData = getItems(
								staticSymmDropDownData,
								dialogObj.value
							);
							setDropDownData(filterSymmData);
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
			<MainCard content={false} ref={refPage as any} tabIndex={-1}>
				<FormContainer
					onSuccess={() => onSubmit()}
					formContext={formContext}
					FormProps={{ autoComplete: 'off' }}>
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

export default Prop;
