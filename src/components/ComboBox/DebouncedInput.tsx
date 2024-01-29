import React from 'react';
import { useState, useMemo, useRef, useEffect, memo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import TextField from '@mui/material/TextField';

interface DebouncedInputProps {
	value: string;
	onChange: (value: any) => void;
	debounce?: number;
	leftIcon?: React.ReactNode;
	placeholder: string;
	selectedColumn?: string;
	setGlobalFilter?: any;
	fillInputBox?: any;
}

const DebouncedInput: React.FC<DebouncedInputProps> = ({
	value: initialValue,
	onChange,
	debounce = 100,
	leftIcon,
	placeholder,
	selectedColumn,
	setGlobalFilter,
	fillInputBox,
	...props
}) => {
	const [value, setValue] = useState<string>(initialValue || '');
	const [valString, setValString] = useState<string>('');
	const [initial, setInitial] = useState<boolean>(true);

	useEffect(() => {
		if (value && value !== '') {
			//			onChange({ selectedColumn, value: value });
		} else {
			onChange({ selectedColumn, value: '' });
		}
		setValString(value);
		setInitial(false);
	}, []);

	useEffect(() => {
		if (!initial) {
			let str = '';

			if (fillInputBox.input !== 'Backspace') {
				if (valString) {
					str += valString + fillInputBox.input;
				} else {
					str = fillInputBox.input;
				}
			} else {
				if (valString && valString.length > 0) {
					str = valString.slice(0, -1);
				}
			}

			setValString(str);
			setValue(str);
		}
	}, [fillInputBox]);

	useEffect(() => {
		if (!initial) {
			if (valString) {
				onChange({ selectedColumn, value: valString });
			} else if (valString === '') {
				if (!initial) {
					onChange({ selectedColumn, value: '' });
				}
				setInitial(false);
			}
		}
	}, [valString]);

	const debouncedCallback = useDebouncedCallback((value: string) => {
		onChange({ selectedColumn, value: value });
	}, debounce);

	useMemo(() => setValue(initialValue), [initialValue]);
	return (
		<div className="py-3">
			<TextField
				disabled={true}
				value={value}
				placeholder={placeholder}
				onChange={e => {
					setValue(e.target.value);
					debouncedCallback(e.target.value);
				}}
				style={{ width: '100%' }}
				className="mt-2 outline-0 focus:outline-1   placeholder-[#515151] text-gray-600 block w-full h-11  text-sm rounded p-2  border border-slate-300 px-4"
				{...props}
			/>
		</div>
	);
};

export default memo(DebouncedInput);
