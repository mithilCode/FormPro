// third-party
import { KeyedObject } from 'types/root';

// ==============================|| PRICE CHART TYPES  ||============================== //

/* --- STATE --- */
export type priceChartsState = {
	getLoading?: boolean;
	getError?: KeyedObject | null;
	getSuccess?: KeyedObject | null;

	loading?: boolean;

	addError?: KeyedObject | null;
	addSuccess?: KeyedObject | null;

	editError?: KeyedObject | null;
	editSuccess?: KeyedObject | null;

	deleteError?: KeyedObject | null;
	deleteSuccess?: KeyedObject | null;

	getOneLoading?: boolean;
	getOneError?: KeyedObject | null;
	getOneSuccess?: KeyedObject | null;

	getDownloadFormatLoading?: boolean;
	getDownloadFormatError?: KeyedObject | null;
	getDownloadFormatSuccess?: KeyedObject | null;

	getParaLoading?: boolean;
	getParaError?: KeyedObject | null;
	getParaSuccess?: KeyedObject | null;

	[key: string]: any;
};

export interface PriceChartActionProps {
	type: string;
	payload?: priceChartsState;
}

export type ContainerState = priceChartsState;
