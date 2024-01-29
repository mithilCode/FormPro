// material-ui
import { Grid } from '@mui/material';

import MainCard from '@components/MainCard';

import StateMst from './sections/State';

// ================================|| REGISTER ||================================ //

const State = ({ ...rest }) => {
	return (
		<MainCard>
			<Grid container>
				<Grid item xs={12}>
					<StateMst {...rest} />
				</Grid>
			</Grid>
		</MainCard>
	);
};

export default State;
