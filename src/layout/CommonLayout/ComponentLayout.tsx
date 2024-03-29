import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
// material-ui
import { Box, useMediaQuery } from '@mui/material';
import { styled, Theme, useTheme } from '@mui/material/styles';

import { DRAWER_WIDTH } from '@app/config';
import { useMenuSlice } from '@app/store/slice/menu';

// project import
import Drawer from './Drawer';

// import { openComponentDrawer } from '../../store/reducers/menu';

// components content
const Main = styled('main', { shouldForwardProp: (prop: any) => prop !== 'open' })(
	({ theme, open }: { theme: Theme; open: boolean }) => ({
		minHeight: `calc(100vh - 188px)`,
		width: `calc(100% - ${DRAWER_WIDTH}px)`,
		flexGrow: 1,
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		[theme.breakpoints.down('md')]: {
			paddingLeft: 0
		},
		...(open && {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen
			})
		})
	})
);

// ==============================|| COMPONENTS LAYOUT ||============================== //

interface Props {
	handleDrawerOpen: () => void;
	componentDrawerOpen: boolean;
}

const ComponentsLayout = ({ handleDrawerOpen, componentDrawerOpen }: Props) => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const { actions } = useMenuSlice();
	const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

	useEffect(() => {
		dispatch(actions.openComponentDrawer({ componentDrawerOpen: !matchDownMd }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [matchDownMd]);

	return (
		<Box sx={{ display: 'flex', pt: componentDrawerOpen ? { xs: 0, md: 3, xl: 5.5 } : 0 }}>
			<Drawer handleDrawerOpen={handleDrawerOpen} open={componentDrawerOpen} />
			<Main theme={theme} open={componentDrawerOpen}>
				<Outlet />
			</Main>
		</Box>
	);
};

export default ComponentsLayout;
