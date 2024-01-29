import { KeyedObject } from 'types/root';

// ==============================|| PURITIES TYPES  ||============================== //

/* --- STATE --- */
export type puritiesState = {
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

export interface puritiesActionProps {
	type: string;
	payload?: puritiesState;
}

export type ContainerState = puritiesState;
