const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const ESLintPlugin = require('eslint-webpack-plugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');

const paths = require('./paths');
const modules = require('./modules');
const getClientEnvironment = require('./env');

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

const isEnvDevelopment =
	process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';
const isEnvProduction = process.env.NODE_ENV === 'production';

const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000');

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);

// // Check if Tailwind config exists
// const useTailwind = fs.existsSync(path.join(paths.appPath, 'tailwind.config.js'));

// // style files regexes
// const cssRegex = /\.css$/;
// const cssModuleRegex = /\.module\.css$/;
// const sassRegex = /\.(scss|sass)$/;
// const sassModuleRegex = /\.module\.(scss|sass)$/;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = getPublicUrlOrPath(
	process.env.NODE_ENV === 'development',
	require(paths.resolveApp('package.json')).homepage,
	process.env.PUBLIC_URL
);

const env = getClientEnvironment(publicUrlOrPath.slice(0, -1));

module.exports = {
	// These are the "entry points" to our application.
	// This means they will be the "root" imports that are included in JS bundle.
	entry: paths.appIndexJs,
	output: {
		// The build folder.
		path: paths.appBuild,
		// Add /* filename */ comments to generated require()s in the output.
		pathinfo: isEnvDevelopment,
		filename: '[name].[fullhash].js',
		chunkFilename: '[name].[chunkhash].js',
		clean: true,
		publicPath: publicUrlOrPath
	},
	module: {
		strictExportPresence: true,
		rules: [
			{
				// "oneOf" will traverse all following loaders until one will
				// match the requirements. When no loader matches it will fall
				// back to the "file" loader at the end of the loader list.
				oneOf: [
					// TODO: Merge this config once `image/avif` is in the mime-db
					// https://github.com/jshttp/mime-db
					{
						test: [/\.avif$/],
						type: 'asset',
						mimetype: 'image/avif',
						parser: {
							dataUrlCondition: {
								maxSize: imageInlineSizeLimit
							}
						}
					},
					// "url" loader works like "file" loader except that it embeds assets
					// smaller than specified limit in bytes as data URLs to avoid requests.
					// A missing `test` is equivalent to a match.
					{
						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
						type: 'asset',
						parser: {
							dataUrlCondition: {
								maxSize: imageInlineSizeLimit
							}
						}
					},
					{
						test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/, //|svg
						use: [
							{
								loader: 'file-loader',
								options: {
									name: '[name].[ext]',
									outputPath: 'fonts/'
								}
							}
						]
					},
					{
						test: /\.svg$/,
						use: [
							{
								loader: require.resolve('@svgr/webpack'),
								options: {
									prettier: false,
									svgo: false,
									svgoConfig: {
										plugins: [{ removeViewBox: false }]
									},
									titleProp: true,
									ref: true
								}
							},
							{
								loader: require.resolve('file-loader'),
								options: {
									name: 'static/media/[name].[hash].[ext]'
								}
							}
						],
						issuer: {
							and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
						}
					},
					{
						test: /\.svg$/,
						use: {
							loader: 'svg-url-loader'
						}
					},
					{
						test: /\.(js|jsx)$/,
						include: paths.appSrc,
						exclude: /node_modules/,
						loader: 'babel-loader',
						options: {
							// This is a feature of `babel-loader` for webpack (not Babel itself).
							// It enables caching results in ./node_modules/.cache/babel-loader/
							// directory for faster rebuilds.
							cacheDirectory: true,
							// See #6846 for context on why cacheCompression is disabled
							cacheCompression: false,
							compact: isEnvProduction
						}
					},
					{
						test: /\.(ts|tsx)$/,
						include: paths.appSrc,
						exclude: /node_modules/,
						use: [
							{
								loader: 'babel-loader',
								options: {
									presets: [
										'@babel/preset-env',
										'@babel/preset-react',
										'@babel/preset-typescript'
									],
									// This is a feature of `babel-loader` for webpack (not Babel itself).
									// It enables caching results in ./node_modules/.cache/babel-loader/
									// directory for faster rebuilds.
									cacheDirectory: true,
									// See #6846 for context on why cacheCompression is disabled
									cacheCompression: false,
									compact: isEnvProduction
								}
							},
							{
								loader: 'ts-loader',
								options: {
									compilerOptions: {
										noEmit: false
									}
								}
							}
						]
					},
					{
						test: /\.html$/,
						exclude: /node_modules/,
						use: [
							{
								loader: 'html-loader',
								options: { minimize: isEnvProduction }
							}
						]
					},
					{
						test: /\.css$/,
						include: paths.appSrc,
						// include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'web')],
						use: [
							isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
							{
								loader: 'css-loader',
								options: {
									sourceMap: isEnvProduction
										? shouldUseSourceMap
										: isEnvDevelopment
								}
							}
						]
					},
					{
						test: /\.s?[ac]ss$/,
						use: [
							isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
							{
								loader: 'css-loader',
								options: {
									sourceMap: isEnvProduction
										? shouldUseSourceMap
										: isEnvDevelopment
								}
							},
							{
								loader: 'sass-loader',
								options: {
									sourceMap: isEnvProduction
										? shouldUseSourceMap
										: isEnvDevelopment
								}
							}
						]
					},
					{
						test: /\.less$/,
						use: [
							{
								loader: 'style-loader' // creates style nodes from JS strings
							},
							{
								loader: 'css-loader' // creates style nodes from JS strings
							},
							{
								loader: 'sass-loader',
								options: {
									sourceMap: isEnvProduction
										? shouldUseSourceMap
										: isEnvDevelopment
								}
							},
							{
								loader: 'less-loader', // compiles Less to CSS
								options: {
									sourceMap: isEnvProduction
										? shouldUseSourceMap
										: isEnvDevelopment
								}
							}
						]
					}
				]
			}
		]
	},
	resolve: {
		// This allows you to set a fallback for where webpack should look for modules.
		// We placed these paths second because we want `node_modules` to "win"
		// if there are any conflicts. This matches Node resolution mechanism.
		// https://github.com/facebook/create-react-app/issues/253
		modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
		// These are the reasonable defaults supported by the Node ecosystem.
		// We also include JSX as a common component filename extension to support
		// some tools, although we do not recommend using it, see:
		// https://github.com/facebook/create-react-app/issues/290
		// `web` extension prefixes have been added for better support
		// for React Native Web.
		extensions: paths.moduleFileExtensions
			.map(ext => `.${ext}`)
			.filter(ext => useTypeScript || !ext.includes('ts')),
		// extensions: ['.tsx', '.ts', '.js', '.jsx'],
		alias: {
			'@app': path.resolve(__dirname, '../src'),
			'@apptypes': path.resolve(__dirname, '../src/types'),
			'@assets': path.resolve(__dirname, '../src/assets'),
			'@components': path.resolve(__dirname, '../src/components'),
			'@contexts': path.resolve(__dirname, '../src/contexts'),
			'@global': path.resolve(__dirname, '../src/global'),
			'@hooks': path.resolve(__dirname, '../src/hooks'),
			'@interface': path.resolve(__dirname, '../src/interface'),
			'@layout': path.resolve(__dirname, '../src/layout'),
			'@locales': path.resolve(__dirname, '../src/locales'),
			'@pages': path.resolve(__dirname, '../src/pages'),
			'@routes': path.resolve(__dirname, '../src/routes'),
			'@store': path.resolve(__dirname, '../src/store'),
			'@sections': path.resolve(__dirname, '../src/sections'),
			'@services': path.resolve(__dirname, '../src/services'),
			'@styles': path.resolve(__dirname, '../src/styles'),
			'@themes': path.resolve(__dirname, '../src/themes'),
			'@utils': path.resolve(__dirname, '../src/utils'),
			...(modules.webpackAliases || {})
		},
		plugins: [
			// Prevents users from importing files from outside of src/ (or node_modules/).
			// This often causes confusion because we only process files within src/ with babel.
			// To fix this, we prevent you from importing files out of src/ -- if you'd like to,
			// please link the files into your node_modules/ and let module-resolution kick in.
			// Make sure your source files are compiled, as they will not be processed in any way.
			new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
		],
		fallback: {
			// assert: require.resolve('assert'),
			// process: require.resolve('process/browser'),
			crypto: require.resolve('crypto-browserify'),
			// http: require.resolve('stream-http'),
			// https: require.resolve('https-browserify'),
			// os: require.resolve('os-browserify/browser'),
			stream: require.resolve('stream-browserify'),
			buffer: require.resolve('buffer')
		}
	},
	plugins: [
		// htmlWebpackPlugin,
		new HtmlWebPackPlugin(
			Object.assign(
				{},
				{
					inject: true,
					template: paths.appHtml
				},
				isEnvProduction
					? {
							minify: {
								removeComments: true,
								collapseWhitespace: true,
								removeRedundantAttributes: true,
								useShortDoctype: true,
								removeEmptyAttributes: true,
								removeStyleLinkTypeAttributes: true,
								keepClosingSlash: true,
								minifyJS: true,
								minifyCSS: true,
								minifyURLs: true
							}
					  }
					: undefined
			)
		),
		// new BundleAnalyzerPlugin({
		// 	// Port that will be used by in `server` mode to start HTTP server.
		// 	analyzerPort: 4000
		// }),

		// Makes some environment variables available in index.html.
		// The public URL is available as %PUBLIC_URL% in index.html, e.g.:
		// <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
		// It will be an empty string unless you specify "homepage"
		// in `package.json`, in which case it will be the pathname of that URL.
		new InterpolateHtmlPlugin(HtmlWebPackPlugin, env.raw),

		// new MiniCssExtractPlugin({
		// 	filename: isEnvDevelopment ? '[name].css' : '[name].[fullhash].css',
		// 	chunkFilename: isEnvDevelopment ? '[id].css' : '[id].[fullhash].css'
		// }),
		// // new CompressionPlugin(),

		new CopyPlugin({
			patterns: [
				{
					from: 'public/manifest.json',
					to: paths.appBuild //path.join(__dirname, '../dist')
				},
				{
					from: 'public/favicon.svg',
					to: paths.appBuild //path.join(__dirname, '../dist')
				},
				{ from: 'public', to: 'public' }
			],
			options: {
				concurrency: 100
			}
		}),
		new MiniCssExtractPlugin(),
		new webpack.DefinePlugin(env.stringified),
		new webpack.ProvidePlugin({
			// Make a global `process` variable that points to the `process` package,
			// because the `util` package expects there to be a global variable named `process`.
			// Thanks to https://stackoverflow.com/a/65018686/14239942
			//process: 'process/browser'
			process: 'process/browser.js',
			Buffer: ['buffer', 'Buffer']
		})
	]
};

// DX Previous Start

// const webpack = require('webpack');
// const HtmlWebPackPlugin = require('html-webpack-plugin');
// // const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const ESLintPlugin = require('eslint-webpack-plugin');
// // const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// // const TerserPlugin = require("terser-webpack-plugin");
// // const CompressionPlugin = require("compression-webpack-plugin");
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
// const path = require('path');

// const devMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

// /* dotenv */
// const dotenv = require('dotenv');
// const fs = require('fs');

// const currentPath = path.join(__dirname, '..');
// // Create the fallback path (the development .env)
// const basePath = currentPath + '/.env';
// const envPath = basePath + '.' + process.env.NODE_ENV;
// // Check if the file exists, otherwise fall back to the production .env
// const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// // Set the path parameter in the dotenv config
// const fileEnv = dotenv.config({ path: finalPath }).parsed;

// // call dotenv and it will return an Object with a parsed key
// // reduce it to a nice object, the same as before (but with the variables from the file)
// const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
// 	prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
// 	return prev;
// }, {});

// console.log('HAHAH', envKeys);

// const htmlWebpackPlugin = new HtmlWebPackPlugin({
// 	template: './public/index.html',
// 	filename: './index.html',
// 	title: 'White Label'
// });

// module.exports = {
// 	entry: './src/index.tsx',
// 	output: {
// 		path: path.join(__dirname, '../build'),
// 		// filename:'[name].[hash].js'
// 		filename: '[name].[fullhash].js',
// 		chunkFilename: '[name].[chunkhash].js',
// 		clean: true,
// 		publicPath: '/'
// 		// publicPath: './'
// 		// publicPath: './',
// 	},
// 	module: {
// 		rules: [
// 			{
// 				test: /\.html$/,
// 				exclude: /node_modules/,
// 				use: [
// 					{
// 						loader: 'html-loader',
// 						options: { minimize: true }
// 					}
// 				]
// 			},
// 			{
// 				test: /\.(js|jsx)$/,
// 				exclude: /node_modules/,
// 				use: {
// 					loader: 'babel-loader'
// 				}
// 			},
// 			{
// 				test: /\.tsx?$/,
// 				exclude: /node_modules/,
// 				use: [
// 					{
// 						loader: 'babel-loader',
// 						options: {
// 							presets: [
// 								'@babel/preset-env',
// 								'@babel/preset-react',
// 								'@babel/preset-typescript'
// 							]
// 						}
// 					},
// 					{
// 						loader: 'ts-loader',
// 						options: {
// 							compilerOptions: {
// 								noEmit: false
// 							}
// 						}
// 					}
// 				]
// 			},
// 			{
// 				test: /\.css$/,
// 				include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'web')],
// 				use: [
// 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// 					{ loader: 'css-loader', options: { sourceMap: true } }
// 				]
// 			},
// 			{
// 				test: /\.s?[ac]ss$/,
// 				use: [
// 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// 					{ loader: 'css-loader', options: { sourceMap: true } },
// 					{ loader: 'sass-loader', options: { sourceMap: true } }
// 				]
// 			},
// 			{
// 				test: /\.less$/,
// 				use: [
// 					{
// 						loader: 'style-loader' // creates style nodes from JS strings
// 					},
// 					{
// 						loader: 'css-loader' // creates style nodes from JS strings
// 					},
// 					{
// 						loader: 'sass-loader',
// 						options: { sourceMap: true }
// 						//loader: 'css-loader' // translates CSS into CommonJS
// 					},
// 					{
// 						loader: 'less-loader', // compiles Less to CSS
// 						options: { sourceMap: true }
// 						// options: {
// 						//   modifyVars: {
// 						//     "primary-color": "#FF0000",
// 						//     "link-color": "#1DA57A",
// 						//     "border-radius-base": "2px",
// 						//     // or
// 						//     hack: `true; @import "your-less-file-path.less";`, // Override with less file
// 						//   },
// 						//   javascriptEnabled: true,
// 						// },
// 					}
// 				]
// 			},
// 			// {
// 			// 	test: /\.svg$/,
// 			// 	loader: 'svg-inline-loader'
// 			// },
// 			// {
// 			// 	test: /\.svg?$/,
// 			// 	oneOf: [
// 			// 		{
// 			// 			use: [
// 			// 				{
// 			// 					loader: '@svgr/webpack',
// 			// 					options: {
// 			// 						prettier: false,
// 			// 						svgo: true,
// 			// 						svgoConfig: {
// 			// 							plugins: [{ removeViewBox: false }]
// 			// 						},
// 			// 						titleProp: true
// 			// 					}
// 			// 				}
// 			// 			],
// 			// 			issuer: {
// 			// 				and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
// 			// 			}
// 			// 		}
// 			// 	]
// 			// },
// 			// {
// 			// 	//use SVGR for imports in js/jsx files
// 			// 	test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
// 			// 	oneOf: [
// 			// 		{
// 			// 			use: [
// 			// 				'babel-loader',
// 			// 				{
// 			// 					loader: '@svgr/webpack',
// 			// 					options: {
// 			// 						babel: false,
// 			// 						icon: true
// 			// 					}
// 			// 				}
// 			// 			],
// 			// 			issuer: {
// 			// 				and: [/\.(js|jsx)$/]
// 			// 			}
// 			// 		}
// 			// 	]
// 			// },
// 			{
// 				test: /\.svg$/,
// 				use: {
// 					loader: 'svg-url-loader'
// 				}
// 			},
// 			{
// 				test: /\.(jpe?g|png|gif)$/i,
// 				type: 'asset/resource'
// 				// //loader: "file-loader?name=/assets/images/[contenthash].[ext]",
// 				// loader: 'file-loader',
// 				// options: {
// 				// 	name: devMode ? '[path][name].[ext]' : '[contenthash].[ext]'
// 				// }
// 				// options: {
// 				//   name(file) {
// 				//     if (devMode) {
// 				//       return '[path][name].[ext]';
// 				//     }
// 				//     return '[contenthash].[ext]';
// 				//   },
// 				// },
// 				// options: {
// 				//   name: '/assets/images/[name].[ext]',
// 				// },
// 			},
// 			{
// 				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
// 				use: [
// 					{
// 						loader: 'file-loader',
// 						options: {
// 							name: '[name].[ext]',
// 							outputPath: 'fonts/'
// 						}
// 					}
// 				]
// 			}
// 		]
// 	},
// 	resolve: {
// 		extensions: ['.tsx', '.ts', '.js', '.jsx'],
// 		alias: {
// 			'@app': path.resolve(__dirname, '../src'),
// 			'@assets': path.resolve(__dirname, '../src/assets'),
// 			'@components': path.resolve(__dirname, '../src/components'),
// 			'@contexts': path.resolve(__dirname, '../src/contexts'),
// 			'@global': path.resolve(__dirname, '../src/global'),
// 			'@hooks': path.resolve(__dirname, '../src/hooks'),
// 			'@interface': path.resolve(__dirname, '../src/interface'),
// 			'@locales': path.resolve(__dirname, '../src/locales'),
// 			'@pages': path.resolve(__dirname, '../src/pages'),
// 			'@routes': path.resolve(__dirname, '../src/routes'),
// 			'@store': path.resolve(__dirname, '../src/store'),
// 			'@sections': path.resolve(__dirname, '../src/sections'),
// 			'@services': path.resolve(__dirname, '../src/services'),
// 			'@styles': path.resolve(__dirname, '../src/styles'),
// 			'@themes': path.resolve(__dirname, '../src/themes'),
// 			'@utils': path.resolve(__dirname, '../src/utils')
// 		},
// 		fallback: {
// 			// assert: require.resolve('assert'),
// 			process: require.resolve('process/browser'),
// 			crypto: require.resolve('crypto-browserify'),
// 			// http: require.resolve('stream-http'),
// 			// https: require.resolve('https-browserify'),
// 			// os: require.resolve('os-browserify/browser'),
// 			stream: require.resolve('stream-browserify'),
// 			buffer: require.resolve('buffer')
// 		}
// 		// alias: {
// 		//   src: path.resolve(__dirname, "src/"),
// 		//   web: path.resolve(__dirname, "web/"),
// 		//   view: path.resolve(__dirname, "view/"),
// 		// },
// 	},
// 	plugins: [
// 		//dx new CleanWebpackPlugin(),
// 		htmlWebpackPlugin,
// 		// new BundleAnalyzerPlugin({
// 		// 	// Port that will be used by in `server` mode to start HTTP server.
// 		// 	analyzerPort: 4000
// 		// }),
// 		new MiniCssExtractPlugin({
// 			filename: devMode ? '[name].css' : '[name].[fullhash].css',
// 			chunkFilename: devMode ? '[id].css' : '[id].[fullhash].css'
// 		}),
// 		// new CompressionPlugin(),
// 		new CopyPlugin({
// 			patterns: [
// 				// {
// 				// 	from: 'public/firebase-messaging-sw.js',
// 				// 	to: path.join(__dirname, '../dist')
// 				// },
// 				{
// 					from: 'public/manifest.json',
// 					to: path.join(__dirname, '../build')
// 				},
// 				{ from: 'public', to: 'public' }
// 			],
// 			options: {
// 				concurrency: 100
// 			}
// 		}),
// 		// new ForkTsCheckerWebpackPlugin(),
// 		// new webpack.DefinePlugin({
// 		//   "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
// 		//   "process.env.API_BASE": JSON.stringify(process.env.API_BASE),
// 		// }),
// 		// new webpack.EnvironmentPlugin([
// 		//   "NODE_ENV",
// 		//   "API_BASE",
// 		//   "UPLOAD_API_BASE",
// 		//   "PUSH_SERVER_API_BASE",
// 		//   "XHR_UPLOAD_SERVER_API_BASE",
// 		//   "DRIVE_SERVER_API_BASE",
// 		// ]),
// 		new webpack.DefinePlugin(
// 			{
// 				'process.env': {
// 					NODE_ENV: JSON.stringify(process.env.NODE_ENV),
// 					API_BASE: JSON.stringify(process.env.API_BASE),
// 					// UPLOAD_API_BASE: JSON.stringify(process.env.UPLOAD_API_BASE),
// 					// PUSH_SERVER_API_BASE: JSON.stringify(process.env.PUSH_SERVER_API_BASE),
// 					XHR_UPLOAD_SERVER_API_BASE: JSON.stringify(
// 						process.env.XHR_UPLOAD_SERVER_API_BASE
// 					),
// 					JWT_SECRET_KEY: JSON.stringify(process.env.JWT_SECRET_KEY),
// 					JWT_TIMEOUT: 86400
// 					// DRIVE_SERVER_API_BASE: JSON.stringify(process.env.DRIVE_SERVER_API_BASE)
// 				}
// 			}
// 			// devMode
// 			// 	? {
// 			// 			'process.env': {
// 			// 				NODE_ENV: JSON.stringify('development'),
// 			// 				API_BASE: JSON.stringify(process.env.API_BASE),
// 			// 				// UPLOAD_API_BASE: JSON.stringify(process.env.UPLOAD_API_BASE),
// 			// 				// PUSH_SERVER_API_BASE: JSON.stringify(process.env.PUSH_SERVER_API_BASE),
// 			// 				XHR_UPLOAD_SERVER_API_BASE: JSON.stringify(
// 			// 					process.env.XHR_UPLOAD_SERVER_API_BASE
// 			// 				)
// 			// 				// DRIVE_SERVER_API_BASE: JSON.stringify(process.env.DRIVE_SERVER_API_BASE)
// 			// 			}
// 			// 	  }
// 			// 	: envKeys
// 		)
// 		// new ESLintPlugin({
// 		// 	extensions: ['.tsx', '.ts', '.js'],
// 		// 	exclude: 'node_modules',
// 		// 	context: './src'
// 		// })
// 		// new webpack.DefinePlugin({
// 		//   "process.env": {
// 		//     NODE_ENV: JSON.stringify(envKeys.NODE_ENV),
// 		//     API_BASE: JSON.stringify(envKeys.API_BASE),
// 		//   },
// 		// }),

