import { useState } from 'react';

import { ConfirmProvider } from 'material-ui-confirm';

// load mock apis
// import './_api';
import Snackbar from '@components/@extended/Snackbar';
import Loader from '@components/Loader';
import Locales from '@components/Locales';
import RTLLayout from '@components/RTLLayout';
import ScrollTop from '@components/ScrollTop';
import Notistack from '@components/third-party/Notistack';
// auth-provider
import { JWTProvider as AuthProvider } from '@contexts/JWTContext';
// project import
import Routes from '@routes';
import ThemeCustomization from '@themes';

// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { fetchDashboard } from './store/reducers/menu';
// import { dispatch } from './store';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
	const [loading] = useState<boolean>(true); // setLoading

	// useEffect(() => {
	// 	dispatch(fetchDashboard()).then(() => {
	// 		setLoading(true);
	// 	});
	// }, []);

	if (!loading) return <Loader />;

	return (
		<ThemeCustomization>
			<RTLLayout>
				<Locales>
					<ScrollTop>
						<ConfirmProvider>
							<AuthProvider>
								<>
									<Notistack>
										<Routes />
										<Snackbar />
									</Notistack>
								</>
							</AuthProvider>
						</ConfirmProvider>
					</ScrollTop>
				</Locales>
			</RTLLayout>
		</ThemeCustomization>
	);
};

export default App;

// // ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

// const App = () => {
// 	return <div>Hello Wel come to React 18 !</div>;
// };

// export default App;
