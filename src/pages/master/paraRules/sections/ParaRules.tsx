import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import GoldenRetriever from '@uppy/golden-retriever';
import XHR from '@uppy/xhr-upload';

import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/audio/dist/style.css';
import '@uppy/screen-capture/dist/style.css';
import '@uppy/image-editor/dist/style.css';

import { TextFieldEditor } from '@components/table/editors';

import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	Button,
	CircularProgress,
	FilterOptionsState,
	Grid,
	Stack,
	Typography,
	createFilterOptions
} from '@mui/material';

import { useConfirm } from 'material-ui-confirm';

import { AutocompleteElement, FormContainer } from '@app/components/rhfmui';
import { useSnackBarSlice } from '@app/store/slice/snackbar';
import MainCard from '@components/MainCard';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDataGrid from '@inovua/reactdatagrid-community';

//import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
//import '@inovua/reactdatagrid-enterprise/index.css';

import { FormSchema, IFormInput } from '@pages/master/paraRules/models/ParaRules';
import { useParaRulesSlice } from '@pages/master/paraRules/store/slice';
import { paraRulesSelector } from '@pages/master/paraRules/store/slice/paraRules.selectors';

// *** SHAPE *** //
import { useShapesSlice } from '@pages/master/shapes/store/slice';
import { shapesSelector } from '@pages/master/shapes/store/slice/shapes.selectors';
import { shapesState } from '@pages/master/shapes/store/slice/types';

// *** PURITY *** //
import { usePuritiesSlice } from '@pages/master/purities/store/slice';
import { puritiesSelector } from '@pages/master/purities/store/slice/purities.selectors';
import { puritiesState } from '@pages/master/purities/store/slice/types';

// *** RANGE *** //
import { useRangeSlice } from '@pages/master/ranges/store/slice';
import { rangeSelector } from '@pages/master/ranges/store/slice/ranges.selectors';
import { rangeState } from '@pages/master/ranges/store/slice/types';

// *** PARA *** //
import { useParaSlice } from '@pages/master/paras/store/slice';

const shapesFilter = createFilterOptions();
const parasFilter = createFilterOptions();
const purityFilter = createFilterOptions();
const rangeFilter = createFilterOptions();

import {
	// fetchTabelDataObject,
	InitialState,
	onTableKeyDown,
	prepareOnEditComplete,
	delay
} from '@utils/helpers';

import '@inovua/reactdatagrid-community/index.css';
import { paraRulesState } from '../store/slice/types';
import useThrottle from '@hooks/useThrottle';

import '@pages/master/party/sections/party.css';

const gridStyle = {
	minHeight: 390
};

const gridParaStyle = {
	minHeight: 200
};

const gridParaValueStyle = {
	minHeight: 190
};

let inEdit: boolean;
let initialFocus = false;
let typeName = '';

const UPLOADER = 's3';

let ENDPOINT_URL: any;
const Url = window.location.host;
if (Url == 'dev.dxl.one') {
	const { REACT_APP_ENDPOINT_URL } = process.env;
	ENDPOINT_URL = REACT_APP_ENDPOINT_URL;
} else {
	const { REACT_APP_ENDPOINT_URL_TEST } = process.env;
	ENDPOINT_URL = REACT_APP_ENDPOINT_URL_TEST;
}

const RESTORE = false;

