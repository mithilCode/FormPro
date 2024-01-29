import { FormEventHandler, FormHTMLAttributes, PropsWithChildren, useRef } from 'react';
import {
	FormProvider,
	SubmitErrorHandler,
	SubmitHandler,
	useForm,
	UseFormProps,
	UseFormReturn
} from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/fields';

// import useFocusOnEnter from '@hooks/useFocusOnEnter';

export type FormContainerProps<T extends FieldValues = FieldValues> = PropsWithChildren<
	UseFormProps<T> & {
		onSuccess?: SubmitHandler<T>;
		onError?: SubmitErrorHandler<T>;
		FormProps?: FormHTMLAttributes<HTMLFormElement>;
		handleSubmit?: FormEventHandler<HTMLFormElement>;
		formContext?: UseFormReturn<T>;
		tableRef?: any;
	}
>;

export default function FormContainer<TFieldValues extends FieldValues = FieldValues>({
	handleSubmit,
	children,
	FormProps,
	formContext,
	onSuccess,
	onError,
	tableRef,
	...useFormProps
}: PropsWithChildren<FormContainerProps<TFieldValues>>) {
	if (!formContext) {
		return (
			<FormProviderWithoutContext<TFieldValues>
				{...{ onSuccess, onError, FormProps, children, ...useFormProps }}
			/>
		);
	}
	if (typeof onSuccess === 'function' && typeof handleSubmit === 'function') {
		console.warn('Property `onSuccess` will be ignored because handleSubmit is provided');
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const form = useRef();
	// eslint-disable-next-line react-hooks/rules-of-hooks
	// const { onEnterKey } = useFocusOnEnter(form, formContext.formState.errors, tableRef, child);

	return (
		<FormProvider {...formContext}>
			<form
				noValidate
				ref={form as any}
				// onKeyUp={event => onEnterKey(event)}
				{...FormProps}
				onSubmit={
					handleSubmit
						? handleSubmit
						: onSuccess
						? formContext.handleSubmit(onSuccess, onError)
						: () => console.log('submit handler `onSuccess` is missing')
				}>
				{children}
			</form>
		</FormProvider>
	);
}

function FormProviderWithoutContext<TFieldValues extends FieldValues = FieldValues>({
	onSuccess,
	onError,
	FormProps,
	children,
	...useFormProps
}: PropsWithChildren<FormContainerProps<TFieldValues>>) {
	const methods = useForm<TFieldValues>({
		...useFormProps
	});
	const { handleSubmit } = methods;

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={handleSubmit(
					onSuccess
						? onSuccess
						: () => console.log('submit handler `onSuccess` is missing'),
					onError
				)}
				noValidate
				{...FormProps}>
				{children}
			</form>
		</FormProvider>
	);
}
