const path = require('path');
module.exports = {
	entry: './src/DatePicker.js',
	output: {
		filename: 'DatePicker.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'commonjs2'
	},
	devServer: {
		port: 8080
	},
	watch: true,
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.*css$/,
				use: ["style-loader", "css-loader"]
			}
		]
	}
};