import { call, put, takeLatest } from 'redux-saga/effects';
import { KeyedObject } from 'types/root';

import request from '@services/request';

import { organisationActions as actions } from '.';

interface IResponse {
	data?: any;
}

/** * APIs */
const API_PATH = 'organisations';
const MODULE_ID = 'idOrganisation';

const GET_URL = `/api/v1/${API_PATH}`;
const GET_ONE_URL = `/api/v1/${API_PATH}`;

function getApi(data: { QueryParams: any }) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_URL}?${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_URL}`,
		method: 'GET'
	});
}

function getOneApi(data: KeyedObject) {
	return request({ url: `${GET_ONE_URL}/${data[MODULE_ID]}`, method: 'GET' });
}

/** SAGA */

function* get(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getApi, payload);

		if (res.data) {
			yield put(actions.getSuccess(res.data));
		} else {
			yield put(actions.getError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getError({
					error: e.data
				})
			);
		}
	}
}

function* getOne(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getOneApi, payload);

		if (res.data) {
			yield put(actions.getOneSuccess(res.data));
		} else {
			yield put(actions.getOneError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getOneError({
					error: e.data
				})
			);
		}
	}
}

/**
 * Root saga manages watcher lifecycle
 */

export function* Saga() {
	yield takeLatest(actions.get.type, get);
	yield takeLatest(actions.getOne.type, getOne);
}
