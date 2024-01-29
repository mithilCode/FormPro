import dayjs from 'dayjs';
import _ from 'lodash';
import { KeyedObject } from 'types/root';

export interface InitialState {
	isValid: boolean;
	values: KeyedObject;
	touched: KeyedObject | null;
	errors: KeyedObject | null;
}

export interface InitialQueryParam {
	page: number;
	limit: number;
	sortBy?: Array<object>;
	filterBy?: Array<object>;
	pagination?: string;
}

export const delay = (ms: any) => new Promise(res => setTimeout(res, ms));

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
export const difference = (origObj: any, newObj: any): object => {
	function changes(newObj: object, origObj: { [x: string]: any }) {
		let arrayIndexCounter = 0;
		return _.transform(newObj, function (result: any, value, key) {
			if (!_.isEqual(value, origObj[key])) {
				const resultKey = _.isArray(origObj) ? arrayIndexCounter++ : key;

				result[resultKey] =
					_.isObject(value) && _.isObject(origObj[key])
						? changes(value, origObj[key])
						: origObj[key];
				// : origObj[key];
				// : value;
			}
		});
	}
	return changes(newObj, origObj);
};

/**
 * Get permision
 * @param  {object} rules - Object of rules
 * @param  {string} perform  - string fo validation
 * @return {boolean}
 */

export const isPermission = (rules: any, perform: string): boolean => {
	try {
		// const permissions = rules.Permission;

		const permissions = authRoles(rules);

		if (!permissions) {
			return false;
		}

		const can = permissions.includes(perform);

		return can;
	} catch (e) {
		return false;
	}
};

/**
 * Authorization Roles
 */

interface IObjectKeys {
	[key: string]: any;
}

/**
 * Auth roles
 * @param  {object} module - module for validation
 * @return {IObjectKeys}
 */

export const authRoles = (module: string): IObjectKeys => {
	try {
		const authRole: IObjectKeys = JSON.parse(localStorage.getItem('Permissions') as any);

		if (authRole) {
			return authRole[module].Role;
		}
		return [];
	} catch (e) {
		return [];
	}
};

/**
 * Has Error for input
 * @param  {string} field - Field name
 * @param  {any} formState  - State of form (RHF)
 * @param  {any} errors  - Error of form (RHF)
 * @return {boolean}
 */

export const hasError = <T>(field: string, formState: any, errors: any): boolean => {
	const str = field as string;

	return Boolean(
		formState.touchedFields[str as keyof typeof formState.touchedFields] &&
			errors[str as keyof T]
	);
	// https://bobbyhadz.com/blog/typescript-element-implicitly-has-any-type-expression#element-implicitly-has-an-any-type-because-expression-of-type-string-cant-be-used-to-index-type
};

/**
 * Query params
 * @param  {object} obj - Query parameter object
 * @return {string}
 */
export const ObjecttoQueryString = (obj: { [x: string]: any }) => {
	const QueryString = Object.keys(obj)
		// eslint-disable-next-line func-names
		.map(function (key) {
			return `${key}=${obj[key]}`;
		})
		.join('&');

	return QueryString;
};

/**
 * Table Data Query params
 * @param  {object} initObj - Initial Query parameter object
 * @param  {object} tableObj - Table parameter object
 * @return {object}
 */
export const fetchTabelDataObject = (
	initObj: { [x: string]: any },
	tableObj: { [x: string]: any }
): object => {
	const fetchData = {
		pageSize: tableObj.limit ? tableObj.limit : initObj.limit,
		pageIndex:
			tableObj.page || tableObj.page === 0 ? tableObj.page / initObj.limit + 1 : initObj.page,
		sortInfo: tableObj.sortInfo ? JSON.stringify(tableObj.sortInfo) : initObj.sortBy,
		filterValue: tableObj.filterBy ? JSON.stringify(tableObj.filterBy) : initObj.filterBy
	};
	return fetchData;
};

export const onOpenDropDown = async (event: any, gridRef: any): Promise<any> => {
	if (event.key === 'Enter') {
		const grid = gridRef.current;
		let [rowIndex, colIndex] = grid.computedActiveCell;

		const column = grid.getColumnBy(colIndex);
		return { rowIndex, colIndex, column };
	}
	return false;
};

// ******* React Data Tabel *** //

/**
 * Table onTableKeyDown
 * @param  {any} event - Keyboard event
 * @param  {boolean} inEdit - Edit start or stop
 * @param  {any} gridRef grid refrence
 * @return {any}
 */
