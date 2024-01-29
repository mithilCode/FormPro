import { KeyedObject } from 'types/root';

// ==============================|| TENDERLOTPLANS TYPES  ||============================== //

/* --- STATE --- */
export type tenderlotplansState = {
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

	getAssortLoading?: boolean;
	getAssortError?: KeyedObject | null;
	getAssortSuccess?: KeyedObject | null;

	getAssortTypeLoading?: boolean;
	getAssortTypeError?: KeyedObject | null;
	getAssortTypeSuccess?: KeyedObject | null;

	getPlanTypeLoading?: boolean;
	getPlanTypeError?: KeyedObject | null;
	getPlanTypeSuccess?: KeyedObject | null;

	getCheckerLoading?: boolean;
	getCheckerError?: KeyedObject | null;
	getCheckerSuccess?: KeyedObject | null;

	[key: string]: any;
};

export interface tenderlotplansActionProps {
	type: string;
	payload?: tenderlotplansState;
}

export type ContainerState = tenderlotplansState;
