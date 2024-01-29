import { useMemo } from 'react';
// material-ui
import { Box, Drawer, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { DRAWER_WIDTH } from 'config';

// project import
import DrawerContent from './DrawerContent';
import DrawerHeader from './DrawerHeader';
import MiniDrawerStyled from './MiniDrawerStyled';
import CustMenu from './CustMenu/Sidebar';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

interface Props {
	open: boolean;
	window?: () => Window;
	handleDrawerToggle?: () => void;
}

const MainDrawer = ({ open, handleDrawerToggle, window }: Props) => {
	const theme = useTheme();
	const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

	// responsive drawer container
	const container = window !== undefined ? () => window().document.body : undefined;
	
	// header content
	const drawerContent = useMemo(() => <DrawerContent />, []);
	const drawerHeader = useMemo(() => <DrawerHeader open={open} />, [open]);
	console.log(container,DRAWER_WIDTH,Drawer,drawerContent,drawerHeader)
	return (		
		<>
		{/* <CustMenu /> */}
		<Box
			component="nav"
			sx={{ flexShrink: { md: 0 }, zIndex: 1200 }}
			aria-label="mailbox folders">
			{!matchDownMD ? (
				<MiniDrawerStyled variant="permanent" open={open}>
					{/* {drawerHeader}
					{drawerContent} */}
					<CustMenu open1={open} />
				</MiniDrawerStyled>
			) : (
				
				<Drawer
					container={container}
					variant="temporary"
					open={open}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					sx={{
						display: { xs: 'block', lg: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: DRAWER_WIDTH,
							borderRight: `1px solid ${theme.palette.divider}`,
							backgroundImage: 'none',
							boxShadow: 'inherit'
						}
					}}>
					{/* {drawerHeader}
					{drawerContent} */}
					<CustMenu open1={open} />
				</Drawer>
			)}

		</Box>
		
		</>
	
	);
};

export default MainDrawer;
