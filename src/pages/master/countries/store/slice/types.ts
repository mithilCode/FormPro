// third-party
import { KeyedObject } from 'types/root';

// ==============================|| COUNTRY TYPES  ||============================== //

/* --- STATE --- */
export type countryState = {
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

export interface CountryActionProps {
	type: string;
	payload?: countryState;
}

export type ContainerState = countryState;
