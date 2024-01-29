import { z } from 'zod';

export const FormSchema = z.object({
	arr: z.array(
		z.object({
			join_date: z.string().optional()
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
