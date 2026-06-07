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
	MenuTrigger,
	Popover,
	Menu,
	MenuItem,
	Icon,
} from '@noria/ui';
import { Calendar, Clock, MapPin, Copy, CheckCircle, MoreVertical, Edit2 } from 'lucide-react';
import { AddToCalendar } from './add-to-calendar';
import { EventWithRSVPs } from '@/hooks/use-dashboard';
import { formatEventDateOnly, formatTimeOnly } from '@/utils/date';
import { useState, useRef, useEffect } from 'react';
import { useRsvp } from '@/hooks/use-rsvp';
import { useUser } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import './event-details.css';

export const EventDetails = ({ event }: { event: EventWithRSVPs }) => {
	const [copied, setCopied] = useState(false);
	const { isPending, handleRSVP } = useRsvp(event.id);
	const { data: user } = useUser();
	const router = useRouter();
	const isOrganizer = user?.id === event.organizer_id;

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
		<Flex direction="column" p="lg" gap="md">
			<Flex justify="space-between" align="start">
				<Typography variant="h1">{event.title}</Typography>
				{isOrganizer && (
					<MenuTrigger>
						<Button variant="icon-only" icon={MoreVertical} aria-label="Event options" />
						<Popover placement="bottom right">
							<Menu
								onAction={(key) => {
									if (key === 'edit') {
										router.push(`/events/${event.id}/edit`);
									}
								}}
							>
								<MenuItem id="edit" textValue="Edit Event">
									<Flex align="center" gap="sm">
										<Icon icon={Edit2} size={16} />
										<Typography variant="body">Edit Event</Typography>
									</Flex>
								</MenuItem>
							</Menu>
						</Popover>
					</MenuTrigger>
				)}
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
