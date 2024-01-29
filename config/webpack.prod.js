const webpack = require('webpack');
const { merge } = require('webpack-merge');
// const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
// const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'production',
	// devtool: "source-map",
	// node: {
	// 	module: 'empty',
	// 	dgram: 'empty',
	// 	dns: 'mock',
	// 	fs: 'empty',
	// 	http2: 'empty',
	// 	net: 'empty',
	// 	tls: 'empty',
	// 	child_process: 'empty'
	// },
	stats: {
		colors: true,
		hash: true,
		timings: true,
		assets: true,
		chunks: true,
		chunkModules: true,
		modules: true,
		children: true
	},

	optimization: {
		// If you want to run it also in development set the optimization.minimize option to true
		minimize: true,

		// 	// 	minimizer: [

		// 	// 		// new TerserPlugin({
		// 	// 		//     sourceMap: false,
		// 	// 		//     parallel: true,
		// 	// 		//     terserOptions: {
		// 	// 		//         compress: true,
		// 	// 		//     }
		// 	// 		// }),
		// 	// 		// new OptimizeCSSAssetsPlugin({})
		// 	// 	],

		minimizer: [
			// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
			`...`,
			compiler => {
				const TerserPlugin = require('terser-webpack-plugin');
				new TerserPlugin({
					// sourceMap: false,
					parallel: true,
					terserOptions: {
						parse: {
							// We want terser to parse ecma 8 code. However, we don't want it
							// to apply any minification steps that turns valid ecma 5 code
							// into invalid ecma 5 code. This is why the 'compress' and 'output'
							// sections only apply transformations that are ecma 5 safe
							// https://github.com/facebook/create-react-app/pull/4234
							ecma: 8
						},
						compress: {
							ecma: 5,
							warnings: false,
							// Disabled because of an issue with Uglify breaking seemingly valid code:
							// https://github.com/facebook/create-react-app/issues/2376
							// Pending further investigation:
							// https://github.com/mishoo/UglifyJS2/issues/2011
							comparisons: false,
							// Disabled because of an issue with Terser breaking valid code:
							// https://github.com/facebook/create-react-app/issues/5250
							// Pending further investigation:
							// https://github.com/terser-js/terser/issues/120
							inline: 2
						},
						mangle: {
							safari10: true
						},
						// Added for profiling in devtools
						// keep_classnames: isEnvProductionProfile,
						// keep_fnames: isEnvProductionProfile,
						output: {
							ecma: 5,
							comments: false,
							// Turned on because emoji and regex is not minified properly using default
							// https://github.com/facebook/create-react-app/issues/2488
							ascii_only: true
						}
					}
					// terserOptions: {
					// 	compress: true
					// }
				}).apply(compiler);
			},
			new CssMinimizerPlugin({
				minimizerOptions: {
					parallel: 4,
					minify: CssMinimizerPlugin.cleanCssMinify,
					preset: [
						'default',
						{
							discardComments: { removeAll: true }
						}
					]
				}
			})
		],
		// runtimeChunk: false,
		runtimeChunk: true,
		splitChunks: {
			cacheGroups: {
				default: false,
				vendors: false,
				chunks: 'all',
				minSize: '20000',
				maxInitialRequests: '30',
				maxAsyncRequests: '30',
				// default: false,
				// vendors: false,
				// chunks: "all",
				// maxInitialRequests: "6",
				// minSize: "0",
				// minSize: false,
				// maxInitialRequests: false,
				// styles: {
				//   name: "styles",
				//   test: /\.css$/,
				//   chunks: "all",
				//   enforce: true,
				// },
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						const packageName = module.context.match(
							/[\\/]node_modules[\\/](?:(@[\w-]*?[\\/].*?|.*?)([\\/]|$))/
						);

						if (packageName && packageName[1]) {
							// npm package names are URL-safe, but some servers don't like @ symbols
							return `npm.${packageName[1].replace('@', '')}`;
						}
					},
					priority: 20
				},
				react: {
					test: /[\\/]node_modules[\\/](@react|react|@react-dom|react-dom|@react-router-dom|react-router-dom)[\\/]/,
					name: 'npm.react',
					enforce: true,
					chunks: 'all',
					priority: 30
				},
				// reactdom: {
				// 	test: /[\\/]node_modules[\\/](@react-dom|react-dom)[\\/]/,
				// 	name: 'npm.reactdom',
				// 	enforce: true,
				// 	chunks: 'all',
				// 	priority: 30
				// },
				antd: {
					test: /[\\/]node_modules[\\/](@antd|antd)[\\/]/,
					name: 'npm.antd',
					enforce: true,
					chunks: 'all',
					priority: 31
				},
				materialui: {
					test: /[\\/]node_modules[\\/](@mui|@material-ui|material-ui)[\\/]/,
					name: 'npm.materialui',
					enforce: true,
					chunks: 'all',
					priority: 32
				},
				antdesign: {
					test: /[\\/]node_modules[\\/](@ant-design|ant-design)[\\/]/,
					name: 'npm.antdesign',
					enforce: true,
					chunks: 'all',
					priority: 33
				},
				// reactrouterdom: {
				// 	test: /[\\/]node_modules[\\/](@react-router-dom|react-router-dom)[\\/]/,
				// 	name: 'npm.reactrouterdom',
				// 	enforce: true,
				// 	chunks: 'all',
				// 	priority: 30
				// },
				reacthookform: {
					test: /[\\/]node_modules[\\/](@react-hook-form|react-hook-form)[\\/]/,
					name: 'npm.reacthookform',
					enforce: true,
					chunks: 'all',
					priority: 30
				},
				xlsx: {
					test: /[\\/]node_modules[\\/](@xlsx|xlsx)[\\/]/,
					name: 'npm.xlsx',
					enforce: true,
					chunks: 'all',
					priority: 34
				},
				reactpdf: {
					test: /[\\/]node_modules[\\/](@react-pdf|react-pdf)[\\/]/,
					name: 'npm.reactpdf',
					enforce: true,
					chunks: 'all',
					priority: 35
				},
				iconvlite: {
					test: /[\\/]node_modules[\\/](@iconv-lite|iconv-lite)[\\/]/,
					name: 'npm.iconvlite',
					enforce: true,
					chunks: 'all',
					priority: 36
				},
				// npmbundle: {
				//   test: /[\\/]node_modules[\\/](@material-ui-phone-number|material-ui-phone-number|@react-trello|react-trello|@uppy|uppy|@material-table|material-table)[\\/]/,
				//   name: "npm.npmbundle",
				//   enforce: true,
				//   chunks: "all",
				//   priority: 33,
				// },
				// materialtable: {
				//   test: /[\\/]node_modules[\\/](@material-table|material-table)[\\/]/,
				//   name: "npm.materialtable",
				//   enforce: true,
				//   chunks: "all",
				//   priority: 30,
				// },
				// material: {
				//   test: /[\\/]node_modules[\\/]((@material-ui[\\/].*?|.*?)([\\/]|$))/,
				//   name: "vendor.material",
				//   enforce: true,
				//   chunks: "all",
				//   priority: 30,
				// },
				// react: {
				//   test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
				//   name: "npm.react",
				//   chunks: "all",
				//   priority: 40,
				// },
				// common chunk
				common: {
					name: 'common',
					minChunks: 2,
					chunks: 'async',
					priority: 10,
					reuseExistingChunk: true,
					enforce: true
				}
				// vendors: {
				//   test: /[\\/]node_modules[\\/]/,
				//   name: "vendors",
				//   chunks: "all",
				//   priority: 10,
				//   // minChunks: 2
				// },
				// react: {
				//   test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
				//   name: "react",
				//   chunks: "all",
				//   priority: 11,
				// },
				// mui: {
				//   test: /[\\/]node_modules[\\/](material-ui)[\\/]/,
				//   name: "mui",
				//   chunks: "all",
				//   priority: 12,
				//   // enforce: true,
				//   // reuseExistingChunk: true,
				// },
				// muiui: {
				//   test: /[\\/]node_modules[\\/](@material-ui)[\\/]/,
				//   name: "muiui",
				//   chunks: "all",
				//   minChunks: 2,
				//   priority: 13,
				//   // enforce: true,
				//   // reuseExistingChunk: true
				// },
				// common chunk
				// common: {
				//     name: 'common',
				//     minChunks: 2,
				//     chunks: 'async',
				//     priority: 10,
				//     reuseExistingChunk: true,
				//     enforce: true
				// }
			}
		}
	},
	plugins: [
		new CompressionPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].[fullhash].css',
			chunkFilename: '[id].[fullhash].css'
		})
		// new webpack.DefinePlugin({
		//   "process.env": {
		//     NODE_ENV: JSON.stringify(process.env.NODE_ENV),
		//   },
		// }),
	],
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	}
	// optimization: {
	//   // minimizer: [new UglifyJsPlugin({ sourceMap: true })],
	//   // minimize: true,
	//   minimizer: [new TerserPlugin({ sourceMap: true })],
	// },
});

