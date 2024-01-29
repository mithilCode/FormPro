import { lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
// material-ui
import { Container, Toolbar } from '@mui/material';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import { useMenuSlice } from '@app/store/slice/menu';
import { menuSelector } from '@app/store/slice/menu/menu.selectors';

// project import
import ComponentLayout from './ComponentLayout';

//import { openComponentDrawer } from '../../store/reducers/menu';
// types
// import { RootStateProps } from 'types/root';
// import { RootState } from 'types/rootstate';

const Header = lazy(() => import('./Header'));
const FooterBlock = lazy(() => import('./FooterBlock'));

// ==============================|| Loader ||============================== //

const LoaderWrapper = styled('div')(({ theme }) => ({
	position: 'fixed',
	top: 0,
	left: 0,
	zIndex: 2001,
	width: '100%',
	'& > * + *': {
		marginTop: theme.spacing(2)
	}
}));

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoaderProps extends LinearProgressProps {}

const Loader = () => (
	<LoaderWrapper>
		<LinearProgress color="primary" />
	</LoaderWrapper>
);

// ==============================|| MINIMAL LAYOUT ||============================== //

const CommonLayout = ({ layout = 'blank' }: { layout?: string }) => {
	const dispatch = useDispatch();
	const { actions } = useMenuSlice();

	const menu = useSelector(menuSelector);

	// const menu = useSelector((state: RootState) => state.menu);
	const { componentDrawerOpen } = menu;

	const handleDrawerOpen = () => {
		dispatch(actions.openComponentDrawer({ componentDrawerOpen: !componentDrawerOpen }));
	};

	return (
		<>
			{(layout === 'landing' || layout === 'simple') && (
				<Suspense fallback={<Loader />}>
					<Header layout={layout} />
					<Outlet />
					<FooterBlock isFull={layout === 'landing'} />
				</Suspense>
			)}
			{layout === 'component' && (
				<Suspense fallback={<Loader />}>
					<Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
						<Header handleDrawerOpen={handleDrawerOpen} layout="component" />
						<Toolbar sx={{ my: 2 }} />
						<ComponentLayout
							handleDrawerOpen={handleDrawerOpen}
							componentDrawerOpen={componentDrawerOpen}
						/>
					</Container>
				</Suspense>
			)}
			{layout === 'blank' && <Outlet />}
		</>
	);
};

export default CommonLayout;
