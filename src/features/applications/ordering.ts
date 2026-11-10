import { STATUSES, type Application, type Status } from './types'

export interface Change {
  id: string
  patch: Partial<Application>
}

const isStatus = (value: string): value is Status =>
  (STATUSES as readonly string[]).includes(value)

function move<T>(list: T[], from: number, to: number): T[] {
  const copy = [...list]
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}


export function moveApplication(
  items: Application[],
  activeId: string,
  overId: string,
  now = new Date(),
): Change[] {
  const active = items.find((a) => a.id === activeId)
  if (!active || activeId === overId) return []

  const sorted = [...items].sort((a, b) => a.position - b.position)
  const column = (status: Status) => sorted.filter((a) => a.status === status)

  let target: Status
  if (isStatus(overId)) {
    target = overId
  } else {
    const over = items.find((a) => a.id === overId)
    if (!over) return []
    target = over.status
  }

  const source = active.status
  const next = new Map<Status, Application[]>()

  if (target === source) {
    const list = column(source)
    const from = list.findIndex((a) => a.id === activeId)
    const to = isStatus(overId) ? list.length - 1 : list.findIndex((a) => a.id === overId)
    next.set(source, move(list, from, to))
  } else {
    const dest = column(target)
    const at = isStatus(overId) ? dest.length : dest.findIndex((a) => a.id === overId)
    dest.splice(at, 0, active)
    next.set(source, column(source).filter((a) => a.id !== activeId))
    next.set(target, dest)
  }

  const changes: Change[] = []
  for (const list of next.values()) {
    list.forEach((a, index) => {
      const patch: Partial<Application> = {}
      if (a.position !== index) patch.position = index
      if (a.id === activeId && a.status !== target) {
        patch.status = target
        if (target !== 'wishlist' && !a.appliedAt) patch.appliedAt = now.toISOString()
      }
      if (Object.keys(patch).length > 0) changes.push({ id: a.id, patch })
    })
  }
  return changes
}
