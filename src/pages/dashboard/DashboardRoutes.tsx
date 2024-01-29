import { lazy } from 'react';

import WrapperRouteComponent from '@app/routes/config';
import Loadable from '@components/Loadable';
// import CommonLayout from '@layout/CommonLayout';
// import { authRoles } from '@utils/helpers';

// const DashboardDefault = Loadable(lazy(() => import('@pages/dashboard/default')));
const DashboardAnalytics = Loadable(lazy(() => import('@pages/dashboard/analytics')));

const DashboardRoutes = {
	settings: {
		layout: {
			config: {}
		}
	},
	// auth: authRoles('Dashboard'),
	routes: [
		{
			path: 'dashboard',
			children: [
				// {
				// 	path: 'default',
				// 	element: (
				// 		<WrapperRouteComponent
				// 			element={<DashboardDefault />}
				// 			titleId="title.dashboard"
				// 		/>
				// 	)
				// },
				{
					path: 'analytics',
					element: (
						<WrapperRouteComponent
							element={<DashboardAnalytics />}
							titleId="title.dashboard-analytics"
						/>
					)
				}
			]
		}
	]
};

export default DashboardRoutes;
