// third-party
import { FormattedMessage } from 'react-intl';

// import { DollarOutlined, LoginOutlined, PhoneOutlined, RocketOutlined } from '@ant-design/icons';
// type
import { NavItemType } from 'types/menu';

/** Maintenance */
import masterMenus from '@pages/master/menuConfig';
import InfiniteUtils from '@utils/InfiniteUtils';

// icons
// const icons = { DollarOutlined, LoginOutlined, PhoneOutlined, RocketOutlined };

const menuConfigs = [masterMenus];

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages: NavItemType = {
	id: 'group-masters',
	title: <FormattedMessage id="masters" />,
	type: 'group',
	children: [...InfiniteUtils.generateMenusFromConfigs(menuConfigs, null)]
};

export default pages;
