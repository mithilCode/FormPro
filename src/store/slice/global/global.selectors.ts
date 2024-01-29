import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@apptypes/rootstate';

import { initialState } from './global.store';

// First select the relevant part from the state
const selectDomain = (state: RootState) => (state && state.global) || initialState;

export const globalLoading = createSelector([selectDomain], globalState => globalState.loading);

export const globalTheme = createSelector([selectDomain], globalState => globalState.theme);
