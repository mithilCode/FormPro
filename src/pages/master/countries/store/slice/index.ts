/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit';

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { countryState } from './types'; //CountryProps

// initial state
export const initialState: countryState = {
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

// ==============================|| SLICE - COUNTRY ||============================== //

	const countrySlice = createSlice({
		name: 'country',
		initialState,
		reducers: {
			get(state, payload?) {
				state.getLoading = true;
			},
			getSuccess(state, action: PayloadAction<countryState>) {
				state.getLoading = false;
				state.getError = null;
				state.getSuccess = action.payload;
			},
			getError(state, action: PayloadAction<countryState>) {
				state.getLoading = false;
				state.getError = action;
				state.getSuccess = null;
			},
			add(state, payload?) {
				state.loading = true;
			},
		addSuccess(state, action: PayloadAction<countryState>) {
			state.loading = false;
			state.addError = null;
			state.addSuccess = action.payload;
		},
		addError(state, action: PayloadAction<countryState>) {
			state.loading = false;
			state.addError = action.payload;
			state.addSuccess = null;
		},
		edit(state, payload?) {
			state.loading = true;
		},
		editSuccess(state, action: PayloadAction<countryState>) {
			state.loading = false;
			state.editError = null;
			state.editSuccess = action.payload;
		},
		editError(state, action: PayloadAction<countryState>) {
			state.loading = false;
			state.editError = action.payload;
			state.editSuccess = null;
		},
		delete(state, payload?) {
			state.loading = true;
		},
		deleteSuccess(state, action: PayloadAction<countryState>) {
			state.loading = false;
			state.deleteError = null;
			state.deleteSuccess = action.payload;
		},
		deleteError(state, action: PayloadAction<countryState>) {
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
	// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// 	register(state, action) {
	// 		// : PayloadAction<Partial<authState>>
	// 		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	// 		const { country } = action.payload!;
	// 		state.country = country;
	// 	},
	// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// 	login(state, action) {
	// 		state.loading = true;
	// 	},
	// 	success(state, action: PayloadAction<countryState>) {
	// 		state.loading = false;
	// 		state.apiError = null;
	// 		state.apiSuccess = action.payload;
	// 	},
	// 	error(state, action: PayloadAction<countryState>) {
	// 		state.loading = false;
	// 		state.apiError = action.payload;
	// 		state.apiSuccess = null;
	// 	},
	// 	reset(state: typeof initialState) {
	// 		state.loading = false;
	// 		state.apiError = null;
	// 		state.apiSuccess = null;
	// 	}
	// }
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: countryActions, reducer } = countrySlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useCountrySlice = () => {
	useInjectReducer({ key: countrySlice.name, reducer: countrySlice.reducer });
	useInjectSaga({ key: countrySlice.name, saga: Saga });
	return { actions: countrySlice.actions };
};
