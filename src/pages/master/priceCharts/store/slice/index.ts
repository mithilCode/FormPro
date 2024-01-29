/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { priceChartsState } from './types'; //PriceChartProps

// initial state
export const initialState: priceChartsState = {
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

	getDownloadFormatLoading: false,
	getDownloadFormatError: null,
	getDownloadFormatSuccess: null
};

// ==============================|| SLICE - PRICE CHART ||============================== //

const PriceChartsSlice = createSlice({
	name: 'priceCharts',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<priceChartsState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<priceChartsState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<priceChartsState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<priceChartsState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<priceChartsState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<priceChartsState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<priceChartsState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<priceChartsState>) {
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
		getDownloadFormat(state, payload?) {
			state.getDownloadFormatLoading = true;
		},
		getDownloadFormatSuccess(state, action) {
			state.getDownloadFormatLoading = false;
			state.getDownloadFormatError = null;
			state.getDownloadFormatSuccess = action.payload;
		},
		getDownloadFormatError(state, action) {
			state.getDownloadFormatLoading = false;
			state.getDownloadFormatError = action.payload;
			state.getDownloadFormatSuccess = null;
		},
		getPara(state, payload?) {
			state.getLoading = true;
		},
		getParaSuccess(state, action: PayloadAction<priceChartsState>) {
			state.getParaLoading = false;
			state.getParaError = null;
			state.getParaSuccess = action.payload;
		},
		getParaError(state, action: PayloadAction<priceChartsState>) {
			state.getParaLoading = false;
			state.getParaError = action;
			state.getParaSuccess = null;
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

			state.getDownloadFormatLoading = false;
			state.getDownloadFormatError = null;
			state.getDownloadFormatSuccess = null;
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: priceChartActions, reducer } = PriceChartsSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const usePriceChartsSlice = () => {
	useInjectReducer({ key: PriceChartsSlice.name, reducer: PriceChartsSlice.reducer });
	useInjectSaga({ key: PriceChartsSlice.name, saga: Saga });
	return { actions: PriceChartsSlice.actions };
};