// // DX Previous Start
// const webpack = require('webpack');
// const { merge } = require('webpack-merge');
// // const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
// // const TerserPlugin = require('terser-webpack-plugin');
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
// // const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// const common = require('./webpack.common.js');

// module.exports = merge(common, {
// 	mode: 'production',
// 	// devtool: "source-map",
// 	// node: {
// 	// 	module: 'empty',
// 	// 	dgram: 'empty',
// 	// 	dns: 'mock',
// 	// 	fs: 'empty',
// 	// 	http2: 'empty',
// 	// 	net: 'empty',
// 	// 	tls: 'empty',
// 	// 	child_process: 'empty'
// 	// },
// 	stats: {
// 		colors: true,
// 		hash: true,
// 		timings: true,
// 		assets: true,
// 		chunks: true,
// 		chunkModules: true,
// 		modules: true,
// 		children: true
// 	},

// 	optimization: {
// 		// If you want to run it also in development set the optimization.minimize option to true
// 		minimize: true,

// 		// 	// 	minimizer: [

// 		// 	// 		// new TerserPlugin({
// 		// 	// 		//     sourceMap: false,
// 		// 	// 		//     parallel: true,
// 		// 	// 		//     terserOptions: {
// 		// 	// 		//         compress: true,
// 		// 	// 		//     }
// 		// 	// 		// }),
// 		// 	// 		// new OptimizeCSSAssetsPlugin({})
// 		// 	// 	],

