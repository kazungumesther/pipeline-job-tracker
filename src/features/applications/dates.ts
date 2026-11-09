import { format } from 'date-fns'

// <input type="date"> uses local "yyyy-MM-dd" strings, while we store full ISO timestamps.
export function toDateInput(iso?: string): string {
  return iso ? format(new Date(iso), 'yyyy-MM-dd') : ''
}

// Local noon, so the chosen day never slips to a neighbouring day in another time zone.
export function fromDateInput(value: string): string {
  return new Date(`${value}T12:00:00`).toISOString()
}
