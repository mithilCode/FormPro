import _ from 'lodash';

// ==============================|| CUSTOM FUNCTION - COLORS ||============================== //

class InfiniteUtils {
	static generateRoutesFromConfigs(configs: any, defaultAuth: any) {
		let allRoutes = [] as any;
		configs.forEach((config: any) => {
			allRoutes = [...allRoutes, ...this.setRoutes(config, defaultAuth)];
		});

		return allRoutes;
	}

	static setRoutes(config: any, defaultAuth: any) {
		const routes = [...config.routes];
		const allRoutes = [] as any;

		for (let index = 0; index < routes.length; index++) {
			const element = routes[index];

			const filterRoutes = InfiniteUtils.removeFromArrayOfObj1(
				element.children,
				'permission',
				false
			);

			element.children = filterRoutes;

			let auth = config.auth || config.auth === null ? config.auth : defaultAuth || null;

			auth = element.auth || element.auth === null ? element.auth : auth;
			const settings = _.merge({}, config.settings, element.settings);

			if (auth && auth.length === 0) {
				return [];
			}

			allRoutes.push({
				...element,
				settings,
				auth
			});
		}

		return [...allRoutes];

		// let routes = [...config.routes];

		// routes = routes.map(route => {
		// 	let auth = config.auth || config.auth === null ? config.auth : defaultAuth || null;

		// 	auth = route.auth || route.auth === null ? route.auth : auth;
		// 	const settings = _.merge({}, config.settings, route.settings);

		// 	if (auth && auth.length === 0) {
		// 		return [];
		// 	}

		// 	return {
		// 		...route,
		// 		settings,
		// 		auth
		// 	};
		// });

		// return [...routes];
	}

	static generateMenusFromConfigs = (configs: any, defaultPermission: any) => {
		let allMenus = [] as any;
		configs.forEach((config: any) => {
			allMenus = [...allMenus, ...this.setMenus(config, defaultPermission)];
		});

		return allMenus;
	};

	static setMenus(config: any, defaultPermission: any) {
		let menus = [...config.menus];

		menus = menus.map(menu => {
			let permission =
				config.permission || config.permission === null
					? config.permission
					: defaultPermission || null;

			permission = menu.permission || menu.permission === null ? menu.permission : permission;

			if (permission && permission.length === 0) {
				return [];
			}

			return {
				...menu,
				permission
			};
		});

		return [...menus];
	}

	// static getFlatNavigation(navigationItems: any, flatNavigation: any) {
	// 	console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTT', typeof navigationItems);

	// 	for (let i = 0; i < navigationItems.length; i += 1) {
	// 		const navItem = navigationItems[i];

	// 		console.log('YYYYYYYYYYYYYYYYY', navItem);

	// 		if (navItem.type === 'item') {
	// 			console.log('UTILSLSLSL', navItem, navItem?.permission === false);

	// 			if (navItem && navItem?.permission === false) {
	// 				console.log('YESYSYSYS');

	// 				// navItem.splice(i, 1);
	// 			} else {
	// 				flatNavigation.push(navItem);
	// 			}
	// 		}

	// 		if (navItem.type === 'collapse' || navItem.type === 'group') {
	// 			if (navItem.children) {
	// 				this.getFlatNavigation(navItem.children, flatNavigation);
	// 			}
	// 		}
	// 	}

	// 	console.log('RRETURNR-flatNavigation', flatNavigation);

	// 	return flatNavigation;
	// }

