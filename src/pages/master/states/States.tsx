// material-ui
import { Grid } from '@mui/material';

import StatesList from './sections/States';

// ================================|| State ||================================ //

const States = () => {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<StatesList />
			</Grid>
		</Grid>
	);
};

export default States;
