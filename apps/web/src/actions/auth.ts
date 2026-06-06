'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Provider } from '@supabase/supabase-js';
import { getURL } from '@/utils/url';

export async function login(formData: FormData) {
	const supabase = await createClient();

	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return { error: error.message };
	}

	revalidatePath('/', 'layout');
	redirect('/');
}

export async function signup(formData: FormData) {
	const supabase = await createClient();

	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${getURL()}auth/callback`,
		},
	});

	if (error) {
		return { error: error.message };
	}

	// On successful signup, Supabase may require email confirmation.
	// We can return a success message or redirect.
	return { success: 'Check your email for a confirmation link.' };
}

export async function signInWithMagicLink(formData: FormData) {
	const supabase = await createClient();
	const email = formData.get('email') as string;

	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			emailRedirectTo: `${getURL()}auth/callback`,
		},
	});

	if (error) {
		return { error: error.message };
	}

	return { success: 'Magic link sent to your email.' };
}

export async function signInWithOAuth(provider: Provider) {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: `${getURL()}auth/callback`,
		},
	});

	if (error) {
		return { error: error.message };
	}

	if (data.url) {
		redirect(data.url);
	}
}

export async function verifyOtp(formData: FormData) {
	const supabase = await createClient();
	const email = formData.get('email') as string;
	const token = formData.get('otp') as string;

	const { error } = await supabase.auth.verifyOtp({
		email,
		token,
		type: 'email',
	});

	if (error) {
		return { error: error.message };
	}

	revalidatePath('/', 'layout');
	redirect('/');
}

export async function logout() {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect('/login');
}

export async function getUser() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}

export async function requireUser() {
	const user = await getUser();
	if (!user) {
		redirect('/login');
	}
	return user;
}
