/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Stack, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { FormSchema, IFormInput } from '@pages/master/tenderlotplan/models/TenderLotAssortment';
import { TextFieldEditor, AutocompleteEditor } from '@components/table/editors';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useTenderlotplansSlice } from '@pages/master/tenderlotplan/store/slice';
import { tenderlotplansSelector } from '@pages/master/tenderlotplan/store/slice/tenderlotplans.selectors';

import { useColorsSlice } from '@pages/master/colors/store/slice';
import { colorsSelector } from '@pages/master/colors/store/slice/colors.selectors';
import { usePuritiesSlice } from '@pages/master/purities/store/slice';
import { puritiesSelector } from '@pages/master/purities/store/slice/purities.selectors';
import { useFlssSlice } from '@pages/master/flss/store/slice';
import { flssSelector } from '@pages/master/flss/store/slice/flss.selectors';
import { tempDataStore } from './TenderLotPlan';
import { useSnackBarSlice } from '@app/store/slice/snackbar';

import {
	//InitialQueryParam,
	InitialState,
	onTableKeyDown,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';
import '@inovua/reactdatagrid-community/index.css';

const gridStyle = { minHeight: 200, padding: 0 };
const totalStyle = { minHeight: 21 };
let inEdit: boolean;
let newRowDataSource: any;
let newPageState: any;

// ==============================|| TENDERLOT ASSORTMENT ||============================== //

interface Props {
	passProps?: any;
	tenderLotSeq?: any;
	tenderLotCommSeq?: any;
	assortmentOptions?: any;
	assortmentToPlanOptions?: any;
	assortmentToPlanSummOptions?: any;
	assortmentHideCol?: any;
	assortFinalPlanSumm?: any;
	currentAction?: any;
	currentFocus?: any;
	editMode?: any;
}

const TenderLotAssortment = ({
	passProps,
	assortmentOptions,
	assortmentToPlanOptions,
	assortmentToPlanSummOptions,
	assortmentHideCol,
	assortFinalPlanSumm,
	tenderLotSeq,
	tenderLotCommSeq,
	currentAction,
	currentFocus,
	editMode
}: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const tenderlotplansState = useSelector(tenderlotplansSelector);

	const { getSuccess, getOnePlanningSuccess, getPlanTypeSuccess } = tenderlotplansState;

	// *** Tenderlotplans State *** //
	const { actions: tenderlotplansActions } = useTenderlotplansSlice();
	const { actions: colorsActions } = useColorsSlice();
	const { actions: puritiesActions } = usePuritiesSlice();
	const { actions: flssActions } = useFlssSlice();
	const { actions } = useSnackBarSlice();

	// *** Purities State *** //
	const puritieState = useSelector(puritiesSelector);
	const { getSuccess: getPuritySuccess } = puritieState;

	// *** Colors State *** //
	const colorState = useSelector(colorsSelector);
	const { getSuccess: getColorSuccess, getSuccess: getMachineColorSuccess } = colorState;

	// *** Flss State *** //
	const flsState = useSelector(flssSelector);
	const { getSuccess: getFlsSuccess } = flsState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const { reset } = formContext;

	const { tableRefSeq, tenderLotAssortSeq } = useContext(tempDataStore);

	const footerRows = [
		{
			render: {
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
						<b>{summary.value !== 0 ? summary.value.toFixed(0) : 0}</b>
					</div>
				),
				rate: ({ summary }: any) => (
					<div style={totalStyle}>
						<b>
							{(summary.pol_wgt !== 0 ? summary.value / summary.pol_wgt : 0).toFixed(
								0
							)}
						</b>
					</div>
				)
			}
		}
	];

	const summaryReducer = {
		initialValue: { wgt: 0, pcs: 0, value: 0, pol_wgt: 0 },
		reducer: (acc: any, item: any) => ({
			wgt: parseFloat(acc.wgt || 0) + parseFloat(item.wgt || 0),
			pcs: parseInt(acc.pcs || 0) + parseInt(item.pcs || 0),
			value: parseFloat(acc.value || 0) + parseFloat(item.value || 0),
			pol_wgt: parseFloat(acc.pol_wgt || 0) + parseFloat(item.pol_wgt || 0)
		})
	};

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
				editable: false,
				skipNavigation: true
			},
			{
				name: 'pcs',
				header: 'Pcs *',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 40,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					pattern: 'number'
				}
			},
			{
				name: 'wgt',
				header: 'Wgt *',
				group: 'rgh',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 40,
				maxWidth: 55,
				sortable: false,
				headerRenderer: ({ column }: any) => (
					<div style={{ padding: 0 }}>{column.name}</div>
				),
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let wgt = parseFloat(data.wgt);
					if (!isNaN(wgt)) {
						let result = wgt.toFixed(2);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'size',
				header: 'Size',
				//group: 'rgh',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 40,
				sortable: false,
				editable: false,
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let size = parseFloat(data.size);
					if (!isNaN(size)) {
						let result = size.toFixed(2);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'pol_wgt',
				header: 'Wgt',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 40,
				maxWidth: 55,
				sortable: false,
				editable: false,
				skipNavigation: true,
				defaultVisible: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let pol_wgt = parseFloat(data.pol_wgt);
					if (!isNaN(pol_wgt)) {
						let result = pol_wgt.toFixed(2);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'pol_per',
				header: '%',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 40,
				sortable: false,
				editable: false,
				skipNavigation: true,
				defaultVisible: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let pol_per = parseFloat(data.pol_per);
					if (!isNaN(pol_per)) {
						let result = pol_per.toFixed(2);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'rate',
				header: 'Rate',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 60,
				sortable: false,
				editable: false,
				skipNavigation: true,
				defaultVisible: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let rate = parseFloat(data.rate);
					if (!isNaN(rate)) {
						let result = rate.toFixed(0);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'value',
				header: 'Value',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 70,
				sortable: false,
				editable: false,
				defaultVisible: false,
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				},
				render: ({ data, value }: any) => {
					let val = parseFloat(data.value);
					if (!isNaN(val)) {
						let result = val.toFixed(0);
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'Comments',
				header: 'Comments',
				minWidth: 200,
				maxWidth: 250,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'plan_type',
				//header: 'Plan Type',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				sortable: false,
				defaultVisible: true,
				renderHeader: (params: any) => {
					return (
						<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
							Plan
							<br />
							Type
						</div>
					);
				},
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
							{data && data.plan_type && data.plan_type.name
								? data.plan_type.name
								: ''}
						</Typography>
					);
				}
			}
			//{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
		];
	};

	const getHideColumns = () => {
		return [
			{
				name: 'color',
				header: 'Color',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				sortable: false,
				defaultVisible: true,
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
							{data && data.color && data.color.name ? data.color.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'purity',
				header: 'Purity',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				sortable: false,
				defaultVisible: true,
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
							{data && data.purity && data.purity.name ? data.purity.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'fls',
				header: 'Fls',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				sortable: false,
				defaultVisible: true,
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
							{data && data.fls && data.fls.name ? data.fls.name : ''}
						</Typography>
					);
				}
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

	const groups = [
		{ name: 'pol', header: 'Pol' },
		{ name: 'rgh', header: 'Rgh' }
	];

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());
	const [oldColumns] = useState<any>(getHideColumns());
	const [activeCell, setActiveCell] = useState<any>([0, 0]);
	const [selectedRow, setSelectedRow] = useState<any>(null);
	const [assortSeq, setAssortSeq] = useState('');
	const [focusActiveCell, setFocusActiveCell] = useState<any>(null);

	const confirm = useConfirm();
	const [gridRef, setGridRef] = useState<any>(null);

	const handleRowSelect = useCallback((rowData: any) => {
		setSelectedRow(rowData?.data);
		tenderLotAssortSeq(rowData.data?.seq_no);
	}, []);

	useEffect(() => {
		fetchDataByColumnName({ colName: 'color' });
		return () => {
			dispatch(tenderlotplansActions.reset());
		};
	}, []);

	useEffect(() => {
		if (currentAction == 3) {
			const grid = gridRef.current;
			setActiveCell([0, 1]);
			setTimeout(() => {
				const column = grid.getColumnBy(1);
				grid.startEdit({ columnId: column.name, rowIndex: 0 });
			}, 10);
		}
	}, [currentAction]);

	useEffect(() => {
		if (assortmentOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: assortmentOptions
				}
			}));
			setDataSource(assortmentOptions?.filter((e: any) => e.action !== 'delete'));
			if (assortmentOptions && assortmentOptions.length > 0) {
				setActiveCell([0, 1]);
				tenderLotAssortSeq(assortmentOptions[0]?.seq_no);
			}
		}
	}, [assortmentOptions]);

	useEffect(() => {
		newRowDataSource = dataSource;
	}, [dataSource]);

	useEffect(() => {
		newPageState = pageState;

		passProps(newPageState.values?.para?.filter((e: any) => e.pcs != null && e.wgt != null));
	}, [pageState]);

	useEffect(() => {
		if (newRowDataSource.length == 1 && focusActiveCell == 1) {
			setActiveCell([0, 1]);
			const grid = gridRef.current;
			setTimeout(() => {
				//const column = grid.getColumnBy(0);
				grid.startEdit({ columnId: 'pcs', rowIndex: 0 });
			}, 0);
			setFocusActiveCell(null);
		}
	}, [focusActiveCell]);

	useEffect(() => {
		if (assortFinalPlanSumm) {
			let newDataSource = dataSource.map((item: any) => ({ ...item }));
			for (let index = 0; index < newDataSource.length; index++) {
				if (tableRefSeq.tenderLotAssortSeq == newDataSource[index].seq_no) {
					if (newDataSource[index].action != 'insert') {
						newDataSource[index].action = 'update';
					}
					//newDataSource[index].action = 'update';
					newDataSource[index].value = assortFinalPlanSumm.total_net_value;

					newDataSource[index].pol_wgt = assortFinalPlanSumm.total_pol_wgt;
					newDataSource[index].size = (
						newDataSource[index].wgt / newDataSource[index].pcs
					).toString();
					newDataSource[index].rate =
						assortFinalPlanSumm.total_net_value / assortFinalPlanSumm.total_pol_wgt;
					newDataSource[index].pol_per =
						(assortFinalPlanSumm.total_pol_wgt / newDataSource[index].wgt) * 100;
					setPageState(value => ({
						...value,
						values: {
							...pageState.values,
							para: newDataSource
						}
					}));
				}
			}
			setDataSource(newDataSource);
		}
	}, [assortFinalPlanSumm]);

	useEffect(() => {
		if (assortmentHideCol) {
			if (assortmentHideCol.length > 0) {
				const updatedColumns = [...columns];
				const updatedOldColumns = [...oldColumns];

				const hide = ['color', 'purity', 'fls'];
				if (assortmentHideCol != 'mix') {
					const OldColumnIndex = updatedOldColumns.findIndex(
						(column: any) => column.name === assortmentHideCol
					);

					let ColumnIndex;
					for (let index = 0; index < hide.length; index++) {
						ColumnIndex = updatedColumns.findIndex(
							(column: any) => column.name === hide[index]
						);
						if (ColumnIndex != -1) {
							updatedColumns.splice(ColumnIndex, 1);
						}
					}

					const aa = updatedOldColumns.splice(OldColumnIndex, 1);
					updatedColumns.splice(7, 0, aa[0]);
				} else {
					const removeCol = hide.findIndex(
						(column: any) => column === updatedColumns[7].name
					);
					if (removeCol != -1) {
						updatedColumns.splice(7, 1);
					}
				}
				setColumns(updatedColumns);
				fetchDataByColumnName({ colName: 'color' });
			}
		}
	}, [assortmentHideCol]);

	// *** PLANNING DATA *** //
	useEffect(() => {
		if (getOnePlanningSuccess) {
			if (getOnePlanningSuccess?.results) {
				assortmentToPlanOptions({
					assortSeq: assortSeq,
					data: getOnePlanningSuccess?.results?.tender_plan
				});
				assortmentToPlanSummOptions({
					assortSeq: assortSeq,
					data: getOnePlanningSuccess?.results?.tender_lot_plan_summ
				});
			}
		}
	}, [getOnePlanningSuccess]);

	// *** COLOR *** //
	useEffect(() => {
		setConfigForgetColorSuccess(getColorSuccess);
	}, [getColorSuccess]);

	const setConfigForgetColorSuccess = (getColorSuccess: any) => {
		if (getColorSuccess) {
			if (getColorSuccess?.results) {
				if (getColorSuccess?.columnType === 'color') {
					let colorData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'color'
					);

					if (getColorSuccess?.results && getColorSuccess?.results.length > 0) {
						colorData = getColorSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: colorData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	};

	// *** PURITY *** //
	useEffect(() => {
		if (getPuritySuccess) {
			if (getPuritySuccess?.results) {
				if (getPuritySuccess?.columnType === 'purity') {
					let purityData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'purity'
					);

					if (getPuritySuccess?.results && getPuritySuccess?.results.length > 0) {
						purityData = getPuritySuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: purityData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	}, [getPuritySuccess]);

	// *** FLS *** //
	useEffect(() => {
		if (getFlsSuccess) {
			if (getFlsSuccess?.results) {
				if (getFlsSuccess?.columnType === 'fls') {
					let flsData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'fls'
					);

					if (getFlsSuccess?.results && getFlsSuccess?.results.length > 0) {
						flsData = getFlsSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: flsData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	}, [getFlsSuccess]);

	/*PLAN TYPE*/
	useEffect(() => {
		if (getPlanTypeSuccess) {
			let assortData = [];

			// Update Editable column datasource
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'plan_type'
			);

			if (getPlanTypeSuccess?.results && getPlanTypeSuccess?.results.length > 0) {
				assortData = getPlanTypeSuccess?.results;
			}

			if (editorTypeColumnIndex !== -1) {
				updatedColumns[editorTypeColumnIndex].editorProps = {
					idProperty: 'seq_no',
					dataSource: assortData,
					collapseOnSelect: true,
					clearIcon: null
				};
				setColumns(updatedColumns);
			}
		}
	}, [getPlanTypeSuccess]);

	// Editable React data table
	const onEditStart = () => {
		inEdit = true;
		setConfigForgetColorSuccess(getColorSuccess);
	};

	const onEditStop = () => {
		requestAnimationFrame(() => {
			inEdit = false;
			gridRef.current.focus();
		});
	};

	const onKeyDown = async (event: any) => {
		const edited = await onTableKeyDown(event, inEdit, gridRef);
		if (
			tableRefSeq?.tenderLotComSeq &&
			(tableRefSeq?.tenderLotComSeq != 0 || tableRefSeq?.tenderLotComSeq > -1)
		) {
			if (edited && edited.colName === 'purity') {
				dispatch(puritiesActions.reset());

				dispatch(
					puritiesActions.get({
						QueryParams:
							edited.input.length !== 0
								? `columnType=purity&limit=10&q=` + edited.input
								: `columnType=purity&limit=10`
					})
				);
			}
			if (edited && edited.colName === 'fls') {
				dispatch(flssActions.reset());

				dispatch(
					flssActions.get({
						QueryParams:
							edited.input.length !== 0
								? `columnType=fls&limit=10&q=` + edited.input
								: `columnType=fls&limit=10`
					})
				);
			}
			if (edited && edited.colName === 'plan_type') {
				dispatch(tenderlotplansActions.reset());
				dispatch(tenderlotplansActions.getPlanType('PLAN_TYPE'));
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
						description: 'Are you sure delete assortment ?',
						cancellationButtonProps: { autoFocus: true },
						confirmationText: 'Yes',
						cancellationText: 'No'
					})
						.then(() => {
							let stateArr: any;
							if (
								pageState.values.para[rowIndex] &&
								pageState.values.para[rowIndex].pcs != null &&
								pageState.values.para[rowIndex].wgt != null &&
								pageState.values.para[rowIndex].seq_no < -1
							) {
								stateArr = pageState.values.para ? [...pageState.values.para] : [];
								stateArr[rowIndex].action = 'delete';
							} else {
								stateArr = deleteRow(pageState, 'seq_no', data, rowIndex);
							}
							return stateArr;
						})
						.then(stateArr => {
							setPageState(value => ({
								...value,
								values: {
									...pageState.values,
									para: stateArr //.filter((e: any) => e.action !== 'delete' && e.seq_no > -1)
								}
							}));

							data.splice(rowIndex, 1);
							setDataSource(data);
							setActiveCell([rowIndex - 1, 1]);
							let newRowIndex = rowIndex != 0 ? rowIndex - 1 : 0;
							tenderLotAssortSeq(data[newRowIndex]?.seq_no);
							setTimeout(() => {
								const column = grid.getColumnBy(1);
								grid.startEdit({
									columnId: column.name,
									rowIndex: newRowIndex
								});
							}, 0);
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
					let isLastEditableColumn = false;
					if (event.key === 'ArrowDown') {
						/* discussion to dharmeshbhai for arrow down*/
						event.key = 'Insert';
					}
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
					event.preventDefault();
					event.stopPropagation();
					const { insertNew, data, stateArr } = await insertNewRow(
						newPageState, // State for track row insert, update or delete
						FormSchema, // for validation
						newRowDataSource, // table data
						rowIndex, // row number
						isLastEditableColumn,
						event.key,
						{
							sr_no: rowCount + 1,
							tender_lot_det_seq: tableRefSeq?.lotSeq,
							tender_lot_comm_seq: tableRefSeq?.tenderLotComSeq
						}
					);

					event.preventDefault();
					if (insertNew) {
						// *** set table with new data
						tableRefSeq.tenderLotAssortSeq =
							stateArr[stateArr?.length > 0 ? stateArr?.length - 1 : 0].seq_no;
						handleRowSelect({
							data: stateArr[stateArr?.length > 0 ? stateArr?.length - 1 : 0]
						});
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
						}, 0);
					}
				}
			}
		} else {
			if (event.key === 'Insert' || event.key === 'ArrowDown') {
				dispatch(
					actions.openSnackbar({
						open: true,
						message: 'Please select commemt',
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

	const onEditComplete = useCallback(
		async ({ value, columnId, rowIndex }: any) => {
			if (value === '' || value === null || value || typeof value === 'boolean') {
				if (typeof value === 'string') {
					value = value.trim();
				}
				let aa = columns.filter((e: any) => e.name === columnId)[0].editorProps.type;
				if (aa == 'number' && value != '') {
					value = parseFloat(value);
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

				let dd = [...data];
				if (dd[rowIndex].wgt != '' && dd[rowIndex].pcs != '') {
					dd[rowIndex].size = (dd[rowIndex].wgt / dd[rowIndex].pcs).toString();
					stateArr[rowIndex].size = (
						stateArr[rowIndex].wgt / stateArr[rowIndex].pcs
					).toString();
				}
				// setDataSource(stateArr);
				setDataSource(data.filter((e: any) => e.action !== 'delete'));
				// setDataNewSource(stateArr);
			}
		},
		[dataSource]
	);

	const fetchDataByColumnName = (edited: any) => {
		if (edited) {
			if (edited.colName === 'color') {
				dispatch(colorsActions.reset());

				dispatch(
					colorsActions.get({
						QueryParams: 'page=1&limit=500&pagination=false&columnType=color'
					})
				);
			}
		}
	};
	const onFocus = async (event: any) => {
		let isValidForNewRow = newRowDataSource.length === 0 ? true : false;
		if (isValidForNewRow) {
			if (
				tableRefSeq?.tenderLotComSeq &&
				(tableRefSeq?.tenderLotComSeq != 0 || tableRefSeq?.tenderLotComSeq > -1)
			) {
				const { insertNew, data, stateArr } = await insertNewRow(
					pageState, // State for track row insert, update or delete
					FormSchema, // for validation
					newRowDataSource, // table data
					0, // row number
					true,
					'Focus',
					{
						sr_no: 1,
						tender_lot_det_seq: tableRefSeq?.lotSeq,
						tender_lot_comm_seq: tableRefSeq?.tenderLotComSeq
					}
				);

				event.preventDefault();
				if (insertNew) {
					// *** set table with new data
					tableRefSeq.tenderLotAssortSeq =
						stateArr[stateArr?.length > 0 ? stateArr?.length - 1 : 0].seq_no;
					handleRowSelect({
						data: stateArr[stateArr?.length > 0 ? stateArr?.length - 1 : 0]
					});
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
					// setActiveCell([data.length - 1, 1]);
					setFocusActiveCell(1);
				}
			} else {
				dispatch(
					actions.openSnackbar({
						open: true,
						message: 'Please select commemt',
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
		currentFocus(3);
	};
	return (
		<MainCard content={false} tabIndex={-1}>
			<FormContainer formContext={formContext}>
				<ReactDataGrid
					handle={setGridRef}
					idProperty="seq_no"
					nativeScroll={true}
					style={gridStyle}
					keyPageStep={0}
					// enableSelection={enableSelection}
					activeCell={activeCell}
					onActiveCellChange={setActiveCell}
					onKeyDown={onKeyDown}
					onEditComplete={onEditComplete}
					onEditStart={onEditStart}
					onEditStop={onEditStop}
					editable={true}
					columns={columns}
					dataSource={dataSource}
					onFocus={onFocus}
					rowHeight={21}
					headerHeight={10}
					onRowClick={(e: any) => handleRowSelect(e)}
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
					summaryReducer={summaryReducer}
					footerRows={footerRows}
					showColumnMenuTool={false}
					showZebraRows={false}
				/>
				<button type="submit" hidden />
			</FormContainer>
		</MainCard>
	);
};

export default TenderLotAssortment;
