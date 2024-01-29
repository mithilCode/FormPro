// import {
// 	LocalizationProvider,
// 	LocalizationProviderProps,
// 	MuiPickersAdapter
// } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// export type DateFnsProviderProps<TDate> = Omit<
// 	LocalizationProviderProps<TDate, any>,
// 	'dateAdapter'
// > & {
// 	dateAdapter?: new (...args: any) => MuiPickersAdapter<TDate>;
// };

// export default function DateFnsProvider({ children, ...props }: DateFnsProviderProps<Date>) {
// 	const { dateAdapter, ...localizationProps } = props;
// 	return (
// 		<LocalizationProvider dateAdapter={dateAdapter || AdapterDateFns} {...localizationProps}>
// 			{children}
// 		</LocalizationProvider>
// 	);
// }

import {
	LocalizationProvider,
	LocalizationProviderProps,
	MuiPickersAdapter
} from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export type DateFnsProviderProps<TDate> = Omit<
	LocalizationProviderProps<TDate, any>,
	'dateAdapter'
> & {
	dateAdapter?: new (...args: any) => MuiPickersAdapter<TDate>;
};

export default function DateFnsProvider({ children, ...props }: any) {
	// const { dateAdapter, ...localizationProps } = props;
	const { ...localizationProps } = props;
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} {...localizationProps}>
			{children}
		</LocalizationProvider>
		// <LocalizationProvider dateAdapter={dateAdapter || AdapterDayjs} {...localizationProps}>
		// 	{children}
		// </LocalizationProvider>
	);
}
