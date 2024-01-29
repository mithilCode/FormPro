import { Link } from 'react-router-dom';
// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// assets
import construction from '@assets/images/maintenance/under-construction.svg';

// ==============================|| REGISTER SUCCESS - STATIC ||============================== //

function RegisterSuccess() {
	return (
		<Grid
			container
			spacing={4}
			direction="column"
			alignItems="center"
			justifyContent="center"
			sx={{ minHeight: '100vh', py: 2 }}>
			<Grid item xs={12}>
				<Box sx={{ width: { xs: 300, sm: 480 } }}>
					<img
						src={construction}
						alt="mantis"
						style={{ width: '100%', height: 'auto' }}
					/>
				</Box>
			</Grid>
			<Grid item xs={12}>
				<Stack spacing={2} justifyContent="center" alignItems="center">
					<Typography align="center" variant="h1">
						Register Success
					</Typography>
					<Typography color="textSecondary" align="center" sx={{ width: '85%' }}>
						Hey! Please check out your email.
					</Typography>
					<Button component={Link} to="/login" variant="contained">
						Login
					</Button>
				</Stack>
			</Grid>
		</Grid>
	);
}

export default RegisterSuccess;
