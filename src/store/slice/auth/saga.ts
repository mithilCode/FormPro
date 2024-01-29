import { call, put, takeLatest } from 'redux-saga/effects';

import request from '@services/request';

import { authActions as actions } from '.';

/** * APIs */
export const LOGININ_URL = '/api/v1/login'; //'/api/v1/login';
export const REGISTER_URL = '/api/v1/register';

export interface IResponse {
	data?: any;
}

function logInApi(data: any) {
	return request({ url: LOGININ_URL, method: 'POST', data });
}

function registerApi(data: any) {
	return request({ url: REGISTER_URL, method: 'POST', data });
}

/** SAGA */

function* loginIn(data: any) {
	console.log('IN SAGA');

	try {
		const { payload } = data;

		const res: IResponse = yield call(logInApi, payload);

		console.log('RES DATA', res, res.data);

		if (res.data) {
			console.log('here');

			yield put(actions.success(res.data));
		} else {
			console.log('data here');
			yield put(actions.error(res.data));
		}
	} catch (error: any) {
		if (error.data) {
			console.log('Error', error);

			yield put(
				actions.error({
					apiError: error.data,
					isLoggedIn: false
				})
			);
		}
	}
}

function* register(data: any) {
	console.log('IN SAGA REGISTER');

	try {
		const { payload } = data;

		const res: IResponse = yield call(registerApi, payload);

		console.log('RES DATA', res, res.data);

		if (res.data) {
			console.log('here');

			yield put(actions.success(res.data));
		} else {
			console.log('data here');
			yield put(actions.error(res.data));
		}
	} catch (error: any) {
		if (error.data) {
			console.log('Error', error);

			yield put(
				actions.error({
					apiError: error.data,
					isLoggedIn: false
				})
			);
		}
	}
}

/**
 * Root saga manages watcher lifecycle
 */

export function* Saga() {
	yield takeLatest(actions.login.type, loginIn);
	yield takeLatest(actions.register.type, register);
}
