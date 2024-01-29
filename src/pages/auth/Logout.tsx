import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

// project import
// import { useAuthSlice } from '@app/store/slice/auth';
import useAuth from '@hooks/useAuth';

// import { logoutUser } from '../../../auth/store/userSlice';
// import { actions as otpAction } from '../store/otpSlice';

const Logout = () => {
	// const dispatch = useDispatch();
	// const { actions } = useAuthSlice();

	const { logout } = useAuth();

	const location = useLocation();

	useEffect(() => {
		if (location.search === '?expired') {
			// dispatch(logout());
			logout('/sendotp');

			// dispatch(otpAction.sendOtpType('Login'));
			// dispatch(logoutUser('/sendotp'));
		} else {
			logout();
			// dispatch(logoutUser());
		}
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		return () => {};
	}, []);

	return <div className="w-full">Logout</div>;
};

export default Logout;
