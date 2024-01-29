import { KeyedObject } from 'types/root';

// ==============================|| RAPAPORTS TYPES  ||============================== //

/* --- STATE --- */
export type rapaportsState = {
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

	[key: string]: any;
};

export interface RapaportsActionProps {
	type: string;
	payload?: rapaportsState;
}

export type ContainerState = rapaportsState;
