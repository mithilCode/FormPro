import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { organisationState } from './types';

// initial state
export const initialState: organisationState = {
	getLoading: false,
	getError: null,
	getSuccess: null,

	getOneLoading: false,
	getOneError: null,
	getOneSuccess: null
};

// ==============================|| SLICE - AUTH ||============================== //

const organisationSlice = createSlice({
	name: 'organisation',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<organisationState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<organisationState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		getOne(state) {
			state.getOneLoading = true;
		},
		getOneSuccess(state, action) {
			state.getOneLoading = false;
			state.getOneError = null;
			state.getOneSuccess = action.payload;
		},
		getOneError(state, action) {
			state.getOneLoading = false;
			state.getOneError = action.payload;
			state.getOneSuccess = null;
		},
		reset(state: typeof initialState) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = null;

			state.getOneLoading = false;
			state.getOneError = null;
			state.getOneSuccess = null;
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: organisationActions, reducer } = organisationSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useOrganisationSlice = () => {
	useInjectReducer({ key: organisationSlice.name, reducer: organisationSlice.reducer });
	useInjectSaga({ key: organisationSlice.name, saga: Saga });
	return { actions: organisationSlice.actions };
};
