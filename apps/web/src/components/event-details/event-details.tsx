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
	Skeleton,
	Link,
	Icon,
} from '@noria/ui';
import { Calendar, Clock, MapPin, Copy, CheckCircle, HelpCircle, XCircle } from 'lucide-react';
import { AddToCalendar } from './add-to-calendar';
import { EventWithRSVPs } from '@/hooks/use-dashboard';
import { formatEventDateOnly, formatTimeOnly } from '@/utils/date';
import { useState, useRef, useEffect } from 'react';
import { EventOrganizerMenu } from './event-organizer-menu';
import { EventRsvpActions } from './event-rsvp-actions';
import { useUser } from '@/hooks/use-auth';
import { RsvpStatus } from '@noria/schemas';
import './event-details.css';

const STATUS_CONFIG: Record<
	RsvpStatus,
	{ icon: typeof CheckCircle; color: 'success' | 'warning' | 'danger' }
> = {
	Going: { icon: CheckCircle, color: 'success' },
	Maybe: { icon: HelpCircle, color: 'warning' },
	'Not Going': { icon: XCircle, color: 'danger' },
};

interface AttendeeListProps {
	attendees: EventWithRSVPs['attendees'];
	show: boolean;
}

const AttendeeList = ({ attendees, show }: AttendeeListProps) => {
	if (!show) return null;

	if (attendees.length === 0) {
		return (
			<Typography variant="body-italic" color="muted">
				No responses yet. Spread the word or be the first to join! ✨
			</Typography>
		);
	}

	return (
		<Flex direction="column" gap="sm" fullWidth>
			{attendees.map((attendee, index) => {
				const statusInfo = STATUS_CONFIG[attendee.rsvp_status];
				return (
					<Flex key={attendee.id || index} justify="space-between" align="center" fullWidth>
						<Flex direction="column" gap="2xs">
							<Typography variant="body">{attendee.guest_name || 'Guest'}</Typography>
							{attendee.guest_name !== attendee.email && (
								<Typography variant="body" color="muted">
									{attendee.email || '—'}
								</Typography>
							)}
						</Flex>
						<Typography color={statusInfo.color}>
							<Icon icon={statusInfo.icon} />
						</Typography>
					</Flex>
				);
			})}
		</Flex>
	);
};

export const EventDetails = ({ event }: { event: EventWithRSVPs }) => {
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const { data: user } = useUser();

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const handleCopy = async () => {
		const url = `${window.location.origin}/events/${event.id}`;
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			timeoutRef.current = setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy invite link', err);
		}
	};

	const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;

	return (
		<Flex direction="column" gap="md" fullWidth>
			<Flex justify="space-between" align="start">
				<Typography variant="h1">{event.title}</Typography>
				<EventOrganizerMenu event={event} />
			</Flex>

			<Tabs>
				<TabList aria-label="Event details and attendees">
					<Tab id="info">Info</Tab>
					<Tab id="interested">{event.goingCount + event.maybeCount} Interested</Tab>
				</TabList>

				<TabPanel id="info">
					<Flex direction="column" gap="md">
						<Flex direction="column" gap="xs">
							<Flex align="center" gap="sm">
								<Icon icon={Calendar} />
								<Typography variant="body">{formatEventDateOnly(event.start_datetime)}</Typography>
							</Flex>
							<Flex align="center" gap="sm">
								<Icon icon={Clock} />
								<Typography variant="body">{formatTimeOnly(event.start_datetime)}</Typography>
							</Flex>
							<Flex align="center" gap="sm">
								<Icon icon={MapPin} />
								<Typography variant="body">
									<Link href={mapUrl} target="_blank" rel="noopener noreferrer">
										{event.location}
									</Link>
								</Typography>
							</Flex>
						</Flex>

						{event.description && <Typography variant="body">{event.description}</Typography>}
					</Flex>
				</TabPanel>
				<TabPanel id="interested">
					<Flex direction="column" gap="md" fullWidth>
						<Flex gap="xs" wrap>
							<Badge variant="success">{event.goingCount} Going</Badge>
							<Badge variant="warning">{event.maybeCount} Maybe</Badge>
							<Badge variant="danger">{event.notGoingCount} Can&apos;t Make It</Badge>
						</Flex>

						<AttendeeList attendees={event.attendees} show={!!user} />
					</Flex>
				</TabPanel>
			</Tabs>

			<Separator />

			<EventRsvpActions event={event} />

			<Separator />

			<Flex gap="sm" wrap justify="end" className="noria-event-actions">
				<Button
					variant="secondary"
					onPress={handleCopy}
					icon={copied ? CheckCircle : Copy}
					aria-label={copied ? 'Invite link copied' : 'Copy invite link'}
				>
					{copied ? 'Copied!' : 'Copy Invite Link'}
				</Button>
				<AddToCalendar event={event} />
			</Flex>
		</Flex>
	);
};

export const EventDetailsSkeleton = () => {
	return (
		<Flex direction="column" p="lg" gap="md">
			<Skeleton width="70%" height="32px" />

			<Flex gap="md" mt="sm">
				<Skeleton width="60px" height="24px" />
				<Skeleton width="100px" height="24px" />
			</Flex>

			<Separator />

			<Flex direction="column" gap="md">
				<Flex direction="column" gap="xs">
					<Flex align="center" gap="sm">
						<Skeleton width="18px" height="18px" borderRadius="50%" />
						<Skeleton width="40%" height="20px" />
					</Flex>
					<Flex align="center" gap="sm">
						<Skeleton width="18px" height="18px" borderRadius="50%" />
						<Skeleton width="30%" height="20px" />
					</Flex>
					<Flex align="center" gap="sm">
						<Skeleton width="18px" height="18px" borderRadius="50%" />
						<Skeleton width="50%" height="20px" />
					</Flex>
				</Flex>

				<Skeleton width="100%" height="80px" mt="sm" />
			</Flex>

			<Separator />
			<Flex gap="sm" direction="column">
				<Skeleton width="100%" height="40px" borderRadius="8px" />
				<Skeleton width="100%" height="40px" borderRadius="8px" />
				<Skeleton width="100%" height="40px" borderRadius="8px" />
			</Flex>

			<Separator />

			<Flex gap="sm" wrap justify="end" className="noria-event-actions">
				<Skeleton width="150px" height="40px" borderRadius="8px" />
				<Skeleton width="150px" height="40px" borderRadius="8px" />
			</Flex>
		</Flex>
	);
};
