import { KeyedObject } from 'types/root';

// ==============================|| STATE TYPES  ||============================== //

/* --- STATE --- */
export type stateState = {
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

export interface stateActionProps {
	type: string;
	payload?: stateState;
}

export type ContainerState = stateState;
