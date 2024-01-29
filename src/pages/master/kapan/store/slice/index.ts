/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { kapansState } from './types'; //StateProps

// initial state
export const initialState: kapansState = {
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

// ==============================|| SLICE - KAPAN ||============================== //

const kapansSlice = createSlice({
	name: 'kapans',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<kapansState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<kapansState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		getPara(state, payload?) {
			state.getLoading = true;
		},
		getParaSuccess(state, action: PayloadAction<kapansState>) {
			state.getParaLoading = false;
			state.getParaError = null;
			state.getParaSuccess = action.payload;
		},
		getParaError(state, action: PayloadAction<kapansState>) {
			state.getParaLoading = false;
			state.getParaError = action;
			state.getParaSuccess = null;
		},
		getParaAcType(state, payload?) {
			state.getLoading = true;
		},
		getParaAcTypeSuccess(state, action: PayloadAction<kapansState>) {
			state.getParaAcTypeLoading = false;
			state.getParaAcTypeError = null;
			state.getParaAcTypeSuccess = action.payload;
		},
		getParaAcTypeError(state, action: PayloadAction<kapansState>) {
			state.getParaAcTypeLoading = false;
			state.getParaAcTypeError = action;
			state.getParaAcTypeSuccess = null;
		},
		getParaDesingType(state, payload?) {
			state.getLoading = true;
		},
		getParaDesingTypeSuccess(state, action: PayloadAction<kapansState>) {
			state.getParaDesingTypeLoading = false;
			state.getParaDesingTypeError = null;
			state.getParaDesingTypeSuccess = action.payload;
		},
		getParaDesingTypeError(state, action: PayloadAction<kapansState>) {
			state.getParaDesingTypeLoading = false;
			state.getParaDesingTypeError = action;
			state.getParaDesingTypeSuccess = null;
		},
		getParaGenderType(state, payload?) {
			state.getLoading = true;
		},
		getParaGenderTypeSuccess(state, action: PayloadAction<kapansState>) {
			state.getParaGenderTypeLoading = false;
			state.getParaGenderTypeError = null;
			state.getParaGenderTypeSuccess = action.payload;
		},
		getParaGenderTypeError(state, action: PayloadAction<kapansState>) {
			state.getParaGenderTypeLoading = false;
			state.getParaGenderTypeError = action;
			state.getParaGenderTypeSuccess = null;
		},
		getProc(state, payload?) {
			state.getLoading = true;
		},
		getProcSuccess(state, action: PayloadAction<kapansState>) {
			state.getProcLoading = false;
			state.getProcError = null;
			state.getProcSuccess = action.payload;
		},
		getProcError(state, action: PayloadAction<kapansState>) {
			state.getProcLoading = false;
			state.getProcError = action;
			state.getProcSuccess = null;
		},
		getAlab(state, payload?) {
			state.getALabLoading = true;
		},
		getAlabSuccess(state, action: PayloadAction<kapansState>) {
			state.getAlabLoading = false;
			state.getAlabError = null;
			state.getAlabSuccess = action.payload;
		},
		getAlabError(state, action: PayloadAction<kapansState>) {
			state.getAlabLoading = false;
			state.getAlabError = action;
			state.getAlabSuccess = null;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<kapansState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<kapansState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<kapansState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<kapansState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<kapansState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<kapansState>) {
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
		getVerifyBy(state, payload?) {
			state.getLoading = true;
		},
		getVerifySuccess(state, action: PayloadAction<kapansState>) {
			state.getVerifyLoading = false;
			state.getVerifyError = null;
			state.getVerifySuccess = action.payload;
		},
		getVerifyError(state, action: PayloadAction<kapansState>) {
			state.getVerifyLoading = false;
			state.getVerifyError = action;
			state.getVerifySuccess = null;
		},
		getKycs(state, payload?) {
			state.getLoading = true;
		},
		getKycsSuccess(state, action: PayloadAction<kapansState>) {
			state.getKycsLoading = false;
			state.getKycsError = null;
			state.getKycsSuccess = action.payload;
		},
		getKycsError(state, action: PayloadAction<kapansState>) {
			state.getKycsLoading = false;
			state.getKycsError = action;
			state.getKycsSuccess = null;
		},
		getPrograms(state, payload?) {
			state.getLoading = true;
		},
		getProgramsSuccess(state, action: PayloadAction<kapansState>) {
			state.getProgramsLoading = false;
			state.getProgramsError = null;
			state.getProgramsSuccess = action.payload;
		},
		getProgramsError(state, action: PayloadAction<kapansState>) {
			state.getProgramsLoading = false;
			state.getProgramsError = action;
			state.getProgramsSuccess = null;
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
export const { actions: kapansActions, reducer } = kapansSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useKapansSlice = () => {
	useInjectReducer({ key: kapansSlice.name, reducer: kapansSlice.reducer });
	useInjectSaga({ key: kapansSlice.name, saga: Saga });
	return { actions: kapansSlice.actions };
};
