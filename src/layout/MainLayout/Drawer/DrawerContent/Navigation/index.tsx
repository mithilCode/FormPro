import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// material-ui
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { HORIZONTAL_MAX_ITEM } from 'config';
import menuItem from 'menu-items';
// types
import { LAYOUT_CONST } from 'types/config';
import { NavItemType } from 'types/menu';

// import { useSelector } from 'store';
import { menuSelector } from '@app/store/slice/menu/menu.selectors';
// project import
import useConfig from '@hooks/useConfig';
// import { DashboardMenu } from 'menu-items/dashboard';
import { DashboardMenu } from '@pages/dashboard/menu-items/dashboard';
import InfiniteUtils from '@utils/InfiniteUtils';

import NavGroup from './NavGroup';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
	const theme = useTheme();

	const downLG = useMediaQuery(theme.breakpoints.down('lg'));

	const { menuOrientation } = useConfig();
	// const { drawerOpen } = useSelector(state => state.menu);
	const menu = useSelector(menuSelector);
	const { drawerOpen } = menu;
	const [selectedItems, setSelectedItems] = useState<string | undefined>('');
	const [selectedLevel, setSelectedLevel] = useState<number>(0);

	const [fillMenu, setFillMenu] = useState([]);

	useEffect(() => {
		handlerMenuItem();
		// eslint-disable-next-line
	}, []);

	const getDash = DashboardMenu() as any;
	const handlerMenuItem = async () => {
		const isFound = menuItem.items.some(element => {
			if (element.id === 'group-dashboard') {
				return true;
			}
			return false;
		});

		if (getDash?.id !== undefined && !isFound) {
			menuItem.items.splice(0, 0, getDash);
		}

		const filterMenu = await InfiniteUtils.removeFromArrayOfObj(
			menuItem.items,
			'permission',
			false
		);
		setFillMenu(filterMenu);
	};

	const isHorizontal = menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG;

	const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
	// let lastItemIndex = menuItem.items.length - 1;
	let remItems: NavItemType[] = [];
	let lastItemId: string;

	if (lastItem && lastItem < menuItem.items.length) {
		// lastItemId = menuItem.items[lastItem - 1].id!;
		// lastItemIndex = lastItem - 1;
		remItems = menuItem.items.slice(lastItem - 1, menuItem.items.length).map(item => ({
			title: item.title,
			elements: item.children,
			icon: item.icon
		}));
	}

	const navGroups = fillMenu.map((item: any) => {
		switch (item.type) {
			case 'group':
				return (
					<NavGroup
						key={item.id}
						setSelectedItems={setSelectedItems}
						setSelectedLevel={setSelectedLevel}
						selectedLevel={selectedLevel}
						selectedItems={selectedItems}
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						lastItem={lastItem!}
						remItems={remItems}
						lastItemId={lastItemId}
						item={item}
					/>
				);
			default:
				return (
					<Typography key={item.id} variant="h6" color="error" align="center">
						Fix - Navigation Group
					</Typography>
				);
		}
	});

	// const navGroups1 = menuItem.items.slice(0, lastItemIndex + 1).map(item => {
	// 	const xxx = InfiniteUtils.removeFromArrayOfObj(
	// 		menuItem.items.slice(0, lastItemIndex + 1),
	// 		false,
	// 		'permission'
	// 	);

	// 	console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', xxx);

	// 	// if (item.type === 'collapse' || item.type === 'group') {
	// 	// 	console.log('HELLO jane');

	// 	// 	const filterNav = InfiniteUtils.getFlatNavigation(item.children, []);

	// 	// 	console.log('filterNav=filterNav=filterNavfilterNav=', filterNav);
	// 	// }

	// 	if (item.type === 'collapse' || item.type === 'group') {
	// 		// ***** MENU LEVEL 1 ***** //
	// 		item?.children?.map((level1, idx1) => {
	// 			if (level1.type === 'item') {
	// 				if (level1 && level1?.permission === false) {
	// 					item.children?.splice(idx1, 1);
	// 				}
	// 			}

	// 			if (level1.type === 'collapse' || level1.type === 'group') {
	// 				// ***** MENU LEVEL 2 ***** //

	// 				level1?.children?.map((level2, idx2) => {
	// 					if (level2.type === 'item') {
	// 						if (level2 && level2?.permission === false) {
	// 							level1.children?.splice(idx2, 1);
	// 						}
	// 					}

	// 					console.log(
	// 						'LEVEL 2 children LENGTH AFTER remove',
	// 						level1.id,
	// 						level1.children?.length
	// 					);

	// 					// REMOVE PARENT MENU IF CHILDREN NOT EXIST
	// 					if (level1?.children?.length && level1?.children?.length === 0) {
	// 						level1.children?.splice(idx1, 1);
	// 					}

	// 					if (level2.type === 'collapse' || level2.type === 'group') {
	// 						// ***** MENU LEVEL 3 ***** //
	// 						level2?.children?.map((level3, idx3) => {
	// 							if (level3.type === 'item') {
	// 								if (level3 && level3?.permission === false) {
	// 									level2.children?.splice(idx3, 1);
	// 								}
	// 							}

	// 							console.log(
	// 								'LEVEL 3 children LENGTH AFTER remove',
	// 								level2.id,
	// 								level2.children?.length
	// 							);
	// 							// REMOVE PARENT MENU IF CHILDREN NOT EXIST
	// 							if (level2?.children?.length && level2?.children?.length === 0) {
	// 								level2.children?.splice(idx2, 1);
	// 							}

	// 							if (level3.type === 'collapse' || level3.type === 'group') {
	// 								// ***** MENU LEVEL 4 ***** //
	// 								level3?.children?.map((level4, idx4) => {
	// 									if (level4.type === 'item') {
	// 										if (level4 && level4?.permission === false) {
	// 											level3.children?.splice(idx4, 1);
	// 										}
	// 									}

	// 									console.log(
	// 										'LEVEL 4 children LENGTH AFTER remove',
	// 										level3.id,
	// 										level3.children?.length
	// 									);
	// 									// REMOVE PARENT MENU IF CHILDREN NOT EXIST
	// 									if (
	// 										level3?.children?.length &&
	// 										level3?.children?.length === 0
	// 									) {
	// 										level3.children?.splice(idx2, 1);
	// 									}

	// 									if (level4.type === 'collapse' || level4.type === 'group') {
	// 										// ***** MENU LEVEL 5 ***** //
	// 										level4?.children?.map((level5, idx5) => {
	// 											if (level5.type === 'item') {
	// 												if (level5 && level5?.permission === false) {
	// 													level4.children?.splice(idx5, 1);
	// 												}
	// 											}
	// 										});
	// 									}
	// 								});
	// 							}
	// 						});
	// 					}
	// 				});
	// 			}
	// 		});
	// 	}

	// 	// if (item.children) {
	// 	// 	// item.children.filter(itm => itm.permission !== false);

	// 	// 	item.children.map((itm, idx) => {
	// 	// 		console.log('hello', itm, itm?.permission === false);
	// 	// 		if (itm && itm?.permission === false) {
	// 	// 			console.log('under aaviyu');

	// 	// 			item.children?.splice(idx, 1);
	// 	// 			console.log('under ja', item.children);
	// 	// 		}
	// 	// 	});
	// 	// }
	// 	console.log('HAHAHAHHA', item);
	// 	switch (item.type) {
	// 		case 'group':
	// 			return (
	// 				<NavGroup
	// 					key={item.id}
	// 					setSelectedItems={setSelectedItems}
	// 					setSelectedLevel={setSelectedLevel}
	// 					selectedLevel={selectedLevel}
	// 					selectedItems={selectedItems}
	// 					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	// 					lastItem={lastItem!}
	// 					remItems={remItems}
	// 					lastItemId={lastItemId}
	// 					item={item}
	// 				/>
	// 			);
	// 		default:
	// 			return (
	// 				<Typography key={item.id} variant="h6" color="error" align="center">
	// 					Fix - Navigation Group
	// 				</Typography>
	// 			);
	// 	}
	// });
	return (
		<Box
			sx={{
				pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
				'& > ul:first-of-type': { mt: 0 },
				display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block'
			}}>
			{navGroups}
		</Box>
	);
};

export default Navigation;
