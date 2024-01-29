import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Stack } from '@mui/material';

import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { IFormInput } from '@pages/master/tenderlotimport/models/TenderLotImport';
import { useTenderlotimportsSlice } from '@pages/master/tenderlotimport/store/slice';
import { tenderlotimportsSelector } from '@pages/master/tenderlotimport/store/slice/tenderlotimports.selectors';
import {
	InitialQueryParam,
	InitialState,
	ObjecttoQueryString,
	fetchTabelDataObject
} from '@utils/helpers';

import '@inovua/reactdatagrid-community/index.css';
import { Button } from '@mui/material';
import { InfiniteDataGridStatic } from '@components/table';
import { TextFieldEditor } from '@components/table/editors';

let initialFocus = false;

const initParams = {
	page: 1,
	limit: 10000,
	pagination: 'true'
} as InitialQueryParam;

const gridStyle = { height: '400px' };

// ==============================|| TenderLotImports ||============================== //

interface Props {
	passProps?: any;
	handleDrawerToggle?: any;
	edit?: boolean;
	selectedData?: any;
	setSaveButton?: any;
	setEditButton?: any;
	setDeleteButton?: any;
}

const TenderLotImports = ({
	passProps,
	selectedData,
	handleDrawerToggle,
	setSaveButton,
	setDeleteButton,
	setEditButton
}: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: tenderlotimportsActions } = useTenderlotimportsSlice();
	// const { actions } = useSnackBarSlice();

	const [selectedRow, setSelectedRow] = useState<any>(null);
	// add your States  👿
	const [, setPageState] = useState<InitialState>({
		// pageState
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});

	const handleRowSelect = useCallback((rowData: any) => {
		setSelectedRow(rowData.data);
	}, []);

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// *** TenderLotImport State *** //
	const tenderlotimportsState = useSelector(tenderlotimportsSelector);
	const { getViewSuccess } = tenderlotimportsState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		// resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		// formState: { isSubmitting },
		reset
	} = formContext;

	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'tender_no',
				header: 'Tender No.',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'trans_date',
				header: 'Trans Date',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'pcs',
				header: 'Pcs',
				sortable: false,
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
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'tender_description',
				header: 'Tender Description',
				sortable: false,
				width: 450,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},

			{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
		];
	};

	useEffect(() => {
		if (selectedData) {
			setPageState(pageState => ({
				...pageState,
				values: {
					...pageState.values,
					address_type: selectedData,
					data: selectedData
				}
			}));

			reset(selectedData);
		}
	}, [selectedData]);
	// const confirm = useConfirm();
	const [gridRef] = useState<any>(null); // setGridRef

	const refPage = useHotkeys<any>('Enter', () => buttonRef.current.click());

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());

	useEffect(() => {
		const queryStirng = ObjecttoQueryString(initParams);
		dispatch(tenderlotimportsActions.get({ QueryParams: queryStirng }));
		return () => {
			dispatch(tenderlotimportsActions.reset());
		};
	}, []);

	useEffect(() => {
		// newRowDataSource = dataSource;
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
		if (getViewSuccess) {
			if (getViewSuccess?.columnType === 'disc_seq') {
				let flsData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'disc'
				);

				if (getViewSuccess?.results && getViewSuccess?.results.length > 0) {
					flsData = getViewSuccess?.results;
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
			} else if (getViewSuccess?.columnType === 'price_seq') {
				let flsData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'price'
				);

				if (getViewSuccess?.results && getViewSuccess?.results.length > 0) {
					flsData = getViewSuccess?.results;
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
			} else if (!getViewSuccess?.columnType || getViewSuccess?.columnType === null) {
				if (getViewSuccess?.results && getViewSuccess?.results.length > 0) {
					setDataSource(getViewSuccess?.results);
				} else {
					setDataSource([]);
				}
			}
		}
	}, [getViewSuccess]);

	const onSubmit = async () => {
		/* empty */
	};

	const handleView = () => {
		passProps(selectedRow);
		handleDrawerToggle(false);
		// setSaveButton(false);
		setEditButton(false);
		setDeleteButton(false);
	};

	const onTableDataChange = useCallback((values: any) => {
		const obj = fetchTabelDataObject(initParams, values);
		fetchData(obj);
	}, []);

	const fetchIdRef = useRef(0);
	const fetchData = useCallback(({ pageSize, pageIndex, sortInfo, filterValue }: any) => {
		const fetchId = ++fetchIdRef.current;

		// Only update the data if this is the latest fetch
		if (fetchId === fetchIdRef.current) {
			initParams.page = pageIndex;
			initParams.limit = pageSize;
			if (sortInfo && sortInfo.length !== 0) {
				initParams.sortBy = sortInfo;
			} else {
				delete initParams.sortBy;
			}

			if (filterValue && filterValue.length !== 0) {
				initParams.filterBy = filterValue;
			} else {
				delete initParams.filterBy;
			}

			const queryParams = initParams;
			const queryStirng = ObjecttoQueryString(queryParams);

			dispatch(tenderlotimportsActions.getView({ QueryParams: queryStirng }));
		}
	}, []);

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
								<MainCard content={false} tabIndex="0" style={{ height: '500px' }}>
									<InfiniteDataGridStatic
										initParams={initParams}
										columns={columns}
										dataSource={dataSource}
										style={gridStyle}
										onTableDataChange={onTableDataChange}
										onRowClick={(e: any) => handleRowSelect(e)}
										rowHeight={21}
										headerHeight={22}
										showColumnMenuTool={false}
										showZebraRows={false}
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
								onClick={handleView}
								disableElevation
								type="submit"
								variant="contained"
								style={{ height: '30px' }}
								color="primary">
								View
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</MainCard>
		</>
	);
};

export default TenderLotImports;
