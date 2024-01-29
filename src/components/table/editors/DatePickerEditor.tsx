import { useEffect, useRef, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from 'dayjs';

const DatePickerEditor = (props: any) => {
	const inputRef = useRef<any>();
	const [state, setState] = useState('');

	//  const { editorProps, } = props;

	// const editorPropsStyle = editorProps ? editorProps.style : null;

	useEffect(() => {
		// props.onTest && props.onTest.setTest(true)

		if (props.value && props.value !== '') {
			setState(dayjs(props.value) as any);
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
			// 👇️ your logic here
			// console.log('Textfiels Control Enter key pressed ✅', props);
			// props.onComplete && props.onComplete(state);
			// setTimeout(props.onComplete, 0);
			// props.onComplete && props.onComplete();

			if (props.onComplete) {
				props.onEnterNavigation(true, 0, event);
			}

			// if (!props.lastCell) {
			// const timeout = setTimeout(() => {
			// 	event.preventDefault();
			// 	props.onTabNavigation && props.onTabNavigation(true, 0); //event.shiftKey ? -1 : 1
			// 	clearTimeout(timeout);
			// }, 100);
			// }
		}

		if (event.key === 'Escape') {
			// 👇️ your logic here
			// console.log('In Control Escape key pressed ✅');
			props.onCancel && props.onCancel(event);
			// event.preventDefault()
			// event.stopPropagation()
		}

		// if (event.key === 'Tab') {
		// 	event.preventDefault();
		// 	props.onTabNavigation && props.onTabNavigation(true, event.shiftKey ? -1 : 1);
		// }

		if (event.key === 'Tab') {
			event.preventDefault();
			props.onTabNavigation(true, 0, event);
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleChange = (event: any, newValue: any) => {
		// event.preventDefault()
		// event.stopPropagation()
		// console.log('newValuenewValuenewValuenewValue', newValue);

		setState(event);
		props.onChange && props.onChange(event);
	};

	return (
		<div
			className={
				'InovuaReactDataGrid__cell__editor InovuaReactDataGrid__cell__editor--select'
			}>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DatePicker
					inputRef={inputRef}
					value={state}
					format="DD-MM-YYYY"
					disableOpenPicker
					onChange={(e, newValue) => handleChange(e, newValue)}
					//	InputLabelProps={{ shrink: true }}
					// minDate={dayjs(new Date())}
					slotProps={{
						textField: {
							onKeyDown: event => handleKeyDown(event),
							helperText: '',
							sx: {
								'& .MuiInputBase-input': {
									// height: `${props.cellProps.rowHeight}px`,
									// width: `${props.cellProps.computedWidth}px`.
									height: `${props.cellProps.rowHeight - 6}px`
								}
							}
						}
					}}
					//     onClose={makeApiCall}
					// KeyboardIconProps={{
					//   onKeyDown: (e) => handleKeyDown(e)
					// }}
					// slotProps={{
					//   textField: {

					//   }
					// }}
				/>
			</LocalizationProvider>
		</div>
	);
};

export default DatePickerEditor;
