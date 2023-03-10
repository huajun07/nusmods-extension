const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
module.exports = {
	mode: 'production',
	entry: {
		index: path.resolve(__dirname, 'scripts', 'index.ts'),
	},
	output: {
		path: path.join(__dirname, './build'),
		filename: '[name].js',
	},
	resolve: {
		extensions: ['.ts', '.js', '.tsx', '.jsx'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.png$/,
				type: 'asset/inline',
			},
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: '.', to: '.', context: 'public' }],
		}),
	],
}
