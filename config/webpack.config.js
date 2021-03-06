const path = require('path');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devConfig = require('./webpack.dev');
const parts = require('./webpack.parts');

const __root = path.resolve(__dirname, '../');

require('dotenv').config({ path: path.resolve(__root, '.env') });

const devMode = process.env.NODE_ENV !== 'production';

/*==========================
=== Base config
===========================*/
const baseConfig = webpackMerge([
	{
		mode: process.env.NODE_ENV || 'development',
		entry: path.resolve(__root, 'app/scripts'),
		output: {
			path: path.resolve(__root, 'dist'),
			filename: 'index_bundle.js',
		},
		optimization: {
			removeAvailableModules: false,
			removeEmptyChunks: false,
			splitChunks: false,
		},
		performance: {
			hints: 'warning',
		},
		/*==========================
		=== Plugins
		===========================*/
		module: {
			rules: [
				{
					test: /\.js$/,
					include: path.resolve(__root, 'app/scripts'),
					exclude: path.resolve(__root, 'node_modules'),
					loader: 'babel-loader',
				},
			],
		},
		/*==========================
		=== Plugins
		===========================*/
		plugins: [
			new HTMLWebpackPlugin({
				title: 'THREE base',
				template: path.resolve(__root, 'app/index.html'),
			}),
			new MiniCssExtractPlugin({
				filename: devMode ? '[name].css' : '[name].[hash].css',
				chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
			}),
			// new ThreeWebpackPlugin(),
			new CopyWebpackPlugin([
				{
					from: path.resolve(__root, 'public'),
				},
			]),
		],
	},
	parts.loadCss(),
]);

/*==========================
=== Development config
===========================*/
const developmentConfig = webpackMerge([
	devConfig.devServer({
		// Customise host/port here
		host: process.env.HOST,
		port: process.env.PORT,
	}),
]);

module.exports = mode => {
	console.log(mode);

	if (mode === 'production') {
		return webpackMerge(baseConfig, productionConfig, { mode });
	}

	return webpackMerge(baseConfig, developmentConfig, { mode });
};
