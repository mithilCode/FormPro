import { call, put, takeLatest } from 'redux-saga/effects';
import { KeyedObject } from 'types/root';

import request from '@services/request';

import { invoicesActions as actions } from '.';

interface IResponse {
	data?: any;
}

/** * APIs */
const API_PATH = 'invoices';
const MODULE_ID = 'seq_no';

const API_PARA_PATH = 'para';
const API_COLUMNS_SETTING_PATH = 'columnsettings';
const VENDOR_API_PATH = 'namemass';
const TENDERNO_API_PATH = 'tendermass';

const GET_URL = `/api/v1/${API_PATH}`;
const ADD_URL = `/api/v1/${API_PATH}`;
const EDIT_URL = `/api/v1/${API_PATH}`;
const DELETE_URL = `/api/v1/${API_PATH}`;
const GET_ONE_URL = `/api/v1/${API_PATH}`;
const GET_PARA_URL = `/api/v1/${API_PARA_PATH}`;
const GET_COLUMNS_SETTING_URL = `/api/v1/${API_COLUMNS_SETTING_PATH}`;
const GET_VENDOR_URL = `/api/v1/${VENDOR_API_PATH}`;
const GET_TENDERNO_URL = `/api/v1/${TENDERNO_API_PATH}`;

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

function getColumnsSettingApi(data: { QueryParams: any }) {
	// CHANGE URL ? TO /
	return request({
		url: `${GET_COLUMNS_SETTING_URL}/${data.QueryParams}`,
		method: 'GET'
	});
}

function getParaApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/${data}`,
		method: 'GET'
	});
}

function getSizeApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/${data}`,
		method: 'GET'
	});
}

function getQltyApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/${data}`,
		method: 'GET'
	});
}

function getMonthApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/${data}`,
		method: 'GET'
	});
}

function getYearApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/${data}`,
		method: 'GET'
	});
}

function getCountryApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/${data}`,
		method: 'GET'
	});
}

function getSourceApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/${data}`,
		method: 'GET'
	});
}
function getMineApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/${data}`,
		method: 'GET'
	});
}
function getProgramApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/${data}`,
		method: 'GET'
	});
}

function getBillTypeApi(data: KeyedObject) {
	return request({
		url: `${GET_PARA_URL}/${data}`,
		method: 'GET'
	});
}

function getVendorApi(data: { QueryParams: any }) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_VENDOR_URL}?${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_VENDOR_URL}`,
		method: 'GET'
	});
}

function getTenderNoApi(data: { QueryParams: any }) {
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

function getPartyApi(data: { QueryParams: any }) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_VENDOR_URL}?${data.QueryParams}`,
			method: 'GET'
		});
	}
}

function getInvoiceApi(data: { QueryParams: any }) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_URL}/'""'?${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_URL}`,
		method: 'GET'
	});
}

function getSupplierApi(data: KeyedObject) {
	return request({
		url: `${GET_URL}/${data}`,
		method: 'GET'
	});
}

// function getParaDesignationApi(data: KeyedObject) {
// 	return request({
// 		url: `${GET_PARA_URL}/'${data}'` + '?page=1&limit=11&pagination=false',
// 		method: 'GET'
// 	});
// }

function getBrokerApi(data: { QueryParams: any }) {
	if (data && data.QueryParams) {
		return request({
			url: `${GET_VENDOR_URL}?${data.QueryParams}`,
			method: 'GET'
		});
	}
	return request({
		url: `${GET_VENDOR_URL}`,
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

function* getRoughSize(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getSizeApi, payload);

		if (res.data) {
			yield put(actions.getRoughSizeSuccess(res.data));
		} else {
			yield put(actions.getRoughSizeError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getRoughSizeError({
					error: e.data
				})
			);
		}
	}
}

function* getRoughQlty(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getQltyApi, payload);

		if (res.data) {
			yield put(actions.getRoughQltySuccess(res.data));
		} else {
			yield put(actions.getRoughQltyError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getRoughQltyError({
					error: e.data
				})
			);
		}
	}
}

