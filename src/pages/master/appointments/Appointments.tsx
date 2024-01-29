// material-ui
import { Grid } from '@mui/material';

import AppointmentsList from './sections/Appointments';

// ================================|| Appointment ||================================ //

const Appointments = () => {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<AppointmentsList />
			</Grid>
		</Grid>
	);
};

export default Appointments;
