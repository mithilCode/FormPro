module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: [
		'prettier',
		'react', //not in mantis
		'react-hooks', //not in mantis
		'@typescript-eslint',
		'simple-import-sort', //not in mantis
		'import' //not in mantis
	],
	extends: [
		'eslint:recommended', //not in mantis
		'plugin:react/recommended', //not in mantis
		'plugin:prettier/recommended', //not in mantis
		'plugin:@typescript-eslint/recommended' //not in mantis
		// In mantis
		// "react-app", "prettier"
	],
	rules: {
		eqeqeq: 'error',
		'no-console': 'warn',
		'prettier/prettier': 'error',
		'react/display-name': 'off',
		'react/no-children-prop': 'off',
		// if you use React 17+; otherwise, turn this on
		'react/react-in-jsx-scope': 'off',
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 0, //'warn',
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
		'import/first': 'error',
		'import/newline-after-import': 'error',
		'import/no-duplicates': 'off',
		'@typescript-eslint/no-explicit-any': ['off'],
		'react/prop-types': [2], // In mantis "off"
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				vars: 'all',
				args: 'none'
			}
		]
		// In mantis
		// "react/jsx-filename-extension": "off",
		// "no-param-reassign": "off",
		// "react/require-default-props": "off",
		// "react/no-array-index-key": "off",
		// "react/jsx-props-no-spreading": "off",
		// "import/order": "off",
		// "no-console": "off",
		// "no-shadow": "off",
		// "@typescript-eslint/naming-convention": "off",
		// "@typescript-eslint/no-shadow": "off",
		// "import/no-cycle": "off",
		// "import/no-extraneous-dependencies": "off",
		// "jsx-a11y/label-has-associated-control": "off",
		// "jsx-a11y/no-autofocus": "off",
		// "no-restricted-imports": [
		// 	"error",
		// 	{
		// 	  "patterns": ["@mui/*/*/*", "!@mui/material/test-utils/*"]
		// 	}
		//   ],
		//   "@typescript-eslint/no-unused-vars": [
		// 	"error",
		// 	{
		// 	  "vars": "all",
		// 	  "args": "none"
		// 	}
		//   ],
		//   "prettier/prettier": [
		// 	"warn",
		// 	{
		// 	  "bracketSpacing": true,
		// 	  "printWidth": 140,
		// 	  "singleQuote": true,
		// 	  "trailingComma": "none",
		// 	  "tabWidth": 2,
		// 	  "useTabs": false,
		// 	  "endOfLine": "auto"
		// 	}
		//   ]
	},
	settings: {
		'import/resolver': {
			node: {
				moduleDirectory: ['node_modules', 'src/']
			},
			typescript: {
				alwaysTryTypes: true
			}
		}
	},
	overrides: [
		// override "simple-import-sort" config
		// https://dev.to/julioxavierr/sorting-your-imports-with-eslint-3ped
		{
			files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
			rules: {
				'simple-import-sort/imports': [
					'error',
					{
						groups: [
							// Node.js builtins. You could also generate this regex if you use a `.js` config.
							// For example: `^(${require("module").builtinModules.join("|")})(/|$)`
							// Note that if you use the `node:` prefix for Node.js builtins,
							// you can avoid this complexity: You can simply use "^node:".
							[
								'^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)'
							],
							// Packages. `react` related packages come first.
							['^react', '@reduxjs', '^(@mui)(/.*|$)', '^(@ant-design)(/.*|$)'], //, '^@?\\w'
							// Packages.
							// Things that start with a letter (or digit or underscore), or `@` followed by a letter.
							['^\\w'],
							// Anything not matched in another group.
							['^'],
							// Relative imports.
							// Anything that starts with a dot.
							['^\\.'],
							// Internal packages.
							//dx ['^(@|@company|@mui|@ui|components|utils|config|vendored-lib)(/.*|$)'],
							// Side effect imports.
							//dx ['^\\u0000'],
							// Parent imports. Put `..` last.
							//dx ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
							// Other relative imports. Put same-folder imports and `.` last.
							//dx ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
							// Style imports.
							['^.+\\.s?css$']

							// // Packages `react` related packages come first.
							// ['^react', '^@?\\w'],
							// // Internal packages.
							// ['^(@|components)(/.*|$)'],
							// // Side effect imports.
							// ['^\\u0000'],
							// // Parent imports. Put `..` last.
							// ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
							// // Other relative imports. Put same-folder imports and `.` last.
							// ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
							// // Style imports.
							// ['^.+\\.?(css)$']
						]
					}
				]
			}
		}
	],
	parserOptions: {
		ecmaVersion: 6, //not in mantis
		sourceType: 'module', //not in mantis
		ecmaFeatures: {
			//not in mantis
			jsx: true
		}
		//In mantis
		// "project": "./tsconfig.json"
	},
	env: {
		browser: true,
		node: true,
		es6: true,
		jest: true
	},
	ignorePatterns: ['node_modules', 'build', 'dist', 'public']
};

