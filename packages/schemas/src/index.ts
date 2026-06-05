import { z } from 'zod';

export const RsvpStatusSchema = z.enum(['Going', 'Maybe', 'Not Going']);
export type RsvpStatus = z.infer<typeof RsvpStatusSchema>;
