import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton } from '@mui/material';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useConfirm } from 'material-ui-confirm';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { InfiniteDrawer } from '@components/drawer';
import MainCard from '@components/MainCard';
import { InfiniteDataGrid } from '@components/table';

// *** STATE *** //
import { useTenderSlice } from '@pages/master/tenders/store/slice';
import { tenderSelector } from '@pages/master/tenders/store/slice/tender.selectors';
// *** HELPER *** //
import { fetchTabelDataObject, InitialQueryParam, ObjecttoQueryString } from '@utils/helpers';
import Tender from '../Tender';

const initParams = {
	page: 1,
	limit: 10,
	sortBy: [],
	filterBy: [],
	pagination: 'true'
} as InitialQueryParam;

// ==============================|| TENDER ||============================== //

const Tenders = () => {
	// *** add your Dispatch 👿
	const dispatch = useDispatch();

	// *** add your Slice Action  👿
	const { actions: tenderActions } = useTenderSlice();
	const { actions } = useSnackBarSlice();

	// *** add your Slice Selector  👿

	const tenderState = useSelector(tenderSelector);
	const {
		getError: getTenderError,
		getSuccess: getTenderSuccess,
		deleteError,
		deleteSuccess
	} = tenderState;

	// *** add your States  👿
	const [selectedData, setSelectedData] = useState<any>('');
	const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false);
	const [tenderOptions, setTenderOptions] = useState<any>([]);

	// Confirmation Dialog box
	const confirm = useConfirm();

	// add your refrence  👿
	const fetchIdRef = useRef(0);

	// *** REACT DATA GRID COLUMNS 👿
	const columns = [
		{ id: 'seq_no', name: 'seq_no', header: 'Id', defaultVisible: false },
		{ id: 'tender_no', name: 'tender_no', header: 'Tender No', width: 100 },
		{
			id: 'tender_type',
			name: 'tender_type',
			header: 'Tender Type',
			width: 100,
			sortable: false
		},
		{ id: 'tender_name', name: 'tender_name', header: 'Tender Name', width: 140 },
		{ id: 'start_date', name: 'start_date', header: 'Start Date', width: 80, sortable: false },
		{ id: 'end_date', name: 'end_date', header: 'End Date', width: 80, sortable: false },
		{
			id: 'result_only_date',
			name: 'result_only_date',
			header: 'Result Date',
			width: 80,
			sortable: false
		},
		{
			id: 'result_only_time',
			name: 'result_only_time',
			header: 'Result Time',
			width: 80,
			sortable: false
		},
		{
			id: 'local_result_only_date',
			name: 'local_result_only_date',
			header: 'Local Date',
			width: 80,
			sortable: false
		},
		{
			id: 'local_result_only_time',
			name: 'local_result_only_time',
			header: 'Local Time',
			width: 80,
			sortable: false
		},
		{
			name: 'action',
			width: 90,
			sortable: false,
			header: 'Action',
			render: ({ data }: any) => {
				return (
					<div className="flex items-center">
						<IconButton
							size="medium"
							onClick={ev => {
								ev.stopPropagation();
								onEditClick(data);
							}}>
							<EditOutlined />
						</IconButton>

						<IconButton
							size="medium"
							onClick={ev => {
								ev.stopPropagation();
								onDeleteClick(data);
							}}>
							<DeleteOutlined />
						</IconButton>
					</div>
				);
			}
		}
	];

	// *** add your useEffect ( Order must be empty dependancy first, ... , success, error)  👿
	useEffect(() => {
		return () => {
			dispatch(tenderActions.reset());
		};
	}, []);

	// *** REDUCER *** //

	useEffect(() => {
		if (getTenderSuccess) {
			if (getTenderSuccess?.results) {
				const formattedResults = getTenderSuccess.results.map((result: any) => {
					const {
						start_date,
						end_date,
						result_only_date,
						local_result_only_date,
						...rest
					} = result;
					return {
						...rest,
						start_date: formatDate(start_date),
						end_date: formatDate(end_date),
						result_only_date: result_only_date ? formatDate(result_only_date) : null,
						local_result_only_date: local_result_only_date
							? formatDate(local_result_only_date)
							: null
					};
				});

				setTenderOptions(formattedResults);
			} else {
				setTenderOptions([]);
			}
		}

		if (getTenderError) {
			// Handle error
		}
	}, [getTenderSuccess]);

	// Function to format the date
	const formatDate = (dateString: any) => {
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();

		return `${day}-${month}-${year}`;
	};

	useEffect(() => {
		if (deleteError || deleteSuccess) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: deleteError
						? 'Error while deleting tender.'
						: 'Tender delete successfully.',
					variant: 'alert',
					alert: {
						color: deleteError ? 'error' : 'success'
					},
					close: false,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					}
				})
			);
			if (deleteSuccess) {
				getData(initParams);
			}
		}
	}, [deleteError, deleteSuccess]);

	// *** React Data Grid useCallBack  👿

	const onTableDataChange = useCallback((values: any) => {
		const obj = fetchTabelDataObject(initParams, values);
		fetchData(obj);
	}, []);

	const getData = async (obj: any) => {
		const queryParams = obj;
		const queryStirng = ObjecttoQueryString(queryParams);

		dispatch(tenderActions.get({ QueryParams: queryStirng }));
	};

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

			dispatch(tenderActions.get({ QueryParams: queryStirng }));
		}
	}, []);

	const childProps = (obj: { type: string; data: object }) => {
		getData(initParams);
	};

	// *** EVENT HANDDLERS  👿

	const handleAdd = () => {
		setOpenAddDrawer(true);
	};

	const onEditClick = (rowObj: any) => {
		setSelectedData(rowObj);
		setOpenAddDrawer(true);
	};

	const onDeleteClick = (rowObj: any) => {
		confirm({ description: 'Do you want to delete tender?' })
			.then(() => {
				dispatch(tenderActions.delete(rowObj));
			})
			.catch(() => {
				/* */
			});
	};

	const handleDrawerToggle = () => {
		setOpenAddDrawer(!openAddDrawer);
		setSelectedData(null);
	};

	return (
		<>
			<MainCard
				content={false}
				title=" "
				secondary={
					<Button
						variant="contained"
						className="custom-button"
						style={{ width: '140px' }}
						startIcon={<PlusOutlined />}
						onClick={handleAdd}>
						Add Tender
					</Button>
				}>
				<InfiniteDataGrid
					initParams={initParams}
					columns={columns}
					dataSource={tenderOptions}
					onTableDataChange={onTableDataChange}
					rowHeight={21}
					headerHeight={22}
					showColumnMenuTool={false}
					showZebraRows={false}
				/>
			</MainCard>

			{openAddDrawer && (
				<InfiniteDrawer
					title={selectedData && selectedData.name ? selectedData.name : 'Tender'}
					width={50}
					component={Tender}
					handleDrawerToggle={handleDrawerToggle}
					passProps={childProps}
					edit={selectedData ? true : false}
					selectedData={selectedData}
				/>
			)}
		</>
	);
};

export default Tenders;
