import { useEffect, useRef, useState } from 'react';
// import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';
import { Autocomplete, Box, createFilterOptions, TextField } from '@mui/material';

// const filter = createFilterOptions();
const filterOptions = createFilterOptions({
	matchFrom: 'start',
	stringify: (option: any) => option.name
});

const AutocompleteEditor = (props: any) => {
	const inputRef = useRef<any>();
	const [state, setState] = useState<any>('');
	const [reasonState, setReasonState] = useState<any>('');
	let id = 'country-select-demo' + Math.floor(Math.random() * 100 + 10000);
	// const { editorProps } = props;
	// const editorPropsStyle = editorProps ? editorProps.style : null;
	useEffect(() => {
		if (props.value && props.value !== '') {
			setState(props.value);
		}
		const timeout = setTimeout(() => {
			inputRef.current.focus();
		}, 100);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	const handleKeyDown = (event: any) => {
		// if (event.key === 'Enter') {
		// 	// 👇️ your logic here
		// 	// console.log('AutoComplete -  Control Enter key pressed ✅', state);
		// 	// if (props.onComplete) {
		// 	// 	props.onEnterNavigation(true, 0, state);
		// 	// }
		// 	// const timeout = setTimeout(() => {
		// 	// 	console.log('STATET OF AUTOCOMPLETE', state);
		// 	// 	clearTimeout(timeout);
		// 	// }, 2000);
		// 	// if (!state) return;
		// 	// props.onComplete && props.onComplete(event);
		// 	// const timeout = setTimeout(() => {
		// 	// event.preventDefault();
		// 	// props.onTabNavigation && props.onTabNavigation(true, 0); // event.shiftKey ? -1 : 1
		// 	// clearTimeout(timeout);
		// 	// }, 100);
		// }
		if (event.key === 'Enter') {
			if (!state) {
				// Autocomplete is cleared, handle the Enter key differently
				event.preventDefault(); // Prevent the default behavior (submitting a form, etc.)
				props.onEnterWhenCleared && props.onEnterWhenCleared();
			} else {
				// Autocomplete is not cleared, prevent the default behavior and perform other logic
				event.preventDefault();
				if (props.onComplete) {
					props.onEnterNavigation(true, 0, event);
				}
			}
		}

		if (event.key === 'Escape') {
			// 👇️ your logic here
			// console.log('In Control Escape key pressed ✅');
			props.onCancel && props.onCancel(event);
		}

		// if (event.key === 'Tab') {
		// 	event.preventDefault();
		// 	props.onTabNavigation && props.onTabNavigation(true, event.shiftKey ? -1 : 1); // event.shiftKey ? -1 : 1
		// }

		if (event.key === 'Tab') {
			event.preventDefault();
			props.onTabNavigation(true, 0, event);
		}

		// props.onComplete && props.onComplete(event);
		// props.onChange && props.onChange(event);
	};

	// const handleChange = (event: any, newValue: any, reason: any) => {
	// 	event.preventDefault();

	// 	setReasonState(reason);

	// 	if (reason === 'selectOption' && reasonState === 'clear') {
	// 		return;
	// 	}

	// 	if (reason === 'blur') {
	// 		return;
	// 	}

	// 	if (reason === 'clear') {
	// 		setState({ [props.idProperty]: null, name: '' });
	// 		props.onChange && props.onChange({ [props.idProperty]: null, name: '' });
	// 		return;
	// 	}

	// 	// event.stopPropagation()

	// 	//   setState(newValue);
	// 	if (typeof newValue === 'string') return;

	// 	if (newValue) {
	// 		setState(newValue);

	// 		props.onChange && props.onChange(newValue);
	// 		// props.onComplete && props.onComplete(event);

	// 		setTimeout(props.onComplete, 0);
	// 	}

	// };

	/* Change pranay */
	const handleChange = (event: any, newValue: any, reason: any) => {
		event.preventDefault();

		setReasonState(reason);

		if (reason === 'selectOption' && newValue) {
			setState(newValue);
			props.onChange && props.onChange(newValue);
			setTimeout(props.onComplete, 0);
			return;
		} else if (reasonState === 'clear' || reason === 'blur') {
			return;
		}

		if (reason === 'clear') {
			setState({ [props.idProperty]: null, name: '' });
			props.onChange && props.onChange({ [props.idProperty]: null, name: '' });
			return;
		}

		// event.stopPropagation()

		//   setState(newValue);
		if (typeof newValue === 'string') return;

		if (newValue) {
			setState(newValue);
			props.onChange && props.onChange(newValue);
			// props.onComplete && props.onComplete(event);
			setTimeout(props.onComplete, 0);
		}
	};

	// return (
	// 	<div
	// 		className={
	// 			'InovuaReactDataGrid__cell__editor InovuaReactDataGrid__cell__editor--select'
	// 		}>
	// 		<Autocomplete
	// 			id={id}
	// 			// sx={{ width: 300 }}
	// 			size="medium"
	// 			options={props.dataSource}
	// 			autoHighlight
	// 			value={state}
	// 			autoSelect
	// 			autoComplete={false}
	// 			openOnFocus
	// 			clearIcon={false}
	// 			// open={true}
	// 			// autoFocus={true}
	// 			selectOnFocus
	// 			// blurOnSelect
	// 			onBlur={props.onComplete}
	// 			// getOptionLabel={option => option.Name || ''}
	// 			getOptionLabel={option => {
	// 				// Value selected with enter, right from the input
	// 				if (typeof option === 'string') {
	// 					return option;
	// 				}
	// 				// Add "xxx" option created dynamically
	// 				if (option.inputValue) {
	// 					return option.inputValue;
	// 				}
	// 				// Regular option
	// 				return option.name;
	// 			}}
	// 			onChange={(event, newValue, reason) => {
	// 				handleChange(event, newValue, reason);
	// 				// props.onChange && props.onChange(event, newValue);
	// 			}}
	// 			filterOptions={(options, params) => {
	// 				const filtered = filter(options, params);

	// 				return filtered;
	// 			}}
	// 			freeSolo
	// 			onKeyDown={handleKeyDown}
	// 			fullWidth
	// 			sx={{
	// 				'& .MuiInputBase-input': {
	// 					height: `${props.cellProps.rowHeight - 6}px`
	// 				}
	// 			}}
	// 			// onBlur={props.onComplete}
	// 			renderOption={(props, option) => (
	// 				<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
	// 					{/* <img
	// 						loading="lazy"
	// 						width="20"
	// 						src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
	// 						srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
	// 						alt=""
	// 					/>
	// 					{option.label} ({option.code}) +{option.phone}*/}
	// 					{option.name}
	// 				</Box>
	// 			)}
	// 			renderInput={params => (
	// 				<TextField
	// 					{...params}
	// 					// onChange={onTextChange}
	// 					// label="Choose a country"
	// 					type="text"
	// 					inputRef={inputRef}
	// 					onFocus={event => {
	// 						event.target.select();
	// 					}}
	// 					inputProps={{
	// 						...params.inputProps,
	// 						autoComplete: 'off', // disable autocomplete and autofill,
	// 						clearIcon: false
	// 						// style: {
	// 						// 	height: props.cellProps.rowHeight
	// 						// }
	// 					}}
	// 				/>
	// 			)}
	// 		/>
	// 	</div>
	// );

	/* Change pranay */
	return (
		<div
			className={
				'InovuaReactDataGrid__cell__editor InovuaReactDataGrid__cell__editor--select'
			}>
			<Autocomplete
				id={id}
				// sx={{ width: 300 }}
				size="medium"
				forcePopupIcon={true}
				options={props.dataSource}
				autoHighlight
				value={state}
				autoSelect={false}
				autoComplete={false}
				openOnFocus={false}
				selectOnFocus={false}
				clearIcon={false}
				// open={true}
				// autoFocus={true}

				// blurOnSelect
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
					return option.name;
				}}
				onChange={(event, newValue, reason) => {
					handleChange(event, newValue, reason);
					// props.onChange && props.onChange(event, newValue);
				}}
				// filterOptions={(options, params) => {
				// 	if (props?.isDefaultDropdownOpen) {
				// 		const filtered = filter(options, params);
				// 		return filtered;
				// 	} else {
				// 		if (params.inputValue === '') {
				// 			return [];
				// 		} else {
				// 			const filtered = filter(options, params);
				// 			return filtered;
				// 		}
				// 	}
				// }}
				filterOptions={filterOptions}
				freeSolo
				onKeyDown={handleKeyDown}
				fullWidth
				sx={{
					'& .MuiInputBase-input': {
						height: `${props.cellProps.rowHeight - 6}px`
					}
				}}
				// onBlur={props.onComplete}
				renderOption={(props, option) => (
					<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
						{/* <img
							loading="lazy"
							width="20"
							src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
							srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
							alt=""
						/> 
						{option.label} ({option.code}) +{option.phone}*/}
						{option.name}
					</Box>
				)}
				renderInput={params => (
					<TextField
						{...params}
						// onChange={onTextChange}
						// label="Choose a country"
						type="text"
						inputRef={inputRef}
						onFocus={event => {
							//event.target.select();
							event.preventDefault();
						}}
						inputProps={{
							...params.inputProps,
							autoComplete: 'off', // disable autocomplete and autofill,
							clearIcon: false
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

export default AutocompleteEditor;
