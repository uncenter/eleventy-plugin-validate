import type { ZodIssue, ZodSchema } from 'zod';

import { zod } from './zod';

export const validators = {
	zod: zod,
};

export type ValidatorSchema = ZodSchema;
export type ValidatorIssue = ZodIssue;
export type Validator = keyof typeof validators;
