/** Reference: http://karma-runner.github.io/0.12/config/configuration-file.html */
module.exports = function karmaConfig (config) {
	config.set({
		plugins: [
			require('karma-webpack'),
			require('karma-tap'),
			require('karma-chrome-launcher'),
			require('karma-phantomjs2-launcher'),
			require('karma-coverage'),
			require('karma-sourcemap-loader')
		],
		logLevel: config.LOG_INFO,  /** Log our errors */

		client: {
			captureConsole: false
		},

		frameworks: [

		/**
		* Reference: https://github.com/karma-runner/karma-jasmine
		* Set framework to jasmine
		*/
		'tap'
		],

		// reporters: [

		//   /**
		//    * Reference: https://github.com/mlex/karma-spec-reporter
		//    * Set reporter to print detailed results to console
		//    */
		//   'progress',

		//   /**
		//    * Reference: https://github.com/karma-runner/karma-coverage
		//    * Output code coverage files
		//    */
		//   'coverage'
		// ],

		// reporters: [ 'tap-spec' ],

		files: [
			/** Grab all files in the app folder that contain .spec. */
			'./src/tests.webpack.js'
			/** each file acts as entry point for the webpack configuration */
		],

		preprocessors: {

			/**
			* Reference: http://webpack.github.io/docs/testing.html
			* Reference: https://github.com/webpack/karma-webpack
			* Convert files with webpack and load sourcemaps
			*/
			'./src/tests.webpack.js': ['webpack', 'sourcemap']
		},

		browsers: [
			'PhantomJS2'
		],

		singleRun: false,

		/** Configure code coverage reporter */
		coverageReporter: {
			dir: 'coverage',
			reporters: [
				{type: 'html', subdir: 'html'}
			],
			check: {
				statements: 50,
				branches: 50,
				functions: 50,
				lines: 50
			},
			watermarks: {
				statements: [30, 50],
				functions: [30, 50],
				branches: [30, 50],
				lines: [30, 50]
			}
		},

		thresholdReporter: {
			statements: 50,
			branches: 50,
			functions: 50,
			lines: 50
		},


		webpack: require('./webpack.config'),

		/** Hide webpack build information from output */
		webpackMiddleware: {
			noInfo: 'errors-only'
		}
	});
};


// var webpack = require('webpack');

// module.exports = function(config) {
//   config.set({
//     plugins: [
//       require('karma-webpack'),
//       require('karma-tap'),
//       require('karma-chrome-launcher'),
//       require('karma-phantomjs-launcher'),
//       require('karma-coverage')
//     ],

//     basePath: '',
//     frameworks: [ 'tap' ],
//     files: [ 'src/**/*.js' ],

//     preprocessors: {
//       'src/**/*.js': [ 'webpack' ]
//     },

//     webpack: {
//       node : {
//         fs: 'empty'
//       },

//       // Instrument code that isn't test or vendor code.
//       module: {
//         postLoaders: [{
//           test: /\.js$/,
//           exclude: /(test|node_modules)\//,
//           loader: 'istanbul-instrumenter'
//         }]
//       }
//     },

//     webpackMiddleware: {
//       noInfo: true
//     },

//     reporters: [
//       'dots',
//       'coverage'
//     ],

//     coverageReporter: {
//       type: 'text',
//       dir: 'coverage/'
//     },

//     port: 9876,
//     colors: true,
//     logLevel: config.LOG_INFO,
//     autoWatch: true,
//     browsers: ['Chrome'],
//     singleRun: false
//   })
// };