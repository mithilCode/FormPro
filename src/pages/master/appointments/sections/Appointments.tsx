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
import { useAppointmentSlice } from '@pages/master/appointments/store/slice';
import { appointmentSelector } from '@pages/master/appointments/store/slice/appointment.selectors';
// *** HELPER *** //
import {
	fetchTabelDataObject,
	InitialQueryParam,
	InitialState,
	ObjecttoQueryString
} from '@utils/helpers';

import Appointment from '../Appointment';
const gridStyle = { minHeight: 100 };

const initParams = {
	page: 1,
	limit: 10,
	sortBy: [],
	filterBy: [],
	pagination: 'true'
} as InitialQueryParam;

// ==============================|| APPOINTMENT ||============================== //

const Appointments = () => {
	// *** add your Dispatch 👿
	const dispatch = useDispatch();

	// *** add your Slice Action  👿
	const { actions: appointmentActions } = useAppointmentSlice();
	const { actions } = useSnackBarSlice();

	// *** add your Slice Selector  👿
	const appointmentState = useSelector(appointmentSelector);
	const {
		getError: getAppointmentError,
		getSuccess: getAppointmentSuccess,
		deleteError,
		deleteSuccess
	} = appointmentState;

	// *** add your States  👿
	const [selectedData, setSelectedData] = useState<any>('');
	const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false);
	const [appointmentLoading, setAppointmentLoading] = useState<boolean>(false);
	console.log(appointmentLoading);
	const [appointmentOptions, setAppointmentOptions] = useState<any>([]);

	// Confirmation Dialog box
	const confirm = useConfirm();

	// add your refrence  👿
	const fetchIdRef = useRef(0);

	// *** REACT DATA GRID COLUMNS 👿

	const columns = [
		{ id: 'seq_no', name: 'seq_no', header: 'Id', defaultVisible: false },
		{ id: 'tender_no', name: 'tender_no', header: 'Tender No', width: 85, sortable: false },
		{
			id: 'tender_name',
			name: 'tender_name',
			header: 'Tender Name',
			width: 120,
			sortable: false
		},
		{
			id: 'supplier',
			name: 'supplier',
			header: 'Supplier Name',
			width: 140
		},
		{
			id: 'attendee_1',
			name: 'attendee_1',
			header: 'Attendee 1',
			width: 130,
			render: ({ data }: any) => {
				return <span>{data.attendee_1.name}</span>;
			}
		},
		{
			id: 'attendee_2',
			name: 'attendee_2',
			header: 'Attendee 2',
			width: 130,
			render: ({ data }: any) => {
				return <span>{data.attendee_2.name}</span>;
			}
		},
		{
			id: 'attendee_3',
			name: 'attendee_3',
			header: 'Attendee 3',
			width: 130,
			render: ({ data }: any) => {
				return <span>{data.attendee_3.name}</span>;
			}
		},
		{
			id: 'attendee_4',
			name: 'attendee_4',
			header: 'Attendee 4',
			width: 130,
			render: ({ data }: any) => {
				return <span>{data.attendee_4.name}</span>;
			}
		},
		{ id: 'start_date', name: 'start_date', header: 'Start Date', width: 80, sortable: false },
		{ id: 'end_date', name: 'end_date', header: 'End Date', width: 80, sortable: false },
		{
			id: 'appointment_from_date',
			name: 'appointment_from_date',
			width: 80,
			renderHeader: (params: any) => {
				return (
					<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
						Appointment
						<br />
						From Date
					</div>
				);
			}
		},
		{
			id: 'appointment_to_date',
			name: 'appointment_to_date',
			width: 90,
			renderHeader: (params: any) => {
				return (
					<div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
						Appointment
						<br />
						To Date
					</div>
				);
			}
		},
		{
			name: 'action',
			width: 70,
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
			dispatch(appointmentActions.reset());
		};
	}, []);

	// State response (eighter success or error)
	useEffect(() => {
		if (getAppointmentSuccess) {
			if (getAppointmentSuccess?.results) {
				const formattedResults = getAppointmentSuccess.results.map((result: any) => {
					const {
						start_date,
						end_date,
						appointment_from_date,
						appointment_to_date,
						...rest
					} = result;
					return {
						...rest,
						start_date: formatDate(start_date),
						end_date: formatDate(end_date),
						appointment_from_date: appointment_from_date
							? formatDate(appointment_from_date)
							: null,
						appointment_to_date: appointment_to_date
							? formatDate(appointment_to_date)
							: null
					};
				});

				setAppointmentOptions(formattedResults);
			} else {
				setAppointmentOptions([]);
				setAppointmentLoading(false);
			}
		}
		if (getAppointmentError) {
			// Handle the error
		}
	}, [getAppointmentSuccess, getAppointmentError]);

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
						? 'Error while deleting appointment.'
						: 'Appointment delete successfully.',
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

		dispatch(appointmentActions.get({ QueryParams: queryStirng }));
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

			dispatch(appointmentActions.get({ QueryParams: queryStirng }));
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
		confirm({ description: 'Do you want to delete appointment?' })
			.then(() => {
				dispatch(appointmentActions.delete(rowObj));
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
						className="custom-button"
						variant="contained"
						style={{ width: '170px' }}
						startIcon={<PlusOutlined />}
						onClick={handleAdd}>
						Add Appointment
					</Button>
				}>
				<InfiniteDataGrid
					initParams={initParams}
					columns={columns}
					dataSource={appointmentOptions}
					onTableDataChange={onTableDataChange}
					rowHeight={21}
					showColumnMenuTool={false}
					style={gridStyle}
					showZebraRows={false}
				/>
			</MainCard>

			{openAddDrawer && (
				<InfiniteDrawer
					title={selectedData && selectedData.name ? selectedData.name : 'Appointment'}
					width={50}
					component={Appointment}
					handleDrawerToggle={handleDrawerToggle}
					passProps={childProps}
					edit={selectedData ? true : false}
					selectedData={selectedData}
				/>
			)}
		</>
	);
};

export default Appointments;
