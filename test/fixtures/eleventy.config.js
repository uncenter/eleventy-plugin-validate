const pluginValidate = require('../../dist/index.cjs');
const { z } = require('zod');

module.exports = (eleventyConfig) => {
	eleventyConfig.addCollection('posts', (collectionsApi) => {
		return collectionsApi.getFilteredByGlob('./posts/*.md');
	});

	eleventyConfig.addPlugin(pluginValidate, {
		validator: 'zod',
		schemas: [
			{
				collections: ['posts'],
				schema: z
					.object({
						title: z.string(),
						description: z.string(),
						draft: z.boolean(),
					})
					.strict(),
			},
			{
				collections: ['tips'],
				schema: z.object({
					title: z.string(),
					description: z.string(),
					date: z.date(),
				}),
			},
		],
	});
};
