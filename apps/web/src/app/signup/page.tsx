'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Card, Alert, Typography, Flex, Separator, Link } from '@noria/ui';
import { Mail, Key } from 'lucide-react';
import { useSignup, useSignInWithOAuth } from '@/hooks/use-auth';

const signupSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupPage = () => {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const { mutate: signup, isPending: isSignupPending } = useSignup();
	const { mutate: signInWithOAuth, isPending: isOAuthPending } = useSignInWithOAuth();
	const isLoading = isSignupPending || isOAuthPending;

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: { email: '', password: '' },
	});

	const onSubmit = (data: SignupFormValues) => {
		setError(null);
		setSuccess(null);

		const formData = new FormData();
		formData.append('email', data.email);
		formData.append('password', data.password);

		signup(formData, {
			onSuccess: () => {
				setSuccess('Check your email for a confirmation link.');
			},
			onError: (e) => {
				setError(e.message || 'An unexpected error occurred.');
			},
		});
	};

	const handleOAuth = (provider: 'google' | 'github') => {
		setError(null);
		signInWithOAuth(provider, {
			onError: () => setError(`Failed to sign up with ${provider}`),
		});
	};

	return (
		<Flex as="main" justify="center" align="center" p="lg" grow>
			<Card fullWidth maxWidth="400px" gap="md">
				<Flex direction="column" gap="xs" textAlign="center">
					<Typography variant="h1">Create an Account</Typography>
					<Typography variant="body-small">Join Noria to start organizing events</Typography>
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
								isInvalid={!!errors.email}
								errorMessage={errors.email?.message}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								name={field.name}
							/>
						)}
					/>

					<Controller
						control={control}
						name="password"
						render={({ field }) => (
							<TextField
								label="Password"
								type="password"
								placeholder="••••••••"
								startIcon={Key}
								isInvalid={!!errors.password}
								errorMessage={errors.password?.message}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								name={field.name}
							/>
						)}
					/>

					<Button type="submit" variant="primary" isDisabled={isLoading}>
						{isLoading ? 'Creating account...' : 'Sign Up'}
					</Button>
				</Flex>

				<Flex direction="column" align="center" gap="sm">
					<Separator />
					<Typography variant="label">OR CONTINUE WITH</Typography>
					<Separator />
				</Flex>

				<Flex gap="sm">
					<Button variant="secondary" onClick={() => handleOAuth('google')}>
						Google
					</Button>
					<Button variant="secondary" onClick={() => handleOAuth('github')}>
						GitHub
					</Button>
				</Flex>

				<Flex justify="center" mt="sm">
					<Typography variant="body-small" color="muted">
						Already have an account?{' '}
						<Link href="/login">
							<Typography as="span" color="foreground">
								<strong>Sign in</strong>
							</Typography>
						</Link>
					</Typography>
				</Flex>
			</Card>
		</Flex>
	);
};

export default SignupPage;
