const { zod, plugin } = require('../../dist/index.cjs');

module.exports = (eleventyConfig) => {
	eleventyConfig.addPlugin(plugin, {
		schemas: [
			{
				collections: ['posts'],
				schema: zod
					.object({
						title: zod.string(),
						description: zod.string(),
						draft: zod.boolean(),
					})
					.strict(),
			},
		],
	});
};
