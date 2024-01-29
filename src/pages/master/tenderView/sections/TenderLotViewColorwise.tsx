/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Stack, Typography } from '@mui/material';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { FormSchema, IFormInput } from '@pages/master/tenderlotplan/models/TenderLotPlanComments';
import { TextFieldEditor } from '@components/table/editors';
import ReactDataGrid from '@inovua/reactdatagrid-enterprise';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useTenderlotplansSlice } from '@pages/master/tenderlotplan/store/slice';
// import { tenderlotplansSelector } from '@pages/master/tenderlotplan/store/slice/tenderlotplans.selectors';

import {
	//InitialQueryParam,
	InitialState
} from '@utils/helpers';
import '@inovua/reactdatagrid-community/index.css';
import { tenderlotplansSelector } from '@pages/master/tenderlotplan/store/slice/tenderlotplans.selectors';

const gridStyle = { minHeight: 200 };
let newRowDataSource: any;

// ==============================|| TENDER LOT PLAN COMMENTS ||============================== //

interface Props {
	passProps?: any;
	tenderLotSeq?: any;
	colorsDataOptions?: any;
	currentAction?: any;
	editMode?: any;
}

const TenderViewColorwise = ({
	passProps,
	colorsDataOptions,
	tenderLotSeq,
	currentAction,
	editMode
}: Props) => {
	// add your Dispatch 👿
	const dispatch = useDispatch();

	// *** Tenderlotplans State *** //
	const { actions: tenderlotplansActions } = useTenderlotplansSlice();
	const tenderlotplansState = useSelector(tenderlotplansSelector);
	const { getOneSuccess } = tenderlotplansState;

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
				name: 'color',
				header: 'Col',
				headerAlign: 'center',
				textAlign: 'center',
				minWidth: 40,
				maxWidth: 50,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				}
			},
			{
				name: 'pol_wgt',
				header: 'Pol Wgt',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 40,
				maxWidth: 55,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				},
				render: ({ data }: any) => {
					let valueper = parseFloat(data.pol_wgt);
					let result = valueper.toFixed(2);
					if (!isNaN(valueper)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
				}
			},
			{
				name: 'pol_per',
				header: 'Pol %',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 40,
				maxWidth: 60,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'text'
				},
				render: ({ data }: any) => {
					let valueper = parseFloat(data.pol_per);
					let result = valueper.toFixed(2);
					if (!isNaN(valueper)) {
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
				minWidth: 50,
				maxWidth: 70,
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
				name: 'value_per',
				header: 'Val %',
				headerAlign: 'end',
				textAlign: 'right',
				minWidth: 40,
				maxWidth: 48,
				sortable: false,
				renderEditor: (editorProps: any) => {
					return <TextFieldEditor {...editorProps} />;
				},
				editorProps: {
					type: 'number'
				},
				render: ({ data }: any) => {
					let valueper = parseFloat(data.value_per);
					let result = valueper.toFixed(2);
					if (!isNaN(valueper)) {
						return <Typography>{String(result)}</Typography>;
					} else {
						return <Typography>{''}</Typography>;
					}
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

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns] = useState<any>(getColumns());

	useEffect(() => {
		return () => {
			dispatch(tenderlotplansActions.reset());
		};
	}, []);
	useEffect(() => {
		if (colorsDataOptions) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: colorsDataOptions
				}
			}));
			setDataSource(colorsDataOptions);
		}
	}, [colorsDataOptions]);

	useEffect(() => {
		newRowDataSource = dataSource;
		passProps(newRowDataSource);
	}, [dataSource]);

	return (
		<MainCard content={false} tabIndex={-1}>
			<FormContainer>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Stack spacing={1}>
							<MainCard content={false} tabIndex="0">
								<ReactDataGrid
									idProperty="seq_no"
									nativeScroll={true}
									// style={gridStyle}
									editable={editMode}
									columns={columns}
									dataSource={dataSource}
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

export default TenderViewColorwise;