// 		minimizer: [
// 			// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
// 			`...`,
// 			compiler => {
// 				const TerserPlugin = require('terser-webpack-plugin');
// 				new TerserPlugin({
// 					// sourceMap: false,
// 					parallel: true,
// 					terserOptions: {
// 						compress: true
// 					}
// 				}).apply(compiler);
// 			},
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
// 		],
// 		// runtimeChunk: false,
// 		runtimeChunk: true,
// 		splitChunks: {
// 			cacheGroups: {
// 				default: false,
// 				vendors: false,
// 				chunks: 'all',
// 				minSize: '0',
// 				maxInitialRequests: '20',
// 				maxAsyncRequests: '20',
// 				// default: false,
// 				// vendors: false,
// 				// chunks: "all",
// 				// maxInitialRequests: "6",
// 				// minSize: "0",
// 				// minSize: false,
// 				// maxInitialRequests: false,
// 				// styles: {
// 				//   name: "styles",
// 				//   test: /\.css$/,
// 				//   chunks: "all",
// 				//   enforce: true,
// 				// },
// 				vendor: {
// 					test: /[\\/]node_modules[\\/]/,
// 					name(module) {
// 						// get the name. E.g. node_modules/packageName/not/this/part.js
// 						// or node_modules/packageName
// 						const packageName = module.context.match(
// 							/[\\/]node_modules[\\/](?:(@[\w-]*?[\\/].*?|.*?)([\\/]|$))/
// 						)[1];

