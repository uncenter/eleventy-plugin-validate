import type { Options } from './options';

import { mergeOptions, validateOptions } from './options';

export default function (eleventyConfig: any, opts: Options) {
	if (opts === null || typeof opts !== 'object')
		throw new Error(`options: expected an object but received ${typeof opts}`);
	const options = mergeOptions(opts);
	validateOptions(options);

	console.log({ options });
}
