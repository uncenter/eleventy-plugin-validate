import type { ZodSchema } from 'zod';

import extend from 'just-extend';
import { z } from 'zod';

import { PluginError } from './error';
import { log } from './utils';

export const OptionsSchema = z.object({
	schemas: z.array(
		z.object({
			collections: z.optional(z.array(z.string())),
			schema: z.any(),
		}),
	),
});

export type Options = {
	validator: 'zod';
	schemas: {
		collections?: string[];
		schema: ZodSchema;
	}[];
};

export const defaultOptions: Partial<Options> = {};

/**
 *
 * @param options Options to merge with the default options.
 * @returns Merged options object.
 */
export function mergeOptions(options: Partial<Options>): Options {
	return extend(true, defaultOptions, options) as Options;
}

export function validateOptions(options: Options): options is Options {
	const result = OptionsSchema.safeParse(options);
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
					} ${issue.keys.map((x) => `"${x}"`).join(', ')}`;
					break;
				}
				default: {
					throw new Error(`Unknown Zod issue code: ${issue.code}`);
				}
			}
			log.error(message);
		}
		throw new PluginError('Invalid options provided');
	}

	return true;
}
