import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '@mui/material';

const CheckBoxEditor = (props: any) => {
	const inputRef = useRef<any>();
	// const [state, setState] = React.useState(props.value);
	const [checked, setChecked] = useState(false);

	// const { editorProps } = props;
	// const editorPropsStyle = editorProps ? editorProps.style : null;

	useEffect(() => {
		if (props.value && props.value !== '') {
			if (props.value === 1 || props.value === '1' || props.value === true) {
				setChecked(true);
			}
			// setChecked(false);
			// setChecked(props.value);
		}
		const timeout = setTimeout(() => {
			inputRef.current.focus();
		}, 100);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	const handleKeyDown = (event: any) => {
		if (event.key === ' ') {
			// 👇️ your logic here
			// console.log('Checkbox space key pressed ✅');
			setChecked(event.target.checked);
			// if (checked) {
			// 	setChecked(false);
			// } else {
			// 	setChecked(true);
			// }

			props.onChange && props.onChange(event.target.checked === true ? false : true);
			// event.preventDefault();
			// setTimeout(props.onComplete, 0);

			// const timeout = setTimeout(() => {
			// 	event.preventDefault();
			// 	// props.onTabNavigation && props.onTabNavigation(true, 0); //event.shiftKey ? -1 : 1
			// 	props.onEnterNavigation && props.onEnterNavigation(true, 0);
			// 	clearTimeout(timeout);
			// }, 100);
			// props.onComplete && props.onComplete(event);
		}

		if (event.key === 'Enter') {
			// 👇️ your logic here
			// console.log('Checkbox Enter key pressed ✅');
			if (props.onComplete) {
				props.onEnterNavigation(true, 0, event);
			}

			// setChecked(event.target.checked);
			// if (checked) {
			// 	setChecked(false);
			// } else {
			// 	setChecked(true);
			// }

			// props.onChange && props.onChange(event.target.checked === true ? false : true);
			// setTimeout(props.onComplete, 0);

			// const timeout = setTimeout(() => {
			// 	event.preventDefault();
			// 	// props.onTabNavigation && props.onTabNavigation(true, 0); //event.shiftKey ? -1 : 1
			// 	props.onEnterNavigation && props.onEnterNavigation(true, 0);
			// 	clearTimeout(timeout);
			// }, 100);
			// props.onComplete && props.onComplete(event);
		}

		if (event.key === 'Escape') {
			// 👇️ your logic here
			// console.log('Escape key pressed ✅');
			props.onCancel && props.onCancel(event);
		}

		// if (event.key === 'Tab') {
		// 	event.preventDefault();
		// 	props.onTabNavigation && props.onTabNavigation(true, event.shiftKey ? -1 : 1); // event.shiftKey ? -1 : 1
		// }

		if (event.key === 'Tab') {
			console.log('check tab');

			event.preventDefault();
			props.onTabNavigation(true, 0, event);
		}
	};

	const handleClick = (event: any) => {
		// setState(event.target.value);
		setChecked(event.target.checked);
		props.onChange && props.onChange(event.target.checked);
		setTimeout(props.onComplete, 0);
	};

	const handleChange = (event: any) => {
		// setState(event.target.value);
		setChecked(event.target.checked);
	};

	return (
		<div
			style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
			className={
				'InovuaReactDataGrid__cell__editor InovuaReactDataGrid__cell__editor--select'
			}>
			<Checkbox
				onBlur={props.onComplete}
				onKeyDown={handleKeyDown}
				inputRef={inputRef}
				checked={checked}
				onChange={handleChange}
				onClick={handleClick}
				style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
			/>
			{/* <Checkbox
                checked={checked}
                onChange={handleChange}
                onClick={handleClick}
             //   inputProps={{ 'aria-label': 'controlled' }}
                onKeyDown={handleKeyDown}
             /> */}
		</div>
	);
};

export default CheckBoxEditor;
