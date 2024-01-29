import { z } from 'zod';

export const FormSchema = z.object({
	// name_mas: z.object({
	// 	name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
	// 	leave_date: z.any().optional()
	// })
	name_address: z.array(
		z.object({
			address_1: z.any().optional(),
			phone_no_1: z.any().optional()
		})
	)
	// name_contact: z.object({
	// 	name: z.string({ required_error: 'Address is required' }).min(1, 'Address is required')
	// }),
	// name_bank: z.object({
	// 	bank_name: z.string({ required_error: 'Address is required' }).min(1, 'Address is required')
	// }),
	// name_proc: z.object({
	// 	group_name: z
	// 		.string({ required_error: 'Address is required' })
	// 		.min(1, 'Address is required')
	// })
	// )
});

export type IFormInput = z.infer<typeof FormSchema>;
