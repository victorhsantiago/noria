'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Button,
	Typography,
	Flex,
	MenuTrigger,
	Popover,
	Menu,
	MenuItem,
	Icon,
	Modal,
	Dialog,
	toastQueue,
} from '@noria/ui';
import { MoreVertical, Edit2, Trash2, CopyPlus } from 'lucide-react';
import { useUser } from '@/hooks/use-auth';
import { useDeleteEvent } from '@/hooks/use-events';
import { EventWithRSVPs } from '@/hooks/use-dashboard';

export const EventOrganizerMenu = ({ event }: { event: EventWithRSVPs }) => {
	const { data: user } = useUser();
	const router = useRouter();
	const isOrganizer = user?.id === event.organizer_id;
	const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent(event.id);
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

	if (!isOrganizer) return null;

	const handleMenuAction = (key: React.Key) => {
		if (key === 'edit') {
			router.push(`/events/${event.id}/edit`);
		} else if (key === 'duplicate') {
			router.push(`/create-event?duplicateId=${event.id}`);
		} else if (key === 'delete') {
			setDeleteDialogOpen(true);
		}
	};

	const handleDeleteConfirm = (closeDialog: () => void) => {
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
				closeDialog();
			},
		});
	};

	return (
		<>
			<MenuTrigger>
				<Button variant="icon-only" icon={MoreVertical} aria-label="Event options" />
				<Popover placement="bottom right">
					<Menu onAction={handleMenuAction}>
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
								Are you sure you want to delete <strong>{event.title}</strong>? This action cannot
								be undone.
							</Typography>
							<Flex gap="sm" justify="end" mt="md">
								<Button variant="secondary" onPress={close} isDisabled={isDeleting}>
									Cancel
								</Button>
								<Button
									variant="danger"
									isDisabled={isDeleting}
									onPress={() => handleDeleteConfirm(close)}
								>
									{isDeleting ? 'Deleting...' : 'Delete'}
								</Button>
							</Flex>
						</Flex>
					)}
				</Dialog>
			</Modal>
		</>
	);
};
