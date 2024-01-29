import { KeyedObject } from 'types/root';

// ==============================|| INVOICES TYPES  ||============================== //

/* --- STATE --- */
export type invoicesState = {
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

	getParaLoading?: boolean;
	getParaError?: KeyedObject | null;
	getParaSuccess?: KeyedObject | null;

	getOneDetLoading?: boolean;
	getOneDetError?: KeyedObject | null;
	getOneDetSuccess?: KeyedObject | null;

	getColumnsSettingLoading?: boolean;
	getColumnsSettingError?: KeyedObject | null;
	getColumnsSettingSuccess?: KeyedObject | null;

	getVendorLoading?: boolean;
	getVendorError?: KeyedObject | null;
	getVendorSuccess?: KeyedObject | null;

	getTenderNoLoading?: boolean;
	getTenderNoError?: KeyedObject | null;
	getTenderNoSuccess?: KeyedObject | null;

	getPartyLoading?: boolean;
	getPartyError?: KeyedObject | null;
	getPartySuccess?: KeyedObject | null;

	getBrokerLoading?: boolean;
	getBrokerError?: KeyedObject | null;
	getBrokerSuccess?: KeyedObject | null;

	getBillTypeLoading?: boolean;
	getBillTypeError?: KeyedObject | null;
	getBillTypeSuccess?: KeyedObject | null;

	[key: string]: any;
};

export interface InvoicesActionProps {
	type: string;
	payload?: invoicesState;
}

export type ContainerState = invoicesState;