// 						// npm package names are URL-safe, but some servers don't like @ symbols
// 						return `npm.${packageName.replace('@', '')}`;
// 					},
// 					priority: 20
// 				},
// 				react: {
// 					test: /[\\/]node_modules[\\/](@react|react|@react-dom|react-dom|@react-router-dom|react-router-dom)[\\/]/,
// 					name: 'npm.react',
// 					enforce: true,
// 					chunks: 'all',
// 					priority: 30
// 				},
// 				// reactdom: {
// 				// 	test: /[\\/]node_modules[\\/](@react-dom|react-dom)[\\/]/,
// 				// 	name: 'npm.reactdom',
// 				// 	enforce: true,
// 				// 	chunks: 'all',
// 				// 	priority: 30
// 				// },
// 				antd: {
// 					test: /[\\/]node_modules[\\/](@antd|antd)[\\/]/,
// 					name: 'npm.antd',
// 					enforce: true,
// 					chunks: 'all',
// 					priority: 31
// 				},
// 				materialui: {
// 					test: /[\\/]node_modules[\\/](@material-ui|material-ui)[\\/]/,
// 					name: 'npm.materialui',
// 					enforce: true,
// 					chunks: 'all',
// 					priority: 32
// 				},
// 				antdesign: {
// 					test: /[\\/]node_modules[\\/](@ant-design|ant-design)[\\/]/,
// 					name: 'npm.antdesign',
// 					enforce: true,
// 					chunks: 'all',
// 					priority: 33
// 				},
// 				// reactrouterdom: {
// 				// 	test: /[\\/]node_modules[\\/](@react-router-dom|react-router-dom)[\\/]/,
// 				// 	name: 'npm.reactrouterdom',
// 				// 	enforce: true,
// 				// 	chunks: 'all',
// 				// 	priority: 30
// 				// },
// 				reacthookform: {
// 					test: /[\\/]node_modules[\\/](@react-hook-form|react-hook-form)[\\/]/,
// 					name: 'npm.reacthookform',
// 					enforce: true,
// 					chunks: 'all',
// 					priority: 30
// 				},
// 				xlsx: {
// 					test: /[\\/]node_modules[\\/](@xlsx|xlsx)[\\/]/,
// 					name: 'npm.xlsx',
// 					enforce: true,
// 					chunks: 'all',
// 					priority: 34
// 				},
// 				reactpdf: {
// 					test: /[\\/]node_modules[\\/](@react-pdf|react-pdf)[\\/]/,
// 					name: 'npm.reactpdf',
// 					enforce: true,
// 					chunks: 'all',
// 					priority: 35
// 				},
// 				iconvlite: {
// 					test: /[\\/]node_modules[\\/](@iconv-lite|iconv-lite)[\\/]/,
// 					name: 'npm.iconvlite',
// 					enforce: true,
// 					chunks: 'all',
// 					priority: 36
// 				},
// 				// npmbundle: {
// 				//   test: /[\\/]node_modules[\\/](@material-ui-phone-number|material-ui-phone-number|@react-trello|react-trello|@uppy|uppy|@material-table|material-table)[\\/]/,
// 				//   name: "npm.npmbundle",
// 				//   enforce: true,
// 				//   chunks: "all",
// 				//   priority: 33,
// 				// },
// 				// materialtable: {
// 				//   test: /[\\/]node_modules[\\/](@material-table|material-table)[\\/]/,
// 				//   name: "npm.materialtable",
// 				//   enforce: true,
// 				//   chunks: "all",
// 				//   priority: 30,
// 				// },
// 				// material: {
// 				//   test: /[\\/]node_modules[\\/]((@material-ui[\\/].*?|.*?)([\\/]|$))/,
// 				//   name: "vendor.material",
// 				//   enforce: true,
// 				//   chunks: "all",
// 				//   priority: 30,
// 				// },
// 				// react: {
// 				//   test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
// 				//   name: "npm.react",
// 				//   chunks: "all",
// 				//   priority: 40,
// 				// },
// 				// common chunk
// 				common: {
// 					name: 'common',
// 					minChunks: 2,
// 					chunks: 'async',
// 					priority: 10,
// 					reuseExistingChunk: true,
// 					enforce: true
// 				}
// 				// vendors: {
// 				//   test: /[\\/]node_modules[\\/]/,
// 				//   name: "vendors",
// 				//   chunks: "all",
// 				//   priority: 10,
// 				//   // minChunks: 2
// 				// },
// 				// react: {
// 				//   test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
// 				//   name: "react",
// 				//   chunks: "all",
// 				//   priority: 11,
// 				// },
// 				// mui: {
// 				//   test: /[\\/]node_modules[\\/](material-ui)[\\/]/,
// 				//   name: "mui",
// 				//   chunks: "all",
// 				//   priority: 12,
// 				//   // enforce: true,
// 				//   // reuseExistingChunk: true,
// 				// },
// 				// muiui: {
// 				//   test: /[\\/]node_modules[\\/](@material-ui)[\\/]/,
// 				//   name: "muiui",
// 				//   chunks: "all",
// 				//   minChunks: 2,
// 				//   priority: 13,
// 				//   // enforce: true,
// 				//   // reuseExistingChunk: true
// 				// },
// 				// common chunk
// 				// common: {
// 				//     name: 'common',
// 				//     minChunks: 2,
// 				//     chunks: 'async',
// 				//     priority: 10,
// 				//     reuseExistingChunk: true,
// 				//     enforce: true
// 				// }
// 			}
// 		}
// 	},
// 	plugins: [
// 		new CompressionPlugin()
// 		// new webpack.DefinePlugin({
// 		//   "process.env": {
// 		//     NODE_ENV: JSON.stringify(process.env.NODE_ENV),
// 		//   },
// 		// }),
// 	],
// 	performance: {
// 		hints: false,
// 		maxEntrypointSize: 512000,
// 		maxAssetSize: 512000
// 	}
// 	// optimization: {
// 	//   // minimizer: [new UglifyJsPlugin({ sourceMap: true })],
// 	//   // minimize: true,
// 	//   minimizer: [new TerserPlugin({ sourceMap: true })],
// 	// },
// });
// // DX Previous End

