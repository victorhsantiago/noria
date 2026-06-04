'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, TextField, Card, Alert } from '@noria/ui'
import { Mail, Key } from 'lucide-react'
import { login, signInWithMagicLink, signInWithOAuth, verifyOtp } from './actions'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().optional(),
  otp: z.string().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMagicLink, setIsMagicLink] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', otp: '' }
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('email', data.email)

      if (isMagicLink) {
        if (isOtpSent) {
          if (!data.otp) {
            setError("Verification code is required.")
            setIsLoading(false)
            return
          }
          formData.append('otp', data.otp)
          const result = await verifyOtp(formData)
          if (result?.error) setError(result.error)
        } else {
          const result = await signInWithMagicLink(formData)
          if (result?.error) {
            setError(result.error)
          } else {
            if (result?.success) setSuccess(result.success)
            setIsOtpSent(true)
          }
        }
      } else {
        if (!data.password) {
          setError("Password is required for email login.")
          setIsLoading(false)
          return
        }
        formData.append('password', data.password)
        const result = await login(formData)
        if (result?.error) setError(result.error)
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
      setError(`Failed to sign in with ${provider}`)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem' }}>
      <Card style={{ width: '100%', maxWidth: '400px', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Welcome Back</h1>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.875rem' }}>Sign in to your Noria account</p>
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

          {!isMagicLink && (
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
          )}

          {isMagicLink && isOtpSent && (
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <TextField 
                  label="Verification Code" 
                  placeholder="123456" 
                  startIcon={<Key size={18} />}
                  isInvalid={!!errors.otp}
                  errorMessage={errors.otp?.message}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          )}

          <Button type="submit" variant="primary" isDisabled={isLoading} style={{ marginTop: '0.5rem' }}>
            {isLoading 
              ? 'Signing in...' 
              : isMagicLink 
                ? (isOtpSent ? 'Verify Code' : 'Send Magic Link') 
                : 'Sign In'}
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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.875rem' }}>
          <button 
            type="button" 
            onClick={() => {
              setIsMagicLink(!isMagicLink)
              setIsOtpSent(false)
            }}
            style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isMagicLink ? 'Sign in with password instead' : 'Sign in with Magic Link instead'}
          </button>

          <div style={{ color: 'var(--muted)' }}>
            Don't have an account? <Link href="/signup" style={{ color: 'var(--foreground)', fontWeight: 500 }}>Sign up</Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
