import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	FilterOptionsState,
	Grid,
	Stack,
	Typography,
	createFilterOptions
} from '@mui/material';
import Button from '@mui/material/Button';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import MainCard from '@components/MainCard';
import { AutocompleteElement, FormContainer } from '@components/rhfmui';
import { TextFieldEditor } from '@components/table/editors';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { FormSchema, IFormInput } from '@pages/master/rapaport/models/Rapaports';
import { useRapaportsSlice } from '@pages/master/rapaport/store/slice';
import { rapaportsSelector } from '@pages/master/rapaport/store/slice/rapaports.selectors';
import '@inovua/reactdatagrid-community/index.css';
import { InitialQueryParam, fetchTabelDataObject } from '@utils/helpers';

import '@pages/master/party/sections/party.css';

const gridStyle = { minHeight: 470 };

let rapaportSeqNo = 0;

// ==============================|| RAPAPORTS ||============================== //

const getColumns = () => {
	return [
		{ name: 'seq_no', header: 'seq_no', defaultVisible: false, minWidth: 100 },
		{
			name: 'shape',
			header: 'Shape',
			defaultFlex: 1,
			sortable: false,
			editable: false,
			renderEditor: (editorProps: any) => {
				return <TextFieldEditor {...editorProps} />;
			},
			editorProps: {
				type: 'text'
			}
		},
		{
			name: 'color',
			header: 'Color',
			defaultFlex: 1,
			sortable: false,
			editable: false,
			renderEditor: (editorProps: any) => {
				return <TextFieldEditor {...editorProps} />;
			},
			editorProps: {
				type: 'text'
			}
		},
		{
			name: 'purity',
			header: 'Purity',
			defaultFlex: 1,
			sortable: false,
			editable: false,
			renderEditor: (editorProps: any) => {
				return <TextFieldEditor {...editorProps} />;
			},
			editorProps: {
				type: 'text'
			}
		},
		{
			name: 'from_wgt',
			header: 'From Wgt',
			defaultFlex: 1,
			type: 'number',
			headerAlign: 'end',
			textAlign: 'end',
			sortable: false,
			editable: false,
			renderEditor: (editorProps: any) => {
				return <TextFieldEditor {...editorProps} />;
			},
			editorProps: {
				type: 'number'
			}
		},
		{
			name: 'to_wgt',
			header: 'To Wgt',
			defaultFlex: 1,
			type: 'number',
			headerAlign: 'end',
			textAlign: 'end',
			sortable: false,
			editable: false,
			renderEditor: (editorProps: any) => {
				return <TextFieldEditor {...editorProps} />;
			},
			editorProps: {
				type: 'number'
			}
		},
		{
			name: 'rate',
			header: 'Rate',
			defaultFlex: 1,
			type: 'number',
			headerAlign: 'end',
			textAlign: 'end',
			sortable: false,
			editable: false,
			renderEditor: (editorProps: any) => {
				return <TextFieldEditor {...editorProps} />;
			},
			editorProps: {
				type: 'number'
			}
		},
		{ name: 'hidden', header: 'Id', defaultVisible: false, defaultWidth: 80 }
	];
};

