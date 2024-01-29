/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { invoicesState } from './types'; //StateProps

// initial state
export const initialState: invoicesState = {
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

	getColumnsSettingLoading: false,
	getColumnsSettingError: null,
	getColumnsSettingSuccess: null,

	getVendorLoading: false,
	getVendorError: null,
	getVendorSuccess: null,

	getTenderNoLoading: false,
	getTenderNoError: null,
	getTenderNoSuccess: null,

	getPartyLoading: false,
	getPartyError: null,
	getPartySuccess: null,

	getBrokerLoading: false,
	getBrokerError: null,
	getBrokerSuccess: null,

	getBillTypeLoading: false,
	getBillTypeError: null,
	getBillTypeSuccess: null
};

// ==============================|| SLICE - INVOICE ||============================== //

const invoicesSlice = createSlice({
	name: 'invoices',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<invoicesState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<invoicesState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		getPara(state, payload?) {
			state.getLoading = true;
		},
		getParaSuccess(state, action: PayloadAction<invoicesState>) {
			state.getParaLoading = false;
			state.getParaError = null;
			state.getParaSuccess = action.payload;
		},
		getParaError(state, action: PayloadAction<invoicesState>) {
			state.getParaLoading = false;
			state.getParaError = action;
			state.getParaSuccess = null;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<invoicesState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<invoicesState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<invoicesState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<invoicesState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<invoicesState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<invoicesState>) {
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
		getVendor(state, payload?) {
			state.getVendorLoading = true;
		},
		getVendorSuccess(state, action) {
			state.getVendorLoading = false;
			state.getVendorError = null;
			state.getVendorSuccess = action.payload;
		},
		getVendorError(state, action) {
			state.getVendorLoading = false;
			state.getVendorError = action.payload;
			state.getVendorSuccess = null;
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
		getParty(state, payload?) {
			state.getPartyLoading = true;
		},
		getPartySuccess(state, action) {
			state.getPartyLoading = false;
			state.getPartyError = null;
			state.getPartySuccess = action.payload;
		},
		getPartyError(state, action) {
			state.getPartyLoading = false;
			state.getPartyError = action.payload;
			state.getPartySuccess = null;
		},
		getBroker(state, payload?) {
			state.getBrokerLoading = true;
		},
		getBrokerSuccess(state, action) {
			state.getBrokerLoading = false;
			state.getBrokerError = null;
			state.getBrokerSuccess = action.payload;
		},
		getBrokerError(state, action) {
			state.getBrokerLoading = false;
			state.getBrokerError = action.payload;
			state.getBrokerSuccess = null;
		},
		getInvoice(state, payload?) {
			state.getInvoiceLoading = true;
		},
		getInvoiceSuccess(state, action) {
			state.getInvoiceLoading = false;
			state.getInvoiceError = null;
			state.getInvoiceSuccess = action.payload;
		},
		getInvoiceError(state, action) {
			state.getInvoiceLoading = false;
			state.getInvoiceError = action.payload;
			state.getInvoiceSuccess = null;
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
		getRoughSize(state, payload?) {
			state.getRoughSizeLoading = true;
		},
		getRoughSizeSuccess(state, action) {
			state.getRoughSizeLoading = false;
			state.getRoughSizeError = null;
			state.getRoughSizeSuccess = action.payload;
		},
		getRoughSizeError(state, action) {
			state.getRoughSizeLoading = false;
			state.getRoughSizeError = action.payload;
			state.getRoughSizeSuccess = null;
		},
		getRoughQlty(state, payload?) {
			state.getRoughQltyLoading = true;
		},
		getRoughQltySuccess(state, action) {
			state.getRoughQltyLoading = false;
			state.getRoughQltyError = null;
			state.getRoughQltySuccess = action.payload;
		},
		getRoughQltyError(state, action) {
			state.getRoughQltyLoading = false;
			state.getRoughQltyError = action.payload;
			state.getRoughQltySuccess = null;
		},
		getMonth(state, payload?) {
			state.getMonthLoading = true;
		},
		getMonthSuccess(state, action) {
			state.getMonthLoading = false;
			state.getMonthError = null;
			state.getMonthSuccess = action.payload;
		},
		getMonthError(state, action) {
			state.getMonthLoading = false;
			state.getMonthError = action.payload;
			state.getMonthSuccess = null;
		},
		getYear(state, payload?) {
			state.getYearLoading = true;
		},
		getYearSuccess(state, action) {
			state.getYearLoading = false;
			state.getYearError = null;
			state.getYearSuccess = action.payload;
		},
		getYearError(state, action) {
			state.getYearLoading = false;
			state.getYearError = action.payload;
			state.getYearSuccess = null;
		},
		getCountry(state, payload?) {
			state.getCountryLoading = true;
		},
		getCountrySuccess(state, action) {
			state.getCountryLoading = false;
			state.getCountryError = null;
			state.getCountrySuccess = action.payload;
		},
		getCountryError(state, action) {
			state.getCountryLoading = false;
			state.getCountryError = action.payload;
			state.getCountrySuccess = null;
		},
		getSource(state, payload?) {
			state.getSourceLoading = true;
		},
		getSourceSuccess(state, action) {
			state.getSourceLoading = false;
			state.getSourceError = null;
			state.getSourceSuccess = action.payload;
		},
		getSourceError(state, action) {
			state.getSourceLoading = false;
			state.getSourceError = action.payload;
			state.getSourceSuccess = null;
		},
		getMine(state, payload?) {
			state.getMineLoading = true;
		},
		getMineSuccess(state, action) {
			state.getMineLoading = false;
			state.getMineError = null;
			state.getMineSuccess = action.payload;
		},
		getMineError(state, action) {
			state.getMineLoading = false;
			state.getMineError = action.payload;
			state.getMineSuccess = null;
		},
		getProgram(state, payload?) {
			state.getProgramLoading = true;
		},
		getProgramSuccess(state, action) {
			state.getProgramLoading = false;
			state.getProgramError = null;
			state.getProgramSuccess = action.payload;
		},
		getProgramError(state, action) {
			state.getProgramLoading = false;
			state.getProgramError = action.payload;
			state.getProgramSuccess = null;
		},
		getBillType(state, payload?) {
			state.getBillTypeLoading = true;
		},
		getBillTypeSuccess(state, action) {
			state.getBillTypeLoading = false;
			state.getBillTypeError = null;
			state.getBillTypeSuccess = action.payload;
		},
		getBillTypeError(state, action) {
			state.getBillTypeLoading = false;
			state.getBillTypeError = action.payload;
			state.getBillTypeSuccess = null;
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

			state.getColumnsSettingLoading = false;
			state.getColumnsSettingError = null;
			state.getColumnsSettingSuccess = null;

			state.getVendorLoading = false;
			state.getVendorError = null;
			state.getVendorSuccess = null;

			state.getTenderNoLoading = false;
			state.getTenderNoError = null;
			state.getTenderNoSuccess = null;

			state.getPartyLoading = false;
			state.getPartyError = null;
			state.getPartySuccess = null;

			state.getBrokerLoading = false;
			state.getBrokerError = null;
			state.getBrokerSuccess = null;

			state.getBillTypeLoading = false;
			state.getBillTypeError = null;
			state.getBillTypeSuccess = null;
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: invoicesActions, reducer } = invoicesSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useInvoicesSlice = () => {
	useInjectReducer({ key: invoicesSlice.name, reducer: invoicesSlice.reducer });
	useInjectSaga({ key: invoicesSlice.name, saga: Saga });
	return { actions: invoicesSlice.actions };
};
