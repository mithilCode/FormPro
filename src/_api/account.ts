// third-party
import jwt from 'jsonwebtoken';

// import { JWTDataProps } from 'types/auth';
import { JWTDataProps } from '@app/store/slice/auth/types';
// project imports
import services from '@utils/mockAdapter';

import users from '../data/account';

// constant
const JWT_SECRET = process.env.REACT_APP_JWT_SECRET_KEY as string;
const JWT_EXPIRES_TIME = process.env.REACT_APP_JWT_TIMEOUT;

const delay = (timeout: number) => new Promise(res => setTimeout(res, timeout));

// ==============================|| MOCK SERVICES - JWT ACCOUNT ||============================== //

services.onPost('/api/account/login').reply(async request => {
	try {
		await delay(500);

		const { email, password } = JSON.parse(request.data);

		const newUsers = users;
		// if (
		// 	window.localStorage.getItem('users') !== undefined &&
		// 	window.localStorage.getItem('users') !== null
		// ) {
		// 	const localUsers = window.localStorage.getItem('users');
		// 	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		// 	newUsers = JSON.parse(localUsers!);
		// }

		const user = newUsers.find(_user => _user.Email === email);

		if (!user) {
			return [400, { message: 'Verify Your Email & Password' }];
		}

		if (user.Password !== password) {
			return [400, { message: 'Invalid Password' }];
		}

		const serviceToken = jwt.sign({ userId: user.idUser }, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_TIME
		});

		return [
			200,
			{
				AccessToken: serviceToken,
				RefreshToken: serviceToken,
				role: [user.RoleType],
				from: 'browser',
				parentCompany: user.ParentCompany,
				user: {
					idUser: user.idUser,
					email: user.Email,
					name: user.FirstName + ' ' + user.LastName,
					userType: user.UserType,
					settings: user.Settings,
					shortcuts: user.Shortcuts
				}
			}
		];
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
		return [500, { message: 'Server Error' }];
	}
});

services.onPost('/api/account/register').reply(async request => {
	try {
		await delay(500);

		const { id, email, password, firstName, lastName } = JSON.parse(request.data);

		if (!email || !password) {
			return [400, { message: 'Enter Your Email & Password' }];
		}

		if (!firstName || !lastName) {
			return [400, { message: 'Enter Your Name' }];
		}

		const result = users.push({
			idUser: id,
			Email: email,
			Password: password,
			FirstName: firstName,
			LastName: lastName,
			// name: `${firstName} ${lastName}`
			RoleType: ['User'],
			From: 'browser',
			ParentCompany: '5e86809283e28b96d2d7777',
			UserType: 'Guest',
			AuthRoles: {} as any,
			Settings: {} as any,
			Shortcuts: []
		});

		return [200, { users: result }];
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
		return [500, { message: 'Server Error' }];
	}
});

services.onGet('/api/account/me').reply(request => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const { Authorization } = request.headers!;

		if (!Authorization) {
			return [401, { message: 'Token Missing' }];
		}

		const newUsers = users;
		// if (
		// 	window.localStorage.getItem('users') !== undefined &&
		// 	window.localStorage.getItem('users') !== null
		// ) {
		// 	const localUsers = window.localStorage.getItem('users');
		// 	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		// 	newUsers = JSON.parse(localUsers!);
		// }

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const serviceToken = Authorization!.toString();
		const jwData = jwt.verify(serviceToken, JWT_SECRET);
		const { userId } = jwData as JWTDataProps;
		const user = newUsers.find(_user => _user.idUser === userId);

		if (!user) {
			return [401, { message: 'Invalid Token' }];
		}

		return [
			200,
			{
				user: {
					id: user.idUser,
					email: user.Email
				}
			}
		];
	} catch (err) {
		return [500, { message: 'Server Error' }];
	}
});
