import { format, startOfWeek, subWeeks } from 'date-fns'
import type { Application } from '../applications/types'

const WEEK = { weekStartsOn: 1 } as const // weeks start on Monday

export interface FunnelStep {
  stage: string
  count: number
}

// A job counts as "applied" once it has left the wishlist.
// Limitation: we only store the current status, not history, so someone
// rejected after an interview is counted under "Applied" only.
export function funnel(items: Application[]): FunnelStep[] {
  const applied = items.filter((a) =>
    ['applied', 'interview', 'offer', 'rejected'].includes(a.status),
  ).length
  const interview = items.filter((a) => ['interview', 'offer'].includes(a.status)).length
  const offer = items.filter((a) => a.status === 'offer').length
  return [
    { stage: 'Applied', count: applied },
    { stage: 'Interview', count: interview },
    { stage: 'Offer', count: offer },
  ]
}

// Share of applications that got past "applied" (interview or offer).
export function responseRate(items: Application[]): number {
  const [applied, interview] = funnel(items)
  return applied.count === 0 ? 0 : interview.count / applied.count
}

export interface WeekBucket {
  week: string
  count: number
}

export function applicationsPerWeek(
  items: Application[],
  weeks = 8,
  now = new Date(),
): WeekBucket[] {
  const thisWeek = startOfWeek(now, WEEK)
  return Array.from({ length: weeks }, (_, i) => {
    const start = subWeeks(thisWeek, weeks - 1 - i)
    const count = items.filter(
      (a) => a.appliedAt && startOfWeek(new Date(a.appliedAt), WEEK).getTime() === start.getTime(),
    ).length
    return { week: format(start, 'MMM d'), count }
  })
}