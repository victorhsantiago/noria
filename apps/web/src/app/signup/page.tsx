'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, TextField, Card, Alert } from '@noria/ui'
import { Mail, Key } from 'lucide-react'
import { signup, signInWithOAuth } from '../login/actions'
import Link from 'next/link'

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)

      const result = await signup(formData)
      
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(result.success)
      }
    } catch (e) {
      setError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      await signInWithOAuth(provider)
    } catch (e) {
      setError(`Failed to sign up with ${provider}`)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem' }}>
      <Card style={{ width: '100%', maxWidth: '400px', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Create an Account</h1>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.875rem' }}>Join Noria to start organizing events</p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField 
                label="Email Address" 
                placeholder="hello@noria.app" 
                startIcon={<Mail size={18} />}
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
                startIcon={<Key size={18} />}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />

          <Button type="submit" variant="primary" isDisabled={isLoading} style={{ marginTop: '0.5rem' }}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          <span style={{ padding: '0 0.75rem', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" onClick={() => handleOAuth('google')} style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            Google
          </Button>
          <Button variant="secondary" onClick={() => handleOAuth('github')} style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            GitHub
          </Button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--foreground)', fontWeight: 500 }}>Sign in</Link>
        </div>
      </Card>
    </div>
  )
}
