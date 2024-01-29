/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { packetcreationsState } from './types'; //StateProps

// initial state
export const initialState: packetcreationsState = {
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

	getColumnsSettingLoading: false,
	getColumnsSettingError: null,
	getColumnsSettingSuccess: null
};

// ==============================|| SLICE - PACKETCREATION ||============================== //

const packetcreationsSlice = createSlice({
	name: 'packetcreations',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<packetcreationsState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<packetcreationsState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<packetcreationsState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<packetcreationsState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<packetcreationsState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<packetcreationsState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<packetcreationsState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<packetcreationsState>) {
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
		getColumnsSetting(state, payload?) {
			state.getColumnsSettingLoading = true;
		},
		getColumnsSettingSuccess(state, action) {
			state.getColumnsSettingLoading = false;
			state.getColumnsSettingError = null;
			state.getColumnsSettingSuccess = action.payload;
		},
		getColumnsSettingError(state, action) {
			state.getColumnsSettingLoading = false;
			state.getColumnsSettingError = action.payload;
			state.getColumnsSettingSuccess = null;
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

			state.getTensionLoading = false;
			state.getTensionError = null;
			state.getTensionSuccess = null;
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: packetcreationsActions, reducer } = packetcreationsSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const usePacketcreationsSlice = () => {
	useInjectReducer({ key: packetcreationsSlice.name, reducer: packetcreationsSlice.reducer });
	useInjectSaga({ key: packetcreationsSlice.name, saga: Saga });
	return { actions: packetcreationsSlice.actions };
};
