import { string, z } from 'zod';
export const FormSchema = z.object({
	arr: z.array(
		z.object({
			disc_per: z.string({ required_error: 'Disc is required' }).min(1, 'Disc is required')
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
