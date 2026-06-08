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
	Modal,
	Dialog,
	toastQueue,
} from '@noria/ui';
import {
	Calendar,
	Clock,
	MapPin,
	Copy,
	CheckCircle,
	MoreVertical,
	Edit2,
	Trash2,
	CopyPlus,
} from 'lucide-react';
import { AddToCalendar } from './add-to-calendar';
import { EventWithRSVPs } from '@/hooks/use-dashboard';
import { formatEventDateOnly, formatTimeOnly } from '@/utils/date';
import { useState, useRef, useEffect } from 'react';
import { useRsvp } from '@/hooks/use-rsvp';
import { useUser } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useDeleteEvent } from '@/hooks/use-events';
import { GuestRsvpModal, GuestRsvpFormValues } from './guest-rsvp-modal';
import { RsvpStatus } from '@noria/schemas';
import './event-details.css';

export const EventDetails = ({ event }: { event: EventWithRSVPs }) => {
	const [copied, setCopied] = useState(false);
	const { isPending, handleRSVP } = useRsvp(event.id);
	const { data: user } = useUser();
	const router = useRouter();
	const isOrganizer = user?.id === event.organizer_id;
	const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent(event.id);
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const [guestModalOpen, setGuestModalOpen] = useState(false);
	const [selectedRsvp, setSelectedRsvp] = useState<RsvpStatus>('Going');
	const [guestDefaults, setGuestDefaults] = useState<{ email?: string; name?: string }>(() => {
		if (typeof window !== 'undefined') {
			const guestCookieKey = `noria_guest_rsvp_${event.id}`;
			const raw = localStorage.getItem(guestCookieKey);
			if (raw) {
				try {
					const parsed = JSON.parse(raw);
					return { email: parsed.email, name: parsed.name };
				} catch {
					return {};
				}
			}
		}
		return {};
	});

	const onRsvpClick = (status: RsvpStatus) => {
		if (user) {
			handleRSVP({ status });
		} else {
			setSelectedRsvp(status);
			setGuestModalOpen(true);
		}
	};

	const onGuestRsvpSubmit = (data: GuestRsvpFormValues) => {
		handleRSVP(
			{ status: selectedRsvp, guestDetails: data },
			{
				onSuccess: () => {
					setGuestModalOpen(false);
					setGuestDefaults({ email: data.email, name: data.name });
				},
			},
		);
	};

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
		<Flex direction="column" gap="md" fullWidth>
			<Flex justify="space-between" align="start">
				<Typography variant="h1">{event.title}</Typography>
				{isOrganizer && (
					<>
						<MenuTrigger>
							<Button variant="icon-only" icon={MoreVertical} aria-label="Event options" />
							<Popover placement="bottom right">
								<Menu
									onAction={(key) => {
										if (key === 'edit') {
											router.push(`/events/${event.id}/edit`);
										} else if (key === 'duplicate') {
											router.push(`/create-event?duplicateId=${event.id}`);
										} else if (key === 'delete') {
											setDeleteDialogOpen(true);
										}
									}}
								>
									<MenuItem id="edit" textValue="Edit Event">
										<Flex align="center" gap="sm">
											<Icon icon={Edit2} size={16} />
											<Typography variant="body">Edit Event</Typography>
										</Flex>
									</MenuItem>
									<MenuItem id="duplicate" textValue="Duplicate Event">
										<Flex align="center" gap="sm">
											<Icon icon={CopyPlus} size={16} />
											<Typography variant="body">Duplicate Event</Typography>
										</Flex>
									</MenuItem>
									<MenuItem id="delete" textValue="Delete Event">
										<Flex align="center" gap="sm" style={{ color: 'var(--color-danger)' }}>
											<Icon icon={Trash2} size={16} />
											<Typography variant="body" color="danger">
												Delete Event
											</Typography>
										</Flex>
									</MenuItem>
								</Menu>
							</Popover>
						</MenuTrigger>

						<Modal isOpen={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
							<Dialog>
								{({ close }) => (
									<Flex direction="column" gap="md" p="lg">
										<Typography variant="h3">Delete Event</Typography>
										<Typography variant="body">
											Are you sure you want to delete <strong>{event.title}</strong>? This action
											cannot be undone.
										</Typography>
										<Flex gap="sm" justify="end" mt="md">
											<Button variant="secondary" onPress={close} isDisabled={isDeleting}>
												Cancel
											</Button>
											<Button
												variant="danger"
												isDisabled={isDeleting}
												onPress={() => {
													deleteEvent(undefined, {
														onSuccess: () => {
															toastQueue.add(
																{
																	title: 'Event Deleted',
																	description: 'The event has been successfully deleted.',
																	type: 'success',
																},
																{ timeout: 4000 },
															);
															router.push('/');
														},
														onError: (error) => {
															toastQueue.add(
																{
																	title: 'Delete Failed',
																	description: error.message,
																	type: 'danger',
																},
																{ timeout: 5000 },
															);
															close();
														},
													});
												}}
											>
												{isDeleting ? 'Deleting...' : 'Delete'}
											</Button>
										</Flex>
									</Flex>
								)}
							</Dialog>
						</Modal>
					</>
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
			<Flex gap="sm" justify="space-between">
				<Button
					fullWidth
					variant="primary"
					onPress={() => onRsvpClick('Going')}
					isDisabled={isPending}
				>
					Going
				</Button>
				<Button
					fullWidth
					variant="secondary"
					onPress={() => onRsvpClick('Maybe')}
					isDisabled={isPending}
				>
					Maybe
				</Button>
				<Button
					fullWidth
					variant="danger"
					onPress={() => onRsvpClick('Not Going')}
					isDisabled={isPending}
				>
					Can&apos;t Make It
				</Button>
			</Flex>

			<GuestRsvpModal
				isOpen={guestModalOpen}
				onOpenChange={setGuestModalOpen}
				onSubmit={onGuestRsvpSubmit}
				status={selectedRsvp}
				isPending={isPending}
				defaultValues={guestDefaults}
			/>

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
