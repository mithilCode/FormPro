import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Stack, Typography } from '@mui/material';

import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
// import { CheckBoxEditor, TextFieldEditor } from '@components/table/editors';
import { IFormInput } from '@pages/master/kapan/models/Kapans';
import { kapansActions, useKapansSlice } from '@pages/master/kapan/store/slice';
import { kapansSelector } from '@pages/master/kapan/store/slice/kapans.selectors';
import {
	InitialQueryParam,
	InitialState,
	ObjecttoQueryString,
	fetchTabelDataObject
} from '@utils/helpers';

import '@inovua/reactdatagrid-community/index.css';
import { Button } from '@mui/material';
import { InfiniteDataGrid } from '@components/table';
import { AutocompleteEditor } from '@components/table/editors';

let initialFocus = false;

const initParams = {
	page: 1,
	limit: 11,
	pagination: 'true'
} as InitialQueryParam;

// ==============================|| 	KAPANS ||============================== //

interface Props {
	passProps?: any;
	handleDrawerToggle?: any;
	edit?: boolean;
	// selectedData?: any;
	setEnableButton1?: any;
}

const Kapans = ({ passProps, handleDrawerToggle, setEnableButton1 }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: kapansActions } = useKapansSlice();
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
	console.log(setPageState);

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	const handleRowSelect = useCallback((rowData: any, event: any) => {
		setSelectedRow(rowData.data);
		if (event.detail == 2) {
			buttonRef.current.click();
		}
	}, []);

	// *** kapan State *** //
	const kapansState = useSelector(kapansSelector);
	const { getSuccess } = kapansState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		// resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		// formState: { isSubmitting },
		// reset
	} = formContext;

	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'invoice_no',
				header: 'Invoice No',
				sortable: false,
				minWidth: 30,
				maxWidth: 70
			},
			{
				name: 'kapan_no',
				header: 'Kapan No',
				sortable: false,
				minWidth: 30,
				maxWidth: 70
			},
			{
				name: 'group_name',
				header: 'Group Name',
				sortable: false,
				minWidth: 30,
				maxWidth: 90
			},
			{
				name: 'trans_date',
				header: 'Create Date',
				sortable: false,
				minWidth: 30,
				maxWidth: 140
			},
			{
				name: 'pcs',
				header: 'Pieces',
				sortable: false,
				minWidth: 30,
				maxWidth: 70
			},
			{
				name: 'wgt',
				header: 'Weights',
				sortable: false,
				minWidth: 30,
				maxWidth: 70
			},
			{
				name: 'rate',
				header: 'Rate',
				sortable: false,
				minWidth: 30,
				maxWidth: 70
			},
			{
				name: 'value',
				header: 'Value',
				sortable: false,
				minWidth: 30,
				maxWidth: 70
			},
			{
				name: 'from_name',
				header: 'Supplier Name',
				sortable: false
			},

			{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
		];
	};

	// const confirm = useConfirm();
	const [gridRef] = useState<any>(null); // setGridRef

	const refPage = useHotkeys<any>('Enter', () => buttonRef.current.click());

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());

	useEffect(() => {
		const queryStirng = ObjecttoQueryString(initParams);
		dispatch(kapansActions.get({ QueryParams: queryStirng }));
		return () => {
			dispatch(kapansActions.reset());
		};
	}, []);

	useEffect(() => {
		if (getSuccess) {
			if (getSuccess?.results && getSuccess?.results.length > 0) {
				setDataSource(getSuccess?.results);
			} else {
				setDataSource([]);
			}
		}
	}, [getSuccess]);

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

	const onSubmit = async () => {
		/* empty */
	};

	const handleView = () => {
		passProps(selectedRow);
		handleDrawerToggle(false);
		setEnableButton1(false);
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

			dispatch(kapansActions.get({ QueryParams: queryStirng }));
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
								<MainCard content={false} tabIndex="0">
									<InfiniteDataGrid
										initParams={initParams}
										columns={columns}
										dataSource={dataSource}
										onTableDataChange={onTableDataChange}
										onRowClick={(e: any, event: any) =>
											handleRowSelect(e, event)
										}
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
								onClick={handleView}
								disableElevation
								type="submit"
								variant="contained"
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

export default Kapans;
