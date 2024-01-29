// third-party
import { KeyedObject } from 'types/root';

// ==============================|| PRICE CHART TYPES  ||============================== //

/* --- STATE --- */
export type paraRulesState = {
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

	getOneParaRuleViewLoading?: boolean;
	getOneParaRuleViewError?: KeyedObject | null;
	getOneParaRuleViewSuccess?: KeyedObject | null;

	getOneParaRuleFileLoading?: boolean;
	getOneParaRuleFileError?: KeyedObject | null;
	getOneParaRuleFileSuccess?: KeyedObject | null;

	getParaLoading?: boolean;
	getParaError?: KeyedObject | null;
	getParaSuccess?: KeyedObject | null;

	[key: string]: any;
};

export interface PriceChartActionProps {
	type: string;
	payload?: paraRulesState;
}

export type ContainerState = paraRulesState;
