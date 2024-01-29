import { call, put, takeLatest } from 'redux-saga/effects';
import { KeyedObject } from 'types/root';

import request from '@services/request';

import { rangeActions as actions } from '.';

interface IResponse {
	data?: any;
}

/** * APIs */
//RANGES
const API_PATH = 'ranges';
const MODULE_ID = 'seq_no';

const API_PARA_PATH = 'para';

//RANGES DETAILS
const API_DET_PATH = 'ranges';
// const MODULE_DET_ID = 'type';

//RANGESS
// const GET_URL = `/api/v1/${API_PATH}`;
const ADD_URL = `/api/v1/${API_PATH}`;
const EDIT_URL = `/api/v1/${API_PATH}`;
const DELETE_URL = `/api/v1/${API_PATH}`;
// const GET_ONE_URL = `/api/v1/${API_PATH}`;
const GET_DET_URL = `/api/v1/${API_DET_PATH}`; //for grid

const GET_ONE_DET_URL = `/api/v1/${API_PATH}`; //for dropdown

const GET_PARA_URL = `/api/v1/${API_PARA_PATH}`; //for dropdown

//RANGESS
function getApi(data: { QueryParams: any }) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_DET_URL}?${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_DET_URL}`,
		method: 'GET'
	});
}

function getOneParaApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}
//RANGESS
function addApi(data: KeyedObject) {
	return request({ url: `${ADD_URL}`, method: 'POST', data });
}

//RANGESS
function editApi(data: KeyedObject) {
	return request({ url: `${EDIT_URL}/${data[MODULE_ID]}`, method: 'PUT', data });
}

//RANGESS
function deleteApi(data: KeyedObject) {
	return request({ url: `${DELETE_URL}/${data[MODULE_ID]}`, method: 'DELETE' });
}

//RANGES DETAILS
function getOneDetApi(data: KeyedObject) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_ONE_DET_URL}?${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_ONE_DET_URL}`,
		method: 'GET'
	});
}

/** SAGA */

//RANGESS
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

//RANGESS
function* add(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(addApi, payload);

		if (res.data) {
			yield put(actions.addSuccess(res.data));
		} else {
			yield put(actions.addError(res.data));
		}
	} catch (error: any) {
		if (error.data) {
			yield put(
				actions.addError({
					error: error.data
				})
			);
		}
	}
}

//RANGESS
function* edit(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(editApi, payload);

		if (res.data) {
			yield put(actions.editSuccess(res.data));
		} else {
			yield put(actions.editError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.editError({
					error: e.data
				})
			);
		}
	}
}

//RANGESS
function* del(data: KeyedObject) {
	try {
		const { payload } = data;
		const res: IResponse = yield call(deleteApi, payload);

		if (res.data) {
			yield put(actions.deleteSuccess(res.data));
		} else {
			yield put(actions.deleteError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.deleteError({
					error: e.data
				})
			);
		}
	}
}

//RANGES DETAILS
function* getOneDet(data: KeyedObject) {
	try {
		const { payload } = data;
		const res: IResponse = yield call(getOneDetApi, payload);

		if (res.data) {
			yield put(actions.getOneDetSuccess(res.data));
		} else {
			yield put(actions.getOneDetError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getOneDetError({
					error: e.data
				})
			);
		}
	}
}

function* getOne(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getOneParaApi, payload);

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
	//RANGESS
	yield takeLatest(actions.get.type, get);
	yield takeLatest(actions.add.type, add);
	yield takeLatest(actions.edit.type, edit);
	yield takeLatest(actions.delete.type, del);
	yield takeLatest(actions.getOne.type, getOne);
	yield takeLatest(actions.getOneDet.type, getOneDet);
}
