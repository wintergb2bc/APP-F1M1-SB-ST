const plugins = [
	["module-resolver", {
		"root": ["./"],
		"extensions": [".js", ".ios.js", ".android.js"],
		"alias": {
			"$LIB": "./src/lib",
			"@": "./src"
		}
	}]
];
if (process.env.NODE_ENV === 'production') {
  plugins.push("transform-remove-console")
}

module.exports = {
	presets: ["module:metro-react-native-babel-preset"],
	plugins
};