// const { merge } = require('webpack-merge');
// const CompressionPlugin = require('compression-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');

// const common = require('./webpack.common.js');

// function normalizeName(name) {
// 	console.log('hi', name);
// 	return name
// 		.replace(/node_modules/g, 'nodemodules')
// 		.replace(/[\-_.|]+/g, ' ')
// 		.replace(/\b(vendors|nodemodules|js|modules|es)\b/g, '')
// 		.trim()
// 		.replace(/ +/g, '-');
// }

// module.exports = merge(common, {
// 	mode: 'production',
// 	// devtool: false, // 'source-map',
// 	devtool: 'source-map',
// 	// node: {
// 	// 	dgram: {},
// 	// 	fs: {},
// 	// 	net: {},
// 	// 	tls: {},
// 	// 	child_process: {}
// 	// },
// 	// node: {
// 	// 	module: 'empty',
// 	// 	dgram: 'empty',
// 	// 	dns: 'mock',
// 	// 	fs: 'empty',
// 	// 	http2: 'empty',
// 	// 	net: 'empty',
// 	// 	tls: 'empty',
// 	// 	child_process: 'empty'
// 	// },
// 	// stats: {
// 	// 	colors: true,
// 	// 	hash: true,
// 	// 	timings: true,
// 	// 	assets: true,
// 	// 	chunks: true,
// 	// 	chunkModules: true,
// 	// 	modules: true,
// 	// 	children: true
// 	// },
// 	plugins: [new CompressionPlugin()],
// 	optimization: {
// 		splitChunks: {
// 			// chunks: 'async',
// 			// minSize: 20000,
// 			// minRemainingSize: 0,
// 			// minChunks: 1,
// 			// maxAsyncRequests: 30,
// 			// maxInitialRequests: 30,
// 			// enforceSizeThreshold: 50000,
// 			cacheGroups: {
// 				vendor: {
// 					test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
// 					name: 'vendor',
// 					chunks: 'all'
// 				}
// 				// defaultVendors: {
// 				// 	filename: pathData => {
// 				// 		// Use pathData object for generating filename string based on your requirements
// 				// 		return `${pathData.chunk.name}-bundle.js`;
// 				// 	}
// 				// },
// 				// // defaultVendors: {
// 				// // 	test: /[\\/]node_modules[\\/]/,
// 				// // 	priority: -10,
// 				// // 	reuseExistingChunk: true
// 				// // },
// 				// default: {
// 				// 	minChunks: 2,
// 				// 	priority: -20,
// 				// 	reuseExistingChunk: true
// 				// }
// 			}
// 		}
// 	},
// 	// optimization: {
// 	// 	minimizer: [
// 	// 		compiler => {
// 	// 			const TerserPlugin = require('terser-webpack-plugin');
// 	// 			new TerserPlugin({
// 	// 				// sourceMap: false,
// 	// 				parallel: true,
// 	// 				terserOptions: {
// 	// 					compress: true
// 	// 				}
// 	// 			}).apply(compiler);
// 	// 		}
// 	// 		// new TerserPlugin({
// 	// 		//     sourceMap: false,
// 	// 		//     parallel: true,
// 	// 		//     terserOptions: {
// 	// 		//         compress: true,
// 	// 		//     }
// 	// 		// }),
// 	// 		// new OptimizeCSSAssetsPlugin({})
// 	// 	],
// 	// 	runtimeChunk: false,
// 	// 	//runtimeChunk: 'single',
// 	// 	splitChunks: {
// 	// 		cacheGroupFoo: {
// 	// 			// The number of chunks the module must appear in
// 	// 			minChunks: 3,
// 	// 			// Number of bytes put in a chunk(i.e. the sum of the number of bytes for each constituent module)
// 	// 			// For example, if a chunk contains 2 modules, `x` and `w`, then `nrBytesChunk = nrBytes(x) + nrBytes(w)`.
// 	// 			minSize: 10,
// 	// 			// Which modules are to be considered
// 	// 			modulePathPattern: /node_modules/
// 	// 		}
// 	// 		// chunks: 'all',
// 	// 		// maxInitialRequests: Infinity,
// 	// 		// minSize: 0,
// 	// 		// cacheGroups: {
// 	// 		// 	vendor: {
// 	// 		// 		test: /[\\/]node_modules[\\/]/,
// 	// 		// 		name(module) {
// 	// 		// 			// get the name. E.g. node_modules/packageName/not/this/part.js
// 	// 		// 			// or node_modules/packageName
// 	// 		// 			const packageName = module.context.match(
// 	// 		// 				/[\\/]node_modules[\\/](?:(@[\w-]*?[\\/].*?|.*?)([\\/]|$))/
// 	// 		// 			);
// 	// 		// 			if (packageName) {
// 	// 		// 				console.log('he', `npm.${packageName[1].replace('@', 'dx')}`);
// 	// 		// 				// npm package names are URL-safe, but some servers don't like @ symbols
// 	// 		// 				return `npm.${packageName[1].replace('@', 'dx')}`;
// 	// 		// 			}
// 	// 		// 		},
// 	// 		// 		priority: 20
// 	// 		// 		// enforce: true,
// 	// 		// 		// chunks: 'async'
// 	// 		// 	},
// 	// 		// 	react: {
// 	// 		// 		test: /[\\/]node_modules[\\/](@react|react)[\\/]/,
// 	// 		// 		name: 'npm.react',
// 	// 		// 		// enforce: true,
// 	// 		// 		// chunks: 'all',
// 	// 		// 		priority: 30
// 	// 		// 	}
// 	// 		// }
// 	// 		// chunks: 'all',
// 	// 		// name(module, chunks, cacheGroupKey) {
// 	// 		// 	const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
// 	// 		// 	if (packageName) {
// 	// 		// 		console.log('packageName', packageName);
// 	// 		// 		console.log(typeof packageName);
// 	// 		// 		console.log(packageName[1]);
// 	// 		// 		// npm package names are URL-safe, but some servers don't like @ symbols
// 	// 		// 		return `npm.${packageName[1].replace('@', '')}`;
// 	// 		// 	}
// 	// 		// 	// const moduleFileName = module
// 	// 		// 	// 	.identifier()
// 	// 		// 	// 	.split('/')
// 	// 		// 	// 	.reduceRight(item => item);

