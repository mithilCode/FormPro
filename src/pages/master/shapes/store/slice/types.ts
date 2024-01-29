import { KeyedObject } from 'types/root';

// ==============================|| SHAPES TYPES  ||============================== //

/* --- STATE --- */
export type shapesState = {
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

export interface ShapesActionProps {
	type: string;
	payload?: shapesState;
}

export type ContainerState = shapesState;
