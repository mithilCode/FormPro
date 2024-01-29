/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { nonesaleablesState } from './types'; //StateProps

// initial state
export const initialState: nonesaleablesState = {
	getLoading: false,
	getError: null,
	getSuccess: null,

	loading: false,

	addError: null,
	addSuccess: null,

	editError: null,
	editSuccess: null,

	deleteError: null,
	deleteSuccess: null,

	getOneLoading: false,
	getOneError: null,
	getOneSuccess: null,

	getTensionLoading: false,
	getTensionError: null,
	getTensionSuccess: null,

	getMilkyLoading: false,
	getMilkyError: null,
	getMilkySuccess: null,

	getNattsLoading: false,
	getNattsError: null,
	getNattsSuccess: null
};

// ==============================|| SLICE - NONESALEABLE ||============================== //

const nonesaleablesSlice = createSlice({
	name: 'nonesaleables',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<nonesaleablesState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<nonesaleablesState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<nonesaleablesState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<nonesaleablesState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<nonesaleablesState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<nonesaleablesState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<nonesaleablesState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<nonesaleablesState>) {
			state.loading = false;
			state.deleteError = action.payload;
			state.deleteSuccess = null;
		},
		getOne(state, payload?) {
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
		getTension(state, payload?) {
			state.getTensionLoading = true;
		},
		getTensionSuccess(state, action) {
			state.getTensionLoading = false;
			state.getTensionError = null;
			state.getTensionSuccess = action.payload;
		},
		getTensionError(state, action) {
			state.getTensionLoading = false;
			state.getTensionError = action.payload;
			state.getTensionSuccess = null;
		},
		getMilky(state, payload?) {
			state.getMilkyLoading = true;
		},
		getMilkySuccess(state, action) {
			state.getMilkyLoading = false;
			state.getMilkyError = null;
			state.getMilkySuccess = action.payload;
		},
		getMilkyError(state, action) {
			state.getMilkyLoading = false;
			state.getMilkyError = action.payload;
			state.getMilkySuccess = null;
		},
		getNatts(state, payload?) {
			state.getNattsLoading = true;
		},
		getNattsSuccess(state, action) {
			state.getNattsLoading = false;
			state.getNattsError = null;
			state.getNattsSuccess = action.payload;
		},
		getNattsError(state, action) {
			state.getNattsLoading = false;
			state.getNattsError = action.payload;
			state.getNattsSuccess = null;
		},
		reset(state: typeof initialState) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = null;

			state.loading = false;

			state.addError = null;
			state.addSuccess = null;

			state.editError = null;
			state.editSuccess = null;

			state.deleteError = null;
			state.deleteSuccess = null;

			state.getOneLoading = false;
			state.getOneError = null;
			state.getOneSuccess = null;
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: nonesaleablesActions, reducer } = nonesaleablesSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useNonesaleablesSlice = () => {
	useInjectReducer({ key: nonesaleablesSlice.name, reducer: nonesaleablesSlice.reducer });
	useInjectSaga({ key: nonesaleablesSlice.name, saga: Saga });
	return { actions: nonesaleablesSlice.actions };
};
