/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Stack } from '@mui/material'; // IconButton,
import { useConfirm } from 'material-ui-confirm';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { TextFieldEditor, AutocompleteEditor } from '@components/table/editors';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { FormSchema, IFormInput } from '@pages/master/company/models/Bank';
import { useCompanysSlice } from '@pages/master/company/store/slice';
import { companysSelector } from '@pages/master/company/store/slice/companys.selectors';
// *** CURRENCIES *** //
import { useCurrenciesSlice } from '@pages/master/currencies/store/slice';
import { currenciesSelector } from '@pages/master/currencies/store/slice/currencies.selectors';
// *** COUNTRY *** //
import { useCountrySlice } from '@pages/master/countries/store/slice';
import { countrySelector } from '@pages/master/countries/store/slice/country.selectors';
// *** STATE *** //
import { useStateSlice } from '@pages/master/states/store/slice';
import { stateSelector } from '@pages/master/states/store/slice/state.selectors';
// *** CITY *** //
import { useCitySlice } from '@pages/master/cities/store/slice';
import { citySelector } from '@pages/master/cities/store/slice/city.selectors';

import {
	InitialQueryParam,
	InitialState,
	onTableKeyDown,
	insertNewRow,
	deleteRow,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';

import '@inovua/reactdatagrid-community/index.css';

const gridStyle = { minHeight: 150 };
let inEdit: boolean;
let newRowDataSource: any;
let initialFocus = false;

const initParams = {
	page: 1,
	limit: 10000,
	pagination: 'true'
} as InitialQueryParam;
console.log(initParams);

// ==============================|| BANKDETAILS ||============================== //

interface Props {
	passProps?: any;
	addressType?: string;
	selectedData?: any | null;
	bankOptions?: any;
	currentAction?: any;
	editMode?: any;
}

const BankDetail = ({ passProps, bankOptions, currentAction, editMode }: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const companysState = useSelector(companysSelector);
	const { actions: companysActions } = useCompanysSlice();
	//*** ExtraActions ***//
	const { actions: currenciesActions } = useCurrenciesSlice();
	const { actions: countryActions } = useCountrySlice();
	const { actions: stateActions } = useStateSlice();
	const { actions: cityActions } = useCitySlice();

	// *** companys State *** //
	const { getParaAcTypeSuccess } = companysState;

	// *** Currencies State *** //
	const currenciesState = useSelector(currenciesSelector);
	const { getSuccess: getCurrenciesSuccess } = currenciesState;

	// *** Country State *** //
	const countryState = useSelector(countrySelector);
	const { getSuccess: getCountrySuccess } = countryState;

	// *** State State *** //
	const stateState = useSelector(stateSelector);
	const { getSuccess: getStateSuccess } = stateState;

	// *** CITY State *** //
	const cityState = useSelector(citySelector);
	const { getSuccess: getCitySuccess } = cityState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
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
				header: 'Bank Name',
				width: 90,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'ac_name',
				header: 'Account Name',
				width: 150,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'ac_no',
				header: 'Account No',
				width: 120,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'ac_type',
				header: 'Ac Type',
				width: 70,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data }: any) => {
					return data && data.ac_type && data.ac_type.name ? data.ac_type.name : '';
				}
			},
			{
				name: 'branch_name',
				header: 'Branch Name',
				width: 90,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'address',
				header: 'Address',
				width: 90,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'phone_no',
				header: 'Phone No.',
				width: 90,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				}
			},
			{
				name: 'country',
				header: 'Country',
				width: 70,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data }: any) => {
					return data && data.country && data.country.name ? data.country.name : '';
				}
			},
			{
				name: 'state',
				header: 'State',
				width: 90,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data }: any) => {
					return data && data.state && data.state.name ? data.state.name : '';
				}
			},
			{
				name: 'city',
				header: 'City',
				width: 90,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data }: any) => {
					return data && data.city && data.city.name ? data.city.name : '';
				}
			},
			{
				name: 'pin_code',
				header: 'Pin Code',
				width: 80,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				}
			},
			{
				name: 'ifsc_code',
				header: 'IFSC Code',
				width: 80,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'iban_no',
				header: 'IBAN No',
				width: 80,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'clearing_no',
				header: 'Clearing No',
				width: 80,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'swift_code',
				header: 'SWIFT Code',
				width: 80,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				}
			},
			{
				name: 'fedwire',
				header: 'FedWire',
				width: 70,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'chips_no',
				header: 'Chips No',
				width: 80,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'ad_code',
				header: 'AD Code',
				width: 80,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'currency',
				header: 'Currency',
				width: 70,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <AutocompleteEditor {...editorProps} />;
				},
				editorProps: {
					idProperty: 'seq_no',
					dataSource: [],
					collapseOnSelect: true,
					clearIcon: null
				},
				render: ({ data }: any) => {
					return data && data.currency && data.currency.name ? data.currency.name : '';
				}
			},
			{
				name: 'comments',
				header: 'Comments',
				width: 120,
				sortable: false,
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

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});
	const confirm = useConfirm();
	const [gridRef, setGridRef] = useState<any>(null);
	const refPage = useHotkeys<any>('alt+s', () => buttonRef.current.click());

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());
	const [activeCell, setActiveCell] = useState<any>([0, 0]);

	useEffect(() => {
		if (
			currentAction &&
			(currentAction === 'Add' ||
				currentAction === 'Save' ||
				currentAction === 'Cancel' ||
				currentAction === 'View' ||
				currentAction === 'View1')
		) {
			reset({
				arr: [{ name: null }] as any
			});
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});
			setDataSource([]);
		}
	}, [currentAction]);

	useEffect(() => {
		if (bankOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: bankOptions
				}
			}));
			setDataSource(bankOptions);
		}
	}, [bankOptions]);

	useEffect(() => {
		newRowDataSource = dataSource;
		passProps(pageState.values.para);
		// passProps(newRowDataSource);
	}, [dataSource]);

	useEffect(() => {
		if (gridRef && !initialFocus) {
			requestAnimationFrame(() => {
				initialFocus = true;
				gridRef.current.focus();
			});
		}
	}, [gridRef]);

	// *** CURRENCIES *** //
	useEffect(() => {
		if (getCurrenciesSuccess) {
			if (getCurrenciesSuccess?.results) {
				if (getCurrenciesSuccess?.columnType === 'currency') {
					let currenciesData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'currency'
					);

					if (getCurrenciesSuccess?.results && getCurrenciesSuccess?.results.length > 0) {
						currenciesData = getCurrenciesSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: currenciesData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	}, [getCurrenciesSuccess]);

	// *** CUNTRY *** //
	useEffect(() => {
		if (getCountrySuccess) {
			if (getCountrySuccess?.results) {
				if (getCountrySuccess?.columnType === 'country') {
					let countryData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'country'
					);

					if (getCountrySuccess?.results && getCountrySuccess?.results.length > 0) {
						countryData = getCountrySuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: countryData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	}, [getCountrySuccess]);

	// *** STATE *** //
	useEffect(() => {
		if (getStateSuccess) {
			if (getStateSuccess?.results) {
				if (getStateSuccess?.columnType === 'state') {
					let stateData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'state'
					);

					if (getStateSuccess?.results && getStateSuccess?.results.length > 0) {
						stateData = getStateSuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: stateData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	}, [getStateSuccess]);

	// *** CITY *** //
	useEffect(() => {
		if (getCitySuccess) {
			if (getCitySuccess?.results) {
				if (getCitySuccess?.columnType === 'city') {
					let cityData = [];

					// Update Editable column datasource
					const updatedColumns = [...columns];

					const editorTypeColumnIndex = updatedColumns.findIndex(
						column => column.name === 'city'
					);

					if (getCitySuccess?.results && getCitySuccess?.results.length > 0) {
						cityData = getCitySuccess?.results;
					}

					if (editorTypeColumnIndex !== -1) {
						updatedColumns[editorTypeColumnIndex].editorProps = {
							idProperty: 'seq_no',
							dataSource: cityData,
							collapseOnSelect: true,
							clearIcon: null
						};

						setColumns(updatedColumns);
					}
				}
			}
		}
	}, [getCitySuccess]);

	// *** ACCOUNT-TYPE *** //
	useEffect(() => {
		if (getParaAcTypeSuccess) {
			let ParaData = [];
			const updatedColumns = [...columns];

			const editorTypeColumnIndex = updatedColumns.findIndex(
				column => column.name === 'ac_type'
			);

			if (getParaAcTypeSuccess?.results && getParaAcTypeSuccess?.results.length > 0) {
				ParaData = getParaAcTypeSuccess?.results;
			}

			if (editorTypeColumnIndex !== -1) {
				updatedColumns[editorTypeColumnIndex].editorProps = {
					idProperty: 'seq_no',
					dataSource: ParaData,
					collapseOnSelect: true,
					clearIcon: null
				};
				setColumns(updatedColumns);
			}
		}
	}, [getParaAcTypeSuccess]);
	// *** REDUCER *** //

	// Editable React data table
	const onEditStart = () => {
		inEdit = true;
	};

	const onEditStop = () => {
		requestAnimationFrame(() => {
			inEdit = false;
			gridRef.current.focus();
		});
	};

	const onKeyDown = async (event: any) => {
		const edited = await onTableKeyDown(event, inEdit, gridRef);

		//dispatch(partiesActions.reset());
		if (edited && edited.colName === 'ac_type') {
			dispatch(companysActions.getParaAcType('BANK_AC_TYPE'));
		}
		if (edited && edited.colName === 'currency') {
			dispatch(currenciesActions.reset());

			dispatch(
				currenciesActions.get({
					QueryParams:
						edited.input.length != 0
							? `columnType=currency&limit=10&q=` + edited.input
							: `columnType=currency&page=1&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'country') {
			dispatch(countryActions.reset());

			dispatch(
				countryActions.get({
					QueryParams:
						edited.input.length != 0
							? `columnType=country&limit=10&q=` + edited.input
							: `columnType=country&page=1&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'state') {
			dispatch(stateActions.reset());

			dispatch(
				stateActions.get({
					QueryParams:
						edited.input.length != 0
							? `columnType=state&limit=10&q=` + edited.input
							: `columnType=state&page=1&limit=10`
				})
			);
		}
		if (edited && edited.colName === 'city') {
			dispatch(cityActions.reset());

			dispatch(
				cityActions.get({
					QueryParams:
						edited.input.length != 0
							? `columnType=city&limit=10&q=` + edited.input
							: `columnType=city&page=1&limit=10`
				})
			);
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
					description: 'Are you sure delete Bank ?',
					cancellationButtonProps: { autoFocus: true },
					confirmationText: 'Yes',
					cancellationText: 'No'
				})
					.then(() => {
						const stateArr = deleteRow(pageState, 'seq_no', data, rowIndex);
						return stateArr;
					})
					.then(stateArr => {
						setPageState(value => ({
							...value,
							values: {
								...pageState.values,
								para: stateArr
							}
						}));

						data.splice(rowIndex, 1);
						setDataSource(data);
					})
					.catch(() => {
						/* */
					});
			}

			if (event.key === 'Insert' || (event.key === 'Enter' && rowIndex === rowCount - 1)) {
				let isLastEditableColumn = false;
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

				const { insertNew, data, stateArr } = await insertNewRow(
					pageState, // State for track row insert, update or delete
					FormSchema, // for validation
					newRowDataSource, // table data
					rowIndex, // row number
					isLastEditableColumn,
					event.key
				);

				event.preventDefault();

				if (insertNew) {
					// *** set table with new data
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
					setActiveCell([data.length - 1, 0]);
					setTimeout(() => {
						const column = grid.getColumnBy(0);
						grid.startEdit({ columnId: column.name, rowIndex: data.length - 1 });
					}, 100);
				}
			}
		}
	};

	const onEditComplete = useCallback(
		async ({ value, columnId, rowIndex }: any) => {
			if (value === '' || value || typeof value === 'boolean') {
				if (typeof value === 'string') {
					value = value.trim();
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
				console.log(stateArr);
				setDataSource(data);
			}
		},
		[dataSource]
	);

	const onSubmit = async () => {
		/* empty */
	};
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
									<ReactDataGrid
										handle={setGridRef}
										idProperty="seq_no"
										nativeScroll={true}
										style={gridStyle}
										activeCell={activeCell}
										onActiveCellChange={setActiveCell}
										onKeyDown={onKeyDown}
										onEditComplete={onEditComplete}
										onEditStart={onEditStart}
										onEditStop={onEditStop}
										editable={editMode}
										columns={columns}
										dataSource={dataSource}
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

export default BankDetail;
