// third-party
import { configureStore, StoreEnhancer } from '@reduxjs/toolkit';

import { createInjectorsEnhancer } from 'redux-injectors';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

// project import
import { createReducer } from './rootReducer';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

export function configureAppStore() {
	const reduxSagaMonitorOptions = {};
	const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
	const { run: runSaga } = sagaMiddleware;

	// Create the store with saga middleware
	const middlewares =
		process.env.NODE_ENV === 'production' ? [logger, sagaMiddleware] : [logger, sagaMiddleware];

	const enhancers = [
		createInjectorsEnhancer({
			createReducer,
			runSaga
		})
	] as StoreEnhancer[];

	const store = configureStore({
		reducer: createReducer(),
		middleware: defaultMiddleware => [
			...defaultMiddleware({ thunk: false, serializableCheck: false }),
			...middlewares
		],
		devTools:
			/* istanbul ignore next line */
			process.env.NODE_ENV !== 'production', // || process.env.PUBLIC_URL.length > 0,
		enhancers
	});

	return store;
}
