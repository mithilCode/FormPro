import { z } from 'zod';

export const FormSchema = z.object({
	inv_mas: z.object({
		seq_no: z.coerce.number(),
		from: z.object({}),
		invoice_no: z.string(),
		join_date: z.any().optional()
	})
});

export type IFormInput = z.infer<typeof FormSchema>;
