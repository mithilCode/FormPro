import { z } from 'zod';

export const FormSchema = z.object({
	arr: z.array(
		z.object({
			visa_type: z.string().optional()
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
