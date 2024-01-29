// third-party
import { FormattedMessage } from 'react-intl';
import { DollarOutlined, LoginOutlined, PhoneOutlined, RocketOutlined } from '@ant-design/icons';

import { isPermission } from '@utils/helpers';

// type
// import { NavItemType } from 'types/menu';
// import { authRoles } from '@utils/helpers';

// icons
const icons = { DollarOutlined, LoginOutlined, PhoneOutlined, RocketOutlined };

const maintenanceMenus = {
	// auth: authRoles('Maintenance'),
	// permission: true,
	menus: [
		{
			id: 'maintenance',
			title: <FormattedMessage id="maintenance" />,
			type: 'collapse',
			icon: icons.RocketOutlined,
			children: [
				{
					id: 'error-404',
					title: <FormattedMessage id="error-404" />,
					type: 'item',
					url: '/maintenance/404',
					target: true
					//	permission: isPermission('Maintenance', 'maintenance:404') //permission('maintenance:404')
				},
				{
					id: 'error-500',
					title: <FormattedMessage id="error-500" />,
					type: 'item',
					url: '/maintenance/500',
					target: true,
					permission: isPermission('Maintenance', 'maintenance:500') //permission('maintenance:500')
				},
				{
					id: 'coming-soon',
					title: <FormattedMessage id="coming-soon" />,
					type: 'item',
					url: '/maintenance/coming-soon',
					target: true,
					permission: isPermission('Maintenance', 'maintenance:coming-soon')
				},
				{
					id: 'under-construction',
					title: <FormattedMessage id="under-construction" />,
					type: 'item',
					url: '/maintenance/under-construction',
					target: true,
					permission: isPermission('Maintenance', 'maintenance:underconstruction')
				}
			]
		}
	]
};

export default maintenanceMenus;
