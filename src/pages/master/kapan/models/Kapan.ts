import { z } from 'zod';

export const FormSchema = z.object({
	kapan_mas: z.object({
		premfg_end_date: z.any().optional(),
		mfg_end_date: z.any().optional(),
		close_date: z.any().optional(),
		trans_date: z.any().optional(),
		invoice_no: z.object({})
	})
});

export type IFormInput = z.infer<typeof FormSchema>;
