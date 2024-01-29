import { KeyedObject } from 'types/root';

// ==============================|| TENDERLOTIMPORTS TYPES  ||============================== //

/* --- STATE --- */
export type tenderlotimportsState = {
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

	getSupplierLoading?: boolean;
	getSupplierError?: KeyedObject | null;
	getSupplierSuccess?: KeyedObject | null;

	getTenderNoLoading?: boolean;
	getTenderNoError?: KeyedObject | null;
	getTenderNoSuccess?: KeyedObject | null;

	getTenderNoSelectLoading?: boolean;
	getTenderNoSelectError?: KeyedObject | null;
	getTenderNoSelectSuccess?: KeyedObject | null;

	getViewLoading?: boolean;
	getViewError?: KeyedObject | null;
	getViewSuccess?: KeyedObject | null;

	getOneDetLoading?: boolean;
	getOneDetError?: KeyedObject | null;
	getOneDetSuccess?: KeyedObject | null;

	getAttendeeLoading?: boolean;
	getAttendeeError?: KeyedObject | null;
	getAttendeeSuccess?: KeyedObject | null;

	[key: string]: any;
};

export interface TenderlotimportsActionProps {
	type: string;
	payload?: tenderlotimportsState;
}

export type ContainerState = tenderlotimportsState;
