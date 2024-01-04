const { plugin: pluginValidate } = require('../../dist/index.cjs');
const { z } = require('zod');

module.exports = (eleventyConfig) => {
	eleventyConfig.addPlugin(pluginValidate, {
		schemas: [
			{
				collections: ['posts'],
				schema: z.object({
					abc: z.boolean(),
				}),
			},
		],
	});
};
