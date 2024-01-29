/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { formtopricingsState } from './types'; //StateProps

// initial state
export const initialState: formtopricingsState = {
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

	getViewLoading: false,
	getViewError: null,
	getViewSuccess: null,

	getParaLoading: false,
	getParaError: null,
	getParaSuccess: null,

	getFTparaTypeLoading: false,
	getFTparaTypeError: null,
	getFTparaTypeSuccess: null,

	getFTparaViewLoading: false,
	getFTparaViewError: null,
	getFTparaViewSuccess: null,

	getParaOneLoading: false,
	getParaOneError: null,
	getParaOneSuccess: null
};

// ==============================|| SLICE - FROM TO PRICING ||============================== //

const formtopricingsSlice = createSlice({
	name: 'formtopricings',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<formtopricingsState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<formtopricingsState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<formtopricingsState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<formtopricingsState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<formtopricingsState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<formtopricingsState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<formtopricingsState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<formtopricingsState>) {
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
		getPara(state, payload?) {
			state.getParaLoading = true;
		},
		getParaSuccess(state, action) {
			state.getParaLoading = false;
			state.getParaError = null;
			state.getParaSuccess = action.payload;
		},
		getParaError(state, action) {
			state.getParaLoading = false;
			state.getParaError = action.payload;
			state.getParaSuccess = null;
		},
		getFTparaType(state, payload?) {
			state.getFTparaTypeLoading = true;
		},
		getFTparaTypeSuccess(state, action) {
			state.getFTparaTypeLoading = false;
			state.getFTparaTypeError = null;
			state.getFTparaTypeSuccess = action.payload;
		},
		getFTparaTypeError(state, action) {
			state.getFTparaTypeLoading = false;
			state.getFTparaTypeError = action.payload;
			state.getFTparaTypeSuccess = null;
		},
		getFTparaView(state, payload?) {
			state.getFTparaViewLoading = true;
		},
		getFTparaViewSuccess(state, action) {
			state.getFTparaViewLoading = false;
			state.getFTparaViewError = null;
			state.getFTparaViewSuccess = action.payload;
		},
		getFTparaViewError(state, action) {
			state.getFTparaViewLoading = false;
			state.getFTparaViewError = action.payload;
			state.getFTparaViewSuccess = null;
		},
		getParaOne(state, payload?) {
			state.getParaOneLoading = true;
		},
		getParaOneSuccess(state, action) {
			state.getParaOneLoading = false;
			state.getParaOneError = null;
			state.getParaOneSuccess = action.payload;
		},
		getParaOneError(state, action) {
			state.getParaOneLoading = false;
			state.getParaOneError = action.payload;
			state.getParaOneSuccess = null;
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

			state.getParaLoading = false;
			state.getParaError = null;
			state.getParaSuccess = null;

			state.getFTparaTypeLoading = false;
			state.getFTparaTypeError = null;
			state.getFTparaTypeSuccess = null;

			state.getFTparaViewLoading = false;
			state.getFTparaViewError = null;
			state.getFTparaViewSuccess = null;

			state.getParaOneLoading = false;
			state.getParaOneError = null;
			state.getParaOneSuccess = null;
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: formtopricingsActions, reducer } = formtopricingsSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useFormToPricingsSlice = () => {
	useInjectReducer({ key: formtopricingsSlice.name, reducer: formtopricingsSlice.reducer });
	useInjectSaga({ key: formtopricingsSlice.name, saga: Saga });
	return { actions: formtopricingsSlice.actions };
};