// module.exports = {
// 	plugins: ['prettier', '@typescript-eslint'],
// 	extends: ['react-app', 'prettier'],
// 	parser: '@typescript-eslint/parser',
// 	parserOptions: {
// 		project: './tsconfig.json'
// 	},
// 	settings: {
// 		'import/resolver': {
// 			node: {
// 				moduleDirectory: ['node_modules', 'src/']
// 			},
// 			typescript: {
// 				alwaysTryTypes: true
// 			}
// 		}
// 	},
// 	rules: {
// 		'react/jsx-filename-extension': 'off',
// 		'no-param-reassign': 'off',
// 		'react/prop-types': 'off',
// 		'react/require-default-props': 'off',
// 		'react/no-array-index-key': 'off',
// 		'react/react-in-jsx-scope': 'off',
// 		'react/jsx-props-no-spreading': 'off',
// 		'import/order': 'off',
// 		'no-console': 'off',
// 		'no-shadow': 'off',
// 		'@typescript-eslint/naming-convention': 'off',
// 		'@typescript-eslint/no-shadow': 'off',
// 		'import/no-cycle': 'off',
// 		'import/no-extraneous-dependencies': 'off',
// 		'jsx-a11y/label-has-associated-control': 'off',
// 		'jsx-a11y/no-autofocus': 'off',
// 		'no-restricted-imports': [
// 			'error',
// 			{
// 				patterns: ['@mui/*/*/*', '!@mui/material/test-utils/*']
// 			}
// 		],
// 		'@typescript-eslint/no-unused-vars': [
// 			'error',
// 			{
// 				vars: 'all',
// 				args: 'none'
// 			}
// 		],
// 		'prettier/prettier': [
// 			'warn',
// 			{
// 				bracketSpacing: true,
// 				printWidth: 140,
// 				singleQuote: true,
// 				trailingComma: 'none',
// 				tabWidth: 2,
// 				useTabs: false,
// 				endOfLine: 'auto'
// 			}
// 		]
// 	}
// };

// module.exports = {
// 	parser: '@typescript-eslint/parser',
// 	plugins: [
// 		'prettier',
// 		'react',
// 		'react-hooks',
// 		'@typescript-eslint',
// 		'simple-import-sort',
// 		'import'
// 	],
// 	extends: [
// 		'eslint:recommended',
// 		'plugin:react/recommended',
// 		'plugin:prettier/recommended',
// 		'plugin:@typescript-eslint/recommended'
// 	],
// 	rules: {
// 		eqeqeq: 'error',
// 		'no-console': 'warn',
// 		'prettier/prettier': 'error',
// 		'react/display-name': 'off',
// 		'react/no-children-prop': 'off',
// 		// if you use React 17+; otherwise, turn this on
// 		'react/react-in-jsx-scope': 'off',
// 		'react-hooks/rules-of-hooks': 'error',
// 		'react-hooks/exhaustive-deps': 0, //'warn',
// 		'simple-import-sort/imports': 'error',
// 		'simple-import-sort/exports': 'error',
// 		'import/first': 'error',
// 		'import/newline-after-import': 'error',
// 		'import/no-duplicates': 'error',
// 		'@typescript-eslint/no-explicit-any': ['off'],
// 		'react/prop-types': [2]
// 	},
// 	overrides: [
// 		// override "simple-import-sort" config
// 		// https://dev.to/julioxavierr/sorting-your-imports-with-eslint-3ped
// 		{
// 			files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
// 			rules: {
// 				'simple-import-sort/imports': [
// 					'error',
// 					{
// 						groups: [
// 							// Packages `react` related packages come first.
// 							['^react', '^@?\\w'],
// 							// Internal packages.
// 							['^(@|components)(/.*|$)'],
// 							// Side effect imports.
// 							['^\\u0000'],
// 							// Parent imports. Put `..` last.
// 							['^\\.\\.(?!/?$)', '^\\.\\./?$'],
// 							// Other relative imports. Put same-folder imports and `.` last.
// 							['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
// 							// Style imports.
// 							['^.+\\.?(css)$']
// 						]
// 					}
// 				]
// 			}
// 		}
// 	],
// 	parserOptions: {
// 		ecmaVersion: 6,
// 		sourceType: 'module',
// 		ecmaFeatures: {
// 			jsx: true
// 		}
// 	},
// 	env: {
// 		browser: true,
// 		node: true,
// 		es6: true,
// 		jest: true
// 	},
// 	ignorePatterns: ['node_modules', 'build', 'dist', 'public']
// };

