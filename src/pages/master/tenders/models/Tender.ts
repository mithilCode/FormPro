import { z } from 'zod';

const tenderValidator = z.string().refine(value => {
	return value === 'AUCTION' || value === 'TENDER';
});

// add your validation requirements 👿
export const FormSchema = z.object({
	supplier: z.object({}).or(z.string()),
	tender_no: z.string().optional(),
	tender_type: tenderValidator
});

export type IFormInput = z.infer<typeof FormSchema>;
