import { useState, useEffect, useRef, useCallback } from 'react';
// import floatThead from 'floatthead';

interface Props {
	popupPosition: any;
	isFindVisible: any;
	closeCellPopup: any;
	selectCellPopupCallback: any;
	viewType: any; // specifying the view type: 'table_with_checkbox', 'table_without_checkbox', 'list_view'
	gridConfig: any; //grid configuration,
	className?: string;
	// listViewData: any;
}

function ReactDataGridCellPopup({
	popupPosition,
	isFindVisible,
	closeCellPopup,
	selectCellPopupCallback,
	viewType, // specifying the view type: 'table_with_checkbox', 'table_without_checkbox', 'list_view'
	gridConfig, //grid configuration
	className
}: Props) {
	const [popupPositionDefault, setPopupPositionDefault] = useState({
		x: 0,
		y: 0
	});
	const [selectedRows, setSelectedRows] = useState(new Set());
	const [selectAll, setSelectAll] = useState(false);

	const [searchText, setSearchText] = useState('');

	let [data, setData] = useState<any>([]);

	const searchTextRef = useRef<any>(null);

	useEffect(() => {
		const handleKeyPress = (event: any) => {
			const isAlphanumeric = /^[a-zA-Z0-9]$/;
			if (isAlphanumeric.test(event.key)) {
				searchTextRef?.current?.focus();
			}
		};

		window.addEventListener('keypress', handleKeyPress);

		return () => {
			window.removeEventListener('keypress', handleKeyPress);
		};
	}, [searchTextRef]);

	// Conditionally set data based on viewType
	// useEffect(() => {
	// 	if (viewType === 'list_view') {
	// 		setData(listViewData || []);
	// 	} else {
	// 		setData(gridConfig.data || []);
	// 	}
	// }, [listViewData]);

	const handleToggle = useCallback(
		(property: any, id: any) => {
			const newData: any = [...data];
			const index = newData.findIndex((item: any) => item.id === id);
			if (index !== -1) {
				let setVal = !newData[index][property];
				newData[index][property] = setVal;
				if (property === 'selectedCrossmark') {
					newData[index]['selectedCheckmark'] = !setVal;
				} else if (property === 'selectedCheckmark') {
					newData[index]['selectedCrossmark'] = !setVal;
				}
			}
			setData(newData);
		},

		[data]
	);

	const closePopup = () => {
		closeCellPopup();
		setSelectedRows(new Set()); // Clear the selected rows
		setSelectAll(false); // Clear the "Select All" checkbox
	};

	// Dynamic property name based on the unique field configuration
	const uniqueFieldName =
		gridConfig.columns?.find((column: any) => column.uniqField)?.valueField || 'no';

	// const isNumeric = (value: any) => !isNaN(parseFloat(value)) && isFinite(value);

	const filteredData = gridConfig?.data?.filter((row: any) => {
		// Filter the data based on the search text
		// const searchableFields = [
		// 	row[uniqueFieldName]?.toString(),
		// 	row.name,
		// 	row.address,
		// 	row.city
		// ];
		if (row.prev_selected) {
			selectedRows.add(row.name);
		}
		const searchableValue = Object.values(row);
		var allStrings = searchableValue?.map(function (element: any) {
			return element?.toString();
		});
		return allStrings.some(
			(fieldVal: any) => fieldVal?.toLowerCase().includes(searchText?.toLowerCase())
		);
	});

	const selectPopupButtonClick = (rowId?: any) => {
		if (viewType === 'list_view') {
			selectCellPopupCallback(data);
		} else {
			const selectedTableData = gridConfig.data.filter((row: any) =>
				selectedRows.has(row[uniqueFieldName])
			);
			selectCellPopupCallback(selectedTableData);
			// Toggle selection for the clicked row
			//toggleRowSelection(rowId);
		}

		closeCellPopup();
		setSelectedRows(new Set()); // Clear the selected rows
		setSelectAll(false); // Clear the "Select All" checkbox
	};

	// const moveVisualSelection = (direction: any) => {
	// 	let visualSelectedRowNow =
	// 		visualSelectedRow !== null ? visualSelectedRow : filteredData[0][uniqueFieldName];
	// 	const currentIndex = filteredData?.findIndex(
	// 		(row: any) => row[uniqueFieldName] === visualSelectedRowNow
	// 	);
	// 	const newIndex = currentIndex + direction;

	// 	if (newIndex >= 0 && newIndex < filteredData?.length) {
	// 		setVisualSelectedRow(filteredData[newIndex][uniqueFieldName]);
	// 	}
	// };
	const moveVisualSelection = (direction: any) => {
		if (filteredData && filteredData.length > 0) {
			let visualSelectedRowNow =
				visualSelectedRow !== null ? visualSelectedRow : filteredData[0][uniqueFieldName];
			const currentIndex = filteredData.indexOf(
				filteredData.find((row: any) => row[uniqueFieldName] === visualSelectedRow)
			);
			const newIndex = currentIndex + direction;

			if (newIndex >= 0 && newIndex < filteredData.length) {
				setVisualSelectedRow(filteredData[newIndex][uniqueFieldName]);
			}
		}
	};

	useEffect(() => {
		// If visualSelectedRow is not in the new filteredData, update it to the first row.
		if (
			visualSelectedRow &&
			!filteredData.find((row: any) => row[uniqueFieldName] === visualSelectedRow)
		) {
			setVisualSelectedRow(filteredData.length > 0 ? filteredData[0][uniqueFieldName] : null);
		}
	}, [filteredData]);

	useEffect(() => {
		const handleEsc = (event: any) => {
			if (event.key === 'Escape') {
				closePopup();
			}
			const { key } = event;
			switch (key) {
				case 'ArrowUp':
					event.preventDefault();
					moveVisualSelection(-1);
					break;
				case 'ArrowDown':
					event.preventDefault();
					moveVisualSelection(1);
					break;
				case ' ':
					event.preventDefault();
					// toggleRowSelection(visualSelectedRow);
					toggleRowCheckboxSelection(visualSelectedRow);
					break;
				// case 'Enter':
				// 	event.preventDefault();
				// 	toggleRowSelection(visualSelectedRow, 'keyboard_enter');
				// 	setTimeout(() => {
				// 		selectPopupButtonClick();
				// 	}, 400);
				// 	break;
				case 'Enter':
					event.preventDefault();
					if (viewType === 'table_with_checkbox') {
						selectPopupButtonClick();
					} else {
						toggleRowSelection(visualSelectedRow, 'keyboard_enter');
						setTimeout(() => {
							selectPopupButtonClick();
						}, 400);
					}
					break;

				default:
					break;
			}
		};
		window.addEventListener('keydown', handleEsc);
		// Clean up the event listener when the component is unmounted
		return () => {
			window.removeEventListener('keydown', handleEsc);
		};
	}, [closePopup]);

	const toggleRowSelection = (id: any, callFrom = 'normal') => {
		setVisualSelectedRow(id); // Set the visual selected row to the clicked row

		if (selectedRows.has(id) && callFrom === 'normal') {
			selectedRows.delete(id);
		} else {
			//setSelectedRows(new Set());
			selectedRows.forEach((row: any) => {
				selectedRows.delete(row);
			});
			if (selectedRows.size != 1) {
				selectedRows.add(id);
			}
			// setTimeout(() => {
			// 	if (selectedRows.size != 1) {
			// 		selectedRows.add(id);
			// 	}
			// }, 100);
		}
		let updatedSelectedRows;

		if (viewType === 'table_with_checkbox') {
			// If checkboxes are present, toggle the selection
			updatedSelectedRows = new Set(selectedRows);
			if (updatedSelectedRows.has(id)) {
				updatedSelectedRows.delete(id);
			} else {
				updatedSelectedRows.add(id);
			}
		} else {
			// If no checkboxes, simply select the row
			updatedSelectedRows = new Set([id]);
		}

		// Update the state with the new selected rows
		setSelectedRows(updatedSelectedRows);

		// Update the "Select All" checkbox state
		if (updatedSelectedRows.size === filteredData.length) {
			setSelectAll(true);
		} else {
			setSelectAll(false);
		}

		// if (selectedRows.has(id)) {
		// 	selectedRows.delete(id);
		// } else {
		// 	selectedRows.add(id);
		// }
		// setSelectedRows(new Set(selectedRows));
		// if (selectedRows.size === filteredData.length) {
		// 	setSelectAll(true);
		// } else {
		// 	setSelectAll(false);
		// }

		// Update the "Select All" checkbox
		if (filteredData.length === 1) {
			setSelectAll(selectedRows.has(id));
		} else {
			setSelectAll(false);
		}
	};
	const toggleRowCheckboxSelection = (id: any) => {
		let updatedSelectedRows;

		if (viewType === 'table_with_checkbox') {
			// If checkboxes are present, toggle the selection
			updatedSelectedRows = new Set(selectedRows);
			if (updatedSelectedRows.has(id)) {
				updatedSelectedRows.delete(id);
				gridConfig.data = gridConfig?.data.map((element: any) => {
					if (element.name === id) {
						element.prev_selected = false;
					}
					return element;
				});
			} else {
				updatedSelectedRows.add(id);
			}
		} else {
			// If no checkboxes, simply select the row
			updatedSelectedRows = new Set([id]);
		}

		// Update the state with the new selected rows
		setSelectedRows(updatedSelectedRows);

		// Update the "Select All" checkbox state
		if (updatedSelectedRows.size === filteredData.length) {
			setSelectAll(true);
		} else {
			setSelectAll(false);
		}
	};

	const toggleSelectAll = () => {
		if (selectAll) {
			setSelectedRows(new Set());
			setSelectAll(false);
		} else {
			const allIds = filteredData?.map((row: any) => row[uniqueFieldName]);
			setSelectedRows(new Set(allIds));
			setSelectAll(true);
		}
	};

	useEffect(() => {
		// Set the initial value of popupPositionDefault when popupPosition prop changes
		setPopupPositionDefault(popupPosition || { x: 0, y: 0 });
	}, [popupPosition]);

	const tableRef = useRef<HTMLTableElement>(null);
	// useEffect(() => {
	//     floatThead(tableRef.current);
	// }, []);

	const [visualSelectedRow, setVisualSelectedRow] = useState(
		filteredData?.length > 0 ? filteredData[0][uniqueFieldName] : null
	);

	// useEffect(() => {
	// 	if (tableRef.current) {
	// 		const table: any = tableRef.current;

	// 		let visualSelectedRowNow =
	// 			visualSelectedRow !== null ? visualSelectedRow : filteredData[0][uniqueFieldName]; // Initialize visual selection to the first row

	// 		const handleKeyDown = (event: any) => {
	// 			const { key } = event;
	// 			switch (key) {
	// 				case 'ArrowUp':
	// 					event.preventDefault();
	// 					moveVisualSelection(-1);
	// 					break;
	// 				case 'ArrowDown':
	// 					event.preventDefault();
	// 					moveVisualSelection(1);
	// 					break;
	// 				case ' ':
	// 					event.preventDefault();
	// 					toggleRowSelection(visualSelectedRow);
	// 					break;
	// 				case 'Enter':
	// 					event.preventDefault();
	// 					selectPopupButtonClick();
	// 					break;
	// 					// case 'Enter':
	// 					// 	event.preventDefault();
	// 					// 	toggleRowSelection(visualSelectedRow);
	// 					// 	selectPopupButtonClick();
	// 					// 	break;
	// 					// default:
	// 					break;
	// 			}
	// 		};

	// 		const moveVisualSelection = (direction: any) => {
	// 			const currentIndex = filteredData?.findIndex(
	// 				(row: any) => row[uniqueFieldName] === visualSelectedRowNow
	// 			);
	// 			const newIndex = currentIndex + direction;

	// 			if (newIndex >= 0 && newIndex < filteredData?.length) {
	// 				setVisualSelectedRow(filteredData[newIndex][uniqueFieldName]);
	// 			}
	// 		};

	// 		table.addEventListener('keydown', handleKeyDown);
	// 		return () => {
	// 			table.removeEventListener('keydown', handleKeyDown);
	// 		};
	// 	}
	// }, [filteredData, selectedRows, visualSelectedRow]);

	useEffect(() => {
		// if (tableRef.current) {
		//     const firstRow = tableRef.current.querySelector('tbody tr');
		//     tableRef.current.focus();
		//     if (firstRow) {
		//         firstRow.focus();
		//     }
		// }
		setTimeout(() => {
			tableRef?.current?.focus();
		}, 0);
	}, [tableRef]);

	// const handleRowClick = (rowId: any) => {
	// 	// Unselect the previously selected row
	// 	selectedRows.forEach(selectedRowId => {
	// 		if (selectedRowId !== rowId) {
	// 			toggleRowSelection(selectedRowId);
	// 		}
	// 	});

	// 	// Toggle selection for the clicked row
	// 	toggleRowSelection(rowId);
	// 	toggleRowCheckboxSelection(rowId);
	// 	selectPopupButtonClick();
	// };

	const handleDoubleClick = (rowId: any) => {
		// Handle the double-click action here
		toggleRowSelection(rowId);
		selectPopupButtonClick(rowId);
	};

	const handleCellClick = (row: any, column: any) => {
		if (viewType === 'table_with_checkbox') {
			toggleRowCheckboxSelection(row[uniqueFieldName]);
		}
	};

	return (
		<div>
			<div>
				<div className="modal-backdrop fade show" onClick={closePopup}></div>
			</div>
			{popupPositionDefault.x !== 0 && popupPositionDefault.y !== 0 && (
				<div
					className={`cell_popup_grid ${className}`}
					style={{
						top: `${(popupPositionDefault.y / window.innerHeight) * 100}%`,
						left: `${(popupPositionDefault.x / window.innerWidth) * 100}%`
					}}>
					<div className="popup">
						<div className="blanket"></div>

						<div className="d-flex">
							<div className="lblFind">Find: </div>
							<input
								ref={searchTextRef}
								className="txtsearch_in_cell_popup"
								type="text"
								placeholder="Search..."
								value={searchText}
								onChange={e => setSearchText(e.target.value)}
							/>
						</div>

						<div
							style={{
								height: popupPosition.height,
								maxHeight: popupPosition.maxHeight || '300px'
							}}>
							{(viewType === 'table_with_checkbox' ||
								viewType === 'table_without_checkbox') && (
								<div
									id="style-2"
									role="region"
									aria-labelledby="caption"
									tabIndex={0}>
									<table
										id="cellTable"
										className="cell_popup_table"
										ref={tableRef} // Attach the ref to the table
										tabIndex={0} // Enable keyboard focus
									>
										<thead className="table_fix_header">
											<tr>
												{viewType === 'table_with_checkbox' && (
													<th>
														<input
															type="checkbox"
															style={{ display: 'flex' }}
															checked={selectAll}
															onChange={toggleSelectAll}
														/>
													</th>
												)}
												{gridConfig.columns?.map(
													(column: any, index: any) => (
														<th key={index}>{column.displayField}</th>
													)
												)}
											</tr>
										</thead>
										<tbody>
											{filteredData?.map((row: any, index: any) => (
												<tr
													key={index}
													// onClick={() => moveVisualSelection(row[uniqueFieldName])}
													className={`${
														visualSelectedRow === row[uniqueFieldName]
															? 'visualSelectedRow'
															: ''
													} ${
														selectedRows.has(row[uniqueFieldName])
															? 'selected_row'
															: ''
													}`}
													onClick={() => {
														// Check if it's a double click (within 500 milliseconds)
														const now = new Date().getTime();
														const clickDelta =
															now - (row.lastClickTime || 0);
														if (clickDelta < 500) {
															// Double click detected
															handleDoubleClick(row[uniqueFieldName]);
														} else {
															// Single click
															row.lastClickTime = now;
															setVisualSelectedRow(
																row[uniqueFieldName]
															);
														}
													}}>
													{viewType === 'table_with_checkbox' && (
														<td>
															<input
																type="checkbox"
																style={{
																	display: 'flex',
																	height: '12px'
																}}
																checked={selectedRows.has(
																	row[uniqueFieldName]
																)}
																onChange={() =>
																	toggleRowCheckboxSelection(
																		row[uniqueFieldName]
																	)
																}
															/>
														</td>
													)}
													{gridConfig.columns.map(
														(column: any, colIndex: any) => (
															<td
																// onClick={() =>
																// 	toggleRowCheckboxSelection(
																// 		row[uniqueFieldName]
																// 	)
																// }
																onClick={() =>
																	handleCellClick(row, column)
																}
																key={colIndex}>
																{row[column.valueField]}
															</td>
														)
													)}
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}

							{viewType === 'list_view' && (
								<div className="list_item_container">
									{data.map((item: any, index: any) => (
										<div className="list_item" key={index}>
											<div className="round_button_container">
												<div
													className="round_button"
													onClick={() =>
														handleToggle('selectedCheckmark', item.id)
													}>
													{item.selectedCheckmark && (
														<div className="checkbox_selected"></div>
													)}
													{!item.selectedCheckmark && (
														<div className="checkbox_not_selected"></div>
													)}
												</div>
												<div
													className="round_button"
													onClick={() =>
														handleToggle('selectedCrossmark', item.id)
													}>
													{item.selectedCrossmark && (
														<div className="crossmark"></div>
													)}
													{!item.selectedCrossmark && (
														<div className="cross_mark_not_selected"></div>
													)}
												</div>
											</div>
											<div className="list_item_name">{item.name}</div>
										</div>
									))}
								</div>
							)}
						</div>
						<div className="select_button_container">
							<button className="btnSucess" onClick={selectPopupButtonClick}>
								Select
							</button>
							<button className="btnClose" onClick={closePopup}>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ReactDataGridCellPopup;
``;
