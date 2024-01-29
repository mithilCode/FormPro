import { z } from 'zod';

export const FormSchema = z.object({
	arr: z.array(
		z.object({
			company_name: z.string().optional()
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
