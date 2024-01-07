import type { ZodSchema } from 'zod';

import extend from 'just-extend';
import { z } from 'zod';

import { PluginError } from './error';
import { log } from './utils';
import { validators } from './validators';

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

export const defaultOptions: Partial<Options> = {
    validator: 'zod',
    schemas: []
};

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
		for (const issue of result.error.issues) {
			log.error(validators['zod'].format(issue));
		}
		throw new PluginError('Invalid options provided');
	}

	return true;
}
