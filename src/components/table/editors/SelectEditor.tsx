import { useEffect, useRef, useState } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const filter = createFilterOptions();

// type SelectEditorProps = {
// 	dataSource: readonly any[];
// 	editorProps?: any;
// 	nativeScroll?: boolean;
// 	value?: string;
// 	cellProps?: any;
// 	onChange?: (value: string) => void;
// 	onComplete?: Function;
// 	onTabNavigation?: Function;
// 	onCancel?: Function;
// 	theme?: string;
// 	rtl?: boolean;
// 	onBlur?: Function;
// };

const SelectEditor = (props: any) => {
	const inputRef = useRef<any>(null);
	const [state, setState] = useState<any>(null);

	// const { editorProps } = props;
	// const editorPropsStyle = editorProps ? editorProps.style : null;

	useEffect(() => {
		if (props.value && props.value !== '') {
			setState(props.value);
		}
		const timeout = setTimeout(() => {
			inputRef!.current!.focus();
		}, 100);

		return () => {
			clearTimeout(timeout);
		};
	}, [props.value]);

	const handleKeyDown = (event: any) => {
		if (event.key === 'Enter') {
			if (!state) return;

			props.onComplete && props.onComplete();

			const timeout = setTimeout(() => {
				event.preventDefault();
				// props.onTabNavigation(true, event.shiftKey ? -1 : 1);
				props.onTabNavigation(true, 0);
				clearTimeout(timeout);
			}, 100); // Here problem 400 timeout delay set columnId name when select country
		}

		if (event.key === 'Escape') {
			// 👇️ your logic here
			props.onCancel && props.onCancel(event);
		}

		// if (event.key === 'Tab') {
		// 	console.log('props', props.cellProps.ColumnIndex);
		// 	// event.preventDefault();
		// 	props.onTabNavigation && props.onTabNavigation(true, event.shiftKey ? -1 : 1); //event.shiftKey ? -1 : 1
		// }

		if (event.key === 'Tab') {
			event.preventDefault();
			props.onTabNavigation(true, 0, event);
		}
	};
	const handleChange = (event: any, newValue: any | null) => {
		event.preventDefault();

		if (newValue) {
			setState(newValue);
			props.onChange && props.onChange(newValue);

			props.onComplete && props.onComplete();

			setTimeout(props.onComplete, 0);
		}
	};

	return (
		<div
			className={
				'InovuaReactDataGrid__cell__editor InovuaReactDataGrid__cell__editor--select'
			}>
			<Autocomplete
				id="country-select-demo"
				// sx={{ width: 300 }}
				// sx={{ height: 100 }}
				size="medium"
				options={props.dataSource}
				autoHighlight
				value={state}
				autoSelect
				openOnFocus
				// open={true}
				// autoFocus={true}
				selectOnFocus
				blurOnSelect
				onBlur={props.onComplete}
				// getOptionLabel={option => option.Name || ''}
				getOptionLabel={option => {
					// Value selected with enter, right from the input
					if (typeof option === 'string') {
						return option;
					}
					// Add "xxx" option created dynamically
					if (option.inputValue) {
						return option.inputValue;
					}
					// Regular option
					return option.Name;
				}}
				onChange={(event, newValue) => {
					handleChange(event, newValue);
					// props.onChange && props.onChange(event, newValue);
				}}
				filterOptions={(options, params) => {
					const filtered = filter(options, params);
					return filtered;
				}}
				freeSolo
				onKeyDown={handleKeyDown}
				fullWidth
				sx={{
					'& .MuiInputBase-input': {
						height: `${props.cellProps.rowHeight - 6}px`
					}
				}}
				renderInput={params => (
					<TextField
						{...params}
						// type="text"
						fullWidth
						size="medium"
						inputRef={inputRef}
						onFocus={event => {
							event.target.select();
						}}
						inputProps={{
							...params.inputProps,
							autoComplete: 'off' // disable autocomplete and autofill
							// style: {
							// 	height: props.cellProps.rowHeight
							// }
						}}
					/>
				)}
			/>
		</div>
	);
};

export default SelectEditor;
