import { KeyedObject } from 'types/root';

// ==============================|| USERS TYPES  ||============================== //

/* --- STATE --- */
export type userState = {
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

	passwordChangeError?: KeyedObject | null;
	passwordChangeSuccess?: KeyedObject | null;

	getOneProfileLoading?: boolean;
	getProfileError?: KeyedObject | null;
	getProfileSuccess?: KeyedObject | null;

	getPaymentsLoading?: boolean;
	getPaymentsError?: KeyedObject | null;
	getPaymentsSuccess?: KeyedObject | null;

	[key: string]: any;
};

export interface UserActionProps {
	type: string;
	payload?: userState;
}

export type ContainerState = userState;
