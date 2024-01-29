import { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const DDTextFieldEditor = (props: any) => {
	const inputRef = useRef<any>(null);
	const [state, setState] = useState<any>('');
	const [position, setPosition] = useState<any>({
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		width: 0
	});

	const elementRef = useRef<any>(null);

	const { editorProps, ...params } = props;

	useEffect(() => {
		if (typeof props.value === 'object') {
			if (props && props.value && props.value.name && props.value.name !== '') {
				setState(props.value.name);
			} else if (
				props &&
				props.editorConfig &&
				props.editorConfig &&
				props.editorConfig.value !== ''
			) {
				setState(props.editorConfig.value);
			}
		} else {
			if (props && props.value && props.value !== '') {
				setState(props.value);
			} else if (props && props.editorConfig && props.editorConfig.value !== '') {
				setState(props.editorConfig.value);
			}
		}
		const timeout = setTimeout(() => {
			inputRef.current.focus();
		}, 100);

		if (elementRef.current) {
			const rect = elementRef?.current?.getBoundingClientRect();
			setPosition({
				top: rect.top,
				right: rect.right,
				bottom: rect.bottom,
				left: rect.left,
				width: rect.width,
				x: rect.x,
				y: rect.y
			});
		}

		return () => {
			setState('');
			clearTimeout(timeout);
		};
	}, []);

	const handleKeyDown = (event: any) => {
		event.position = position;

		if (event.key === 'Enter') {
			if (props.onComplete) {
				props.onEnterNavigation(true, 0, event);
			}
		}

		if (event.key === 'Escape') {
			if (props.onCancel) {
				props.onCancel(event);
			}
		}
		if (event.key === 'Tab') {
			event.preventDefault();
			props.onTabNavigation(true, 0, event);
		}
	};

	const handleChange = (event: any) => {
		event.preventDefault();
		event.position = position;
		if (props.type === 'number' && event.target.value === '') {
			setState(null);
			props.onChange && props.onChange(null);
		} else {
			if (props.pattern === 'number') {
				setState(event.target.value.replace(/[^0-9*]/g, ''));
				props.onChange && props.onChange(event.target.value.replace(/[^0-9*]/g, ''));
			} else {
				setState(event.target.value.toUpperCase());
				props.onChange && props.onChange(event.target.value.toUpperCase());
			}
		}
	};

	return (
		<div
			className={
				'InovuaReactDataGrid__cell__editor InovuaReactDataGrid__cell__editor--select'
			}>
			<TextField
				ref={elementRef}
				sx={{
					'& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
						display: 'none'
					},
					'& input[type=number]': {
						MozAppearance: 'textfield'
					}
				}}
				fullWidth
				value={state || ''}
				type={props.type}
				placeholder={props.placeholder}
				inputRef={inputRef}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				onBlur={props.onComplete}
				onFocus={event => {
					event.target.select();
				}}
				InputProps={{
					endAdornment: <ArrowDropDownIcon fontSize="small" />
				}}
				inputProps={{
					...params.inputProps,
					maxLength: editorProps && editorProps.maxLength ? editorProps.maxLength : 1,
					autoComplete: 'off',
					style: {
						height: 15 //props.cellProps.rowHeight
					}
				}}
			/>
		</div>
	);
};

export default DDTextFieldEditor;
