import { call, put, takeLatest } from 'redux-saga/effects';
import { KeyedObject } from 'types/root';

import request from '@services/request';

import { partiesActions as actions } from '.';

interface IResponse {
	data?: any;
}

/** * APIs */
const API_PATH = 'partys';
const MODULE_ID = 'seq_no';

const API_PARA_PATH = 'para';
const API_LAB_PATH = 'labs';
const API_PROC_PATH = 'procs';
const DEPT_API_PATH = 'namemass';

const GET_URL = `/api/v1/${API_PATH}`;
const ADD_URL = `/api/v1/${API_PATH}`;
const EDIT_URL = `/api/v1/${API_PATH}`;
const DELETE_URL = `/api/v1/${API_PATH}`;
const GET_ONE_URL = `/api/v1/${API_PATH}`;

const GET_PARA_URL = `/api/v1/${API_PARA_PATH}`;
const GET_LAB_URL = `/api/v1/${API_LAB_PATH}`;
const GET_PROC_URL = `/api/v1/${API_PROC_PATH}`;
const GET_DEPT_URL = `/api/v1/${DEPT_API_PATH}`;

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

function getParaApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getParaDesignationApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getParaAcTypeApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getProcApi(data: KeyedObject) {
	return request({
		url: `${GET_PROC_URL}?${data.QueryParams}`,
		method: 'GET'
	});
}

function getALabApi(data: KeyedObject) {
	return request({
		url: `${GET_LAB_URL}` + '?page=1&limit=11&pagination=false',
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
	return request({ url: `${GET_ONE_URL}/${data[MODULE_ID]}`, method: 'GET' });
}

function getOneDetApi(data: KeyedObject) {
	return request({
		url: `${GET_ONE_URL}/${data}`,
		method: 'GET'
	});
}

function getParaGenderApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getVerifyBy(data: { QueryParams: any }) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_DEPT_URL}?${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_URL}`,
		method: 'GET'
	});
}

function getKycsApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}
function getProgramsApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
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

function* getPara(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getParaApi, payload);

		if (res.data) {
			yield put(actions.getParaSuccess(res.data));
		} else {
			yield put(actions.getParaError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getParaError({
					error: e.data
				})
			);
		}
	}
}

function* getParaDesingType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getParaDesignationApi, payload);

		if (res.data) {
			yield put(actions.getParaDesingTypeSuccess(res.data));
		} else {
			yield put(actions.getParaDesingTypeError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getParaDesingTypeError({
					error: e.data
				})
			);
		}
	}
}

function* getParaAcType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getParaAcTypeApi, payload);

		if (res.data) {
			yield put(actions.getParaAcTypeSuccess(res.data));
		} else {
			yield put(actions.getParaAcTypeError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getParaAcTypeError({
					error: e.data
				})
			);
		}
	}
}

function* getProc(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getProcApi, payload);

		if (res.data) {
			yield put(actions.getProcSuccess(res.data));
		} else {
			yield put(actions.getProcError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getProcError({
					error: e.data
				})
			);
		}
	}
}

function* getAlab(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getALabApi, payload);

		if (res.data) {
			yield put(actions.getAlabSuccess(res.data));
		} else {
			yield put(actions.getAlabError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getAlabError({
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

function* getParaGenderType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getParaGenderApi, payload);

		if (res.data) {
			yield put(actions.getParaGenderTypeSuccess(res.data));
		} else {
			yield put(actions.getParaGenderTypeError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getParaGenderTypeError({
					error: e.data
				})
			);
		}
	}
}

function* getVeriBy(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getVerifyBy, payload);

		if (res.data) {
			yield put(actions.getVerifySuccess(res.data));
		} else {
			yield put(actions.getVerifyError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getVerifyError({
					error: e.data
				})
			);
		}
	}
}

function* getKycsType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getKycsApi, payload);

		if (res.data) {
			yield put(actions.getKycsSuccess(res.data));
		} else {
			yield put(actions.getKycsError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getKycsError({
					error: e.data
				})
			);
		}
	}
}

function* getProgramType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getProgramsApi, payload);

		if (res.data) {
			yield put(actions.getProgramsSuccess(res.data));
		} else {
			yield put(actions.getProgramsError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getProgramsError({
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
	yield takeLatest(actions.getPara.type, getPara);
	yield takeLatest(actions.getProc.type, getProc);
	yield takeLatest(actions.getAlab.type, getAlab);
	yield takeLatest(actions.getOneDet.type, getOneDet);
	yield takeLatest(actions.getParaDesingType.type, getParaDesingType);
	yield takeLatest(actions.getParaGenderType.type, getParaGenderType);
	yield takeLatest(actions.getParaAcType.type, getParaAcType);
	yield takeLatest(actions.getVerifyBy.type, getVeriBy);
	yield takeLatest(actions.getKycs.type, getKycsType);
	yield takeLatest(actions.getPrograms.type, getProgramType);
}
