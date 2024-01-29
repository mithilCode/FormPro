/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Stack, Typography } from '@mui/material';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { FormSchema, IFormInput } from '@pages/master/tenderView/models/TenderView3';
import { AutocompleteEditor, TextFieldEditor } from '@components/table/editors';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useTenderlotplansSlice } from '@pages/master/tenderlotplan/store/slice';
import { tenderlotplansSelector } from '@pages/master/tenderlotplan/store/slice/tenderlotplans.selectors';

import {
	//InitialQueryParam,
	InitialState
} from '@utils/helpers';
import '@inovua/reactdatagrid-community/index.css';
import TenderViewPlanning from './TenderLotViewPlanning';

const gridStyle = { minHeight: 310 };

let newRowDataSource: any;

// ==============================|| TENDER LOT PLAN COMMENTS ||============================== //

interface Props {
	passProps?: any;
	tenderLotSeq?: any;
	CommemtsOptions?: any;
	assortmentOptions?: any;
	currentAction?: any;
	editMode?: any;
	viewAssortOptions?: any;
	assortmentToPlanOptions?: any;
	insSeq?: any;
}

const TenderViewAssortment = ({
	passProps,
	tenderLotSeq,
	editMode,
	assortmentOptions,
	insSeq
}: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// *** Tenderlotplans State *** //
	const { actions: tenderlotplansActions } = useTenderlotplansSlice();
	const tenderlotplansState = useSelector(tenderlotplansSelector);
	const { getOnePlanningSuccess } = tenderlotplansState;

	// add your React Hook Form  👿
	const formContext = useForm<IFormInput>({
		resolver: zodResolver(FormSchema),
		mode: 'onChange',
		reValidateMode: 'onChange'
	});

	const { reset } = formContext;

	const getColumns = () => {
		return [
			{ name: 'seq_no', header: 'seq_no', defaultVisible: false },
			{
				name: 'sr_no',
				header: 'Sr.',
				headerAlign: 'center',
				textAlign: 'center',
				// width: 100,
				minWidth: 30,
				maxWidth: 70,
				defaultFlex: 1,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'pcs',
				header: 'Pcs',
				minWidth: 30,
				maxWidth: 70,
				headerAlign: 'end',
				textAlign: 'right',
				// width: 200,
				defaultFlex: 1,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'wgt',
				header: 'Wgt',
				headerAlign: 'end',
				textAlign: 'right',
				// width: 100,
				minWidth: 30,
				maxWidth: 70,
				group: 'rgh',
				defaultFlex: 1,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					let weight = parseFloat(data.wgt);
					let result = weight.toFixed(2);
					if (!isNaN(weight)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'rgh_size',
				header: 'Size',
				// width: 100,
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 70,
				group: 'rgh',
				defaultFlex: 1,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let size = data && data.pcs ? data.wgt / data.pcs : 0;
					return <Typography>{size.toFixed(2)}</Typography>;
				}
			},

			{
				name: 'pol_wgt',
				header: 'Wgt',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 70,
				// width: 110,
				group: 'pol',
				defaultFlex: 1,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				}
			},

			{
				name: 'pol_per',
				header: '%',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 70,
				// width: 110,
				defaultFlex: 1,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				}
			},
			{
				name: 'color',
				header: 'Col',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: true,
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
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.color && data.color.name ? data.color.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'purity',
				header: 'Pur',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: true,
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
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.purity && data.purity.name ? data.purity.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'fls',
				header: 'Fls',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: true,
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
				render: ({ data, value }: any) => {
					return (
						<Typography>
							{data && data.fls && data.fls.name ? data.fls.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'rate',
				header: 'Rate',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 100,
				// width: 110,
				defaultFlex: 1,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					let weight = parseFloat(data.rate);
					let result = weight.toFixed(0);
					if (!isNaN(weight)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'value',
				header: 'Value',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 30,
				maxWidth: 100,
				// width: 110,
				defaultFlex: 1,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					let values = parseFloat(data.value);
					let result = values.toFixed(0);
					if (!isNaN(values)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'comments',
				header: 'Comments',
				// width: 110,
				defaultFlex: 1,
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

	const groups = [
		{ name: 'pol', header: 'Polish' },
		{ name: 'rgh', header: 'Rgh' }
	];

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns] = useState<any>(getColumns());
	const [activeCell, setActiveCell] = useState<any>([0, 0]);

	const [viewPlanningOptions, setViewPlanningOptions] = useState<any>([]);
	const [selectedRow, setSelectedRow] = useState<any>(null);

	// const handleRowSelect = useCallback<any>((rowData: any) => {
	// 	setSelectedRow(rowData?.data);
	// }, []);

	const handleRowExpand = useCallback<any>((rowData: any) => {
		setSelectedRow(rowData?.data);
	}, []);

	const handleRowCollapse = useCallback<any>(() => {
		setSelectedRow(null);
	}, []);

	useEffect(() => {
		return () => {
			dispatch(tenderlotplansActions.reset());
		};
	}, []);

	useEffect(() => {
		if (assortmentOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: assortmentOptions
				}
			}));
			setActiveCell([0, 0]);

			setDataSource(assortmentOptions);
		}
	}, [assortmentOptions]);

	useEffect(() => {
		if (selectedRow) {
			dispatch(
				tenderlotplansActions.getOnePlanning({
					QueryParams: `${selectedRow?.seq_no}/${selectedRow?.tender_lot_det_seq}?ins_user_seq=${insSeq}`
				})
			);
		}
	}, [selectedRow]);

	useEffect(() => {
		if (getOnePlanningSuccess) {
			if (getOnePlanningSuccess?.results) {
				setViewPlanningOptions(getOnePlanningSuccess?.results.tender_plan);
			}
		}
	}, [getOnePlanningSuccess]);

	useEffect(() => {
		newRowDataSource = dataSource;
		passProps(newRowDataSource);
	}, [dataSource]);

	const childViewPlanningProps = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				tender_plan: array
			}
		}));
	};

	const renderPlanningGrid = () => {
		return (
			<TenderViewPlanning
				passProps={childViewPlanningProps}
				viewPlanningOptions={viewPlanningOptions}
				tenderLotSeq={tenderLotSeq}
			/>
		);
	};

	const accountExpandHeight = 260;

	return (
		<MainCard content={false} tabIndex={-1}>
			<FormContainer>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Stack spacing={1}>
							<MainCard content={false} tabIndex="0">
								<ReactDataGrid
									idProperty="seq_no"
									activeCell={activeCell}
									nativeScroll={true}
									style={gridStyle}
									editable={editMode}
									columns={columns}
									dataSource={dataSource}
									rowHeight={21}
									headerHeight={22}
									renderDetailsGrid={renderPlanningGrid}
									rowExpandHeight={accountExpandHeight}
									onRowExpand={handleRowExpand}
									onRowCollapse={handleRowCollapse}
									showColumnMenuTool={false}
									showZebraRows={false}
									groups={groups.map(group => ({
										name: group.name,
										header: (
											<span
												key={group.name}
												style={{
													display: 'flex',
													justifyContent: 'center'
												}}>
												{group.header}
											</span>
										)
									}))}
								/>
							</MainCard>
						</Stack>
					</Grid>
				</Grid>
				<button type="submit" hidden />
			</FormContainer>
		</MainCard>
	);
};

export default TenderViewAssortment;
