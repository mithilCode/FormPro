const users = [
	{
		idUser: '5e86809283e28b96d2d38537',
		Email: 'info@codedthemes.com',
		Password: '123456',
		FirstName: 'Dharmesh',
		LastName: 'Patel',
		RoleType: ['Admin', 'Sales'],
		From: 'browser',
		ParentCompany: '5e86809283e28b96d2d7777',
		UserType: 'Admin',
		AuthRoles: {
			Area: { Role: ['area:add', 'area:edit'] },
			State: { Role: ['state:add', 'state:edit', 'state:delete'] },
			City: { Role: ['city:add', 'city:edit', 'city:delete'] },
			Dashboard: { Role: ['dashboard:view'] },
			Maintenance: { Role: ['maintenance:view'] }
		},
		Settings: {
			fontFamily: "'Public Sans', sans-serif",
			i18n: 'en',
			menuOrientation: 'vertical',
			miniDrawer: true,
			container: true,
			mode: 'light',
			presetColor: 'default',
			themeDirection: 'ltr'
		},
		Shortcuts: []
	},
	{
		idUser: '5e86809283e28b96d2d38547',
		Email: 'info1@codedthemes.com',
		Password: '123456',
		FirstName: 'JWY',
		LastName: 'User1',
		RoleType: ['Admin', 'Sales'],
		From: 'browser',
		ParentCompany: '5e86809283e28b96d2d7777',
		UserType: 'Admin',
		AuthRoles: {
			Area: { Role: ['area:add', 'area:edit'] },
			State: { Role: ['state:add', 'state:edit', 'state:delete'] },
			City: { Role: ['city:add', 'city:edit', 'city:delete'] },
			Dashboard: { Role: ['dashboard:view'] },
			Maintenance: { Role: ['maintenance:view'] }
		},
		Settings: {
			fontFamily: "'Public Sans', sans-serif",
			i18n: 'fr',
			menuOrientation: 'vertical',
			miniDrawer: true,
			container: true,
			mode: 'light',
			presetColor: 'theme5',
			themeDirection: 'ltr'
		},
		Shortcuts: []
	},
	{
		idUser: '5e86809283e28b96d2d38557',
		Email: 'info2@codedthemes.com',
		Password: '123456',
		FirstName: 'JWT',
		LastName: 'User2',
		RoleType: ['Admin', 'Sales'],
		From: 'browser',
		ParentCompany: '5e86809283e28b96d2d7777',
		UserType: 'Admin',
		AuthRoles: {
			Area: { Role: ['area:add', 'area:edit'] },
			State: { Role: ['state:add', 'state:edit', 'state:delete'] },
			City: { Role: ['city:add', 'city:edit', 'city:delete'] },
			Dashboard: { Role: ['dashboard:view'] },
			Maintenance: { Role: ['maintenance:view'] }
		},
		Settings: {
			fontFamily: "'Public Sans', sans-serif",
			i18n: 'en',
			menuOrientation: 'vertical',
			miniDrawer: true,
			container: true,
			mode: 'dark',
			presetColor: 'default',
			themeDirection: 'ltr'
		},
		Shortcuts: []
	}
];

export default users;

// const user = {
// 	role: [tokenData.RoleType],
// 	from: 'browser',
// 	data: {
// 		displayName: tokenData.FirstName + ' ' + tokenData.LastName,
// 		photoURL:
// 			tokenData.Files && tokenData.Files[0] && tokenData.Files[0].File ? tokenData.Files[0].File : '',
// 		email: tokenData.Email,
// 		ParentCompany: tokenData.ParentCompany,
// 		UserType: tokenData.UserType,
// 		settings: tokenData.Settings && tokenData.Settings.Theme ? tokenData.Settings.Theme : {},
// 		shortcuts:
// 			tokenData.Settings && tokenData.Settings.Shortcut ? tokenData.Settings.Shortcut.split(',') : []
// 	}
// };
