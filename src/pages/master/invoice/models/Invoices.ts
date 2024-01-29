import { z } from 'zod';

export const FormSchema = z.object({
	inv_mas: z.object({
		name: z.string()
		// leave_date: z.any().optional(),
		// join_date: z.any().optional()
	})
	// name_document: z.object({
	// 	kyc_verify_date: z.any().optional(),
	// 	kyc_expiry_date: z.any().optional()
	// })
});

export type IFormInput = z.infer<typeof FormSchema>;
