import type { Options } from './options';
import type { ZodIssue } from 'zod';

import { mergeOptions, validateOptions } from './options';
import { log } from './utils';

export { z as zod } from 'zod';

export function plugin(eleventyConfig: any, opts: Options) {
	if (opts === null || typeof opts !== 'object')
		throw new Error(`options: expected an object but received ${typeof opts}`);
	const options = mergeOptions(opts);
	validateOptions(options);

	eleventyConfig.addCollection(
		'__eleventy-plugin-validate',
		async (collectionApi: any) => {
			const issues: {
				data: {
					path: string;
					data: Record<string, unknown>;
				};
				issue: ZodIssue;
			}[] = [];
			for (const schema of options.schemas) {
				const items = schema.collections
					? collectionApi.getFilteredByTags(...schema.collections)
					: collectionApi.getAll();

				for (const item of items) {
					const { data: fm } = item.template._frontMatter;
					const result = schema.schema.safeParse(fm);

					if (!result.success) {
						issues.push(
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

			for (const { data, issue } of issues) {
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
			if (issues.length > 0)
				throw new Error(`Invalid frontmatter data provided`);

			return [];
		},
	);
}
