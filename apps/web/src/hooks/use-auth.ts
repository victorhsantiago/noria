import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Provider } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { getURL } from '@/utils/url';

export const useUser = () => {
	return useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			const supabase = createClient();
			const { data: { user } } = await supabase.auth.getUser();
			return user;
		},
	});
};

export const useLogin = () => {
	const router = useRouter();
	return useMutation({
		mutationFn: async (formData: FormData) => {
			const supabase = createClient();
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;

			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) return { error: error.message };
			return { success: true, redirectTo: '/' };
		},
		onSuccess: (data) => {
			if (data?.error) {
				throw new Error(data.error);
			}
			if (data?.redirectTo) {
				router.push(data.redirectTo);
			}
		},
	});
};

export const useSignup = () => {
	return useMutation({
		mutationFn: async (formData: FormData) => {
			const supabase = createClient();
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;

			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${getURL()}auth/callback`,
				},
			});

			if (error) return { error: error.message };
			return { success: 'Check your email for a confirmation link.' };
		},
		onSuccess: (data) => {
			if (data?.error) {
				throw new Error(data.error);
			}
		},
	});
};

export const useLogout = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const supabase = createClient();
			await supabase.auth.signOut();
			return { success: true, redirectTo: '/login' };
		},
		onSuccess: (data) => {
			if (data?.redirectTo) {
				router.push(data.redirectTo);
			}
			// Delay clearing the cache to avoid synchronous React Router rendering errors
			setTimeout(() => {
				queryClient.clear();
			}, 0);
		},
	});
};

export const useVerifyOtp = () => {
	const router = useRouter();
	return useMutation({
		mutationFn: async (formData: FormData) => {
			const supabase = createClient();
			const email = formData.get('email') as string;
			const token = formData.get('otp') as string;

			const { error } = await supabase.auth.verifyOtp({
				email,
				token,
				type: 'email',
			});

			if (error) return { error: error.message };
			return { success: true, redirectTo: '/' };
		},
		onSuccess: (data) => {
			if (data?.error) {
				throw new Error(data.error);
			}
			if (data?.redirectTo) {
				router.push(data.redirectTo);
			}
		},
	});
};

export const useSignInWithOAuth = () => {
	const router = useRouter();
	return useMutation({
		mutationFn: async (provider: Provider) => {
			const supabase = createClient();
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${getURL()}auth/callback`,
				},
			});

			if (error) return { error: error.message };
			if (data.url) return { success: true, redirectTo: data.url };
			return { error: 'No URL returned from OAuth provider.' };
		},
		onSuccess: (data) => {
			if (data?.error) {
				throw new Error(data.error);
			}
			if (data?.redirectTo) {
				router.push(data.redirectTo);
			}
		},
	});
};

export const useSignInWithMagicLink = () => {
	return useMutation({
		mutationFn: async (formData: FormData) => {
			const supabase = createClient();
			const email = formData.get('email') as string;

			const { error } = await supabase.auth.signInWithOtp({
				email,
				options: {
					emailRedirectTo: `${getURL()}auth/callback`,
				},
			});

			if (error) return { error: error.message };
			return { success: 'Magic link sent to your email.' };
		},
		onSuccess: (data) => {
			if (data?.error) {
				throw new Error(data.error);
			}
		},
	});
};