// 	// 		// 	// const allChunksNames = chunks.map(item => item.name).join('-');
// 	// 		// 	// console.log('allChunksNames', allChunksNames);
// 	// 		// 	// return normalizeName(moduleFileName.replace(/[\/]/g, '-'));
// 	// 		// }

// 	// 		// cacheGroups: {
// 	// 		// 	vendor: {
// 	// 		// 		test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
// 	// 		// 		name: 'vendor',
// 	// 		// 		chunks: 'all'
// 	// 		// 	},
// 	// 		// 	defaultVendors: {
// 	// 		// 		filename: pathData => {
// 	// 		// 			// Use pathData object for generating filename string based on your requirements
// 	// 		// 			return `${pathData.chunk.name}-bundle.js`;
// 	// 		// 		}
// 	// 		// 	}
// 	// 		// commons: {
// 	// 		// 	test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
// 	// 		// 	name: 'react',
// 	// 		// 	chunks: 'all'
// 	// 		// },
// 	// 		// vendor: {
// 	// 		// 	test: /[\\/]node_modules[\\/]/,
// 	// 		// 	name: 'vendorshello',
// 	// 		// 	chunks: 'all'
// 	// 		// },
// 	// 		// commons: {
// 	// 		// 	test: /[\\/]node_modules[\\/]/,
// 	// 		// 	// cacheGroupKey here is `commons` as the key of the cacheGroup
// 	// 		// 	name(module, chunks, cacheGroupKey) {
// 	// 		// 		const moduleFileName = module
// 	// 		// 			.identifier()
// 	// 		// 			.split('/')
// 	// 		// 			.reduceRight(item => item);
// 	// 		// 		const allChunksNames = chunks.map(item => item.name).join('~');

