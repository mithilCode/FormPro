import { FormattedMessage } from 'react-intl';
import {
	DollarOutlined,
	LoginOutlined,
	PhoneOutlined,
	RocketOutlined,
	EnvironmentOutlined,
	SketchOutlined,
	CompressOutlined,
	TrademarkCircleOutlined,
	InteractionOutlined
} from '@ant-design/icons';

// import { isPermission } from '@utils/helpers';

const icons = {
	DollarOutlined,
	LoginOutlined,
	PhoneOutlined,
	RocketOutlined,
	EnvironmentOutlined,
	SketchOutlined,
	CompressOutlined,
	TrademarkCircleOutlined,
	InteractionOutlined
};

const masterMenus = {
	// auth: authRoles('Maintenance'),
	// permission: true,
	menus: [
		{
			id: 'master',
			title: <FormattedMessage id="Master" />,
			type: 'collapse',
			icon: icons.CompressOutlined,
			children: [
				// {
				// 	id: 'location',
				// 	title: <FormattedMessage id="Location" />,
				// 	type: 'collapse',
				// 	icon: icons.EnvironmentOutlined,
				// 	children: [

				// 	],
				// 	target: false
				// },
				{
					id: 'diamondpara',
					title: <FormattedMessage id="Diamond Para" />,
					type: 'collapse',
					icon: icons.SketchOutlined,
					children: [
						{
							id: 'shape',
							// title: <FormattedMessage id="shape Detail" />,
							title: 'Shape',
							type: 'item',
							url: '/shape',
							target: false
						},
						{
							id: 'color',
							// title: <FormattedMessage id="shape Detail" />,
							title: 'Color',
							type: 'item',
							url: '/color',
							target: false
						},
						{
							id: 'purity',
							title: 'Purity',
							type: 'item',
							url: '/purity',
							target: false
						},
						{
							id: 'cut',
							// title: <FormattedMessage id="shape Detail" />,
							title: 'Cut',
							type: 'item',
							url: '/cut',
							target: false
						},
						{
							id: 'polish',
							// title: <FormattedMessage id="shape Detail" />,
							title: 'Polish',
							type: 'item',
							url: '/polish',
							target: false
						},
						{
							id: 'symm',
							// title: <FormattedMessage id="cut Detail" />,
							title: 'Symm',
							type: 'item',
							url: '/symm',
							target: false
						},
						{
							id: 'fls',
							// title: <FormattedMessage id="shape Detail" />,
							title: 'Fls',
							type: 'item',
							url: '/fls',
							target: false
						},
						{
							id: 'lab',
							title: 'Lab',
							type: 'item',
							url: '/lab',
							target: false
						},
						{
							id: 'range',
							title: <FormattedMessage id="Range" />,
							type: 'item',
							url: '/range',
							target: false
							// permission: isPermission('Master', 'master:country')
						},
						{
							id: 'prop',
							title: 'Prop',
							type: 'item',
							url: '/prop',
							target: false
						}
					],
					target: false
				},
				{
					id: 'currency',
					title: 'Currency',
					type: 'item',
					url: '/currency',
					icon: icons.DollarOutlined,
					target: false
				},
				{
					id: 'rapaport',
					title: 'Rapaport',
					type: 'item',
					icon: icons.TrademarkCircleOutlined,
					url: '/rapaport',
					target: false
				},
				{
					id: 'general',
					title: <FormattedMessage id="General" />,
					type: 'collapse',
					icon: icons.InteractionOutlined,
					children: [
						{
							id: 'country',
							title: <FormattedMessage id="Country" />,
							type: 'item',
							url: '/country',
							target: false
							// permission: isPermission('Master', 'master:country')
						},
						{
							id: 'state',
							title: <FormattedMessage id="State" />,
							type: 'item',
							url: '/state',
							target: false
						},

						{
							id: 'city',
							title: <FormattedMessage id="City" />,
							type: 'item',
							url: '/city',
							target: false
						},
						{
							id: 'para',
							title: <FormattedMessage id="Para" />,
							type: 'item',
							url: '/para',
							target: false
						}
					],
					target: false
				}
			]
		}
	]
};

export default masterMenus;
