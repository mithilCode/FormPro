import React, { createContext, useEffect, useState } from 'react'; //useReducer
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { ClientJS } from 'clientjs';
// third-party
// import { Chance } from 'chance';
// import jwtDecode from 'jwt-decode';
// import { AuthProps, JWTContextType } from 'types/auth';
import { KeyedObject } from 'types/root';

import AuthService from '@app/services/auth-service';
// project import
import { useAuthSlice } from '@app/store/slice/auth';
import { authSelector } from '@app/store/slice/auth/auth.selectors';
import { AuthProps, ClientJSProps, JWTContextType } from '@app/store/slice/auth/types';
import Loader from '@components/Loader';
// import useConfig from '@hooks/useConfig';
// import axios from '@utils/axios';

// reducer - state management
// import { LOGIN, LOGOUT } from 'store/reducers/actions';
// import authReducer from 'store/reducers/auth';

// const chance = new Chance();

// constant
const initialState: AuthProps = {
	isLoggedIn: false,
	isInitialized: false,
	user: null
};

const ClinetJSState: ClientJSProps = {
	AppType: 'Browser',
	Fingerprint: null,
	OS: null,
	Device: null
};

let clientJs: any;

// const verifyToken: (st: string) => boolean = serviceToken => {
// 	if (!serviceToken) {
// 		return false;
// 	}
// 	const decoded: KeyedObject = jwtDecode(serviceToken);
// 	/**
// 	 * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
// 	 */
// 	return decoded.exp > Date.now() / 1000;
// };

