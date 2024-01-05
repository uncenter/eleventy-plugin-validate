import type { Options } from './options';
import type { ZodIssue } from 'zod';

import { mergeOptions, validateOptions } from './options';
import { log } from './utils';

export { z as zod } from 'zod';

const DUMMY_COLLECTION_NAME = '__eleventy-plugin-validate';

export function plugin(eleventyConfig: any, opts: Options) {
	if (opts === null || typeof opts !== 'object')
		throw new Error(`options: expected an object but received ${typeof opts}`);
	const options = mergeOptions(opts);
	validateOptions(options);

	eleventyConfig.addCollection(
		DUMMY_COLLECTION_NAME,
		async (collectionApi: any) => {
			const issues: {
				data: {
					path: string;
					data: Record<string, unknown>;
				};
				issue: ZodIssue;
			}[] = [];

			// Get a list of every collection item.
			const all = collectionApi.getAll() as any[];
			if (all.length === 0) return [];

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
					// Use a hack to get *just* the front matter data, nothing else (allos for usage of .strict() on Zod schemas).
					const fm = item.template._frontMatter.data;
					// Safely parse the front matter with the user's schema.
					const result = schema.schema.safeParse(fm);

					if (!result.success) {
						issues.push(
							// Add the issues to a list, maing sure to add context to each about the item/data it came with.
							...result.error.issues.map((i) => {
								return {
									data: {
										path: item.inputPath,
										data: fm,
									},
									issue: i,
								};
							}),
						);
					}
				}
			}

			// Now that we have gone through all of the user defined schemas and gathered any issues, loop through them.
			for (const { data, issue } of issues) {
				// Lots of formatting...
				let message = '';
				let path = issue.path.join('.');
				path = path ? path + ': ' : '';
				switch (issue.code) {
					case 'invalid_type': {
						message = `${path}expected a${
							[...'aeiouy'].includes(issue.expected.at(0) as string) ? 'n' : ''
						} ${issue.expected} but received ${issue.received}`;
						break;
					}
					case 'unrecognized_keys': {
						message = `${path}unknown key${
							issue.keys.length > 1 ? 's' : ''
						} ${issue.keys.map((x: any) => `"${x}"`).join(', ')}`;
						break;
					}
					default: {
						throw new Error(
							`Unknown or unimplemented Zod issue code: ${issue.code}`,
						);
					}
				}
				log.error(`[${data.path}] ${message}`);
			}

			// Throw an error if there was at least one issue.
			if (issues.length > 0) {
				throw new Error(`Invalid frontmatter data provided`);
			}

			// Return dummy array so Eleventy doesn't complain
			return [];
		},
	);
}