// 		// new webpack.DefinePlugin({
// 		//   "process.env": {
// 		//     NODE_ENV: JSON.stringify(process.env.NODE_ENV),
// 		//   },
// 		// }),
// 	],
// 	optimization: {
// 		minimize: true,
// 		minimizer: [
// 			// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// 			`...`,
// 			new CssMinimizerPlugin({
// 				minimizerOptions: {
// 					parallel: 4,
// 					minify: CssMinimizerPlugin.cleanCssMinify,
// 					preset: [
// 						'default',
// 						{
// 							discardComments: { removeAll: true }
// 						}
// 					]
// 				}
// 			})
// 		]
// 	}
// 	// optimization: {
// 	//   // minimizer: [new UglifyJsPlugin({ sourceMap: true })],
// 	//   // minimize: true,
// 	//   minimizer: [new TerserPlugin({ sourceMap: true })],
// 	// },
// 	// devServer: {
// 	// 	historyApiFallback: true
// 	// }
// };

// // DX Previous End

// END

// /* eslint-disable @typescript-eslint/no-var-requires */
// const path = require('path');
// const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
// const ESLintPlugin = require('eslint-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// const devMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

// /* dotenv */
// const dotenv = require('dotenv');
// const fs = require('fs');

// const currentPath = path.join(__dirname, '..');

// // Create the fallback path (the development .env)
// const basePath = currentPath + '/.env';
// const envPath = basePath + '.' + process.env.NODE_ENV;

// // Check if the file exists, otherwise fall back to the production .env
// const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// // Set the path parameter in the dotenv config
// const fileEnv = dotenv.config({ path: finalPath }).parsed;

// // call dotenv and it will return an Object with a parsed key
// // reduce it to a nice object, the same as before (but with the variables from the file)
// const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
// 	prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
// 	return prev;
// }, {});

// module.exports = {
// 	entry: './src/index.tsx',
// 	// mode: 'development',
// 	// devtool: 'source-map',
// 	output: {
// 		path: path.join(__dirname, '..', 'dist'), // path.resolve(__dirname, '../dist'),
// 		// static: [path.join(__dirname, '..', 'dist')],
// 		filename: '[name].[contenthash].js',
// 		clean: true
// 	},

// 	module: {
// 		rules: [
// 			{
// 				test: /\.(js|jsx)$/,
// 				exclude: /node_modules/,
// 				use: {
// 					loader: 'babel-loader'
// 				}
// 			},
// 			{
// 				test: /\.tsx?$/,
// 				exclude: /node_modules/,
// 				use: [
// 					{
// 						loader: 'babel-loader',
// 						options: {
// 							presets: [
// 								'@babel/preset-env',
// 								'@babel/preset-react',
// 								'@babel/preset-typescript'
// 							]
// 						}
// 					},
// 					{
// 						loader: 'ts-loader',
// 						options: {
// 							compilerOptions: {
// 								noEmit: false
// 							}
// 						}
// 					}
// 				]
// 			},
// 			// {
// 			//     test: /\.tsx?$/,
// 			//     exclude: /node_modules/,
// 			//     use: {
// 			//         loader: 'ts-loader',
// 			//         options: {
// 			//             // disable type checker - we will use it in fork plugin
// 			//             transpileOnly: true
// 			//         }
// 			//     }
// 			// },
// 			// {
// 			//     test: /\.s(a|c)ss$/,
// 			//     use: ['style-loader', 'sass-loader', 'css-loader']
// 			// },
// 			{
// 				test: /\.svg$/,
// 				loader: 'svg-inline-loader'
// 			},
// 			{
// 				test: /\.s(a|c)ss$/,
// 				use: [
// 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// 					'css-loader',
// 					{
// 						loader: 'sass-loader',
// 						options: {
// 							sourceMap: true
// 						}
// 					}
// 				]
// 			},
// 			{
// 				test: /\.css$/,
// 				include: [path.resolve(__dirname, 'src')],
// 				use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
// 			},
// 			{
// 				test: /.s?css$/,
// 				use: [
// 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// 					'css-loader',
// 					'sass-loader'
// 				]
// 			},
// 			{
// 				test: /\.less$/,
// 				use: [
// 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// 					'css-loader',
// 					'sass-loader'
// 				]
// 			},
// 			{
// 				test: /\.(jpe?g|png|gif|svg)$/i,
// 				loader: 'file-loader',
// 				options: {
// 					name: devMode ? '[path][name].[ext]' : '[contenthash].[ext]'
// 				},
// 				type: 'asset/resource'
// 			},
// 			{
// 				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
// 				use: [
// 					{
// 						loader: 'file-loader',
// 						options: {
// 							name: '[name].[ext]',
// 							outputPath: 'fonts/'
// 						}
// 					}
// 				],
// 				type: 'asset/resource'
// 			}
// 		]
// 	},
// 	resolve: {
// 		extensions: ['.tsx', '.ts', '.js'],
// 		alias: {
// 			'@app': path.resolve(__dirname, '../src')
// 		}
// 	},
// 	plugins: [
// 		new webpack.BannerPlugin({
// 			banner: 'hello world',
// 			entryOnly: true
// 		}),
// 		new HtmlWebpackPlugin({
// 			template: './public/index.html',
// 			filename: 'index.html',
// 			title: 'Dharmesh Patel'
// 		}),

// 		new MiniCssExtractPlugin({
// 			// Options similar to the same options in webpackOptions.output
// 			// both options are optional
// 			filename: devMode ? '[name].css' : '[name].[contenthash].css', //'[name].[contenthash].css',
// 			chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css' // '[id].css'
// 		}),
// 		new ForkTsCheckerWebpackPlugin(),
// 		new CopyPlugin({
// 			patterns: [
// 				{ from: './src/assets', to: 'assets' },
// 				{ from: './public/manifest.json', to: path.join(__dirname, '../dist') },
// 				{ from: 'public', to: 'public' }
// 			],
// 			options: {
// 				concurrency: 100
// 			}
// 		}),
// 		new webpack.DefinePlugin(
// 			devMode
// 				? {
// 						'process.env': {
// 							NODE_ENV: JSON.stringify('development'),
// 							API_BASE: JSON.stringify(process.env.API_BASE),
// 							// UPLOAD_API_BASE: JSON.stringify(process.env.UPLOAD_API_BASE),
// 							// PUSH_SERVER_API_BASE: JSON.stringify(process.env.PUSH_SERVER_API_BASE),
// 							XHR_UPLOAD_SERVER_API_BASE: JSON.stringify(
// 								process.env.XHR_UPLOAD_SERVER_API_BASE
// 							)
// 							// DRIVE_SERVER_API_BASE: JSON.stringify(process.env.DRIVE_SERVER_API_BASE)
// 						}
// 				  }
// 				: envKeys
// 		),
// 		new BundleAnalyzerPlugin({
// 			analyzerMode: 'static',
// 			openAnalyzer: false
// 		})
// 		//new webpack.HotModuleReplacementPlugin()
// 		// new ESLintPlugin({
// 		//     extensions: ['.tsx', '.ts', '.js'],
// 		//     exclude: 'node_modules',
// 		//     context: './src'
// 		// })
// 	]
// 	// optimization: {
// 	// 	minimizer: [
// 	// 		// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// 	// 		`...`,
// 	// 		new CssMinimizerPlugin({
// 	// 			parallel: true
// 	// 		})
// 	// 	],
// 	// 	// If you want to run it also in development set the optimization.minimize option to true
// 	// 	minimize: true
// 	// 	// moduleIds: 'deterministic', //Added this to retain hash of vendor chunks.
// 	// 	// runtimeChunk: 'single',
// 	// 	// splitChunks: {
// 	// 	// 	cacheGroups: {
// 	// 	// 		vendor: {
// 	// 	// 			test: /[\\/]node_modules[\\/]/,
// 	// 	// 			name: 'vendors',
// 	// 	// 			chunks: 'all'
// 	// 	// 		}
// 	// 	// 	}
// 	// 	// }
// 	// }
// };

// const path = require('path');
// const webpack = require('webpack');
// const HtmlWebPackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const CopyPlugin = require('copy-webpack-plugin');

// // Doing TypeScript type checking
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// const devMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

// /* dotenv */
// const dotenv = require('dotenv');
// const fs = require('fs');

// const currentPath = path.join(__dirname, '..');

// // Create the fallback path (the development .env)
// const basePath = currentPath + '/.env';
// const envPath = basePath + '.' + process.env.NODE_ENV;

// // Check if the file exists, otherwise fall back to the production .env
// const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// // Set the path parameter in the dotenv config
// const fileEnv = dotenv.config({ path: finalPath }).parsed;

// // call dotenv and it will return an Object with a parsed key
// // reduce it to a nice object, the same as before (but with the variables from the file)
// const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
//     prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
//     return prev;
// }, {});

// console.log("devMode", devMode)
// console.log("envKeys", envKeys)
// console.log("template", path.resolve(__dirname, "../public", "index.html"));

// // const htmlWebpackPlugin = new HtmlWebPackPlugin({
// //     template: path.resolve(__dirname, "../public", "index.html"),
// //     filename: './index.html',
// //     title: 'Dharmesh',
// //     manifest: path.resolve(__dirname, "../public", "manifest.json"),
// // })

// const htmlWebpackPlugin = new HtmlWebPackPlugin({
//     template: './public/index.html',
//     filename: './index.html',
//     title: 'SleepGuard'
// });

// module.exports = {
//     entry: './src/index.tsx',
//     output: {
//         path: path.resolve(__dirname, '../dist'),
//         //filename: '[name].[fullhash].js',
//         filename: '[name].bundle.js',
//         // chunkFilename: '[name].[chunkhash].js',
//         // publicPath: './',
//         clean: true,
//     },

//     module: {
//         rules: [
//             // {
//             //     test: /\.html$/,
//             //     exclude: /node_modules/,
//             //     use: [
//             //         {
//             //             loader: 'html-loader',
//             //             options: { minimize: true }
//             //         }
//             //     ]
//             // },
//             {
//                 test: /\.(js|jsx)$/,
//                 exclude: /node_modules/,
//                 use: {
//                     loader: 'babel-loader'
//                 }
//             },
//             {
//                 test: /\.tsx?$/,
//                 exclude: /node_modules/,
//                 use: [
//                     {
//                         loader: 'babel-loader',
//                         options: {
//                             presets: [
//                                 "@babel/preset-env",
//                                 "@babel/preset-react",
//                                 "@babel/preset-typescript",
//                             ],
//                         },
//                     },
//                     {
//                         loader: 'ts-loader',
//                         options: {
//                             compilerOptions: {
//                                 noEmit: false,
//                             },
//                         },
//                     }
//                 ],
//             },
//             {
//                 test: /\.css$/,
//                 include: [path.resolve(__dirname, 'src')],
//                 use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
//             },
//             {
//                 test: /.s?css$/,
//                 use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
//             },
//             {
//                 test: /\.less$/,
//                 use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
//             },
//             // {
//             //     test: /\.less$/,
//             //     use: [
//             //         {
//             //             loader: 'style-loader' // creates style nodes from JS strings
//             //         },
//             //         {
//             //             loader: 'css-loader' // translates CSS into CommonJS
//             //         },
//             //         {
//             //             loader: 'less-loader' // compiles Less to CSS
//             //         }
//             //     ]
//             // },
//             {
//                 test: /\.svg$/,
//                 loader: 'svg-inline-loader'
//             },
//             {
//                 test: /\.(jpe?g|png|gif|svg)$/i,
//                 loader: 'file-loader',
//                 options: {
//                     name: devMode ? '[path][name].[ext]' : '[contenthash].[ext]'
//                 },
//                 type: 'asset/resource',
//             },
//             {
//                 test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {
//                             name: '[name].[ext]',
//                             outputPath: 'fonts/'
//                         }
//                     }
//                 ],
//                 type: 'asset/resource',
//             }
//         ]
//     },
//     resolve: {
//         extensions: ['.tsx', '.ts', '.js'],
//         alias: {
//             '@app': path.resolve(__dirname, '../src'),
//         }
//     },
//     plugins: [
//         htmlWebpackPlugin,
//         // new BundleAnalyzerPlugin({
//         //   // Port that will be used by in `server` mode to start HTTP server.
//         //   analyzerPort: 4000,
//         // }),
//         // new MiniCssExtractPlugin({
//         //     filename: devMode ? '[name].css' : '[name].[fullhash].css',
//         //     chunkFilename: devMode ? '[id].css' : '[id].[fullhash].css'
//         // }),
//         // new CopyPlugin({
//         //     patterns: [
//         //         // {
//         //         //     from: 'public/firebase-messaging-sw.js',
//         //         //     to: path.join(__dirname, '../dist')
//         //         // },
//         //         {
//         //             from: 'public/manifest.json',
//         //             to: path.join(__dirname, '../dist')
//         //         },
//         //         { from: 'public', to: 'public' }
//         //     ],
//         //     options: {
//         //         concurrency: 100
//         //     }
//         // }),
//         // new ForkTsCheckerWebpackPlugin(),
//         new webpack.DefinePlugin(
//             devMode
//                 ? {
//                     'process.env': {
//                         NODE_ENV: JSON.stringify('development'),
//                         API_BASE: JSON.stringify(process.env.API_BASE),
//                         // UPLOAD_API_BASE: JSON.stringify(process.env.UPLOAD_API_BASE),
//                         // PUSH_SERVER_API_BASE: JSON.stringify(process.env.PUSH_SERVER_API_BASE),
//                         XHR_UPLOAD_SERVER_API_BASE: JSON.stringify(process.env.XHR_UPLOAD_SERVER_API_BASE)
//                         // DRIVE_SERVER_API_BASE: JSON.stringify(process.env.DRIVE_SERVER_API_BASE)
//                     }
//                 }
//                 : envKeys
//         )
//     ],
//     // optimization: {
//     //     minimizer: [
//     //         // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
//     //         `...`,
//     //         new CssMinimizerPlugin({
//     //             parallel: true,
//     //         }),
//     //     ],
//     //     // If you want to run it also in development set the optimization.minimize option to true
//     //     minimize: true,
//     // },
// };

//DX

// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require("copy-webpack-plugin");
// // Doing TypeScript type checking
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// module.exports = {
//     entry: {
//         app: './src/index.tsx',
//     },
//     output: {
//         path: path.resolve(__dirname, '../dist'),
//         filename: '[name].[contenthash].js',
//         // assetModuleFilename: `${assetsFolderName}/[hash][ext][query]`,
//         clean: true,
//         publicPath: "/"
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.jsx?$/,
//                 exclude: /node_modules/,
//                 loader: 'babel-loader'
//             },
//             {
//                 test: /\.tsx?$/,
//                 // use: 'ts-loader',
//                 use: [
//                     {
//                         loader: 'babel-loader',
//                         options: {
//                             presets: [
//                                 "@babel/preset-env",
//                                 "@babel/preset-react",
//                                 "@babel/preset-typescript",
//                             ],
//                         },
//                     },
//                     {
//                         loader: 'ts-loader',
//                         options: {
//                             compilerOptions: {
//                                 noEmit: false,
//                             },
//                         },
//                     }
//                 ],
//                 exclude: /node_modules/,
//             },
//             {
//                 test: /\.json$/,
//                 loader: 'json-loader'
//             },
//             {
//                 test: /\.css$/i,
//                 use: ['style-loader', 'css-loader'],
//             },
//             {
//                 test: /\.(png|svg|jpg|jpeg|gif)$/i,
//                 type: 'asset/resource',
//             },
//             {
//                 test: /\.(woff|woff2|eot|ttf|otf)$/i,
//                 type: 'asset/resource',
//             },
//         ]
//     },
//     resolve: {
//         extensions: ['.tsx', '.ts', '.js'],
//         alias: {
//             '@app': path.resolve(__dirname, '../src'),
//         }
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             template: path.resolve(__dirname, "../public", "index.html"),
//             //  filename: "index.html",
//             manifest: path.resolve(__dirname, "../public", "manifest.json"),
//         }),
//         new CopyPlugin({
//             patterns: [
//                 {
//                     from: path.resolve(__dirname, "../public"),
//                     to: 'assets',
//                     globOptions: {
//                         ignore: ['*.DS_Store'],
//                     },
//                 },
//             ],
//         }),
//         new ForkTsCheckerWebpackPlugin()
//     ],
//     // watchOptions: {
//     //     // for some systems, watching many files can result in a lot of CPU or memory usage
//     //     // https://webpack.js.org/configuration/watch/#watchoptionsignored
//     //     // don't use this pattern, if you have a monorepo with linked packages
//     //     ignored: path.resolve(__dirname, "../node_modules"),
//     // },
//     optimization: {
//         minimize: true,
//         minimizer: [
//             // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
//             `...`,
//             new CssMinimizerPlugin(),
//         ], runtimeChunk: {
//             name: 'runtime',
//         },
//         splitChunks: {
//             cacheGroups: {
//                 commons: {
//                     test: /[\\/]node_modules[\\/]/,
//                     name: 'vendor',
//                     chunks: 'initial',
//                 },
//             },
//         },
//     },
// };

// //    // "webpack": "webpack-dev-server --open --mode development --hot",
// //"webpack": "webpack --mode productionwebpack --config config/webpack.prod.js",

