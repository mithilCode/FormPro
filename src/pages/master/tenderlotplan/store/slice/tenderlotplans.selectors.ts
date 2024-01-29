import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types/rootstate';

import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => (state && state.tenderlotplans) || initialState;

export const tenderlotplansSelector = createSelector(
	[selectDomain],
	tenderlotplansState => tenderlotplansState
);
