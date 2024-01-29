/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Stack, Typography } from '@mui/material'; // IconButton,
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { TextFieldEditor, AutocompleteEditor, DatePickerEditor } from '@components/table/editors';
import { zodResolver } from '@hookform/resolvers/zod';
// import ReactDataGrid from '@inovua/reactdatagrid-community';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import { FormSchema, IFormInput } from '@pages/master/invoice/models/InvoiceDetails';
import { useInvoicesSlice } from '@pages/master/invoice/store/slice';
import { invoicesSelector } from '@pages/master/invoice/store/slice/invoices.selectors';

import {
	InitialQueryParam,
	InitialState,
	onTableKeyDown,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';

import '@inovua/reactdatagrid-community/index.css';
import dayjs from 'dayjs';

const gridStyle = { minHeight: 250 };
let inEdit: boolean;
let newRowDataSource: any;
let initialFocus = false;
const totalStyle = { minHeight: 21 };

const initParams = {
	page: 1,
	limit: 10000,
	pagination: 'true'
} as InitialQueryParam;
console.log(initParams);

// ==============================|| INVOICEDETAILS ||============================== //

interface Props {
	passProps?: any;
	addressType?: string;
	selectedData?: any | null;
	invoiceDetailOptions?: any;
	currentAction?: any;
	editMode?: any;
	loadHeader?: any;
	setLoadHeader?: any;
}

const InvoiceDetail = ({
	passProps,
	invoiceDetailOptions,
	currentAction,
	editMode,
	loadHeader,
	setLoadHeader
}: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const invoicesState = useSelector(invoicesSelector);
	const { actions: invoicesActions } = useInvoicesSlice();
	// *** invoices State *** //
	const {
		getColumnsSettingSuccess,
		getParaSuccess,
		getVendorSuccess,
		getVendorError,
		getTenderNoSuccess,
		getTenderNoError
	} = invoicesState;

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
	const [columns, setColumns] = useState<any>([]);
	const [groups, setGroups] = useState<any>([]);
	const [activeCell, setActiveCell] = useState<any>([0, 1]);

	// FIRST USEEFFECT CALL FOR COLUMN SETTING
	// useEffect(() => {
	// 	return () => {
	// 		dispatch(invoicesActions.reset());
	// 	};
	// }, []);

	useEffect(() => {
		if (columns.length == 0) {
			const addUrl = 'Invoice';
			dispatch(invoicesActions.getColumnsSetting({ QueryParams: `'${addUrl}'/0/0/0` }));
			//setLoadHeader(false);
		}
	}, []);

	const footerRows = [
		{
			render: {
				sr_no: (
					<div style={totalStyle}>
						<b>Total</b>
					</div>
				),
				wgt: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.wgt !== 0 ? summary.wgt.toFixed(2) : 0}</b>
					</div>
				),
				pcs: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.pcs}</b>
					</div>
				),
				value: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>{summary.value}</b>
					</div>
				)
			}
		}
	];

	const summaryReducer = {
		initialValue: { wgt: 0, pcs: 0, value: 0 },
		reducer: (acc: any, item: any) => ({
			wgt: parseFloat(acc.wgt || 0) + parseFloat(item.wgt || 0),
			pcs: parseInt(acc.pcs || 0) + parseInt(item.pcs || 0),
			value: parseInt(acc.value || 0) + parseInt(item.value || 0)
		})
	};

	//GETCOLUMN FUNCTION AND GETSUCCESS FOR COLUMN SETTING
	const getColumns = async (columns: any) => {
		let arrColums = [];
		for (let index = 0; index < columns.length; index++) {
			const element = columns[index];

			const column = {
				...element,
				...(element.renderEditor &&
					element.renderEditor === 'TextFieldEditor' && {
						renderEditor: (editorProps: any) => {
							return <TextFieldEditor {...editorProps} />;
						}
					}),
				...(element.render &&
					(element.render === 'N0' ||
						element.render === 'N1' ||
						element.render === 'N2' ||
						element.render === 'N3' ||
						element.render === 'N4') && {
						render: ({ data }: any) => {
							return (
								<Typography align="center">
									{data && data[element.name]
										? parseFloat(data[element.name]).toFixed(
												element.render.split('N')[1]
										  )
										: null}
								</Typography>
							);
						}
					}),
				...(element.renderEditor &&
					element.renderEditor === 'TextFieldEditor' && {
						renderEditor: (editorProps: any) => {
							return <TextFieldEditor {...editorProps} />;
						}
					}),
				...(element.render &&
					(element.render === 'N0' ||
						element.render === 'N1' ||
						element.render === 'N2' ||
						element.render === 'N3' ||
						element.render === 'N4') &&
					element.name === 'value' && {
						render: ({ data }: any) => {
							if (data) {
								let calculatedValue =
									Number(parseFloat(data?.wgt)) * Number(parseFloat(data?.rate));
								if (isNaN(calculatedValue)) calculatedValue = 0;
								return (
									<Typography align="right">
										{Number(calculatedValue.toFixed(2))}
									</Typography>
								);
							}
						}
					}),
				...(element.renderEditor &&
					element.renderEditor === 'DatePickerEditor' && {
						renderEditor: (editorProps: any) => {
							return <DatePickerEditor {...editorProps} />;
						}
					}),
				...(element.render &&
					element.render === 'DD-MM-YYYY' && {
						render: ({ data, value }: any) => {
							return (
								<Typography align="center">
									{data && data.element && data.element
										? dayjs(data.element).format('DD-MM-YYYY')
										: value
										? dayjs(value).format('DD-MM-YYYY')
										: ''}
								</Typography>
							);
						}
					}),
				...(element.renderEditor &&
					element.renderEditor === 'AutocompleteEditor' && {
						renderEditor: (editorProps: any) => {
							return <AutocompleteEditor {...editorProps} />;
						}
					}),
				...(element.render &&
					element.render === 'AutoComplete' && {
						render: ({ data }: any) => {
							return data &&
								data[element.name] &&
								data[element.name][element.display_member]
								? data[element.name][element.display_member]
								: '';
						}
					}),
				...(element.renderHeader &&
					element.renderHeader !== '' && {
						renderHeader: (params: any) => {
							return (
								<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
									{element.renderHeader}
								</div>
							);
						}
					})
			};

			arrColums.push(column);
		}

		setColumns(arrColums);
	};
	useEffect(() => {
		if (getColumnsSettingSuccess) {
			if (
				!getColumnsSettingSuccess?.columnType ||
				getColumnsSettingSuccess?.columnType === null
			) {
				if (getColumnsSettingSuccess) {
					if (getColumnsSettingSuccess?.columns != null) {
						getColumns(getColumnsSettingSuccess?.columns);
					} else {
						setColumns([]);
					}

					if (getColumnsSettingSuccess?.groups != null) {
						getGroups(getColumnsSettingSuccess?.groups);
					} else {
						setGroups([]);
					}

					// if (getColumnsSettingSuccess?.results != null) {
					// 	setPageState(value => ({
					// 		...value,
					// 		values: {
					// 			...pageState.values,
					// 			para: getColumnsSettingSuccess.results
					// 		}
					// 	}));

					// 	setDataSource(getColumnsSettingSuccess.results);
					// } else {
					// 	setDataSource([]);
					// }
				} else {
					setColumns([]);
					setGroups([]);
					//setDataSource([]);
				}
			}
		}
		// setLoading(false);
	}, [getColumnsSettingSuccess]);

	/**GRT GRUOP FUNCTION FOR CREATE GROUP**/
	const getGroups = async (columns: any) => {
		let arrColums = [];
		for (let index = 0; index < columns.length; index++) {
			const element = columns[index];

			const group = {
				...element,
				...(element.header && {
					header: (
						<span
							style={{
								color: '#ff595e',
								fontWeight: 'bold',
								display: 'flex',
								justifyContent: 'center',
								height: '15px'
							}}>
							{element.header}
						</span>
					)
				})
			};

			arrColums.push(group);
		}

		setGroups(arrColums);
	};

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
		if (invoiceDetailOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: invoiceDetailOptions
				}
			}));
			setTimeout(() => {
				setDataSource(invoiceDetailOptions);
			}, 100);
		}
	}, [invoiceDetailOptions]);

	/**PASS PROPS**/
	useEffect(() => {
		newRowDataSource = dataSource;
		passProps(pageState.values.para);
	}, [dataSource]);

	/**GRID REF SUCCESS**/
	useEffect(() => {
		if (gridRef && !initialFocus) {
			requestAnimationFrame(() => {
				initialFocus = true;
				gridRef.current.focus();
			});
		}
	}, [gridRef]);

	/**DROPDOWN COME FROM PARA SUCCESS**/
	useEffect(() => {
		if (getParaSuccess) {
			if (getParaSuccess?.columnType === 'rough_type') {
				let roughTypeData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'rough_type'
				);

				if (getParaSuccess?.results && getParaSuccess?.results.length > 0) {
					roughTypeData = getParaSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: roughTypeData,
						collapseOnSelect: true,
						clearIcon: null
					};

					setColumns(updatedColumns);
				}
			} else if (getParaSuccess?.columnType === 'rough_size') {
				let roughSizeData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'rough_size'
				);

				if (getParaSuccess?.results && getParaSuccess?.results.length > 0) {
					roughSizeData = getParaSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: roughSizeData,
						collapseOnSelect: true,
						clearIcon: null
					};

					setColumns(updatedColumns);
				}
			} else if (getParaSuccess?.columnType === 'rough_quality') {
				let roughQualityData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'rough_quality'
				);

				if (getParaSuccess?.results && getParaSuccess?.results.length > 0) {
					roughQualityData = getParaSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: roughQualityData,
						collapseOnSelect: true,
						clearIcon: null
					};

					setColumns(updatedColumns);
				}
			} else if (getParaSuccess?.columnType === 'origin_month') {
				let originMonthData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'origin_month'
				);

				if (getParaSuccess?.results && getParaSuccess?.results.length > 0) {
					originMonthData = getParaSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: originMonthData,
						collapseOnSelect: true,
						clearIcon: null
					};

					setColumns(updatedColumns);
				}
			} else if (getParaSuccess?.columnType === 'origin_year') {
				let originYearData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'origin_year'
				);

				if (getParaSuccess?.results && getParaSuccess?.results.length > 0) {
					originYearData = getParaSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: originYearData,
						collapseOnSelect: true,
						clearIcon: null
					};

					setColumns(updatedColumns);
				}
			} else if (getParaSuccess?.columnType === 'coo') {
				let cooData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'coo'
				);

				if (getParaSuccess?.results && getParaSuccess?.results.length > 0) {
					cooData = getParaSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: cooData,
						collapseOnSelect: true,
						clearIcon: null
					};

					setColumns(updatedColumns);
				}
			} else if (getParaSuccess?.columnType === 'soo') {
				let sooData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'soo'
				);

				if (getParaSuccess?.results && getParaSuccess?.results.length > 0) {
					sooData = getParaSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: sooData,
						collapseOnSelect: true,
						clearIcon: null
					};

					setColumns(updatedColumns);
				}
			} else if (getParaSuccess?.columnType === 'moo') {
				let mooData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'moo'
				);

				if (getParaSuccess?.results && getParaSuccess?.results.length > 0) {
					mooData = getParaSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: mooData,
						collapseOnSelect: true,
						clearIcon: null
					};

					setColumns(updatedColumns);
				}
			} else if (getParaSuccess?.columnType === 'elig_brand') {
				let eligBrandData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'elig_brand'
				);

				if (getParaSuccess?.results && getParaSuccess?.results.length > 0) {
					eligBrandData = getParaSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: eligBrandData,
						collapseOnSelect: true,
						clearIcon: null
					};

					setColumns(updatedColumns);
				}
			} else if (getParaSuccess?.columnType === 'supplier_seq') {
				let supplierSeqData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'supplier_seq'
				);

				if (getParaSuccess?.results && getParaSuccess?.results.length > 0) {
					supplierSeqData = getParaSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: supplierSeqData,
						collapseOnSelect: true,
						clearIcon: null
					};

					setColumns(updatedColumns);
				}
			} else if (getParaSuccess?.columnType === 'rough_shape') {
				let shapeSeqData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'rough_shape'
				);

				if (getParaSuccess?.results && getParaSuccess?.results.length > 0) {
					shapeSeqData = getParaSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: shapeSeqData,
						collapseOnSelect: true,
						clearIcon: null
					};

					setColumns(updatedColumns);
				}
			}
		}
	}, [getParaSuccess]);

	/**VENDOR SUCCESS**/
	useEffect(() => {
		if (getVendorSuccess) {
			if (getVendorSuccess?.columnType === 'supplier_seq') {
				let supplierSeqData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'supplier_seq'
				);

				if (getVendorSuccess?.results && getVendorSuccess?.results.length > 0) {
					supplierSeqData = getVendorSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: supplierSeqData,
						collapseOnSelect: true,
						clearIcon: null
					};

					setColumns(updatedColumns);
				}
			}
		}
	}, [getVendorSuccess, getVendorError]);

	/**TENDER NO SUCCESS**/
	useEffect(() => {
		if (getTenderNoSuccess) {
			if (getTenderNoSuccess?.columnType === 'tender_no') {
				let tenderData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'tender_no'
				);

				if (getTenderNoSuccess?.results && getTenderNoSuccess?.results.length > 0) {
					tenderData = getTenderNoSuccess?.results;
				}

				if (editorTypeColumnIndex !== -1) {
					updatedColumns[editorTypeColumnIndex].editorProps = {
						idProperty: 'seq_no',
						dataSource: tenderData,
						collapseOnSelect: true,
						clearIcon: null
					};
					setColumns(updatedColumns);
				}
			}
		}
	}, [getTenderNoSuccess, getTenderNoError]);

	// *** REDUCER *** //

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
		if (edited && edited.colName === 'rough_type') {
			dispatch(
				invoicesActions.getPara(
					`'ROUGH_TYPE'/?page=1&limit=10&pagination=false&columnType=rough_type`
				)
			);
		}
		if (edited && edited.colName === 'rough_size') {
			dispatch(
				invoicesActions.getPara(
					`'ROUGH_SIZE'/?page=1&limit=10&pagination=false&columnType=rough_size`
				)
			);
		}
		if (edited && edited.colName === 'rough_quality') {
			dispatch(
				invoicesActions.getPara(
					`'ROUGH_QUALITY'/?page=1&limit=10&pagination=false&columnType=rough_quality`
				)
			);
		}
		if (edited && edited.colName === 'origin_month') {
			dispatch(
				invoicesActions.getPara(
					`'ORIGIN_MONTH'/?page=1&limit=10&pagination=false&columnType=origin_month`
				)
			);
		}
		if (edited && edited.colName === 'origin_year') {
			dispatch(
				invoicesActions.getPara(
					`'ORIGIN_YEAR'/?page=1&limit=10&pagination=false&columnType=origin_year`
				)
			);
		}
		if (edited && edited.colName === 'coo') {
			dispatch(
				invoicesActions.getPara(`'COO'/?page=1&limit=10&pagination=false&columnType=coo`)
			);
		}
		if (edited && edited.colName === 'soo') {
			dispatch(
				invoicesActions.getPara(`'SOO'/?page=1&limit=10&pagination=false&columnType=soo`)
			);
		}
		if (edited && edited.colName === 'moo') {
			dispatch(
				invoicesActions.getPara(`'MOO'/?page=1&limit=10&pagination=false&columnType=moo`)
			);
		}
		if (edited && edited.colName === 'elig_brand') {
			dispatch(
				invoicesActions.getPara(
					`'PROGRAMS'/?page=1&limit=10&pagination=false&columnType=elig_brand`
				)
			);
		}
		if (edited && edited.colName === 'tender_no') {
			dispatch(
				invoicesActions.getTenderNo({
					QueryParams: `page=1&limit=10&pagination=false&columnType=tender_no`
				})
			);
		}
		if (edited && edited.colName === 'supplier_seq') {
			dispatch(
				invoicesActions.getVendor({
					QueryParams: `page=1&limit=10&pagination=false&q=supplier='true'&columnType=supplier_seq`
				})
			);
		}
		if (edited && edited.colName === 'rough_shape') {
			dispatch(
				invoicesActions.getPara(
					`'ROUGH_SHAPE'/?page=1&limit=10&pagination=false&columnType=rough_shape`
				)
			);
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
					description: 'Are you sure delete Bank ?',
					cancellationButtonProps: { autoFocus: true },
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
					{
						sr_no: rowCount + 1,
						invoice_date: dayjs(new Date()).format('YYYY-MM-DD')
					}
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
					setActiveCell([data.length - 1, 1]);
					setTimeout(() => {
						const column = grid.getColumnBy(1);
						grid.startEdit({ columnId: column.name, rowIndex: data.length - 1 });
					}, 100);
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

	const onSubmit = async () => {
		/* empty */
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
										editable={editMode}
										columns={columns}
										dataSource={dataSource}
										summaryReducer={summaryReducer}
										footerRows={footerRows}
										rowHeight={21}
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

export default InvoiceDetail;
