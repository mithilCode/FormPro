import { KeyedObject } from 'types/root';

// ==============================|| FROM TO PRICING TYPES  ||============================== //

/* --- STATE --- */
export type formtopricingsState = {
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

	getTenderNoSelectLoading?: boolean;
	getTenderNoSelectError?: KeyedObject | null;
	getTenderNoSelectSuccess?: KeyedObject | null;

	getViewLoading?: boolean;
	getViewError?: KeyedObject | null;
	getViewSuccess?: KeyedObject | null;

	getParaLoading?: boolean;
	getParaError?: KeyedObject | null;
	getParaSuccess?: KeyedObject | null;

	getFTparaTypeLoading?: boolean;
	getFTparaTypeError?: KeyedObject | null;
	getFTparaTypeSuccess?: KeyedObject | null;

	getFTparaViewLoading?: boolean;
	getFTparaViewError?: KeyedObject | null;
	getFTparaViewSuccess?: KeyedObject | null;

	getParaOneLoading?: boolean;
	getParaOneError?: KeyedObject | null;
	getParaOneSuccess?: KeyedObject | null;

	[key: string]: any;
};

export interface FormtopricingsActionProps {
	type: string;
	payload?: formtopricingsState;
}

export type ContainerState = formtopricingsState;
