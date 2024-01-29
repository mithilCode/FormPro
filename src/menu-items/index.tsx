// project import
// types
import { NavItemType } from 'types/menu';

import applications from './applications';
import chartsMap from './charts-map';
import formsTables from './forms-tables';
import masters from './masters';
import other from './other';
import pages from './pages';
import widget from './widget';


// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
	items: [widget, masters, applications, formsTables, chartsMap, pages, other]
};

export default menuItems;
