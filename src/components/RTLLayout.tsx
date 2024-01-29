import { ReactNode, useEffect } from 'react';
import createCache, { StylisPlugin } from '@emotion/cache';
// material-ui
import { CacheProvider } from '@emotion/react';
// project import
import useConfig from '@hooks/useConfig';
// third-party
// import rtlPlugin from 'stylis-plugin-rtl';

// ==============================|| RTL LAYOUT ||============================== //

interface Props {
	children: ReactNode;
}

const RTLLayout = ({ children }: Props) => {
	const { themeDirection } = useConfig();

	useEffect(() => {
		document.dir = themeDirection;
	}, [themeDirection]);

	const cacheRtl = createCache({
		key: themeDirection === 'rtl' ? 'rtl' : 'css',
		prepend: true,
		stylisPlugins: themeDirection === 'rtl' ? [] : [] // rtlPlugin as StylisPlugin
	});

	return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
};

export default RTLLayout;
