// material-ui
import { AlertProps, SnackbarOrigin } from '@mui/material';

// ==============================|| SNACKBAR TYPES  ||============================== //

export type SnackbarActionProps = {
	payload?: snackBarState;
};

/* --- STATE --- */
export interface snackBarState {
	// declare what you want in your snackBar state
	action: boolean;
	open: boolean;
	message: string;
	anchorOrigin: SnackbarOrigin;
	variant: string;
	alert: AlertProps;
	transition: string;
	close: boolean;
	actionButton: boolean;
	maxStack: number;
	dense: boolean;
	iconVariant: string;
}

/* 
  If you want to use 'ContainerState' keyword everywhere in your current folder, 
  instead of the 'snackBarState' keyword.
*/
export type ContainerState = snackBarState;
