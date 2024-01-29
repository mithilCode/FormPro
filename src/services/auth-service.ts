import jwtDecode from 'jwt-decode';
import { KeyedObject } from 'types/root';

// const delay = (timeout: number) => new Promise(res => setTimeout(res, timeout));

class AuthService {
	static setLoginData = (data: any) => {
		if (data) {
			const { user, tokens, permissions, settings } = data as any;

			console.log('Before' + user);

			// User.Name = User.FirstName + ' ' + User.LastName;
			const newUser = Object.assign(
				{
					Name: user.first_name + ' ' + user.last_name,
					Avatar: 'https://randomuser.me/api/portraits/men/29.jpg'
				},
				user
			);

			console.log('After' + user);

			this.setSession(tokens.access.token);
			this.setRefreshToken(tokens.refresh.token);
			this.setUserData(JSON.stringify(newUser));
			this.setPermissions(JSON.stringify(permissions));
			this.setSettings(JSON.stringify(settings));

			//infinite-react-ts-config
			// {"fontFamily":"'Public Sans', sans-serif","i18n":"en","menuOrientation":"vertical","miniDrawer":false,"container":true,"mode":"light","presetColor":"theme5","themeDirection":"ltr"}

			return { User: newUser, tokens, permissions, settings };
		} else {
			return null;
		}
	};

	static updateProfile = (data: any) => {
		if (data) {
			// User.Name = User.FirstName + ' ' + User.LastName;
			const newUser = Object.assign(
				{
					Name: data.FirstName + ' ' + data.LastName
				},
				data
			);

			this.setUserData(JSON.stringify(newUser));

			//infinite-react-ts-config
			// {"fontFamily":"'Public Sans', sans-serif","i18n":"en","menuOrientation":"vertical","miniDrawer":false,"container":true,"mode":"light","presetColor":"theme5","themeDirection":"ltr"}

			return { User: newUser };
		} else {
			return null;
		}
	};

	static handleAuthentication = async () => {
		const access_token = this.getAccessToken();

		if (!access_token) {
			return null;
		}

		if (this.verifyToken(access_token)) {
			return true;
		} else {
			this.setSession(null);
			this.setRefreshToken(null);
			this.setUserData(null);
			this.setPermissions(null);
			this.setSettings(null);
		}

		return false;

		// const accessToken = window.localStorage.getItem('serviceToken');
		// console.log('accessToken 2', accessToken);

		// const access_token = this.getAccessToken();
		// // const user_data = this.getUserData();
		// if (!access_token) {
		// 	this.emit('onNoAccessToken');
		// 	return;
		// }
		// if (this.isAuthTokenValid(access_token)) {
		// 	// this.setSession(access_token);
		// 	// this.setUserSession(JSON.stringify(user_data));
		// 	this.emit('onAutoLogin', true);
		// } else {
		// 	this.setSession(null);
		// 	this.setRefreshToken(null);
		// 	this.setUserSession(null);
		// 	this.setAuthRoles(null);
		// 	this.emit('onAutoLogout', 'access_token expired');
		// }
	};

	static loginInWithToken = () => {
		return new Promise(resolve => {
			const user = this.getUserData();
			resolve(JSON.parse(user || '{}'));
		});
	};

	static logout = () => {
		this.setSession(null);
		this.setRefreshToken(null);
		this.setUserData(null);
		this.setPermissions(null);
		this.setSettings(null);
	};

	static setSession = (accessToken?: string | null) => {
		if (accessToken) {
			localStorage.setItem('accessToken', accessToken);
			// axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
		} else {
			localStorage.removeItem('accessToken');
			// delete axios.defaults.headers.common.Authorization;
		}
	};

	static setRefreshToken = (refreshToken?: string | null) => {
		if (refreshToken) {
			localStorage.setItem('refreshToken', refreshToken);
		} else {
			localStorage.removeItem('refreshToken');
		}
	};

	static setUserData = (userData?: string | null) => {
		if (userData) {
			localStorage.removeItem('User');
			localStorage.setItem('User', userData);
		} else {
			localStorage.removeItem('User');
		}
	};

	static setPermissions = (permissions?: string | null) => {
		if (permissions) {
			localStorage.removeItem('Permissions');
			localStorage.setItem('Permissions', permissions);
		} else {
			localStorage.removeItem('Permissions');
		}
	};

	static setSettings = (settings?: string | null) => {
		if (settings) {
			localStorage.removeItem('infinite-react-ts-config');
			localStorage.setItem('infinite-react-ts-config', settings);
		} else {
			localStorage.removeItem('infinite-react-ts-config');
		}
	};

	static verifyToken: (st: string) => boolean = accessToken => {
		if (!accessToken) {
			return false;
		}
		const decoded: KeyedObject = jwtDecode(accessToken);
		/**
		 * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
		 */
		return decoded.exp > Date.now() / 1000;

		// if (decoded.exp < currentTime) {
		// 	console.warn('access token expired');
		// 	return false;
		// }
	};

	getPermissions = () => {
		return new Promise(resolve => {
			const authroles = this.getPermissions();
			resolve(authroles);
		});
	};

	static getAccessToken = () => {
		return window.localStorage.getItem('accessToken');
	};

	static getRefreshToken = () => {
		return window.localStorage.getItem('refreshToken');
	};

	static getUserData = () => {
		return window.localStorage.getItem('User');
	};

	static getPermissions = () => {
		return window.localStorage.getItem('Permissions');
	};

	static getSettings = () => {
		return window.localStorage.getItem('infinite-react-ts-config') || null;
	};
}
export default AuthService;
