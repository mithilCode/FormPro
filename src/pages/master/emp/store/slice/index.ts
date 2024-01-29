/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { empsState } from './types'; //StateProps

// initial state
export const initialState: empsState = {
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

	getOneDetLoading: false,
	getOneDetError: null,
	getOneDetSuccess: null,

	getParaLoading: false,
	getParaError: null,
	getParaSuccess: null,

	getDesigRoleLoading: false,
	getDesigRoleError: null,
	getDesigRoleSuccess: null
};

// ==============================|| SLICE - EMP ||============================== //

const empsSlice = createSlice({
	name: 'emps',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<empsState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<empsState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		add(state, payload?) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<empsState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<empsState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<empsState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<empsState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<empsState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<empsState>) {
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

		getPara(state, payload?) {
			state.getLoading = true;
		},
		getParaSuccess(state, action: PayloadAction<empsState>) {
			state.getParaLoading = false;
			state.getParaError = null;
			state.getParaSuccess = action.payload;
		},
		getParaError(state, action: PayloadAction<empsState>) {
			state.getParaLoading = false;
			state.getParaError = action;
			state.getParaSuccess = null;
		},
		getGender(state, payload?) {
			state.getLoading = true;
		},
		getGenderSuccess(state, action: PayloadAction<empsState>) {
			state.getGenderLoading = false;
			state.getGenderError = null;
			state.getGenderSuccess = action.payload;
		},
		getGenderError(state, action: PayloadAction<empsState>) {
			state.getGenderLoading = false;
			state.getGenderError = action;
			state.getGenderSuccess = null;
		},
		getMarital(state, payload?) {
			state.getLoading = true;
		},
		getMaritalSuccess(state, action: PayloadAction<empsState>) {
			state.getMaritalLoading = false;
			state.getMaritalError = null;
			state.getMaritalSuccess = action.payload;
		},
		getMaritalError(state, action: PayloadAction<empsState>) {
			state.getMaritalLoading = false;
			state.getMaritalError = action;
			state.getMaritalSuccess = null;
		},
		getLanguage(state, payload?) {
			state.getLoading = true;
		},
		getLanguageSuccess(state, action: PayloadAction<empsState>) {
			state.getLanguageLoading = false;
			state.getLanguageError = null;
			state.getLanguageSuccess = action.payload;
		},
		getLanguageError(state, action: PayloadAction<empsState>) {
			state.getLanguageLoading = false;
			state.getLanguageError = action;
			state.getLanguageSuccess = null;
		},
		getReligion(state, payload?) {
			state.getLoading = true;
		},
		getReligionSuccess(state, action: PayloadAction<empsState>) {
			state.getReligionLoading = false;
			state.getReligionError = null;
			state.getReligionSuccess = action.payload;
		},
		getReligionError(state, action: PayloadAction<empsState>) {
			state.getReligionLoading = false;
			state.getReligionError = action;
			state.getReligionSuccess = null;
		},
		getCaste(state, payload?) {
			state.getLoading = true;
		},
		getCasteSuccess(state, action: PayloadAction<empsState>) {
			state.getCasteLoading = false;
			state.getCasteError = null;
			state.getCasteSuccess = action.payload;
		},
		getCasteError(state, action: PayloadAction<empsState>) {
			state.getCasteLoading = false;
			state.getCasteError = action;
			state.getCasteSuccess = null;
		},
		getSubCaste(state, payload?) {
			state.getLoading = true;
		},
		getSubCasteSuccess(state, action: PayloadAction<empsState>) {
			state.getSubCasteLoading = false;
			state.getSubCasteError = null;
			state.getSubCasteSuccess = action.payload;
		},
		getSubCasteError(state, action: PayloadAction<empsState>) {
			state.getSubCasteLoading = false;
			state.getSubCasteError = action;
			state.getSubCasteSuccess = null;
		},
		getEducation(state, payload?) {
			state.getLoading = true;
		},
		getEducationSuccess(state, action: PayloadAction<empsState>) {
			state.getEducationLoading = false;
			state.getEducationError = null;
			state.getEducationSuccess = action.payload;
		},
		getEducationError(state, action: PayloadAction<empsState>) {
			state.getEducationLoading = false;
			state.getEducationError = action;
			state.getEducationSuccess = null;
		},
		getTransport(state, payload?) {
			state.getLoading = true;
		},
		getTransportSuccess(state, action: PayloadAction<empsState>) {
			state.getTransportLoading = false;
			state.getTransportError = null;
			state.getTransportSuccess = action.payload;
		},
		getTransportError(state, action: PayloadAction<empsState>) {
			state.getTransportLoading = false;
			state.getTransportError = action;
			state.getTransportSuccess = null;
		},
		getVehicle(state, payload?) {
			state.getLoading = true;
		},
		getVehicleSuccess(state, action: PayloadAction<empsState>) {
			state.getVehicleLoading = false;
			state.getVehicleError = null;
			state.getVehicleSuccess = action.payload;
		},
		getVehicleError(state, action: PayloadAction<empsState>) {
			state.getVehicleLoading = false;
			state.getVehicleError = action;
			state.getVehicleSuccess = null;
		},
		getFuel(state, payload?) {
			state.getLoading = true;
		},
		getFuelSuccess(state, action: PayloadAction<empsState>) {
			state.getFuelLoading = false;
			state.getFuelError = null;
			state.getFuelSuccess = action.payload;
		},
		getFuelError(state, action: PayloadAction<empsState>) {
			state.getFuelLoading = false;
			state.getFuelError = action;
			state.getFuelSuccess = null;
		},
		getParaDesingType(state, payload?) {
			state.getLoading = true;
		},
		getParaDesingTypeSuccess(state, action: PayloadAction<empsState>) {
			state.getParaDesingTypeLoading = false;
			state.getParaDesingTypeError = null;
			state.getParaDesingTypeSuccess = action.payload;
		},
		getParaDesingTypeError(state, action: PayloadAction<empsState>) {
			state.getParaDesingTypeLoading = false;
			state.getParaDesingTypeError = action;
			state.getParaDesingTypeSuccess = null;
		},
		getParaGenderType(state, payload?) {
			state.getLoading = true;
		},
		getParaGenderTypeSuccess(state, action: PayloadAction<empsState>) {
			state.getParaGenderTypeLoading = false;
			state.getParaGenderTypeError = null;
			state.getParaGenderTypeSuccess = action.payload;
		},
		getParaGenderTypeError(state, action: PayloadAction<empsState>) {
			state.getParaGenderTypeLoading = false;
			state.getParaGenderTypeError = action;
			state.getParaGenderTypeSuccess = null;
		},
		getProc(state, payload?) {
			state.getLoading = true;
		},
		getProcSuccess(state, action: PayloadAction<empsState>) {
			state.getProcLoading = false;
			state.getProcError = null;
			state.getProcSuccess = action.payload;
		},
		getProcError(state, action: PayloadAction<empsState>) {
			state.getProcLoading = false;
			state.getProcError = action;
			state.getProcSuccess = null;
		},
		getDepartment(state, payload?) {
			state.getLoading = true;
		},
		getDeptSuccess(state, action: PayloadAction<empsState>) {
			state.getDeptLoading = false;
			state.getDeptError = null;
			state.getDeptSuccess = action.payload;
		},
		getDeptError(state, action: PayloadAction<empsState>) {
			state.getDeptLoading = false;
			state.getDeptError = action;
			state.getDeptSuccess = null;
		},
		getIncharge(state, payload?) {
			state.getLoading = true;
		},
		getInchSuccess(state, action: PayloadAction<empsState>) {
			state.getInchLoading = false;
			state.getInchError = null;
			state.getInchSuccess = action.payload;
		},
		getInchError(state, action: PayloadAction<empsState>) {
			state.getInchLoading = false;
			state.getInchError = action;
			state.getInchSuccess = null;
		},
		getIncharget(state, payload?) {
			state.getLoading = true;
		},
		getInchtSuccess(state, action: PayloadAction<empsState>) {
			state.getInchtLoading = false;
			state.getInchtError = null;
			state.getInchtSuccess = action.payload;
		},
		getInchtError(state, action: PayloadAction<empsState>) {
			state.getInchtLoading = false;
			state.getInchtError = action;
			state.getInchtSuccess = null;
		},
		getVerifyBy(state, payload?) {
			state.getLoading = true;
		},
		getVerifySuccess(state, action: PayloadAction<empsState>) {
			state.getVerifyLoading = false;
			state.getVerifyError = null;
			state.getVerifySuccess = action.payload;
		},
		getVerifyError(state, action: PayloadAction<empsState>) {
			state.getVerifyLoading = false;
			state.getVerifyError = action;
			state.getVerifySuccess = null;
		},
		getCountry(state, payload?) {
			state.getLoading = true;
		},
		getCountrySuccess(state, action: PayloadAction<empsState>) {
			state.getCountryLoading = false;
			state.getCountryError = null;
			state.getCountrySuccess = action.payload;
		},
		getCountryError(state, action: PayloadAction<empsState>) {
			state.getCountryLoading = false;
			state.getCountryError = action;
			state.getCountrySuccess = null;
		},
		getNation(state, payload?) {
			state.getLoading = true;
		},
		getNationSuccess(state, action: PayloadAction<empsState>) {
			state.getNationLoading = false;
			state.getNationError = null;
			state.getNationSuccess = action.payload;
		},
		getNationError(state, action: PayloadAction<empsState>) {
			state.getNationLoading = false;
			state.getNationError = action;
			state.getNationSuccess = null;
		},
		getVisa(state, payload?) {
			state.getLoading = true;
		},
		getVisaSuccess(state, action: PayloadAction<empsState>) {
			state.getVisaLoading = false;
			state.getVisaError = null;
			state.getVisaSuccess = action.payload;
		},
		getVisaError(state, action: PayloadAction<empsState>) {
			state.getVisaLoading = false;
			state.getVisaError = action;
			state.getVisaSuccess = null;
		},
		getBlood(state, payload?) {
			state.getLoading = true;
		},
		getBloodSuccess(state, action: PayloadAction<empsState>) {
			state.getBloodLoading = false;
			state.getBloodError = null;
			state.getBloodSuccess = action.payload;
		},
		getBloodError(state, action: PayloadAction<empsState>) {
			state.getBloodLoading = false;
			state.getBloodError = action;
			state.getBloodSuccess = null;
		},
		getSalary(state, payload?) {
			state.getLoading = true;
		},
		getSalarySuccess(state, action: PayloadAction<empsState>) {
			state.getSalaryLoading = false;
			state.getSalaryError = null;
			state.getSalarySuccess = action.payload;
		},
		getSalaryError(state, action: PayloadAction<empsState>) {
			state.getSalaryLoading = false;
			state.getSalaryError = action;
			state.getSalarySuccess = null;
		},
		getKycs(state, payload?) {
			state.getLoading = true;
		},
		getKycsSuccess(state, action: PayloadAction<empsState>) {
			state.getKycsLoading = false;
			state.getKycsError = null;
			state.getKycsSuccess = action.payload;
		},
		getKycsError(state, action: PayloadAction<empsState>) {
			state.getKycsLoading = false;
			state.getKycsError = action;
			state.getKycsSuccess = null;
		},
		getManager(state, payload?) {
			state.getLoading = true;
		},
		getManagerSuccess(state, action: PayloadAction<empsState>) {
			state.getManagerLoading = false;
			state.getManagerError = null;
			state.getManagerSuccess = action.payload;
		},
		getManagerError(state, action: PayloadAction<empsState>) {
			state.getManagerLoading = false;
			state.getManagerError = action;
			state.getManagerSuccess = null;
		},
		getDesigRole(state, payload?) {
			state.getDesigRoleLoading = true;
		},
		getDesigRoleSuccess(state, action: PayloadAction<empsState>) {
			state.getDesigRoleLoading = false;
			state.getDesigRoleError = null;
			state.getDesigRoleSuccess = action.payload;
		},
		getDesigRoleError(state, action: PayloadAction<empsState>) {
			state.getDesigRoleLoading = false;
			state.getDesigRoleError = action;
			state.getDesigRoleSuccess = null;
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

			state.getOneDetLoading = false;
			state.getOneDetError = null;
			state.getOneDetSuccess = null;

			state.getDesigRoleLoading = false;
			state.getDesigRoleError = null;
			state.getDesigRoleSuccess = null;
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: empsActions, reducer } = empsSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useEmpsSlice = () => {
	useInjectReducer({ key: empsSlice.name, reducer: empsSlice.reducer });
	useInjectSaga({ key: empsSlice.name, saga: Saga });
	return { actions: empsSlice.actions };
};
