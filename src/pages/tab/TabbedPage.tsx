import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './tabbedPage.css';
import { menuItem } from '@layout/MainLayout/Drawer/CustMenu/data';

const TabbedPageContainer = () => {
	const location = useLocation();
	const [openPages, setOpenPages] = useState<any>([]);
	const [prevOpenPages, setPrevOpenPages] = useState<any>([]);

	useEffect(() => {
		const storedPages = localStorage.getItem('prevPages');
		const prevPages = storedPages ? JSON.parse(storedPages) : [];

		if (!prevPages.includes(location.pathname)) {
			setPrevOpenPages([...prevPages, location.pathname]);
		} else {
			setPrevOpenPages(prevPages);
		}

		setOpenPages(prevPages);
	}, [location.pathname]);

	useEffect(() => {
		localStorage.setItem('prevPages', JSON.stringify(prevOpenPages));
	}, [prevOpenPages]);

	const findCaptionByPath: any = (path: any) => {
		for (const menu of menuItem) {
			const foundCaption = findCaptionInMenu(menu, path);
			if (foundCaption) {
				return foundCaption;
			}
		}
		return path;
	};

	const findCaptionInMenu: any = (menu: any, path: any) => {
		if (menu.Url === path) {
			return menu.Caption;
		}
		for (const subMenu of menu.SubMenu) {
			const foundCaption = findCaptionInMenu(subMenu, path);
			if (foundCaption) {
				return foundCaption;
			}
		}
		return null;
	};

	const handlePageClose = (event: any, pagePath: any) => {
		setOpenPages(openPages.filter((page: any) => page !== pagePath));
		setPrevOpenPages(prevOpenPages.filter((page: any) => page !== pagePath));
	};

	return (
		<div>
			<div style={{ display: 'flex' }}>
				{prevOpenPages.slice(0, 6).map((pagePath: any) => (
					<div
						style={{ display: 'flex' }}
						className={`prev ${location.pathname === pagePath ? 'active' : ''}`}
						key={pagePath}>
						<img className="image" src={process.env.PUBLIC_URL + '/favicon.svg'} />
						<Link className="link" to={pagePath}>
							<div className="path">{findCaptionByPath(pagePath)} </div>
						</Link>
						<span className="cross" onClick={e => handlePageClose(e, pagePath)}>
							x
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default TabbedPageContainer;
