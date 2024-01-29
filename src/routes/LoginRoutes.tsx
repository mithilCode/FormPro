// import { lazy } from 'react';

// project import
import CommonLayout from '@app/layout/CommonLayout';
// import Loadable from '@components/Loadable';
/** Auth */
import AuthRoutes from '@pages/auth/routeConfig';
import InfiniteUtils from '@utils/InfiniteUtils';
import GuestGuard from '@utils/route-guard/GuestGuard';

// // render
// const AuthLogin = Loadable(lazy(() => import('@pages/auth/login')));
// const AuthRegister = Loadable(lazy(() => import('@pages/auth/register')));

const routeConfigs = [AuthRoutes];

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
	path: '/',
	children: [
		{
			path: '/',
			element: (
				<GuestGuard>
					<CommonLayout />
				</GuestGuard>
			),
			children: [
				...InfiniteUtils.generateRoutesFromConfigs(routeConfigs, null)
				// {
				// 	path: 'login',
				// 	element: <AuthLogin />
				// },
				// {
				// 	path: 'register',
				// 	element: <AuthRegister />
				// }
			]
		}
	]
};

export default LoginRoutes;

// import { lazy } from 'react';

// // project import
// import CommonLayout from '@app/layout/CommonLayout';
// import Loadable from '@components/Loadable';
// import GuestGuard from '@utils/route-guard/GuestGuard';

// // render - login
// const AuthLogin = Loadable(lazy(() => import('@pages/auth/login')));
// const AuthRegister = Loadable(lazy(() => import('@pages/auth/register')));
// // const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/forgot-password')));
// // const AuthCheckMail = Loadable(lazy(() => import('pages/auth/check-mail')));
// // const AuthResetPassword = Loadable(lazy(() => import('pages/auth/reset-password')));
// // const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/code-verification')));

// // ==============================|| AUTH ROUTING ||============================== //

// const LoginRoutes = {
// 	path: '/',
// 	children: [
// 		{
// 			path: '/',
// 			element: (
// 				<GuestGuard>
// 					<CommonLayout />
// 				</GuestGuard>
// 			),
// 			children: [
// 				{
// 					path: 'login',
// 					element: <AuthLogin />
// 				},
// 				{
// 					path: 'register',
// 					element: <AuthRegister />
// 				}
// 				// {
// 				// 	path: 'forgot-password',
// 				// 	element: <AuthForgotPassword />
// 				// },
// 				// {
// 				// 	path: 'check-mail',
// 				// 	element: <AuthCheckMail />
// 				// },
// 				// {
// 				// 	path: 'reset-password',
// 				// 	element: <AuthResetPassword />
// 				// },
// 				// {
// 				// 	path: 'code-verification',
// 				// 	element: <AuthCodeVerification />
// 				// }
// 			]
// 		}
// 	]
// };

// export default LoginRoutes;
