import { z } from 'zod';

export const FormSchema = z.object({
	arr: z.array(
		z.object({
			plan_no: z.coerce.number({ required_error: '' }),
			pol_pcs: z.coerce.number({ required_error: '' }),
			pol_size: z.coerce.number({ required_error: '' }),
			shape: z.object({ name: z.string().min(1, '') }),
			color: z.object({ name: z.string().min(1, '') }),
			purity: z.object({ name: z.string().min(1, '') }),
			cut: z.object({ name: z.string().min(1, '') }),
			polish: z.object({ name: z.string().min(1, '') }),
			symm: z.object({ name: z.string().min(1, '') }),
			fls: z.object({ name: z.string().min(1, '') })

			// shape: z.object({ seq_no: z.number().min(1, '') }),
			// color: z.object({ seq_no: z.number().min(1, '') }),
			// purity: z.object({ seq_no: z.number().min(1, '') }),
			// cut: z.object({ seq_no: z.number().min(1, '') }),
			// polish: z.object({ seq_no: z.number().min(1, '') }),
			// symm: z.object({ seq_no: z.number().min(1, '') }),
			// fls: z.object({ seq_no: z.number().min(1, '') })
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
