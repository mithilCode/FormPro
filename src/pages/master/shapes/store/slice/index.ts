/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { shapesState } from './types'; //StateProps

// initial state
export const initialState: shapesState = {
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
	getOneSuccess: null
};

// ==============================|| SLICE - SHAPE ||============================== //

const shapesSlice = createSlice({
	name: 'shapes',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<shapesState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<shapesState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<shapesState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<shapesState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<shapesState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<shapesState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<shapesState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<shapesState>) {
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
export const { actions: shapesActions, reducer } = shapesSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useShapesSlice = () => {
	useInjectReducer({ key: shapesSlice.name, reducer: shapesSlice.reducer });
	useInjectSaga({ key: shapesSlice.name, saga: Saga });
	return { actions: shapesSlice.actions };
};
