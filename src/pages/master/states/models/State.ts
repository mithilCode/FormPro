import { z } from 'zod';

import { Country } from '@utils/models/Commons';

// add your validation requirements 👿
export const BasicSchema  = z.object({
	name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
	short_name: z.string({ required_error: 'Short Name is required' }).min(1, 'Short Name is required'),
	code: z.string({ required_error: 'code is required' }).min(1, 'Code is required'),
	sort_no: z.coerce.number({ required_error: 'sort No. is required' }).min(1, 'Sort No. is required')
});

export const FormSchema = BasicSchema.extend({
	country: Country
});

export type IFormInput = z.infer<typeof FormSchema>;
