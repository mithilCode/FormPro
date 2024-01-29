import { KeyedObject } from 'types/root';

// ==============================|| NONESALEABLES TYPES  ||============================== //

/* --- STATE --- */
export type nonesaleablesState = {
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

	getTensionLoading?: boolean;
	getTensionError?: KeyedObject | null;
	getTensionSuccess?: KeyedObject | null;

	getMilkyLoading?: boolean;
	getMilkyError?: KeyedObject | null;
	getMilkySuccess?: KeyedObject | null;

	getNattsLoading?: boolean;
	getNattsError?: KeyedObject | null;
	getNattsSuccess?: KeyedObject | null;

	[key: string]: any;
};

export interface NonesaleablesActionProps {
	type: string;
	payload?: nonesaleablesState;
}

export type ContainerState = nonesaleablesState;
