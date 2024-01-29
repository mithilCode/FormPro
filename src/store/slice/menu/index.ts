import { createSlice } from '@utils/@reduxjs/toolkit'; // Importing from `utils` makes them more type-safe ✅

import { useInjectReducer } from '@utils/redux-injectors'; //, useInjectSaga

import { menuState } from './types';

// import { createSlice } from '@app/utils/@reduxjs/toolkit'; // Importing from `utils` makes them more type-safe ✅
// import { PayloadAction } from '@reduxjs/toolkit';

// initial state
export const initialState: menuState = {
	openItem: ['dashboard'],
	openComponent: 'buttons',
	selectedID: null,
	drawerOpen: false,
	componentDrawerOpen: true,
	menuDashboard: {
		id: 'group-dashboard',
		title: 'dashboard',
		type: 'group',
		icon: 'dashboardOutlined',
		children: [
			{
				id: 'dashboard',
				title: 'dashboard',
				type: 'collapse',
				icon: 'dashboardOutlined',
				children: [
					// {
					// 	id: 'default',
					// 	title: 'default',
					// 	type: 'item',
					// 	url: '/dashboard/default',
					// 	breadcrumbs: false
					// },
					{
						id: 'analytics',
						title: 'analytics',
						type: 'item',
						url: '/dashboard/analytics',
						breadcrumbs: false
					}
				]
			},
			// {
			// 	id: 'components',
			// 	title: 'components',
			// 	type: 'item',
			// 	url: '/components-overview/buttons',
			// 	icon: 'goldOutlined',
			// 	target: true,
			// 	chip: {
			// 		label: 'new',
			// 		color: 'primary',
			// 		size: 'small',
			// 		variant: 'combined'
			// 	}
			// }
		]
	},

	error: null
};

// ==============================|| SLICE - MENU ||============================== //

// export const fetchDashboard = async () => {
// 	// return response.data;
// 	const dashboard = {
// 		id: 'group-dashboard',
// 		title: 'dashboard',
// 		type: 'group',
// 		icon: 'dashboardOutlined',
// 		children: [
// 			{
// 				id: 'dashboard',
// 				title: 'dashboard',
// 				type: 'collapse',
// 				icon: 'dashboardOutlined',
// 				children: [
// 					{
// 						id: 'default',
// 						title: 'default',
// 						type: 'item',
// 						url: '/dashboard/default',
// 						breadcrumbs: false
// 					},
// 					{
// 						id: 'analytics',
// 						title: 'analytics',
// 						type: 'item',
// 						url: '/dashboard/analytics',
// 						breadcrumbs: false
// 					}
// 				]
// 			},
// 			{
// 				id: 'components',
// 				title: 'components',
// 				type: 'item',
// 				url: '/components-overview/buttons',
// 				icon: 'goldOutlined',
// 				target: true,
// 				chip: {
// 					label: 'new',
// 					color: 'primary',
// 					size: 'small',
// 					variant: 'combined'
// 				}
// 			}
// 		]
// 	};

// 	return dashboard;
// };

const menuSlice = createSlice({
	name: 'menu',
	initialState,
	reducers: {
		activeItem(state, action) {
			state.openItem = action.payload.openItem;
		},
		activeID(state, action) {
			state.selectedID = action.payload;
		},

		activeComponent(state, action) {
			state.openComponent = action.payload.openComponent;
		},

		openDrawer(state, action) {
			state.drawerOpen = action.payload.drawerOpen;
		},

		openComponentDrawer(state, action) {
			state.componentDrawerOpen = action.payload.componentDrawerOpen;
		},

		getMenuSuccess(state, action) {
			state.menuDashboard = action.payload;
		},

		hasError(state, action) {
			state.error = action.payload;
		}
	}

	// extraReducers(builder) {
	// 	builder.addCase(fetchDashboard, (state, action) => {
	// 		state.menuDashboard = action.payload.dashboard;
	// 	});
	// }
});

/**
 * `actions` will be used to trigger change in the state from where ever you want
 */
export const { actions: menuActions, reducer } = menuSlice;

/**
 * Let's turn this into a hook style usage. This will inject the slice to redux store and return actions in case you want to use in the component
 */
export const useMenuSlice = () => {
	useInjectReducer({ key: menuSlice.name, reducer: menuSlice.reducer });
	//useInjectSaga({ key: globalSlice.name, saga: Saga });
	return { actions: menuSlice.actions };
};
