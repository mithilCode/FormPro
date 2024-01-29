import { z } from 'zod';

export const FormSchema = z.object({
	tender_no: z.object({}).or(z.string()),
	attendee_1: z.object({}).nullable().optional(),
	attendee_2: z.object({}).nullable().optional(),
	attendee_3: z.object({}).nullable().optional(),
	attendee_4: z.object({}).nullable().optional()
	// attendee_2: z.object({}).optional()
});

export type IFormInput = z.infer<typeof FormSchema>;
