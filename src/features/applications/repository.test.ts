import { describe, it, expect, beforeEach } from 'vitest'
import { localRepository as repo, groupByStatus } from './repository'

describe('localRepository', () => {
  beforeEach(() => localStorage.clear())

  it('creates and lists applications', async () => {
    await repo.create({ company: 'Acme', role: 'Frontend Dev', status: 'applied' })
    const items = await repo.list()
    expect(items).toHaveLength(1)
    expect(items[0].company).toBe('Acme')
  })

  it('updates and removes an application', async () => {
    const app = await repo.create({ company: 'Acme', role: 'Dev', status: 'wishlist' })
    await repo.update(app.id, { status: 'applied' })
    expect((await repo.list())[0].status).toBe('applied')
    await repo.remove(app.id)
    expect(await repo.list()).toHaveLength(0)
  })

  it('groups by status and orders by position', async () => {
    await repo.create({ company: 'A', role: 'x', status: 'applied' })
    await repo.create({ company: 'B', role: 'x', status: 'applied' })
    const groups = groupByStatus(await repo.list())
    expect(groups.applied.map((a) => a.company)).toEqual(['A', 'B'])
  })
})