import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit'; // Importing from `utils` makes them more type-safe ✅

import { useInjectReducer, useInjectSaga } from '@utils/redux-injectors'; //,

import { Saga } from './saga';
import { authState } from './types';

// import { createSlice } from '@app/utils/@reduxjs/toolkit'; // Importing from `utils` makes them more type-safe ✅
// import { PayloadAction } from '@reduxjs/toolkit';

// initial state
export const initialState: authState = {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	isLoggedIn: (localStorage.getItem('isLoggedIn')! || false) as boolean,
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	isInitialized: (localStorage.getItem('isInitialized')! || false) as boolean,
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	user: (localStorage.getItem('user')! || false) as any
};

// ==============================|| SLICE - AUTH ||============================== //

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		register(state, action) {
			// : PayloadAction<Partial<authState>>
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const { user } = action.payload!;
			state.user = user;
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		login(state, action) {
			state.loading = true;
			// // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			// const { user } = action.payload!;
			// state.isLoggedIn = true;
			// state.isInitialized = true;
			// state.user = user;

			// localStorage.setItem('isLoggedIn', state.isLoggedIn.toString() || 'false');
			// localStorage.setItem('isInitialized', state.isInitialized.toString() || 'false');
			// localStorage.setItem('user', action.payload.username || null);
		},
		success(state, action: PayloadAction<authState>) {
			state.loading = false;
			state.apiError = null;
			state.apiSuccess = action.payload;
		},
		error(state, action: PayloadAction<authState>) {
			state.loading = false;
			state.apiError = action.payload;
			state.apiSuccess = null;
		},
		reset(state: typeof initialState) {
			state.loading = false;
			state.apiError = null;
			state.apiSuccess = null;
		},
		logout(state) {
			state.isInitialized = true;
			state.isLoggedIn = false;
			state.user = null;
		},
		submitLogin(state, action: PayloadAction<authState>) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const { user } = action.payload!;
			state.isInitialized = true;
			state.isLoggedIn = true;
			state.user = user;
		}

		// signIn(state, action: PayloadAction<LoginParams>) {
		// 	state.loading = true;
		// },

		// case REGISTER: {
		// 	const { user } = action.payload!;
		// 	return {
		// 		...state,
		// 		user
		// 	};
		// }
		// case LOGIN: {
		// 	const { user } = action.payload!;
		// 	return {
		// 		...state,
		// 		isLoggedIn: true,
		// 		isInitialized: true,
		// 		user
		// 	};
		// }
		// case LOGOUT: {
		// 	return {
		// 		...state,
		// 		isInitialized: true,
		// 		isLoggedIn: false,
		// 		user: null
		// 	};
		// }
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: authActions, reducer } = authSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useAuthSlice = () => {
	useInjectReducer({ key: authSlice.name, reducer: authSlice.reducer });
	useInjectSaga({ key: authSlice.name, saga: Saga });
	return { authActions: authSlice.actions };
};