const Rapaports = () => {
	const fetchIdRef = useRef(0);
	const initParams = {
		page: 1,
		limit: 11,
		sortBy: [],
		filterBy: [],
		pagination: 'true'
	} as InitialQueryParam;

	const [skip, setSkip] = useState(0);
	const [limit, setLimit] = useState(initParams.limit ? initParams.limit : 10);

	const [sortInfo, setSortInfo] = useState([]);

	const defaultFilterValue = [
		{ name: 'shape', type: 'string', operator: 'contains', value: '' },
		{ name: 'color', type: 'string', operator: 'contains', value: '' },
		{ name: 'purity', type: 'string', operator: 'contains', value: '' },
		{ name: 'from_wgt', type: 'number', operator: 'contains', value: '' },
		{ name: 'to_wgt', type: 'number', operator: 'contains', value: '' }
	];

	const [filterValue, setFilterValue] = useState(defaultFilterValue);
	const [preventDuplicate, setPreventDuplicate] = useState(null);

	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your Slice Action  👿
	const { actions: rapaportsActions } = useRapaportsSlice();
	const { actions } = useSnackBarSlice();

	// * Rapaport State * //
	const rapaportsState = useSelector(rapaportsSelector);
	const { getSuccess, getOneSuccess, addSuccess, addError } = rapaportsState;

	// add your Locale  👿
	// const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const rapaportFilter = createFilterOptions();

	const [, setGridRef] = useState<any>(null); // gridRef
	const refPage = useHotkeys<any>('alt+a', () => console.log('refPage'));

	const [loading, setLoading] = useState(false);

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns] = useState<any>(getColumns());
	const [activeCell, setActiveCell] = useState<any>([0, 0]);

	const [value, setValue] = useState<any>([]);

	useEffect(() => {
		dispatch(rapaportsActions.get({ QueryParams: 'page=1&limit=10&pagination=true' }));
		return () => {
			dispatch(rapaportsActions.reset());
		};
	}, []);

	// * REDUCER * //

	useEffect(() => {
		if (addSuccess) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Download successfully.',
					variant: 'alert',
					alert: {
						color: 'success'
					},
					close: false,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					}
				})
			);
		}
		setLoading(false);
	}, [addSuccess]);

	useEffect(() => {
		if (addError) {
			const { message } = addError && addError.error ? addError.error : '';

			dispatch(
				actions.openSnackbar({
					open: true,
					message: message,
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
	}, [addError]);

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
		if (getOneSuccess) {
			if (getOneSuccess?.results && getOneSuccess?.results.length > 0) {
				const promise = new Promise(resolve => {
					return resolve({
						data: getOneSuccess?.results,
						count: Math.ceil(getOneSuccess?.meta.totalItems)
					});
				});

				setValue(promise);
				//setLimit(getSuccess?.meta);
			} else {
				setValue([]);
			}
		}
	}, [getOneSuccess]);

	// *** EVENT HANDDLERS  👿

	//change function
	const handleChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		rapaportSeqNo = newValue.seq_no;

		console.log('rapaport', rapaportSeqNo);
		if (newValue) {
			//setValue(newValue);
			dispatch(
				rapaportsActions.getDet({
					QueryParams: `seq_no=${newValue.seq_no}&page=1&limit=11&pagination=true`
				})
			);
		}
	};

	const onSubmit = async () => {
		/ empty /;
	};

	const handleFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = rapaportFilter(options, state);
		return filtered;
	};

	const handleDownload = async (event: any) => {
		event.preventDefault();
		setLoading(true);
		dispatch(rapaportsActions.add('success'));
	};

	const onLimitChange = useCallback((limit: number) => {
		onTableDataChange({ limit });
		setLimit(limit);
	}, []);

	const onSkipChange = useCallback((skip: number) => {
		onTableDataChange({ page: skip });
		setSkip(skip);
	}, []);

	const onSortInfoChange = useCallback((sortInfo: any) => {
		onTableDataChange({ sortInfo });
		setSortInfo(sortInfo);
	}, []);

	const onFilterValueChange = (value: any) => {
		if (JSON.stringify(value) !== JSON.stringify(preventDuplicate)) {
			onTableDataChange({ filterBy: value });
			setFilterValue(value);
		}
		setPreventDuplicate(value);
	};

	const onTableDataChange = useCallback((values: any) => {
		const obj = fetchTabelDataObject(initParams, values);
		fetchData(obj);
	}, []);

	const fetchData = useCallback(({ pageSize, pageIndex, sortInfo, filterValue }: any) => {
		const fetchId = ++fetchIdRef.current;
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

			//const queryParams = initParams;
			//const queryStirng = ObjecttoQueryString(queryParams);
			//dispatch(rapaportsActions.getDet({ QueryParams: queryStirng }));

			let query;
			if (filterValue && filterValue.length !== 0) {
				query = `seq_no=${rapaportSeqNo}&page=${pageIndex}&limit=${pageSize}&pagination=true&filterBy=${filterValue}`;
			} else {
				query = `seq_no=${rapaportSeqNo}&page=${pageIndex}&limit=${pageSize}&pagination=true`;
			}

			if (rapaportSeqNo > 0) {
				dispatch(
					rapaportsActions.getDet({
						QueryParams: query
					})
				);
			}
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
						<Stack spacing={2} direction="row" alignItems="center" sx={{ margin: 1.5 }}>
							<Button
								style={{ height: '30px' }}
								variant="contained"
								onClick={handleDownload}>
								Download Rapaport
							</Button>
							<Typography variant="subtitle1">Rapaport Date</Typography>
							<Grid className="custom-pricetextfield" sx={{ width: 175, margin: 1 }}>
								<AutocompleteElement
									loading={false}
									autocompleteProps={{
										disabled: false,
										selectOnFocus: true,
										clearOnBlur: true,
										handleHomeEndKeys: true,
										freeSolo: true,
										forcePopupIcon: true,
										autoHighlight: true,
										openOnFocus: true,
										onChange: (event, value, reason, details) =>
											handleChange(event, value, reason, details),
										filterOptions: (options, state) =>
											handleFilterOptions(options, state),
										getOptionLabel: option => {
											// Value selected with enter, right from the input
											if (typeof option === 'string') {
												return option;
											}
											// Add "xxx" option created dynamically
											if (option.inputValue) {
												return option.inputValue;
											}
											// Regular option
											return option.effect_date.split('T')[0];
										}
									}}
									name="effect_date"
									options={dataSource}
									textFieldProps={{
										InputProps: {},
										onFocus: () => {
											if (dataSource) {
												dispatch(
													rapaportsActions.get({
														QueryParams:
															'page=1&limit=10&pagination=true'
													})
												);
											}
										}
									}}
								/>
							</Grid>
						</Stack>
						<Grid item xs={12}>
							<Stack spacing={1}>
								<MainCard content={false} tabIndex="0">
									<ReactDataGrid
										handle={setGridRef}
										loading={loading}
										idProperty="seq_no"
										nativeScroll={true}
										style={gridStyle}
										activeCell={activeCell}
										onActiveCellChange={setActiveCell}
										editable={true}
										columns={columns}
										dataSource={value}
										sortInfo={sortInfo}
										onSortInfoChange={onSortInfoChange}
										pagination
										limit={limit}
										onLimitChange={onLimitChange}
										skip={skip}
										onSkipChange={onSkipChange}
										filterValue={filterValue}
										onFilterValueChange={onFilterValueChange}
										rowHeight={21}
										headerHeight={22}
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

export default Rapaports;
