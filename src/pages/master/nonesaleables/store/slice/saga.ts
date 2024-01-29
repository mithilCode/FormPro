import { call, put, takeLatest } from 'redux-saga/effects';
import { KeyedObject } from 'types/root';

import request from '@services/request';

import { nonesaleablesActions as actions } from '.';

interface IResponse {
	data?: any;
}

/** * APIs */
const API_PATH = 'nonesaleables';
const MODULE_ID = 'seq_no';
const API_PARA_PATH = 'para';

const GET_URL = `/api/v1/${API_PATH}`;
const ADD_URL = `/api/v1/${API_PATH}`;
const EDIT_URL = `/api/v1/${API_PATH}`;
const DELETE_URL = `/api/v1/${API_PATH}`;
const GET_ONE_URL = `/api/v1/${API_PATH}`;
const GET_PARA_URL = `/api/v1/${API_PARA_PATH}`;

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

function getTensionApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}
function getMilkyApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}
function getNattsApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function addApi(data: KeyedObject) {
	return request({ url: `${ADD_URL}`, method: 'POST', data });
}

function editApi(data: KeyedObject) {
	return request({ url: `${EDIT_URL}/${data[MODULE_ID]}`, method: 'PUT', data });
}

function deleteApi(data: KeyedObject) {
	return request({ url: `${DELETE_URL}/${data[MODULE_ID]}`, method: 'DELETE' });
}

function getOneApi(data: KeyedObject) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_ONE_URL}?${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_ONE_URL}`,
		method: 'GET'
	});
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
				actions.getError({
					error: e.data
				})
			);
		}
	}
}

function* getTension(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getTensionApi, payload);

		if (res.data) {
			yield put(actions.getTensionSuccess(res.data));
		} else {
			yield put(actions.getTensionError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getTensionError({
					error: e.data
				})
			);
		}
	}
}
function* getMilky(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getMilkyApi, payload);

		if (res.data) {
			yield put(actions.getMilkySuccess(res.data));
		} else {
			yield put(actions.getMilkyError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getMilkyError({
					error: e.data
				})
			);
		}
	}
}
function* getNatts(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getNattsApi, payload);

		if (res.data) {
			yield put(actions.getNattsSuccess(res.data));
		} else {
			yield put(actions.getNattsError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getNattsError({
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
	yield takeLatest(actions.add.type, add);
	yield takeLatest(actions.edit.type, edit);
	yield takeLatest(actions.delete.type, del);
	yield takeLatest(actions.getOne.type, getOne);
	yield takeLatest(actions.getTension.type, getTension);
	yield takeLatest(actions.getMilky.type, getMilky);
	yield takeLatest(actions.getNatts.type, getNatts);
}
