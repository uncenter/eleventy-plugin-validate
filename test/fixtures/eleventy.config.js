const { zod, plugin } = require('../../dist/index.cjs');

module.exports = (eleventyConfig) => {
	eleventyConfig.addPlugin(plugin, {
		schemas: [
			{
				collections: ['posts'],
				schema: zod.object({
					abc: zod.boolean(),
				}),
			},
		],
	});
};
