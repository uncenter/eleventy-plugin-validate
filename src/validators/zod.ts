import type { ZodIssue, ZodSchema } from 'zod';

export const zod = {
	parse: function (schema: ZodSchema, data: unknown) {
		return schema.safeParse(data);
	},
	format: function (issue: ZodIssue) {
		const property = issue.path.join('.');
		return `${property ? property + ': ' : ''}${issue.message} (zod_${issue.code})`;
	},
};
