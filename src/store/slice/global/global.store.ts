import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@utils/@reduxjs/toolkit'; // Importing from `utils` makes them more type-safe ✅

import { useInjectReducer } from '@utils/redux-injectors'; //, useInjectSaga

import { globalState } from './types';

// import { createSlice } from '@app/utils/@reduxjs/toolkit'; // Importing from `utils` makes them more type-safe ✅

const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const userTheme = localStorage.getItem('theme') as globalState['theme'];

const userLayout = localStorage.getItem('layout') as unknown as globalState['layout'];

export const initialState: globalState = {
	theme: userTheme || systemTheme,
	loading: false,
	layout: userLayout ? JSON.parse(userLayout) : userLayout
};

const globalSlice = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setGlobalState(state, action: PayloadAction<Partial<globalState>>) {
			Object.assign(state, action.payload);

			if (action.payload.theme) {
				const body = document.body;

				if (action.payload.theme === 'dark') {
					if (!body.hasAttribute('theme-mode')) {
						body.setAttribute('theme-mode', 'dark');
					}
				} else {
					if (body.hasAttribute('theme-mode')) {
						body.removeAttribute('theme-mode');
					}
				}
			}
		}
	}
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: globalActions, reducer } = globalSlice;

// export default globalSlice.reducer;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useGlobalSlice = () => {
	useInjectReducer({ key: globalSlice.name, reducer: globalSlice.reducer });
	//useInjectSaga({ key: globalSlice.name, saga: Saga });
	return { actions: globalSlice.actions };
};
