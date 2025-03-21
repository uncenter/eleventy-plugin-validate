import type { Options } from './options';

import { PluginError } from './error';
import { mergeOptions, validateOptions } from './options';
import { log } from './utils';
import { validators } from './validators';

export default function plugin(eleventyConfig: any, opts: Options) {
	if (opts === null || typeof opts !== 'object')
		throw new PluginError(
			`Expected options to be an object but received ${typeof opts}`,
		);
	const options = mergeOptions(opts);
	validateOptions(options);

	eleventyConfig.addCollection(
		'eleventy-plugin-validate',
		async (collectionApi: any) => {
			// Get a list of every collection item.
			const all = collectionApi.getAll() as any[];
			if (all.length === 0) return [];

			let foundIssues = false;

			// Loop through the user provided schemas.
			for (const schema of options.schemas) {
				const items: any[] = [];

				// Loop through all entries.
				for (const entry of all) {
					// Loop through each of the collections this entry is a part of.
					for (const [name, values] of Object.entries(entry.data.collections)) {
						// If collections was left blank / unpecified by the user, or the name of this collection is in the user's list of collections...
						if (!schema.collections || schema.collections.includes(name)) {
							// Loop through each of the collection items.
							for (const value of values as any[]) {
								// And if we don't already have the same item in our items list (compare input paths), add it.
								if (!items.some((item) => item.inputPath === value.inputPath)) {
									items.push(value);
								}
							}
						}
					}
				}

				// Now, loop through the items that we have narrowed down to be applicable here.
				for (const item of items) {
					const { data } = await item.template.read();

					// Safely parse the front matter with the user's schema.
					const result = validators[options.validator].parse(
						schema.schema,
						data,
					);

					if (!result.success) {
						foundIssues = true;
						for (const issue of result.error.issues) {
							log.error(
								`${item.inputPath}: ${validators[options.validator].format(
									issue,
								)}`,
							);
						}
					}
				}
			}

			// Throw an error if there was at least one issue.
			if (foundIssues)
				throw new PluginError(`Invalid frontmatter data provided`);

			// Return dummy array so Eleventy doesn't complain.
			return [];
		},
	);
}
