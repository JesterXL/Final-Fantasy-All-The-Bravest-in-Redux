var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: ['babel-polyfill', "./src/index.js"],
	output: {
		path: __dirname,
		filename: "bundle.js",
		sourceMapFilename: 'bundle.map'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel', // 'babel-loader' is also a legal name to reference
				query: {
					presets: ['es2015']
				}
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.png/,
				loader: "url-loader?limit=10000&mimetype=image/png"
			}
		],
		postLoaders: [
			{
				include: path.resolve(__dirname, 'node_modules/pixi.js'),
				loader: 'transform/cacheable?brfs'
			}
		]
	},
	devtool: 'source-map'
};


//transform?brfs
//transform/cacheable?brfs
//transform/cacheable?browserify-versionify