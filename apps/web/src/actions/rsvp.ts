'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { RsvpStatus } from '@noria/schemas';

export const upsertRsvp = async (eventId: string, status: RsvpStatus) => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const cookieStore = await cookies();
	const guestCookieKey = `noria_guest_rsvp_${eventId}`;

	let error;

	if (user) {
		const { error: upsertError } = await supabase
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
		error = upsertError;
	} else {
		const existingAttendeeId = cookieStore.get(guestCookieKey)?.value;

		if (existingAttendeeId) {
			const { error: updateError } = await supabase
				.from('attendees')
				.update({ rsvp_status: status })
				.eq('id', existingAttendeeId)
				.eq('event_id', eventId);
			
			error = updateError;
		} else {
			const { data: newAttendee, error: insertError } = await supabase
				.from('attendees')
				.insert({
					event_id: eventId,
					guest_name: 'Guest',
					rsvp_status: status,
				})
				.select('id')
				.single();

			error = insertError;
			
			if (newAttendee) {
				cookieStore.set(guestCookieKey, newAttendee.id, {
					path: '/',
					maxAge: 60 * 60 * 24 * 365,
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
				});
			}
		}
	}

	if (error) {
		console.error('Failed to RSVP:', error);
		throw new Error('Failed to RSVP');
	}

	revalidatePath(`/events/${eventId}`);
	revalidatePath('/');
};
