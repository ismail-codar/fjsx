const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

module.exports = {
	entry: './index.ts',
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
	devtool: 'none',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'commonjs'
	},
	plugins: [
		new CopyWebpackPlugin([ { from: './types', to: './types' } ]),
		new class ReplacePlugin {
			apply(compiler) {
				compiler.hooks.done.tap('Hello World Plugin', (
					stats /* stats is passed as argument when done hook is tapped.  */
				) => {
					// fs.copyFileSync('./types/global.d.ts', './dist/');
					// fs.copyFileSync('./types/JSX.d.ts', './dist/');
					setTimeout(() => {
						let content = fs.readFileSync('./dist/index.d.ts').toString();
						content = content.replace('../types', './types');
						fs.writeFileSync('./dist/index.d.ts', content);
					}, 500);
				});
			}
		}()
	]
};
