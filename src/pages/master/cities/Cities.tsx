// material-ui
import { Grid } from '@mui/material';

import CitiesList from './sections/Cities';

// ================================|| City ||================================ //

const Cities = () => {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<CitiesList />
			</Grid>
		</Grid>
	);
};

export default Cities;
