import { call, put, takeLatest } from 'redux-saga/effects';
import { KeyedObject } from 'types/root';

import request from '@services/request';

import { tenderlotplansActions as actions } from '.';

interface IResponse {
	data?: any;
}

/** * APIs */
const API_PATH = 'tenderplans';
const API_SUMM_PATH = 'tenderplanssumm';
const API_ONE_DET_PATH = 'tenderlotimports';
const MODULE_ID = 'seq_no';
const API_PARA_PATH = 'para';
const SUPPLIER_API_PATH = 'namemass';
const TENDERNO_API_PATH = 'tendermass';
const RAP_API_PATH = 'rapaports';
const DISC_API_PATH = 'pricecharts';

const GET_URL = `/api/v1/${API_PATH}`;
const ADD_URL = `/api/v1/${API_PATH}`;
const ADD_SUMM_URL = `/api/v1/${API_SUMM_PATH}`;
const EDIT_URL = `/api/v1/${API_PATH}`;
const DELETE_URL = `/api/v1/${API_PATH}`;
const GET_ONE_URL = `/api/v1/${API_PATH}`;
const GET_ONE_DET_URL = `/api/v1/${API_ONE_DET_PATH}`;
const GET_PARA_URL = `/api/v1/${API_PARA_PATH}`;
const GET_DET_URL = `/api/v1/${SUPPLIER_API_PATH}`;
const GET_TENDERNO_URL = `/api/v1/${TENDERNO_API_PATH}`;
const GET_RAP_URL = `/api/v1/${RAP_API_PATH}`;
const GET_DISC_RAP_URL = `/api/v1/${DISC_API_PATH}`;

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

function addApi(data: KeyedObject) {
	return request({ url: `${ADD_URL}`, method: 'POST', data });
}
function addViewApi(data: KeyedObject) {
	return request({ url: `${API_ONE_DET_PATH}`, method: 'POST', data });
}

function editApi(data: KeyedObject) {
	return request({ url: `${EDIT_URL}/${data[MODULE_ID]}`, method: 'PUT', data });
}

function deleteApi(data: KeyedObject) {
	return request({ url: `${DELETE_URL}/${data[MODULE_ID]}`, method: 'DELETE' });
}

function getOneApi(data: KeyedObject) {
	return request({ url: `${GET_ONE_URL}/${data}`, method: 'GET' });
}

function getOneAssortmentApi(data: { QueryParams: any }) {
	return request({ url: `${GET_ONE_URL}/${data}`, method: 'GET' });
}

function getOnePlanningApi(data: { QueryParams: any }) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_ONE_URL}/${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_ONE_URL}`,
		method: 'GET'
	});
}

function getOneView1Api(data: { QueryParams: any }) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_ONE_URL}/${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_ONE_URL}`,
		method: 'GET'
	});
}

