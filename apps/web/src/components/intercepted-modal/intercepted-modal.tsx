'use client';

import { Modal } from '@noria/ui';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export const InterceptedModal = ({ children }: { children: ReactNode }) => {
	const router = useRouter();

	return (
		<Modal
			isDismissable
			defaultOpen
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					router.back();
				}
			}}
		>
			{children}
		</Modal>
	);
};