// // https://github.com/glook/webpack-typescript-react/blob/master/webpack/optimization.js
// https://blog.kiprosh.com/application-performance-optimisation-using-webpack/
// https://indepth.dev/posts/1490/webpack-an-in-depth-introduction-to-splitchunksplugin

// const webpack = require('webpack');
// const HtmlWebPackPlugin = require('html-webpack-plugin');
// // const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const ESLintPlugin = require('eslint-webpack-plugin');
// // const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// // const TerserPlugin = require("terser-webpack-plugin");
// // const CompressionPlugin = require("compression-webpack-plugin");
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
// const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
// const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
// const path = require('path');
// const fs = require('fs');
// const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
// const paths = require('./paths');
// const modules = require('./modules');
// const getClientEnvironment = require('./env');

// const devMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

// // Source maps are resource heavy and can cause out of memory issue for large source files.
// const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

// const isEnvDevelopment =
// 	process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';
// const isEnvProduction = process.env.NODE_ENV === 'production';

// const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000');

// // Check if TypeScript is setup
// const useTypeScript = fs.existsSync(paths.appTsConfig);

// // /* dotenv */
// // const dotenv = require('dotenv');
// // const fs = require('fs');

// // const currentPath = path.join(__dirname, '..');
// // // Create the fallback path (the development .env)
// // const basePath = currentPath + '/.env';
// // const envPath = basePath + '.' + process.env.NODE_ENV;
// // // Check if the file exists, otherwise fall back to the production .env
// // const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// // // Set the path parameter in the dotenv config
// // const fileEnv = dotenv.config({ path: finalPath }).parsed;

// // // call dotenv and it will return an Object with a parsed key
// // // reduce it to a nice object, the same as before (but with the variables from the file)
// // const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
// // 	prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
// // 	return prev;
// // }, {});

// // We use `PUBLIC_URL` environment variable or "homepage" field to infer
// // "public path" at which the app is served.
// // webpack needs to know it to put the right <script> hrefs into HTML even in
// // single-page apps that may serve index.html for nested URLs like /todos/42.
// // We can't use a relative path in HTML because we don't want to load something
// // like /todos/42/static/js/bundle.7289d.js. We have to know the root.
// const publicUrlOrPath = getPublicUrlOrPath(
// 	process.env.NODE_ENV === 'development',
// 	require(paths.resolveApp('package.json')).homepage,
// 	process.env.PUBLIC_URL
// );

// const env = getClientEnvironment(publicUrlOrPath.slice(0, -1));

// console.log('PATHSS', paths);

// // console.log(env);
// // const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

// // const htmlWebpackPlugin = new HtmlWebPackPlugin({
// // 	template: './public/index.html',
// // 	filename: './index.html',
// // 	title: 'White Label'
// // });

// // const htmlWebpackPlugin = new HtmlWebPackPlugin(
// // 	Object.assign(
// // 		{},
// // 		{
// // 			inject: true,
// // 			template: './public/index.html'
// // 		},
// // 		isEnvProduction
// // 			? {
// // 					minify: {
// // 						removeComments: true,
// // 						collapseWhitespace: true,
// // 						removeRedundantAttributes: true,
// // 						useShortDoctype: true,
// // 						removeEmptyAttributes: true,
// // 						removeStyleLinkTypeAttributes: true,
// // 						keepClosingSlash: true,
// // 						minifyJS: true,
// // 						minifyCSS: true,
// // 						minifyURLs: true
// // 					}
// // 			  }
// // 			: undefined
// // 	)
// // );

// module.exports = {
// 	// entry: './src/index.tsx',
// 	// These are the "entry points" to our application.
// 	// This means they will be the "root" imports that are included in JS bundle.
// 	entry: paths.appIndexJs,
// 	output: {
// 		// path: path.join(__dirname, '../dist'),
// 		// The build folder.
// 		path: paths.appBuild,
// 		// Add /* filename */ comments to generated require()s in the output.
// 		pathinfo: isEnvDevelopment,
// 		// filename:'[name].[hash].js'
// 		filename: '[name].[fullhash].js',
// 		chunkFilename: '[name].[chunkhash].js',
// 		clean: true,
// 		publicPath: publicUrlOrPath
// 		// publicPath: './'
// 		// publicPath: './',
// 	},
// 	module: {
// 		strictExportPresence: true,
// 		rules: [
// 			{
// 				test: /\.html$/,
// 				exclude: /node_modules/,
// 				use: [
// 					{
// 						loader: 'html-loader',
// 						options: { minimize: true }
// 					}
// 				]
// 			},
// 			{
// 				test: /\.(js|jsx)$/,
// 				exclude: /node_modules/,
// 				use: {
// 					loader: 'babel-loader'
// 				}
// 			},
// 			{
// 				test: /\.tsx?$/,
// 				exclude: /node_modules/,
// 				use: [
// 					{
// 						loader: 'babel-loader',
// 						options: {
// 							presets: [
// 								'@babel/preset-env',
// 								'@babel/preset-react',
// 								'@babel/preset-typescript'
// 							]
// 						}
// 					},
// 					{
// 						loader: 'ts-loader',
// 						options: {
// 							compilerOptions: {
// 								noEmit: false
// 							}
// 						}
// 					}
// 				]
// 			},
// 			{
// 				test: /\.css$/,
// 				include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'web')],
// 				use: [
// 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// 					{ loader: 'css-loader', options: { sourceMap: true } }
// 				]
// 			},
// 			{
// 				test: /\.s?[ac]ss$/,
// 				use: [
// 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// 					{ loader: 'css-loader', options: { sourceMap: true } },
// 					{ loader: 'sass-loader', options: { sourceMap: true } }
// 				]
// 			},
// 			{
// 				test: /\.less$/,
// 				use: [
// 					{
// 						loader: 'style-loader' // creates style nodes from JS strings
// 					},
// 					{
// 						loader: 'css-loader' // creates style nodes from JS strings
// 					},
// 					{
// 						loader: 'sass-loader',
// 						options: { sourceMap: true }
// 						//loader: 'css-loader' // translates CSS into CommonJS
// 					},
// 					{
// 						loader: 'less-loader', // compiles Less to CSS
// 						options: { sourceMap: true }
// 						// options: {
// 						//   modifyVars: {
// 						//     "primary-color": "#FF0000",
// 						//     "link-color": "#1DA57A",
// 						//     "border-radius-base": "2px",
// 						//     // or
// 						//     hack: `true; @import "your-less-file-path.less";`, // Override with less file
// 						//   },
// 						//   javascriptEnabled: true,
// 						// },
// 					}
// 				]
// 			},
// 			{
// 				test: /\.svg$/,
// 				use: {
// 					loader: 'svg-url-loader'
// 				}
// 			},
// 			// {
// 			// 	test: /\.svg$/,
// 			// 	use: [
// 			// 		{
// 			// 			loader: require.resolve('@svgr/webpack'),
// 			// 			options: {
// 			// 				prettier: false,
// 			// 				svgo: false,
// 			// 				svgoConfig: {
// 			// 					plugins: [{ removeViewBox: false }]
// 			// 				},
// 			// 				titleProp: true,
// 			// 				ref: true
// 			// 			}
// 			// 		},
// 			// 		{
// 			// 			loader: require.resolve('file-loader'),
// 			// 			options: {
// 			// 				name: 'static/media/[name].[hash].[ext]'
// 			// 			}
// 			// 		}
// 			// 	],
// 			// 	issuer: {
// 			// 		and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
// 			// 	}
// 			// },
// 			// {
// 			// 	test: /\.svg$/,
// 			// 	loader: 'svg-inline-loader'
// 			// },
// 			// {
// 			// 	test: /\.svg?$/,
// 			// 	oneOf: [
// 			// 		{
// 			// 			use: [
// 			// 				{
// 			// 					loader: '@svgr/webpack',
// 			// 					options: {
// 			// 						prettier: false,
// 			// 						svgo: true,
// 			// 						svgoConfig: {
// 			// 							plugins: [{ removeViewBox: false }]
// 			// 						},
// 			// 						titleProp: true
// 			// 					}
// 			// 				}
// 			// 			],
// 			// 			issuer: {
// 			// 				and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
// 			// 			}
// 			// 		}
// 			// 	]
// 			// },
// 			// {
// 			// 	//use SVGR for imports in js/jsx files
// 			// 	test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
// 			// 	oneOf: [
// 			// 		{
// 			// 			use: [
// 			// 				'babel-loader',
// 			// 				{
// 			// 					loader: '@svgr/webpack',
// 			// 					options: {
// 			// 						babel: false,
// 			// 						icon: true
// 			// 					}
// 			// 				}
// 			// 			],
// 			// 			issuer: {
// 			// 				and: [/\.(js|jsx)$/]
// 			// 			}
// 			// 		}
// 			// 	]
// 			// },
// 			{
// 				// test: /\.(jpe?g|png|gif)$/i,
// 				// "url" loader works like "file" loader except that it embeds assets
// 				// smaller than specified limit in bytes as data URLs to avoid requests.
// 				// A missing `test` is equivalent to a match.
// 				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
// 				type: 'asset/resource',
// 				parser: {
// 					dataUrlCondition: {
// 						maxSize: imageInlineSizeLimit
// 					}
// 				}
// 				// //loader: "file-loader?name=/assets/images/[contenthash].[ext]",
// 				// loader: 'file-loader',
// 				// options: {
// 				// 	name: devMode ? '[path][name].[ext]' : '[contenthash].[ext]'
// 				// }
// 				// options: {
// 				//   name(file) {
// 				//     if (devMode) {
// 				//       return '[path][name].[ext]';
// 				//     }
// 				//     return '[contenthash].[ext]';
// 				//   },
// 				// },
// 				// options: {
// 				//   name: '/assets/images/[name].[ext]',
// 				// },
// 			},
// 			{
// 				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/, //|svg
// 				use: [
// 					{
// 						loader: 'file-loader',
// 						options: {
// 							name: '[name].[ext]',
// 							outputPath: 'fonts/'
// 						}
// 					}
// 				]
// 			}
// 			// {
// 			// 	test: /\.svg$/,
// 			// 	use: [
// 			// 		{
// 			// 			loader: require.resolve('@svgr/webpack'),
// 			// 			options: {
// 			// 				prettier: false,
// 			// 				svgo: false,
// 			// 				svgoConfig: {
// 			// 					plugins: [{ removeViewBox: false }]
// 			// 				},
// 			// 				titleProp: true,
// 			// 				ref: true
// 			// 			}
// 			// 		},
// 			// 		{
// 			// 			loader: require.resolve('file-loader'),
// 			// 			options: {
// 			// 				name: 'static/media/[name].[hash].[ext]'
// 			// 			}
// 			// 		}
// 			// 	],
// 			// 	issuer: {
// 			// 		and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
// 			// 	}
// 			// },
// 			// {
// 			// 	test: /\.svg$/,
// 			// 	use: {
// 			// 		loader: 'svg-url-loader'
// 			// 	}
// 			// }
// 			// {
// 			// 	//use SVGR for imports in js/jsx files
// 			// 	test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
// 			// 	oneOf: [
// 			// 		{
// 			// 			use: [
// 			// 				'babel-loader',
// 			// 				{
// 			// 					loader: '@svgr/webpack',
// 			// 					options: {
// 			// 						babel: false,
// 			// 						icon: true
// 			// 					}
// 			// 				}
// 			// 			],
// 			// 			issuer: {
// 			// 				and: [/\.(ts|tsx|js|jsx)$/]
// 			// 			}
// 			// 		}
// 			// 	]
// 			// }
// 			// {
// 			// 	test: /\.svg?$/,
// 			// 	oneOf: [
// 			// 		{
// 			// 			use: [
// 			// 				{
// 			// 					loader: '@svgr/webpack',
// 			// 					options: {
// 			// 						prettier: false,
// 			// 						svgo: true,
// 			// 						svgoConfig: {
// 			// 							plugins: [{ removeViewBox: false }]
// 			// 						},
// 			// 						titleProp: true
// 			// 					}
// 			// 				}
// 			// 			],
// 			// 			issuer: {
// 			// 				and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
// 			// 			}
// 			// 		}
// 			// 	]
// 			// }
// 			// {
// 			// 	test: /\.svg$/,
// 			// 	issuer: /\.(js|ts)x?$/,
// 			// 	use: ['@svgr/webpack']
// 			// }
// 			// {
// 			// 	test: /\.svg$/,
// 			// 	use: ['@svgr/webpack']
// 			// }
// 			// {
// 			// 	test: /\.svg$/,
// 			// 	use: [
// 			// 		{
// 			// 			loader: require.resolve('@svgr/webpack'),
// 			// 			options: {
// 			// 				prettier: false,
// 			// 				svgo: false,
// 			// 				svgoConfig: {
// 			// 					plugins: [{ removeViewBox: false }]
// 			// 				},
// 			// 				titleProp: true,
// 			// 				ref: true
// 			// 			}
// 			// 		},
// 			// 		{
// 			// 			loader: require.resolve('file-loader'),
// 			// 			options: {
// 			// 				name: 'static/media/[name].[hash].[ext]'
// 			// 			}
// 			// 		}
// 			// 	],
// 			// 	issuer: {
// 			// 		and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
// 			// 	}
// 			// }
// 			// {
// 			// 	test: /\.svg$/,
// 			// 	use: ['@svgr/webpack', 'url-loader']
// 			// },
// 			// {
// 			// 	test: /\.svg$/i,
// 			// 	type: 'asset',
// 			// 	resourceQuery: /url/ // *.svg?url
// 			// }
// 			// {
// 			// 	test: /\.svg$/i,
// 			// 	issuer: /\.[jt]sx?$/,
// 			// 	resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
// 			// 	use: ['@svgr/webpack']
// 			// }
// 		]
// 	},
// 	resolve: {
// 		// This allows you to set a fallback for where webpack should look for modules.
// 		// We placed these paths second because we want `node_modules` to "win"
// 		// if there are any conflicts. This matches Node resolution mechanism.
// 		// https://github.com/facebook/create-react-app/issues/253
// 		modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
// 		// These are the reasonable defaults supported by the Node ecosystem.
// 		// We also include JSX as a common component filename extension to support
// 		// some tools, although we do not recommend using it, see:
// 		// https://github.com/facebook/create-react-app/issues/290
// 		// `web` extension prefixes have been added for better support
// 		// for React Native Web.
// 		extensions: paths.moduleFileExtensions
// 			.map(ext => `.${ext}`)
// 			.filter(ext => useTypeScript || !ext.includes('ts')),
// 		// extensions: ['.tsx', '.ts', '.js', '.jsx'],
// 		alias: {
// 			'@app': path.resolve(__dirname, '../src'),
// 			'@apptypes': path.resolve(__dirname, '../src/types'),
// 			'@assets': path.resolve(__dirname, '../src/assets'),
// 			'@components': path.resolve(__dirname, '../src/components'),
// 			'@contexts': path.resolve(__dirname, '../src/contexts'),
// 			'@global': path.resolve(__dirname, '../src/global'),
// 			'@hooks': path.resolve(__dirname, '../src/hooks'),
// 			'@interface': path.resolve(__dirname, '../src/interface'),
// 			'@locales': path.resolve(__dirname, '../src/locales'),
// 			'@pages': path.resolve(__dirname, '../src/pages'),
// 			'@routes': path.resolve(__dirname, '../src/routes'),
// 			'@store': path.resolve(__dirname, '../src/store'),
// 			'@sections': path.resolve(__dirname, '../src/sections'),
// 			'@services': path.resolve(__dirname, '../src/services'),
// 			'@styles': path.resolve(__dirname, '../src/styles'),
// 			'@themes': path.resolve(__dirname, '../src/themes'),
// 			'@utils': path.resolve(__dirname, '../src/utils'),
// 			...(modules.webpackAliases || {})
// 		},
// 		// alias: {
// 		//   src: path.resolve(__dirname, "src/"),
// 		//   web: path.resolve(__dirname, "web/"),
// 		//   view: path.resolve(__dirname, "view/"),
// 		// },
// 		plugins: [
// 			// Prevents users from importing files from outside of src/ (or node_modules/).
// 			// This often causes confusion because we only process files within src/ with babel.
// 			// To fix this, we prevent you from importing files out of src/ -- if you'd like to,
// 			// please link the files into your node_modules/ and let module-resolution kick in.
// 			// Make sure your source files are compiled, as they will not be processed in any way.
// 			new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
// 		]
// 	},
// 	plugins: [
// 		//dx new CleanWebpackPlugin(),
// 		// htmlWebpackPlugin,
// 		new HtmlWebPackPlugin(
// 			Object.assign(
// 				{},
// 				{
// 					inject: true,
// 					template: paths.appHtml
// 				},
// 				isEnvProduction
// 					? {
// 							minify: {
// 								removeComments: true,
// 								collapseWhitespace: true,
// 								removeRedundantAttributes: true,
// 								useShortDoctype: true,
// 								removeEmptyAttributes: true,
// 								removeStyleLinkTypeAttributes: true,
// 								keepClosingSlash: true,
// 								minifyJS: true,
// 								minifyCSS: true,
// 								minifyURLs: true
// 							}
// 					  }
// 					: undefined
// 			)
// 		),
// 		// new BundleAnalyzerPlugin({
// 		// 	// Port that will be used by in `server` mode to start HTTP server.
// 		// 	analyzerPort: 4000
// 		// }),
// 		// Makes some environment variables available in index.html.
// 		// The public URL is available as %PUBLIC_URL% in index.html, e.g.:
// 		// <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
// 		// It will be an empty string unless you specify "homepage"
// 		// in `package.json`, in which case it will be the pathname of that URL.
// 		new InterpolateHtmlPlugin(HtmlWebPackPlugin, env.raw),
// 		// new MiniCssExtractPlugin({
// 		// 	filename: devMode ? '[name].css' : '[name].[fullhash].css',
// 		// 	chunkFilename: devMode ? '[id].css' : '[id].[fullhash].css'
// 		// }),
// 		// new CompressionPlugin(),
// 		new CopyPlugin({
// 			patterns: [
// 				// {
// 				// 	from: 'public/firebase-messaging-sw.js',
// 				// 	to: path.join(__dirname, '../dist')
// 				// },
// 				{
// 					from: 'public/manifest.json',
// 					to: paths.appBuild //path.join(__dirname, '../dist')
// 				},
// 				{ from: 'public', to: 'public' }
// 			],
// 			options: {
// 				concurrency: 100
// 			}
// 		}),
// 		// new ForkTsCheckerWebpackPlugin(),
// 		// new webpack.DefinePlugin({
// 		//   "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
// 		//   "process.env.API_BASE": JSON.stringify(process.env.API_BASE),
// 		// }),
// 		// new webpack.EnvironmentPlugin([
// 		//   "NODE_ENV",
// 		//   "API_BASE",
// 		//   "UPLOAD_API_BASE",
// 		//   "PUSH_SERVER_API_BASE",
// 		//   "XHR_UPLOAD_SERVER_API_BASE",
// 		//   "DRIVE_SERVER_API_BASE",
// 		// ]),
// 		new webpack.DefinePlugin(env.stringified)

// 		// new webpack.DefinePlugin({
// 		// 	'process.env': JSON.stringify(process.env)
// 		// })
// 		// new webpack.DefinePlugin(
// 		// 	devMode
// 		// 		? {
// 		// 				'process.env': {
// 		// 					NODE_ENV: JSON.stringify('development'),
// 		// 					API_BASE: JSON.stringify(process.env.API_BASE),
// 		// 					// UPLOAD_API_BASE: JSON.stringify(process.env.UPLOAD_API_BASE),
// 		// 					// PUSH_SERVER_API_BASE: JSON.stringify(process.env.PUSH_SERVER_API_BASE),
// 		// 					XHR_UPLOAD_SERVER_API_BASE: JSON.stringify(
// 		// 						process.env.XHR_UPLOAD_SERVER_API_BASE
// 		// 					)
// 		// 					// DRIVE_SERVER_API_BASE: JSON.stringify(process.env.DRIVE_SERVER_API_BASE)
// 		// 				}
// 		// 		  }
// 		// 		: envKeys
// 		// )
// 		// new ESLintPlugin({
// 		// 	extensions: ['.tsx', '.ts', '.js'],
// 		// 	exclude: 'node_modules',
// 		// 	context: './src'
// 		// })
// 		// new webpack.DefinePlugin({
// 		//   "process.env": {
// 		//     NODE_ENV: JSON.stringify(envKeys.NODE_ENV),
// 		//     API_BASE: JSON.stringify(envKeys.API_BASE),
// 		//   },
// 		// }),

