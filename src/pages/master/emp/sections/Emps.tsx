import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Grid, Stack } from '@mui/material';

import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { CheckBoxEditor, TextFieldEditor } from '@components/table/editors';
import { IFormInput } from '@pages/master/emp/models/Emps';
import { empsActions, useEmpsSlice } from '@pages/master/emp/store/slice';
import { empsSelector } from '@pages/master/emp/store/slice/emps.selectors';
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

// ==============================|| EMPS ||============================== //

interface Props {
	passProps?: any;
	handleDrawerToggle?: any;
	edit?: boolean;
	selectedData?: any;
	setEnableButton1?: any;
}

const Emps = ({ passProps, selectedData, handleDrawerToggle, setEnableButton1 }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: partiesActions } = useEmpsSlice();
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

	const handleRowSelect = useCallback((rowData: any, event?: any) => {
		setSelectedRow(rowData.data);
		if (event.detail == 2) {
			buttonRef.current.click();
		}
	}, []);

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// *** Emps State *** //
	const empsState = useSelector(empsSelector);
	const { getSuccess } = empsState;

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
				name: 'name',
				header: 'Name',
				sortable: false
			},
			{
				name: 'legal_name',
				header: 'Legal Name',
				sortable: false
			},
			{
				name: 'short_name',
				header: 'Short Name',
				sortable: false
			},
			{
				name: 'type',
				header: 'Type',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					maxLength: 5
				}
			},
			{
				name: 'address_1',
				header: 'Address 1',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					maxLength: 5
				}
			},
			{
				name: 'address_2',
				header: 'Address 2',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					maxLength: 5
				}
			},
			{
				name: 'address_3',
				header: 'Address 3',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					maxLength: 5
				}
			},
			{
				name: 'city.name',
				header: 'City',
				sortable: false
			},
			{
				name: 'pin_code',
				header: 'Pin Code ',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					maxLength: 5
				}
			},
			{
				name: 'phone_no_1',
				header: 'Phone No 1 ',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					maxLength: 5
				}
			},
			{
				name: 'phone_no_2',
				header: 'Phone No 2 ',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					maxLength: 5
				}
			},
			{
				name: 'mobile_no_1',
				header: 'Mobile No 1 ',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					maxLength: 5
				}
			},
			{
				name: 'mobile_no_2',
				header: 'Mobile No 2 ',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number',
					maxLength: 5
				}
			},
			{
				name: 'pan_no',
				header: 'Pan No ',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					maxLength: 5
				}
			},
			{
				name: 'gst_no',
				header: 'Gst No ',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					maxLength: 5
				}
			},
			{
				name: 'vat_no',
				header: 'Vat No ',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					maxLength: 5
				}
			},
			{
				name: 'tax_no',
				header: 'Tax No ',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					maxLength: 5
				}
			},
			{
				name: 'email_id_1',
				header: 'Email Id',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					maxLength: 5
				}
			},
			{
				name: 'join_date',
				header: 'Join Date',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					maxLength: 5
				}
			},
			{
				name: 'leave_date',
				header: 'Leave Date',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text',
					maxLength: 5
				}
			},
			{
				name: 'sort_no',
				header: 'Sort No',
				width: 80,
				type: 'number',
				headerAlign: 'center',
				textAlign: 'center',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				}
			},
			{
				name: 'is_active',
				header: 'Active',
				skipNavigation: true,
				headerAlign: 'center',
				textAlign: 'center',
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <CheckBoxEditor {...editorProps} />;
				},
				editorProps: {},
				render: ({ value }: any) => {
					return <Checkbox checked={value} style={{ backgroundColor: 'transparent' }} />;
				}
			},

			{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
		];
	};

	const [gridRef] = useState<any>(null); // setGridRef
	const refPage = useHotkeys<any>('Enter', () => buttonRef.current.click());

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());

	console.log(setColumns);
	useEffect(() => {
		const queryStirng = ObjecttoQueryString(initParams);
		dispatch(empsActions.get({ QueryParams: queryStirng }));
		return () => {
			dispatch(empsActions.reset());
		};
	}, []);

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
			if (!getSuccess?.columnType || getSuccess?.columnType === null) {
				if (getSuccess?.results && getSuccess?.results.length > 0) {
					setDataSource(getSuccess?.results);
				} else {
					setDataSource([]);
				}
			}
		}
	}, [getSuccess]);

	// *** EVENT HANDDLERS  👿

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

			dispatch(partiesActions.get({ QueryParams: queryStirng }));
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
export default Emps;
