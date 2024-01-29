// import { ReactNode } from 'react';
// import { Control, Controller, ControllerProps, FieldError, Path } from 'react-hook-form';
// import { FieldValues } from 'react-hook-form/dist/types/fields';
// import { TextFieldProps } from '@mui/material';
// import {
// 	DatePicker,
// 	DatePickerProps,
// 	DatePickerSlotsComponentsProps
// } from '@mui/x-date-pickers/DatePicker';

// import { useFormError } from './FormErrorProvider';

// export type DatePickerElementProps<T extends FieldValues, TInputDate, TDate = TInputDate> = Omit<
// 	DatePickerProps<TDate>,
// 	'value' | 'slotProps'
// > & {
// 	name: Path<T>;
// 	required?: boolean;
// 	isDate?: boolean;
// 	parseError?: (error: FieldError) => ReactNode;
// 	validation?: ControllerProps['rules'];
// 	control?: Control<T>;
// 	inputProps?: TextFieldProps;
// 	helperText?: TextFieldProps['helperText'];
// 	textReadOnly?: boolean;
// 	slotProps?: Omit<DatePickerSlotsComponentsProps<TDate>, 'textField'>;
// };

// export default function DatePickerElement<TFieldValues extends FieldValues>({
// 	parseError,
// 	name,
// 	required,
// 	validation = {},
// 	inputProps,
// 	control,
// 	textReadOnly,
// 	slotProps,
// 	...rest
// }: DatePickerElementProps<TFieldValues, any, any>): JSX.Element {
// 	const errorMsgFn = useFormError();
// 	const customErrorFn = parseError || errorMsgFn;
// 	if (required && !validation.required) {
// 		validation.required = 'This field is required';
// 	}

// 	return (
// 		<Controller
// 			name={name}
// 			rules={validation}
// 			control={control as any}
// 			defaultValue={null as any}
// 			render={({ field, fieldState: { error } }) => {
// 				if (field?.value && typeof field?.value === 'string') {
// 					field.value = new Date(field.value) as any; // need to see if this works for all localization adaptors
// 				}

// 				return (
// 					<DatePicker
// 						{...rest}
// 						{...field}
// 						ref={r => {
// 							field.ref(r?.querySelector('input'));
// 						}}
// 						onClose={(...args) => {
// 							field.onBlur();
// 							if (rest.onClose) {
// 								rest.onClose(...args);
// 							}
// 						}}
// 						onChange={(v, keyboardInputValue) => {
// 							// console.log(v, keyboardInputValue)
// 							field.onChange(v, keyboardInputValue);
// 							if (typeof rest.onChange === 'function') {
// 								rest.onChange(v, keyboardInputValue);
// 							}
// 						}}
// 						slotProps={{
// 							...slotProps,
// 							textField: {
// 								...inputProps,
// 								required,
// 								error: !!error,
// 								helperText: error
// 									? typeof customErrorFn === 'function'
// 										? customErrorFn(error)
// 										: error.message
// 									: inputProps?.helperText || rest.helperText,
// 								inputProps: {
// 									readOnly: !!textReadOnly,
// 									...inputProps?.inputProps
// 								}
// 							}
// 						}}
// 					/>
// 				);
// 			}}
// 		/>
// 	);
// }

import { Control, Controller, ControllerProps, FieldError, Path } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/fields';
import { TextFieldProps } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
	DatePicker,
	DatePickerProps,
	DatePickerSlotsComponentsProps
} from '@mui/x-date-pickers/DatePicker';

import { useFormError } from './FormErrorProvider';

export type DatePickerElementProps<T extends FieldValues, TInputDate, TDate = TInputDate> = Omit<
	DatePickerProps<TDate>,
	'value' | 'slotProps'
> & {
	name: Path<T>;
	required?: boolean;
	isDate?: boolean;
	parseError?: (error: FieldError) => string;
	validation?: ControllerProps['rules'];
	control?: Control<T>;
	inputProps?: TextFieldProps;
	helperText?: TextFieldProps['helperText'];
	textReadOnly?: boolean;
	slotProps?: Omit<DatePickerSlotsComponentsProps<TDate>, 'textField1'>;
};

export default function DatePickerElement<TFieldValues extends FieldValues>({
	parseError,
	name,
	required,
	validation = {},
	inputProps,
	control,
	textReadOnly,
	slotProps,
	...rest
}: DatePickerElementProps<TFieldValues, any, any>): JSX.Element {
	const errorMsgFn = useFormError();
	const customErrorFn = parseError || errorMsgFn;
	if (required && !validation.required) {
		validation.required = 'This field is required';
	}

	return (
		<Controller
			name={name}
			rules={validation}
			control={control as any}
			defaultValue={null as any}
			render={({ field, fieldState: { error } }) => {
				if (field?.value && typeof field?.value === 'string') {
					field.value = new Date(field.value) as any; // need to see if this works for all localization adaptors
				}

				return (
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							{...rest}
							{...field}
							ref={r => {
								field.ref(r?.querySelector('input'));
							}}
							onClose={(...args) => {
								field.onBlur();
								if (rest.onClose) {
									rest.onClose(...args);
								}
							}}
							onChange={(v, keyboardInputValue) => {
								// console.log(v, keyboardInputValue)
								field.onChange(v, keyboardInputValue);
								if (typeof rest.onChange === 'function') {
									rest.onChange(v, keyboardInputValue);
								}
							}}
							slotProps={{
								...slotProps,
								textField: {
									...inputProps,
									required,
									error: !!error,
									helperText: error
										? typeof customErrorFn === 'function'
											? customErrorFn(error)
											: error.message
										: inputProps?.helperText || rest.helperText,
									inputProps: {
										readOnly: !!textReadOnly,
										...inputProps?.inputProps
									}
								}
							}}
						/>
					</LocalizationProvider>
				);
			}}
		/>
	);
}
