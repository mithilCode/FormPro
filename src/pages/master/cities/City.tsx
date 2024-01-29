// material-ui
import { Grid } from '@mui/material';

import MainCard from '@components/MainCard';

import CityMst from './sections/City';

// ================================|| REGISTER ||================================ //

const City = ({ ...rest }) => {
	return (
		<MainCard>
			<Grid container>
				<Grid item xs={12}>
					<CityMst {...rest} />
				</Grid>
			</Grid>
		</MainCard>
	);
};

export default City;
