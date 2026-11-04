import { describe, it, expect } from 'vitest'
import { filterApplications, needsFollowUp } from './filters'
import type { Application } from './types'

const base: Application = {
  id: '1',
  company: 'Canonical',
  role: 'Web Frontend Engineer',
  status: 'applied',
  position: 0,
  createdAt: '2026-11-01T00:00:00Z',
}
const now = new Date('2026-11-10T00:00:00Z')

describe('needsFollowUp', () => {
  it('is true for an applied job whose follow-up date has passed', () => {
    expect(needsFollowUp({ ...base, followUpAt: '2026-11-05' }, now)).toBe(true)
  })

  it('is false for a future date or an inactive status', () => {
    expect(needsFollowUp({ ...base, followUpAt: '2026-11-20' }, now)).toBe(false)
    expect(needsFollowUp({ ...base, status: 'rejected', followUpAt: '2026-11-05' }, now)).toBe(false)
  })
})

describe('filterApplications', () => {
  const items = [base, { ...base, id: '2', company: 'Acme', role: 'React Dev' }]

  it('searches company and role, case-insensitively', () => {
    expect(filterApplications(items, { query: 'acme', followUpOnly: false }, now)).toHaveLength(1)
    expect(filterApplications(items, { query: 'frontend', followUpOnly: false }, now)).toHaveLength(1)
  })

  it('returns everything for an empty query', () => {
    expect(filterApplications(items, { query: '', followUpOnly: false }, now)).toHaveLength(2)
  })
})