// 		// new webpack.DefinePlugin({
// 		//   "process.env": {
// 		//     NODE_ENV: JSON.stringify(process.env.NODE_ENV),
// 		//   },
// 		// }),
// 	]
// 	// Comment because not need in development
// 	// optimization: {
// 	// 	minimize: true,
// 	// 	minimizer: [
// 	// 		// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// 	// 		`...`,
// 	// 		new CssMinimizerPlugin({
// 	// 			minimizerOptions: {
// 	// 				parallel: 4,
// 	// 				minify: CssMinimizerPlugin.cleanCssMinify,
// 	// 				preset: [
// 	// 					'default',
// 	// 					{
// 	// 						discardComments: { removeAll: true }
// 	// 					}
// 	// 				]
// 	// 			}
// 	// 		})
// 	// 	]
// 	// }
// 	// optimization: {
// 	//   // minimizer: [new UglifyJsPlugin({ sourceMap: true })],
// 	//   // minimize: true,
// 	//   minimizer: [new TerserPlugin({ sourceMap: true })],
// 	// },
// 	// devServer: {
// 	// 	historyApiFallback: true
// 	// }
// };

// // /* eslint-disable @typescript-eslint/no-var-requires */
// // const path = require('path');
// // const webpack = require('webpack');
// // const HtmlWebpackPlugin = require('html-webpack-plugin');
// // const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// // const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// // const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// // const CopyPlugin = require('copy-webpack-plugin');
// // const ESLintPlugin = require('eslint-webpack-plugin');
// // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// // const devMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

// // /* dotenv */
// // const dotenv = require('dotenv');
// // const fs = require('fs');

// // const currentPath = path.join(__dirname, '..');

// // // Create the fallback path (the development .env)
// // const basePath = currentPath + '/.env';
// // const envPath = basePath + '.' + process.env.NODE_ENV;

// // // Check if the file exists, otherwise fall back to the production .env
// // const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// // // Set the path parameter in the dotenv config
// // const fileEnv = dotenv.config({ path: finalPath }).parsed;

// // // call dotenv and it will return an Object with a parsed key
// // // reduce it to a nice object, the same as before (but with the variables from the file)
// // const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
// // 	prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
// // 	return prev;
// // }, {});

// // module.exports = {
// // 	entry: './src/index.tsx',
// // 	// mode: 'development',
// // 	// devtool: 'source-map',
// // 	output: {
// // 		path: path.join(__dirname, '..', 'dist'), // path.resolve(__dirname, '../dist'),
// // 		// static: [path.join(__dirname, '..', 'dist')],
// // 		filename: '[name].[contenthash].js',
// // 		clean: true
// // 	},

// // 	module: {
// // 		rules: [
// // 			{
// // 				test: /\.(js|jsx)$/,
// // 				exclude: /node_modules/,
// // 				use: {
// // 					loader: 'babel-loader'
// // 				}
// // 			},
// // 			{
// // 				test: /\.tsx?$/,
// // 				exclude: /node_modules/,
// // 				use: [
// // 					{
// // 						loader: 'babel-loader',
// // 						options: {
// // 							presets: [
// // 								'@babel/preset-env',
// // 								'@babel/preset-react',
// // 								'@babel/preset-typescript'
// // 							]
// // 						}
// // 					},
// // 					{
// // 						loader: 'ts-loader',
// // 						options: {
// // 							compilerOptions: {
// // 								noEmit: false
// // 							}
// // 						}
// // 					}
// // 				]
// // 			},
// // 			// {
// // 			//     test: /\.tsx?$/,
// // 			//     exclude: /node_modules/,
// // 			//     use: {
// // 			//         loader: 'ts-loader',
// // 			//         options: {
// // 			//             // disable type checker - we will use it in fork plugin
// // 			//             transpileOnly: true
// // 			//         }
// // 			//     }
// // 			// },
// // 			// {
// // 			//     test: /\.s(a|c)ss$/,
// // 			//     use: ['style-loader', 'sass-loader', 'css-loader']
// // 			// },
// // 			{
// // 				test: /\.svg$/,
// // 				loader: 'svg-inline-loader'
// // 			},
// // 			{
// // 				test: /\.s(a|c)ss$/,
// // 				use: [
// // 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// // 					'css-loader',
// // 					{
// // 						loader: 'sass-loader',
// // 						options: {
// // 							sourceMap: true
// // 						}
// // 					}
// // 				]
// // 			},
// // 			{
// // 				test: /\.css$/,
// // 				include: [path.resolve(__dirname, 'src')],
// // 				use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
// // 			},
// // 			{
// // 				test: /.s?css$/,
// // 				use: [
// // 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// // 					'css-loader',
// // 					'sass-loader'
// // 				]
// // 			},
// // 			{
// // 				test: /\.less$/,
// // 				use: [
// // 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// // 					'css-loader',
// // 					'sass-loader'
// // 				]
// // 			},
// // 			{
// // 				test: /\.(jpe?g|png|gif|svg)$/i,
// // 				loader: 'file-loader',
// // 				options: {
// // 					name: devMode ? '[path][name].[ext]' : '[contenthash].[ext]'
// // 				},
// // 				type: 'asset/resource'
// // 			},
// // 			{
// // 				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
// // 				use: [
// // 					{
// // 						loader: 'file-loader',
// // 						options: {
// // 							name: '[name].[ext]',
// // 							outputPath: 'fonts/'
// // 						}
// // 					}
// // 				],
// // 				type: 'asset/resource'
// // 			}
// // 		]
// // 	},
// // 	resolve: {
// // 		extensions: ['.tsx', '.ts', '.js'],
// // 		alias: {
// // 			'@app': path.resolve(__dirname, '../src')
// // 		}
// // 	},
// // 	plugins: [
// // 		new webpack.BannerPlugin({
// // 			banner: 'hello world',
// // 			entryOnly: true
// // 		}),
// // 		new HtmlWebpackPlugin({
// // 			template: './public/index.html',
// // 			filename: 'index.html',
// // 			title: 'Dharmesh Patel'
// // 		}),

// // 		new MiniCssExtractPlugin({
// // 			// Options similar to the same options in webpackOptions.output
// // 			// both options are optional
// // 			filename: devMode ? '[name].css' : '[name].[contenthash].css', //'[name].[contenthash].css',
// // 			chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css' // '[id].css'
// // 		}),
// // 		new ForkTsCheckerWebpackPlugin(),
// // 		new CopyPlugin({
// // 			patterns: [
// // 				{ from: './src/assets', to: 'assets' },
// // 				{ from: './public/manifest.json', to: path.join(__dirname, '../dist') },
// // 				{ from: 'public', to: 'public' }
// // 			],
// // 			options: {
// // 				concurrency: 100
// // 			}
// // 		}),
// // 		new webpack.DefinePlugin(
// // 			devMode
// // 				? {
// // 						'process.env': {
// // 							NODE_ENV: JSON.stringify('development'),
// // 							API_BASE: JSON.stringify(process.env.API_BASE),
// // 							// UPLOAD_API_BASE: JSON.stringify(process.env.UPLOAD_API_BASE),
// // 							// PUSH_SERVER_API_BASE: JSON.stringify(process.env.PUSH_SERVER_API_BASE),
// // 							XHR_UPLOAD_SERVER_API_BASE: JSON.stringify(
// // 								process.env.XHR_UPLOAD_SERVER_API_BASE
// // 							)
// // 							// DRIVE_SERVER_API_BASE: JSON.stringify(process.env.DRIVE_SERVER_API_BASE)
// // 						}
// // 				  }
// // 				: envKeys
// // 		),
// // 		new BundleAnalyzerPlugin({
// // 			analyzerMode: 'static',
// // 			openAnalyzer: false
// // 		})
// // 		//new webpack.HotModuleReplacementPlugin()
// // 		// new ESLintPlugin({
// // 		//     extensions: ['.tsx', '.ts', '.js'],
// // 		//     exclude: 'node_modules',
// // 		//     context: './src'
// // 		// })
// // 	]
// // 	// optimization: {
// // 	// 	minimizer: [
// // 	// 		// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// // 	// 		`...`,
// // 	// 		new CssMinimizerPlugin({
// // 	// 			parallel: true
// // 	// 		})
// // 	// 	],
// // 	// 	// If you want to run it also in development set the optimization.minimize option to true
// // 	// 	minimize: true
// // 	// 	// moduleIds: 'deterministic', //Added this to retain hash of vendor chunks.
// // 	// 	// runtimeChunk: 'single',
// // 	// 	// splitChunks: {
// // 	// 	// 	cacheGroups: {
// // 	// 	// 		vendor: {
// // 	// 	// 			test: /[\\/]node_modules[\\/]/,
// // 	// 	// 			name: 'vendors',
// // 	// 	// 			chunks: 'all'
// // 	// 	// 		}
// // 	// 	// 	}
// // 	// 	// }
// // 	// }
// // };

// // const path = require('path');
// // const webpack = require('webpack');
// // const HtmlWebPackPlugin = require('html-webpack-plugin');
// // const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// // const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// // const CopyPlugin = require('copy-webpack-plugin');

// // // Doing TypeScript type checking
// // const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// // const devMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

// // /* dotenv */
// // const dotenv = require('dotenv');
// // const fs = require('fs');

// // const currentPath = path.join(__dirname, '..');

// // // Create the fallback path (the development .env)
// // const basePath = currentPath + '/.env';
// // const envPath = basePath + '.' + process.env.NODE_ENV;

// // // Check if the file exists, otherwise fall back to the production .env
// // const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// // // Set the path parameter in the dotenv config
// // const fileEnv = dotenv.config({ path: finalPath }).parsed;

// // // call dotenv and it will return an Object with a parsed key
// // // reduce it to a nice object, the same as before (but with the variables from the file)
// // const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
// //     prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
// //     return prev;
// // }, {});

// // console.log("devMode", devMode)
// // console.log("envKeys", envKeys)
// // console.log("template", path.resolve(__dirname, "../public", "index.html"));

// // // const htmlWebpackPlugin = new HtmlWebPackPlugin({
// // //     template: path.resolve(__dirname, "../public", "index.html"),
// // //     filename: './index.html',
// // //     title: 'Dharmesh',
// // //     manifest: path.resolve(__dirname, "../public", "manifest.json"),
// // // })

// // const htmlWebpackPlugin = new HtmlWebPackPlugin({
// //     template: './public/index.html',
// //     filename: './index.html',
// //     title: 'SleepGuard'
// // });

// // module.exports = {
// //     entry: './src/index.tsx',
// //     output: {
// //         path: path.resolve(__dirname, '../dist'),
// //         //filename: '[name].[fullhash].js',
// //         filename: '[name].bundle.js',
// //         // chunkFilename: '[name].[chunkhash].js',
// //         // publicPath: './',
// //         clean: true,
// //     },

// //     module: {
// //         rules: [
// //             // {
// //             //     test: /\.html$/,
// //             //     exclude: /node_modules/,
// //             //     use: [
// //             //         {
// //             //             loader: 'html-loader',
// //             //             options: { minimize: true }
// //             //         }
// //             //     ]
// //             // },
// //             {
// //                 test: /\.(js|jsx)$/,
// //                 exclude: /node_modules/,
// //                 use: {
// //                     loader: 'babel-loader'
// //                 }
// //             },
// //             {
// //                 test: /\.tsx?$/,
// //                 exclude: /node_modules/,
// //                 use: [
// //                     {
// //                         loader: 'babel-loader',
// //                         options: {
// //                             presets: [
// //                                 "@babel/preset-env",
// //                                 "@babel/preset-react",
// //                                 "@babel/preset-typescript",
// //                             ],
// //                         },
// //                     },
// //                     {
// //                         loader: 'ts-loader',
// //                         options: {
// //                             compilerOptions: {
// //                                 noEmit: false,
// //                             },
// //                         },
// //                     }
// //                 ],
// //             },
// //             {
// //                 test: /\.css$/,
// //                 include: [path.resolve(__dirname, 'src')],
// //                 use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
// //             },
// //             {
// //                 test: /.s?css$/,
// //                 use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
// //             },
// //             {
// //                 test: /\.less$/,
// //                 use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
// //             },
// //             // {
// //             //     test: /\.less$/,
// //             //     use: [
// //             //         {
// //             //             loader: 'style-loader' // creates style nodes from JS strings
// //             //         },
// //             //         {
// //             //             loader: 'css-loader' // translates CSS into CommonJS
// //             //         },
// //             //         {
// //             //             loader: 'less-loader' // compiles Less to CSS
// //             //         }
// //             //     ]
// //             // },
// //             {
// //                 test: /\.svg$/,
// //                 loader: 'svg-inline-loader'
// //             },
// //             {
// //                 test: /\.(jpe?g|png|gif|svg)$/i,
// //                 loader: 'file-loader',
// //                 options: {
// //                     name: devMode ? '[path][name].[ext]' : '[contenthash].[ext]'
// //                 },
// //                 type: 'asset/resource',
// //             },
// //             {
// //                 test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
// //                 use: [
// //                     {
// //                         loader: 'file-loader',
// //                         options: {
// //                             name: '[name].[ext]',
// //                             outputPath: 'fonts/'
// //                         }
// //                     }
// //                 ],
// //                 type: 'asset/resource',
// //             }
// //         ]
// //     },
// //     resolve: {
// //         extensions: ['.tsx', '.ts', '.js'],
// //         alias: {
// //             '@app': path.resolve(__dirname, '../src'),
// //         }
// //     },
// //     plugins: [
// //         htmlWebpackPlugin,
// //         // new BundleAnalyzerPlugin({
// //         //   // Port that will be used by in `server` mode to start HTTP server.
// //         //   analyzerPort: 4000,
// //         // }),
// //         // new MiniCssExtractPlugin({
// //         //     filename: devMode ? '[name].css' : '[name].[fullhash].css',
// //         //     chunkFilename: devMode ? '[id].css' : '[id].[fullhash].css'
// //         // }),
// //         // new CopyPlugin({
// //         //     patterns: [
// //         //         // {
// //         //         //     from: 'public/firebase-messaging-sw.js',
// //         //         //     to: path.join(__dirname, '../dist')
// //         //         // },
// //         //         {
// //         //             from: 'public/manifest.json',
// //         //             to: path.join(__dirname, '../dist')
// //         //         },
// //         //         { from: 'public', to: 'public' }
// //         //     ],
// //         //     options: {
// //         //         concurrency: 100
// //         //     }
// //         // }),
// //         // new ForkTsCheckerWebpackPlugin(),
// //         new webpack.DefinePlugin(
// //             devMode
// //                 ? {
// //                     'process.env': {
// //                         NODE_ENV: JSON.stringify('development'),
// //                         API_BASE: JSON.stringify(process.env.API_BASE),
// //                         // UPLOAD_API_BASE: JSON.stringify(process.env.UPLOAD_API_BASE),
// //                         // PUSH_SERVER_API_BASE: JSON.stringify(process.env.PUSH_SERVER_API_BASE),
// //                         XHR_UPLOAD_SERVER_API_BASE: JSON.stringify(process.env.XHR_UPLOAD_SERVER_API_BASE)
// //                         // DRIVE_SERVER_API_BASE: JSON.stringify(process.env.DRIVE_SERVER_API_BASE)
// //                     }
// //                 }
// //                 : envKeys
// //         )
// //     ],
// //     // optimization: {
// //     //     minimizer: [
// //     //         // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// //     //         `...`,
// //     //         new CssMinimizerPlugin({
// //     //             parallel: true,
// //     //         }),
// //     //     ],
// //     //     // If you want to run it also in development set the optimization.minimize option to true
// //     //     minimize: true,
// //     // },
// // };

// //DX

// // const path = require('path');
// // const HtmlWebpackPlugin = require('html-webpack-plugin');
// // const CopyPlugin = require("copy-webpack-plugin");
// // // Doing TypeScript type checking
// // const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// // const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// // module.exports = {
// //     entry: {
// //         app: './src/index.tsx',
// //     },
// //     output: {
// //         path: path.resolve(__dirname, '../dist'),
// //         filename: '[name].[contenthash].js',
// //         // assetModuleFilename: `${assetsFolderName}/[hash][ext][query]`,
// //         clean: true,
// //         publicPath: "/"
// //     },
// //     module: {
// //         rules: [
// //             {
// //                 test: /\.jsx?$/,
// //                 exclude: /node_modules/,
// //                 loader: 'babel-loader'
// //             },
// //             {
// //                 test: /\.tsx?$/,
// //                 // use: 'ts-loader',
// //                 use: [
// //                     {
// //                         loader: 'babel-loader',
// //                         options: {
// //                             presets: [
// //                                 "@babel/preset-env",
// //                                 "@babel/preset-react",
// //                                 "@babel/preset-typescript",
// //                             ],
// //                         },
// //                     },
// //                     {
// //                         loader: 'ts-loader',
// //                         options: {
// //                             compilerOptions: {
// //                                 noEmit: false,
// //                             },
// //                         },
// //                     }
// //                 ],
// //                 exclude: /node_modules/,
// //             },
// //             {
// //                 test: /\.json$/,
// //                 loader: 'json-loader'
// //             },
// //             {
// //                 test: /\.css$/i,
// //                 use: ['style-loader', 'css-loader'],
// //             },
// //             {
// //                 test: /\.(png|svg|jpg|jpeg|gif)$/i,
// //                 type: 'asset/resource',
// //             },
// //             {
// //                 test: /\.(woff|woff2|eot|ttf|otf)$/i,
// //                 type: 'asset/resource',
// //             },
// //         ]
// //     },
// //     resolve: {
// //         extensions: ['.tsx', '.ts', '.js'],
// //         alias: {
// //             '@app': path.resolve(__dirname, '../src'),
// //         }
// //     },
// //     plugins: [
// //         new HtmlWebpackPlugin({
// //             template: path.resolve(__dirname, "../public", "index.html"),
// //             //  filename: "index.html",
// //             manifest: path.resolve(__dirname, "../public", "manifest.json"),
// //         }),
// //         new CopyPlugin({
// //             patterns: [
// //                 {
// //                     from: path.resolve(__dirname, "../public"),
// //                     to: 'assets',
// //                     globOptions: {
// //                         ignore: ['*.DS_Store'],
// //                     },
// //                 },
// //             ],
// //         }),
// //         new ForkTsCheckerWebpackPlugin()
// //     ],
// //     // watchOptions: {
// //     //     // for some systems, watching many files can result in a lot of CPU or memory usage
// //     //     // https://webpack.js.org/configuration/watch/#watchoptionsignored
// //     //     // don't use this pattern, if you have a monorepo with linked packages
// //     //     ignored: path.resolve(__dirname, "../node_modules"),
// //     // },
// //     optimization: {
// //         minimize: true,
// //         minimizer: [
// //             // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// //             `...`,
// //             new CssMinimizerPlugin(),
// //         ], runtimeChunk: {
// //             name: 'runtime',
// //         },
// //         splitChunks: {
// //             cacheGroups: {
// //                 commons: {
// //                     test: /[\\/]node_modules[\\/]/,
// //                     name: 'vendor',
// //                     chunks: 'initial',
// //                 },
// //             },
// //         },
// //     },
// // };

// // //    // "webpack": "webpack-dev-server --open --mode development --hot",
// // //"webpack": "webpack --mode productionwebpack --config config/webpack.prod.js",

