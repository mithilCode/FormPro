import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// load mock apis
import '_api';
// import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider } from '@contexts/ConfigContext';
import { configureAppStore } from '@store';

// project import
import App from './App';
import reportWebVitals from './reportWebVitals';

// scroll bar
import 'simplebar/dist/simplebar.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// apex-chart
import '@assets/third-party/apex-chart.css';
import '@assets/third-party/react-table.css';

const store = configureAppStore();

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

root.render(
	<ReduxProvider store={store}>
		<ConfigProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ConfigProvider>
	</ReduxProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// import { createRoot } from 'react-dom/client';
// // third-party
// import { Provider as ReduxProvider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import { PersistGate } from 'redux-persist/integration/react';

// // load mock apis
// // import '_api';
// import { ConfigProvider } from './contexts/ConfigContext';
// // project import
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { persister, store } from './store';

// // // scroll bar
// // import 'simplebar/src/simplebar.css';
// // import 'slick-carousel/slick/slick.css';
// // import 'slick-carousel/slick/slick-theme.css';
// // // apex-chart
// // import 'assets/third-party/apex-chart.css';
// // import 'assets/third-party/react-table.css';

// const container = document.getElementById('root') ?? null;
// // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// const root = createRoot(container!);

// // ==============================|| MAIN - REACT DOM RENDER  ||============================== //

// root.render(
// 	<ReduxProvider store={store}>
// 		<PersistGate loading={null} persistor={persister}>
// 			<ConfigProvider>
// 				<BrowserRouter>
// 					<App />
// 				</BrowserRouter>
// 			</ConfigProvider>
// 		</PersistGate>
// 	</ReduxProvider>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
