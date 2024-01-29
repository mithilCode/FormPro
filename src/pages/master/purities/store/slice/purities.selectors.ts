import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types/rootstate';

import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => (state && state.purities) || initialState;

export const puritiesSelector = createSelector([selectDomain], puritiesState => puritiesState);
