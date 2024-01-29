import { z } from 'zod';

import { Country, DOB, Email, FirstName, LastName, Password } from '@utils/models/Commons';

// add your validation requirements 👿
const BasicSchema = z.object({
	//Company: z.string().optional(),
	Company: z.number({ required_error: 'Company is required' }),
	idOrganisation: z.string({ required_error: 'Organisation is required' })
});

export const FormSchema = BasicSchema.extend({
	Country,
	DOB,
	Email,
	FirstName,
	LastName,
	Password
});

export type IFormInput = z.infer<typeof FormSchema>;

// // add your validation requirements 👿
// export const FormSchema = z.object({
// 	FirstName: z
// 		.string({ required_error: 'FirstName is required' })
// 		.min(1, { message: 'FirstName is required' })
// 		.max(32, 'FirsName must be less than 32 characters'),
// 	LastName: z
// 		.string({ required_error: 'LastName is required' })
// 		.min(1, { message: 'LastName is required' })
// 		.max(32, 'LastName must be less than 32 characters'),
// 	Company: z.string().optional(),
// 	idOrganisation: z.string({ required_error: 'Organisation is required' }),
// 	Country: z
// 		.object({
// 			idCountry: z.string({ required_error: 'Country is required' }),
// 			Name: z.string().nullable().optional(),
// 			Code: z.string().nullable().optional()
// 		})
// 		.nullable()
// 		.default(null),
// 	// z.string({ required_error: 'Country is required' }).optional(),
// 	DOB: z.coerce
// 		.date()
// 		.refine(data => data < new Date(), { message: 'Start date must be in the past' }),
// 	// idCountry: z.string({ required_error: 'Country is required' }).optional(),
// 	Email: z
// 		.string({ required_error: 'Email is required' })
// 		.min(1, { message: 'Email is required' })
// 		.email({
// 			message: 'Must be a valid email'
// 		}),
// 	Password: z
// 		.string({ required_error: 'Password is required' })
// 		.min(1, 'Password is required')
// 		.min(8, 'Password must be more than 8 characters')
// 		.max(32, 'Password must be less than 32 characters')
// });
