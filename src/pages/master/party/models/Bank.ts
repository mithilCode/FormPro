import { z } from 'zod';

export const FormSchema = z.object({
	arr: z.array(
		z.object({
			bank_name: z.string().optional()
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
