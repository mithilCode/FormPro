const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	devtool: 'inline-source-map',
	mode: 'development',
	devServer: {
		static: [path.join(__dirname, '..', 'build')],
		open: true,
		compress: true,
		historyApiFallback: true
	}
	// node: {
	// 	fs: 'empty'
	// }
});

// /* eslint-disable @typescript-eslint/no-var-requires */
// const path = require('path');
// const { merge } = require('webpack-merge');
// const common = require('./webpack.common.js');

// module.exports = merge(common, {
// 	mode: 'development',
// 	// devtool: 'inline-source-map',
// 	devtool: 'source-map',
// 	devServer: {
// 		// static: '../dist',
// 		// static: path.resolve(__dirname, '../dist'),
// 		static: [path.join(__dirname, '..', 'dist')],
// 		// contentBase: path.resolve(__dirname, '../dist'),
// 		open: true,
// 		compress: true,
// 		hot: true,
// 		historyApiFallback: true
// 	}
// });

// const { merge } = require('webpack-merge');
// const common = require('./webpack.common.js');

// module.exports = merge(common, {
//     mode: 'development',
//     devtool: 'inline-source-map',
//     devServer: {
//         static: './dist',
//         historyApiFallback: true,
//         //open: true,
//         //compress: true,
//         // hot: true,
//         // port: 8080,
//     },
//     // optimization: {
//     //     runtimeChunk: 'single',
//     // },
//     // node: {
//     //     fs: "empty"
//     // }
// });
