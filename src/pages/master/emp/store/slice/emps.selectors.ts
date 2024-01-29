import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types/rootstate';

import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => (state && state.emps) || initialState;

export const empsSelector = createSelector([selectDomain], empsState => empsState);
