import { z } from 'zod';

export const FormSchema = z.object({
	name_info: z.object({
		first_name: z
			.string({ required_error: 'First name is required' })
			.min(1, 'First name is required'),
		blood_group: z.any().optional(),
		date_of_birth: z.any().optional()
	}),
	name_mas: z.object({
		name: z.string({ required_error: 'Name is required' }).min(1, 'First name is required'),

		leave_date: z.any().optional(),
		join_date: z.any().optional()
	}),
	name_document: z.object({
		// aadhar_no: z
		// 	.number({ required_error: 'Aadhar number is required' })
		// 	.min(1, 'Aadhar number is required'),
		passport_expiry_date: z.any().optional(),
		kyc_expiry_date: z.any().optional(),
		kyc_verify_date: z.any().optional()
	})
});

export type IFormInput = z.infer<typeof FormSchema>;
