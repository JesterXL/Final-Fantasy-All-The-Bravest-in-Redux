var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: "./src/index.js",
	output: {
		path: __dirname,
		filename: "bundle.js"
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
			}
		],
		postLoaders: [
			{
				include: path.resolve(__dirname, 'node_modules/pixi.js'),
				loader: 'transform/cacheable?brfs'
			}
		]
	}
};

//transform?brfs
//transform/cacheable?brfs
//transform/cacheable?browserify-versionify