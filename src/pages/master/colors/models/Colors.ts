import { z } from 'zod';

export const FormSchema = z.object({
	arr: z.array(
		z.object({
			name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
			sort_no: z.coerce
				.number({
					required_error: 'Sort No is required',
					invalid_type_error: 'Sort No. must be a number'
				})
				.min(1, 'Sort No is required')
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
