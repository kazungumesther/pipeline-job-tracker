import type { Application, NewApplication, Status } from './types'

export interface ApplicationRepository {
  list(): Promise<Application[]>
  create(data: NewApplication): Promise<Application>
  update(id: string, patch: Partial<Application>): Promise<Application>
  remove(id: string): Promise<void>
}

const KEY = 'pipeline:applications'

const read = (): Application[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

const write = (items: Application[]) => localStorage.setItem(KEY, JSON.stringify(items))

export const localRepository: ApplicationRepository = {
  async list() {
    return read()
  },
  async create(data) {
    const items = read()
    const inColumn = items.filter((a) => a.status === data.status).length
    const app: Application = {
      ...data,
      id: crypto.randomUUID(),
      position: inColumn,
      createdAt: new Date().toISOString(),
    }
    write([...items, app])
    return app
  },
  async update(id, patch) {
    const next = read().map((a) => (a.id === id ? { ...a, ...patch } : a))
    write(next)
    return next.find((a) => a.id === id)!
  },
  async remove(id) {
    write(read().filter((a) => a.id !== id))
  },
}

export const groupByStatus = (items: Application[]) => {
  const groups = {} as Record<Status, Application[]>
  for (const a of items) (groups[a.status] ??= []).push(a)
  for (const s of Object.keys(groups) as Status[]) {
    groups[s].sort((a, b) => a.position - b.position)
  }
  return groups
}