function getOneRapApi(data: { QueryParams: any }) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_RAP_URL}/${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_ONE_URL}`,
		method: 'GET'
	});
}

function getOneRapDiscApi(data: { QueryParams: any }) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_DISC_RAP_URL}/${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_ONE_URL}`,
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
function getLotStatusApi(data: KeyedObject) {
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

function getSupplierApi(data: { QueryParams: any }) {
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

function getCheckerApi(data: { QueryParams: any }) {
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

function getOneDetApi(data: KeyedObject) {
	return request({
		url: `${GET_ONE_DET_URL}/${data}`,
		method: 'GET'
	});
}
function getAssortApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}
function getPlanTypeApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}
function getAssortTypeApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}
function getAssortPlanSummApi(data: KeyedObject) {
	// return request({
	// 	url: `${GET_URL}?${data}`,
	// 	method: 'GET'
	// });
	return request({ url: `${ADD_SUMM_URL}`, method: 'POST', data });
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
// function* addView(data: KeyedObject) {
// 	try {
// 		const { payload } = data;

// 		const res: IResponse = yield call(addViewApi, payload);

// 		if (res.data) {
// 			yield put(actions.addViewSuccess(res.data));
// 		} else {
// 			yield put(actions.addViewError(res.data));
// 		}
// 	} catch (error: any) {
// 		if (error.data) {
// 			yield put(
// 				actions.addViewError({
// 					error: error.data
// 				})
// 			);
// 		}
// 	}
// }

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
function* getOneAssortment(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getOneAssortmentApi, payload);

		if (res.data) {
			yield put(actions.getOneAssortmentSuccess(res.data));
		} else {
			yield put(actions.getOneAssortmentError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getOneAssortmentError({
					error: e.data
				})
			);
		}
	}
}
function* getOnePlanning(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getOnePlanningApi, payload);

		if (res.data) {
			yield put(actions.getOnePlanningSuccess(res.data));
		} else {
			yield put(actions.getOnePlanningError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getOnePlanningError({
					error: e.data
				})
			);
		}
	}
}
function* getOneView1(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getOneView1Api, payload);

		if (res.data) {
			yield put(actions.getOneView1Success(res.data));
		} else {
			yield put(actions.getOneView1Error(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getOneView1Error({
					error: e.data
				})
			);
		}
	}
}
function* getOneRap(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getOneRapApi, payload);

		if (res.data) {
			yield put(actions.getOneRapSuccess(res.data));
		} else {
			yield put(actions.getOneRapError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getOneRapError({
					error: e.data
				})
			);
		}
	}
}
function* getOneRapDisc(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getOneRapDiscApi, payload);

		if (res.data) {
			yield put(actions.getOneRapDiscSuccess(res.data));
		} else {
			yield put(actions.getOneRapDiscError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getOneRapDiscError({
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
function* getStatus(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getLotStatusApi, payload);

		if (res.data) {
			yield put(actions.getLotStatusSuccess(res.data));
		} else {
			yield put(actions.getLotStatusError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getLotStatusError({
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
function* getAssort(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getAssortApi, payload);

		if (res.data) {
			yield put(actions.getAssortSuccess(res.data));
		} else {
			yield put(actions.getAssortError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getAssortError({
					error: e.data
				})
			);
		}
	}
}
function* getAssortType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getAssortTypeApi, payload);

		if (res.data) {
			yield put(actions.getAssortTypeSuccess(res.data));
		} else {
			yield put(actions.getAssortTypeError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getAssortTypeError({
					error: e.data
				})
			);
		}
	}
}

function* getPlanType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getPlanTypeApi, payload);

		if (res.data) {
			yield put(actions.getPlanTypeSuccess(res.data));
		} else {
			yield put(actions.getPlanTypeError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getPlanTypeError({
					error: e.data
				})
			);
		}
	}
}
function* getChecker(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getCheckerApi, payload);

		if (res.data) {
			yield put(actions.getCheckerSuccess(res.data));
		} else {
			yield put(actions.getCheckerError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getCheckerError({
					error: e.data
				})
			);
		}
	}
}
function* getAssortPlanSumm(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getAssortPlanSummApi, payload);

		if (res.data) {
			yield put(actions.getAssortPlanSummSuccess(res.data));
		} else {
			yield put(actions.getAssortPlanSummError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getAssortPlanSummError({
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
	// yield takeLatest(actions.addView.type, addView);
	yield takeLatest(actions.edit.type, edit);
	yield takeLatest(actions.delete.type, del);
	yield takeLatest(actions.getOne.type, getOne);
	yield takeLatest(actions.getOnePlanning.type, getOnePlanning);
	yield takeLatest(actions.getOneView1.type, getOneView1);
	yield takeLatest(actions.getOneRap.type, getOneRap);
	yield takeLatest(actions.getOneRapDisc.type, getOneRapDisc);
	yield takeLatest(actions.getTension.type, getTension);
	yield takeLatest(actions.getMilky.type, getMilky);
	yield takeLatest(actions.getLotStatus.type, getStatus);
	yield takeLatest(actions.getNatts.type, getNatts);
	yield takeLatest(actions.getSupplier.type, getSupplier);
	yield takeLatest(actions.getTenderNo.type, getTenderNo);
	yield takeLatest(actions.getTenderNoSelect.type, getTenderNoSelect);
	yield takeLatest(actions.getOneDet.type, getOneDet);
	yield takeLatest(actions.getOneAssortment.type, getOneAssortment);
	yield takeLatest(actions.getAssort.type, getAssort);
	yield takeLatest(actions.getAssortType.type, getAssortType);
	yield takeLatest(actions.getPlanType.type, getPlanType);
	yield takeLatest(actions.getChecker.type, getChecker);
	yield takeLatest(actions.getAssortPlanSumm.type, getAssortPlanSumm);
}
