import { z } from 'zod';

export const FormSchema = z.object({
	arr: z.array(
		z.object({
			shape: z.object({ name: z.string() }),
			pol_pcs: z.coerce.number({ required_error: '' }),
			pol_size: z.coerce.number({ required_error: '' }),
			fls_1: z.object({ name: z.string() }),
			prop: z.object({ name: z.string() })
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
