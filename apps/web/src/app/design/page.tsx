'use client';

import {
	Button,
	TextField,
	Card,
	Select,
	SelectItem,
	DatePicker,
	TimeField,
	toastQueue,
	Flex,
	Typography,
} from '@noria/ui';
import { Star, Trash2, Home as HomeIcon, CheckCircle, Search, Mail } from 'lucide-react';

const Home = () => {
	return (
		<Flex as="main" direction="column" gap="lg" p="2xl" grow>
			<Typography variant="h1">Noria UI Showcase</Typography>

			<Flex as="section" direction="column" gap="sm">
				<Typography variant="h2-caps">Button Variants</Typography>
				<Flex gap="sm" wrap align="center">
					<Button variant="primary" icon={HomeIcon}>
						Primary Button
					</Button>
					<Button variant="secondary" icon={CheckCircle}>
						Secondary Button
					</Button>
					<Button variant="danger" icon={Trash2}>
						Danger Button
					</Button>
					<Button variant="icon-only" icon={Star} aria-label="Star" />
				</Flex>
			</Flex>

			<Flex as="section" direction="column" gap="sm">
				<Typography variant="h2-caps">Button States (Hover / Press)</Typography>
				<Flex gap="sm" wrap>
					<Button variant="secondary">Interactive Button</Button>
					<Button variant="secondary" isDisabled>
						Disabled
					</Button>
				</Flex>
			</Flex>
			<Flex as="section" direction="column" gap="sm">
				<Typography variant="h2-caps">Text Fields</Typography>
				<Flex direction="column" gap="sm" wrap maxWidth="600px">
					<TextField
						label="Email Address"
						placeholder="example@noria.app"
						startIcon={Mail}
						description="We'll never share your email with anyone else."
					/>
					<TextField label="Search" placeholder="Search events..." startIcon={Search} />
					<TextField
						label="Username"
						placeholder="johndoe"
						isInvalid
						errorMessage="Username is already taken."
					/>
				</Flex>
			</Flex>

			<Flex as="section" direction="column" gap="sm">
				<Typography variant="h2-caps">Cards</Typography>
				<Flex gap="lg" wrap align="start">
					<Card gap="md" maxWidth="320px">
						<Typography variant="h3">Sign In</Typography>
						<Flex direction="column" gap="sm">
							<TextField label="Email Address" placeholder="hello@noria.app" startIcon={Mail} />
							<TextField label="Password" type="password" placeholder="••••••••" />
						</Flex>
						<Button variant="primary" fullWidth>
							Login
						</Button>
					</Card>

					<Card as="a" href="#" gap="sm" maxWidth="320px">
						<Typography variant="h3">
							<Flex align="center" gap="xs">
								<Star size={20} />
								Interactive Layout
							</Flex>
						</Typography>
						<Typography variant="body" color="muted">
							This entire card acts as a link. It elevates on hover to indicate interactivity while
							maintaining our neumorphic aesthetic.
						</Typography>
					</Card>
				</Flex>
			</Flex>

			<Flex as="section" direction="column" gap="sm">
				<Typography variant="h2-caps">Date & Time</Typography>
				<Flex direction="column" gap="sm" wrap maxWidth="600px">
					<DatePicker label="Event Date" />
					<TimeField label="Start Time" hourCycle={24} />
				</Flex>
			</Flex>

			<Flex as="section" direction="column" gap="sm">
				<Typography variant="h2-caps">Select (Dropdown)</Typography>
				<Flex direction="column" gap="sm" wrap maxWidth="300px">
					<Select label="Frequency">
						<SelectItem id="daily">Daily</SelectItem>
						<SelectItem id="weekly">Weekly</SelectItem>
						<SelectItem id="monthly">Monthly</SelectItem>
					</Select>
				</Flex>
			</Flex>
			<Flex as="section" direction="column" gap="sm">
				<Typography variant="h2-caps">Toast Notifications</Typography>
				<Flex gap="sm" wrap align="center">
					<Button
						variant="secondary"
						onPress={() =>
							toastQueue.add(
								{
									title: 'Information',
									description: 'This is a default info toast.',
									type: 'info',
								},
								{ timeout: 5000 },
							)
						}
					>
						Show Info Toast
					</Button>
					<Button
						variant="primary"
						onPress={() =>
							toastQueue.add(
								{ title: 'Success', description: 'Your action was successful!', type: 'success' },
								{ timeout: 5000 },
							)
						}
					>
						Show Success Toast
					</Button>
					<Button
						variant="danger"
						onPress={() =>
							toastQueue.add(
								{ title: 'Error', description: 'Something went wrong.', type: 'danger' },
								{ timeout: 5000 },
							)
						}
					>
						Show Error Toast
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};
export default Home;
