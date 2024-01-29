// material-ui
import { Grid } from '@mui/material';

import CountriesList from './sections/Countries';

// ================================|| Country ||================================ //

const Countries = () => {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<CountriesList />
			</Grid>
		</Grid>
	);
};

export default Countries;
