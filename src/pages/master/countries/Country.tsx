// material-ui
import { Grid } from '@mui/material';

import MainCard from '@components/MainCard';

import CountryMst from './sections/Country';

// ================================|| REGISTER ||================================ //

const Country = ({ ...rest }) => {
	return (
		<MainCard>
			<Grid container>
				<Grid item xs={12}>
					<CountryMst {...rest} />
				</Grid>
			</Grid>
		</MainCard>
	);
};

export default Country;
