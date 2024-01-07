const pluginValidate = require('../../dist/index.cjs');
const { z } = require('zod');

module.exports = (eleventyConfig) => {
	eleventyConfig.addCollection('posts', (collectionsApi) => {
		return collectionsApi.getFilteredByGlob('./posts/*.md');
	});

	eleventyConfig.addPlugin(pluginValidate, {
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
					date: z.date().min(new Date('2024-01-07')),
				}),
			},
		],
	});
};
