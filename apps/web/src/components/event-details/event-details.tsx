'use client';

import {
	Button,
	Typography,
	Flex,
	Tabs,
	TabList,
	Tab,
	TabPanel,
	Separator,
	Badge,
} from '@noria/ui';
import { Calendar, Clock, MapPin, Copy, CheckCircle } from 'lucide-react';
import { AddToCalendar } from './add-to-calendar';
import { EventWithRSVPs } from '@/actions/dashboard';
import { formatEventDateOnly, formatTimeOnly } from '@/utils/date';
import { useState, useTransition } from 'react';
import { upsertRsvp } from '@/actions/rsvp';
import './event-details.css';

export const EventDetails = ({ event }: { event: EventWithRSVPs }) => {
	const [copied, setCopied] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleCopy = () => {
		navigator.clipboard.writeText(`${window.location.origin}/events/${event.id}`);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleRSVP = (status: 'Going' | 'Maybe' | 'Not Going') => {
		startTransition(async () => {
			await upsertRsvp(event.id, status);
		});
	};

	const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;

	return (
		<Flex direction="column" p="lg" gap="md" style={{ background: 'var(--background)' }}>
			<Typography variant="h1">{event.title}</Typography>

			<Tabs>
				<TabList aria-label="Event details and attendees">
					<Tab id="info">Info</Tab>
					<Tab id="interested">{event.goingCount + event.maybeCount} Interested</Tab>
				</TabList>

				<TabPanel id="info">
					<Flex direction="column" gap="md">
						<Flex direction="column" gap="xs">
							<Flex align="center" gap="sm">
								<Calendar size={18} />
								<Typography variant="body">{formatEventDateOnly(event.start_datetime)}</Typography>
							</Flex>
							<Flex align="center" gap="sm">
								<Clock size={18} />
								<Typography variant="body">{formatTimeOnly(event.start_datetime)}</Typography>
							</Flex>
							<Flex align="center" gap="sm">
								<MapPin size={18} />
								<Typography variant="body">
									<a
										href={mapUrl}
										target="_blank"
										rel="noopener noreferrer"
										style={{ textDecoration: 'underline', color: 'inherit' }}
									>
										{event.location}
									</a>
								</Typography>
							</Flex>
						</Flex>

						{event.description && (
							<Typography variant="body" mt="sm">
								{event.description}
							</Typography>
						)}
					</Flex>
				</TabPanel>
				<TabPanel id="interested">
					<Flex gap="xs" wrap>
						<Badge variant="success">{event.goingCount} Going</Badge>
						<Badge variant="warning">{event.maybeCount} Maybe</Badge>
						<Badge variant="danger">{event.notGoingCount} Can&apos;t Make It</Badge>
					</Flex>
				</TabPanel>
			</Tabs>
			<Separator />
			<Flex gap="sm" direction="column">
				<Button variant="primary" onPress={() => handleRSVP('Going')} isDisabled={isPending}>
					Going
				</Button>
				<Button variant="secondary" onPress={() => handleRSVP('Maybe')} isDisabled={isPending}>
					Maybe
				</Button>
				<Button variant="danger" onPress={() => handleRSVP('Not Going')} isDisabled={isPending}>
					Can&apos;t Make It
				</Button>
			</Flex>

			<Separator />

			<Flex gap="sm" wrap justify="end" className="noria-event-actions">
				<Button variant="secondary" onPress={handleCopy} icon={copied ? <CheckCircle /> : <Copy />}>
					{copied ? 'Copied!' : 'Copy Invite Link'}
				</Button>
				<AddToCalendar event={event} />
			</Flex>
		</Flex>
	);
};
