/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { propsState } from './types'; //StateProps

// initial state
export const initialState: propsState = {
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

	addDetError: null,
	addDetSuccess: null,

	editDetError: null,
	editDetSuccess: null,

	deleteDetError: null,
	deleteDetSuccess: null,

	getOneDetLoading: false,
	getOneDetError: null,
	getOneDetSuccess: null
};

// ==============================|| SLICE - PROP ||============================== //

const propsSlice = createSlice({
	name: 'props',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getDet(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<propsState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getSuccessDet(state, action: PayloadAction<propsState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<propsState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		getErrorDet(state, action: PayloadAction<propsState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addDet(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<propsState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<propsState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<propsState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<propsState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<propsState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<propsState>) {
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

		addDetSuccess(state, action: PayloadAction<propsState>) {
			state.loading = false;
			state.addDetError = null;
			state.addDetSuccess = action.payload;
		},
		addDetError(state, action: PayloadAction<propsState>) {
			state.loading = false;
			state.addDetError = action.payload;
			state.addDetSuccess = null;
		},
		editDet(state, payload?) {
			state.loading = true;
		},
		editDetSuccess(state, action: PayloadAction<propsState>) {
			state.loading = false;
			state.editDetError = null;
			state.editDetSuccess = action.payload;
		},
		editDetError(state, action: PayloadAction<propsState>) {
			state.loading = false;
			state.editDetError = action.payload;
			state.editDetSuccess = null;
		},
		deleteDet(state, payload?) {
			state.loading = true;
		},
		deleteDetSuccess(state, action: PayloadAction<propsState>) {
			state.loading = false;
			state.deleteDetError = null;
			state.deleteDetSuccess = action.payload;
		},
		deleteDetError(state, action: PayloadAction<propsState>) {
			state.loading = false;
			state.deleteDetError = action.payload;
			state.deleteDetSuccess = null;
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

			state.addDetError = null;
			state.addDetSuccess = null;

			state.editError = null;
			state.editSuccess = null;

			state.deleteError = null;
			state.deleteSuccess = null;

			state.getOneLoading = false;
			state.getOneError = null;
			state.getOneSuccess = null;

			state.getOneDetLoading = false;
			state.getOneDetError = null;
			state.getOneDetSuccess = null;

			state.editDetError = null;
			state.editDetSuccess = null;

			state.deleteDetError = null;
			state.deleteDetSuccess = null;
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: propsActions, reducer } = propsSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const usePropSlice = () => {
	useInjectReducer({ key: propsSlice.name, reducer: propsSlice.reducer });
	useInjectSaga({ key: propsSlice.name, saga: Saga });
	return { actions: propsSlice.actions };
};

// export const usePropsSlice = () => {
// 	useInjectReducer({ key: propSlice.name, reducer: propSlice.reducer });
// 	useInjectSaga({ key: propSlice.name, saga: Saga });
// 	return { actions: propSlice.actions };
// };
