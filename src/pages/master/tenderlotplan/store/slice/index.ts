/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { tenderlotplansState } from './types'; //StateProps

// initial state
export const initialState: tenderlotplansState = {
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
	getOneDetSuccess: null,

	getAssortLoading: false,
	getAssortError: null,
	getAssortSuccess: null,

	getAssortTypeLoading: false,
	getAssortTypeError: null,
	getAssortTypeSuccess: null,

	getPlanTypeLoading: false,
	getPlanTypeError: null,
	getPlanTypeSuccess: null,

	getCheckerLoading: false,
	getCheckerError: null,
	getCheckerSuccess: null
};

// ==============================|| SLICE - SYMMS ||============================== //

const tenderlotplansSlice = createSlice({
	name: 'tenderlotplans',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<tenderlotplansState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<tenderlotplansState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},

		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<tenderlotplansState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<tenderlotplansState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<tenderlotplansState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		editError(state, action: PayloadAction<tenderlotplansState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<tenderlotplansState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<tenderlotplansState>) {
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
		getOneAssortment(state, payload?) {
			state.getOneAssortmentLoading = true;
		},
		getOneAssortmentSuccess(state, action) {
			state.getOneAssortmentLoading = false;
			state.getOneAssortmentError = null;
			state.getOneAssortmentSuccess = action.payload;
		},
		getOneAssortmentError(state, action) {
			state.getOneAssortmentLoading = false;
			state.getOneAssortmentError = action.payload;
			state.getOneAssortmentSuccess = null;
		},
		getOnePlanning(state, payload?) {
			state.getOnePlanningLoading = true;
		},
		getOnePlanningSuccess(state, action) {
			state.getOnePlanningLoading = false;
			state.getOnePlanningError = null;
			state.getOnePlanningSuccess = action.payload;
		},
		getOnePlanningError(state, action) {
			state.getOnePlanningLoading = false;
			state.getOnePlanningError = action.payload;
			state.getOnePlanningSuccess = null;
		},
		getOneView1(state, payload?) {
			state.getOneView1Loading = true;
		},
		getOneView1Success(state, action) {
			state.getOneView1Loading = false;
			state.getOneView1Error = null;
			state.getOneView1Success = action.payload;
		},
		getOneView1Error(state, action) {
			state.getOneView1Loading = false;
			state.getOneView1Error = action.payload;
			state.getOneView1Success = null;
		},
		getOneRap(state, payload?) {
			state.getOneRapLoading = true;
		},
		getOneRapSuccess(state, action) {
			state.getOneRapLoading = false;
			state.getOneRapError = null;
			state.getOneRapSuccess = action.payload;
		},
		getOneRapError(state, action) {
			state.getOneRapLoading = false;
			state.getOneRapError = action.payload;
			state.getOneRapSuccess = null;
		},
		getOneRapDisc(state, payload?) {
			state.getOneRapDiscLoading = true;
		},
		getOneRapDiscSuccess(state, action) {
			state.getOneRapDiscLoading = false;
			state.getOneRapDiscError = null;
			state.getOneRapDiscSuccess = action.payload;
		},
		getOneRapDiscError(state, action) {
			state.getOneRapDiscLoading = false;
			state.getOneRapDiscError = action.payload;
			state.getOneRapDiscSuccess = null;
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
		getLotStatus(state, payload?) {
			state.getLotStatusLoading = true;
		},
		getLotStatusSuccess(state, action) {
			state.getLotStatusLoading = false;
			state.getLotStatusError = null;
			state.getLotStatusSuccess = action.payload;
		},
		getLotStatusError(state, action) {
			state.getLotStatusLoading = false;
			state.getLotStatusError = action.payload;
			state.getLotStatusSuccess = null;
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
		getAssort(state, payload?) {
			state.getAssortLoading = true;
		},
		getAssortSuccess(state, action) {
			state.getAssortLoading = false;
			state.getAssortError = null;
			state.getAssortSuccess = action.payload;
		},
		getAssortError(state, action) {
			state.getAssortLoading = false;
			state.getAssortError = action.payload;
			state.getAssortSuccess = null;
		},

		getAssortType(state, payload?) {
			state.getAssortTypeLoading = true;
		},
		getAssortTypeSuccess(state, action) {
			state.getAssortTypeLoading = false;
			state.getAssortTypeError = null;
			state.getAssortTypeSuccess = action.payload;
		},
		getAssortTypeError(state, action) {
			state.getAssortTypeLoading = false;
			state.getAssortTypeError = action.payload;
			state.getAssortTypeSuccess = null;
		},
		getPlanType(state, payload?) {
			state.getPlanTypeLoading = true;
		},
		getPlanTypeSuccess(state, action) {
			state.getPlanTypeLoading = false;
			state.getPlanTypeError = null;
			state.getPlanTypeSuccess = action.payload;
		},
		getPlanTypeError(state, action) {
			state.getPlanTypeLoading = false;
			state.getPlanTypeError = action.payload;
			state.getPlanTypeSuccess = null;
		},
		getChecker(state, payload?) {
			state.getAssortLoading = true;
		},
		getCheckerSuccess(state, action) {
			state.getCheckerLoading = false;
			state.getCheckerError = null;
			state.getCheckerSuccess = action.payload;
		},
		getCheckerError(state, action) {
			state.getCheckerLoading = false;
			state.getCheckerError = action.payload;
			state.getCheckerSuccess = null;
		},
		getAssortPlanSumm(state, payload?) {
			state.getAssortPlanSummLoading = true;
		},
		getAssortPlanSummSuccess(state, action) {
			state.getAssortPlanSummLoading = false;
			state.getAssortPlanSummError = null;
			state.getAssortPlanSummSuccess = action.payload;
		},
		getAssortPlanSummError(state, action) {
			state.getAssortPlanSummLoading = false;
			state.getAssortPlanSummError = action.payload;
			state.getAssortPlanSummSuccess = null;
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

			state.getOnePlanningLoading = false;
			state.getOnePlanningError = null;
			state.getOnePlanningSuccess = null;

			state.getOneRapLoading = false;
			state.getOneRapError = null;
			state.getOneRapSuccess = null;

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

			state.getAssortLoading = false;
			state.getAssortError = null;
			state.getAssortSuccess = null;

			state.getAssortTypeLoading = false;
			state.getAssortTypeError = null;
			state.getAssortTypeSuccess = null;

			state.getPlanTypeLoading = false;
			state.getPlanTypeError = null;
			state.getPlanTypeSuccess = null;

			state.getCheckerLoading = false;
			state.getCheckerError = null;
			state.getCheckerSuccess = null;
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: tenderlotplansActions, reducer } = tenderlotplansSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useTenderlotplansSlice = () => {
	useInjectReducer({ key: tenderlotplansSlice.name, reducer: tenderlotplansSlice.reducer });
	useInjectSaga({ key: tenderlotplansSlice.name, saga: Saga });
	return { actions: tenderlotplansSlice.actions };
};
