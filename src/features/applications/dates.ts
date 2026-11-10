import { format } from 'date-fns'


export function toDateInput(iso?: string): string {
  return iso ? format(new Date(iso), 'yyyy-MM-dd') : ''
}


export function fromDateInput(value: string): string {
  return new Date(`${value}T12:00:00`).toISOString()
}
