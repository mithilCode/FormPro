/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { tenderlotimportsState } from './types'; //StateProps

// initial state
export const initialState: tenderlotimportsState = {
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

	getSupplierLoading: false,
	getSupplierError: null,
	getSupplierSuccess: null,

	getTenderNoLoading: false,
	getTenderNoError: null,
	getTenderNoSuccess: null,

	getTenderNoSelectLoading: false,
	getTenderNoSelectError: null,
	getTenderNoSelectSuccess: null,

	getViewLoading: false,
	getViewError: null,
	getViewSuccess: null,

	getAttendeeLoading: false,
	getAttendeeError: null,
	getAttendeeSuccess: null
};

// ==============================|| SLICE - TENDERLOTIMPORT ||============================== //

const tenderlotimportsSlice = createSlice({
	name: 'tenderlotimports',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<tenderlotimportsState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<tenderlotimportsState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<tenderlotimportsState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<tenderlotimportsState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<tenderlotimportsState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<tenderlotimportsState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<tenderlotimportsState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<tenderlotimportsState>) {
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

		getView(state, payload?) {
			state.getViewLoading = true;
		},
		getViewSuccess(state, action) {
			state.getViewLoading = false;
			state.getViewError = null;
			state.getViewSuccess = action.payload;
		},
		getViewError(state, action) {
			state.getViewLoading = false;
			state.getViewError = action.payload;
			state.getViewSuccess = null;
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
		getAttendee(state, payload?) {
			state.getAttendeeLoading = true;
		},
		getAttendeeSuccess(state, action) {
			state.getAttendeeLoading = false;
			state.getAttendeeError = null;
			state.getAttendeeSuccess = action.payload;
		},
		getAttendeeError(state, action) {
			state.getAttendeeLoading = false;
			state.getAttendeeError = action.payload;
			state.getAttendeeSuccess = null;
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

			(state.getSupplierLoading = false),
				(state.getSupplierError = null),
				(state.getSupplierSuccess = null),
				(state.getTenderNoLoading = false),
				(state.getTenderNoError = null),
				(state.getTenderNoSuccess = null),
				(state.getTenderNoSelectLoading = false),
				(state.getTenderNoSelectError = null),
				(state.getTenderNoSelectSuccess = null);
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: tenderlotimportsActions, reducer } = tenderlotimportsSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useTenderlotimportsSlice = () => {
	useInjectReducer({ key: tenderlotimportsSlice.name, reducer: tenderlotimportsSlice.reducer });
	useInjectSaga({ key: tenderlotimportsSlice.name, saga: Saga });
	return { actions: tenderlotimportsSlice.actions };
};
