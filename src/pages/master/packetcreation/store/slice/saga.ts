import { call, put, takeLatest } from 'redux-saga/effects';
import { KeyedObject } from 'types/root';

import request from '@services/request';

import { packetcreationsActions as actions } from '.';

interface IResponse {
	data?: any;
}

/** * APIs */
const API_PATH = 'packetcreations';
const MODULE_ID = 'seq_no';
const API_PARA_PATH = 'para';
const API_COLUMNS_SETTING_PATH = 'columnsettings';

const GET_URL = `/api/v1/${API_PATH}`;
const ADD_URL = `/api/v1/${API_PATH}`;
const EDIT_URL = `/api/v1/${API_PATH}`;
const DELETE_URL = `/api/v1/${API_PATH}`;
const GET_ONE_URL = `/api/v1/${API_PATH}`;
const GET_PARA_URL = `/api/v1/${API_PARA_PATH}`;
const GET_COLUMNS_SETTING_URL = `/api/v1/${API_COLUMNS_SETTING_PATH}`;

function getApi(data: { QueryParams: any }) {
	// change '?' to / bcoz changes in service
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

function getApiView(data: { QueryParams: any }) {
	// change '/' to ? bcoz changes in service
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

function getColumnsSettingApi(data: { QueryParams: any }) {
	// CHANGE URL ? TO /
	return request({
		url: `${GET_COLUMNS_SETTING_URL}/${data.QueryParams}`,
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
	// return request({ url: `${GET_ONE_URL}/${data[MODULE_ID]}`, method: 'GET' });
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

function getOneDetApi(data: KeyedObject) {
	return request({
		url: `${GET_ONE_URL}/${data}`,
		method: 'GET'
	});
}

function* getColumnsSetting(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getColumnsSettingApi, payload);

		if (res.data) {
			yield put(actions.getColumnsSettingSuccess(res.data));
		} else {
			yield put(actions.getColumnsSettingError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getColumnsSettingError({
					error: e.data
				})
			);
		}
	}
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

function* getView(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getApiView, payload);

		if (res.data) {
			yield put(actions.getViewSuccess(res.data));
		} else {
			yield put(actions.getViewError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getViewError({
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

/**
 * Root saga manages watcher lifecycle
 */

export function* Saga() {
	yield takeLatest(actions.get.type, get);
	yield takeLatest(actions.add.type, add);
	yield takeLatest(actions.edit.type, edit);
	yield takeLatest(actions.delete.type, del);
	yield takeLatest(actions.getOne.type, getOne);
	yield takeLatest(actions.getView.type, getView);
	yield takeLatest(actions.getOneDet.type, getOneDet);
	yield takeLatest(actions.getColumnsSetting.type, getColumnsSetting);
	yield takeLatest(actions.getTension.type, getTension);
}
