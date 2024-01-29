import { KeyedObject } from 'types/root';

// ==============================|| KAPANS TYPES  ||============================== //

/* --- STATE --- */
export type kapansState = {
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

	getAlabLoading?: boolean;
	getAlabError?: KeyedObject | null;
	getAlabSuccess?: KeyedObject | null;

	getOneDetLoading?: boolean;
	getOneDetError?: KeyedObject | null;
	getOneDetSuccess?: KeyedObject | null;

	[key: string]: any;
};

export interface kapansActionProps {
	type: string;
	payload?: kapansState;
}

export type ContainerState = kapansState;
