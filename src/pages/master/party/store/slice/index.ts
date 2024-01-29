/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { partiesState } from './types'; //StateProps

// initial state
export const initialState: partiesState = {
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

// ==============================|| SLICE - PARTY ||============================== //

const partiesSlice = createSlice({
	name: 'parties',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<partiesState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<partiesState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		getPara(state, payload?) {
			state.getLoading = true;
		},
		getParaSuccess(state, action: PayloadAction<partiesState>) {
			state.getParaLoading = false;
			state.getParaError = null;
			state.getParaSuccess = action.payload;
		},
		getParaError(state, action: PayloadAction<partiesState>) {
			state.getParaLoading = false;
			state.getParaError = action;
			state.getParaSuccess = null;
		},
		getParaAcType(state, payload?) {
			state.getLoading = true;
		},
		getParaAcTypeSuccess(state, action: PayloadAction<partiesState>) {
			state.getParaAcTypeLoading = false;
			state.getParaAcTypeError = null;
			state.getParaAcTypeSuccess = action.payload;
		},
		getParaAcTypeError(state, action: PayloadAction<partiesState>) {
			state.getParaAcTypeLoading = false;
			state.getParaAcTypeError = action;
			state.getParaAcTypeSuccess = null;
		},
		getParaDesingType(state, payload?) {
			state.getLoading = true;
		},
		getParaDesingTypeSuccess(state, action: PayloadAction<partiesState>) {
			state.getParaDesingTypeLoading = false;
			state.getParaDesingTypeError = null;
			state.getParaDesingTypeSuccess = action.payload;
		},
		getParaDesingTypeError(state, action: PayloadAction<partiesState>) {
			state.getParaDesingTypeLoading = false;
			state.getParaDesingTypeError = action;
			state.getParaDesingTypeSuccess = null;
		},
		getParaGenderType(state, payload?) {
			state.getLoading = true;
		},
		getParaGenderTypeSuccess(state, action: PayloadAction<partiesState>) {
			state.getParaGenderTypeLoading = false;
			state.getParaGenderTypeError = null;
			state.getParaGenderTypeSuccess = action.payload;
		},
		getParaGenderTypeError(state, action: PayloadAction<partiesState>) {
			state.getParaGenderTypeLoading = false;
			state.getParaGenderTypeError = action;
			state.getParaGenderTypeSuccess = null;
		},
		getProc(state, payload?) {
			state.getLoading = true;
		},
		getProcSuccess(state, action: PayloadAction<partiesState>) {
			state.getProcLoading = false;
			state.getProcError = null;
			state.getProcSuccess = action.payload;
		},
		getProcError(state, action: PayloadAction<partiesState>) {
			state.getProcLoading = false;
			state.getProcError = action;
			state.getProcSuccess = null;
		},
		getAlab(state, payload?) {
			state.getALabLoading = true;
		},
		getAlabSuccess(state, action: PayloadAction<partiesState>) {
			state.getAlabLoading = false;
			state.getAlabError = null;
			state.getAlabSuccess = action.payload;
		},
		getAlabError(state, action: PayloadAction<partiesState>) {
			state.getAlabLoading = false;
			state.getAlabError = action;
			state.getAlabSuccess = null;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<partiesState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<partiesState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<partiesState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<partiesState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<partiesState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<partiesState>) {
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
		getVerifySuccess(state, action: PayloadAction<partiesState>) {
			state.getVerifyLoading = false;
			state.getVerifyError = null;
			state.getVerifySuccess = action.payload;
		},
		getVerifyError(state, action: PayloadAction<partiesState>) {
			state.getVerifyLoading = false;
			state.getVerifyError = action;
			state.getVerifySuccess = null;
		},
		getKycs(state, payload?) {
			state.getLoading = true;
		},
		getKycsSuccess(state, action: PayloadAction<partiesState>) {
			state.getKycsLoading = false;
			state.getKycsError = null;
			state.getKycsSuccess = action.payload;
		},
		getKycsError(state, action: PayloadAction<partiesState>) {
			state.getKycsLoading = false;
			state.getKycsError = action;
			state.getKycsSuccess = null;
		},
		getPrograms(state, payload?) {
			state.getLoading = true;
		},
		getProgramsSuccess(state, action: PayloadAction<partiesState>) {
			state.getProgramsLoading = false;
			state.getProgramsError = null;
			state.getProgramsSuccess = action.payload;
		},
		getProgramsError(state, action: PayloadAction<partiesState>) {
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
export const { actions: partiesActions, reducer } = partiesSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const usePartiesSlice = () => {
	useInjectReducer({ key: partiesSlice.name, reducer: partiesSlice.reducer });
	useInjectSaga({ key: partiesSlice.name, saga: Saga });
	return { actions: partiesSlice.actions };
};
