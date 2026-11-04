import { describe, it, expect } from 'vitest'
import { applicationsPerWeek, funnel, responseRate } from './stats'
import type { Application, Status } from '../applications/types'

const make = (id: string, status: Status, appliedAt?: string): Application => ({
  id,
  company: 'Co',
  role: 'Dev',
  status,
  appliedAt,
  position: 0,
  createdAt: '2026-11-01T00:00:00Z',
})

describe('funnel', () => {
  const items = [
    make('1', 'wishlist'),
    make('2', 'applied'),
    make('3', 'interview'),
    make('4', 'offer'),
    make('5', 'rejected'),
  ]

  it('counts each stage cumulatively', () => {
    expect(funnel(items).map((s) => s.count)).toEqual([4, 2, 1])
  })

  it('computes the response rate', () => {
    expect(responseRate(items)).toBe(0.5)
  })

  it('returns 0 with no applications', () => {
    expect(responseRate([])).toBe(0)
  })
})

describe('applicationsPerWeek', () => {
  const now = new Date('2026-11-11T12:00:00') // a Wednesday

  it('buckets applications by week, oldest first', () => {
    const items = [
      make('1', 'applied', '2026-11-10T09:00:00'), // this week
      make('2', 'applied', '2026-11-04T09:00:00'), // last week
      make('3', 'applied', '2026-11-05T09:00:00'), // last week
      make('4', 'wishlist'), // no appliedAt, ignored
    ]
    const result = applicationsPerWeek(items, 4, now)
    expect(result).toHaveLength(4)
    expect(result.map((w) => w.count)).toEqual([0, 0, 2, 1])
  })
})