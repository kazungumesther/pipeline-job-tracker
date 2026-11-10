import type { Application, Status, StatusChange } from './types'


export function historyOf(a: Application): StatusChange[] {
  return a.history && a.history.length > 0 ? a.history : [{ status: a.status, at: a.createdAt }]
}


export function reachedStatuses(a: Application): Set<Status> {
  const reached = new Set<Status>(historyOf(a).map((h) => h.status))
  reached.add(a.status)
  return reached
}
