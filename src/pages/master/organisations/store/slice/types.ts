import { KeyedObject } from 'types/root';

// ==============================|| ORGANISATION TYPES  ||============================== //

/* --- STATE --- */
export type organisationState = {
	getLoading?: boolean;
	getError?: KeyedObject | null;
	getSuccess?: KeyedObject | null;

	getOneLoading?: boolean;
	getOneError?: KeyedObject | null;
	getOneSuccess?: KeyedObject | null;

	[key: string]: any;
};

// export interface OrganisationActionProps {
// 	type: string;
// 	payload?: organisationState;
// }

export type ContainerState = organisationState;
