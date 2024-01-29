import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

//const  REACT_APP_API_BASE  = 'http://3.110.245.175';]
let REACT_APP_API_BASE_URL: any;
const Url = window.location.host;
if (Url == 'dev.dxl.one') {
	const { REACT_APP_API_BASE } = process.env;
	REACT_APP_API_BASE_URL = REACT_APP_API_BASE;
} else {
	const { REACT_APP_API_BASE_TEST } = process.env;
	REACT_APP_API_BASE_URL = REACT_APP_API_BASE_TEST;
}

//const { REACT_APP_API_BASE } = process.env;

const client = axios.create({
	baseURL: REACT_APP_API_BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	timeout: 100000
});

// Function that will be called to refresh authorization
// eslint-disable-next-line consistent-return
const refreshAuthLogic = (failedRequest: any) =>
	axios
		.post(`${REACT_APP_API_BASE_URL}/api/v1/auth/token/refresh`, {
			refreshToken: localStorage.getItem('refreshToken')
		})
		.then(tokenRefreshResponse => {
			localStorage.setItem('accessToken', tokenRefreshResponse.data.AccessToken);
			localStorage.setItem('refreshToken', tokenRefreshResponse.data.RefreshToken);

			// eslint-disable-next-line no-param-reassign
			failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data.AccessToken}`;
			return Promise.resolve();
		});

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(client, refreshAuthLogic, { pauseInstanceWhileRefreshing: false }); //skipWhileRefreshing

client.interceptors.request.use(
	config => {
		const token = localStorage.getItem('accessToken');

		if (token) {
			// eslint-disable-next-line no-param-reassign
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	err => {
		return Promise.reject(err);
	}
);

client.interceptors.response.use(
	response => {
		// Return a successful response back to the calling service
		return response;
	},
	// eslint-disable-next-line consistent-return
	error => {
		const isRefresh = error.config.url.indexOf('/api/v1/auth/token/refresh');
		if (isRefresh > -1) {
			// if (error.response.data.message === 'INVALID_REFRESH_TOKEN') {
			// }
			window.location.href = '/logout';
		}
		if (error && error.response && error.response.status === 401) {
			if (error.response.data.message === 'TOKEN_EXPIRED') {
				//dx	window.location.href = '/logout?expired';
			} else {
				return Promise.reject(error);
			}
		}

		if (error && error.response && error.response.status === 403) {
			window.location.href = '/notfound';
		}

		// Return any error which is not due to authentication back to the calling service
		if (error.response.status !== 401) {
			return new Promise((resolve, reject) => {
				reject(error);
			});
		}
	}
);

// export default client;

/**
 * Request Wrapper with default success/error actions
 */
const request = async (options: AxiosRequestConfig<any>) => {
	const onSuccess = (response: AxiosResponse<any, any>) => {
		//
		return response;
	};

	const onError = (error: any) => {
		//
		if (error.response) {
			//
			//
			//
		} else {
			//
		}
		return Promise.reject(error.response || error.message);
	};

	try {
		const response = await client(options);

		return onSuccess(response);
	} catch (error) {
		return onError(error);
	}
};

export default request;
