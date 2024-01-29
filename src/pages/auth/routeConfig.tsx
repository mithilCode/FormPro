import { lazy } from 'react';

import WrapperRouteComponent from '@app/routes/config';
import Loadable from '@components/Loadable';
import CommonLayout from '@layout/CommonLayout';
// import { authRoles } from '@utils/helpers';

const Login = Loadable(lazy(() => import('@pages/auth/Login')));
const Register = Loadable(lazy(() => import('@pages/auth/Register')));

const AuthRoutes = {
	settings: {
		layout: {
			config: {}
		}
	},
	// auth: authRoles('State'),
	routes: [
		{
			path: '/',
			element: <CommonLayout />,
			children: [
				{
					path: 'login',
					element: <WrapperRouteComponent element={<Login />} titleId="title.login" />
				},
				{
					path: 'register',
					element: (
						<WrapperRouteComponent element={<Register />} titleId="title.register" />
					)
				}
			]
		}
	]
};

export default AuthRoutes;
