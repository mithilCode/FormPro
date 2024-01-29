import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types/rootstate';

import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => (state && state.shapes) || initialState;

export const shapesSelector = createSelector([selectDomain], shapesState => shapesState);
