/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Stack } from '@mui/material';
import { FormContainer } from '@app/components/rhfmui';
import MainCard from '@components/MainCard';
import { FormSchema, IFormInput } from '@pages/master/tenderView/models/TenderView1';
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
import TenderViewAssortment from './TenderLotViewAssortment';

const gridStyle = { minHeight: 550 };
let newRowDataSource: any;

// ==============================|| TENDER LOT PLAN COMMENTS ||============================== //

interface Props {
	passProps?: any;
	tenderLotSeq?: any;
	CommemtsOptions?: any;
	currentAction?: any;
	editMode?: any;
	view1Options?: any;
}

const TenderViewCheckerwise = ({
	passProps,
	CommemtsOptions,
	tenderLotSeq,
	currentAction,
	editMode,
	view1Options
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
				name: 'checker',
				header: 'Checker',
				// width: 100,
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
				// width: 100,
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
				name: 'wgt',
				header: 'Rgh Wgt',
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
				name: 'pol_size',
				header: 'Pol Wgt',
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
				name: 'net_rate',
				header: 'Pol Avg',
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
				name: 'net_value',
				header: 'Pol Value',
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
				name: 'rough_rate',
				header: 'Rgh Avg',
				defaultFlex: 1,
				sortable: false,
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

	// add your States  👿
	const [pageState, setPageState] = useState<InitialState>({
		isValid: false,
		values: {},
		touched: null,
		errors: null
	});

	const [dataSource, setDataSource] = useState<any>([]);
	const [columns] = useState<any>(getColumns());

	const [view2Options, setView2Options] = useState<any>([]);
	const [assortmentPlanning, setAssortmentPlanning] = useState<any>([]);
	const [userSeq, setUserSeq] = useState('');

	const handleRowSelect = useCallback((rowData: any) => {
		setUserSeq(rowData.data?.ins_user_seq);
	}, []);

	const handleRowExpand = useCallback<any>((expandedRows: any) => {
		setUserSeq(expandedRows.data?.ins_user_seq);
	}, []);

	useEffect(() => {
		return () => {
			dispatch(tenderlotplansActions.reset());
		};
	}, []);

	useEffect(() => {
		if (view1Options) {
			setPageState(value => ({
				...value,
				values: {
					...pageState.values,
					para: view1Options
				}
			}));
			setDataSource(view1Options);
		}
	}, [view1Options]);

	useEffect(() => {
		newRowDataSource = dataSource;
		passProps(newRowDataSource);
	}, [dataSource]);

	useEffect(() => {
		if (getOneSuccess) {
			if (getOneSuccess?.results) {
				setView2Options(getOneSuccess?.results.tender_assort);
			}
		}
	}, [getOneSuccess]);

	const childView2Props = (array: any) => {
		setPageState(pageState => ({
			...pageState,
			values: {
				...pageState.values,
				tender_assort: array
			}
		}));
	};

	const childAssortmentToPlanProps = (obj: { userSeq: string; data: object }) => {
		setUserSeq(obj.userSeq);
		setAssortmentPlanning(obj.data);
	};

	const accountExpandHeight = 500;

	const renderContactsGrid = () => {
		return (
			<TenderViewAssortment
				passProps={childView2Props}
				viewAssortOptions={view2Options}
				tenderLotSeq={tenderLotSeq}
				assortmentToPlanOptions={childAssortmentToPlanProps}
			/>
		);
	};

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
									style={gridStyle}
									editable={editMode}
									columns={columns}
									dataSource={dataSource}
									rowHeight={21}
									headerHeight={22}
									renderDetailsGrid={renderContactsGrid}
									rowExpandHeight={accountExpandHeight}
									onRowClick={handleRowSelect}
									onRowExpand={handleRowExpand}
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

export default TenderViewCheckerwise;
