const path							= require('path');
const webpack 						= require('webpack');
const ExtractTextPlugin				= require('extract-text-webpack-plugin');
//const HtmlWebpackPlugin		 	= require('html-webpack-plugin');
//const ScriptExtHtmlWebpackPlugin 	= require('script-ext-html-webpack-plugin');

module.exports = {
	entry: ['whatwg-fetch', './public/main.js'],
	devtool: 'source-map',

	output: {
		path: path.resolve(__dirname, 'public/dist'),
		filename: 'app.js',
		publicPath: '/dist',
	},

	module: {
		rules: [{
			test: /\.less$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', 'less-loader']
			})
		},{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader'
			}
		}]
	},

	plugins: ([
		new ExtractTextPlugin('style.css')
	])
}