const ParaRules = () => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// add your refrence  👿
	const buttonRef = useRef<any>(null);

	// add your Slice Action  👿
	const { actions: paraRuleActions } = useParaRulesSlice();
	const { actions: shapesActions } = useShapesSlice();
	const { actions: parasActions } = useParaSlice();
	const { actions: puritiesActions } = usePuritiesSlice();
	const { actions: rangeActions } = useRangeSlice();
	const { actions } = useSnackBarSlice();

	// *** Para Rule State *** //
	const paraRulesState = useSelector(paraRulesSelector);
	const {
		addError,
		addSuccess,
		getSuccess,
		getOneSuccess,
		getDownloadFormatSuccess: getDownloadFormatSuccess,
		getOneParaRuleViewSuccess: getOneParaRuleViewSuccess,
		getOneParaRuleFileSuccess: getOneParaRuleFileSuccess,
		getParaError: getParaError,
		getParaSuccess: getParaSuccess
	} = paraRulesState;

	// *** Shapes State *** //
	const shapesState = useSelector(shapesSelector);
	const { getError: getShapeError, getSuccess: getShapeSuccess } = shapesState;

	// *** Purity State *** //
	const puritiesState = useSelector(puritiesSelector);
	const { getError: getPurityError, getSuccess: getPuritySuccess } = puritiesState;

	// *** Range State *** //
	const rangeState = useSelector(rangeSelector);
	const { getError: getRangeError, getSuccess: getRangeSuccess } = rangeState;

	const [shapeLoading, setShapeLoading] = useState(false);
	const [shapeInputValue, setShapeInputValue] = useState('');
	const [shapeOptions, setShapeOptions] = useState<shapesState[]>([]);
	const throttledInputShapeValue = useThrottle(shapeInputValue, 400);

	// *** Paras State *** //
	const [paraLoading, setParaLoading] = useState(false);
	const [paraInputValue, setParaInputValue] = useState('');
	const [paraOptions, setParaOptions] = useState<paraRulesState[]>([]);
	const throttledInputParaValue = useThrottle(paraInputValue, 400);

	// *** Purity *** //
	const [purityLoading, setPurityLoading] = useState(false);
	const [purityInputValue, setPurityInputValue] = useState('');
	const [purityOptions, setPurityOptions] = useState<puritiesState[]>([]);
	const throttledInputPurityValue = useThrottle(purityInputValue, 400);

	// *** Range *** //
	const [rangeLoading, setRangeLoading] = useState(false);
	const [rangeInputValue, setRangeInputValue] = useState('');
	const [rangeOptions, setRangeOptions] = useState<rangeState[]>([]);
	const throttledInputRangeValue = useThrottle(rangeInputValue, 400);

	// add your Locale  👿
	const { formatMessage } = useIntl();

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const {
		formState: { isSubmitting },
		reset
	} = formContext;

	const getColumnsPara = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'caption',
				header: 'Parameter',
				defaultFlex: 1,
				editable: false,
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

	const [loading, setLoading] = useState(false);

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>([]);
	const [groups, setGroups] = useState<any>([]);
	const [activeCell, setActiveCell] = useState<any>([0, 0]);

	const [gridRefPara, setGridRefPara] = useState<any>(null);
	const [dataSourcePara, setDataSourcePara] = useState<any>([]);
	const [columnsPara] = useState<any>(getColumnsPara());
	const [activeCellPara, setActiveCellPara] = useState<any>([0, 0]);

	const [gridRefParaValue, setGridRefParaValue] = useState<any>(null);
	const [dataSourceParaValue, setDataSourceParaValue] = useState<any>([]);
	const [columnsParaValue, setColumnsParaValue] = useState<any>([]);
	const [activeCellParaValue, setActiveCellParaValue] = useState<any>([0, 0]);

	const [selectShape, setSelectShape] = useState<any>(null);
	const shapeSeq = selectShape ? selectShape.seq_no : null;

	const [selectPara, setSelectPara] = useState<any>(null);
	const paraName = selectPara ? selectPara.name : null;

	const [selectPurity, setSelectPurity] = useState<any>(null);
	const puritySeq = selectPurity ? selectPurity.seq_no : 0;

	const [selectRange, setSelectRange] = useState<any>(null);
	const rangeSeq = selectRange ? selectRange.seq_no : 0;

	const [priceParaName, setSelectPricePara] = useState<any>(null);

	const [uppyDashboard, setUppyDashboard] = useState<any>(null);

	const [fileName, setFileName] = useState<any>([]);

	const [caption, setCaption] = useState<any>([]);

	//const [groupBy] = useState(['GROUP_DISPLAY']);

	// useEffect(() => {
	// 	const uppyDashboard = new Uppy({
	// 		restrictions: {
	// 			maxNumberOfFiles: 1,
	// 			minNumberOfFiles: 1,
	// 			allowedFileTypes: ['.xls', '.xlsx']
	// 		}
	// 	}).use(Dashboard, {
	// 		inline: false,
	// 		// target: '#app',
	// 		showProgressDetails: true,
	// 		proudlyDisplayPoweredByUppy: false,
	// 		width: 220,
	// 		height: 100
	// 	});

	// 	switch (UPLOADER) {
	// 		case 's3':
	// 			uppyDashboard.use(XHR, { endpoint: ENDPOINT_URL });
	// 			break;
	// 		default:
	// 	}

	// 	if (RESTORE) {
	// 		uppyDashboard.use(GoldenRetriever, { serviceWorker: true });
	// 	}

	// 	uppyDashboard.on('complete', result => {
	// 		if (result.failed.length === 0) {
	// 			console.log('Upload successful');
	// 		} else {
	// 			console.warn('Upload failed');
	// 		}
	// 		setFileName(result.successful[0].name);
	// 		console.log('successful files:', result.successful);
	// 		console.log('failed files:', result.failed);
	// 	});
	// 	setUppyDashboard(uppy);
	// }, []);

	useEffect(() => {
		// reset(pageState.values);
		const uppy = new Uppy({
			restrictions: {
				maxNumberOfFiles: 1,
				minNumberOfFiles: 1,
				allowedFileTypes: ['.xls', '.xlsx']
			}
		}).use(Dashboard, {
			inline: false,
			showProgressDetails: true,
			proudlyDisplayPoweredByUppy: false
		});

		switch (UPLOADER) {
			case 's3':
				uppy.use(XHR, { endpoint: ENDPOINT_URL });
				break;
			default:
		}

		if (RESTORE) {
			uppy.use(GoldenRetriever, { serviceWorker: true });
		}

		uppy.on('complete', result => {
			if (result.failed.length === 0) {
				console.log('Upload successful');
			} else {
				console.warn('Upload failed');
			}
			const successfulFileNames = result.successful.map(file => file.name);
			setFileName(successfulFileNames.join(', '));
			console.log('successful files:', successfulFileNames);
			console.log('failed files:', result.failed);
		});

		setUppyDashboard(uppy);
	}, []);

	const openUppyDashboard = () => {
		if (uppyDashboard) {
			uppyDashboard.getPlugin('Dashboard').openModal();
		}
	};

	useEffect(() => {
		// dispatch(
		// 	paraRuleActions.get({
		// 		QueryParams: `type=SALE-DISC`
		// 	})
		// );
		return () => {
			dispatch(paraRuleActions.reset());
			// window.removeEventListener('beforeunload', handleTabClose);
		};
	}, []);

	// *** SHAPE *** //
	useEffect(() => {
		if (getShapeSuccess) {
			if (getShapeSuccess?.results) {
				setShapeOptions(getShapeSuccess?.results);
			} else {
				setShapeOptions([]);
			}
		}
		if (getShapeError) {
			setShapeOptions([]);
		}
		setShapeLoading(false);
	}, [getShapeError, getShapeSuccess]);

	useEffect(() => {
		dispatch(shapesActions.reset());
		if (throttledInputShapeValue === '' && pageState?.touched?.Shapes) {
			setShapeLoading(true);
			dispatch(shapesActions.get({ QueryParams: `limit=10` }));
			return undefined;
		} else if (throttledInputShapeValue !== '') {
			setShapeLoading(true);
			dispatch(shapesActions.get({ QueryParams: `q=${throttledInputShapeValue}` }));
		}
	}, [throttledInputShapeValue]);

	// *** PURITY *** //
	useEffect(() => {
		if (getPuritySuccess) {
			if (getPuritySuccess?.results) {
				setPurityOptions(getPuritySuccess?.results);
			} else {
				setPurityOptions([]);
			}
		}
		if (getPurityError) {
			setPurityOptions([]);
		}
		setPurityLoading(false);
	}, [getPurityError, getPuritySuccess]);

	// *** RANGE *** //
	useEffect(() => {
		if (getRangeSuccess) {
			if (getRangeSuccess?.results) {
				setRangeOptions(getRangeSuccess?.results);
			} else {
				setRangeOptions([]);
			}
		}
		if (getRangeError) {
			setRangeOptions([]);
		}
		setRangeLoading(false);
	}, [getRangeError, getRangeSuccess]);

	// *** PARA *** //
	useEffect(() => {
		if (getParaSuccess) {
			if (getParaSuccess?.results) {
				setParaOptions(getParaSuccess?.results);
			} else {
				setParaOptions([]);
			}
		}
		if (getParaError) {
			setParaOptions([]);
		}
		setParaLoading(false);
	}, [getParaError, getParaSuccess]);

	useEffect(() => {
		dispatch(parasActions.reset());
		if (throttledInputParaValue === '' && pageState?.touched?.Paras) {
			setParaLoading(false);
			dispatch(paraRuleActions.getPara(`'DISC_TYPE'?page=1&limit=10&pagination=false`));
			return undefined;
		} else if (throttledInputParaValue !== '') {
			setParaLoading(false);
			dispatch(
				paraRuleActions.getPara(
					`'DISC_TYPE'?page=1&limit=10&pagination=false&q=${throttledInputParaValue}`
				)
			);
		}
	}, [throttledInputParaValue]);

	useEffect(() => {
		if (gridRef && !initialFocus) {
			requestAnimationFrame(() => {
				initialFocus = true;
				gridRef.current.focus();
			});
		}
	}, [gridRef]);

	useEffect(() => {
		if (gridRefPara && !initialFocus) {
			requestAnimationFrame(() => {
				initialFocus = true;
				gridRefPara.current.focus();
			});
		}
	}, [gridRefPara]);

	useEffect(() => {
		if (gridRefParaValue && !initialFocus) {
			requestAnimationFrame(() => {
				initialFocus = true;
				gridRefParaValue.current.focus();
			});
		}
	}, [gridRefParaValue]);

	// *** REDUCER *** //

	useEffect(() => {
		if (addSuccess) {
			dispatch(
				actions.openSnackbar({
					open: true,
					message: 'Save successfully.',
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

			//reset();
			console.log(reset);
			setPageState({
				isValid: false,
				values: {},
				touched: null,
				errors: null
			});

			if (
				shapeSeq != null &&
				shapeSeq > 0 &&
				paraName != null &&
				paraName.length > 0 &&
				priceParaName != null &&
				priceParaName.length > 0
			) {
				dispatch(
					paraRuleActions.getOneParaRuleView(`${shapeSeq}/${paraName}/${priceParaName}`)
				);
			} else {
				setColumns([]);
				setGroups([]);
				setDataSource([]);
			}
		}
	}, [addSuccess]);

	useEffect(() => {
		if (addError) {
			const message = addError && addError.error ? addError.error.errors[0] : '';

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
		setCaption('');
		if (getSuccess) {
			if (!getSuccess?.columnType || getSuccess?.columnType === null) {
				if (getSuccess?.price_para && getSuccess?.price_para.length > 0) {
					setSelectPricePara(getSuccess?.price_para[0].para_name);
					if (getSuccess?.price_para[0].value_count == 2) {
						const getColumnsParaValue = () => {
							return [
								{
									name: 'from_value',
									header: 'From Value',
									headerAlign: 'center',
									textAlign: 'center',
									type: 'number',
									defaultFlex: 1,
									defaulwidth: 50,
									editable: false,
									sortable: false,
									renderEditor: (editorProps: any) => {
										return <TextFieldEditor {...editorProps} />;
									}
								},
								{
									name: 'to_value',
									header: 'To Value',
									defaultFlex: 1,
									defaulwidth: 50,
									editable: false,
									headerAlign: 'center',
									textAlign: 'center',
									type: 'number',
									sortable: false,
									renderEditor: (editorProps: any) => {
										return <TextFieldEditor {...editorProps} />;
									}
								}
							];
						};

						setColumnsParaValue(getColumnsParaValue);
					} else if (getSuccess?.price_para[0].value_count == 1) {
						const getColumnsParaValue = () => {
							return [
								{
									name: 'value',
									header: 'Value',
									defaultFlex: 1,
									editable: false,
									sortable: false,
									renderEditor: (editorProps: any) => {
										return <TextFieldEditor {...editorProps} />;
									}
								}
							];
						};

						setColumnsParaValue(getColumnsParaValue);
					}
					setDataSourcePara(getSuccess?.price_para);
				} else {
					setDataSourcePara([]);
				}

				if (getSuccess?.price_para_value && getSuccess?.price_para_value.length > 0) {
					setDataSourceParaValue(getSuccess?.price_para_value);
				} else {
					setDataSourceParaValue([]);
				}

				if (getSuccess?.columns && getSuccess?.columns.length > 0) {
					getColumns(getSuccess?.columns);
				} else {
					setColumns([]);
				}
				if (getSuccess?.groups && getSuccess?.groups.length > 0) {
					getGroups(getSuccess?.groups);
				} else {
					setGroups([]);
				}
			}
			setDataSource([]);
		} else {
			setColumns([]);
			setGroups([]);
			setDataSource([]);
		}
		setLoading(false);
	}, [getSuccess]);

	useEffect(() => {
		setCaption('');
		if (getOneSuccess) {
			if (!getOneSuccess?.columnType || getOneSuccess?.columnType === null) {
				if (getOneSuccess?.price_para_value && getOneSuccess?.price_para_value.length > 0) {
					if (getOneSuccess?.price_para_value[0].value_count == 2) {
						const getColumnsParaValue = () => {
							return [
								{
									name: 'from_value',
									header: 'From Value',
									headerAlign: 'center',
									textAlign: 'center',
									type: 'number',
									defaultFlex: 1,
									defaulwidth: 50,
									editable: false,
									sortable: false,
									renderEditor: (editorProps: any) => {
										return <TextFieldEditor {...editorProps} />;
									}
								},
								{
									name: 'to_value',
									header: 'To Value',
									defaultFlex: 1,
									defaulwidth: 50,
									editable: false,
									headerAlign: 'center',
									textAlign: 'center',
									type: 'number',
									sortable: false,
									renderEditor: (editorProps: any) => {
										return <TextFieldEditor {...editorProps} />;
									}
								}
							];
						};

						setColumnsParaValue(getColumnsParaValue);
					} else if (getOneSuccess?.price_para_value[0].value_count == 1) {
						const getColumnsParaValue = () => {
							return [
								{
									name: 'value',
									header: 'Value',
									defaultFlex: 1,
									editable: false,
									sortable: false,
									renderEditor: (editorProps: any) => {
										return <TextFieldEditor {...editorProps} />;
									}
								}
							];
						};
						setColumnsParaValue(getColumnsParaValue);
					}
					setDataSourceParaValue(getOneSuccess?.price_para_value);
				} else {
					setDataSourceParaValue([]);
				}

				if (getOneSuccess?.columns && getOneSuccess?.columns.length > 0) {
					getColumns(getOneSuccess?.columns);
				} else {
					setColumns([]);
				}
				if (getOneSuccess?.groups && getOneSuccess?.groups.length > 0) {
					getGroups(getOneSuccess?.groups);
				} else {
					setGroups([]);
				}
			}
		} else {
			setColumns([]);
			setGroups([]);
			setDataSource([]);
		}
		setLoading(false);
	}, [getOneSuccess]);

	useEffect(() => {
		if (getOneParaRuleViewSuccess) {
			if (
				!getOneParaRuleViewSuccess?.columnType ||
				getOneParaRuleViewSuccess?.columnType === null
			) {
				if (
					getOneParaRuleViewSuccess?.columns &&
					getOneParaRuleViewSuccess?.columns.length > 0
				) {
					getColumns(getOneParaRuleViewSuccess?.columns);
				} else {
					setColumns([]);
				}
				if (
					getOneParaRuleViewSuccess?.groups &&
					getOneParaRuleViewSuccess?.groups.length > 0
				) {
					getGroups(getOneParaRuleViewSuccess?.groups);
				} else {
					setGroups([]);
				}
				if (
					getOneParaRuleViewSuccess?.results &&
					getOneParaRuleViewSuccess?.results.length > 0
				) {
					setPageState(value => ({
						...value,
						values: {
							...pageState.values,
							para: getOneParaRuleViewSuccess.results
						}
					}));
					setDataSource(getOneParaRuleViewSuccess.results);
				} else {
					setDataSource([]);
				}
			}
		} else {
			setColumns([]);
			setGroups([]);
			setDataSource([]);
		}
		setLoading(false);
	}, [getOneParaRuleViewSuccess]);

	useEffect(() => {
		if (getOneParaRuleFileSuccess) {
			if (
				!getOneParaRuleFileSuccess?.columnType ||
				getOneParaRuleFileSuccess?.columnType === null
			) {
				if (
					getOneParaRuleFileSuccess?.columns &&
					getOneParaRuleFileSuccess?.columns.length > 0
				) {
					getColumns(getOneParaRuleFileSuccess?.columns);
				} else {
					setColumns([]);
				}
				if (
					getOneParaRuleFileSuccess?.groups &&
					getOneParaRuleFileSuccess?.groups.length > 0
				) {
					getGroups(getOneParaRuleFileSuccess?.groups);
				} else {
					setGroups([]);
				}
				if (
					getOneParaRuleFileSuccess?.results &&
					getOneParaRuleFileSuccess?.results.length > 0
				) {
					setPageState(value => ({
						...value,
						values: {
							...pageState.values,
							para: getOneParaRuleFileSuccess.results
						}
					}));
					setDataSource(getOneParaRuleFileSuccess.results);
				} else {
					setDataSource([]);
				}
			}
		} else {
			setColumns([]);
			setGroups([]);
			setDataSource([]);
		}
		setLoading(false);
	}, [getOneParaRuleFileSuccess]);

	useEffect(() => {
		if (
			getDownloadFormatSuccess &&
			getDownloadFormatSuccess != null &&
			getDownloadFormatSuccess.length > 0
		) {
			window.location.href = JSON.parse(JSON.stringify(getDownloadFormatSuccess));
		}
		setLoading(false);
	}, [getDownloadFormatSuccess]);

	const getColumns = async (columns: any) => {
		let arrColums = [];
		for (let index = 0; index < columns.length; index++) {
			const element = columns[index];

			const column = {
				...element,
				...(element.renderEditor &&
					element.renderEditor === 'TextFieldEditor' && {
						renderEditor: (editorProps: any) => {
							return <TextFieldEditor {...editorProps} />;
						}
					}),
				...(element.render &&
					element.render === 'decimal' && {
						render: ({ data }: any) => {
							return (
								<Typography align="center">
									{data && data[element.name]
										? parseFloat(data[element.name]).toFixed(2)
										: null}
								</Typography>
							);
						}
					}),
				...(element.colspan &&
					element.colspan === -1 && {
						colspan: ({ data }: any) => {
							if (data.rowordsr === 0) {
								return columns.length;
							}
							return 1;
						}
					}),
				...(element.rowspan &&
					element.rowspan === -1 && {
						rowspan: ({ value, dataSourceArray, rowIndex, column }: any) => {
							let rowspan = 1;

							const prevData = dataSourceArray[rowIndex - 1];
							if (prevData && prevData[column.name] === value) {
								return rowspan;
							}
							let currentRowIndex = rowIndex + 1;
							while (
								dataSourceArray[currentRowIndex] &&
								dataSourceArray[currentRowIndex][column.name] === value
							) {
								rowspan++;
								currentRowIndex++;
								// if (rowspan > 9) {
								// 	break;
								// }
							}
							return rowspan;
						}
					})
			};

			arrColums.push(column);
		}

		setColumns(arrColums);
	};

	const getGroups = async (columns: any) => {
		let arrColums = [];
		for (let index = 0; index < columns.length; index++) {
			const element = columns[index];

			const group = {
				...element,
				...(element.header && {
					header: (
						<span
							style={{
								color: '#ff595e',
								fontWeight: 'bold',
								display: 'flex',
								justifyContent: 'center',
								height: '15px'
							}}>
							{element.header}
						</span>
					)
				})
			};

			arrColums.push(group);
		}

		setGroups(arrColums);
	};

	const rowStyle = ({ data }: any) => {
		const colorMap: any = {
			0: '#030303'
		};
		const boldMap: any = {
			0: 'bold'
		};

		return {
			color: colorMap[data.rowordsr],
			fontWeight: boldMap[data.rowordsr]
		};
	};

	const rowClassName = ({ data }: any) => {
		if (data.rowordsr == 0) {
			return 'global-custom-row-green global-custom-row';
		}

		return 'global-custom-row';
	};

	const onSubmit = async () => {
		/* empty */
	};

	const handleFilterOptions = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = shapesFilter(options, state);
		return filtered;
	};

	const handleShapeChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		setSelectShape(newValue);

		if (!newValue) {
			dispatch(shapesActions.get({ QueryParams: `page=1&limit=10` }));
		}
	};

	const handleFilterOptionsPara = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = parasFilter(options, state);
		return filtered;
	};

	const handleParaChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		setSelectPara(newValue);
		typeName = newValue.name;

		if (!newValue) {
			//dispatch(paraRuleActions.getPara('DISC_TYPE'));
			dispatch(paraRuleActions.getPara(`'DISC_TYPE'?page=1&limit=10&pagination=false`));
		}

		dispatch(
			paraRuleActions.get({
				QueryParams: `type=${newValue.name}`
			})
		);
	};

	// *** PURITY *** //
	const handleFilterOptionsPurity = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = purityFilter(options, state);
		return filtered;
	};

	const handlePurityChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		setSelectPurity(newValue);

		if (!newValue) {
			dispatch(
				puritiesActions.get({
					QueryParams: `page=1&limit=1000&pagination=false&q=price_chart='true'`
				})
			);
		}
	};

	// *** RANGE *** //
	const handleFilterOptionsRange = (options: any[], state: FilterOptionsState<any>) => {
		const filtered = rangeFilter(options, state);
		return filtered;
	};

	const handleRangeChange = (
		event: SyntheticEvent,
		newValue: any,
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<any> | undefined
	) => {
		setSelectRange(newValue);

		if (!newValue) {
			dispatch(
				rangeActions.get({
					QueryParams: `type=RAPAPORT - POINTER&page=1&limit=1000&pagination=false`
				})
			);
		}
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		if (Object.keys(pageState.values).length === 0) {
			return;
		}
		setLoading(true);
		dispatch(paraRuleActions.add(pageState.values));
		setLoading(false);
	};

	const handleCancel = async (event: any) => {
		if (Object.keys(pageState.values).length !== 0 && pageState.values.para.length > 0) {
			confirm({
				description: 'Do you want to discard changes ?',
				confirmationButtonProps: { autoFocus: true },
				confirmationText: 'Yes',
				cancellationText: 'No'
			})
				.then(() => {
					window.location.reload();
				})

				.catch(() => {
					/* */
				});
		}
	};

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

		if (!edited) {
			const grid = gridRef.current;
			const [rowIndex, colIndex] = grid.computedActiveCell;
			const rowCount = grid.count;

			if (event.key === 'Tab') {
				event.preventDefault();
			}

			if (event.key === 'Enter' && rowIndex === rowCount - 1) {
				//let isLastEditableColumn = false;
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
						//isLastEditableColumn = true;
						await delay(20);
					}
				}

				event.preventDefault();
			}
		}
	};

	const onEditComplete = useCallback(
		async ({ value, columnId, rowIndex }: any) => {
			// if (value === '' || value || typeof value === 'boolean') {
			if (typeof value === 'string') {
				value = value.trim();

				if (value.length > 0) {
					if (isNaN(value)) {
						value = null;
					} else {
						let arrPlus = value.split('+');
						if (arrPlus.length > 1) {
							value = value * 1;
						} else {
							let arrMinus = value.split('-');
							if (arrMinus.length <= 1) {
								value = value * -1;
							}
						}
						value = parseFloat(value).toFixed(2);
					}
				}
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

			setDataSource(data);
			//}
		},
		[dataSource]
	);

	const onCellClick = useCallback(async (event: any, { data, name }: any) => {
		let strCaption = '';
		if (data.g1_column_name != null && data.g1_column_name.length > 0) {
			strCaption += ` ${data.g1_column_name.replace('_', ' ').replace('_', ' ')} [${
				data[data.g1_column_name]
			}]`;
		}

		if (data.g2_column_name != null && data.g2_column_name.length > 0) {
			strCaption += ` ${data.g2_column_name.replace('_', ' ').replace('_', ' ')} [${
				data[data.g2_column_name]
			}]`;
		}
		if (data.g3_column_name != null && data.g3_column_name.length > 0) {
			strCaption += ` ${data.g3_column_name.replace('_', ' ').replace('_', ' ')} [${
				data[data.g3_column_name]
			}]`;
		}
		if (data.g4_column_name != null && data.g4_column_name.length > 0) {
			strCaption += ` ${data.g4_column_name.replace('_', ' ').replace('_', ' ')} [${
				data[data.g4_column_name]
			}]`;
		}
		if (data.g5_column_name != null && data.g5_column_name.length > 0) {
			strCaption += ` ${data.g5_column_name.replace('_', ' ').replace('_', ' ')} [${
				data[data.g5_column_name]
			}]`;
		}

		if (data.v1_column_name != null && data.v1_column_name.length > 0) {
			strCaption += ` ${data.v1_column_name.replace('_', ' ').replace('_', ' ')} [${
				data[data.v1_column_name]
			}]`;
		}
		if (data.v2_column_name != null && data.v2_column_name.length > 0) {
			strCaption += ` ${data.v2_column_name.replace('_', ' ').replace('_', ' ')} [${
				data[data.v2_column_name]
			}]`;
		}
		if (data.v3_column_name != null && data.v3_column_name.length > 0) {
			strCaption += ` ${data.v3_column_name.replace('_', ' ').replace('_', ' ')} [${
				data[data.v3_column_name]
			}]`;
		}
		if (data.v4_column_name != null && data.v4_column_name.length > 0) {
			strCaption += ` ${data.v4_column_name.replace('_', ' ').replace('_', ' ')} [${
				data[data.v4_column_name]
			}]`;
		}
		if (data.v5_column_name != null && data.v5_column_name.length > 0) {
			strCaption += ` ${data.v5_column_name.replace('_', ' ').replace('_', ' ')} [${
				data[data.v5_column_name]
			}]`;
		}

		let arrColums = [];
		arrColums = name.split('_');
		if (arrColums.length > 2 && arrColums[0] == 'col') {
			if (data.h1_column_name != null && data.h1_column_name.length > 0) {
				strCaption += ` ${data.h1_column_name} [${arrColums[arrColums.length - 1]}]`;
			}
			if (data.h2_column_name != null && data.h2_column_name.length > 0) {
				strCaption += ` ${data.h2_column_name} [${arrColums[arrColums.length - 2]}]`;
			}
		} else {
			strCaption = '';
		}

		//const strCaption = `Group[${data.group_display}] Purity[${data.purity}] Width[${data.width}] From Depth[${data.from_depth_per}] To Depth[${data.to_depth_per}] Column[${name}]`;
		setCaption(strCaption);
	}, []);

	const onKeyDownPara = async (event: any) => {
		const edited = await onTableKeyDown(event, inEdit, gridRefPara);

		if (!edited) {
			const grid = gridRefPara.current;
			const [rowIndex, colIndex] = grid.computedActiveCell;
			const rowCount = grid.count;

			if (event.key === 'Tab') {
				event.preventDefault();
			}

			if (event.key === 'Enter' && rowIndex === rowCount - 1) {
				//let isLastEditableColumn = false;
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
						//isLastEditableColumn = true;
						await delay(20);
					}
				}

				event.preventDefault();
			}
		}
	};

	const onKeyDownParaValue = async (event: any) => {
		const edited = await onTableKeyDown(event, inEdit, gridRefParaValue);

		if (!edited) {
			const grid = gridRefParaValue.current;
			const [rowIndex, colIndex] = grid.computedActiveCell;
			const rowCount = grid.count;

			if (event.key === 'Tab') {
				event.preventDefault();
			}

			if (event.key === 'Enter' && rowIndex === rowCount - 1) {
				//let isLastEditableColumn = false;
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
						//isLastEditableColumn = true;
						await delay(20);
					}
				}

				event.preventDefault();
			}
		}
	};

	const onCellClickPara = useCallback(async (event: any, { data }: any) => {
		// if (paraName != null && paraName.length > 0) {
		// 	dispatch(paraRuleActions.getOne(`${paraName}/${data.para_name}`));
		// } else {
		// 	setColumns([]);
		// 	setGroups([]);
		// 	setDataSource([]);
		// }

		setSelectPricePara(data.para_name);
		setCaption('');

		if (typeName != null && typeName.length > 0) {
			dispatch(paraRuleActions.getOne(`${typeName}/${data.para_name}`));
		} else {
			setColumns([]);
			setGroups([]);
			setDataSource([]);
		}
		dispatch(paraRuleActions.reset());
	}, []);

	const handleLoadButtonChange = () => {
		if (
			fileName.length > 0 &&
			shapeSeq != null &&
			shapeSeq > 0 &&
			paraName != null &&
			paraName.length > 0 &&
			priceParaName != null &&
			priceParaName.length > 0
		) {
			setLoading(true);
			dispatch(
				paraRuleActions.getOneParaRuleFile(
					`${fileName}/${shapeSeq}/${paraName}/${priceParaName}?purity_seq=${puritySeq}&size_seq=${rangeSeq}`
				)
			);
			setFileName([]);
		} else {
			setColumns([]);
			setGroups([]);
			setDataSource([]);
		}
		dispatch(paraRuleActions.reset());
	};

	const handleViewButtonChange = () => {
		if (
			shapeSeq != null &&
			shapeSeq > 0 &&
			paraName != null &&
			paraName.length > 0 &&
			priceParaName != null &&
			priceParaName.length > 0
		) {
			setLoading(true);
			dispatch(
				paraRuleActions.getOneParaRuleView(
					`${shapeSeq}/${paraName}/${priceParaName}?purity_seq=${puritySeq}&size_seq=${rangeSeq}`
				)
			);
		} else {
			setColumns([]);
			setGroups([]);
			setDataSource([]);
		}

		//dispatch(paraRuleActions.reset());
	};

	const handleDownloadformatButtonChange = () => {
		if (
			shapeSeq != null &&
			shapeSeq > 0 &&
			paraName != null &&
			paraName.length > 0 &&
			priceParaName != null &&
			priceParaName.length > 0
		) {
			setLoading(true);
			dispatch(
				paraRuleActions.getDownloadFormat(
					`'${paraName}'/'${priceParaName}'/${shapeSeq}?purity_seq=${puritySeq}&size_seq=${rangeSeq}`
				)
			);
		}

		//dispatch(paraRuleActions.reset());
	};

	return (
		<>
			<MainCard content={false} ref={refPage as any} tabIndex={-1}>
				<FormContainer
					onSuccess={() => onSubmit()}
					formContext={formContext}
					FormProps={{ autoComplete: 'off' }}>
					<Grid container spacing={1}>
						<Stack
							spacing={1}
							direction="row"
							alignItems="center"
							style={{ marginTop: '17px', marginLeft: '14px' }}>
							<Typography variant="subtitle1">Type</Typography>
							<Grid className="custom-pricetextfield">
								<AutocompleteElement
									loading={paraLoading}
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
											handleParaChange(event, value, reason, details),
										filterOptions: (options, state) =>
											handleFilterOptionsPara(options, state),
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
											return option.name;
										}
									}}
									name="para"
									options={paraOptions}
									textFieldProps={{
										InputProps: {},
										onChange: e => setParaInputValue(e.target.value),
										onFocus: () => {
											if (paraOptions && paraOptions.length === 0) {
												dispatch(
													paraRuleActions.getPara(
														`'DISC_TYPE'?page=1&limit=10&pagination=false`
													)
												);
											}
										}
									}}
								/>
							</Grid>
							<Typography variant="subtitle1">Shape</Typography>
							<Grid className="custom-pricetextfield">
								<AutocompleteElement
									loading={shapeLoading}
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
											handleShapeChange(event, value, reason, details),
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
											return option.name;
										}
									}}
									name="shape"
									options={shapeOptions}
									textFieldProps={{
										InputProps: {},
										onChange: e => setShapeInputValue(e.target.value),
										onFocus: () => {
											if (shapeOptions && shapeOptions.length === 0) {
												dispatch(
													shapesActions.get({
														QueryParams: `page=1&limit=10`
													})
												);
											}
										}
									}}
								/>
							</Grid>
							<Typography variant="subtitle1">Purity</Typography>
							<Grid className="custom-pricetextfield">
								<AutocompleteElement
									loading={purityLoading}
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
											handlePurityChange(event, value, reason, details),
										filterOptions: (options, state) =>
											handleFilterOptionsPurity(options, state),
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
											return option.name;
										}
									}}
									name="purity"
									options={purityOptions}
									textFieldProps={{
										InputProps: {},
										onChange: e => setPurityInputValue(e.target.value),
										onFocus: () => {
											if (purityOptions && purityOptions.length === 0) {
												dispatch(
													puritiesActions.get({
														QueryParams: `page=1&limit=1000&pagination=false&q=price_chart='true'`
													})
												);
											}
										}
									}}
								/>
							</Grid>
							<Typography variant="subtitle1">Size</Typography>
							<Grid className="custom-pricetextfield">
								<AutocompleteElement
									loading={rangeLoading}
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
											handleRangeChange(event, value, reason, details),
										filterOptions: (options, state) =>
											handleFilterOptionsRange(options, state),
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
											return option.name;
										}
									}}
									name="range"
									options={rangeOptions}
									textFieldProps={{
										InputProps: {},
										onChange: e => setRangeInputValue(e.target.value),
										onFocus: () => {
											if (rangeOptions && rangeOptions.length === 0) {
												dispatch(
													rangeActions.get({
														QueryParams: `type=RAPAPORT - POINTER&page=1&limit=1000&pagination=false`
													})
												);
											}
										}
									}}
								/>
							</Grid>
							{/* <div id="app"></div> */}
							<Button
								variant="contained"
								onClick={openUppyDashboard}
								style={{ height: '25px' }}>
								File Import
							</Button>
							<Button
								variant="contained"
								onClick={handleLoadButtonChange}
								style={{ height: '25px' }}>
								Load
							</Button>
							<Button
								variant="contained"
								onClick={handleViewButtonChange}
								style={{ height: '25px' }}>
								View
							</Button>
							<Button
								variant="contained"
								onClick={handleDownloadformatButtonChange}
								style={{ height: '25px' }}>
								Download Format
							</Button>
						</Stack>
						<Grid container sx={{ mt: 1.5, mb: 1.5 }} style={{ marginLeft: '10px' }}>
							<Grid item xs={2}>
								<Stack spacing={1}>
									<MainCard content={false} tabIndex="0">
										<ReactDataGrid
											handle={setGridRefPara}
											idProperty="seq_no"
											nativeScroll={true}
											style={gridParaStyle}
											activeCell={activeCellPara}
											onActiveCellChange={setActiveCellPara}
											onKeyDown={onKeyDownPara}
											onCellClick={onCellClickPara}
											editable={true}
											columns={columnsPara}
											dataSource={dataSourcePara}
											rowHeight={21}
											headerHeight={22}
											showZebraRows={true}
											showColumnMenuTool={false}
										/>
									</MainCard>
								</Stack>
								<Stack spacing={1}>
									<MainCard content={false} tabIndex="0">
										<ReactDataGrid
											handle={setGridRefParaValue}
											idProperty="seq_no"
											nativeScroll={true}
											style={gridParaValueStyle}
											activeCell={activeCellParaValue}
											onActiveCellChange={setActiveCellParaValue}
											onKeyDown={onKeyDownParaValue}
											editable={true}
											columns={columnsParaValue}
											dataSource={dataSourceParaValue}
											rowHeight={21}
											headerHeight={22}
											showZebraRows={true}
											showColumnMenuTool={false}
										/>
									</MainCard>
								</Stack>
							</Grid>
							<Grid item xs={10}>
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
											onKeyDown={onKeyDown}
											onEditComplete={onEditComplete}
											onEditStart={onEditStart}
											onEditStop={onEditStop}
											onCellClick={onCellClick}
											editable={true}
											columns={columns}
											groups={groups}
											dataSource={dataSource}
											rowHeight={20}
											headerHeight={22}
											groupNestingSize={22}
											rowClassName={rowClassName}
											rowStyle={rowStyle}
											showZebraRows={true}
											showColumnMenuTool={false}
										/>
									</MainCard>
								</Stack>
							</Grid>
						</Grid>
					</Grid>
					<button type="submit" hidden />
				</FormContainer>
				<Grid container sx={{ mt: 1.5, mb: 1.5 }}>
					<Grid item xs={12}>
						<Stack
							sx={{ mr: 1.5 }}
							direction="row"
							spacing={1}
							justifyContent="right"
							alignItems="center">
							<div
								style={{
									width: '94%',
									marginLeft: '1.8rem',
									display: 'flex',
									textTransform: 'capitalize'
								}}>
								<p className="xls-file-para">{caption}</p>
							</div>
							<Button
								ref={buttonRef}
								onClick={e => handleSubmit(e)}
								onKeyDown={e => (e.key === 'Enter' ? handleSubmit(e) : '')}
								disableElevation
								disabled={isSubmitting}
								type="submit"
								variant="contained"
								color="primary">
								{isSubmitting ? (
									<CircularProgress size={24} color="success" />
								) : (
									formatMessage({ id: 'Save' })
								)}
							</Button>
							<Button
								variant="outlined"
								color="secondary"
								onClick={e => handleCancel(e)}>
								{formatMessage({ id: 'Cancel' })}
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</MainCard>

			{/* add customer dialog */}
		</>
	);
};

export default ParaRules;
