
import { KeyedObject } from 'types/root';

// ==============================|| COLORS TYPES  ||============================== //

/* --- STATE --- */
export type colorsState = {
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

export interface ColorsActionProps {
	type: string;
	payload?: colorsState;
}

export type ContainerState = colorsState;
