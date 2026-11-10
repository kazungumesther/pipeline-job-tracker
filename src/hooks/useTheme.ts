import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const KEY = 'pipeline:theme'

function initialTheme(): Theme {
  const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    return systemTheme
  }

  return systemTheme
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
        try {
      localStorage.setItem(KEY, theme)
    } catch {
      return
    }
      
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  return { theme, toggle }
}