export const onTableKeyDown = async (event: any, inEdit: boolean, gridRef: any): Promise<any> => {
	const grid = gridRef.current;
	let [rowIndex, colIndex] = grid.computedActiveCell;

	if (inEdit) {
		if (event.key === 'Enter') {
			// event.key === ' ' ||
			event.preventDefault();

			const direction = 1;

			const columns = grid.visibleColumns;
			const rowCount = grid.count;

			let skipCol = 0;
			for (let index = colIndex; index < columns.length; index++) {
				const column = grid.getColumnBy(index + 1);

				if (column && (column.editable === false || column.skipNavigation === true)) {
					skipCol += 1;
				} else {
					break;
				}
			}

			colIndex += direction + skipCol;

			if (colIndex === -1) {
				colIndex = columns.length - 1;
				rowIndex -= 1;
			}

			if (colIndex === columns.length) {
				rowIndex += 1;

				//	const allColumns = grid.Columns;
				let LastEditCol = Math.floor(Math.random() * 100 + 10000);
				for (let index = 0; index < columns.length - 1; index++) {
					const column = grid.getColumnBy(index);

					if (column) {
						if (column.editable === false || column.skipNavigation === true) {
							/* empty */
						} else {
							LastEditCol = index;
							break;
						}
					}
				}
				colIndex = LastEditCol;
			}

			if (rowIndex < 0 || rowIndex === rowCount) {
				return;
			}

			grid.setActiveCell([rowIndex, colIndex]);
			// setTimeout(() => {

			try {
				const column1 = grid.getColumnBy(colIndex);
				if (column1.openInDialog && column1.openInDialogDefault) return;
				await grid.startEdit({ columnId: column1.name, rowIndex });
			} catch (e) {
				console.log(e);
			}

			// }, 0);
		} else if (event.key !== 'Tab' && event.key !== 'F4' && event.key !== 'Delete') {
			const grid = gridRef.current;
			const [, colIndex] = grid.computedActiveCell;
			const column = grid.getColumnBy(colIndex);

			const key = event.key;

			if (!/^[A-Za-z0-9]$/.test(key) && event.key !== 'Backspace') {
				return true;
			}

			let qstr = event.key;
			if (!column.openInDialog) {
				qstr = event.target.value;
				if (event.key === 'Backspace') {
					qstr = qstr.slice(0, -1);
				} else {
					qstr += event.key;
				}
			} else {
				if (event.key === 'Backspace') {
					qstr = ''; //event.target.value;
				}
			}

			return { colName: column.name, input: qstr, column, rowIndex, colIndex };
		} else if (event.shiftKey && event.key === 'Tab') {
			const direction = -1;

			const columns = grid.visibleColumns;
			const rowCount = grid.count;

			let skipCol = 0;
			if (colIndex !== 0) {
				for (
					var index = columns.length - (columns.length - colIndex);
					index >= 0;
					index--
				) {
					const column = grid.getColumnBy(index - 1);
					if (column && (column.editable === false || column.skipNavigation === true)) {
						skipCol += 1;
					} else {
						break;
					}
				}
			}

			colIndex += direction - skipCol;

			// colIndex += direction;
			if (colIndex === -1) {
				let skipCol = 0;
				for (var index = columns.length - 1; index >= 0; index--) {
					const column = grid.getColumnBy(index);
					if (column && (column.editable === false || column.skipNavigation === true)) {
						skipCol += 1;
					} else {
						break;
					}
				}
				const colLength = columns.length - 1;

				colIndex = colLength - skipCol;
				rowIndex -= 1;
			}

			if (colIndex === columns.length) {
				rowIndex += 1;
				colIndex = 0;
			}

			if (rowIndex < 0 || rowIndex === rowCount) {
				return;
			}

			grid.setActiveCell([rowIndex, colIndex]);
			// setTimeout(() => {

			try {
				const column = grid.getColumnBy(colIndex);
				await grid.startEdit({ columnId: column.name, rowIndex });
			} catch (e) {
				console.log(e);
			}

			// }, 200);
		} else if (event.key === 'F4') {
			const grid = gridRef.current;
			const [, colIndex] = grid.computedActiveCell;
			const column = grid.getColumnBy(colIndex);

			if (column.openInDialog) {
				const qstr = event.target.value;
				return { colName: column.name, input: '', column, rowIndex, colIndex };
			}
		}

		return true;
	}

	if (event.key === 'Enter') {
		// event.key === ' ' ||
		event.preventDefault();

		if (inEdit) {
			const direction = event.shiftKey ? -1 : 1;

			const columns = grid.visibleColumns;
			const rowCount = grid.count;

			colIndex += direction;
			if (colIndex === -1) {
				colIndex = columns.length - 1;
				rowIndex -= 1;
			}
			if (colIndex === columns.length) {
				rowIndex += 1;
				colIndex = 0;
			}
			if (rowIndex < 0 || rowIndex === rowCount) {
				return;
			}
		}

		grid.setActiveCell([rowIndex, colIndex]);
		const column = grid.getColumnBy(colIndex);
		try {
			if (column.openInDialog && column.openInDialogDefault) return;
			await grid.startEdit({ columnId: column.name, rowIndex });
		} catch (e) {
			console.log(e);
		}
	}

	if (event.shiftKey && event.key === 'Tab') {
		const direction = -1;

		const columns = grid.visibleColumns;
		const rowCount = grid.count;

		colIndex += direction;
		if (colIndex === -1) {
			colIndex = columns.length - 1;
			rowIndex -= 1;
		}
		if (colIndex === columns.length) {
			rowIndex += 1;
			colIndex = 0;
		}
		if (rowIndex < 0 || rowIndex === rowCount) {
			return;
		}

		grid.setActiveCell([rowIndex, colIndex]);
	}

	return;
};

