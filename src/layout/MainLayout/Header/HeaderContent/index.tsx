import { useMemo } from 'react';
// material-ui
import { Box, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';

// type
import { LAYOUT_CONST } from 'types/config';

// project import
import useConfig from '@hooks/useConfig';
import DrawerHeader from '@layout/MainLayout/Drawer/DrawerHeader';

import Customization from './Customization';
import Localization from './Localization';
import MegaMenuSection from './MegaMenuSection';
import Message from './Message';
import MobileSection from './MobileSection';
import Notification from './Notification';
import Profile from './Profile';
import Search from './Search';
import TabbedPageContainer from '@pages/tab/TabbedPage';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
	const { i18n, menuOrientation } = useConfig();

	const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const localization = useMemo(() => <Localization />, [i18n]);

	const megaMenu = useMemo(() => <MegaMenuSection />, []);
	console.log(localization, megaMenu, Message);

	return (
		<>
			{menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG && (
				<DrawerHeader open={true} />
			)}
			{!downLG && <Search />}

			{/* <TabbedPageContainer /> */}
			{/* {!downLG && megaMenu}
			{!downLG && localization} */}
			{downLG && <Box sx={{ width: '100%', ml: 1 }} />}

			<Notification />
			{/* <Message /> */}
			<Customization />
			{!downLG && <Profile />}
			{downLG && <MobileSection />}
		</>
	);
};

export default HeaderContent;
