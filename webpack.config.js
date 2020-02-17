const path = require("path");
const glob = require("glob");

const jsBasePath = path.resolve(__dirname, "src/");
const targets = glob.sync(`${jsBasePath}/client/script/**/*.@(ts|js)`);

/** @type import('webpack').Configuration */
const entries = {};
targets.forEach(value => {
	const re = new RegExp(`${jsBasePath}/client`);
	const key = value.replace(re, "").replace(/.ts$/, ".js");
	entries[key] = value;
});
module.exports = {
	entry: entries,
	output: {
		path: path.join(__dirname, "public/script"),
		filename: "[name]"
	},
	devtool: "source-map",
	resolve: {
		extensions: [".ts", ".js"]
	},
	module: {
		rules: [
			{
				test: /.*?\.ts?$/,
				use: [{ loader: "ts-loader" }]
			}
		]
	},
	mode: "development"
};
