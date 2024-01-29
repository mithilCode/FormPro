import { KeyedObject } from 'types/root';

// ==============================|| PACKETCREATIONS TYPES  ||============================== //

/* --- STATE --- */
export type packetcreationsState = {
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

	[key: string]: any;
};

export interface PacketcreationsActionProps {
	type: string;
	payload?: packetcreationsState;
}

export type ContainerState = packetcreationsState;
