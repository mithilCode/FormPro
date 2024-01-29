import { KeyedObject } from 'types/root';

// ==============================|| DEPARTMENTS TYPES  ||============================== //

/* --- STATE --- */
export type departmentState = {
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

	addDetError?: KeyedObject | null;
	addDetSuccess?: KeyedObject | null;

	editDetError?: KeyedObject | null;
	editDetSuccess?: KeyedObject | null;

	deleteDetError?: KeyedObject | null;
	deleteDetSuccess?: KeyedObject | null;

	getOneDetLoading?: boolean;
	getOneDetError?: KeyedObject | null;
	getOneDetSuccess?: KeyedObject | null;

	[key: string]: any;
};

export interface DepartmentActionDepartments {
	type: string;
	payload?: departmentState;
}

export type ContainerState = departmentState;
