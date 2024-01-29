import { KeyedObject } from 'types/root';

// ==============================|| SYMMS TYPES  ||============================== //

/* --- STATE --- */
export type symmsState = {
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

export interface SymmsActionProps {
	type: string;
	payload?: symmsState;
}

export type ContainerState = symmsState;
