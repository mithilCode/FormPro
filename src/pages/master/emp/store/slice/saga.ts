import { call, put, takeLatest } from 'redux-saga/effects';
import { KeyedObject } from 'types/root';

import request from '@services/request';

import { empsActions as actions } from '.';

interface IResponse {
	data?: any;
}

/** * APIs */
const API_PATH = 'employees';
const MODULE_ID = 'seq_no';

const API_PARA_PATH = 'para';
const API_PROC_PATH = 'procs';
const DEPT_API_PATH = 'namemass';
const COUNTRY_API_PATH = 'countries';

const GET_URL = `/api/v1/${API_PATH}`;
const ADD_URL = `/api/v1/${API_PATH}`;
const EDIT_URL = `/api/v1/${API_PATH}`;
const DELETE_URL = `/api/v1/${API_PATH}`;
const GET_ONE_URL = `/api/v1/${API_PATH}`;

const GET_PARA_URL = `/api/v1/${API_PARA_PATH}`;
const GET_PROC_URL = `/api/v1/${API_PROC_PATH}`;
const GET_DEPT_URL = `/api/v1/${DEPT_API_PATH}`;
const GET_COUNTRY_URL = `/api/v1/${COUNTRY_API_PATH}`;

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

function getDepartment(data: { QueryParams: any }) {
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

function getIncharge(data: { QueryParams: any }) {
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

function getIncharget(data: { QueryParams: any }) {
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

function getGenderApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getMaritalApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getLanguageApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getReligionApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getCasteApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getSubCasteApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getEducationApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getTransportApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}
function getVehicleApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}
function getFuelApi(data: KeyedObject) {
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

function getParaGenderApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getCountryApi(data: KeyedObject) {
	return request({
		url: `${GET_COUNTRY_URL}` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getNationApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getVisaApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getBloodApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getSalaryApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getKycsApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getManagerApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
		method: 'GET'
	});
}

function getDesigRoleApi(data: KeyedObject) {
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

function getParaApi(data: KeyedObject) {
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
function* getCountryType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getCountryApi, payload);

		if (res.data) {
			yield put(actions.getCountrySuccess(res.data));
		} else {
			yield put(actions.getCountryError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getCountryError({
					error: e.data
				})
			);
		}
	}
}

function* getVisaType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getVisaApi, payload);

		if (res.data) {
			yield put(actions.getVisaSuccess(res.data));
		} else {
			yield put(actions.getVisaError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getVisaError({
					error: e.data
				})
			);
		}
	}
}

function* getBloodType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getBloodApi, payload);

		if (res.data) {
			yield put(actions.getBloodSuccess(res.data));
		} else {
			yield put(actions.getBloodError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getBloodError({
					error: e.data
				})
			);
		}
	}
}

function* getSalaryType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getSalaryApi, payload);

		if (res.data) {
			yield put(actions.getSalarySuccess(res.data));
		} else {
			yield put(actions.getSalaryError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getSalaryError({
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

function* getManagerType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getManagerApi, payload);

		if (res.data) {
			yield put(actions.getManagerSuccess(res.data));
		} else {
			yield put(actions.getManagerError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getManagerError({
					error: e.data
				})
			);
		}
	}
}

function* getDesigRole(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getDesigRoleApi, payload);

		if (res.data) {
			yield put(actions.getDesigRoleSuccess(res.data));
		} else {
			yield put(actions.getDesigRoleError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getDesigRoleError({
					error: e.data
				})
			);
		}
	}
}

function* getNationType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getNationApi, payload);

		if (res.data) {
			yield put(actions.getNationSuccess(res.data));
		} else {
			yield put(actions.getNationError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getNationError({
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
				actions.getParaError({
					error: e.data
				})
			);
		}
	}
}

function* getDept(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getDepartment, payload);

		if (res.data) {
			yield put(actions.getDeptSuccess(res.data));
		} else {
			yield put(actions.getDeptError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getDeptError({
					error: e.data
				})
			);
		}
	}
}

function* getInch(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getIncharge, payload);

		if (res.data) {
			yield put(actions.getInchSuccess(res.data));
		} else {
			yield put(actions.getInchError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getInchError({
					error: e.data
				})
			);
		}
	}
}

