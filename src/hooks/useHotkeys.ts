import { useEffect, useRef } from 'react'

type Handlers = Record<string, () => void>

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

// Single-key shortcuts such as "n" or "/". They are ignored while the user is typing
// in a field or holding a modifier key, so they never fight with normal input.
export function useHotkeys(handlers: Handlers, enabled = true) {
  const latest = useRef(handlers)

  useEffect(() => {
    latest.current = handlers
  })

  useEffect(() => {
    if (!enabled) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return
      const handler = latest.current[e.key]
      if (handler) {
        e.preventDefault()
        handler()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])
}
