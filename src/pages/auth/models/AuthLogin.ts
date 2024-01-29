import { z } from 'zod';

// add your validation requirements 👿
export const FormSchema = z.object({
	userName: z
		.string({ required_error: 'Username is required' })
		.min(1, { message: 'Email is required' }),
		// .email({
		// 	message: 'Must be a valid email'
		// }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(1, 'Password is required'),
		// .min(8, 'Password must be more than 8 characters')
		// .max(32, 'Password must be less than 32 characters'),
	persistUser: z.literal(true).optional()
});

export type IFormInput = z.infer<typeof FormSchema>;
