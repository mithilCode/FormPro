// material-ui
//import { Grid, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import {
	Grid,
	Typography,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell
} from '@mui/material';
// project import
import MainCard from '@components/MainCard';

// ==============================|| PAGE VIEWS BY PAGE TITLE ||============================== //

function PageViews() {
	return (
		<>
			<Grid container alignItems="center" justifyContent="space-between">
				<Grid item>
					<Typography variant="h5">Stock</Typography>
				</Grid>
				<Grid item />
			</Grid>
			<MainCard sx={{ mt: 2 }} content={false}>
				<TableContainer>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell>Dept Name</TableCell>
								<TableCell>Pcs</TableCell>
								<TableCell>Cts</TableCell>
							</TableRow>
						</TableHead>
						<TableRow>
							<TableCell>Stock Dept</TableCell>
							<TableCell>500</TableCell>
							<TableCell>1050.50</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Galaxy Dept</TableCell>
							<TableCell>600</TableCell>
							<TableCell>1050.50</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Planning Dept</TableCell>
							<TableCell>700</TableCell>
							<TableCell>1150.50</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Laser Sawing Dept</TableCell>
							<TableCell>800</TableCell>
							<TableCell>1250.50</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Blocking Dept</TableCell>
							<TableCell>900</TableCell>
							<TableCell>1350.50</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Dasa Dept</TableCell>
							<TableCell>1000</TableCell>
							<TableCell>1450.50</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Mbox Dept</TableCell>
							<TableCell>1100</TableCell>
							<TableCell>1550.50</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Manufacturing Dept</TableCell>
							<TableCell>1200</TableCell>
							<TableCell>1550.50</TableCell>
						</TableRow>
					</Table>
				</TableContainer>
				{/* <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
					<ListItemButton divider>
						<ListItemText
							primary={<Typography variant="subtitle1">Admin Home</Typography>}
							secondary={
								<Typography color="textSecondary" sx={{ display: 'inline' }}>
									/demo/admin/index.html
								</Typography>
							}
						/>
						<Stack alignItems="flex-end">
							<Typography variant="h5" color="primary">
								7755
							</Typography>
							<Typography variant="body2" color="textSecondary">
								31.74%
							</Typography>
						</Stack>
					</ListItemButton>
					<ListItemButton divider>
						<ListItemText
							primary={<Typography variant="subtitle1">Form Elements</Typography>}
							secondary={
								<Typography color="textSecondary" sx={{ display: 'inline' }}>
									/demo/admin/forms.html
								</Typography>
							}
						/>
						<Stack alignItems="flex-end">
							<Typography variant="h5" color="primary">
								5215
							</Typography>
							<Typography
								variant="body2"
								color="textSecondary"
								sx={{ display: 'block' }}>
								28.53%
							</Typography>
						</Stack>
					</ListItemButton>
					<ListItemButton divider>
						<ListItemText
							primary={<Typography variant="subtitle1">Utilities</Typography>}
							secondary={
								<Typography color="textSecondary" sx={{ display: 'inline' }}>
									/demo/admin/util.html
								</Typography>
							}
						/>
						<Stack alignItems="flex-end">
							<Typography variant="h5" color="primary">
								4848
							</Typography>
							<Typography
								variant="body2"
								color="textSecondary"
								sx={{ display: 'block' }}>
								25.35%
							</Typography>
						</Stack>
					</ListItemButton>
					<ListItemButton divider>
						<ListItemText
							primary={<Typography variant="subtitle1">Form Validation</Typography>}
							secondary={
								<Typography color="textSecondary" sx={{ display: 'inline' }}>
									/demo/admin/validation.html
								</Typography>
							}
						/>
						<Stack alignItems="flex-end">
							<Typography variant="h5" color="primary">
								3275
							</Typography>
							<Typography
								variant="body2"
								color="textSecondary"
								sx={{ display: 'block' }}>
								23.17%
							</Typography>
						</Stack>
					</ListItemButton>
					<ListItemButton divider>
						<ListItemText
							primary={<Typography variant="subtitle1">Modals</Typography>}
							secondary={
								<Typography color="textSecondary" sx={{ display: 'inline' }}>
									/demo/admin/modals.html
								</Typography>
							}
						/>
						<Stack alignItems="flex-end">
							<Typography variant="h5" color="primary">
								3003
							</Typography>
							<Typography
								variant="body2"
								color="textSecondary"
								sx={{ display: 'block' }}>
								22.21%
							</Typography>
						</Stack>
					</ListItemButton>
				</List> */}
			</MainCard>
		</>
	);
}
export default PageViews;
