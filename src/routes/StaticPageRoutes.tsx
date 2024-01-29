/** Static */
import StaticRoutes from '@pages/static/routeConfig';
import InfiniteUtils from '@utils/InfiniteUtils';

const routeConfigs = [StaticRoutes];

// ==============================|| AUTH ROUTING ||============================== //

const StaticPageRoutes = {
	path: '/',
	children: [
		{
			children: [...InfiniteUtils.generateRoutesFromConfigs(routeConfigs, null)]
		}
	]
};

export default StaticPageRoutes;
