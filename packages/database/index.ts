export * from './types';
export * from './occurrences';
import type { Tables } from './types';

export type Attendees = Tables<'attendees'>;
export type Events = Tables<'events'>;

