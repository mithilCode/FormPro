import { lazy } from 'react';

import WrapperRouteComponent from '@app/routes/config';
import Loadable from '@components/Loadable';
import CommonLayout from '@layout/CommonLayout';
import { isPermission } from '@utils/helpers';

const MaintenanceError = Loadable(lazy(() => import('@pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('@pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(
	lazy(() => import('@pages/maintenance/under-construction'))
);
const MaintenanceComingSoon = Loadable(lazy(() => import('@pages/maintenance/coming-soon')));

const MaintenanceRoutes = {
	settings: {
		layout: {
			config: {}
		}
	},
	// auth: authRoles('Maintenance'),
	routes: [
		{
			path: '/maintenance',
			element: <CommonLayout />,
			children: [
				{
					path: '404',
					element: (
						<WrapperRouteComponent element={<MaintenanceError />} titleId="title.404" />
					),
					permission: isPermission('Maintenance', 'maintenance:404') //permission('maintenance:500')
				},
				{
					path: '500',
					element: (
						<WrapperRouteComponent
							element={<MaintenanceError500 />}
							titleId="title.500"
						/>
					),
					permission: isPermission('Maintenance', 'maintenance:500') //permission('maintenance:500')
				},
				{
					path: 'under-construction',
					element: (
						<WrapperRouteComponent
							element={<MaintenanceUnderConstruction />}
							titleId="title.under-construction"
						/>
					),
					permission: isPermission('Maintenance', 'maintenance:underconstruction')
				},
				{
					path: 'coming-soon',
					element: (
						<WrapperRouteComponent
							element={<MaintenanceComingSoon />}
							titleId="title.coming-soon"
						/>
					),
					permission: isPermission('Maintenance', 'maintenance:coming-soon')
				}
			]
		}
	]
};

export default MaintenanceRoutes;

// import React from 'react';
// import authRoles from '../../../auth/authRoles';

// const AreaConfig = {
// 	settings: {
// 		layout: {
// 			config: {}
// 		}
// 	},
// 	auth: authRoles('Area'), // ['admin']
// 	routes: [
// 		{
// 			path: '/areas',
// 			component: React.lazy(() => import(/* webpackChunkName: "area" */ './Areas'))
// 		}
// 	]
// };

// export default AreaConfig;

// const routeConfigs = [
// 	/** Auth */
// 	AuthConfig,

// 	/** User */
// 	UserConfig,
// 	RoleConfig,
// 	ChangePasswordConfig
// ]

// const routes = [
// 	...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
// 	{
// 		path: '/',
// 		exact: true,
// 		component: () => <Redirect to="/orderspending" />
// 	},
// 	{
// 		component: () => <Redirect to="/pages/errors/error-404" />
// 	}
// ];