/**
 * Table onColumnEditComplete
 * @param  {any} columns - Table columns
 * @param  {any} dataSource - Table data
 * @param  {object} obj { value, columnId, rowIndex } - Edit Complte
 * @return {any}
 */

export const onColumnEditComplete = async (
	columns: any,
	dataSource: any,
	obj: any
): Promise<any> => {
	const { value, columnId, rowIndex } = obj;
	const data = [...dataSource];

	if ((value || value === '' || value === 0) && typeof value !== 'boolean') {
		if (typeof value === 'string') {
			data[rowIndex] = Object.assign({}, data[rowIndex], { [columnId]: value });
		} else {
			const x = value as any;
			if (x.$d) {
				// Assume Date
				data[rowIndex] = Object.assign({}, data[rowIndex], {
					[columnId]: dayjs(x).toJSON()
				});

				const hiddenObj = await updateTableHiddenColumn(
					columns,
					data,
					rowIndex,
					columnId,
					dayjs(x).toJSON()
				);

				if (hiddenObj) {
					data[rowIndex] = hiddenObj;
				}
			} else {
				// Assume Autocomplete Object
				data[rowIndex] = Object.assign({}, data[rowIndex], {
					[columnId]: value
					// [columnId]: value.Name || ''
				});

				const hiddenObj = await updateTableHiddenColumn(
					columns,
					data,
					rowIndex,
					columnId,
					value
				);

				if (hiddenObj) {
					data[rowIndex] = hiddenObj;
				}
			}
		}
	}

	if (typeof value === 'boolean') {
		data[rowIndex] = Object.assign({}, data[rowIndex], { [columnId]: value ? true : false });

		const hiddenObj = await updateTableHiddenColumn(
			columns,
			data,
			rowIndex,
			columnId,
			value ? true : false
		);

		if (hiddenObj) {
			data[rowIndex] = hiddenObj;
		}
	}

	if (!value && typeof value === 'object') {
		data[rowIndex] = Object.assign({}, data[rowIndex], { [columnId]: value });

		const hiddenObj = await updateTableHiddenColumn(
			columns,
			data,
			rowIndex,
			columnId,
			value ? true : false
		);

		if (hiddenObj) {
			data[rowIndex] = hiddenObj;
		}
	}

	return data;
};

/**
 * Table Hidden Column Update
 * @param  {any} columns - Table columns
 * @param  {any} data - Table data
 * @param  {number} rowIndex - Table row index
 * @param  {string} columnId - Table column name
 * @param  {any} value - value for update in hidden column
 * @return {any} Hidden column object or null
 */

export const updateTableHiddenColumn = (
	columns: any,
	data: any,
	rowIndex: number,
	columnId: string,
	value: any
): any => {
	// Find current column
	const currentCol = columns.find((col: { name: string }) => col.name === columnId);

	// Check column property addInHidden is available and true
	if (currentCol['addInHidden']) {
		// Find hidden column
		const hiddenCol = columns.find((col: { name: string }) => col.name === 'hidden');

		if (hiddenCol) {
			const hiddenObj = data[rowIndex]['hidden'] ? data[rowIndex]['hidden'] : {};

			hiddenObj[columnId] = value;

			const obj = Object.assign({}, data[rowIndex], { hidden: hiddenObj });
			return obj;
		}
	}
	return null;
};

