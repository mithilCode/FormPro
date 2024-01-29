// material-ui
import { Grid } from '@mui/material';

import MainCard from '@components/MainCard';

import TenderMst from './sections/Tender';

// ================================|| REGISTER ||================================ //

const Tender = ({ ...rest }) => {
	return (
		<MainCard>
			<Grid container>
				<Grid item xs={12}>
					<TenderMst {...rest} />
				</Grid>
			</Grid>
		</MainCard>
	);
};

export default Tender;
