import { call, put, takeLatest } from 'redux-saga/effects';
import { KeyedObject } from 'types/root';

import request from '@services/request';

import { propsActions as actions } from '.';

interface IResponse {
	data?: any;
}

/** * APIs */
//PROPS
const API_PATH = 'props';
const MODULE_ID = 'seq_no';

//PROP DETAILS
const API_DET_PATH = 'prop';
//const MODULE_DET_ID = 'seq_no';

//PROPS
const GET_URL = `/api/v1/${API_PATH}`;
const ADD_URL = `/api/v1/${API_PATH}`;
const EDIT_URL = `/api/v1/${API_PATH}`;
const DELETE_URL = `/api/v1/${API_PATH}`;

const ADD_DET_URL = `/api/v1/${API_DET_PATH}`;
const EDIT_DET_URL = `/api/v1/${API_DET_PATH}`;
const DELETE_DET_URL = `/api/v1/${API_DET_PATH}`;
const GET_ONE_DET_URL = `/api/v1/${API_DET_PATH}`;

//PROPS
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

//PROPS
function addApi(data: KeyedObject) {
	return request({ url: `${ADD_URL}`, method: 'POST', data });
}

//PROPS
function editApi(data: KeyedObject) {
	return request({ url: `${EDIT_URL}/${data[MODULE_ID]}`, method: 'PUT', data });
}

//PROPS
function deleteApi(data: KeyedObject) {
	return request({ url: `${DELETE_URL}/${data[MODULE_ID]}`, method: 'DELETE' });
}

//PROP DETAILS

function addDetApi(data: KeyedObject) {
	return request({ url: `${ADD_DET_URL}`, method: 'POST', data });
}

//PARA
function editDetApi(data: KeyedObject) {
	return request({ url: `${EDIT_DET_URL}/${data[MODULE_ID]}`, method: 'PUT', data });
}

//PARA
function deleteDetApi(data: KeyedObject) {
	return request({ url: `${DELETE_DET_URL}/${data[MODULE_ID]}`, method: 'DELETE' });
}

function getOneDetApi(data: KeyedObject) {
	//return request({ url: `${GET_ONE_DET_URL}`, method: 'GET' });
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

//PROPS
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

//PROPS
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

//PROPS
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

//PROPS
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

//PROP DETAILS

function* addDet(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(addDetApi, payload);

		if (res.data) {
			yield put(actions.addDetSuccess(res.data));
		} else {
			yield put(actions.addDetError(res.data));
		}
	} catch (error: any) {
		if (error.data) {
			yield put(
				actions.addDetError({
					error: error.data
				})
			);
		}
	}
}

//PARAS
function* editDet(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(editDetApi, payload);

		if (res.data) {
			yield put(actions.editDetSuccess(res.data));
		} else {
			yield put(actions.editDetError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.editDetError({
					error: e.data
				})
			);
		}
	}
}

//PARAS
function* delDet(data: KeyedObject) {
	try {
		const { payload } = data;
		const res: IResponse = yield call(deleteDetApi, payload);

		if (res.data) {
			yield put(actions.deleteDetSuccess(res.data));
		} else {
			yield put(actions.deleteDetError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.deleteDetError({
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

/**
 * Root saga manages watcher lifecycle
 */

export function* Saga() {
	//PROPS
	yield takeLatest(actions.get.type, get);
	yield takeLatest(actions.add.type, add);
	yield takeLatest(actions.edit.type, edit);
	yield takeLatest(actions.delete.type, del);
	yield takeLatest(actions.addDet.type, addDet);
	yield takeLatest(actions.editDet.type, editDet);
	yield takeLatest(actions.deleteDet.type, delDet);
	yield takeLatest(actions.getOneDet.type, getOneDet);
}
