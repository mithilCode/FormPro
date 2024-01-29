import { lazy } from 'react';

import WrapperRouteComponent from '@app/routes/config';
import Loadable from '@components/Loadable';
import CommonLayout from '@layout/CommonLayout';

const StaticRegisterSuccess = Loadable(lazy(() => import('@pages/static/register-success')));

const StaticRoutes = {
	settings: {
		layout: {
			config: {}
		}
	},
	// auth: authRoles('Maintenance'),
	routes: [
		{
			path: '/static',
			element: <CommonLayout />,
			children: [
				{
					path: 'register-success',
					element: (
						<WrapperRouteComponent
							element={<StaticRegisterSuccess />}
							titleId="title.register-success"
						/>
					)
				}
			]
		}
	]
};

export default StaticRoutes;
