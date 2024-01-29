import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
// material-ui
import { Box, Container, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import navigation from 'menu-items';
import { LAYOUT_CONST } from 'types/config';

import { useMenuSlice } from '@app/store/slice/menu';
import { menuSelector } from '@app/store/slice/menu/menu.selectors';
// types
// import { RootStateProps } from 'types/root';
import Breadcrumbs from '@components/@extended/Breadcrumbs';
import useConfig from '@hooks/useConfig';

// project import
import Drawer from './Drawer';
import HorizontalBar from './Drawer/HorizontalBar';
// import Footer from './Footer';
import Header from './Header';
import '@pages/css/custReactdatagrid.css';

// import { openDrawer } from '@store/reducers/menu';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
	const theme = useTheme();
	const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));
	const downLG = useMediaQuery(theme.breakpoints.down('lg'));

	const { container, miniDrawer, menuOrientation } = useConfig();

	const dispatch = useDispatch();
	const { actions } = useMenuSlice();

	const isHorizontal = menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG;

	// const menu = useSelector((state: RootStateProps) => state.menu);
	const menu = useSelector(menuSelector);
	const { drawerOpen } = menu;

	// drawer toggler
	const [open, setOpen] = useState(!miniDrawer || drawerOpen);
	const handleDrawerToggle = () => {
		setOpen(!open);
		dispatch(actions.openDrawer({ drawerOpen: !open }));
	};

	// set media wise responsive drawer
	useEffect(() => {
		if (!miniDrawer) {
			setOpen(!matchDownLG);
			dispatch(actions.openDrawer({ drawerOpen: !matchDownLG }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [matchDownLG]);

	useEffect(() => {
		if (open !== drawerOpen) setOpen(drawerOpen);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [drawerOpen]);

	return (
		<Box sx={{ display: 'flex', width: '100%' }}>
			<Header open={open} handleDrawerToggle={handleDrawerToggle} />
			{!isHorizontal ? (
				<Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
			) : (
				<HorizontalBar />
			)}

			<Box
				component="main"
				sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 0, sm: 1 } }}>
				<Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit' }} />
				<Container
					maxWidth={container ? 'xl' : false}
					sx={{
						...(container && { px: { xs: 0, sm: 0 } }),
						position: 'relative',
						minHeight: 'calc(100vh - 110px)',
						marginLeft: 'inherit',
						display: 'flex',
						flexDirection: 'column'
					}}>
					<Breadcrumbs
						navigation={navigation}
						title
						titleBottom
						card={false}
						divider={false}
					/>
					<Outlet />
					{/* <Footer /> */}
				</Container>
			</Box>
		</Box>
	);
};

export default MainLayout;
