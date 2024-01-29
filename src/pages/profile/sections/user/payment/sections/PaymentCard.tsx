import { PatternFormat } from 'react-number-format';
import { Box, FormControlLabel, Grid, Radio, Stack, Typography } from '@mui/material';
import { DeleteOutlined } from '@ant-design/icons';

import masterCard from '@assets/images/icons/master-card.png';
import visaCard from '@assets/images/icons/visa-card.png';
import IconButton from '@components/@extended/IconButton';
import MainCard from '@components/MainCard';

// ==============================|| PAYMENT - CARD ||============================== //

const PaymentCard = ({ card, handleCardRemove }: any) => {
	const { idCard, Name, Number, Type } = card;

	return (
		<MainCard content={false} boxShadow sx={{ cursor: 'pointer' }}>
			<Box sx={{ p: 2 }}>
				<FormControlLabel
					value={idCard}
					control={<Radio value={idCard} />}
					sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
					label={
						<Grid container justifyContent="space-between" alignItems="center">
							<Grid item>
								<Stack spacing={0.5} sx={{ ml: 1 }}>
									<Typography color="secondary">{Name}</Typography>
									<Typography variant="subtitle1">
										<PatternFormat
											value={Number.toString().substring(12)}
											displayType="text"
											type="text"
											format="**** **** **** ####"
										/>
									</Typography>
								</Stack>
							</Grid>
							<Grid item>
								<Stack
									direction="row"
									justifyContent="flex-end"
									alignItems="center"
									spacing={1}>
									<img
										src={Type === 'master' ? masterCard : visaCard}
										alt="payment card"
									/>
									<IconButton
										color="secondary"
										onClick={() => handleCardRemove(idCard)}>
										<DeleteOutlined />
									</IconButton>
								</Stack>
							</Grid>
						</Grid>
					}
				/>
			</Box>
		</MainCard>
	);
};

export default PaymentCard;