	static async removeFromArrayOfObj(array: any, objKey: string, objValue: any) {
		// array
		// 	.slice()
		// 	.reverse()
		// 	.forEach(async (e: any, index: number) => {
		// 		if (typeof e === 'object' && !Array.isArray(e) && e !== null) {
		// 			if (e[objKey] === objValue) {
		// 				array.splice(index, 1);
		// 				console.log(
		// 					'IIIIIIIIIIIIIIIIIII',
		// 					objKey,
		// 					e[objKey],
		// 					e['id'],
		// 					objValue,
		// 					e[objKey] === objValue,
		// 					e
		// 				);
		// 				// continue;
		// 			}
		// 			if (e.children) {
		// 				this.removeFromArrayOfObj(e.children, objKey, objValue);
		// 			}
		// 		}
		// 	});

		// array.forEach(async (e: any, index: number) => {
		// 	// each element takes a different amount of time to complete
		// 	if (e.children && e.children.length === 0) {
		// 		array.splice(index, 1);
		// 	}
		// });

		//dx

		// await array.reduce(async (memo: any, i: any) => {
		// 	await memo;
		// 	// await sleep(10 - i);

		// 	if (i.children && i.children.length === 0) {
		// 		// array.splice(1);
		// 	}
		// 	console.log(i, i.children);
		// }, undefined);

		for (let i = array.length - 1; i >= 0; --i) {
			const e = array[i];
			/*this conndi add by Ravi Prajapati */
			if(e.id !== "group-dashboard" && e.id !== "group-masters")
			{
				array.splice(i, 1);
			}
			else
			{
				if (typeof e === 'object' && !Array.isArray(e) && e !== null) {
					if (e[objKey] === objValue) {
						array.splice(i, 1);
						continue;
					}
				}
				// if (e.children) {
				// 	this.removeFromArrayOfObj(e.children, objKey, objValue);
				// }
			}

		}

		/*this remove by Ravi Prajapati(original loop)*/

		// for (let i = array.length - 1; i >= 0; --i) {
		// 	const e = array[i];
		// 		if (typeof e === 'object' && !Array.isArray(e) && e !== null) {
		// 			if (e[objKey] === objValue) {
		// 				array.splice(i, 1);
		// 				continue;
		// 			}
		// 		}
		// 		if (e.children) {
		// 			this.removeFromArrayOfObj(e.children, objKey, objValue);
		// 		}
		// }
		/*this remove by Ravi Prajapati(original loop)*/


		// // Remove empty children from object
		// console.log('AYAYAYYAYA');

		for (let j = array.length - 1; j >= 0; --j) {
			const e = array[j];
			if (typeof e === 'object' && !Array.isArray(e) && e !== null) {
				if (Array.isArray(e.children)) {
					if (e.children && e.children.length === 0) {
						array.splice(j, 1);
					}
				}
			}
		}

		return array;

		// for (const [i, e] of array.entries()) {
		// 	if (e['id'] === 'menu-level-3.1' || e['id'] === 'menu-level-3.2') {
		// 		console.log('ARRRRRRRRRRRRRRRRRAY LENGTH', e, array.length, array[i]);
		// 	}
		// 	// console.log('ARRRRRRRRRRRRRRRRRAY LENGTH', array.length, array[i]);
		// 	if (e[byRemove] === toRemove) {
		// 		console.log(e[byRemove], toRemove, e[byRemove] === toRemove);
		// 		array.splice(i, 1);
		// 		continue;
		// 	}
		// 	if (e.children) {
		// 		console.log('E>CHILDRESSS', e.children);
		// 		this.removeFromArrayOfObj(e.children, toRemove, byRemove);
		// 	}
		// }
		// // for (const [i, e] of array.entries()) {
		// // 	if (e.children && e.children.length === 0) {
		// // 		array.splice(i, 1);
		// // 	}
		// // }
		// return array;
	}

	static removeFromArrayOfObj1(array: any, objKey: string, objValue: any) {
		for (let i = array.length - 1; i >= 0; --i) {
			const e = array[i];
			if (typeof e === 'object' && !Array.isArray(e) && e !== null) {
				if (e[objKey] === objValue) {
					array.splice(i, 1);
					continue;
				}
			}
			if (e.children) {
				this.removeFromArrayOfObj1(e.children, objKey, objValue);
			}
		}

		// // Remove empty children from object

		for (let j = array.length - 1; j >= 0; --j) {
			const e = array[j];
			if (typeof e === 'object' && !Array.isArray(e) && e !== null) {
				if (Array.isArray(e.children)) {
					if (e.children && e.children.length === 0) {
						array.splice(j, 1);
					}
				}
			}
		}

		return array;
	}

	// static abc(array: any, objKey: string, objValue: any) {}
}

export default InfiniteUtils;

// import _ from 'lodash';

// // ==============================|| CUSTOM FUNCTION - COLORS ||============================== //

// const generateRoutesFromConfigs = (configs: any, defaultAuth: any) => {
// 	let allRoutes = [] as any;
// 	configs.forEach((config: any) => {
// 		allRoutes = [...allRoutes, ...setRoutes(config, defaultAuth)];
// 	});
// 	return allRoutes;
// };

// function setRoutes(config: any, defaultAuth: any) {
// 	let routes = [...config.routes];

// 	routes = routes.map(route => {
// 		console.log('ROUTESSSS', route.children.length);

// 		// route.children.map((item2: any) => {
// 		// 	return console.log(WrapperRouteComponent(item2.element));
// 		// });

// 		// for (let index = 0; index < 4; index++) {
// 		// 	const element = route.children[index];
// 		// 	route = element;
// 		// }

// 		let auth = config.auth || config.auth === null ? config.auth : defaultAuth || null;
// 		auth = route.auth || route.auth === null ? route.auth : auth;
// 		const settings = _.merge({}, config.settings, route.settings);

// 		return {
// 			...route,
// 			settings,
// 			auth
// 		};
// 	});

// 	return [...routes];
// }

// export default generateRoutesFromConfigs;
