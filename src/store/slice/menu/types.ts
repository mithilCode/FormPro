import { ReactNode } from 'react';
// material-ui
import { ChipProps } from '@mui/material';

import { GenericCardProps } from 'types/root';

// ==============================|| MENU TYPES  ||============================== //

export type NavItemType = {
	breadcrumbs?: boolean;
	caption?: ReactNode | string;
	children?: NavItemType[];
	elements?: NavItemType[];
	chip?: ChipProps;
	color?: 'primary' | 'secondary' | 'default' | undefined;
	disabled?: boolean;
	external?: boolean;
	icon?: GenericCardProps['iconPrimary'] | string;
	id?: string;
	search?: string;
	target?: boolean;
	title?: ReactNode | string;
	type?: string;
	url?: string | undefined;
};

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

/* --- STATE --- */
export type menuState = {
	openItem: string[];
	openComponent: string;
	selectedID: string | null;
	drawerOpen: boolean;
	componentDrawerOpen: boolean;
	menuDashboard: NavItemType;
	error: null;
};

export type ContainerState = menuState;
