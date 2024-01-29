import { forwardRef, ForwardRefExoticComponent, RefAttributes, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// material-ui
import {
	Avatar,
	Chip,
	ListItemButton,
	ListItemText,
	Typography,
	useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import { useMenuSlice } from '@app/store/slice/menu';
import { menuSelector } from '@app/store/slice/menu/menu.selectors';
import { LinkTarget, NavItemType } from '@app/store/slice/menu/types';

// types
// import { LinkTarget, NavItemType } from 'types/menu';
// import { RootState } from 'types/rootstate';

// project import
// import { activeComponent, openComponentDrawer } from '../../../../store/reducers/menu';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

interface Props {
	item: NavItemType;
	level: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NavItem = ({ item, level }: Props) => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const { actions } = useMenuSlice();
	const matchesMD = useMediaQuery(theme.breakpoints.down('md'));

	// const menu = useSelector((state: RootState) => state.menu);
	const menu = useSelector(menuSelector);
	const { openComponent } = menu;

	let itemTarget: LinkTarget = '_self';
	if (item.target) {
		itemTarget = '_blank';
	}

	let listItemProps: {
		component: ForwardRefExoticComponent<RefAttributes<HTMLAnchorElement>> | string;
		href?: string;
		target?: LinkTarget;
	} = {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		component: forwardRef((props, ref) => (
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			<Link {...props} to={item.url!} target={itemTarget} />
		))
	};
	if (item?.external) {
		listItemProps = { component: 'a', href: item.url, target: itemTarget };
	}

	const itemHandler = (id: string) => {
		dispatch(actions.activeComponent({ openComponent: id }));
		matchesMD && dispatch(actions.openComponentDrawer({ componentDrawerOpen: false }));
	};

	// active menu item on page load
	useEffect(() => {
		const currentIndex = document.location.pathname
			.toString()
			.split('/')
			.findIndex(id => id === item.id);
		if (currentIndex > -1) {
			dispatch(actions.activeComponent({ openComponent: item.id }));
		}
		// eslint-disable-next-line
	}, []);

	const textColor = theme.palette.mode === 'dark' ? 'grey.400' : 'text.primary';
	const iconSelectedColor = theme.palette.mode === 'dark' ? 'text.primary' : 'primary.main';

	return (
		<ListItemButton
			{...listItemProps}
			disabled={item.disabled}
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			onClick={() => itemHandler(item.id!)}
			selected={openComponent === item.id}
			sx={{
				pl: 4,
				py: 1,
				mb: 0.5,
				'&:hover': {
					bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'primary.lighter'
				},
				'&.Mui-selected': {
					bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'primary.lighter',
					borderRight: `2px solid ${theme.palette.primary.main}`,
					'&:hover': {
						bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'primary.lighter'
					}
				}
			}}>
			<ListItemText
				primary={
					<Typography
						variant="h6"
						sx={{ color: openComponent === item.id ? iconSelectedColor : textColor }}>
						{item.title}
					</Typography>
				}
			/>
			{item.chip && (
				<Chip
					color={item.chip.color}
					variant={item.chip.variant}
					size={item.chip.size}
					label={item.chip.label}
					avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
				/>
			)}
		</ListItemButton>
	);
};

export default NavItem;
