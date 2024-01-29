import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit'; // Importing from `utils` makes them more type-safe ✅

import { useInjectReducer } from '@utils/redux-injectors'; //, useInjectSaga

import { snackBarState } from './types';

// import { createSlice } from '@app/utils/@reduxjs/toolkit'; // Importing from `utils` makes them more type-safe ✅

export const initialState: snackBarState = {
	action: false,
	open: false,
	message: 'Note archived',
	anchorOrigin: {
		vertical: 'bottom',
		horizontal: 'right'
	},
	variant: 'default',
	alert: {
		color: 'primary',
		variant: 'filled'
	},
	transition: 'Fade',
	close: true,
	actionButton: false,
	maxStack: 3,
	dense: false,
	iconVariant: 'usedefault'
};

const snackBarSlice = createSlice({
	name: 'snackbar',
	initialState,
	reducers: {
		openSnackbar(state, action: PayloadAction<Partial<snackBarState>>) {
			const { open, message, anchorOrigin, variant, alert, transition, close, actionButton } =
				action.payload;

			state.action = !state.action;
			state.open = open || initialState.open;
			state.message = message || initialState.message;
			state.anchorOrigin = anchorOrigin || initialState.anchorOrigin;
			state.variant = variant || initialState.variant;
			state.alert = {
				color: alert?.color || initialState.alert.color,
				variant: alert?.variant || initialState.alert.variant
			};
			state.transition = transition || initialState.transition;
			state.close = close === false ? close : initialState.close;
			state.actionButton = actionButton || initialState.actionButton;
		},

		closeSnackbar(state) {
			state.open = false;
		},

		handlerIncrease(state, action) {
			const { maxStack } = action.payload;
			state.maxStack = maxStack;
		},
		handlerDense(state, action) {
			const { dense } = action.payload;
			state.dense = dense;
		},
		handlerIconVariants(state, action) {
			const { iconVariant } = action.payload;
			state.iconVariant = iconVariant;
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: snackBarActions, reducer } = snackBarSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useSnackBarSlice = () => {
	useInjectReducer({ key: snackBarSlice.name, reducer: snackBarSlice.reducer });
	//useInjectSaga({ key: globalSlice.name, saga: Saga });
	return { actions: snackBarSlice.actions };
};
