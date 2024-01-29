const useFocusOnEnter = (formRef: any, errors?: any) => {
	const onEnterKey = (event: any) => {
		// event.preventDefault();

		if (event && event.keyCode && event.keyCode === 13) {
			focusNextElement();
		}
	};

	const onFirstElementFocus = () => {
		const elements = getAllElements();
		focusFirstElement(elements);
	};

	const getAllElements = () => {
		const parentNode = formRef.current;
		const elements = parentNode.querySelectorAll(
			'button, input, textarea, select, [data-name="scroller"]'
		);
		const filteredElems: any = [];

		[...elements].forEach((el: any) => {
			const calIcon = el.querySelector('[data-testid="CalendarIcon"]');
			if (!calIcon) {
				filteredElems.push(el);
			}
		});

		return filteredElems;
	};

	const getActiveElement = () => {
		const activeNode = document.activeElement;
		return activeNode;
	};

	const getCurrentIndex = (elements: any, activeElementNode: any) => {
		let currentIndex;
		for (let i = 0; i < elements.length; i++) {
			if (elements[i] == activeElementNode) {
				currentIndex = i;
			}
		}

		return currentIndex;
	};

	const isFocusableElement = (element: any) => {
		return !element.hidden && !element.disabled;
	};

	const focusFirstElement = (elements: any) => {
		elements[0].focus();
	};

	const getNextElement = (elements: any, currentIndex: any) => {
		let element;
		for (let i = 0; i < elements.length; i++) {
			if (currentIndex < i && !element) {
				// let tmpElement = elements.item(i);
				let tmpElement = elements[i];
				if (tmpElement.tabIndex === -1) {
					continue;
				}
				if (isFocusableElement(tmpElement)) {
					element = tmpElement;
					break;
				}
			}
		}

		return element;
	};

	const focusNextElement = () => {
		const elements = getAllElements();
		const activeElementNode = getActiveElement();

		const currentIndex = getCurrentIndex(elements, activeElementNode);
		if (Object.keys(errors).length !== 0) {
			const splitEleName = elements[currentIndex as any].name.split('.');
			if (splitEleName.length > 1) {
				const objName = splitEleName[0];
				const eleName = splitEleName[1];

				if (errors[objName][eleName]) return;
			} else {
				if (errors[elements[currentIndex as any].name]) return;
			}
		}

		let nextElement = getNextElement(elements, currentIndex);

		if (nextElement) {
			nextElement.focus();
		} else {
			if (nextElement === 'b') focusFirstElement(elements);
		}
	};

	return { onEnterKey, onFirstElementFocus };
};

export default useFocusOnEnter;

// const useFocusOnEnter = (formRef: any, errors: any, tableRef: any) => {
// 	const onEnterKey = (event: any) => {
// 		if (event && event.keyCode && event.keyCode === 13 && event.target && event.target.form) {
// 			const form = event.target.form;
// 			const index = Array.prototype.indexOf.call(form, event.target);

// 			if (!errors[formRef.current[index].name]) {
// 				for (let i = index + 1; i < formRef.current.length; i++) {
// 					if (formRef.current[index].id === 'focus-on-table') {
// 						tableRef.current.focus();
// 						break;
// 					}
// 					if (formRef.current[i].tabIndex === -1) {
// 						continue;
// 					}

// 					formRef.current[i].focus();
// 					if (document.activeElement === formRef.current[i]) {
// 						break;
// 					}
// 				}
// 			}
// 		}
// 	};

// 	return { onEnterKey };
// };

// export default useFocusOnEnter;
