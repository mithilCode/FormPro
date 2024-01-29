import { z } from 'zod';

import { Email } from '@utils/models/Commons';

// add your validation requirements 👿
const BasicSchema = z.object({
	CardName: z
		.string({ required_error: 'Name is required' })
		.min(1, 'Name is required')
		.min(8, 'Name must be more than 8 characters')
		.max(32, 'Name must be less than 32 characters'),
	CardNumber: z
		.number({ required_error: 'Card Number is required' })
		.min(8, { message: 'Card Number must be atleast 8 characters' }),
	// .regex(
	// 	/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
	// 	'Password must contain at least 8 characters, one uppercase, one number and one special case character'
	// ),
	Expiry: z.coerce
		.date()
		.refine(data => data < new Date(), { message: 'Start date must be in the past' }),
	CVV: z
		.number({ required_error: 'CVV is required' })
		.min(1, { message: 'CVV must be atleast 3 characters' }),
	SecurityCode: z
		.string({ required_error: 'Security Code is required' })
		.min(8, { message: 'Security Code must be atleast 8 characters' })
		.max(8, { message: 'Security Code must be atleast 8 characters' })
		.regex(
			/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
			'Password must contain at least 8 characters, one uppercase, one number and one special case character'
		),
	Type: z.enum(['Master Card', 'Visa'])
});

export const FormSchema = BasicSchema.extend({
	Email
});

export type IFormInput = z.infer<typeof FormSchema>;

// add your validation requirements 👿
// export const FormSchema = z.object({
// 	Name: z
// 		.string({ required_error: 'Name is required' })
// 		.min(1, 'Name is required')
// 		.min(8, 'Name must be more than 8 characters')
// 		.max(32, 'Name must be less than 32 characters'),
// 	Number: z
// 		.string({ required_error: 'Number is required' })
// 		.min(8, { message: 'Number must be atleast 8 characters' })
// 		.regex(
// 			/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
// 			'Password must contain at least 8 characters, one uppercase, one number and one special case character'
// 		),
// 	Email: z
// 		.string({ required_error: 'Email is required' })
// 		.min(1, { message: 'Email is required' })
// 		.email({
// 			message: 'Must be a valid email'
// 		}),
// 	Expiry: z.coerce
// 		.date()
// 		.refine(data => data < new Date(), { message: 'Start date must be in the past' }),
// 	CVV: z
// 		.number({ required_error: 'CVV is required' })
// 		.min(1, { message: 'CVV must be atleast 3 characters' })
// 		.max(3, { message: 'CVV must be atleast 3 characters' }),
// 	SecurityCode: z
// 		.string({ required_error: 'Security Code is required' })
// 		.min(8, { message: 'Security Code must be atleast 8 characters' })
// 		.regex(
// 			/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
// 			'Password must contain at least 8 characters, one uppercase, one number and one special case character'
// 		),
// 	Type: z.enum(['Salmon', 'Tuna', 'Trout']),
// 	basic: z.any()
// });

// export type IFormInput = z.infer<typeof FormSchema>;
