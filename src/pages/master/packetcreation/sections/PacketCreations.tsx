import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Stack } from '@mui/material';

import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
// import { CheckBoxEditor, TextFieldEditor } from '@components/table/editors';
import { IFormInput } from '@pages/master/packetcreation/models/PacketCreation';
import { usePacketcreationsSlice } from '@pages/master/packetcreation/store/slice';
import { packetcreationsSelector } from '@pages/master/packetcreation/store/slice/packetcreations.selectors';
import {
	InitialQueryParam,
	InitialState,
	ObjecttoQueryString,
	fetchTabelDataObject
} from '@utils/helpers';

import '@inovua/reactdatagrid-community/index.css';
import { Button } from '@mui/material';
import { InfiniteDataGrid } from '@components/table';

let initialFocus = false;

const initParams = {
	page: 1,
	limit: 10000,
	pagination: 'true'
} as InitialQueryParam;

// ==============================|| PACKETCREATIONS ||============================== //

interface Props {
	passProps?: any;
	handleDrawerToggle?: any;
	edit?: boolean;
	// selectedData?: any;
	setEnableButton1?: any;
}

const PacketCreations = ({ passProps, handleDrawerToggle, setEnableButton1 }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: packetcreationsActions } = usePacketcreationsSlice();
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

	// *** packetcreation State *** //
	const packetcreationsState = useSelector(packetcreationsSelector);
	const { getSuccess } = packetcreationsState;

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
				name: 'inv_type',
				header: 'Department Name',
				sortable: false
			},
			{
				name: 'pcs',
				header: 'Pieces',
				sortable: false
			},
			{
				name: 'wgt',
				header: 'Weight',
				sortable: false
			},
			{
				name: 'rate',
				header: 'Rate',
				sortable: false
			},
			{
				name: 'value',
				header: 'Value',
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
		dispatch(packetcreationsActions.get({ QueryParams: queryStirng }));
		return () => {
			dispatch(packetcreationsActions.reset());
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
		if (getSuccess) {
			if (getSuccess?.columnType === 'disc_seq') {
				let flsData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'disc'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					flsData = getSuccess?.results;
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
			} else if (getSuccess?.columnType === 'price_seq') {
				let flsData = [];

				// Update Editable column datasource
				const updatedColumns = [...columns];

				const editorTypeColumnIndex = updatedColumns.findIndex(
					column => column.name === 'price'
				);

				if (getSuccess?.results && getSuccess?.results.length > 0) {
					flsData = getSuccess?.results;
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
			} else if (!getSuccess?.columnType || getSuccess?.columnType === null) {
				if (getSuccess?.results && getSuccess?.results.length > 0) {
					setDataSource(getSuccess?.results);
				} else {
					setDataSource([]);
				}
			}
		}
	}, [getSuccess]);

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

			dispatch(packetcreationsActions.get({ QueryParams: queryStirng }));
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

export default PacketCreations;
