'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
	Button,
	Container,
	Flex,
	Link,
	Menu,
	MenuItem,
	MenuTrigger,
	Popover,
	Typography,
	Icon,
} from '@noria/ui';
import { Menu as MenuIcon, Sun, Moon, LogOut, Palette } from 'lucide-react';
import { useUser, useLogout } from '@/hooks/use-auth';
import { CreateEventButton } from '../create-event-button/create-event-button';
import './topbar.css';

export const Topbar = () => {
	const { data: user } = useUser();
	const { mutate: logoutMutation } = useLogout();
	const router = useRouter();
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const frame = requestAnimationFrame(() => setMounted(true));
		return () => cancelAnimationFrame(frame);
	}, []);

	const isDarkMode = mounted && resolvedTheme === 'dark';
	const themeIcon = isDarkMode ? Sun : Moon;
	const themeText = isDarkMode ? 'Light Mode' : 'Dark Mode';

	const handleMenuAction = (key: React.Key) => {
		switch (key) {
			case 'theme-toggle':
				setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
				break;
			case 'ui-tokens':
				router.push('/design');
				break;
			case 'logout':
				logoutMutation();
				break;
		}
	};

	return (
		<header className="noria-topbar">
			<Container maxWidth="800px" padding="lg">
				<Flex justify="space-between" align="center" gap="sm">
					{/* Left brand name */}
					<Link href="/">
						<Typography variant="h3" className="topbar-brand">
							Noria
						</Typography>
					</Link>

					{/* Right actions */}
					<Flex gap="sm" align="center">
						<Flex maxWidth="150px">
							<CreateEventButton />
						</Flex>

						{user && (
							<MenuTrigger>
								<Button variant="secondary" icon={MenuIcon} aria-label="Account Menu" />
								<Popover placement="bottom right">
									<Menu onAction={handleMenuAction}>
										<MenuItem id="user-info" isDisabled textValue={`Signed in as ${user.user_metadata?.full_name || user.user_metadata?.name || user.email}`}>
											<div className="menu-user-info">
												<span className="menu-user-label">Signed in as</span>
												<span className="menu-user-email">
													{user.user_metadata?.full_name || user.user_metadata?.name || user.email}
												</span>
											</div>
										</MenuItem>
										<MenuItem id="theme-toggle" textValue="Toggle Theme">
											<Flex align="center" gap="sm">
												<Icon icon={themeIcon} size={16} />
												<Typography variant="body">{themeText}</Typography>
											</Flex>
										</MenuItem>
										<MenuItem id="ui-tokens" textValue="UI Tokens">
											<Flex align="center" gap="sm">
												<Icon icon={Palette} size={16} />
												<Typography variant="body">UI Tokens</Typography>
											</Flex>
										</MenuItem>
										<MenuItem id="logout" textValue="Log Out">
											<Flex align="center" gap="sm" style={{ color: 'var(--danger)' }}>
												<Icon icon={LogOut} size={16} />
												<Typography variant="body" color="danger">
													Log Out
												</Typography>
											</Flex>
										</MenuItem>
									</Menu>
								</Popover>
							</MenuTrigger>
						)}
					</Flex>
				</Flex>
			</Container>
		</header>
	);
};
