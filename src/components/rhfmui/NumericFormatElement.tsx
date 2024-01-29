import { forwardRef, ReactNode } from 'react';
import { Control, Controller, ControllerProps, FieldError, Path } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/fields';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';

import { useFormError } from './FormErrorProvider';

export type NumericFormatElementProps<T extends FieldValues = FieldValues> = Omit<
	TextFieldProps,
	'name'
> & {
	validation?: ControllerProps['rules'];
	name: Path<T>;
	// thousandSeparator?: string | boolean | undefined;
	parseError?: (error: FieldError) => ReactNode;
	control?: Control<T>;
	myCustomProps?: Omit<NumericFormatProps, 'name'>;
	prefix?: string;
	suffix?: string;
	/**
	 * You override the MUI's TextField component by passing a reference of the component you want to use.
	 *
	 * This is especially useful when you want to use a customized version of TextField.
	 */
	component?: typeof TextField;
};

// type CalendarEvent = {
// 	title: string;
// 	start: Date;
// 	end: Date;
// };

// const inputProps = {
// 	step: 300,
// 	testProps: 'hello'
// };

interface CustomProps {
	onChange: (event: { target: { name: string; value?: number } }) => void;
	name: string;
	myCustomProps?: Omit<NumericFormatProps, 'name'>;
}

// type TypeB = Pick<NumericFormatElementProps, 'thousandSeparator' | 'name'> & CustomProps;
// type TypeB = CalendarEvent extends CustomProps;

export const CurrencyNumericFormat = forwardRef<NumericFormatProps, CustomProps>(
	function NumberFormatCustom(props, ref) {
		const { onChange, myCustomProps, ...other } = props;

		console.log('PROPSSP', props);
		console.log('HIII', myCustomProps);

		return (
			<NumericFormat
				{...other}
				getInputRef={ref}
				onValueChange={values => {
					onChange({
						target: {
							name: props.name,
							value: values.floatValue
						}
					});
				}}
				{...myCustomProps}
				// thousandSeparator={
				// 	customeprops.thousandSeparator ? customeprops.thousandSeparator : ''
				// }
				valueIsNumericString
			/>
		);
	}
);

// const InputText = forwardRef<NumericFormatProps, CustomProps>((props, ref) => (
// 	<input getInputRef={ref} {...props} />
// ));

export default function NumericFormatElement<TFieldValues extends FieldValues = FieldValues>({
	validation = {},
	parseError,
	type,
	required,
	name,
	control,
	// thousandSeparator,
	component: TextFieldComponent = TextField,
	myCustomProps,
	prefix,
	suffix,
	...rest
}: NumericFormatElementProps<TFieldValues>): JSX.Element {
	const errorMsgFn = useFormError();
	const customErrorFn = parseError || errorMsgFn;
	if (required && !validation.required) {
		validation.required = 'This field is required';
	}

	// if (type === 'email' && !validation.pattern) {
	// 	validation.pattern = {
	// 		value:
	// 			// eslint-disable-next-line no-useless-escape
	// 			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	// 		message: 'Please enter a valid email address'
	// 	};
	// }

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
					onChange={ev => {
						onChange(ev.target.value);
						if (typeof rest.onChange === 'function') {
							rest.onChange(ev);
						}
					}}
					onBlur={onBlur}
					required={required}
					type={type}
					InputProps={{
						inputComponent: CurrencyNumericFormat as any,
						startAdornment: prefix && (
							<InputAdornment position="start">{prefix}</InputAdornment>
						),
						endAdornment: suffix && (
							<InputAdornment position="end">{suffix}</InputAdornment>
						)
					}}
					inputProps={{
						myCustomProps
					}}
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

// LEARN https://stackblitz.com/edit/react-6yoi8s?file=demo.tsx,FormCurrencyField.tsx
// https://codesandbox.io/s/custominput-demo-u3wg9m?from-embed=&file=/src/App.js:538-690
