import { z } from 'zod';

export const FormSchema = z.object({
	name_address: z.array(
		z.object({
			address_1: z.any().optional(),
			passport_expiry_date: z.any().optional()
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
