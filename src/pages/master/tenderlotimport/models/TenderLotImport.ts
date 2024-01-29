import { z } from 'zod';
export const FormSchema = z.object({
	arr: z.array(
		z.object({
			tender_no: z.string().optional(),
			trans_date: z.any().optional()
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
