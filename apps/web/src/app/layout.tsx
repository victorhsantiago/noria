import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import '@noria/ui/styles.css';
import { ThemeProvider } from '@/components';
import { Toaster } from '@noria/ui';
import { Providers } from './providers';

const outfit = Outfit({
	variable: '--font-outfit',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Noria',
	description: 'Manage your events with ease.',
};

const RootLayout = ({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) => {
	return (
		<html lang="en" className={outfit.variable} suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<Providers>
						{children}
						{modal}
						<Toaster />
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
};

export default RootLayout;
