'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Card, Alert, Typography, Flex, Separator, Link } from '@noria/ui';
import { Mail, Key } from 'lucide-react';
import {
	useLogin,
	useSignInWithMagicLink,
	useSignInWithOAuth,
	useVerifyOtp,
} from '@/hooks/use-auth';

const loginSchema = z.object({
	email: z.email({ message: 'Invalid email address' }),
	password: z.string().optional(),
	otp: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
	const router = useRouter();
	const { mutate: login, isPending: isLoginPending } = useLogin();
	const { mutate: signInWithMagicLink, isPending: isMagicPending } = useSignInWithMagicLink();
	const { mutate: verifyOtp, isPending: isVerifyPending } = useVerifyOtp();
	const { mutate: signInWithOAuth, isPending: isOAuthPending } = useSignInWithOAuth();

	const isPending = isLoginPending || isMagicPending || isVerifyPending || isOAuthPending;
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [isMagicLink, setIsMagicLink] = useState(false);
	const [isOtpSent, setIsOtpSent] = useState(false);

	useEffect(() => {
		router.prefetch('/');
	}, [router]);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '', otp: '' },
	});

	const onSubmit = (data: LoginFormValues) => {
		setError(null);
		setSuccess(null);

		const formData = new FormData();
		formData.append('email', data.email);

		if (isMagicLink) {
			if (isOtpSent) {
				if (!data.otp) {
					setError('Verification code is required.');
					return;
				}
				formData.append('otp', data.otp);
				verifyOtp(formData, {
					onError: (e) => setError(e.message),
				});
			} else {
				signInWithMagicLink(formData, {
					onSuccess: () => {
						setSuccess('Magic link sent to your email.');
						setIsOtpSent(true);
					},
					onError: (e) => setError(e.message),
				});
			}
		} else {
			if (!data.password) {
				setError('Password is required for email login.');
				return;
			}
			formData.append('password', data.password);
			login(formData, {
				onError: (e) => setError(e.message),
			});
		}
	};

	const handleOAuth = (provider: 'google' | 'github') => {
		setError(null);
		signInWithOAuth(provider, {
			onError: () => setError(`Failed to sign in with ${provider}`),
		});
	};

	let submitButtonText = 'Sign In';
	if (isPending) submitButtonText = 'Signing in...';
	else if (isMagicLink && isOtpSent) submitButtonText = 'Verify Code';
	else if (isMagicLink) submitButtonText = 'Send Magic Link';

	return (
		<Flex as="main" justify="center" align="center" p="lg" grow>
			<Card fullWidth maxWidth="400px" gap="md">
				<Flex direction="column" gap="xs" textAlign="center">
					<Typography variant="h1">Welcome Back</Typography>
					<Typography variant="body-small">Sign in to your Noria account</Typography>
				</Flex>

				{error && <Alert variant="danger">{error}</Alert>}
				{success && <Alert variant="success">{success}</Alert>}

				<Flex as="form" onSubmit={handleSubmit(onSubmit)} direction="column" gap="sm">
					<Controller
						control={control}
						name="email"
						render={({ field }) => (
							<TextField
								label="Email Address"
								placeholder="hello@noria.app"
								startIcon={Mail}
								isInvalid={!isPending && !!errors.email}
								errorMessage={!isPending ? errors.email?.message : undefined}
								isDisabled={isPending}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								name={field.name}
							/>
						)}
					/>

					{!isMagicLink && (
						<Controller
							control={control}
							name="password"
							render={({ field }) => (
								<TextField
									label="Password"
									type="password"
									placeholder="••••••••"
									startIcon={Key}
									isInvalid={!isPending && !!errors.password}
									errorMessage={!isPending ? errors.password?.message : undefined}
									isDisabled={isPending}
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
									name={field.name}
								/>
							)}
						/>
					)}

					{isMagicLink && isOtpSent && (
						<Controller
							control={control}
							name="otp"
							render={({ field }) => (
								<TextField
									label="Verification Code"
									placeholder="123456"
									startIcon={Key}
									isInvalid={!isPending && !!errors.otp}
									errorMessage={!isPending ? errors.otp?.message : undefined}
									isDisabled={isPending}
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
									name={field.name}
								/>
							)}
						/>
					)}

					<Flex mt="xs">
						<Button
							type="submit"
							variant="primary"
							isDisabled={isPending}
							fullWidth
							aria-busy={isPending}
						>
							{submitButtonText}
						</Button>
					</Flex>
				</Flex>

				<Flex align="center" gap="sm" direction="column">
					<Separator />
					<Typography variant="label">OR CONTINUE WITH</Typography>
					<Separator />
				</Flex>

				<Flex gap="sm" fullWidth>
					<Button variant="secondary" fullWidth onClick={() => handleOAuth('google')}>
						Google
					</Button>
					<Button variant="secondary" fullWidth onClick={() => handleOAuth('github')}>
						GitHub
					</Button>
				</Flex>

				<Flex direction="column" align="center" gap="xs">
					<Button
						variant="link"
						onPress={() => {
							setIsMagicLink(!isMagicLink);
							setIsOtpSent(false);
						}}
					>
						<Typography variant="body-small" color="foreground">
							{isMagicLink ? 'Sign in with password instead' : 'Sign in with Magic Link instead'}
						</Typography>
					</Button>

					<Typography variant="body-small">
						Don&apos;t have an account?{' '}
						<Link href="/signup">
							<Typography as="span" color="foreground">
								<strong>Sign up</strong>
							</Typography>
						</Link>
					</Typography>
				</Flex>
			</Card>
		</Flex>
	);
};

export default LoginPage;
