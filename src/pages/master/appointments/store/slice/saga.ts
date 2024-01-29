import { call, put, takeLatest } from 'redux-saga/effects';
import { KeyedObject } from 'types/root';

import request from '@services/request';

import { appointmentActions as actions } from '.';

interface IResponse {
	data?: any;
}

/** * APIs */
const API_PATH = 'tenderappointments';
const MODULE_ID = 'seq_no';
const SUPPLIER_API_PATH = 'namemass';
const TENDERNO_API_PATH = 'tendermass';
const ATTENDEE_API_PATH = 'namemass';

const GET_URL = `/api/v1/${API_PATH}`;
const ADD_URL = `/api/v1/${API_PATH}`;
const EDIT_URL = `/api/v1/${API_PATH}`;
const DELETE_URL = `/api/v1/${API_PATH}`;
const GET_ONE_URL = `/api/v1/${API_PATH}`;
const GET_DET_URL = `/api/v1/${SUPPLIER_API_PATH}`;
const GET_TENDERNO_URL = `/api/v1/${TENDERNO_API_PATH}`;
const GET_ATTENDEE_URL = `/api/v1/${ATTENDEE_API_PATH}`;

function getApi(data: { QueryParams: any }) {
	console.log('QueryParams', data);

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
function getSupplierApi(data: { QueryParams: any }) {
	console.log('QueryParams', data);

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

function getAttendeeApi(data: { QueryParams: any }) {
	console.log('QueryParams', data);

	if (data && data.QueryParams) {
		return request({
			url: `${GET_ATTENDEE_URL}?${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_ATTENDEE_URL}`,
		method: 'GET'
	});
}

function getTenderNoApi(data: { QueryParams: any }) {
	console.log('QueryParams', data);

	if (data && data.QueryParams) {
		return request({
			url: `${GET_TENDERNO_URL}?${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_TENDERNO_URL}`,
		method: 'GET'
	});
}

function getTenderNoApiSelect(data: { QueryParams: any }) {
	console.log('QueryParams', data);

	if (data && data.QueryParams) {
		return request({
			url: `${GET_TENDERNO_URL}/${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_TENDERNO_URL}`,
		method: 'GET'
	});
}

function addApi(data: KeyedObject) {
	return request({ url: `${ADD_URL}`, method: 'POST', data });
}

function editApi(data: KeyedObject) {
	console.log('DATATATATAAT', data);
	return request({ url: `${EDIT_URL}/${data[MODULE_ID]}`, method: 'PUT', data });
}

function deleteApi(data: KeyedObject) {
	return request({ url: `${DELETE_URL}/${data[MODULE_ID]}`, method: 'DELETE' });
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
function* getSupplier(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getSupplierApi, payload);

		if (res.data) {
			yield put(actions.getSupplierSuccess(res.data));
		} else {
			yield put(actions.getSupplierError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getSupplierError({
					error: e.data
				})
			);
		}
	}
}

function* getAttendee(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getAttendeeApi, payload);

		if (res.data) {
			yield put(actions.getAttendeeSuccess(res.data));
		} else {
			yield put(actions.getAttendeeError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getAttendeeError({
					error: e.data
				})
			);
		}
	}
}

function* getTenderNo(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getTenderNoApi, payload);

		if (res.data) {
			yield put(actions.getTenderNoSuccess(res.data));
		} else {
			yield put(actions.getTenderNoError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getTenderNoError({
					error: e.data
				})
			);
		}
	}
}

function* getTenderNoSelect(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getTenderNoApiSelect, payload);

		if (res.data) {
			yield put(actions.getTenderNoSelectSuccess(res.data));
		} else {
			yield put(actions.getTenderNoSelectError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getTenderNoSelectError({
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
	yield takeLatest(actions.add.type, add);
	yield takeLatest(actions.edit.type, edit);
	yield takeLatest(actions.delete.type, del);
	yield takeLatest(actions.getOne.type, getOne);
	yield takeLatest(actions.getSupplier.type, getSupplier);
	yield takeLatest(actions.getTenderNo.type, getTenderNo);
	yield takeLatest(actions.getTenderNoSelect.type, getTenderNoSelect);
	yield takeLatest(actions.getAttendee.type, getAttendee);
}
