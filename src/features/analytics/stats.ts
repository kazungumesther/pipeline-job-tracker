import { format, startOfWeek, subWeeks } from 'date-fns'
import { reachedStatuses } from '../applications/history'
import type { Application, Status } from '../applications/types'

const WEEK = { weekStartsOn: 1 } as const 
export interface FunnelStep {
  stage: string
  count: number
}

const reachedAny = (reached: Set<Status>, statuses: Status[]) =>
  statuses.some((s) => reached.has(s))


export function funnel(items: Application[]): FunnelStep[] {
  let applied = 0
  let interview = 0
  let offer = 0
  for (const a of items) {
    const reached = reachedStatuses(a)
    if (reachedAny(reached, ['applied', 'interview', 'offer', 'rejected'])) applied++
    if (reachedAny(reached, ['interview', 'offer'])) interview++
    if (reached.has('offer')) offer++
  }
  return [
    { stage: 'Applied', count: applied },
    { stage: 'Interview', count: interview },
    { stage: 'Offer', count: offer },
  ]
}


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