// 	// 		// 		console.log('allChunksNames', allChunksNames);
// 	// 		// 		return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
// 	// 		// 	},
// 	// 		// 	chunks: 'all'
// 	// 		// }
// 	// 		// vendorreact: {
// 	// 		// 	test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
// 	// 		// 	name: 'vendor',
// 	// 		// 	chunks: 'all'
// 	// 		// }
// 	// 		// vendors: {
// 	// 		// 	test: /node_modules/,
// 	// 		// 	chunks: 'initial',
// 	// 		// 	filename: 'vendors.[contenthash].js',
// 	// 		// 	priority: 1,
// 	// 		// 	maxInitialRequests: 2, // create only one vendor file
// 	// 		// 	minChunks: 1
// 	// 		// }
// 	// 		// vendor: {
// 	// 		// 	test: /[\\/]node_modules[\\/]/,
// 	// 		// 	name: function (module, chunks, cacheGroupKey) {
// 	// 		// 		const moduleFileName = module
// 	// 		// 			.identifier()
// 	// 		// 			.split('/')
// 	// 		// 			.reduceRight(item => item);
// 	// 		// 		// This is taken from the documentation but there
// 	// 		// 		// seems to be no great explaination but it seems
// 	// 		// 		// to be what we need, joining the entry point names
// 	// 		// 		// together by ~.  We can then determine which chunk/file
// 	// 		// 		// needs to be loaded by each entry point.
// 	// 		// 		const allChunksNames = chunks.map(item => item.name).join('~');
// 	// 		// 		return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
// 	// 		// 	},
// 	// 		// 	chunks: 'all',
// 	// 		// 	priority: -10,
// 	// 		// 	reuseExistingChunk: true
// 	// 		// }
// 	// 		// commons: {
// 	// 		// 	test: /[\\/]node_modules[\\/]/,
// 	// 		// 	// cacheGroupKey here is `commons` as the key of the cacheGroup
// 	// 		// 	name(module, chunks, cacheGroupKey) {
// 	// 		// 		const moduleFileName = module
// 	// 		// 			.identifier()
// 	// 		// 			.split('/')
// 	// 		// 			.reduceRight(item => item);

// 	// 		// 		const allChunksNames = chunks.map(item => item.name).join('~');
// 	// 		// 		return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;

// 	// 		// 		// const allChunksNames = chunks.map(item => item.name).join('~');

// 	// 		// 		// return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
// 	// 		// 	},
// 	// 		// 	chunks: 'all',
// 	// 		// 	priority: -10,
// 	// 		// 	reuseExistingChunk: true
// 	// 		// }
// 	// 		//}
// 	// 	}
// 	// 	// splitChunks: {
// 	// 	// 	chunks: 'async',
// 	// 	// 	minSize: 20000,
// 	// 	// 	minRemainingSize: 0,
// 	// 	// 	minChunks: 1,
// 	// 	// 	maxAsyncRequests: 30,
// 	// 	// 	maxInitialRequests: 30,
// 	// 	// 	enforceSizeThreshold: 50000,
// 	// 	// 	cacheGroups: {
// 	// 	// 		defaultVendors: {
// 	// 	// 			test: /[\\/]node_modules[\\/]/,
// 	// 	// 			priority: -10,
// 	// 	// 			reuseExistingChunk: true
// 	// 	// 		},
// 	// 	// 		default: {
// 	// 	// 			minChunks: 2,
// 	// 	// 			priority: -20,
// 	// 	// 			reuseExistingChunk: true
// 	// 	// 		}
// 	// 	// 	}
// 	// 	// }
// 	// 	// splitChunks: {
// 	// 	// 	cacheGroups: {
// 	// 	// 		vendor: {
// 	// 	// 			test: /[\\/]node_modules[\\/]/,
// 	// 	// 			name(module) {
// 	// 	// 				// get the name. E.g. node_modules/packageName/not/this/part.js
// 	// 	// 				// or node_modules/packageName
// 	// 	// 				const packageName = module.context.match(
// 	// 	// 					/[\\/]node_modules[\\/](?:(@[\w-]*?[\\/].*?|.*?)([\\/]|$))/
// 	// 	// 				)[1];

