// third-party
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

// third-party
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { DashboardOutlined, GoldOutlined } from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// project import
// import { useSelector } from '../store';
// import { useMenuSlice } from '@app/store/slice/menu';
import { menuSelector } from '@app/store/slice/menu/menu.selectors';

const icons = {
	dashboardOutlined: DashboardOutlined,
	goldOutlined: GoldOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

export const DashboardMenu = () => {
	// const { menuDashboard } = useSelector(state => state.menu);
	const menuState = useSelector(menuSelector);

	const { menuDashboard } = menuState;

	const SubChildrenLis = (SubChildrenLis: NavItemType[]) => {
		return SubChildrenLis?.map((subList: NavItemType) => {
			return {
				...subList,
				title: <FormattedMessage id={`${subList.title}`} />,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				icon: icons[subList.icon]
			};
		});
	};

	const menuList = (subList: NavItemType) => {
		const list: NavItemType = {
			...subList,
			title: <FormattedMessage id={`${subList.title}`} />,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			icon: icons[subList.icon]
		};

		if (subList.type === 'collapse') {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			list.children = SubChildrenLis(subList.children!);
		}
		return list;
	};
	const ChildrenList: NavItemType[] | undefined = menuDashboard?.children?.map(
		(subList: NavItemType) => {
			return menuList(subList);
		}
	);

	const dashboardList: NavItemType = {
		...menuDashboard,
		title: <FormattedMessage id={`${menuDashboard.title}`} />,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		icon: icons[menuDashboard.icon],
		children: ChildrenList
	};

	return dashboardList;
};
