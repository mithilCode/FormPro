// material-ui
import { Grid } from '@mui/material';

import MainCard from '@components/MainCard';

import AppointmentMst from './sections/Appointment';

// ================================|| REGISTER ||================================ //

const Appointment = ({ ...rest }) => {
	return (
		<MainCard>
			<Grid container>
				<Grid item xs={12}>
					<AppointmentMst {...rest} />
				</Grid>
			</Grid>
		</MainCard>
	);
};

export default Appointment;
