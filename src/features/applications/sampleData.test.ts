import { describe, it, expect } from 'vitest'
import { needsFollowUp } from './filters'
import { buildSampleApplications } from './sampleData'
import { STATUSES, type Application } from './types'

describe('buildSampleApplications', () => {
  const now = new Date('2026-11-10T12:00:00Z')
  const samples = buildSampleApplications(now)

  it('covers every status', () => {
    for (const status of STATUSES) {
      expect(samples.some((s) => s.status === status)).toBe(true)
    }
  })

  it('includes at least one application that needs a follow-up', () => {
    const asApps = samples.map(
      (s, i): Application => ({ ...s, id: String(i), position: i, createdAt: now.toISOString() }),
    )
    expect(asApps.some((a) => needsFollowUp(a, now))).toBe(true)
  })

  it('only sets applied dates in the past', () => {
    for (const s of samples) {
      if (s.appliedAt) expect(new Date(s.appliedAt).getTime()).toBeLessThan(now.getTime())
    }
  })
})
