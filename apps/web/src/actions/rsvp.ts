'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export const upsertRsvp = async (eventId: string, status: 'Going' | 'Maybe' | 'Not Going') => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error('Unauthorized');
	}

	const { error } = await supabase
		.from('attendees')
		.upsert(
			{
				event_id: eventId,
				user_id: user.id,
				guest_name: user.email || 'Unknown',
				rsvp_status: status,
			},
			{ onConflict: 'event_id,user_id' },
		);

	if (error) {
		console.error('Failed to RSVP:', error);
		throw new Error('Failed to RSVP');
	}

	revalidatePath(`/events/${eventId}`);
	revalidatePath('/');
};
