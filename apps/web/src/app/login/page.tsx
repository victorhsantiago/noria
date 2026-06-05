'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, TextField, Card, Alert, Typography, Flex, Separator } from '@noria/ui'
import { Mail, Key } from 'lucide-react'
import { login, signInWithMagicLink, signInWithOAuth, verifyOtp } from './actions'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().optional(),
  otp: z.string().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginPage = () => {
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
    } catch {
      setError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      await signInWithOAuth(provider)
    } catch {
      setError(`Failed to sign in with ${provider}`)
    }
  }

  return (
    <Flex as="main" justify="center" align="center" style={{ padding: '2rem', flex: 1 }}>
      <Card style={{ width: '100%', maxWidth: '400px', gap: '1.5rem' }}>
        <Flex direction="column" gap="xs" style={{ textAlign: 'center' }}>
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

          <Flex style={{ marginTop: '0.5rem' }}>
            <Button type="submit" variant="primary" isDisabled={isLoading} fullWidth>
              {isLoading 
                ? 'Signing in...' 
                : isMagicLink 
                  ? (isOtpSent ? 'Verify Code' : 'Send Magic Link') 
                  : 'Sign In'}
            </Button>
          </Flex>
        </Flex>

        <Flex align="center" gap="sm">
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

        <Flex direction="column" align="center" gap="xs">
          <button 
            type="button" 
            onClick={() => {
              setIsMagicLink(!isMagicLink)
              setIsOtpSent(false)
            }}
            style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            <Typography variant="body-small" color="foreground">{isMagicLink ? 'Sign in with password instead' : 'Sign in with Magic Link instead'}</Typography>
          </button>

          <Typography variant="body-small">
            Don&apos;t have an account? <Link href="/signup" style={{ color: 'var(--foreground)', fontWeight: 500 }}>Sign up</Link>
          </Typography>
        </Flex>
      </Card>
    </Flex>
  )
}

export default LoginPage;