function* getMonth(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getMonthApi, payload);

		if (res.data) {
			yield put(actions.getMonthSuccess(res.data));
		} else {
			yield put(actions.getMonthError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getMonthError({
					error: e.data
				})
			);
		}
	}
}

function* getYear(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getYearApi, payload);

		if (res.data) {
			yield put(actions.getYearSuccess(res.data));
		} else {
			yield put(actions.getYearError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getYearError({
					error: e.data
				})
			);
		}
	}
}

function* getCountry(data: KeyedObject) {
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

function* getSource(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getSourceApi, payload);

		if (res.data) {
			yield put(actions.getSourceSuccess(res.data));
		} else {
			yield put(actions.getSourceError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getSourceError({
					error: e.data
				})
			);
		}
	}
}

function* getMine(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getMineApi, payload);

		if (res.data) {
			yield put(actions.getMineSuccess(res.data));
		} else {
			yield put(actions.getMineError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getMineError({
					error: e.data
				})
			);
		}
	}
}

function* getProgram(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getProgramApi, payload);

		if (res.data) {
			yield put(actions.getProgramSuccess(res.data));
		} else {
			yield put(actions.getProgramError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getProgramError({
					error: e.data
				})
			);
		}
	}
}

function* getBillType(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getBillTypeApi, payload);

		if (res.data) {
			yield put(actions.getBillTypeSuccess(res.data));
		} else {
			yield put(actions.getBillTypeError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getBillTypeError({
					error: e.data
				})
			);
		}
	}
}

function* getVendor(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getVendorApi, payload);

		if (res.data) {
			yield put(actions.getVendorSuccess(res.data));
		} else {
			yield put(actions.getVendorError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getVendorError({
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
function* getParty(data: KeyedObject) {
	try {
		const { payload } = data;
		const res: IResponse = yield call(getPartyApi, payload);

		if (res.data) {
			yield put(actions.getPartySuccess(res.data));
		} else {
			yield put(actions.getPartyError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getPartyError({
					error: e.data
				})
			);
		}
	}
}

function* getInvoiceNo(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getInvoiceApi, payload);

		if (res.data) {
			yield put(actions.getInvoiceSuccess(res.data));
		} else {
			yield put(actions.getInvoiceError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getInvoiceError({
					error: e.data
				})
			);
		}
	}
}
function* getSupplierName(data: KeyedObject) {
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

function* getBroker(data: KeyedObject) {
	try {
		const { payload } = data;

		const res: IResponse = yield call(getBrokerApi, payload);

		if (res.data) {
			yield put(actions.getBrokerSuccess(res.data));
		} else {
			yield put(actions.getBrokerError(res.data));
		}
	} catch (e: any) {
		if (e.data) {
			yield put(
				actions.getBrokerError({
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

export function* Saga() {
	yield takeLatest(actions.get.type, get);
	yield takeLatest(actions.add.type, add);
	yield takeLatest(actions.edit.type, edit);
	yield takeLatest(actions.delete.type, del);
	yield takeLatest(actions.getOne.type, getOne);
	yield takeLatest(actions.getPara.type, getPara);
	yield takeLatest(actions.getOneDet.type, getOneDet);
	yield takeLatest(actions.getColumnsSetting.type, getColumnsSetting);
	yield takeLatest(actions.getVendor.type, getVendor);
	yield takeLatest(actions.getTenderNo.type, getTenderNo);
	yield takeLatest(actions.getParty.type, getParty);
	yield takeLatest(actions.getBroker.type, getBroker);
	yield takeLatest(actions.getInvoice.type, getInvoiceNo);
	yield takeLatest(actions.getSupplier.type, getSupplierName);
	yield takeLatest(actions.getRoughSize.type, getRoughSize);
	yield takeLatest(actions.getRoughQlty.type, getRoughQlty);
	yield takeLatest(actions.getMonth.type, getMonth);
	yield takeLatest(actions.getYear.type, getYear);
	yield takeLatest(actions.getCountry.type, getCountry);
	yield takeLatest(actions.getSource.type, getSource);
	yield takeLatest(actions.getMine.type, getMine);
	yield takeLatest(actions.getProgram.type, getProgram);
	yield takeLatest(actions.getBillType.type, getBillType);
}
