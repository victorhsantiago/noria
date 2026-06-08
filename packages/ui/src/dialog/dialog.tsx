'use client';
import {
	ModalOverlay as RACModalOverlay,
	Modal as RACModal,
	Dialog as RACDialog,
	DialogProps,
	ModalOverlayProps,
} from 'react-aria-components';
import './dialog.css';

export const Modal = (props: ModalOverlayProps) => {
	return (
		<RACModalOverlay {...props} className={props.className || 'noria-ModalOverlay'}>
			<RACModal className="noria-Modal">{props.children}</RACModal>
		</RACModalOverlay>
	);
};

export const Dialog = (props: DialogProps) => {
	return <RACDialog {...props} className={props.className || 'noria-Dialog'} />;
};
