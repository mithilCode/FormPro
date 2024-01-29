import { KeyedObject } from 'types/root';

// ==============================|| TENDER TYPES  ||============================== //

/* --- STATE --- */
export type tenderState = {
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

	[key: string]: any;
};

export interface tenderActionProps {
	type: string;
	payload?: tenderState;
}

export type ContainerState = tenderState;
