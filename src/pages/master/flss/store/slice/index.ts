/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { flssState } from './types'; //StateProps

// initial state
export const initialState: flssState = {
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

	getPriceLoading: false,
	getPriceError: null,
	getPriceSuccess: null,

	getDiscLoading: false,
	getDiscError: null,
	getDiscSuccess: null
};

// ==============================|| SLICE - FLS ||============================== //

const flssSlice = createSlice({
	name: 'flss',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<flssState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<flssState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<flssState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<flssState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<flssState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<flssState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<flssState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<flssState>) {
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
		getPrice(state, payload?) {
			state.getOneLoading = true;
		},
		getPriceSuccess(state, action) {
			state.getPriceLoading = false;
			state.getPriceError = null;
			state.getPriceSuccess = action.payload;
		},
		getPriceError(state, action) {
			state.getPriceLoading = false;
			state.getPriceError = action.payload;
			state.getPriceSuccess = null;
		},
		getDisc(state, payload?) {
			state.getDiscLoading = true;
		},
		getDiscSuccess(state, action) {
			state.getDiscLoading = false;
			state.getDiscError = null;
			state.getDiscSuccess = action.payload;
		},
		getDiscError(state, action) {
			state.getDiscLoading = false;
			state.getDiscError = action.payload;
			state.getDiscSuccess = null;
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
export const { actions: flssActions, reducer } = flssSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useFlssSlice = () => {
	useInjectReducer({ key: flssSlice.name, reducer: flssSlice.reducer });
	useInjectSaga({ key: flssSlice.name, saga: Saga });
	return { actions: flssSlice.actions };
};
