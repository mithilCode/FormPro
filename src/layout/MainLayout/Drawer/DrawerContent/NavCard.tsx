// material-ui
import { Button, CardMedia, Link, Stack, Typography } from '@mui/material';

// assets
import avatar from '@assets/images/users/avatar-group.png';
// project import
import AnimateButton from '@components/@extended/AnimateButton';
import MainCard from '@components/MainCard';

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

const NavCard = () => (
	<MainCard sx={{ bgcolor: 'grey.50', m: 3 }}>
		<Stack alignItems="center" spacing={2.5}>
			<CardMedia component="img" image={avatar} />
			<Stack alignItems="center">
				<Typography variant="h5">Help?</Typography>
				<Typography variant="h6" color="secondary">
					Get to resolve query
				</Typography>
			</Stack>
			<AnimateButton>
				<Button
					variant="shadow"
					size="small"
					component={Link}
					href="https://codedthemes.support-hub.io/"
					target="_blank">
					Support
				</Button>
			</AnimateButton>
		</Stack>
	</MainCard>
);

export default NavCard;