/**
 * Prepare page state for table
 * @param  {any} pageState - page state array
 * @param  {string} findKey - Find by key
 * @param  {any} data - current row data
 * @param  {number} rowIndex - Table row index
 * @param  {sting} action - row action status
 * @return {any} array for pageState
 */

export const preparePageStateArr = async (
	pageState: any,
	findKey: string,
	// findValue: any,
	data: any,
	rowIndex: number,
	action: string
): Promise<any> => {
	const stateArr = pageState.values.para ? [...pageState.values.para] : [];
	const findIndex = stateArr.findIndex((x: any) => x[findKey] === data[rowIndex][findKey]);
	// get updated row
	const currRow = data[rowIndex];

	const currRowObj = { ...currRow };

	if (currRowObj.action === 'insert' && action === 'delete') {
		stateArr.splice(findIndex, 1);
		return stateArr;
	}

	currRowObj.action = currRowObj.action === 'insert' ? 'insert' : action;

	if (findIndex > -1) {
		stateArr[findIndex] = currRowObj;
	} else {
		stateArr.push(currRowObj);
	}

	return stateArr;
};

/**
 * Insert new row to table
 * @param  {any} pageState - page state array
 * @param  {any} formSchema - Form schema for validation
 * @param  {any} dataSource - dataSource
 * @param  {number} rowIndex - Table row index
 * @param  {boolean} isLastEditableColumn - is Last editable
 * @param  {string} eventKey - keypressed
 * @return {boolen} boolean
 */

export const insertNewRow = async (
	pageState: any,
	formSchema: any,
	dataSource: any,
	rowIndex: number,
	isLastEditableColumn: boolean,
	eventKey: string,
	extraProps?: any
): Promise<any> => {
	let insertNew = false;
	if (eventKey === 'Insert' && pageState.values && Object.keys(pageState.values).length === 0) {
		insertNew = true;
	} else if (
		eventKey === 'Insert' &&
		pageState.values &&
		pageState.values.para &&
		pageState.values.para.length === 0
	) {
		insertNew = true;
	} else if (eventKey === 'Focus') {
		insertNew = true;
	} else if ((eventKey === 'Enter' && isLastEditableColumn) || eventKey === 'Insert') {
		const validation = await formSchema.safeParse({
			arr: [
				pageState.values.para ? pageState.values.para[pageState.values.para.length - 1] : {}
			]
		});
		if (validation.success) {
			insertNew = true;
		}
	}

	if (insertNew) {
		const obj = { ...dataSource[0] };
		const newObj = Object.keys(obj).reduce((accumulator, key) => {
			return { ...accumulator, [key]: null };
		}, {}) as any;

		newObj.action = 'insert';
		newObj.seq_no = -1 * Math.floor(Math.random() * 100 + 10000);

		let newRowObj = {
			...newObj,
			...extraProps
		};

		const data = [...dataSource, newRowObj];

		const stateArr = await preparePageStateArr(
			pageState,
			'seq_no',
			data,
			data.length - 1,
			'insert'
		);

		return { insertNew: true, data, stateArr };
	}
	return { insertNew: false };
};

/**
 * delete row to table
 * @param  {any} pageState - page state array
 * @param  {string} key - unique key
 * @param  {any} data - dataSource
 * @param  {number} rowIndex - Table row index
 * @return {array} array
 */

export const deleteRow = async (
	pageState: any,
	key: string,
	data: any,
	rowIndex: number
): Promise<any> => {
	const stateArr = await preparePageStateArr(pageState, key, data, rowIndex, 'delete');
	return stateArr;
};

/**
 * Insert new row to table
 * @param  {any} columns - table columns
 * @param  {any} dataSource - table dataSource
 * @param  {any} value - table editor value
 * @param  {number} columnId - Table row index
 * @param  {number} rowIndex - Table row index
 * @param  {any} pageState - page state array
 * @param  {string} key - unique key
 * @return {array} array
 */

export const prepareOnEditComplete = async (
	columns: any,
	dataSource: any,
	value: any,
	columnId: number,
	rowIndex: number,
	pageState: any,
	key: string
): Promise<any> => {
	const data = await onColumnEditComplete(columns, dataSource, {
		value,
		columnId,
		rowIndex
	});

	const stateArr = await preparePageStateArr(pageState, key, data, rowIndex, 'update');
	return { stateArr: stateArr, data: data };
};
