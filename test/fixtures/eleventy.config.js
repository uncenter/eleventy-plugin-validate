const pluginValidate = require('../../dist/index.cjs');

module.exports = (eleventyConfig) => {
	eleventyConfig.addPlugin(pluginValidate, {
		schema: {
			abc: true,
		},
	});
};