// // // https://github.com/glook/webpack-typescript-react/blob/master/webpack/optimization.js
// // https://blog.kiprosh.com/application-performance-optimisation-using-webpack/
// // https://indepth.dev/posts/1490/webpack-an-in-depth-introduction-to-splitchunksplugin


// const webpack = require('webpack');
// const HtmlWebPackPlugin = require('html-webpack-plugin');
// // const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const ESLintPlugin = require('eslint-webpack-plugin');
// // const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// // const TerserPlugin = require("terser-webpack-plugin");
// // const CompressionPlugin = require("compression-webpack-plugin");
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
// const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
// const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
// const path = require('path');
// const fs = require('fs');
// const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
// const paths = require('./paths');
// const modules = require('./modules');
// const getClientEnvironment = require('./env');

// const devMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

// // Source maps are resource heavy and can cause out of memory issue for large source files.
// const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

// const isEnvDevelopment =
// 	process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';
// const isEnvProduction = process.env.NODE_ENV === 'production';

// const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000');

// // Check if TypeScript is setup
// const useTypeScript = fs.existsSync(paths.appTsConfig);

// // Check if Tailwind config exists
// const useTailwind = fs.existsSync(path.join(paths.appPath, 'tailwind.config.js'));

// // style files regexes
// const cssRegex = /\.css$/;
// const cssModuleRegex = /\.module\.css$/;
// const sassRegex = /\.(scss|sass)$/;
// const sassModuleRegex = /\.module\.(scss|sass)$/;

// // /* dotenv */
// // const dotenv = require('dotenv');
// // const fs = require('fs');

// // const currentPath = path.join(__dirname, '..');
// // // Create the fallback path (the development .env)
// // const basePath = currentPath + '/.env';
// // const envPath = basePath + '.' + process.env.NODE_ENV;
// // // Check if the file exists, otherwise fall back to the production .env
// // const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// // // Set the path parameter in the dotenv config
// // const fileEnv = dotenv.config({ path: finalPath }).parsed;

// // // call dotenv and it will return an Object with a parsed key
// // // reduce it to a nice object, the same as before (but with the variables from the file)
// // const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
// // 	prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
// // 	return prev;
// // }, {});

// // We use `PUBLIC_URL` environment variable or "homepage" field to infer
// // "public path" at which the app is served.
// // webpack needs to know it to put the right <script> hrefs into HTML even in
// // single-page apps that may serve index.html for nested URLs like /todos/42.
// // We can't use a relative path in HTML because we don't want to load something
// // like /todos/42/static/js/bundle.7289d.js. We have to know the root.
// const publicUrlOrPath = getPublicUrlOrPath(
// 	process.env.NODE_ENV === 'development',
// 	require(paths.resolveApp('package.json')).homepage,
// 	process.env.PUBLIC_URL
// );

// const env = getClientEnvironment(publicUrlOrPath.slice(0, -1));

// console.log('PATHSS', paths);

// // common function to get style loaders
// const getStyleLoaders = (cssOptions, preProcessor) => {
// 	const loaders = [
// 		isEnvDevelopment && require.resolve('style-loader'),
// 		isEnvProduction && {
// 			loader: MiniCssExtractPlugin.loader,
// 			// css is located in `static/css`, use '../../' to locate index.html folder
// 			// in production `paths.publicUrlOrPath` can be a relative path
// 			options: paths.publicUrlOrPath.startsWith('.') ? { publicPath: '../../' } : {}
// 		},
// 		{
// 			loader: require.resolve('css-loader'),
// 			options: cssOptions
// 		}
// 		// {
// 		// 	// Options for PostCSS as we reference these options twice
// 		// 	// Adds vendor prefixing based on your specified browser support in
// 		// 	// package.json
// 		// 	loader: require.resolve('postcss-loader'),
// 		// 	options: {
// 		// 		postcssOptions: {
// 		// 			// Necessary for external CSS imports to work
// 		// 			// https://github.com/facebook/create-react-app/issues/2677
// 		// 			ident: 'postcss',
// 		// 			config: false,
// 		// 			plugins: !useTailwind
// 		// 				? [
// 		// 						'postcss-flexbugs-fixes',
// 		// 						[
// 		// 							'postcss-preset-env',
// 		// 							{
// 		// 								autoprefixer: {
// 		// 									flexbox: 'no-2009'
// 		// 								},
// 		// 								stage: 3
// 		// 							}
// 		// 						],
// 		// 						// Adds PostCSS Normalize as the reset css with default options,
// 		// 						// so that it honors browserslist config in package.json
// 		// 						// which in turn let's users customize the target behavior as per their needs.
// 		// 						'postcss-normalize'
// 		// 				  ]
// 		// 				: [
// 		// 						'tailwindcss',
// 		// 						'postcss-flexbugs-fixes',
// 		// 						[
// 		// 							'postcss-preset-env',
// 		// 							{
// 		// 								autoprefixer: {
// 		// 									flexbox: 'no-2009'
// 		// 								},
// 		// 								stage: 3
// 		// 							}
// 		// 						]
// 		// 				  ]
// 		// 		},
// 		// 		sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment
// 		// 	}
// 		// }
// 	].filter(Boolean);
// 	if (preProcessor) {
// 		loaders.push(
// 			{
// 				loader: require.resolve('resolve-url-loader'),
// 				options: {
// 					sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
// 					root: paths.appSrc
// 				}
// 			},
// 			{
// 				loader: require.resolve(preProcessor),
// 				options: {
// 					sourceMap: true
// 				}
// 			}
// 		);
// 	}
// 	return loaders;
// };

// module.exports = {
// 	// entry: './src/index.tsx',
// 	// These are the "entry points" to our application.
// 	// This means they will be the "root" imports that are included in JS bundle.
// 	entry: paths.appIndexJs,
// 	output: {
// 		// path: path.join(__dirname, '../dist'),
// 		// The build folder.
// 		path: paths.appBuild,
// 		// Add /* filename */ comments to generated require()s in the output.
// 		pathinfo: isEnvDevelopment,
// 		filename: '[name].[fullhash].js',
// 		chunkFilename: '[name].[chunkhash].js',
// 		clean: true,
// 		publicPath: publicUrlOrPath
// 	},
// 	module: {
// 		strictExportPresence: true,
// 		rules: [
// 			{
// 				// "oneOf" will traverse all following loaders until one will
// 				// match the requirements. When no loader matches it will fall
// 				// back to the "file" loader at the end of the loader list.
// 				oneOf: [
// 					// TODO: Merge this config once `image/avif` is in the mime-db
// 					// https://github.com/jshttp/mime-db
// 					{
// 						test: [/\.avif$/],
// 						type: 'asset',
// 						mimetype: 'image/avif',
// 						parser: {
// 							dataUrlCondition: {
// 								maxSize: imageInlineSizeLimit
// 							}
// 						}
// 					},
// 					// "url" loader works like "file" loader except that it embeds assets
// 					// smaller than specified limit in bytes as data URLs to avoid requests.
// 					// A missing `test` is equivalent to a match.
// 					{
// 						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
// 						type: 'asset',
// 						parser: {
// 							dataUrlCondition: {
// 								maxSize: imageInlineSizeLimit
// 							}
// 						}
// 					},
// 					{
// 						test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/, //|svg
// 						use: [
// 							{
// 								loader: 'file-loader',
// 								options: {
// 									name: '[name].[ext]',
// 									outputPath: 'fonts/'
// 								}
// 							}
// 						]
// 					},
// 					{
// 						test: /\.svg$/,
// 						use: [
// 							{
// 								loader: require.resolve('@svgr/webpack'),
// 								options: {
// 									prettier: false,
// 									svgo: false,
// 									svgoConfig: {
// 										plugins: [{ removeViewBox: false }]
// 									},
// 									titleProp: true,
// 									ref: true
// 								}
// 							},
// 							{
// 								loader: require.resolve('file-loader'),
// 								options: {
// 									name: 'static/media/[name].[hash].[ext]'
// 								}
// 							}
// 						],
// 						issuer: {
// 							and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
// 						}
// 					},
// 					{
// 						test: /\.svg$/,
// 						use: {
// 							loader: 'svg-url-loader'
// 						}
// 					},
// 					{
// 						test: /\.(js|jsx)$/,
// 						include: paths.appSrc,
// 						exclude: /node_modules/,
// 						loader: 'babel-loader',
// 						options: {
// 							// This is a feature of `babel-loader` for webpack (not Babel itself).
// 							// It enables caching results in ./node_modules/.cache/babel-loader/
// 							// directory for faster rebuilds.
// 							cacheDirectory: true,
// 							// See #6846 for context on why cacheCompression is disabled
// 							cacheCompression: false,
// 							compact: isEnvProduction
// 						}
// 					},
// 					{
// 						test: /\.(ts|tsx)$/,
// 						// test: /\.tsx?$/,
// 						include: paths.appSrc,
// 						exclude: /node_modules/,
// 						use: [
// 							{
// 								loader: 'babel-loader',
// 								options: {
// 									presets: [
// 										'@babel/preset-env',
// 										'@babel/preset-react',
// 										'@babel/preset-typescript'
// 									],
// 									// This is a feature of `babel-loader` for webpack (not Babel itself).
// 									// It enables caching results in ./node_modules/.cache/babel-loader/
// 									// directory for faster rebuilds.
// 									cacheDirectory: true,
// 									// See #6846 for context on why cacheCompression is disabled
// 									cacheCompression: false,
// 									compact: isEnvProduction
// 								}
// 							},
// 							{
// 								loader: 'ts-loader',
// 								options: {
// 									compilerOptions: {
// 										noEmit: false
// 									}
// 								}
// 							}
// 						]
// 					},
// 					{
// 						test: /\.html$/,
// 						exclude: /node_modules/,
// 						use: [
// 							{
// 								loader: 'html-loader',
// 								options: { minimize: isEnvProduction }
// 							}
// 						]
// 					},
// 					{
// 						test: /\.css$/,
// 						include: paths.appSrc,
// 						// include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'web')],
// 						use: [
// 							isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
// 							{
// 								loader: 'css-loader',
// 								options: {
// 									sourceMap: isEnvProduction
// 										? shouldUseSourceMap
// 										: isEnvDevelopment
// 								}
// 							}
// 						]
// 					},
// 					{
// 						test: /\.s?[ac]ss$/,
// 						use: [
// 							isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
// 							{
// 								loader: 'css-loader',
// 								options: {
// 									sourceMap: isEnvProduction
// 										? shouldUseSourceMap
// 										: isEnvDevelopment
// 								}
// 							},
// 							{
// 								loader: 'sass-loader',
// 								options: {
// 									sourceMap: isEnvProduction
// 										? shouldUseSourceMap
// 										: isEnvDevelopment
// 								}
// 							}
// 						]
// 					},
// 					{
// 						test: /\.less$/,
// 						use: [
// 							{
// 								loader: 'style-loader' // creates style nodes from JS strings
// 							},
// 							{
// 								loader: 'css-loader' // creates style nodes from JS strings
// 							},
// 							{
// 								loader: 'sass-loader',
// 								options: { sourceMap: true }
// 							},
// 							{
// 								loader: 'less-loader', // compiles Less to CSS
// 								options: { sourceMap: true }
// 							}
// 						]
// 					}
// 				]
// 			}
// 			// {
// 			// 	test: /\.html$/,
// 			// 	exclude: /node_modules/,
// 			// 	use: [
// 			// 		{
// 			// 			loader: 'html-loader',
// 			// 			options: { minimize: true }
// 			// 		}
// 			// 	]
// 			// },
// 			// {
// 			// 	test: /\.(js|jsx)$/,
// 			// 	exclude: /node_modules/,
// 			// 	use: {
// 			// 		loader: 'babel-loader'
// 			// 	}
// 			// },
// 			// {
// 			// 	test: /\.tsx?$/,
// 			// 	exclude: /node_modules/,
// 			// 	use: [
// 			// 		{
// 			// 			loader: 'babel-loader',
// 			// 			options: {
// 			// 				presets: [
// 			// 					'@babel/preset-env',
// 			// 					'@babel/preset-react',
// 			// 					'@babel/preset-typescript'
// 			// 				]
// 			// 			}
// 			// 		},
// 			// 		{
// 			// 			loader: 'ts-loader',
// 			// 			options: {
// 			// 				compilerOptions: {
// 			// 					noEmit: false
// 			// 				}
// 			// 			}
// 			// 		}
// 			// 	]
// 			// },
// 			// {
// 			// 	test: /\.css$/,
// 			// 	include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'web')],
// 			// 	use: [
// 			// 		devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// 			// 		{ loader: 'css-loader', options: { sourceMap: true } }
// 			// 	]
// 			// },
// 			// {
// 			// 	test: /\.s?[ac]ss$/,
// 			// 	use: [
// 			// 		devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// 			// 		{ loader: 'css-loader', options: { sourceMap: true } },
// 			// 		{ loader: 'sass-loader', options: { sourceMap: true } }
// 			// 	]
// 			// },
// 			// {
// 			// 	test: /\.less$/,
// 			// 	use: [
// 			// 		{
// 			// 			loader: 'style-loader' // creates style nodes from JS strings
// 			// 		},
// 			// 		{
// 			// 			loader: 'css-loader' // creates style nodes from JS strings
// 			// 		},
// 			// 		{
// 			// 			loader: 'sass-loader',
// 			// 			options: { sourceMap: true }
// 			// 		},
// 			// 		{
// 			// 			loader: 'less-loader', // compiles Less to CSS
// 			// 			options: { sourceMap: true }
// 			// 		}
// 			// 	]
// 			// }
// 		]
// 	},
// 	resolve: {
// 		// This allows you to set a fallback for where webpack should look for modules.
// 		// We placed these paths second because we want `node_modules` to "win"
// 		// if there are any conflicts. This matches Node resolution mechanism.
// 		// https://github.com/facebook/create-react-app/issues/253
// 		modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
// 		// These are the reasonable defaults supported by the Node ecosystem.
// 		// We also include JSX as a common component filename extension to support
// 		// some tools, although we do not recommend using it, see:
// 		// https://github.com/facebook/create-react-app/issues/290
// 		// `web` extension prefixes have been added for better support
// 		// for React Native Web.
// 		extensions: paths.moduleFileExtensions
// 			.map(ext => `.${ext}`)
// 			.filter(ext => useTypeScript || !ext.includes('ts')),
// 		// extensions: ['.tsx', '.ts', '.js', '.jsx'],
// 		alias: {
// 			'@app': path.resolve(__dirname, '../src'),
// 			'@apptypes': path.resolve(__dirname, '../src/types'),
// 			'@assets': path.resolve(__dirname, '../src/assets'),
// 			'@components': path.resolve(__dirname, '../src/components'),
// 			'@contexts': path.resolve(__dirname, '../src/contexts'),
// 			'@global': path.resolve(__dirname, '../src/global'),
// 			'@hooks': path.resolve(__dirname, '../src/hooks'),
// 			'@interface': path.resolve(__dirname, '../src/interface'),
// 			'@locales': path.resolve(__dirname, '../src/locales'),
// 			'@pages': path.resolve(__dirname, '../src/pages'),
// 			'@routes': path.resolve(__dirname, '../src/routes'),
// 			'@store': path.resolve(__dirname, '../src/store'),
// 			'@sections': path.resolve(__dirname, '../src/sections'),
// 			'@services': path.resolve(__dirname, '../src/services'),
// 			'@styles': path.resolve(__dirname, '../src/styles'),
// 			'@themes': path.resolve(__dirname, '../src/themes'),
// 			'@utils': path.resolve(__dirname, '../src/utils'),
// 			...(modules.webpackAliases || {})
// 		},
// 		plugins: [
// 			// Prevents users from importing files from outside of src/ (or node_modules/).
// 			// This often causes confusion because we only process files within src/ with babel.
// 			// To fix this, we prevent you from importing files out of src/ -- if you'd like to,
// 			// please link the files into your node_modules/ and let module-resolution kick in.
// 			// Make sure your source files are compiled, as they will not be processed in any way.
// 			new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
// 		]
// 	},
// 	plugins: [
// 		// htmlWebpackPlugin,
// 		new HtmlWebPackPlugin(
// 			Object.assign(
// 				{},
// 				{
// 					inject: true,
// 					template: paths.appHtml
// 				},
// 				isEnvProduction
// 					? {
// 							minify: {
// 								removeComments: true,
// 								collapseWhitespace: true,
// 								removeRedundantAttributes: true,
// 								useShortDoctype: true,
// 								removeEmptyAttributes: true,
// 								removeStyleLinkTypeAttributes: true,
// 								keepClosingSlash: true,
// 								minifyJS: true,
// 								minifyCSS: true,
// 								minifyURLs: true
// 							}
// 					  }
// 					: undefined
// 			)
// 		),
// 		// new BundleAnalyzerPlugin({
// 		// 	// Port that will be used by in `server` mode to start HTTP server.
// 		// 	analyzerPort: 4000
// 		// }),
// 		// Makes some environment variables available in index.html.
// 		// The public URL is available as %PUBLIC_URL% in index.html, e.g.:
// 		// <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
// 		// It will be an empty string unless you specify "homepage"
// 		// in `package.json`, in which case it will be the pathname of that URL.
// 		new InterpolateHtmlPlugin(HtmlWebPackPlugin, env.raw),
// 		// new MiniCssExtractPlugin({
// 		// 	filename: devMode ? '[name].css' : '[name].[fullhash].css',
// 		// 	chunkFilename: devMode ? '[id].css' : '[id].[fullhash].css'
// 		// }),
// 		// new CompressionPlugin(),
// 		new CopyPlugin({
// 			patterns: [
// 				// {
// 				// 	from: 'public/firebase-messaging-sw.js',
// 				// 	to: path.join(__dirname, '../dist')
// 				// },
// 				{
// 					from: 'public/manifest.json',
// 					to: paths.appBuild //path.join(__dirname, '../dist')
// 				},
// 				{ from: 'public', to: 'public' }
// 			],
// 			options: {
// 				concurrency: 100
// 			}
// 		}),
// 		new webpack.DefinePlugin(env.stringified)
// 	]
// };

// // END

// // /* eslint-disable @typescript-eslint/no-var-requires */
// // const path = require('path');
// // const webpack = require('webpack');
// // const HtmlWebpackPlugin = require('html-webpack-plugin');
// // const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// // const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// // const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// // const CopyPlugin = require('copy-webpack-plugin');
// // const ESLintPlugin = require('eslint-webpack-plugin');
// // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// // const devMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

// // /* dotenv */
// // const dotenv = require('dotenv');
// // const fs = require('fs');

// // const currentPath = path.join(__dirname, '..');

// // // Create the fallback path (the development .env)
// // const basePath = currentPath + '/.env';
// // const envPath = basePath + '.' + process.env.NODE_ENV;

// // // Check if the file exists, otherwise fall back to the production .env
// // const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// // // Set the path parameter in the dotenv config
// // const fileEnv = dotenv.config({ path: finalPath }).parsed;

// // // call dotenv and it will return an Object with a parsed key
// // // reduce it to a nice object, the same as before (but with the variables from the file)
// // const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
// // 	prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
// // 	return prev;
// // }, {});

// // module.exports = {
// // 	entry: './src/index.tsx',
// // 	// mode: 'development',
// // 	// devtool: 'source-map',
// // 	output: {
// // 		path: path.join(__dirname, '..', 'dist'), // path.resolve(__dirname, '../dist'),
// // 		// static: [path.join(__dirname, '..', 'dist')],
// // 		filename: '[name].[contenthash].js',
// // 		clean: true
// // 	},

