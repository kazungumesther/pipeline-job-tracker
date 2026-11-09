import { useEffect, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import { LoginForm } from './LoginForm'

// In local-only mode (no Supabase env vars) this renders its children straight away.
export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(!supabase)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      // don't leak one user's cached data into the next session
      if (!next) queryClient.clear()
    })
    return () => data.subscription.unsubscribe()
  }, [queryClient])

  if (!supabase) return <>{children}</>
  if (!ready) return <p className="p-6">Loading…</p>
  if (!session) return <LoginForm />
  return <>{children}</>
}
