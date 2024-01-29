import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
// material-ui
import { useTheme } from '@mui/material/styles';
// assets
import { CreditCardOutlined, LockOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

function getPathIndex(pathname: string) {
	let selectedTab = 0;
	switch (pathname) {
		case '/user/payment':
			selectedTab = 1;
			break;
		case '/user/password':
			selectedTab = 2;
			break;
		case '/user/settings':
			selectedTab = 3;
			break;
		case '/user/personal':
		default:
			selectedTab = 0;
	}
	return selectedTab;
}

// ==============================|| USER PROFILE - TAB ||============================== //

const ProfileTab = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [selectedIndex, setSelectedIndex] = useState(getPathIndex(pathname));
	const handleListItemClick = (index: number, route: string) => {
		setSelectedIndex(index);
		navigate(route);
	};

	useEffect(() => {
		setSelectedIndex(getPathIndex(pathname));
	}, [pathname]);

	return (
		<List
			component="nav"
			sx={{
				p: 0,
				'& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] }
			}}>
			<ListItemButton
				selected={selectedIndex === 0}
				onClick={() => handleListItemClick(0, '/user/personal')}>
				<ListItemIcon>
					<UserOutlined />
				</ListItemIcon>
				<ListItemText primary="Personal Information" />
			</ListItemButton>
			<ListItemButton
				selected={selectedIndex === 1}
				onClick={() => handleListItemClick(1, '/user/payment')}>
				<ListItemIcon>
					<CreditCardOutlined />
				</ListItemIcon>
				<ListItemText primary="Payment" />
			</ListItemButton>
			<ListItemButton
				selected={selectedIndex === 2}
				onClick={() => handleListItemClick(2, '/user/password')}>
				<ListItemIcon>
					<LockOutlined />
				</ListItemIcon>
				<ListItemText primary="Change Password" />
			</ListItemButton>
			<ListItemButton
				selected={selectedIndex === 3}
				onClick={() => handleListItemClick(3, '/user/settings')}>
				<ListItemIcon>
					<SettingOutlined />
				</ListItemIcon>
				<ListItemText primary="Settings" />
			</ListItemButton>
		</List>
	);
};

export default ProfileTab;