// // 	module: {
// // 		rules: [
// // 			{
// // 				test: /\.(js|jsx)$/,
// // 				exclude: /node_modules/,
// // 				use: {
// // 					loader: 'babel-loader'
// // 				}
// // 			},
// // 			{
// // 				test: /\.tsx?$/,
// // 				exclude: /node_modules/,
// // 				use: [
// // 					{
// // 						loader: 'babel-loader',
// // 						options: {
// // 							presets: [
// // 								'@babel/preset-env',
// // 								'@babel/preset-react',
// // 								'@babel/preset-typescript'
// // 							]
// // 						}
// // 					},
// // 					{
// // 						loader: 'ts-loader',
// // 						options: {
// // 							compilerOptions: {
// // 								noEmit: false
// // 							}
// // 						}
// // 					}
// // 				]
// // 			},
// // 			// {
// // 			//     test: /\.tsx?$/,
// // 			//     exclude: /node_modules/,
// // 			//     use: {
// // 			//         loader: 'ts-loader',
// // 			//         options: {
// // 			//             // disable type checker - we will use it in fork plugin
// // 			//             transpileOnly: true
// // 			//         }
// // 			//     }
// // 			// },
// // 			// {
// // 			//     test: /\.s(a|c)ss$/,
// // 			//     use: ['style-loader', 'sass-loader', 'css-loader']
// // 			// },
// // 			{
// // 				test: /\.svg$/,
// // 				loader: 'svg-inline-loader'
// // 			},
// // 			{
// // 				test: /\.s(a|c)ss$/,
// // 				use: [
// // 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// // 					'css-loader',
// // 					{
// // 						loader: 'sass-loader',
// // 						options: {
// // 							sourceMap: true
// // 						}
// // 					}
// // 				]
// // 			},
// // 			{
// // 				test: /\.css$/,
// // 				include: [path.resolve(__dirname, 'src')],
// // 				use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
// // 			},
// // 			{
// // 				test: /.s?css$/,
// // 				use: [
// // 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// // 					'css-loader',
// // 					'sass-loader'
// // 				]
// // 			},
// // 			{
// // 				test: /\.less$/,
// // 				use: [
// // 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// // 					'css-loader',
// // 					'sass-loader'
// // 				]
// // 			},
// // 			{
// // 				test: /\.(jpe?g|png|gif|svg)$/i,
// // 				loader: 'file-loader',
// // 				options: {
// // 					name: devMode ? '[path][name].[ext]' : '[contenthash].[ext]'
// // 				},
// // 				type: 'asset/resource'
// // 			},
// // 			{
// // 				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
// // 				use: [
// // 					{
// // 						loader: 'file-loader',
// // 						options: {
// // 							name: '[name].[ext]',
// // 							outputPath: 'fonts/'
// // 						}
// // 					}
// // 				],
// // 				type: 'asset/resource'
// // 			}
// // 		]
// // 	},
// // 	resolve: {
// // 		extensions: ['.tsx', '.ts', '.js'],
// // 		alias: {
// // 			'@app': path.resolve(__dirname, '../src')
// // 		}
// // 	},
// // 	plugins: [
// // 		new webpack.BannerPlugin({
// // 			banner: 'hello world',
// // 			entryOnly: true
// // 		}),
// // 		new HtmlWebpackPlugin({
// // 			template: './public/index.html',
// // 			filename: 'index.html',
// // 			title: 'Dharmesh Patel'
// // 		}),

// // 		new MiniCssExtractPlugin({
// // 			// Options similar to the same options in webpackOptions.output
// // 			// both options are optional
// // 			filename: devMode ? '[name].css' : '[name].[contenthash].css', //'[name].[contenthash].css',
// // 			chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css' // '[id].css'
// // 		}),
// // 		new ForkTsCheckerWebpackPlugin(),
// // 		new CopyPlugin({
// // 			patterns: [
// // 				{ from: './src/assets', to: 'assets' },
// // 				{ from: './public/manifest.json', to: path.join(__dirname, '../dist') },
// // 				{ from: 'public', to: 'public' }
// // 			],
// // 			options: {
// // 				concurrency: 100
// // 			}
// // 		}),
// // 		new webpack.DefinePlugin(
// // 			devMode
// // 				? {
// // 						'process.env': {
// // 							NODE_ENV: JSON.stringify('development'),
// // 							API_BASE: JSON.stringify(process.env.API_BASE),
// // 							// UPLOAD_API_BASE: JSON.stringify(process.env.UPLOAD_API_BASE),
// // 							// PUSH_SERVER_API_BASE: JSON.stringify(process.env.PUSH_SERVER_API_BASE),
// // 							XHR_UPLOAD_SERVER_API_BASE: JSON.stringify(
// // 								process.env.XHR_UPLOAD_SERVER_API_BASE
// // 							)
// // 							// DRIVE_SERVER_API_BASE: JSON.stringify(process.env.DRIVE_SERVER_API_BASE)
// // 						}
// // 				  }
// // 				: envKeys
// // 		),
// // 		new BundleAnalyzerPlugin({
// // 			analyzerMode: 'static',
// // 			openAnalyzer: false
// // 		})
// // 		//new webpack.HotModuleReplacementPlugin()
// // 		// new ESLintPlugin({
// // 		//     extensions: ['.tsx', '.ts', '.js'],
// // 		//     exclude: 'node_modules',
// // 		//     context: './src'
// // 		// })
// // 	]
// // 	// optimization: {
// // 	// 	minimizer: [
// // 	// 		// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// // 	// 		`...`,
// // 	// 		new CssMinimizerPlugin({
// // 	// 			parallel: true
// // 	// 		})
// // 	// 	],
// // 	// 	// If you want to run it also in development set the optimization.minimize option to true
// // 	// 	minimize: true
// // 	// 	// moduleIds: 'deterministic', //Added this to retain hash of vendor chunks.
// // 	// 	// runtimeChunk: 'single',
// // 	// 	// splitChunks: {
// // 	// 	// 	cacheGroups: {
// // 	// 	// 		vendor: {
// // 	// 	// 			test: /[\\/]node_modules[\\/]/,
// // 	// 	// 			name: 'vendors',
// // 	// 	// 			chunks: 'all'
// // 	// 	// 		}
// // 	// 	// 	}
// // 	// 	// }
// // 	// }
// // };

// // const path = require('path');
// // const webpack = require('webpack');
// // const HtmlWebPackPlugin = require('html-webpack-plugin');
// // const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// // const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// // const CopyPlugin = require('copy-webpack-plugin');

// // // Doing TypeScript type checking
// // const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// // const devMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

// // /* dotenv */
// // const dotenv = require('dotenv');
// // const fs = require('fs');

// // const currentPath = path.join(__dirname, '..');

// // // Create the fallback path (the development .env)
// // const basePath = currentPath + '/.env';
// // const envPath = basePath + '.' + process.env.NODE_ENV;

// // // Check if the file exists, otherwise fall back to the production .env
// // const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// // // Set the path parameter in the dotenv config
// // const fileEnv = dotenv.config({ path: finalPath }).parsed;

// // // call dotenv and it will return an Object with a parsed key
// // // reduce it to a nice object, the same as before (but with the variables from the file)
// // const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
// //     prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
// //     return prev;
// // }, {});

// // console.log("devMode", devMode)
// // console.log("envKeys", envKeys)
// // console.log("template", path.resolve(__dirname, "../public", "index.html"));

// // // const htmlWebpackPlugin = new HtmlWebPackPlugin({
// // //     template: path.resolve(__dirname, "../public", "index.html"),
// // //     filename: './index.html',
// // //     title: 'Dharmesh',
// // //     manifest: path.resolve(__dirname, "../public", "manifest.json"),
// // // })

// // const htmlWebpackPlugin = new HtmlWebPackPlugin({
// //     template: './public/index.html',
// //     filename: './index.html',
// //     title: 'SleepGuard'
// // });

// // module.exports = {
// //     entry: './src/index.tsx',
// //     output: {
// //         path: path.resolve(__dirname, '../dist'),
// //         //filename: '[name].[fullhash].js',
// //         filename: '[name].bundle.js',
// //         // chunkFilename: '[name].[chunkhash].js',
// //         // publicPath: './',
// //         clean: true,
// //     },

// //     module: {
// //         rules: [
// //             // {
// //             //     test: /\.html$/,
// //             //     exclude: /node_modules/,
// //             //     use: [
// //             //         {
// //             //             loader: 'html-loader',
// //             //             options: { minimize: true }
// //             //         }
// //             //     ]
// //             // },
// //             {
// //                 test: /\.(js|jsx)$/,
// //                 exclude: /node_modules/,
// //                 use: {
// //                     loader: 'babel-loader'
// //                 }
// //             },
// //             {
// //                 test: /\.tsx?$/,
// //                 exclude: /node_modules/,
// //                 use: [
// //                     {
// //                         loader: 'babel-loader',
// //                         options: {
// //                             presets: [
// //                                 "@babel/preset-env",
// //                                 "@babel/preset-react",
// //                                 "@babel/preset-typescript",
// //                             ],
// //                         },
// //                     },
// //                     {
// //                         loader: 'ts-loader',
// //                         options: {
// //                             compilerOptions: {
// //                                 noEmit: false,
// //                             },
// //                         },
// //                     }
// //                 ],
// //             },
// //             {
// //                 test: /\.css$/,
// //                 include: [path.resolve(__dirname, 'src')],
// //                 use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
// //             },
// //             {
// //                 test: /.s?css$/,
// //                 use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
// //             },
// //             {
// //                 test: /\.less$/,
// //                 use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
// //             },
// //             // {
// //             //     test: /\.less$/,
// //             //     use: [
// //             //         {
// //             //             loader: 'style-loader' // creates style nodes from JS strings
// //             //         },
// //             //         {
// //             //             loader: 'css-loader' // translates CSS into CommonJS
// //             //         },
// //             //         {
// //             //             loader: 'less-loader' // compiles Less to CSS
// //             //         }
// //             //     ]
// //             // },
// //             {
// //                 test: /\.svg$/,
// //                 loader: 'svg-inline-loader'
// //             },
// //             {
// //                 test: /\.(jpe?g|png|gif|svg)$/i,
// //                 loader: 'file-loader',
// //                 options: {
// //                     name: devMode ? '[path][name].[ext]' : '[contenthash].[ext]'
// //                 },
// //                 type: 'asset/resource',
// //             },
// //             {
// //                 test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
// //                 use: [
// //                     {
// //                         loader: 'file-loader',
// //                         options: {
// //                             name: '[name].[ext]',
// //                             outputPath: 'fonts/'
// //                         }
// //                     }
// //                 ],
// //                 type: 'asset/resource',
// //             }
// //         ]
// //     },
// //     resolve: {
// //         extensions: ['.tsx', '.ts', '.js'],
// //         alias: {
// //             '@app': path.resolve(__dirname, '../src'),
// //         }
// //     },
// //     plugins: [
// //         htmlWebpackPlugin,
// //         // new BundleAnalyzerPlugin({
// //         //   // Port that will be used by in `server` mode to start HTTP server.
// //         //   analyzerPort: 4000,
// //         // }),
// //         // new MiniCssExtractPlugin({
// //         //     filename: devMode ? '[name].css' : '[name].[fullhash].css',
// //         //     chunkFilename: devMode ? '[id].css' : '[id].[fullhash].css'
// //         // }),
// //         // new CopyPlugin({
// //         //     patterns: [
// //         //         // {
// //         //         //     from: 'public/firebase-messaging-sw.js',
// //         //         //     to: path.join(__dirname, '../dist')
// //         //         // },
// //         //         {
// //         //             from: 'public/manifest.json',
// //         //             to: path.join(__dirname, '../dist')
// //         //         },
// //         //         { from: 'public', to: 'public' }
// //         //     ],
// //         //     options: {
// //         //         concurrency: 100
// //         //     }
// //         // }),
// //         // new ForkTsCheckerWebpackPlugin(),
// //         new webpack.DefinePlugin(
// //             devMode
// //                 ? {
// //                     'process.env': {
// //                         NODE_ENV: JSON.stringify('development'),
// //                         API_BASE: JSON.stringify(process.env.API_BASE),
// //                         // UPLOAD_API_BASE: JSON.stringify(process.env.UPLOAD_API_BASE),
// //                         // PUSH_SERVER_API_BASE: JSON.stringify(process.env.PUSH_SERVER_API_BASE),
// //                         XHR_UPLOAD_SERVER_API_BASE: JSON.stringify(process.env.XHR_UPLOAD_SERVER_API_BASE)
// //                         // DRIVE_SERVER_API_BASE: JSON.stringify(process.env.DRIVE_SERVER_API_BASE)
// //                     }
// //                 }
// //                 : envKeys
// //         )
// //     ],
// //     // optimization: {
// //     //     minimizer: [
// //     //         // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// //     //         `...`,
// //     //         new CssMinimizerPlugin({
// //     //             parallel: true,
// //     //         }),
// //     //     ],
// //     //     // If you want to run it also in development set the optimization.minimize option to true
// //     //     minimize: true,
// //     // },
// // };

// //DX

// // const path = require('path');
// // const HtmlWebpackPlugin = require('html-webpack-plugin');
// // const CopyPlugin = require("copy-webpack-plugin");
// // // Doing TypeScript type checking
// // const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// // const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// // module.exports = {
// //     entry: {
// //         app: './src/index.tsx',
// //     },
// //     output: {
// //         path: path.resolve(__dirname, '../dist'),
// //         filename: '[name].[contenthash].js',
// //         // assetModuleFilename: `${assetsFolderName}/[hash][ext][query]`,
// //         clean: true,
// //         publicPath: "/"
// //     },
// //     module: {
// //         rules: [
// //             {
// //                 test: /\.jsx?$/,
// //                 exclude: /node_modules/,
// //                 loader: 'babel-loader'
// //             },
// //             {
// //                 test: /\.tsx?$/,
// //                 // use: 'ts-loader',
// //                 use: [
// //                     {
// //                         loader: 'babel-loader',
// //                         options: {
// //                             presets: [
// //                                 "@babel/preset-env",
// //                                 "@babel/preset-react",
// //                                 "@babel/preset-typescript",
// //                             ],
// //                         },
// //                     },
// //                     {
// //                         loader: 'ts-loader',
// //                         options: {
// //                             compilerOptions: {
// //                                 noEmit: false,
// //                             },
// //                         },
// //                     }
// //                 ],
// //                 exclude: /node_modules/,
// //             },
// //             {
// //                 test: /\.json$/,
// //                 loader: 'json-loader'
// //             },
// //             {
// //                 test: /\.css$/i,
// //                 use: ['style-loader', 'css-loader'],
// //             },
// //             {
// //                 test: /\.(png|svg|jpg|jpeg|gif)$/i,
// //                 type: 'asset/resource',
// //             },
// //             {
// //                 test: /\.(woff|woff2|eot|ttf|otf)$/i,
// //                 type: 'asset/resource',
// //             },
// //         ]
// //     },
// //     resolve: {
// //         extensions: ['.tsx', '.ts', '.js'],
// //         alias: {
// //             '@app': path.resolve(__dirname, '../src'),
// //         }
// //     },
// //     plugins: [
// //         new HtmlWebpackPlugin({
// //             template: path.resolve(__dirname, "../public", "index.html"),
// //             //  filename: "index.html",
// //             manifest: path.resolve(__dirname, "../public", "manifest.json"),
// //         }),
// //         new CopyPlugin({
// //             patterns: [
// //                 {
// //                     from: path.resolve(__dirname, "../public"),
// //                     to: 'assets',
// //                     globOptions: {
// //                         ignore: ['*.DS_Store'],
// //                     },
// //                 },
// //             ],
// //         }),
// //         new ForkTsCheckerWebpackPlugin()
// //     ],
// //     // watchOptions: {
// //     //     // for some systems, watching many files can result in a lot of CPU or memory usage
// //     //     // https://webpack.js.org/configuration/watch/#watchoptionsignored
// //     //     // don't use this pattern, if you have a monorepo with linked packages
// //     //     ignored: path.resolve(__dirname, "../node_modules"),
// //     // },
// //     optimization: {
// //         minimize: true,
// //         minimizer: [
// //             // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// //             `...`,
// //             new CssMinimizerPlugin(),
// //         ], runtimeChunk: {
// //             name: 'runtime',
// //         },
// //         splitChunks: {
// //             cacheGroups: {
// //                 commons: {
// //                     test: /[\\/]node_modules[\\/]/,
// //                     name: 'vendor',
// //                     chunks: 'initial',
// //                 },
// //             },
// //         },
// //     },
// // };

// // //    // "webpack": "webpack-dev-server --open --mode development --hot",
// // //"webpack": "webpack --mode productionwebpack --config config/webpack.prod.js",

// // // https://github.com/glook/webpack-typescript-react/blob/master/webpack/optimization.js
// // https://blog.kiprosh.com/application-performance-optimisation-using-webpack/
// // https://indepth.dev/posts/1490/webpack-an-in-depth-introduction-to-splitchunksplugin

// // const webpack = require('webpack');
// // const HtmlWebPackPlugin = require('html-webpack-plugin');
// // // const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// // const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// // const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// // const ESLintPlugin = require('eslint-webpack-plugin');
// // // const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// // // const TerserPlugin = require("terser-webpack-plugin");
// // // const CompressionPlugin = require("compression-webpack-plugin");
// // const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// // const CopyPlugin = require('copy-webpack-plugin');
// // const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
// // const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
// // const path = require('path');
// // const fs = require('fs');
// // const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
// // const paths = require('./paths');
// // const modules = require('./modules');
// // const getClientEnvironment = require('./env');

// // const devMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

// // // Source maps are resource heavy and can cause out of memory issue for large source files.
// // const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

// // const isEnvDevelopment =
// // 	process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';
// // const isEnvProduction = process.env.NODE_ENV === 'production';

// // const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000');

// // // Check if TypeScript is setup
// // const useTypeScript = fs.existsSync(paths.appTsConfig);

// // // /* dotenv */
// // // const dotenv = require('dotenv');
// // // const fs = require('fs');

// // // const currentPath = path.join(__dirname, '..');
// // // // Create the fallback path (the development .env)
// // // const basePath = currentPath + '/.env';
// // // const envPath = basePath + '.' + process.env.NODE_ENV;
// // // // Check if the file exists, otherwise fall back to the production .env
// // // const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// // // // Set the path parameter in the dotenv config
// // // const fileEnv = dotenv.config({ path: finalPath }).parsed;

// // // // call dotenv and it will return an Object with a parsed key
// // // // reduce it to a nice object, the same as before (but with the variables from the file)
// // // const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
// // // 	prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
// // // 	return prev;
// // // }, {});

// // // We use `PUBLIC_URL` environment variable or "homepage" field to infer
// // // "public path" at which the app is served.
// // // webpack needs to know it to put the right <script> hrefs into HTML even in
// // // single-page apps that may serve index.html for nested URLs like /todos/42.
// // // We can't use a relative path in HTML because we don't want to load something
// // // like /todos/42/static/js/bundle.7289d.js. We have to know the root.
// // const publicUrlOrPath = getPublicUrlOrPath(
// // 	process.env.NODE_ENV === 'development',
// // 	require(paths.resolveApp('package.json')).homepage,
// // 	process.env.PUBLIC_URL
// // );

// // const env = getClientEnvironment(publicUrlOrPath.slice(0, -1));

// // console.log('PATHSS', paths);

// // // console.log(env);
// // // const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

// // // const htmlWebpackPlugin = new HtmlWebPackPlugin({
// // // 	template: './public/index.html',
// // // 	filename: './index.html',
// // // 	title: 'White Label'
// // // });

// // // const htmlWebpackPlugin = new HtmlWebPackPlugin(
// // // 	Object.assign(
// // // 		{},
// // // 		{
// // // 			inject: true,
// // // 			template: './public/index.html'
// // // 		},
// // // 		isEnvProduction
// // // 			? {
// // // 					minify: {
// // // 						removeComments: true,
// // // 						collapseWhitespace: true,
// // // 						removeRedundantAttributes: true,
// // // 						useShortDoctype: true,
// // // 						removeEmptyAttributes: true,
// // // 						removeStyleLinkTypeAttributes: true,
// // // 						keepClosingSlash: true,
// // // 						minifyJS: true,
// // // 						minifyCSS: true,
// // // 						minifyURLs: true
// // // 					}
// // // 			  }
// // // 			: undefined
// // // 	)
// // // );

