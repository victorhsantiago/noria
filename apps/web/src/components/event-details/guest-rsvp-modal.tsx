'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Dialog, Flex, Button, TextField } from '@noria/ui';
import { RsvpStatus } from '@noria/schemas';
import { useEffect } from 'react';

const formSchema = z
	.object({
		email: z.string().email('Please enter a valid email address'),
		name: z.string().optional(),
	})
	.strict();

export type GuestRsvpFormValues = z.infer<typeof formSchema>;

export interface GuestRsvpModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onSubmit: (data: GuestRsvpFormValues) => void;
	status: RsvpStatus;
	isPending: boolean;
	defaultValues?: Partial<GuestRsvpFormValues>;
}

export const GuestRsvpModal = ({
	isOpen,
	onOpenChange,
	onSubmit,
	status,
	isPending,
	defaultValues,
}: GuestRsvpModalProps) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<GuestRsvpFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: defaultValues?.email || '',
			name: defaultValues?.name || '',
		},
	});

	// Reset form when modal opens with new default values
	useEffect(() => {
		if (isOpen) {
			reset({
				email: defaultValues?.email || '',
				name: defaultValues?.name || '',
			});
		}
	}, [isOpen, defaultValues, reset]);

	const getStatusLabel = (s: RsvpStatus) => {
		if (s === 'Going') return 'Going';
		if (s === 'Maybe') return 'Maybe';
		return "Can't Make It";
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<Dialog aria-label="Confirm your answer">
				{({ close }) => (
					<Flex as="form" onSubmit={handleSubmit(onSubmit)} direction="column" gap="md" p="lg">
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									label="Email Address"
									isRequired
									type="email"
									placeholder="your@email.com"
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
									errorMessage={errors.email?.message as string}
								/>
							)}
						/>

						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<TextField
									label="Name (Optional)"
									placeholder="Your name"
									value={field.value || ''}
									onChange={field.onChange}
									onBlur={field.onBlur}
									errorMessage={errors.name?.message as string}
								/>
							)}
						/>

						<Flex gap="sm" justify="end" mt="md">
							<Button variant="secondary" onPress={close} isDisabled={isPending}>
								Cancel
							</Button>
							<Button type="submit" variant="primary" isDisabled={isPending}>
								{isPending ? 'Saving...' : `Confirm with "${getStatusLabel(status)}"`}
							</Button>
						</Flex>
					</Flex>
				)}
			</Dialog>
		</Modal>
	);
};
