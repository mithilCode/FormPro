import { lazy } from 'react';

import Loadable from '@components/Loadable';
// project import
import CommonLayout from '@layout/CommonLayout';
import MainLayout from '@layout/MainLayout';
/** Dashboard */
import DashboardRoutes from '@pages/dashboard/DashboardRoutes';
/** Maintenance */
import MaintenanceRoutes from '@pages/maintenance/routeConfig';
/** Master Pages */
import MasterRoutes from '@pages/master/routeConfig';
/** User */
import UserPageRoutes from '@pages/profile/routeConfig';
// import generateRoutesFromConfigs from '@utils/dynamicRoute';
import InfiniteUtils from '@utils/InfiniteUtils';
import AuthGuard from '@utils/route-guard/AuthGuard';

// import WrapperRouteComponent from './config';

// console.log('MaintenanceConfig', MaintenanceConfig.routes);

// // render - dashboard
// const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
// const DashboardAnalytics = Loadable(lazy(() => import('@pages/dashboard/analytics')));

// pages routing
const AuthLogin = Loadable(lazy(() => import('@pages/auth/Login')));

// const MaintenanceError = Loadable(lazy(() => import('@pages/maintenance/404')));
// const MaintenanceError500 = Loadable(lazy(() => import('@pages/maintenance/500')));
// const MaintenanceUnderConstruction = Loadable(
// 	lazy(() => import('@pages/maintenance/under-construction'))
// );
// const MaintenanceComingSoon = Loadable(lazy(() => import('@pages/maintenance/coming-soon')));

const routeConfigs = [DashboardRoutes, MaintenanceRoutes, UserPageRoutes, MasterRoutes];

// const abc = generateRoutesFromConfigs(routeConfigs, null);

// console.log('ABC', abc);

// const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));

// // render - sample page
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
// const PricingPage = Loadable(lazy(() => import('pages/extra-pages/pricing')));

// ==============================|| MAIN ROUTING ||============================== //

// generateRoutesFromConfigs([routeConfigs], null),

const MainRoutes = {
	path: '/',
	children: [
		{
			path: '/',
			element: (
				<AuthGuard>
					<MainLayout />
				</AuthGuard>
			),
			children: [
				...InfiniteUtils.generateRoutesFromConfigs(routeConfigs, null),
				// {
				// 	path: '/maintenance',
				// element: <CommonLayout />,
				// 	children: [
				// 		{
				// 			path: '404',
				// 			// element: <MaintenanceError />
				// 			element: (
				// 				<WrapperRouteComponent
				// 					element={<MaintenanceError />}
				// 					titleId="title.login"
				// 				/>
				// 			)
				// 		},
				// 		{
				// 			path: '500',
				// 			element: <MaintenanceError500 />
				// 		},
				// 		{
				// 			path: 'under-construction',
				// 			element: <MaintenanceUnderConstruction />
				// 		},
				// 		{
				// 			path: 'coming-soon',
				// 			element: <MaintenanceComingSoon />
				// 		}
				// 	]
				// },
				{
					path: '/auth',
					element: <CommonLayout />,
					children: [
						{
							path: 'login',
							element: <AuthLogin />
						}
					]
				}
				// {
				// 	path: '/',
				// 	element: <CommonLayout layout="simple" />,
				// 	children: [
				// 		{
				// 			path: 'contact-us',
				// 			element: <AppContactUS />
				// 		}
				// 	]
				// }
			]
		}
	]
};

export default MainRoutes;