// module.exports = {
// 	root: true,
// 	parser: '@typescript-eslint/parser',
// 	parserOptions: {
// 		// ecmaVersion: 6,
// 		// sourceType: 'module',
// 		// ecmaFeatures: {
// 		// 	jsx: true
// 		// }
// 		tsconfigRootDir: __dirname,
// 		//project: ['./tsconfig.eslint.json', './tsconfig.json']
// 	},
// 	plugins: [
// 		'@typescript-eslint',
// 		'prettier',
// 		'react',
// 		'react-hooks',
// 		// "prettier",
// 		// '@typescript-eslint',
// 		// // "react",
// 		'simple-import-sort',
// 		'import'
// 		// "react-hooks",
// 		// "prettier",
// 		// "jsx-a11y",
// 		// "babel"
// 	],
// 	extends: [
// 		'eslint:recommended',
// 		'plugin:@typescript-eslint/eslint-recommended',
// 		'plugin:@typescript-eslint/recommended',
// 		'plugin:prettier/recommended',
// 		'plugin:react/recommended',
// 		'plugin:@typescript-eslint/recommended-requiring-type-checking'

// 		// "standard-with-typescript",
// 		// "plugin:react-hooks/recommended",
// 		// "prettier",
// 		// "prettier/react",
// 		// "plugin:jsx-a11y/recommended",
// 		// "prettier/babel"
// 	],
// 	env: {
// 		browser: true,
// 		node: true,
// 		es6: true,
// 		jest: true
// 		// "browser": true,
// 		// "es2021": true,
// 		// "jest": true
// 	},
// 	overrides: [
// 		// override "simple-import-sort" config
// 		// https://dev.to/julioxavierr/sorting-your-imports-with-eslint-3ped
// 		{
// 			files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
// 			rules: {
// 				'simple-import-sort/imports': [
// 					'error',
// 					{
// 						groups: [
// 							// Packages `react` related packages come first.
// 							['^react', '^@?\\w'],
// 							// Internal packages.
// 							['^(@|components)(/.*|$)'],
// 							// Side effect imports.
// 							['^\\u0000'],
// 							// Parent imports. Put `..` last.
// 							['^\\.\\.(?!/?$)', '^\\.\\./?$'],
// 							// Other relative imports. Put same-folder imports and `.` last.
// 							['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
// 							// Style imports.
// 							['^.+\\.?(css)$']
// 						]
// 					}
// 				]
// 			}
// 		}
// 	],
// 	settings: {
// 		react: {
// 			version: 'detect'
// 		}
// 	},
// 	rules: {
// 		eqeqeq: 'error',
// 		'no-console': 'warn',
// 		'prettier/prettier': 'error',
// 		'react/display-name': 'off',
// 		'react/no-children-prop': 'off',
// 		// if you use React 17+; otherwise, turn this on
// 		'react/react-in-jsx-scope': 'off',
// 		'react-hooks/rules-of-hooks': 'error',
// 		'react-hooks/exhaustive-deps': 'warn',
// 		// "eqeqeq": "error",
// 		// "no-console": "warn",
// 		// "no-undef": "off",
// 		// "no-unused-vars": "off",
// 		// "prettier/prettier": "error",
// 		// "@typescript-eslint/explicit-module-boundary-types": "off",
// 		// "@typescript-eslint/explicit-function-return-type": "off",
// 		// "@typescript-eslint/no-explicit-any": "error",
// 		// "@typescript-eslint/no-unused-vars": "warn"
// 		// "react/jsx-filename-extension": 0, //dx
// 		// "jsx-a11y/anchor-is-valid": [  //dx
// 		//   "error",
// 		//   {
// 		//     "components": ["Link"],
// 		//     "specialLink": ["to"]
// 		//   }
// 		// ],
// 		// "react/destructuring-assignment": [ //dx
// 		//   "error",
// 		//   "always",
// 		//   {
// 		//     "ignoreClassFields": true
// 		//   }
// 		// ],
// 		// "prettier/prettier": "error", //dx
// 		// "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks  //dx
// 		// "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies //dx
// 		// "eqeqeq": "error", //dx
// 		// "no-console": "warn",  //dx
// 		// "react/react-in-jsx-scope": "off",
// 		// "@typescript-eslint/explicit-function-return-type": "off",
// 		'simple-import-sort/imports': 'error',
// 		'simple-import-sort/exports': 'error',
// 		'import/first': 'error',
// 		'import/newline-after-import': 'error',
// 		'import/no-duplicates': 'error'
// 		// "@typescript-eslint/triple-slash-reference": "off"
// 	}
// 	// ignorePatterns: ['node_modules', 'build', 'dist', 'public']
// };

// // parserOptions: {
// //   "ecmaVersion": "latest",
// //   "sourceType": "module",
// //   "project": ["tsconfig.json"]
// // },
// // globals: {
// //   page: true,
// //   REACT_APP_ENV: true,
// // },

// // https://www.aleksandrhovhannisyan.com/blog/format-code-on-save-vs-code-eslint/
// // https://blog.logrocket.com/using-prettier-eslint-automate-formatting-fixing-javascript/
// // https://www.aleksandrhovhannisyan.com/blog/format-code-on-save-vs-code-eslint/