// 	// 	// 				// npm package names are URL-safe, but some servers don't like @ symbols
// 	// 	// 				return `npm.${packageName.replace('@', '')}`;
// 	// 	// 			},
// 	// 	// 			priority: 20
// 	// 	// 		},
// 	// 	// 		react: {
// 	// 	// 			test: /[\\/]node_modules[\\/](@react|react)[\\/]/,
// 	// 	// 			name: 'npm.react',
// 	// 	// 			enforce: true,
// 	// 	// 			chunks: 'all',
// 	// 	// 			priority: 30
// 	// 	// 		},
// 	// 	// 		xlsx: {
// 	// 	// 			test: /[\\/]node_modules[\\/](@xlsx|xlsx)[\\/]/,
// 	// 	// 			name: 'npm.xlsx',
// 	// 	// 			enforce: true,
// 	// 	// 			chunks: 'all',
// 	// 	// 			priority: 32
// 	// 	// 		},
// 	// 	// 		reactpdf: {
// 	// 	// 			test: /[\\/]node_modules[\\/](@react-pdf|react-pdf)[\\/]/,
// 	// 	// 			name: 'npm.reactpdf',
// 	// 	// 			enforce: true,
// 	// 	// 			chunks: 'all',
// 	// 	// 			priority: 33
// 	// 	// 		},
// 	// 	// 		iconvlite: {
// 	// 	// 			test: /[\\/]node_modules[\\/](@iconv-lite|iconv-lite)[\\/]/,
// 	// 	// 			name: 'npm.iconvlite',
// 	// 	// 			enforce: true,
// 	// 	// 			chunks: 'all',
// 	// 	// 			priority: 34
// 	// 	// 		},
// 	// 	// 		common: {
// 	// 	// 			name: 'common',
// 	// 	// 			minChunks: 2,
// 	// 	// 			chunks: 'async',
// 	// 	// 			priority: 10,
// 	// 	// 			reuseExistingChunk: true,
// 	// 	// 			enforce: true
// 	// 	// 		}
// 	// 	// 	}
// 	// 	// }
// 	// },
// 	performance: {
// 		hints: false,
// 		maxEntrypointSize: 512000,
// 		maxAssetSize: 512000
// 	}
// });

// const { merge } = require('webpack-merge');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");z

// const common = require('./webpack.common.js');

// module.exports = merge(common, {
//     mode: 'production',
//     devtool: 'source-map',
//     plugins: [
//         // Extracts CSS into separate files
//         // Note: style-loader is for development, MiniCssExtractPlugin is for production
//         new MiniCssExtractPlugin({
//             filename: 'styles/[name].[contenthash].css',
//             chunkFilename: '[id].css',
//         }),
//     ],
//     // module: {
//     //     rules: [
//     //         {
//     //             test: /\.(scss|css)$/,
//     //             use: [
//     //                 MiniCssExtractPlugin.loader,
//     //                 {
//     //                     loader: 'css-loader',
//     //                     options: {
//     //                         importLoaders: 2,
//     //                         sourceMap: false,
//     //                     },
//     //                 },
//     //                 // 'postcss-loader',
//     //                 'sass-loader',
//     //             ],
//     //         },
//     //     ],
//     // },
//     performance: {
//         hints: false,
//         maxEntrypointSize: 512000,
//         maxAssetSize: 512000,
//     },
// });