function* getIncht(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getIncharget, payload);

		if (res.data) {
			yield put(actions.getInchtSuccess(res.data));
		} else {
			yield put(actions.getInchtError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getInchtError({
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

function* getGender(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getGenderApi, payload);

		if (res.data) {
			yield put(actions.getGenderSuccess(res.data));
		} else {
			yield put(actions.getGenderError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getGenderError({
					error: e.data
				})
			);
		}
	}
}

function* getMarital(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getMaritalApi, payload);

		if (res.data) {
			yield put(actions.getMaritalSuccess(res.data));
		} else {
			yield put(actions.getMaritalError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getMaritalError({
					error: e.data
				})
			);
		}
	}
}

function* getLanguage(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getLanguageApi, payload);

		if (res.data) {
			yield put(actions.getLanguageSuccess(res.data));
		} else {
			yield put(actions.getLanguageError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getLanguageError({
					error: e.data
				})
			);
		}
	}
}

function* getReligion(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getReligionApi, payload);

		if (res.data) {
			yield put(actions.getReligionSuccess(res.data));
		} else {
			yield put(actions.getReligionError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getReligionError({
					error: e.data
				})
			);
		}
	}
}

function* getCaste(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getCasteApi, payload);

		if (res.data) {
			yield put(actions.getCasteSuccess(res.data));
		} else {
			yield put(actions.getCasteError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getCasteError({
					error: e.data
				})
			);
		}
	}
}

function* getSubCaste(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getSubCasteApi, payload);

		if (res.data) {
			yield put(actions.getSubCasteSuccess(res.data));
		} else {
			yield put(actions.getSubCasteError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getSubCasteError({
					error: e.data
				})
			);
		}
	}
}

function* getEducation(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getEducationApi, payload);

		if (res.data) {
			yield put(actions.getEducationSuccess(res.data));
		} else {
			yield put(actions.getEducationError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getEducationError({
					error: e.data
				})
			);
		}
	}
}

function* getTransport(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getTransportApi, payload);

		if (res.data) {
			yield put(actions.getTransportSuccess(res.data));
		} else {
			yield put(actions.getTransportError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getTransportError({
					error: e.data
				})
			);
		}
	}
}

function* getVehicle(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getVehicleApi, payload);

		if (res.data) {
			yield put(actions.getVehicleSuccess(res.data));
		} else {
			yield put(actions.getVehicleError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getVehicleError({
					error: e.data
				})
			);
		}
	}
}

function* getFuel(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getFuelApi, payload);

		if (res.data) {
			yield put(actions.getFuelSuccess(res.data));
		} else {
			yield put(actions.getFuelError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getFuelError({
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
	yield takeLatest(actions.getOneDet.type, getOneDet);
	yield takeLatest(actions.getPara.type, getPara);
	yield takeLatest(actions.getParaDesingType.type, getParaDesingType);
	yield takeLatest(actions.getParaGenderType.type, getParaGenderType);
	yield takeLatest(actions.getProc.type, getProc);
	yield takeLatest(actions.getGender.type, getGender);
	yield takeLatest(actions.getMarital.type, getMarital);
	yield takeLatest(actions.getLanguage.type, getLanguage);
	yield takeLatest(actions.getReligion.type, getReligion);
	yield takeLatest(actions.getCaste.type, getCaste);
	yield takeLatest(actions.getSubCaste.type, getSubCaste);
	yield takeLatest(actions.getEducation.type, getEducation);
	yield takeLatest(actions.getTransport.type, getTransport);
	yield takeLatest(actions.getVehicle.type, getVehicle);
	yield takeLatest(actions.getFuel.type, getFuel);
	yield takeLatest(actions.getDepartment.type, getDept);
	yield takeLatest(actions.getIncharge.type, getInch);
	yield takeLatest(actions.getIncharget.type, getIncht);
	yield takeLatest(actions.getVerifyBy.type, getVeriBy);
	yield takeLatest(actions.getCountry.type, getCountryType);
	yield takeLatest(actions.getNation.type, getNationType);
	yield takeLatest(actions.getVisa.type, getVisaType);
	yield takeLatest(actions.getBlood.type, getBloodType);
	yield takeLatest(actions.getSalary.type, getSalaryType);
	yield takeLatest(actions.getKycs.type, getKycsType);
	yield takeLatest(actions.getManager.type, getManagerType);
	yield takeLatest(actions.getDesigRole.type, getDesigRole);
}
