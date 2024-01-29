import { KeyedObject } from 'types/root';

// ==============================|| EMPS TYPES  ||============================== //

/* --- STATE --- */
export type empsState = {
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

	getOneDetLoading?: boolean;
	getOneDetError?: KeyedObject | null;
	getOneDetSuccess?: KeyedObject | null;

	getParaLoading?: boolean;
	getParaError?: KeyedObject | null;
	getParaSuccess?: KeyedObject | null;

	getDesigRoleLoading?: boolean;
	getDesigRoleError?: KeyedObject | null;
	getDesigRoleSuccess?: KeyedObject | null;

	[key: string]: any;
};

export interface EmpsActionProps {
	type: string;
	payload?: empsState;
}

export type ContainerState = empsState;
