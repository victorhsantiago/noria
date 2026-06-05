'use client';

import React, { CSSProperties } from 'react';
import {
	UNSTABLE_ToastRegion as ToastRegion,
	UNSTABLE_Toast as RACToast,
	UNSTABLE_ToastQueue as ToastQueue,
	UNSTABLE_ToastContent as ToastContent,
} from 'react-aria-components';
import { Button } from '../button/button';
import { XIcon, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { flushSync } from 'react-dom';
import './toast.css';

export interface NoriaToastContent {
	title: string;
	description?: string;
	type?: 'success' | 'danger' | 'info';
}

export const toastQueue = new ToastQueue<NoriaToastContent>({
	wrapUpdate(fn) {
		if (typeof document !== 'undefined' && 'startViewTransition' in document) {
			(
				document as unknown as { startViewTransition: (fn: () => void) => void }
			).startViewTransition(() => {
				flushSync(fn);
			});
		} else {
			fn();
		}
	},
});

export const Toaster = () => {
	return (
		<ToastRegion queue={toastQueue} className="noria-toast-region">
			{({ toast }) => <Toast toast={toast} />}
		</ToastRegion>
	);
};

export const Toast = ({
	toast,
	...props
}: {
	toast: { content: NoriaToastContent; key: string };
	[key: string]: unknown;
}) => {
	const { title, description, type = 'info' } = toast.content;

	return (
		<RACToast
			{...props}
			toast={toast}
			style={{ viewTransitionName: toast.key } as CSSProperties}
			className={`noria-toast neu-flat ${type}`}
		>
			<div className="noria-toast-icon">
				{type === 'success' && <CheckCircle2 size={20} />}
				{type === 'danger' && <AlertCircle size={20} />}
				{type === 'info' && <Info size={20} />}
			</div>
			<ToastContent className="noria-toast-content">
				<span slot="title" className="noria-toast-title">
					{title}
				</span>
				{description && (
					<span slot="description" className="noria-toast-description">
						{description}
					</span>
				)}
			</ToastContent>
			<Button slot="close" aria-label="Close" variant="icon-only" icon={<XIcon size={16} />} />
		</RACToast>
	);
};
