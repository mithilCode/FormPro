import { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';

const TextFieldEditor = (props: any) => {
	const inputRef = useRef<any>(null);
	// const [state, setState] = useState({selected: ""})
	const [state, setState] = useState<any>('');

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { editorProps, ...params } = props;

	// const editorPropsStyle = editorProps ? editorProps.style : null;

	useEffect(() => {
		// props.onTest && props.onTest.setTest(true)

		if (props.value && props.value !== '') {
			setState(props.value);
		} else if (props.editorConfig && props.editorConfig.value !== '') {
			setState(props.editorConfig.value);
		}
		const timeout = setTimeout(() => {
			inputRef.current.focus();
		}, 100);

		return () => {
			// props.onTest &&  props.onTest.setTest(false)
			clearTimeout(timeout);
		};
	}, []);

	const handleKeyDown = (event: any) => {
		// console.log('In Control User pressed: ', event.key, event.target.value);

		if (event.key === 'Enter') {
			if (props.onComplete) {
				props.onEnterNavigation(true, 0, event);
			}
		}

		// if (event.key === 'Enter') {
		// 	// 👇️ your logic here
		// 	console.log('Textfiels Control Enter key pressed ✅', props);
		// 	// props.onComplete && props.onComplete(state);
		// 	// setTimeout(props.onComplete, 0);
		// 	props.onComplete && props.onComplete();

		// 	// if (!props.lastCell) {
		// 	const timeout = setTimeout(() => {
		// 		event.preventDefault();
		// 		props.onTabNavigation && props.onTabNavigation(true, 0); //event.shiftKey ? -1 : 1
		// 		clearTimeout(timeout);
		// 	}, 100);
		// 	// }
		// }

		if (event.key === 'Escape') {
			if (props.onCancel) {
				props.onCancel(event);
			}
		}

		// if (event.key === 'Escape') {
		// 	// 👇️ your logic here
		// 	// console.log('In Control Escape key pressed ✅');
		// 	props.onCancel && props.onCancel(event);
		// 	// event.preventDefault()
		// 	// event.stopPropagation()
		// }

		if (event.key === 'Tab') {
			event.preventDefault();
			props.onTabNavigation(true, 0, event);
		}

		// if (event.key === 'Tab') {
		// 	event.preventDefault();
		// 	props.onTabNavigation && props.onTabNavigation(true, 0); //event.shiftKey ? -1 : 1
		// }
	};

	const handleChange = (event: any) => {
		event.preventDefault();
		// event.stopPropagation()
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
				// {...params}
				// sx={{ height: 40 }}
				// size="large"
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
				// type="text"

				placeholder={props.placeholder}
				inputRef={inputRef}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				onBlur={props.onComplete}
				onFocus={event => {
					event.target.select();
				}}
				inputProps={{
					...params.inputProps,
					maxLength: editorProps.maxLength,
					autoComplete: 'off',
					style: {
						height: 15 //props.cellProps.rowHeight
					}
				}}
			/>
		</div>
	);
};

export default TextFieldEditor;
