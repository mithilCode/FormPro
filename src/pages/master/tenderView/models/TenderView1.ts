import { z } from 'zod';

export const FormSchema = z.object({
	arr: z.array(
		z.object({
			pcs: z.any().optional()
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
