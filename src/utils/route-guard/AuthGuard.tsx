import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// types
// import { GuardProps } from 'types/auth';
import { GuardProps } from '@app/store/slice/auth/types';
// project import
import useAuth from '@hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }: GuardProps) => {
	const { isLoggedIn } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('login', {
				state: {
					from: location.pathname
				},
				replace: true
			});
		}
	}, [isLoggedIn, navigate, location]);

	return children;
};

export default AuthGuard;
