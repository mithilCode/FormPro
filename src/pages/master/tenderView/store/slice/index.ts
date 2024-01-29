/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { tenderviewsState } from './types'; //StateProps

// initial state
export const initialState: tenderviewsState = {
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
	getNattsSuccess: null,

	getSupplierLoading: false,
	getSupplierError: null,
	getSupplierSuccess: null,

	getTenderNoLoading: false,
	getTenderNoError: null,
	getTenderNoSuccess: null,

	getTenderNoSelectLoading: false,
	getTenderNoSelectError: null,
	getTenderNoSelectSuccess: null,

	getOneDetLoading: false,
	getOneDetError: null,
	getOneDetSuccess: null
};

// ==============================|| SLICE - SYMMS ||============================== //

const tenderviewsSlice = createSlice({
	name: 'tenderviews',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<tenderviewsState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<tenderviewsState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<tenderviewsState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<tenderviewsState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<tenderviewsState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<tenderviewsState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<tenderviewsState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<tenderviewsState>) {
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
		getSupplier(state, payload?) {
			state.getSupplierLoading = true;
		},
		getSupplierSuccess(state, action) {
			state.getSupplierLoading = false;
			state.getSupplierError = null;
			state.getSupplierSuccess = action.payload;
		},
		getSupplierError(state, action) {
			state.getSupplierLoading = false;
			state.getSupplierError = action.payload;
			state.getSupplierSuccess = null;
		},
		getTenderNo(state, payload?) {
			state.getTenderNoLoading = true;
		},
		getTenderNoSuccess(state, action) {
			state.getTenderNoLoading = false;
			state.getTenderNoError = null;
			state.getTenderNoSuccess = action.payload;
		},
		getTenderNoError(state, action) {
			state.getTenderNoLoading = false;
			state.getTenderNoError = action.payload;
			state.getTenderNoSuccess = null;
		},
		getTenderNoSelect(state, payload?) {
			state.getTenderNoSelectLoading = true;
		},
		getTenderNoSelectSuccess(state, action) {
			state.getTenderNoSelectLoading = false;
			state.getTenderNoSelectError = null;
			state.getTenderNoSelectSuccess = action.payload;
		},
		getTenderNoSelectError(state, action) {
			state.getTenderNoSelectLoading = false;
			state.getTenderNoSelectError = action.payload;
			state.getTenderNoSelectSuccess = null;
		},
		getOneDet(state, payload?) {
			state.getOneDetLoading = true;
		},
		getOneDetSuccess(state, action) {
			state.getOneDetLoading = false;
			state.getOneDetError = null;
			state.getOneDetSuccess = action.payload;
		},
		getOneDetError(state, action) {
			state.getOneDetLoading = false;
			state.getOneDetError = action.payload;
			state.getOneDetSuccess = null;
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

			state.getSupplierLoading = false;
			state.getSupplierError = null;
			state.getSupplierSuccess = null;

			state.getTenderNoLoading = false;
			state.getTenderNoError = null;
			state.getTenderNoSuccess = null;

			state.getTenderNoSelectLoading = false;
			state.getTenderNoSelectError = null;
			state.getTenderNoSelectSuccess = null;

			state.getOneDetLoading = false;
			state.getOneDetError = null;
			state.getOneDetSuccess = null;
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: tenderviewsActions, reducer } = tenderviewsSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useTenderviewsSlice = () => {
	useInjectReducer({ key: tenderviewsSlice.name, reducer: tenderviewsSlice.reducer });
	useInjectSaga({ key: tenderviewsSlice.name, saga: Saga });
	return { actions: tenderviewsSlice.actions };
};
