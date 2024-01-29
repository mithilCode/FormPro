import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button, IconButton } from '@mui/material';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import { useConfirm } from 'material-ui-confirm';

import { useSnackBarSlice } from '@app/store/slice/snackbar';
import { InfiniteDrawer } from '@components/drawer';
import MainCard from '@components/MainCard';
import { InfiniteDataGridStatic } from '@components/table';
// *** CITY *** //
import { useCitySlice } from '@pages/master/cities/store/slice';
import { citySelector } from '@pages/master/cities/store/slice/city.selectors';
// *** HELPER *** //
import { fetchTabelDataObject, InitialQueryParam, ObjecttoQueryString } from '@utils/helpers';

import City from '../City';

const initParams = {
	page: 1,
	limit: 10,
	sortBy: [],
	filterBy: [],
	pagination: 'true'
} as InitialQueryParam;

// ==============================|| CITIES ||============================== //

const Cities = () => {
	// *** add your Dispatch 👿
	const dispatch = useDispatch();

	// *** add your Slice Action  👿
	const { actions: cityActions } = useCitySlice();
	const { actions } = useSnackBarSlice();

	// *** add your Slice Selector  👿

	const cityState = useSelector(citySelector);
	const {
		getError: getCityError,
		getSuccess: getCitySuccess,
		deleteError,
		deleteSuccess
	} = cityState;

	// *** add your CITIES  👿
	const [selectedData, setSelectedData] = useState<any>('');
	const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false);

	const [cityLoading, setCityLoading] = useState<boolean>(false);
	const [cityOptions, setCityOptions] = useState<any>([]);

	// Confirmation Dialog box
	const confirm = useConfirm();

	// add your refrence  👿
	const fetchIdRef = useRef(0);

	// refrence for button shortkey
	const addButtonRef = useRef<any>(null);

	// hotkey for button shortkey
	let refPage = [useHotkeys<any>('alt+a', () => addButtonRef.current.click())];

	// *** REACT DATA GRID COLUMNS 👿

	const columns = [
		{ id: 'seq_no', name: 'seq_no', header: 'Id', defaultVisible: false },
		{ id: 'name', name: 'name', header: 'Name' },
		{
			id: 'state',
			name: 'state',
			header: 'State',
			sortable: false,
			render: ({ data }: any) => {
				return <span>{data.state.name}</span>;
			}
		},
		{
			id: 'country',
			name: 'country',
			header: 'Country',
			sortable: false,
			render: ({ data }: any) => {
				return <span>{data.country.name}</span>;
			}
		},
		{ id: 'short_name', name: 'short_name', header: 'Short Name' },
		{ id: 'code', name: 'code', header: 'Code' },
		{ id: 'sort_no', name: 'sort_no', header: 'Sort No.', width: 100 },
		{
			name: 'action',
			header: 'Action',
			sortable: false,
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

	// *** REACT DATA GRID FILTERS

	const defaultFilterValue = [
		{ name: 'name', type: 'string', operator: 'contains', value: '' },
		{ name: 'state', type: 'string', operator: 'contains', value: '' },
		{ name: 'country', type: 'string', operator: 'contains', value: '' }
	];

	// *** add your useEffect ( Order must be empty dependancy first, ... , success, error)  👿

	useEffect(() => {
		return () => {
			dispatch(cityActions.reset());
		};
	}, []);

	// City response (eighter success or error)

	useEffect(() => {
		if (getCitySuccess) {
			console.log('CITY Loading', cityLoading);
			if (getCitySuccess?.results) {
				const promise = new Promise(resolve => {
					return resolve({
						data: getCitySuccess?.results,
						count: Math.ceil(getCitySuccess?.meta.totalItems)
					});
				});

				setCityOptions(promise);
			} else {
				setCityOptions([]);
			}
		}
		if (getCityError) {
		}
		setCityLoading(false);
	}, [getCitySuccess]);

	useEffect(() => {
		if (deleteError || deleteSuccess) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: deleteError
						? 'Error while deleting city.'
						: 'City delete successfully.',
					variant: 'alert',
					alert: {
						color: deleteError ? 'error' : 'success'
					},
					close: false,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'right'
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

		dispatch(cityActions.get({ QueryParams: queryStirng }));
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

			dispatch(cityActions.get({ QueryParams: queryStirng }));
		}
	}, []);

	const childProps = (obj: { type: string; data: object }) => {
		console.log(obj);
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
		confirm({ description: 'Do you want to delete city?' })
			.then(() => {
				dispatch(cityActions.delete(rowObj));
			})
			.catch(() => {});
	};

	const handleDrawerToggle = () => {
		setOpenAddDrawer(!openAddDrawer);
		setSelectedData(null);
	};

	return (
		<div ref={refPage as any} tabIndex={-1} style={{ outline: 'none' }}>
			<MainCard
				content={false}
				title=" "
				secondary={
					<Button
						ref={addButtonRef}
						variant="contained"
						startIcon={<PlusOutlined />}
						onClick={handleAdd}>
						Add City
					</Button>
				}>
				<InfiniteDataGridStatic
					initParams={initParams}
					columns={columns}
					dataSource={cityOptions}
					onTableDataChange={onTableDataChange}
					defaultFilterValue={defaultFilterValue}
					rowHeight={25}
					showColumnMenuTool={false}
				/>
			</MainCard>

			{openAddDrawer && (
				<InfiniteDrawer
					title={selectedData && selectedData.name ? selectedData.name : 'City'}
					width={20}
					component={City}
					handleDrawerToggle={handleDrawerToggle}
					passProps={childProps}
					edit={selectedData ? true : false}
					selectedData={selectedData}
				/>
			)}
		</div>
	);
};

export default Cities;
