import { z } from 'zod';

export const FormSchema = z.object({
	arr: z.array(
		z.object({
			name: z.string().optional()
		})
	)
});

export const FormSchemaDepartment = z.object({
	arr: z.array(
		z.object({
			name_seq: z.any().optional()
		})
	)
});

export type IFormInput = z.infer<typeof FormSchema>;
export type IFormInputDepartment = z.infer<typeof FormSchemaDepartment>;
