import type { Validator, ValidatorSchema } from './validators';

import extend from 'just-extend';
import { z } from 'zod';

import { PluginError } from './error';
import { log } from './utils';
import { validators } from './validators';

// Borrowed workaround for using the keys of an object as a Zod enum: https://github.com/colinhacks/zod/discussions/839#discussioncomment-10651593.
function zObjectKeys<T extends Record<string, any>>(obj: T) {
	const keys = Object.keys(obj) as Extract<keyof T, string>[];
	return z.enum(
		keys as [Extract<keyof T, string>, ...Extract<keyof T, string>[]],
	);
}

export const OptionsSchema = z.object({
	validator: zObjectKeys(validators),
	schemas: z.array(
		z.object({
			collections: z.optional(z.array(z.string())),
			schema: z.any(),
		}),
	),
});

export type Options = {
	validator: Validator;
	schemas: {
		collections?: string[];
		schema: ValidatorSchema;
	}[];
};

export const defaultOptions: Partial<Options> = {
	validator: 'zod',
	schemas: [],
};

/**
 *
 * @param options Options to merge with the default options.
 * @returns Merged options object.
 */
export function mergeOptions(options: Partial<Options>): Options {
	return extend(true, defaultOptions, options) as Options;
}

export function validateOptions(options: unknown): options is Options {
	const result = OptionsSchema.safeParse(options);
	if (!result.success) {
		for (const issue of result.error.issues) {
			log.error(validators.zod.format(issue));
		}
		throw new PluginError('Invalid options provided');
	}

	return true;
}
