import { z } from 'zod';

export const FormSchema = z.object({
	arr: z.array(
		z.object({
			invoice_no: z.any().optional()
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
