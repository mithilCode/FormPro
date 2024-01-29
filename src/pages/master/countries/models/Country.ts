import { z } from 'zod';

// add your validation requirements 👿
export const FormSchema = z.object({
	name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
	short_name: z.string({ required_error: 'Short Name is required' }).min(1, 'Short Name is required'),
	code: z.string({ required_error: 'code is required' }).min(1, 'Code is required'),
	sort_no: z.coerce.number({ required_error: 'sort No. is required' }).min(1, 'Sort No. is required')
});

export type IFormInput = z.infer<typeof FormSchema>;
