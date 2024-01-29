import { KeyedObject } from 'types/root';

// ==============================|| TENDERVIEWS TYPES  ||============================== //

/* --- STATE --- */
export type tenderviewsState = {
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

	getSupplierLoading?: boolean;
	getSupplierError?: KeyedObject | null;
	getSupplierSuccess?: KeyedObject | null;

	getTenderNoLoading?: boolean;
	getTenderNoError?: KeyedObject | null;
	getTenderNoSuccess?: KeyedObject | null;

	getTenderNoSelectLoading?: boolean;
	getTenderNoSelectError?: KeyedObject | null;
	getTenderNoSelectSuccess?: KeyedObject | null;

	[key: string]: any;
};

export interface tenderviewsActionProps {
	type: string;
	payload?: tenderviewsState;
}

export type ContainerState = tenderviewsState;