// // module.exports = {
// // 	// entry: './src/index.tsx',
// // 	// These are the "entry points" to our application.
// // 	// This means they will be the "root" imports that are included in JS bundle.
// // 	entry: paths.appIndexJs,
// // 	output: {
// // 		// path: path.join(__dirname, '../dist'),
// // 		// The build folder.
// // 		path: paths.appBuild,
// // 		// Add /* filename */ comments to generated require()s in the output.
// // 		pathinfo: isEnvDevelopment,
// // 		// filename:'[name].[hash].js'
// // 		filename: '[name].[fullhash].js',
// // 		chunkFilename: '[name].[chunkhash].js',
// // 		clean: true,
// // 		publicPath: publicUrlOrPath
// // 		// publicPath: './'
// // 		// publicPath: './',
// // 	},
// // 	module: {
// // 		strictExportPresence: true,
// // 		rules: [
// // 			{
// // 				test: /\.html$/,
// // 				exclude: /node_modules/,
// // 				use: [
// // 					{
// // 						loader: 'html-loader',
// // 						options: { minimize: true }
// // 					}
// // 				]
// // 			},
// // 			{
// // 				test: /\.(js|jsx)$/,
// // 				exclude: /node_modules/,
// // 				use: {
// // 					loader: 'babel-loader'
// // 				}
// // 			},
// // 			{
// // 				test: /\.tsx?$/,
// // 				exclude: /node_modules/,
// // 				use: [
// // 					{
// // 						loader: 'babel-loader',
// // 						options: {
// // 							presets: [
// // 								'@babel/preset-env',
// // 								'@babel/preset-react',
// // 								'@babel/preset-typescript'
// // 							]
// // 						}
// // 					},
// // 					{
// // 						loader: 'ts-loader',
// // 						options: {
// // 							compilerOptions: {
// // 								noEmit: false
// // 							}
// // 						}
// // 					}
// // 				]
// // 			},
// // 			{
// // 				test: /\.css$/,
// // 				include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'web')],
// // 				use: [
// // 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// // 					{ loader: 'css-loader', options: { sourceMap: true } }
// // 				]
// // 			},
// // 			{
// // 				test: /\.s?[ac]ss$/,
// // 				use: [
// // 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// // 					{ loader: 'css-loader', options: { sourceMap: true } },
// // 					{ loader: 'sass-loader', options: { sourceMap: true } }
// // 				]
// // 			},
// // 			{
// // 				test: /\.less$/,
// // 				use: [
// // 					{
// // 						loader: 'style-loader' // creates style nodes from JS strings
// // 					},
// // 					{
// // 						loader: 'css-loader' // creates style nodes from JS strings
// // 					},
// // 					{
// // 						loader: 'sass-loader',
// // 						options: { sourceMap: true }
// // 						//loader: 'css-loader' // translates CSS into CommonJS
// // 					},
// // 					{
// // 						loader: 'less-loader', // compiles Less to CSS
// // 						options: { sourceMap: true }
// // 						// options: {
// // 						//   modifyVars: {
// // 						//     "primary-color": "#FF0000",
// // 						//     "link-color": "#1DA57A",
// // 						//     "border-radius-base": "2px",
// // 						//     // or
// // 						//     hack: `true; @import "your-less-file-path.less";`, // Override with less file
// // 						//   },
// // 						//   javascriptEnabled: true,
// // 						// },
// // 					}
// // 				]
// // 			},
// // 			{
// // 				test: /\.svg$/,
// // 				use: {
// // 					loader: 'svg-url-loader'
// // 				}
// // 			},
// // 			// {
// // 			// 	test: /\.svg$/,
// // 			// 	use: [
// // 			// 		{
// // 			// 			loader: require.resolve('@svgr/webpack'),
// // 			// 			options: {
// // 			// 				prettier: false,
// // 			// 				svgo: false,
// // 			// 				svgoConfig: {
// // 			// 					plugins: [{ removeViewBox: false }]
// // 			// 				},
// // 			// 				titleProp: true,
// // 			// 				ref: true
// // 			// 			}
// // 			// 		},
// // 			// 		{
// // 			// 			loader: require.resolve('file-loader'),
// // 			// 			options: {
// // 			// 				name: 'static/media/[name].[hash].[ext]'
// // 			// 			}
// // 			// 		}
// // 			// 	],
// // 			// 	issuer: {
// // 			// 		and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
// // 			// 	}
// // 			// },
// // 			// {
// // 			// 	test: /\.svg$/,
// // 			// 	loader: 'svg-inline-loader'
// // 			// },
// // 			// {
// // 			// 	test: /\.svg?$/,
// // 			// 	oneOf: [
// // 			// 		{
// // 			// 			use: [
// // 			// 				{
// // 			// 					loader: '@svgr/webpack',
// // 			// 					options: {
// // 			// 						prettier: false,
// // 			// 						svgo: true,
// // 			// 						svgoConfig: {
// // 			// 							plugins: [{ removeViewBox: false }]
// // 			// 						},
// // 			// 						titleProp: true
// // 			// 					}
// // 			// 				}
// // 			// 			],
// // 			// 			issuer: {
// // 			// 				and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
// // 			// 			}
// // 			// 		}
// // 			// 	]
// // 			// },
// // 			// {
// // 			// 	//use SVGR for imports in js/jsx files
// // 			// 	test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
// // 			// 	oneOf: [
// // 			// 		{
// // 			// 			use: [
// // 			// 				'babel-loader',
// // 			// 				{
// // 			// 					loader: '@svgr/webpack',
// // 			// 					options: {
// // 			// 						babel: false,
// // 			// 						icon: true
// // 			// 					}
// // 			// 				}
// // 			// 			],
// // 			// 			issuer: {
// // 			// 				and: [/\.(js|jsx)$/]
// // 			// 			}
// // 			// 		}
// // 			// 	]
// // 			// },
// // 			{
// // 				// test: /\.(jpe?g|png|gif)$/i,
// // 				// "url" loader works like "file" loader except that it embeds assets
// // 				// smaller than specified limit in bytes as data URLs to avoid requests.
// // 				// A missing `test` is equivalent to a match.
// // 				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
// // 				type: 'asset/resource',
// // 				parser: {
// // 					dataUrlCondition: {
// // 						maxSize: imageInlineSizeLimit
// // 					}
// // 				}
// // 				// //loader: "file-loader?name=/assets/images/[contenthash].[ext]",
// // 				// loader: 'file-loader',
// // 				// options: {
// // 				// 	name: devMode ? '[path][name].[ext]' : '[contenthash].[ext]'
// // 				// }
// // 				// options: {
// // 				//   name(file) {
// // 				//     if (devMode) {
// // 				//       return '[path][name].[ext]';
// // 				//     }
// // 				//     return '[contenthash].[ext]';
// // 				//   },
// // 				// },
// // 				// options: {
// // 				//   name: '/assets/images/[name].[ext]',
// // 				// },
// // 			},
// // 			{
// // 				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/, //|svg
// // 				use: [
// // 					{
// // 						loader: 'file-loader',
// // 						options: {
// // 							name: '[name].[ext]',
// // 							outputPath: 'fonts/'
// // 						}
// // 					}
// // 				]
// // 			}
// // 			// {
// // 			// 	test: /\.svg$/,
// // 			// 	use: [
// // 			// 		{
// // 			// 			loader: require.resolve('@svgr/webpack'),
// // 			// 			options: {
// // 			// 				prettier: false,
// // 			// 				svgo: false,
// // 			// 				svgoConfig: {
// // 			// 					plugins: [{ removeViewBox: false }]
// // 			// 				},
// // 			// 				titleProp: true,
// // 			// 				ref: true
// // 			// 			}
// // 			// 		},
// // 			// 		{
// // 			// 			loader: require.resolve('file-loader'),
// // 			// 			options: {
// // 			// 				name: 'static/media/[name].[hash].[ext]'
// // 			// 			}
// // 			// 		}
// // 			// 	],
// // 			// 	issuer: {
// // 			// 		and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
// // 			// 	}
// // 			// },
// // 			// {
// // 			// 	test: /\.svg$/,
// // 			// 	use: {
// // 			// 		loader: 'svg-url-loader'
// // 			// 	}
// // 			// }
// // 			// {
// // 			// 	//use SVGR for imports in js/jsx files
// // 			// 	test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
// // 			// 	oneOf: [
// // 			// 		{
// // 			// 			use: [
// // 			// 				'babel-loader',
// // 			// 				{
// // 			// 					loader: '@svgr/webpack',
// // 			// 					options: {
// // 			// 						babel: false,
// // 			// 						icon: true
// // 			// 					}
// // 			// 				}
// // 			// 			],
// // 			// 			issuer: {
// // 			// 				and: [/\.(ts|tsx|js|jsx)$/]
// // 			// 			}
// // 			// 		}
// // 			// 	]
// // 			// }
// // 			// {
// // 			// 	test: /\.svg?$/,
// // 			// 	oneOf: [
// // 			// 		{
// // 			// 			use: [
// // 			// 				{
// // 			// 					loader: '@svgr/webpack',
// // 			// 					options: {
// // 			// 						prettier: false,
// // 			// 						svgo: true,
// // 			// 						svgoConfig: {
// // 			// 							plugins: [{ removeViewBox: false }]
// // 			// 						},
// // 			// 						titleProp: true
// // 			// 					}
// // 			// 				}
// // 			// 			],
// // 			// 			issuer: {
// // 			// 				and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
// // 			// 			}
// // 			// 		}
// // 			// 	]
// // 			// }
// // 			// {
// // 			// 	test: /\.svg$/,
// // 			// 	issuer: /\.(js|ts)x?$/,
// // 			// 	use: ['@svgr/webpack']
// // 			// }
// // 			// {
// // 			// 	test: /\.svg$/,
// // 			// 	use: ['@svgr/webpack']
// // 			// }
// // 			// {
// // 			// 	test: /\.svg$/,
// // 			// 	use: [
// // 			// 		{
// // 			// 			loader: require.resolve('@svgr/webpack'),
// // 			// 			options: {
// // 			// 				prettier: false,
// // 			// 				svgo: false,
// // 			// 				svgoConfig: {
// // 			// 					plugins: [{ removeViewBox: false }]
// // 			// 				},
// // 			// 				titleProp: true,
// // 			// 				ref: true
// // 			// 			}
// // 			// 		},
// // 			// 		{
// // 			// 			loader: require.resolve('file-loader'),
// // 			// 			options: {
// // 			// 				name: 'static/media/[name].[hash].[ext]'
// // 			// 			}
// // 			// 		}
// // 			// 	],
// // 			// 	issuer: {
// // 			// 		and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
// // 			// 	}
// // 			// }
// // 			// {
// // 			// 	test: /\.svg$/,
// // 			// 	use: ['@svgr/webpack', 'url-loader']
// // 			// },
// // 			// {
// // 			// 	test: /\.svg$/i,
// // 			// 	type: 'asset',
// // 			// 	resourceQuery: /url/ // *.svg?url
// // 			// }
// // 			// {
// // 			// 	test: /\.svg$/i,
// // 			// 	issuer: /\.[jt]sx?$/,
// // 			// 	resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
// // 			// 	use: ['@svgr/webpack']
// // 			// }
// // 		]
// // 	},
// // 	resolve: {
// // 		// This allows you to set a fallback for where webpack should look for modules.
// // 		// We placed these paths second because we want `node_modules` to "win"
// // 		// if there are any conflicts. This matches Node resolution mechanism.
// // 		// https://github.com/facebook/create-react-app/issues/253
// // 		modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
// // 		// These are the reasonable defaults supported by the Node ecosystem.
// // 		// We also include JSX as a common component filename extension to support
// // 		// some tools, although we do not recommend using it, see:
// // 		// https://github.com/facebook/create-react-app/issues/290
// // 		// `web` extension prefixes have been added for better support
// // 		// for React Native Web.
// // 		extensions: paths.moduleFileExtensions
// // 			.map(ext => `.${ext}`)
// // 			.filter(ext => useTypeScript || !ext.includes('ts')),
// // 		// extensions: ['.tsx', '.ts', '.js', '.jsx'],
// // 		alias: {
// // 			'@app': path.resolve(__dirname, '../src'),
// // 			'@apptypes': path.resolve(__dirname, '../src/types'),
// // 			'@assets': path.resolve(__dirname, '../src/assets'),
// // 			'@components': path.resolve(__dirname, '../src/components'),
// // 			'@contexts': path.resolve(__dirname, '../src/contexts'),
// // 			'@global': path.resolve(__dirname, '../src/global'),
// // 			'@hooks': path.resolve(__dirname, '../src/hooks'),
// // 			'@interface': path.resolve(__dirname, '../src/interface'),
// // 			'@locales': path.resolve(__dirname, '../src/locales'),
// // 			'@pages': path.resolve(__dirname, '../src/pages'),
// // 			'@routes': path.resolve(__dirname, '../src/routes'),
// // 			'@store': path.resolve(__dirname, '../src/store'),
// // 			'@sections': path.resolve(__dirname, '../src/sections'),
// // 			'@services': path.resolve(__dirname, '../src/services'),
// // 			'@styles': path.resolve(__dirname, '../src/styles'),
// // 			'@themes': path.resolve(__dirname, '../src/themes'),
// // 			'@utils': path.resolve(__dirname, '../src/utils'),
// // 			...(modules.webpackAliases || {})
// // 		},
// // 		// alias: {
// // 		//   src: path.resolve(__dirname, "src/"),
// // 		//   web: path.resolve(__dirname, "web/"),
// // 		//   view: path.resolve(__dirname, "view/"),
// // 		// },
// // 		plugins: [
// // 			// Prevents users from importing files from outside of src/ (or node_modules/).
// // 			// This often causes confusion because we only process files within src/ with babel.
// // 			// To fix this, we prevent you from importing files out of src/ -- if you'd like to,
// // 			// please link the files into your node_modules/ and let module-resolution kick in.
// // 			// Make sure your source files are compiled, as they will not be processed in any way.
// // 			new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
// // 		]
// // 	},
// // 	plugins: [
// // 		//dx new CleanWebpackPlugin(),
// // 		// htmlWebpackPlugin,
// // 		new HtmlWebPackPlugin(
// // 			Object.assign(
// // 				{},
// // 				{
// // 					inject: true,
// // 					template: paths.appHtml
// // 				},
// // 				isEnvProduction
// // 					? {
// // 							minify: {
// // 								removeComments: true,
// // 								collapseWhitespace: true,
// // 								removeRedundantAttributes: true,
// // 								useShortDoctype: true,
// // 								removeEmptyAttributes: true,
// // 								removeStyleLinkTypeAttributes: true,
// // 								keepClosingSlash: true,
// // 								minifyJS: true,
// // 								minifyCSS: true,
// // 								minifyURLs: true
// // 							}
// // 					  }
// // 					: undefined
// // 			)
// // 		),
// // 		// new BundleAnalyzerPlugin({
// // 		// 	// Port that will be used by in `server` mode to start HTTP server.
// // 		// 	analyzerPort: 4000
// // 		// }),
// // 		// Makes some environment variables available in index.html.
// // 		// The public URL is available as %PUBLIC_URL% in index.html, e.g.:
// // 		// <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
// // 		// It will be an empty string unless you specify "homepage"
// // 		// in `package.json`, in which case it will be the pathname of that URL.
// // 		new InterpolateHtmlPlugin(HtmlWebPackPlugin, env.raw),
// // 		// new MiniCssExtractPlugin({
// // 		// 	filename: devMode ? '[name].css' : '[name].[fullhash].css',
// // 		// 	chunkFilename: devMode ? '[id].css' : '[id].[fullhash].css'
// // 		// }),
// // 		// new CompressionPlugin(),
// // 		new CopyPlugin({
// // 			patterns: [
// // 				// {
// // 				// 	from: 'public/firebase-messaging-sw.js',
// // 				// 	to: path.join(__dirname, '../dist')
// // 				// },
// // 				{
// // 					from: 'public/manifest.json',
// // 					to: paths.appBuild //path.join(__dirname, '../dist')
// // 				},
// // 				{ from: 'public', to: 'public' }
// // 			],
// // 			options: {
// // 				concurrency: 100
// // 			}
// // 		}),
// // 		// new ForkTsCheckerWebpackPlugin(),
// // 		// new webpack.DefinePlugin({
// // 		//   "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
// // 		//   "process.env.API_BASE": JSON.stringify(process.env.API_BASE),
// // 		// }),
// // 		// new webpack.EnvironmentPlugin([
// // 		//   "NODE_ENV",
// // 		//   "API_BASE",
// // 		//   "UPLOAD_API_BASE",
// // 		//   "PUSH_SERVER_API_BASE",
// // 		//   "XHR_UPLOAD_SERVER_API_BASE",
// // 		//   "DRIVE_SERVER_API_BASE",
// // 		// ]),
// // 		new webpack.DefinePlugin(env.stringified)

// // 		// new webpack.DefinePlugin({
// // 		// 	'process.env': JSON.stringify(process.env)
// // 		// })
// // 		// new webpack.DefinePlugin(
// // 		// 	devMode
// // 		// 		? {
// // 		// 				'process.env': {
// // 		// 					NODE_ENV: JSON.stringify('development'),
// // 		// 					API_BASE: JSON.stringify(process.env.API_BASE),
// // 		// 					// UPLOAD_API_BASE: JSON.stringify(process.env.UPLOAD_API_BASE),
// // 		// 					// PUSH_SERVER_API_BASE: JSON.stringify(process.env.PUSH_SERVER_API_BASE),
// // 		// 					XHR_UPLOAD_SERVER_API_BASE: JSON.stringify(
// // 		// 						process.env.XHR_UPLOAD_SERVER_API_BASE
// // 		// 					)
// // 		// 					// DRIVE_SERVER_API_BASE: JSON.stringify(process.env.DRIVE_SERVER_API_BASE)
// // 		// 				}
// // 		// 		  }
// // 		// 		: envKeys
// // 		// )
// // 		// new ESLintPlugin({
// // 		// 	extensions: ['.tsx', '.ts', '.js'],
// // 		// 	exclude: 'node_modules',
// // 		// 	context: './src'
// // 		// })
// // 		// new webpack.DefinePlugin({
// // 		//   "process.env": {
// // 		//     NODE_ENV: JSON.stringify(envKeys.NODE_ENV),
// // 		//     API_BASE: JSON.stringify(envKeys.API_BASE),
// // 		//   },
// // 		// }),

// // 		// new webpack.DefinePlugin({
// // 		//   "process.env": {
// // 		//     NODE_ENV: JSON.stringify(process.env.NODE_ENV),
// // 		//   },
// // 		// }),
// // 	]
// // 	// Comment because not need in development
// // 	// optimization: {
// // 	// 	minimize: true,
// // 	// 	minimizer: [
// // 	// 		// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// // 	// 		`...`,
// // 	// 		new CssMinimizerPlugin({
// // 	// 			minimizerOptions: {
// // 	// 				parallel: 4,
// // 	// 				minify: CssMinimizerPlugin.cleanCssMinify,
// // 	// 				preset: [
// // 	// 					'default',
// // 	// 					{
// // 	// 						discardComments: { removeAll: true }
// // 	// 					}
// // 	// 				]
// // 	// 			}
// // 	// 		})
// // 	// 	]
// // 	// }
// // 	// optimization: {
// // 	//   // minimizer: [new UglifyJsPlugin({ sourceMap: true })],
// // 	//   // minimize: true,
// // 	//   minimizer: [new TerserPlugin({ sourceMap: true })],
// // 	// },
// // 	// devServer: {
// // 	// 	historyApiFallback: true
// // 	// }
// // };

