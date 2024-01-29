import { z } from 'zod';

import { Email } from '@utils/models/Commons';

// add your validation requirements 👿
export const FormSchema = z.object({
	Email
});

export type IFormInput = z.infer<typeof FormSchema>;
