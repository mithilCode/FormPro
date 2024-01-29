import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

// project import
import CommonLayout from '@app/layout/CommonLayout';
import WrapperRouteComponent from '@app/routes/config';
import Loadable from '@components/Loadable';

import LoginRoutes from './LoginRoutes';
// import ComponentsRoutes from './ComponentsRoutes';
import MainRoutes from './MainRoutes';
import StaticPageRoutes from './StaticPageRoutes';

const MaintenanceError = Loadable(lazy(() => import('@pages/maintenance/404')));

// render - landing page
// const PagesLanding = Loadable(lazy(() => import('@pages/landing')));
const Logout = Loadable(lazy(() => import('@pages/auth/Logout')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
	return useRoutes([
		{
			path: '/',
			element: <CommonLayout layout="landing" />,
			children: [
				{
					path: '/',
					// element: <PagesLanding />
					element: <Navigate replace to="/dashboard/analytics" />
				}
			]
		},
		{
			path: '/logout',
			children: [
				{
					path: '',
					element: <Logout />
				}
			]
		},
		{
			path: '404',
			element: <WrapperRouteComponent element={<MaintenanceError />} titleId="title.404" />
		},
		{
			path: '*',
			element: <Navigate replace to="/404" />
		},
		LoginRoutes,
		// ComponentsRoutes
		MainRoutes,
		StaticPageRoutes
	]);
}
