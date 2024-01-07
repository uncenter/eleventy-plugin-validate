import type { ZodIssue, ZodSchema } from 'zod';

import { aOrAn, pluralize } from '../utils';

export const zod = {
	parse: function (schema: ZodSchema, data: unknown) {
		return schema.safeParse(data);
	},
	format: function (issue: ZodIssue) {
		let message = '';
		const property = issue.path.join('.');

		switch (issue.code) {
			case 'invalid_type': {
				message = `expected ${aOrAn(issue.expected.at(0) as string)} ${
					issue.expected
				} but received ${issue.received}`;
				break;
			}
			case 'unrecognized_keys': {
				message = `unknown ${pluralize('key', issue.keys.length)} ${issue.keys
					.map((x: any) => `"${x}"`)
					.join(', ')}`;
				break;
			}
			case 'invalid_string': {
				message = `invalid ${issue.validation}`;
				break;
			}
			case 'too_small': {
				const items = {
					string: 'character',
					set: 'item',
					array: 'item',
					number: undefined,
					bigint: undefined,
				}[issue.type as Omit<typeof issue.type, 'date'> as string];

				message =
					issue.type === 'date'
						? `${issue.type} must be ${
								issue.inclusive ? 'greater than or equal to' : 'greater than'
							} ${new Date(issue.minimum as any).toISOString()}`
						: `${issue.type} must contain ${
								issue.inclusive ? 'at most' : 'less than'
							} ${issue.minimum}${
								items === undefined
									? ''
									: ' ' + pluralize(items, issue.minimum as number)
							}`;

				break;
			}
			case 'too_big': {
				const items = {
					string: 'character',
					set: 'item',
					array: 'item',
					number: undefined,
					bigint: undefined,
				}[issue.type as Omit<typeof issue.type, 'date'> as string];

				message =
					issue.type === 'date'
						? `${issue.type} must be ${
								issue.inclusive ? 'less than or equal to' : 'less than'
							} ${new Date(issue.maximum as any).toISOString()}`
						: `${issue.type} must contain ${
								issue.inclusive ? 'at most' : 'less than'
							} ${issue.maximum}${
								items === undefined
									? ''
									: ' ' + pluralize(items, issue.maximum as number)
							}`;

				break;
			}
			default: {
				throw new Error(
					`Unknown or unimplemented Zod issue code: ${issue.code}`,
				);
			}
		}
		return `${property ? property + ': ' : ''}${message} (zod_${issue.code})`;
	},
};
