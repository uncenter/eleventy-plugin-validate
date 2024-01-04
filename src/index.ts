import type { Options } from './options';
import type { ZodSchema } from 'zod';

import extend from 'just-extend';

import { mergeOptions, validateOptions } from './options';
import { log } from './utils';

const GLOBAL_DATA_KEY = '__eleventy-plugin-validate_options';

export { z as zod } from 'zod';

export function plugin(eleventyConfig: any, opts: Options) {
	if (opts === null || typeof opts !== 'object')
		throw new Error(`options: expected an object but received ${typeof opts}`);
	const options = mergeOptions(opts);
	validateOptions(options);

	eleventyConfig.addGlobalData(GLOBAL_DATA_KEY, options);
}

export function addValidations(exports: Record<never, never>) {
	return extend(
		true,
		{
			eleventyComputed: {
				__validate: (data: any) => {
					runValidations(data);
				},
			},
		},
		exports,
	);
}

function runValidations(data: any) {
	const options = data[GLOBAL_DATA_KEY] as Options;

	for (const schema of options.schemas) {
		const result = (schema.schema as unknown as ZodSchema).safeParse(data);
		if (!result.success) {
			const issues = result.error.issues;
			for (const issue of issues) {
				let message = '';
				switch (issue.code) {
					case 'invalid_type': {
						message = `${issue.path.join('.')}: expected a${
							[...'aeiouy'].includes(issue.expected.at(0) as string) ? 'n' : ''
						} ${issue.expected} but received ${issue.received}`;
						break;
					}
					case 'unrecognized_keys': {
						message = `${issue.path.join('.')}: unknown key${
							issue.keys.length > 1 ? 's' : ''
						} ${issue.keys.map((x: any) => `"${x}"`).join(', ')}`;
						break;
					}
					default: {
						throw new Error(`Unknown Zod issue code: ${issue.code}`);
					}
				}
				log.warn(`[${data.page.filePathStem}] ${message}`);
			}
			throw new Error(
				`Invalid frontmatter data provided for ${data.page.filePathStem}`,
			);
		}
	}
}
