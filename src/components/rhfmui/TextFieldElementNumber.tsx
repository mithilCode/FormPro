import { ReactNode } from 'react';
import { Control, Controller, ControllerProps, FieldError, Path } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/fields';
import { TextField, TextFieldProps } from '@mui/material';

import { useFormError } from './FormErrorProvider';

export type TextFieldElementProps<T extends FieldValues = FieldValues> = Omit<
	TextFieldProps,
	'name'
> & {
	validation?: ControllerProps['rules'];
	name: Path<T>;
	parseError?: (error: FieldError) => ReactNode;
	control?: Control<T>;
	/**
	 * You override the MUI's TextField component by passing a reference of the component you want to use.
	 *
	 * This is especially useful when you want to use a customized version of TextField.
	 */
	component?: typeof TextField;
};

export default function TextFieldElementNumber<TFieldValues extends FieldValues = FieldValues>({
	validation = {},
	parseError,
	type,
	required,
	name,
	control,
	component: TextFieldComponent = TextField,
	...rest
}: TextFieldElementProps<TFieldValues>): JSX.Element {
	const errorMsgFn = useFormError();
	const customErrorFn = parseError || errorMsgFn;
	if (required && !validation.required) {
		validation.required = 'This field is required';
	}

	if (type === 'email' && !validation.pattern) {
		validation.pattern = {
			value:
				// eslint-disable-next-line no-useless-escape
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			message: 'Please enter a valid email address'
		};
	}

	return (
		<Controller
			name={name}
			control={control as any}
			rules={validation}
			render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
				<TextFieldComponent
					{...rest}
					name={name}
					value={value ?? ''}
					// value={type === 'number' && typeof value === 'number' ? value : value ?? ''}
					onChange={ev => {
						onChange(
							type === 'number' && ev.target.value
								? +ev.target.value
								: ev.target.value.toUpperCase()
						);
						if (typeof rest.onChange === 'function') {
							rest.onChange(ev);
						}
					}}
					//onBlur={onBlur}
					onBlur={ev => {
						if (type === 'number') {
							onChange(parseFloat(ev.target.value).toFixed(2));
						}
					}}
					required={required}
					type={type}
					error={!!error}
					helperText={
						error
							? typeof customErrorFn === 'function'
								? customErrorFn(error)
								: error.message
							: rest.helperText
					}
					inputRef={ref}
				/>
			)}
		/>
	);
}
