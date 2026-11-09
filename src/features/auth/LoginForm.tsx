import { useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'

export function LoginForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setError('')
    setInfo('')
    setBusy(true)
    const { data, error } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
    setBusy(false)
    if (error) {
      setError(error.message)
    } else if (mode === 'signup' && !data.session) {
      setInfo('Check your email to confirm your account, then sign in.')
    }
  }

  const inputClass =
    'mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700'

  return (
    <div className="mx-auto mt-24 w-full max-w-sm p-6">
      <h1 className="mb-1 text-2xl font-bold">Pipeline</h1>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Track every application from wishlist to offer.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="text-sm">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="text-sm">
          <label htmlFor="password">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              className={`${inputClass} pr-16`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 mt-1 px-3 text-xs font-medium text-blue-700 hover:underline dark:text-blue-400"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {info && <p className="text-sm text-green-700 dark:text-green-400">{info}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <button
        className="mt-4 text-sm text-blue-700 hover:underline dark:text-blue-400"
        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
      >
        {mode === 'signin' ? 'No account? Create one' : 'Have an account? Sign in'}
      </button>
    </div>
  )
}
