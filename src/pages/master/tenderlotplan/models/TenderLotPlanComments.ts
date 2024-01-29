import { z } from 'zod';

export const FormSchema = z.object({
	arr: z.array(
		z.object({
			emp: z.object({ name: z.string().min(1, '') }),
			assort_type: z.object({ name: z.string().min(1, '') })
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
