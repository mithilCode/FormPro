/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Stack, Typography } from '@mui/material';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { FormSchema, IFormInput } from '@pages/master/tenderlotplan/models/TenderLotPlanComments';
import { AutocompleteEditor, TextFieldEditor } from '@components/table/editors';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { useTenderlotplansSlice } from '@pages/master/tenderlotplan/store/slice';
import { InitialState } from '@utils/helpers';
import '@inovua/reactdatagrid-community/index.css';

const gridStyle = { minHeight: 160 };
let newRowDataSource: any;

// ==============================|| TENDER LOT PLAN COMMENTS ||============================== //

interface Props {
	passProps?: any;
	tenderLotSeq?: any;
	SumOptions?: any;
	currentAction?: any;
	editMode?: any;
}

const TenderViewSumms = ({
	passProps,
	SumOptions,
	tenderLotSeq,
	currentAction,
	editMode
}: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// *** Tenderlotplans State *** //
	const { actions: tenderlotplansActions } = useTenderlotplansSlice();

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
				name: 'shape',
				header: 'Shape *',
				minWidth: 30,
				maxWidth: 70,
				addInHidden: false,
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
							{data && data.shape && data.shape.name ? data.shape.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'pol_pcs',
				header: 'Pcs *',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 40,
				addInHidden: false,
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
				minWidth: 20,
				maxWidth: 40,
				addInHidden: false,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				}
			},
			{
				name: 'pol_size',
				header: 'Size *',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 40,
				addInHidden: false,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let tmpsize = parseFloat(data.pol_size);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(tmpsize)) {
						let result = tmpsize.toFixed(2);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'pol_wgt',
				header: 'Wgt',
				group: 'pol',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 20,
				maxWidth: 40,
				sortable: false,
				editable: false,
				addInHidden: false,
				skipNavigation: true,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let tmpsize = parseFloat(data.pol_size);
					let tmppcs = parseFloat(data.pol_pcs);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(tmpsize) && !isNaN(tmppcs) && tmppcs !== 0) {
						let result = (tmpsize * tmppcs).toFixed(2);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'color_1',
				header: 'Col',
				group: '1',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.color_1 && data.color_1.name ? data.color_1.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'color_1_per',
				header: '%',
				group: '1',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let color_1_per = parseFloat(data.color_1_per);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(color_1_per)) {
						let result = color_1_per.toFixed(2);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'color_2',
				header: 'Col',
				group: '2',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.color_2 && data.color_2.name ? data.color_2.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'color_2_per',
				header: '%',
				group: '2',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let color_2_per = parseFloat(data.color_2_per);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(color_2_per)) {
						let result = color_2_per.toFixed(2);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'purity_1',
				header: 'Pur',
				group: '1',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.purity_1 && data.purity_1.name ? data.purity_1.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'purity_1_per',
				header: '%',
				group: '1',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let purity_1_per = parseFloat(data.purity_1_per);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(purity_1_per)) {
						let result = purity_1_per.toFixed(2);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'purity_2',
				header: 'Pur',
				group: '2',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.purity_2 && data.purity_2.name ? data.purity_2.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'purity_2_per',
				header: '%',
				group: '2',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let purity_2_per = parseFloat(data.purity_2_per);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(purity_2_per)) {
						let result = purity_2_per.toFixed(2);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'fls_1',
				header: 'Fls',
				group: '1',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.fls_1 && data.fls_1.name ? data.fls_1.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'fls_1_pcs',
				header: 'Pcs',
				group: '1',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let fls_1_pcs = parseFloat(data.fls_1_pcs);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(fls_1_pcs)) {
						let result = fls_1_pcs.toFixed(0);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'fls_2',
				header: 'Fls',
				group: '2',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.fls_2 && data.fls_2.name ? data.fls_2.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'fls_2_pcs',
				header: 'Pcs',
				group: '2',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let fls_2_pcs = parseFloat(data.fls_2_pcs);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(fls_2_pcs)) {
						let result = fls_2_pcs.toFixed(0);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'fls_3',
				header: 'Fls',
				group: '3',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
				addInHidden: false,
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
							{data && data.fls_3 && data.fls_3.name ? data.fls_3.name : ''}
						</Typography>
					);
				}
			},
			{
				name: 'fls_3_pcs',
				header: 'Pcs',
				group: '3',
				headerAlign: 'end',
				textAlign: 'right',
				sortable: false,
				minWidth: 20,
				maxWidth: 40,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data, value }: any) => {
					let fls_3_pcs = parseFloat(data.fls_3_pcs);
					// Check if tmpwgt and tmppcs are valid numbers
					if (!isNaN(fls_3_pcs)) {
						let result = fls_3_pcs.toFixed(0);
						return <Typography>{result}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'prop',
				header: 'Prop',
				sortable: false,
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 30,
				maxWidth: 50,
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
							{data && data.prop && data.prop.name ? data.prop.name : ''}
						</Typography>
					);
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
		{ name: 'plan', header: 'Plan' },
		{ name: 'pol', header: 'Polish' },
		{ name: '1', header: '1' },
		{ name: '2', header: '2' },
		{ name: '3', header: '3' }
	];

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns, setColumns] = useState<any>(getColumns());
	const [activeCell, setActiveCell] = useState<any>([0, 0]);

	useEffect(() => {
		return () => {
			dispatch(tenderlotplansActions.reset());
		};
	}, []);

	useEffect(() => {
		if (SumOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: SumOptions
				}
			}));
			setActiveCell([0, 0]);
			setDataSource(SumOptions);
		}
	}, [SumOptions]);

	useEffect(() => {
		newRowDataSource = dataSource;
		passProps(newRowDataSource);
		// passProps(pageState.values?.para);
	}, [dataSource]);

	/*CHECKER DROPDOWN*/

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
									rowHeight={21}
									headerHeight={22}
									showColumnMenuTool={false}
									showZebraRows={false}
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

export default TenderViewSumms;
