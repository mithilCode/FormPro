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
// *** COUNTRY *** //
import { useCountrySlice } from '@pages/master/countries/store/slice';
import { countrySelector } from '@pages/master/countries/store/slice/country.selectors';
// *** HELPER *** //
import { fetchTabelDataObject, InitialQueryParam, ObjecttoQueryString } from '@utils/helpers';

import Country from '../Country';

const initParams = {
	page: 1,
	limit: 10,
	sortBy: [],
	filterBy: [],
	pagination: 'true'
} as InitialQueryParam;

// ==============================|| COUNTRIES ||============================== //

const Countries = () => {
	// *** add your Dispatch 👿
	const dispatch = useDispatch();

	// *** add your Slice Action  👿
	const { actions: countryActions } = useCountrySlice();
	const { actions } = useSnackBarSlice();

	// *** add your Slice Selector  👿

	const countryState = useSelector(countrySelector);
	const {
		getError: getCountryError,
		getSuccess: getCountrySuccess,
		deleteError,
		deleteSuccess
	} = countryState;

	// *** add your States  👿
	const [selectedData, setSelectedData] = useState<any>('');
	const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false);

	const [countryLoading, setCountryLoading] = useState<boolean>(false);
	const [countryOptions, setCountryOptions] = useState<any>([]);

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
			id: 'short_name',
			name: 'short_name',
			header: 'Short Name'
		},
		{ id: 'code', name: 'code', header: 'Code', sortable: false },
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
		{ name: 'short_name', type: 'string', operator: 'contains', value: '' }
	];

	// *** add your useEffect ( Order must be empty dependancy first, ... , success, error)  👿

	useEffect(() => {
		return () => {
			dispatch(countryActions.reset());
		};
	}, []);

	// Country response (eighter success or error)

	useEffect(() => {
		if (getCountrySuccess) {
			console.log('COUTRY Loading', countryLoading);
			if (getCountrySuccess?.results) {
				const promise = new Promise(resolve => {
					return resolve({
						data: getCountrySuccess?.results,
						count: Math.ceil(getCountrySuccess?.meta.totalItems)
					});
				});

				setCountryOptions(promise);
			} else {
				setCountryOptions([]);
			}
		}

		if (getCountryError) {
			/* empty */
		}
		setCountryLoading(false);
	}, [getCountrySuccess]);

	useEffect(() => {
		if (deleteError || deleteSuccess) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: deleteError
						? 'Error while deleting country.'
						: 'Country delete successfully.',
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

		dispatch(countryActions.get({ QueryParams: queryStirng }));
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

			dispatch(countryActions.get({ QueryParams: queryStirng }));
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
		confirm({ description: 'Do you want to delete state?' })
			.then(() => {
				dispatch(countryActions.delete(rowObj));
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
		<div ref={refPage as any} tabIndex={-1}>
			<MainCard
				content={false}
				title=" "
				secondary={
					<Button
						ref={addButtonRef}
						variant="contained"
						startIcon={<PlusOutlined />}
						onClick={handleAdd}>
						Add Country
					</Button>
				}>
				<InfiniteDataGridStatic
					initParams={initParams}
					columns={columns}
					dataSource={countryOptions}
					onTableDataChange={onTableDataChange}
					defaultFilterValue={defaultFilterValue}
					rowHeight={25}
					showColumnMenuTool={false}
				/>
			</MainCard>

			{openAddDrawer && (
				<InfiniteDrawer
					title={selectedData && selectedData.Name ? selectedData.Name : 'Country'}
					width={20}
					component={Country}
					handleDrawerToggle={handleDrawerToggle}
					passProps={childProps}
					edit={selectedData ? true : false}
					selectedData={selectedData}
				/>
			)}
		</div>
	);
};

export default Countries;
