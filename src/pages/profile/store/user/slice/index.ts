import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors';

import { Saga } from './saga';
import { userState } from './types';

// initial state
export const initialState: userState = {
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

	passwordChangeError: null,
	passwordChangeSuccess: null
};

// ==============================|| SLICE - USERS ||============================== //

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		get(state, payload?) {
			state.getLoading = true;
		},
		getSuccess(state, action: PayloadAction<userState>) {
			state.getLoading = false;
			state.getError = null;
			state.getSuccess = action.payload;
		},
		getError(state, action: PayloadAction<userState>) {
			state.getLoading = false;
			state.getError = action;
			state.getSuccess = null;
		},
		add(state) {
			state.loading = true;
		},
		addSuccess(state, action: PayloadAction<userState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<userState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<userState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<userState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<userState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<userState>) {
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
		passwordChange(state, action: PayloadAction<userState>) {
			state.loading = true;
		},
		passwordChangeSuccess(state, action: PayloadAction<userState>) {
			state.loading = false;
			state.passwordChangeError = null;
			state.passwordChangeSuccess = action.payload;
		},
		passwordChangeError(state, action: PayloadAction<userState>) {
			state.loading = false;
			state.passwordChangeError = action.payload;
			state.passwordChangeSuccess = null;
		},
		getOneProfile(state, payload?) {
			state.getOneProfileLoading = true;
		},
		getOneProfileSuccess(state, action) {
			state.getOneProfileLoading = false;
			state.getOneProfileError = null;
			state.getOneProfileSuccess = action.payload;
		},
		getOneProfileError(state, action) {
			state.getOneProfileLoading = false;
			state.getOneProfileError = action.payload;
			state.getOneProfileSuccess = null;
		},
		getPayments(state, payload?) {
			state.getPaymentsLoading = true;
		},
		getPaymentsSuccess(state, action) {
			state.getPaymentsLoading = false;
			state.getPaymentsError = null;
			state.getPaymentsSuccess = action.payload;
		},
		getPaymentsError(state, action) {
			state.getPaymentsLoading = false;
			state.getPaymentsError = action.payload;
			state.getPaymentsSuccess = null;
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

			state.passwordChangeError = null;
			state.passwordChangeSuccess = null;

			state.getOneProfileLoading = false;
			state.getOneProfileError = null;
			state.getOneProfileSuccess = null;

			state.getPaymentsLoading = false;
			state.getPaymentsError = null;
			state.getPaymentsSuccess = null;
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: userActions, reducer } = userSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useUserSlice = () => {
	useInjectReducer({ key: userSlice.name, reducer: userSlice.reducer });
	useInjectSaga({ key: userSlice.name, saga: Saga });
	return { actions: userSlice.actions };
};
