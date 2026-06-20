declare const process: any;

import { createClient } from '@supabase/supabase-js';
import { type Database } from './types';
import { generateOccurrences } from './occurrences';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
	console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required.');
	process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
	},
});

async function maintainHorizon() {
	console.log('Starting scheduled maintenance of recurring event horizons...');

	const { data: anchors, error: anchorError } = await supabase
		.from('events')
		.select('*')
		.neq('frequency', 'not repeat')
		.is('parent_event_id', null);

	if (anchorError || !anchors) {
		console.error('Error fetching parent events:', anchorError);
		process.exit(1);
	}

	const activeAnchors = anchors || [];
	console.log(`Found ${activeAnchors.length} active recurring event series.`);

	const now = new Date();
	const horizonDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

	for (const anchor of activeAnchors) {
		console.log(`Checking series: "${anchor.title}" (${anchor.id})`);

		if (!anchor.recurrence_group_id) {
			console.warn(`Anchor event ${anchor.id} is missing recurrence_group_id. Skipping.`);
			continue;
		}

		// Fetch the latest instance in this series
		const { data: instances, error: instanceError } = await supabase
			.from('events')
			.select('start_datetime')
			.eq('recurrence_group_id', anchor.recurrence_group_id)
			.order('start_datetime', { ascending: false })
			.limit(1);

		if (instanceError) {
			console.error(`Error fetching instances for group ${anchor.recurrence_group_id}:`, instanceError);
			continue;
		}

		const latestInstanceDate = instances && instances.length > 0
			? new Date(instances[0].start_datetime)
			: new Date(anchor.start_datetime);

		if (latestInstanceDate < horizonDate) {
			console.log(`Latest instance date ${latestInstanceDate.toISOString()} is before horizon ${horizonDate.toISOString()}. Generating new instances...`);

			const newOccurrences = generateOccurrences(latestInstanceDate, anchor.frequency, horizonDate);
			if (newOccurrences.length > 0) {
				const batchData = newOccurrences.map(occ => ({
					title: anchor.title,
					description: anchor.description,
					location: anchor.location,
					start_datetime: occ.toISOString(),
					duration: anchor.duration,
					frequency: anchor.frequency,
					organizer_id: anchor.organizer_id,
					parent_event_id: anchor.id,
					recurrence_group_id: anchor.recurrence_group_id,
				}));

				const { error: insertError } = await supabase
					.from('events')
					.insert(batchData);

				if (insertError) {
					console.error(`Failed to insert new instances for series ${anchor.id}:`, insertError);
				} else {
					console.log(`Successfully generated and inserted ${newOccurrences.length} new occurrences for series "${anchor.title}".`);
				}
			} else {
				console.log(`No new occurrences generated for series "${anchor.title}".`);
			}
		} else {
			console.log(`Series "${anchor.title}" is up-to-date (latest occurrence: ${latestInstanceDate.toISOString()}).`);
		}
	}

	console.log('Finished maintenance.');
}

maintainHorizon();
