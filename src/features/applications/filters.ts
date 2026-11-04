import type { Application, Status } from './types'

export interface Filters {
  query: string
  followUpOnly: boolean
}

const ACTIVE: Status[] = ['applied', 'interview']

export function needsFollowUp(a: Application, now = new Date()) {
  return ACTIVE.includes(a.status) && !!a.followUpAt && new Date(a.followUpAt) <= now
}

export function filterApplications(items: Application[], f: Filters, now = new Date()) {
  const q = f.query.trim().toLowerCase()
  return items.filter((a) => {
    if (f.followUpOnly && !needsFollowUp(a, now)) return false
    if (!q) return true
    return [a.company, a.role, a.location, a.notes].some((field) =>
      field?.toLowerCase().includes(q),
    )
  })
}