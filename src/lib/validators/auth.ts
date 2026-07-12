import { z } from 'zod';

export const LoginSchema = z.object({
  identifier: z
    .string({ required_error: 'User ID or email is required' })
    .min(1, 'User ID or email is required')
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof LoginSchema>;
