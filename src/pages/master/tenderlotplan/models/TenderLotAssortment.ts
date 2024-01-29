import { z } from 'zod';

export const FormSchema = z.object({
	arr: z.array(
		z.object({
			// pcs: z.coerce.number({ required_error: '' }),
			// wgt: z.coerce.number({ required_error: '' })
			pcs: z.number(),
			wgt: z.number()
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
