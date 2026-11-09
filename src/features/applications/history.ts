import type { Application, Status, StatusChange } from './types'

// Applications saved before history existed have none, so fall back to
// "entered the current status when it was created".
export function historyOf(a: Application): StatusChange[] {
  return a.history && a.history.length > 0 ? a.history : [{ status: a.status, at: a.createdAt }]
}

// Every status an application has ever been in, including the current one.
export function reachedStatuses(a: Application): Set<Status> {
  const reached = new Set<Status>(historyOf(a).map((h) => h.status))
  reached.add(a.status)
  return reached
}
