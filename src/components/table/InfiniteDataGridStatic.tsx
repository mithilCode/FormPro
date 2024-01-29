import { useCallback, useState } from 'react';

import MainCard from '@components/MainCard';
import ScrollX from '@components/ScrollX';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { TypeDataGridProps } from '@inovua/reactdatagrid-community/types';

import '@inovua/reactdatagrid-community/index.css';

const gridStyle = { minHeight: 600 };

interface HasConstructor {
	onTableDataChange: any;
	defaultFilterValue?: any;
	initParams?: any;
	onRowClick?: any;
}

export default function InfiniteDataGridStatic({
	columns = [],
	dataSource = [],
	onTableDataChange,
	defaultFilterValue,
	initParams,
	onRowClick,
	// skip = 0,
	// filterValue,
	...rest
}: Partial<TypeDataGridProps> & HasConstructor): JSX.Element {
	const [sortInfo, setSortInfo] = useState([]);
	const [limit, setLimit] = useState(initParams.limit ? initParams.limit : 10);
	const [skip, setSkip] = useState(0);
	const [filterValue, setFilterValue] = useState(defaultFilterValue);
	const [preventDuplicate, setPreventDuplicate] = useState(null);

	// useEffect(() => {
	// 	console.log('USE EFFECTCTTCTCT', initParams);

	// 	// setLimit(initParams.limit);
	// 	// setSkip(initParams.skip);

	// 	// setSortInfo(sortInfo);
	// }, []);

	const onSortInfoChange = useCallback((sortInfo: any) => {
		console.log('sortInfo', sortInfo);

		onTableDataChange({ sortInfo });
		setSortInfo(sortInfo);

		// setSortInfo(sortInfo);
	}, []);

	const onLimitChange = useCallback((limit: number) => {
		console.log('LimitInfo', limit);

		onTableDataChange({ limit });
		setLimit(limit);
	}, []);

	const onSkipChange = useCallback((skip: number) => {
		console.log('SkipInfo', skip);
		onTableDataChange({ page: skip });
		setSkip(skip);
	}, []);

	const onFilterValueChange = (value: any) => {
		console.log('filterValue', value, preventDuplicate);
		if (JSON.stringify(value) !== JSON.stringify(preventDuplicate)) {
			onTableDataChange({ filterBy: value });
			setFilterValue(value);
		}
		setPreventDuplicate(value);
	};

	return (
		<MainCard content={false}>
			<ScrollX>
				<ReactDataGrid
					{...rest}
					style={gridStyle}
					idProperty="uniqueId"
					columns={columns}
					dataSource={dataSource}
					sortInfo={sortInfo}
					onSortInfoChange={onSortInfoChange}
					pagination
					limit={limit}
					onLimitChange={onLimitChange}
					skip={skip}
					onSkipChange={onSkipChange}
					filterValue={filterValue}
					onFilterValueChange={onFilterValueChange}
					onRowClick={onRowClick}
					//enableColumnFilterContextMenu={false}
				/>
			</ScrollX>
		</MainCard>
	);
}
