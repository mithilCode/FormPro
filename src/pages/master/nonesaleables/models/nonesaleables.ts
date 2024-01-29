import { z } from 'zod';

export const FormSchema = z.object({
	arr: z.array(
		z.object({
			from_wgt: z.any({ required_error: 'Wgt is required' })
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
