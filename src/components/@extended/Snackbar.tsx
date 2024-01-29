import { SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// material-ui
import { Alert, Button, Fade, Grow, Slide, SlideProps } from '@mui/material';
import MuiSnackbar from '@mui/material/Snackbar';
// assets
import { CloseOutlined } from '@ant-design/icons';

import { KeyedObject } from 'types/root'; // RootStateProps

import { useSnackBarSlice } from '@app/store/slice/snackbar';
// import { closeSnackbar } from '../../store/reducers/snackbar';
import { snackBarSelector } from '@app/store/slice/snackbar/snackbar.selectors';

// project import
import IconButton from './IconButton';

// animation function
function TransitionSlideLeft(props: SlideProps) {
	return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props: SlideProps) {
	return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props: SlideProps) {
	return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props: SlideProps) {
	return <Slide {...props} direction="down" />;
}

function GrowTransition(props: SlideProps) {
	return <Grow {...props} />;
}

// animation options
const animation: KeyedObject = {
	SlideLeft: TransitionSlideLeft,
	SlideUp: TransitionSlideUp,
	SlideRight: TransitionSlideRight,
	SlideDown: TransitionSlideDown,
	Grow: GrowTransition,
	Fade
};

// ==============================|| SNACKBAR ||============================== //

const Snackbar = () => {
	const dispatch = useDispatch();
	const { actions } = useSnackBarSlice();
	// const snackbar = useSelector((state: RootStateProps) => state.snackbar);
	const snackbar = useSelector(snackBarSelector);

	const { actionButton, anchorOrigin, alert, close, message, open, transition, variant } =
		snackbar;

	const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		dispatch(actions.closeSnackbar());
	};

	return (
		<>
			{/* default snackbar */}
			{variant === 'default' && (
				<MuiSnackbar
					anchorOrigin={anchorOrigin}
					open={open}
					autoHideDuration={6000}
					onClose={handleClose}
					message={message}
					TransitionComponent={animation[transition]}
					action={
						<>
							<Button color="secondary" size="small" onClick={handleClose}>
								UNDO
							</Button>
							<IconButton
								size="small"
								aria-label="close"
								color="inherit"
								onClick={handleClose}
								sx={{ mt: 0.25 }}>
								<CloseOutlined />
							</IconButton>
						</>
					}
				/>
			)}

			{/* alert snackbar */}
			{variant === 'alert' && (
				<MuiSnackbar
					TransitionComponent={animation[transition]}
					anchorOrigin={anchorOrigin}
					open={open}
					autoHideDuration={6000}
					onClose={handleClose}>
					<Alert
						variant={alert.variant}
						color={alert.color}
						action={
							<>
								{actionButton !== false && (
									<Button color={alert.color} size="small" onClick={handleClose}>
										UNDO
									</Button>
								)}
								{close !== false && (
									<IconButton
										sx={{ mt: 0.25 }}
										size="small"
										aria-label="close"
										variant="contained"
										color={alert.color}
										onClick={handleClose}>
										<CloseOutlined />
									</IconButton>
								)}
							</>
						}
						sx={{
							...(alert.variant === 'outlined' && {
								bgcolor: 'grey.0'
							})
						}}>
						{message}
					</Alert>
				</MuiSnackbar>
			)}
		</>
	);
};

export default Snackbar;
