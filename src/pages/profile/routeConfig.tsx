import { lazy } from 'react';

import WrapperRouteComponent from '@app/routes/config';
import Loadable from '@components/Loadable';
import CommonLayout from '@layout/CommonLayout';
// import { authRoles } from '@utils/helpers';

const UserProfile = Loadable(lazy(() => import('@pages/profile/user')));
const UserTabPersonal = Loadable(lazy(() => import('@pages/profile/sections/user/TabPersonal')));
const UserTabPassword = Loadable(lazy(() => import('@pages/profile/sections/user/TabPassword')));
const UserTabPayment = Loadable(
	lazy(() => import('@pages/profile/sections/user/payment/TabPayment'))
);
const UserTabSettings = Loadable(lazy(() => import('@pages/profile/sections/user/TabSettings')));

const UserPageRoutes = {
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
					path: 'user',
					element: (
						<WrapperRouteComponent element={<UserProfile />} titleId="UserProfile" />
					),
					children: [
						{
							path: 'personal',
							element: (
								<WrapperRouteComponent
									element={<UserTabPersonal />}
									titleId="Personal"
								/>
							)
						},
						{
							path: 'payment',
							element: (
								<WrapperRouteComponent
									element={<UserTabPayment />}
									titleId="Password"
								/>
							)
						},
						{
							path: 'password',
							element: (
								<WrapperRouteComponent
									element={<UserTabPassword />}
									titleId="Password"
								/>
							)
						},
						{
							path: 'settings',
							element: (
								<WrapperRouteComponent
									element={<UserTabSettings />}
									titleId="Password"
								/>
							)
						}
					]
				}
			]
		}
	]
};

export default UserPageRoutes;

// path: 'user',
// element: <UserProfile />,
// children: [
//   {
// 	path: 'personal',
// 	element: <UserTabPersonal />
//   },
//   {
// 	path: 'payment',
// 	element: <UserTabPayment />
//   },
//   {
// 	path: 'password',
// 	element: <UserTabPassword />
//   },
//   {
// 	path: 'settings',
// 	element: <UserTabSettings />
//   }
// ]
// }