// // // /* eslint-disable @typescript-eslint/no-var-requires */
// // // const path = require('path');
// // // const webpack = require('webpack');
// // // const HtmlWebpackPlugin = require('html-webpack-plugin');
// // // const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// // // const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// // // const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// // // const CopyPlugin = require('copy-webpack-plugin');
// // // const ESLintPlugin = require('eslint-webpack-plugin');
// // // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// // // const devMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

// // // /* dotenv */
// // // const dotenv = require('dotenv');
// // // const fs = require('fs');

// // // const currentPath = path.join(__dirname, '..');

// // // // Create the fallback path (the development .env)
// // // const basePath = currentPath + '/.env';
// // // const envPath = basePath + '.' + process.env.NODE_ENV;

// // // // Check if the file exists, otherwise fall back to the production .env
// // // const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// // // // Set the path parameter in the dotenv config
// // // const fileEnv = dotenv.config({ path: finalPath }).parsed;

// // // // call dotenv and it will return an Object with a parsed key
// // // // reduce it to a nice object, the same as before (but with the variables from the file)
// // // const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
// // // 	prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
// // // 	return prev;
// // // }, {});

// // // module.exports = {
// // // 	entry: './src/index.tsx',
// // // 	// mode: 'development',
// // // 	// devtool: 'source-map',
// // // 	output: {
// // // 		path: path.join(__dirname, '..', 'dist'), // path.resolve(__dirname, '../dist'),
// // // 		// static: [path.join(__dirname, '..', 'dist')],
// // // 		filename: '[name].[contenthash].js',
// // // 		clean: true
// // // 	},

// // // 	module: {
// // // 		rules: [
// // // 			{
// // // 				test: /\.(js|jsx)$/,
// // // 				exclude: /node_modules/,
// // // 				use: {
// // // 					loader: 'babel-loader'
// // // 				}
// // // 			},
// // // 			{
// // // 				test: /\.tsx?$/,
// // // 				exclude: /node_modules/,
// // // 				use: [
// // // 					{
// // // 						loader: 'babel-loader',
// // // 						options: {
// // // 							presets: [
// // // 								'@babel/preset-env',
// // // 								'@babel/preset-react',
// // // 								'@babel/preset-typescript'
// // // 							]
// // // 						}
// // // 					},
// // // 					{
// // // 						loader: 'ts-loader',
// // // 						options: {
// // // 							compilerOptions: {
// // // 								noEmit: false
// // // 							}
// // // 						}
// // // 					}
// // // 				]
// // // 			},
// // // 			// {
// // // 			//     test: /\.tsx?$/,
// // // 			//     exclude: /node_modules/,
// // // 			//     use: {
// // // 			//         loader: 'ts-loader',
// // // 			//         options: {
// // // 			//             // disable type checker - we will use it in fork plugin
// // // 			//             transpileOnly: true
// // // 			//         }
// // // 			//     }
// // // 			// },
// // // 			// {
// // // 			//     test: /\.s(a|c)ss$/,
// // // 			//     use: ['style-loader', 'sass-loader', 'css-loader']
// // // 			// },
// // // 			{
// // // 				test: /\.svg$/,
// // // 				loader: 'svg-inline-loader'
// // // 			},
// // // 			{
// // // 				test: /\.s(a|c)ss$/,
// // // 				use: [
// // // 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// // // 					'css-loader',
// // // 					{
// // // 						loader: 'sass-loader',
// // // 						options: {
// // // 							sourceMap: true
// // // 						}
// // // 					}
// // // 				]
// // // 			},
// // // 			{
// // // 				test: /\.css$/,
// // // 				include: [path.resolve(__dirname, 'src')],
// // // 				use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
// // // 			},
// // // 			{
// // // 				test: /.s?css$/,
// // // 				use: [
// // // 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// // // 					'css-loader',
// // // 					'sass-loader'
// // // 				]
// // // 			},
// // // 			{
// // // 				test: /\.less$/,
// // // 				use: [
// // // 					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
// // // 					'css-loader',
// // // 					'sass-loader'
// // // 				]
// // // 			},
// // // 			{
// // // 				test: /\.(jpe?g|png|gif|svg)$/i,
// // // 				loader: 'file-loader',
// // // 				options: {
// // // 					name: devMode ? '[path][name].[ext]' : '[contenthash].[ext]'
// // // 				},
// // // 				type: 'asset/resource'
// // // 			},
// // // 			{
// // // 				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
// // // 				use: [
// // // 					{
// // // 						loader: 'file-loader',
// // // 						options: {
// // // 							name: '[name].[ext]',
// // // 							outputPath: 'fonts/'
// // // 						}
// // // 					}
// // // 				],
// // // 				type: 'asset/resource'
// // // 			}
// // // 		]
// // // 	},
// // // 	resolve: {
// // // 		extensions: ['.tsx', '.ts', '.js'],
// // // 		alias: {
// // // 			'@app': path.resolve(__dirname, '../src')
// // // 		}
// // // 	},
// // // 	plugins: [
// // // 		new webpack.BannerPlugin({
// // // 			banner: 'hello world',
// // // 			entryOnly: true
// // // 		}),
// // // 		new HtmlWebpackPlugin({
// // // 			template: './public/index.html',
// // // 			filename: 'index.html',
// // // 			title: 'Dharmesh Patel'
// // // 		}),

// // // 		new MiniCssExtractPlugin({
// // // 			// Options similar to the same options in webpackOptions.output
// // // 			// both options are optional
// // // 			filename: devMode ? '[name].css' : '[name].[contenthash].css', //'[name].[contenthash].css',
// // // 			chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css' // '[id].css'
// // // 		}),
// // // 		new ForkTsCheckerWebpackPlugin(),
// // // 		new CopyPlugin({
// // // 			patterns: [
// // // 				{ from: './src/assets', to: 'assets' },
// // // 				{ from: './public/manifest.json', to: path.join(__dirname, '../dist') },
// // // 				{ from: 'public', to: 'public' }
// // // 			],
// // // 			options: {
// // // 				concurrency: 100
// // // 			}
// // // 		}),
// // // 		new webpack.DefinePlugin(
// // // 			devMode
// // // 				? {
// // // 						'process.env': {
// // // 							NODE_ENV: JSON.stringify('development'),
// // // 							API_BASE: JSON.stringify(process.env.API_BASE),
// // // 							// UPLOAD_API_BASE: JSON.stringify(process.env.UPLOAD_API_BASE),
// // // 							// PUSH_SERVER_API_BASE: JSON.stringify(process.env.PUSH_SERVER_API_BASE),
// // // 							XHR_UPLOAD_SERVER_API_BASE: JSON.stringify(
// // // 								process.env.XHR_UPLOAD_SERVER_API_BASE
// // // 							)
// // // 							// DRIVE_SERVER_API_BASE: JSON.stringify(process.env.DRIVE_SERVER_API_BASE)
// // // 						}
// // // 				  }
// // // 				: envKeys
// // // 		),
// // // 		new BundleAnalyzerPlugin({
// // // 			analyzerMode: 'static',
// // // 			openAnalyzer: false
// // // 		})
// // // 		//new webpack.HotModuleReplacementPlugin()
// // // 		// new ESLintPlugin({
// // // 		//     extensions: ['.tsx', '.ts', '.js'],
// // // 		//     exclude: 'node_modules',
// // // 		//     context: './src'
// // // 		// })
// // // 	]
// // // 	// optimization: {
// // // 	// 	minimizer: [
// // // 	// 		// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// // // 	// 		`...`,
// // // 	// 		new CssMinimizerPlugin({
// // // 	// 			parallel: true
// // // 	// 		})
// // // 	// 	],
// // // 	// 	// If you want to run it also in development set the optimization.minimize option to true
// // // 	// 	minimize: true
// // // 	// 	// moduleIds: 'deterministic', //Added this to retain hash of vendor chunks.
// // // 	// 	// runtimeChunk: 'single',
// // // 	// 	// splitChunks: {
// // // 	// 	// 	cacheGroups: {
// // // 	// 	// 		vendor: {
// // // 	// 	// 			test: /[\\/]node_modules[\\/]/,
// // // 	// 	// 			name: 'vendors',
// // // 	// 	// 			chunks: 'all'
// // // 	// 	// 		}
// // // 	// 	// 	}
// // // 	// 	// }
// // // 	// }
// // // };

// // // const path = require('path');
// // // const webpack = require('webpack');
// // // const HtmlWebPackPlugin = require('html-webpack-plugin');
// // // const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// // // const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// // // const CopyPlugin = require('copy-webpack-plugin');

// // // // Doing TypeScript type checking
// // // const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// // // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// // // const devMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

// // // /* dotenv */
// // // const dotenv = require('dotenv');
// // // const fs = require('fs');

// // // const currentPath = path.join(__dirname, '..');

// // // // Create the fallback path (the development .env)
// // // const basePath = currentPath + '/.env';
// // // const envPath = basePath + '.' + process.env.NODE_ENV;

// // // // Check if the file exists, otherwise fall back to the production .env
// // // const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// // // // Set the path parameter in the dotenv config
// // // const fileEnv = dotenv.config({ path: finalPath }).parsed;

// // // // call dotenv and it will return an Object with a parsed key
// // // // reduce it to a nice object, the same as before (but with the variables from the file)
// // // const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
// // //     prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
// // //     return prev;
// // // }, {});

// // // console.log("devMode", devMode)
// // // console.log("envKeys", envKeys)
// // // console.log("template", path.resolve(__dirname, "../public", "index.html"));

// // // // const htmlWebpackPlugin = new HtmlWebPackPlugin({
// // // //     template: path.resolve(__dirname, "../public", "index.html"),
// // // //     filename: './index.html',
// // // //     title: 'Dharmesh',
// // // //     manifest: path.resolve(__dirname, "../public", "manifest.json"),
// // // // })

// // // const htmlWebpackPlugin = new HtmlWebPackPlugin({
// // //     template: './public/index.html',
// // //     filename: './index.html',
// // //     title: 'SleepGuard'
// // // });

// // // module.exports = {
// // //     entry: './src/index.tsx',
// // //     output: {
// // //         path: path.resolve(__dirname, '../dist'),
// // //         //filename: '[name].[fullhash].js',
// // //         filename: '[name].bundle.js',
// // //         // chunkFilename: '[name].[chunkhash].js',
// // //         // publicPath: './',
// // //         clean: true,
// // //     },

// // //     module: {
// // //         rules: [
// // //             // {
// // //             //     test: /\.html$/,
// // //             //     exclude: /node_modules/,
// // //             //     use: [
// // //             //         {
// // //             //             loader: 'html-loader',
// // //             //             options: { minimize: true }
// // //             //         }
// // //             //     ]
// // //             // },
// // //             {
// // //                 test: /\.(js|jsx)$/,
// // //                 exclude: /node_modules/,
// // //                 use: {
// // //                     loader: 'babel-loader'
// // //                 }
// // //             },
// // //             {
// // //                 test: /\.tsx?$/,
// // //                 exclude: /node_modules/,
// // //                 use: [
// // //                     {
// // //                         loader: 'babel-loader',
// // //                         options: {
// // //                             presets: [
// // //                                 "@babel/preset-env",
// // //                                 "@babel/preset-react",
// // //                                 "@babel/preset-typescript",
// // //                             ],
// // //                         },
// // //                     },
// // //                     {
// // //                         loader: 'ts-loader',
// // //                         options: {
// // //                             compilerOptions: {
// // //                                 noEmit: false,
// // //                             },
// // //                         },
// // //                     }
// // //                 ],
// // //             },
// // //             {
// // //                 test: /\.css$/,
// // //                 include: [path.resolve(__dirname, 'src')],
// // //                 use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
// // //             },
// // //             {
// // //                 test: /.s?css$/,
// // //                 use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
// // //             },
// // //             {
// // //                 test: /\.less$/,
// // //                 use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
// // //             },
// // //             // {
// // //             //     test: /\.less$/,
// // //             //     use: [
// // //             //         {
// // //             //             loader: 'style-loader' // creates style nodes from JS strings
// // //             //         },
// // //             //         {
// // //             //             loader: 'css-loader' // translates CSS into CommonJS
// // //             //         },
// // //             //         {
// // //             //             loader: 'less-loader' // compiles Less to CSS
// // //             //         }
// // //             //     ]
// // //             // },
// // //             {
// // //                 test: /\.svg$/,
// // //                 loader: 'svg-inline-loader'
// // //             },
// // //             {
// // //                 test: /\.(jpe?g|png|gif|svg)$/i,
// // //                 loader: 'file-loader',
// // //                 options: {
// // //                     name: devMode ? '[path][name].[ext]' : '[contenthash].[ext]'
// // //                 },
// // //                 type: 'asset/resource',
// // //             },
// // //             {
// // //                 test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
// // //                 use: [
// // //                     {
// // //                         loader: 'file-loader',
// // //                         options: {
// // //                             name: '[name].[ext]',
// // //                             outputPath: 'fonts/'
// // //                         }
// // //                     }
// // //                 ],
// // //                 type: 'asset/resource',
// // //             }
// // //         ]
// // //     },
// // //     resolve: {
// // //         extensions: ['.tsx', '.ts', '.js'],
// // //         alias: {
// // //             '@app': path.resolve(__dirname, '../src'),
// // //         }
// // //     },
// // //     plugins: [
// // //         htmlWebpackPlugin,
// // //         // new BundleAnalyzerPlugin({
// // //         //   // Port that will be used by in `server` mode to start HTTP server.
// // //         //   analyzerPort: 4000,
// // //         // }),
// // //         // new MiniCssExtractPlugin({
// // //         //     filename: devMode ? '[name].css' : '[name].[fullhash].css',
// // //         //     chunkFilename: devMode ? '[id].css' : '[id].[fullhash].css'
// // //         // }),
// // //         // new CopyPlugin({
// // //         //     patterns: [
// // //         //         // {
// // //         //         //     from: 'public/firebase-messaging-sw.js',
// // //         //         //     to: path.join(__dirname, '../dist')
// // //         //         // },
// // //         //         {
// // //         //             from: 'public/manifest.json',
// // //         //             to: path.join(__dirname, '../dist')
// // //         //         },
// // //         //         { from: 'public', to: 'public' }
// // //         //     ],
// // //         //     options: {
// // //         //         concurrency: 100
// // //         //     }
// // //         // }),
// // //         // new ForkTsCheckerWebpackPlugin(),
// // //         new webpack.DefinePlugin(
// // //             devMode
// // //                 ? {
// // //                     'process.env': {
// // //                         NODE_ENV: JSON.stringify('development'),
// // //                         API_BASE: JSON.stringify(process.env.API_BASE),
// // //                         // UPLOAD_API_BASE: JSON.stringify(process.env.UPLOAD_API_BASE),
// // //                         // PUSH_SERVER_API_BASE: JSON.stringify(process.env.PUSH_SERVER_API_BASE),
// // //                         XHR_UPLOAD_SERVER_API_BASE: JSON.stringify(process.env.XHR_UPLOAD_SERVER_API_BASE)
// // //                         // DRIVE_SERVER_API_BASE: JSON.stringify(process.env.DRIVE_SERVER_API_BASE)
// // //                     }
// // //                 }
// // //                 : envKeys
// // //         )
// // //     ],
// // //     // optimization: {
// // //     //     minimizer: [
// // //     //         // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// // //     //         `...`,
// // //     //         new CssMinimizerPlugin({
// // //     //             parallel: true,
// // //     //         }),
// // //     //     ],
// // //     //     // If you want to run it also in development set the optimization.minimize option to true
// // //     //     minimize: true,
// // //     // },
// // // };

// // //DX

// // // const path = require('path');
// // // const HtmlWebpackPlugin = require('html-webpack-plugin');
// // // const CopyPlugin = require("copy-webpack-plugin");
// // // // Doing TypeScript type checking
// // // const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// // // const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// // // module.exports = {
// // //     entry: {
// // //         app: './src/index.tsx',
// // //     },
// // //     output: {
// // //         path: path.resolve(__dirname, '../dist'),
// // //         filename: '[name].[contenthash].js',
// // //         // assetModuleFilename: `${assetsFolderName}/[hash][ext][query]`,
// // //         clean: true,
// // //         publicPath: "/"
// // //     },
// // //     module: {
// // //         rules: [
// // //             {
// // //                 test: /\.jsx?$/,
// // //                 exclude: /node_modules/,
// // //                 loader: 'babel-loader'
// // //             },
// // //             {
// // //                 test: /\.tsx?$/,
// // //                 // use: 'ts-loader',
// // //                 use: [
// // //                     {
// // //                         loader: 'babel-loader',
// // //                         options: {
// // //                             presets: [
// // //                                 "@babel/preset-env",
// // //                                 "@babel/preset-react",
// // //                                 "@babel/preset-typescript",
// // //                             ],
// // //                         },
// // //                     },
// // //                     {
// // //                         loader: 'ts-loader',
// // //                         options: {
// // //                             compilerOptions: {
// // //                                 noEmit: false,
// // //                             },
// // //                         },
// // //                     }
// // //                 ],
// // //                 exclude: /node_modules/,
// // //             },
// // //             {
// // //                 test: /\.json$/,
// // //                 loader: 'json-loader'
// // //             },
// // //             {
// // //                 test: /\.css$/i,
// // //                 use: ['style-loader', 'css-loader'],
// // //             },
// // //             {
// // //                 test: /\.(png|svg|jpg|jpeg|gif)$/i,
// // //                 type: 'asset/resource',
// // //             },
// // //             {
// // //                 test: /\.(woff|woff2|eot|ttf|otf)$/i,
// // //                 type: 'asset/resource',
// // //             },
// // //         ]
// // //     },
// // //     resolve: {
// // //         extensions: ['.tsx', '.ts', '.js'],
// // //         alias: {
// // //             '@app': path.resolve(__dirname, '../src'),
// // //         }
// // //     },
// // //     plugins: [
// // //         new HtmlWebpackPlugin({
// // //             template: path.resolve(__dirname, "../public", "index.html"),
// // //             //  filename: "index.html",
// // //             manifest: path.resolve(__dirname, "../public", "manifest.json"),
// // //         }),
// // //         new CopyPlugin({
// // //             patterns: [
// // //                 {
// // //                     from: path.resolve(__dirname, "../public"),
// // //                     to: 'assets',
// // //                     globOptions: {
// // //                         ignore: ['*.DS_Store'],
// // //                     },
// // //                 },
// // //             ],
// // //         }),
// // //         new ForkTsCheckerWebpackPlugin()
// // //     ],
// // //     // watchOptions: {
// // //     //     // for some systems, watching many files can result in a lot of CPU or memory usage
// // //     //     // https://webpack.js.org/configuration/watch/#watchoptionsignored
// // //     //     // don't use this pattern, if you have a monorepo with linked packages
// // //     //     ignored: path.resolve(__dirname, "../node_modules"),
// // //     // },
// // //     optimization: {
// // //         minimize: true,
// // //         minimizer: [
// // //             // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// // //             `...`,
// // //             new CssMinimizerPlugin(),
// // //         ], runtimeChunk: {
// // //             name: 'runtime',
// // //         },
// // //         splitChunks: {
// // //             cacheGroups: {
// // //                 commons: {
// // //                     test: /[\\/]node_modules[\\/]/,
// // //                     name: 'vendor',
// // //                     chunks: 'initial',
// // //                 },
// // //             },
// // //         },
// // //     },
// // // };

// // // //    // "webpack": "webpack-dev-server --open --mode development --hot",
// // // //"webpack": "webpack --mode productionwebpack --config config/webpack.prod.js",

// // // // https://github.com/glook/webpack-typescript-react/blob/master/webpack/optimization.js
// // // https://blog.kiprosh.com/application-performance-optimisation-using-webpack/
// // // https://indepth.dev/posts/1490/webpack-an-in-depth-introduction-to-splitchunksplugin
