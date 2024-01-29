import { KeyedObject } from 'types/root';

// ==============================|| LABS TYPES  ||============================== //

/* --- STATE --- */
export type labsState = {
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

export interface LabsActionProps {
	type: string;
	payload?: labsState;
}

export type ContainerState = labsState;
