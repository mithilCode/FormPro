import { z } from 'zod';


export const Country = z.object({
	seq_no: z.any({ required_error: 'Country is required' }),
	name: z.string().nullable().optional()
});

export const CountryOptional = z
	.object({
		seq_no: z.string({ required_error: 'Country is required' }),
		name: z.string().nullable().optional(),
		code: z.string().nullable().optional()
	})
	.nullable()
	.default(null);

	export const State = z.object({
		seq_no: z.any({ required_error: 'State is required' }),
		name: z.string().nullable().optional()
	});
	
	export const StateOptional = z
		.object({
			seq_no: z.string({ required_error: 'State is required' }),
			name: z.string().nullable().optional(),
			code: z.string().nullable().optional()
		})
		.nullable()
		.default(null);

export const DOB = z.coerce
	.date()
	.refine(data => data < new Date(), { message: 'Start date must be in the past' });

export const Email = z
	.string({ required_error: 'Email is required' })
	.min(1, { message: 'Email is required' })
	.email({
		message: 'Must be a valid email'
	});

export const FirstName = z
	.string({ required_error: 'FirstName is required' })
	.min(1, { message: 'FirstName is required' })
	.max(32, 'FirsName must be less than 32 characters');

export const LastName = z
	.string({ required_error: 'LastName is required' })
	.min(1, { message: 'LastName is required' })
	.max(32, 'LastName must be less than 32 characters');

export const Password = z
	.string({ required_error: 'Password is required' })
	.min(1, 'Password is required')
	.min(8, 'Password must be more than 8 characters')
	.max(32, 'Password must be less than 32 characters');

// import { z } from 'zod';

// export const BasicUserSchema = z.object({
// 	name: z.string().trim().min(2, { message: 'Name must be 2 or more characters long' }),
// 	username: z
// 		.string()
// 		.trim()
// 		.toLowerCase()
// 		.min(4, { message: 'Username must be 4 or more characters long' }),
// 	email: z.string().email().trim().toLowerCase(),
// 	phone: z.string().min(10, { message: 'Phone numbers are a minimum of 10 digits' }),
// 	// .regex(/^[0-9]+$/, { message: "Only numbers are allowed" })
// 	// .length(10, { message: "Ten numbers are required" })
// 	// .transform(val => `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6)}`),
// 	//website: z.string().trim().toLowerCase().url().optional(),
// 	website: z
// 		.string()
// 		.trim()
// 		.toLowerCase()
// 		.min(5, { message: 'URLs must be a minimum of 5 characters' })
// 		.refine(val => val.indexOf('.') !== -1, { message: 'Invalid URL' })
// 		.optional(),
// 	company: z.object({
// 		name: z
// 			.string()
// 			.trim()
// 			.min(5, { message: 'Company name must be 5 or more characters long' }),
// 		catchPhrase: z.string().optional()
// 	})
// });

// const UserAddressSchema = z.object({
// 	street: z.string().trim().min(5, { message: 'Street must be 5 or more characters long' }),
// 	suite: z.string().trim().optional(),
// 	city: z.string().trim().min(2, { message: 'City must be 2 or more characters long' }),
// 	zipcode: z.string().regex(/^\d{5}(?:[-\s]\d{4})?$/, {
// 		message: 'Must be 5 digit zip. Optional 4 digit extension allowed.'
// 	})
// });

// const UserAddressSchemaWithGeo = UserAddressSchema.extend({
// 	geo: z.object({
// 		lat: z.string(),
// 		lng: z.string()
// 	})
// });

// const HasIDSchema = z.object({ id: z.number().int().positive() });

// export const UserFormSchemaWithAddress = BasicUserSchema.extend({ address: UserAddressSchema });

// export const UserSchemaWithAddress = UserFormSchemaWithAddress.merge(HasIDSchema);

// export const UserSchemaWithGeo = BasicUserSchema.extend({
// 	address: UserAddressSchemaWithGeo
// }).merge(HasIDSchema);

// export type UserFormWithAddress = z.infer<typeof UserFormSchemaWithAddress>;

// export type UserWithAddress = z.infer<typeof UserSchemaWithAddress>;

// export type UserWithGeo = z.infer<typeof UserSchemaWithGeo>;
