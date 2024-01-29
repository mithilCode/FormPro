// material-ui
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// types
import { LAYOUT_CONST } from 'types/config';

import Logo from '@components/logo';
import useConfig from '@hooks/useConfig';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';

// ==============================|| DRAWER HEADER ||============================== //

interface Props {
	open: boolean;
}

const DrawerHeader = ({ open }: Props) => {
	const theme = useTheme();
	const downLG = useMediaQuery(theme.breakpoints.down('lg'));

	const { menuOrientation } = useConfig();
	const isHorizontal = menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG;

	return (
		<DrawerHeaderStyled
			theme={theme}
			open={open}
			sx={{
				minHeight: isHorizontal ? 'unset' : '60px',
				width: isHorizontal ? { xs: '100%', lg: '424px' } : 'inherit',
				paddingTop: isHorizontal ? { xs: '10px', lg: '0' } : '8px',
				paddingBottom: isHorizontal ? { xs: '18px', lg: '0' } : '8px',
				paddingLeft: isHorizontal ? { xs: '24px', lg: '0' } : open ? '24px' : 0
			}}>
			<Logo isIcon={!open} sx={{ width: open ? 'auto' : 35, height: 35 }} />
		</DrawerHeaderStyled>
	);
};

export default DrawerHeader;