// const setSession = (serviceToken?: string | null) => {
// 	if (serviceToken) {
// 		localStorage.setItem('serviceToken', serviceToken);
// 		axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
// 	} else {
// 		localStorage.removeItem('serviceToken');
// 		delete axios.defaults.headers.common.Authorization;
// 	}
// };

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
	const { authActions } = useAuthSlice();
	const dispatch = useDispatch();

	const authState = useSelector(authSelector);

	// const { apiSuccess } = authState; //apiError

	const navigate = useNavigate();
	// const { onChangeLocalization } = useConfig();

	// const [state, dispatch] = useReducer(authReducer, initialState);
	const [state, setState] = useState(initialState);
	const [fpState, setFpState] = useState(ClinetJSState);

	useEffect(() => {
		const init = async () => {
			try {
				const accessToken = await AuthService.handleAuthentication();

				if (accessToken) {
					const user: any = await AuthService.loginInWithToken();
					dispatch(
						authActions.submitLogin({
							isLoggedIn: true,
							user
						})
					);
					// dispatch(
					// 	actions.submitLogin({
					// 		isLoggedIn: true,
					// 		user: data?.User
					// 	})
					// );
				} else {
					dispatch(authActions.logout());
				}

				// if (serviceToken && verifyToken(serviceToken)) {
				// 	setSession(serviceToken);
				// 	const response = await axios.get('/api/account/me');
				// 	console.log('response');

				// 	console.log(response);

				// 	const { user } = response.data;

				// 	dispatch(
				// 		actions.login({
				// 			isLoggedIn: true,
				// 			user
				// 		})
				// 	);

				// 	// dispatch({
				// 	// 	type: LOGIN,
				// 	// 	payload: {
				// 	// 		isLoggedIn: true,
				// 	// 		user
				// 	// 	}
				// 	// });
				// } else {
				// 	console.log('LOGOUT');
				// 	dispatch(actions.logout());

				// 	// dispatch({
				// 	// 	type: LOGOUT
				// 	// });
				// }
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);

				// dispatch({
				// 	type: LOGOUT
				// });
			}
		};

		clientJs = new ClientJS();
		setFpState(value => ({
			...value,
			Fingerprint: clientJs.getFingerprint().toString() || null,
			OS: clientJs.getOS() || null,
			Device: clientJs.isMobile() ? 'Mobile' : 'Desktop'
		}));

		init();
	}, []);

	useEffect(() => {
		setState(authState);
	}, [authState]);

	// useEffect(() => {
	// 	// console.log('APIs RESPONSE WITH ERROR CONTEXT', apiError);
	// 	// setState(authState);
	// }, [apiError]);

	// useEffect(() => {
	// 	if (apiSuccess) {
	// 		const data = AuthService.setLoginData(apiSuccess);

	// 		// const { User, Tokens, Permission } = success as any; //

	// 		// AuthService.setSession(Tokens.Access.token);
	// 		// AuthService.setRefreshToken(Tokens.Refresh.token);
	// 		// AuthService.setUserData(User);
	// 		// AuthService.setPermission(Permission);

	// 		// onChangeLocalization(data?.Settings.i18n);

	// 		dispatch(
	// 			authActions.submitLogin({
	// 				isLoggedIn: true,
	// 				user: data?.User
	// 			})
	// 		);
	// 		// setState(authState);
	// 	}
	// }, [apiSuccess]);

	const login = async (data: KeyedObject) => {
		dispatch(authActions.login({ ...data, ...fpState }));

		// const response = await axios.post('/api/account/login', { email, password });
		// const { serviceToken, user } = response.data;
		// // setSession(serviceToken);
		// dispatch(
		// 	actions.login({
		// 		isLoggedIn: true,
		// 		user
		// 	})
		// );
	};

	const submitLogin = async (apiSuccess: KeyedObject | null) => {
		const data = AuthService.setLoginData(apiSuccess);

		dispatch(
			authActions.submitLogin({
				isLoggedIn: true,
				user: data?.User
			})
		);
	};

	// const login = async (email: string, password: string) => {
	// 	const response = await axios.post('/api/account/login', { email, password });
	// 	const { serviceToken, user } = response.data;
	// 	setSession(serviceToken);
	// 	dispatch(
	// 		actions.login({
	// 			isLoggedIn: true,
	// 			user
	// 		})
	// 	);
	// 	// dispatch({
	// 	// 	type: LOGIN,
	// 	// 	payload: {
	// 	// 		isLoggedIn: true,
	// 	// 		user
	// 	// 	}
	// 	// });
	// };

	const register = async (data: KeyedObject) => {
		dispatch(authActions.register({ ...data, ...fpState }));
		// // todo: this flow need to be recode as it not verified
		// const id = chance.bb_pin();
		// const response = await axios.post('/api/account/register', {
		// 	id,
		// 	email,
		// 	password,
		// 	firstName,
		// 	lastName
		// });
		// let users = response.data;
		// if (
		// 	window.localStorage.getItem('users') !== undefined &&
		// 	window.localStorage.getItem('users') !== null
		// ) {
		// 	const localUsers = window.localStorage.getItem('users');
		// 	users = [
		// 		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		// 		...JSON.parse(localUsers!),
		// 		{
		// 			id,
		// 			email,
		// 			password,
		// 			name: `${firstName} ${lastName}`
		// 		}
		// 	];
		// }
		// window.localStorage.setItem('users', JSON.stringify(users));
	};

	const logout = (redirect?: string) => {
		// setSession(null);
		AuthService.logout();
		if (redirect) {
			navigate(redirect);
		} else {
			navigate('/login');
		}

		dispatch(authActions.logout());
		// dispatch({ type: LOGOUT });
	};

	// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	const resetPassword = async (email: string) => {};

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const updateProfile = async (data: KeyedObject) => {
		const updatedData = AuthService.updateProfile(data);

		dispatch(
			authActions.submitLogin({
				isLoggedIn: true,
				user: updatedData?.User
			})
		);
	};

	if (state.isInitialized !== undefined && !state.isInitialized) {
		return <Loader />;
	}

	return (
		// <JWTContext.Provider
		// 	value={{ ...state, login, logout, register, resetPassword, updateProfile }}>
		// 	{children}
		// </JWTContext.Provider>
		// login,
		<JWTContext.Provider
			value={{
				...state,
				login,
				logout,
				register,
				resetPassword,
				updateProfile,
				submitLogin
			}}>
			{children}
		</JWTContext.Provider>
	);
};

export default JWTContext;
