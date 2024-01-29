import { useEffect, useState } from 'react';
import { Box, Stack, SwipeableDrawer, Typography, useMediaQuery } from '@mui/material';
// material-ui
import { useTheme } from '@mui/material/styles';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

// import { DRAWER_WIDTH } from '@app/config';
import MainCard from '@components/MainCard';

// ==============================|| INFINITE DRAWER ||============================== //

interface Props {
	// open: boolean;
	window?: () => Window;
	width?: number;
	title?: string;
	disableEscapeKeyDown?: boolean;
	handleDrawerToggle: () => void;
	component: any;
	passProps?: any;
	edit?: boolean;
	selectedData?: any;
	[x: string]: any;
}

const InfiniteDrawer = ({
	// open,
	component: Component,
	width,
	title,
	disableEscapeKeyDown,
	handleDrawerToggle,
	window,
	passProps,
	edit = false,
	selectedData,
	...rest
}: Props) => {
	const theme = useTheme();
	const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

	const iconSX = {
		marginRight: theme.spacing(2.15),
		marginTop: `-${theme.spacing(0.05)}`,
		width: '0.5rem',
		height: '0.5rem',
		color: theme.palette.secondary.main
	};

	// responsive drawer container
	const container = window !== undefined ? () => window().document.body : undefined;

	const [anchor] = useState<any>('right');

	const [drawerState, setDrawerState] = useState({
		right: false
	});

	useEffect(() => {
		setDrawerState({ ...drawerState, right: true });
	}, []);

	const toggleDrawer = (anchor: string, open: boolean) => (event: any) => {
		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		setDrawerState({ ...drawerState, [anchor]: open });
		if (!open) {
			setTimeout(() => {
				handleDrawerToggle();
			}, 200);
		}
	};

	// // header content
	// const drawerContent = useMemo(() => <DrawerContent />, []);
	// const drawerHeader = useMemo(() => <DrawerHeader open={open} />, [open]);

	return (
		<Box
			component="nav"
			sx={{ flexShrink: { md: 0 }, zIndex: 1200 }}
			aria-label="mailbox folders">
			<SwipeableDrawer
				{...rest}
				container={container}
				variant="temporary"
				anchor={anchor || 'right'}
				open={drawerState.right}
				onClose={toggleDrawer(anchor, false)}
				onOpen={toggleDrawer(anchor, true)}
				disableEscapeKeyDown={disableEscapeKeyDown}
				ModalProps={{
					keepMounted: true // Better open performance on mobile.
				}}
				sx={{
					display: { xs: 'block', lg: 'block' },
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: width ? `${width}%` : matchDownMD ? '30%' : '50%',
						borderRight: `1px solid ${theme.palette.divider}`,
						backgroundImage: 'none',
						boxShadow: 'inherit'
					}
				}}>
				<MainCard
					content={false}
					title={
						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="center"
							sx={{ p: 1, pb: 0 }}>
							<Typography
								className="normal-case flex items-center sm:mb-12"
								role="button"
								onClick={toggleDrawer(anchor, false)}
								color="inherit">
								{theme.direction === 'ltr' ? (
									<ArrowLeftOutlined style={iconSX} />
								) : (
									<ArrowRightOutlined style={iconSX} />
								)}
								<Typography
									className="sm:flex mx-0 sm:mx-12"
									component={'span'}
									variant="h6">
									{title}
								</Typography>
							</Typography>
						</Stack>
					}>
					<Component
						handleDrawerToggle={toggleDrawer(anchor, false)}
						passProps={passProps}
						edit={edit}
						selectedData={selectedData}
						{...rest}
					/>
				</MainCard>
			</SwipeableDrawer>
		</Box>
	);
};

export default InfiniteDrawer;

// <Drawer
// // container={container}
// variant="temporary"
// open={true}
// // onClose={handleDrawerToggle}
// // ModalProps={{ keepMounted: true }}
// sx={{
//     display: { xs: 'block', lg: 'none' },
//     '& .MuiDrawer-paper': {
//         boxSizing: 'border-box',
//         width: DRAWER_WIDTH,
//         borderRight: `1px solid ${theme.palette.divider}`,
//         backgroundImage: 'none',
//         boxShadow: 'inherit'
//     }
// }}>
// {'Lina'}
// {'Dharmesh'}
// </Drawer>
