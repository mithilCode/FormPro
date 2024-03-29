import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project import
import { APP_DEFAULT_PATH } from '@app/config';
// types
// import { GuardProps } from 'types/auth';
import { GuardProps } from '@app/store/slice/auth/types';
import useAuth from '@hooks/useAuth';

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }: GuardProps) => {
	const { isLoggedIn } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (isLoggedIn) {
			navigate(location?.state?.from ? location?.state?.from : APP_DEFAULT_PATH, {
				state: {
					from: ''
				},
				replace: true
			});
		}
	}, [isLoggedIn, navigate, location]);

	return children;
};

export default GuestGuard;
