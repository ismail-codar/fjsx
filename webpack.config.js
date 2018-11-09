const path = require('path');
const fs = require('fs');

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
	devtool: 'source-map',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'commonjs'
	},
	plugins: [
		new class ReplacePlugin {
			apply(compiler) {
				compiler.hooks.done.tap('replace', (stats) => {
					setTimeout(() => {
						fs.mkdirSync('./dist/types');
						fs.copyFileSync('./types/global.d.ts', './dist/types/global.d.ts');
						fs.copyFileSync('./types/JSX.d.ts', './dist/types/JSX.d.ts');
						let content = fs.readFileSync('./dist/index.d.ts').toString();
						content = content.replace('../types', './types');
						fs.writeFileSync('./dist/index.d.ts', content);
					}, 1500);
				});
			}
		}()
	]
};
