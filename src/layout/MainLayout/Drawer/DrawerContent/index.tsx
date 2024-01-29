import { useSelector } from 'react-redux';
// material-ui
import { useMediaQuery, useTheme } from '@mui/material';

// import { RootStateProps } from 'types/root';
import { menuSelector } from '@app/store/slice/menu/menu.selectors';
import SimpleBar from '@components/third-party/SimpleBar';

// project import
import NavCard from './NavCard';
import Navigation from './Navigation';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
	const theme = useTheme();
	const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

	// const menu = useSelector((state: RootStateProps) => state.menu);
	const menu = useSelector(menuSelector);
	const { drawerOpen } = menu;

	return (
		<SimpleBar
			sx={{
				'& .simplebar-content': {
					display: 'flex',
					flexDirection: 'column'
				}
			}}>
			<Navigation />
			{drawerOpen && !matchDownMD && <NavCard />}
		</SimpleBar>
	);
};

export default DrawerContent;
