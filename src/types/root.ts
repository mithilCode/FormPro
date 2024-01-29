import { ComponentClass, FunctionComponent } from 'react';
// material-ui
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

// // types
// // import { AuthProps } from './auth';
// // import { CalendarProps } from './calendar';
// import { MenuProps } from './menu';
// import { SnackbarProps } from './snackbar';
// // import { KanbanStateProps } from './kanban';
// // import { InvoiceProps } from './invoice';

// // ==============================|| ROOT TYPES  ||============================== //

// export type RootStateProps = {
// 	// 	auth: AuthProps;
// 	// 	calendar: CalendarProps;
// 	menu: MenuProps;
// 	snackbar: SnackbarProps;
// 	// 	kanban: KanbanStateProps;
// 	// 	invoice: InvoiceProps;
// };

export type KeyedObject = {
	[key: string]: string | number | KeyedObject | any;
};

export type OverrideIcon =
	// eslint-disable-next-line @typescript-eslint/ban-types
	| (OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
			muiName: string;
	  })
	| ComponentClass<any>
	| FunctionComponent<any>;

export interface GenericCardProps {
	title?: string;
	primary?: string | number | undefined;
	secondary?: string;
	content?: string;
	image?: string;
	dateTime?: string;
	iconPrimary?: OverrideIcon;
	color?: string;
	size?: string;
}