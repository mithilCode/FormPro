// material-ui
import { Grid } from '@mui/material';

import TendersList from './sections/Tenders';

// ================================|| State ||================================ //

const Tenders = () => {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<TendersList />
			</Grid>
		</Grid>
	);
};

export default Tenders;
