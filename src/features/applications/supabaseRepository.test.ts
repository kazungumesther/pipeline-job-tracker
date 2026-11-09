import { describe, it, expect } from 'vitest'
import { fromRow, toRow } from './supabaseRepository'

describe('toRow', () => {
  it('maps camelCase fields to snake_case columns', () => {
    expect(toRow({ company: 'Acme', salaryMin: 100, followUpAt: '2026-11-20' })).toEqual({
      company: 'Acme',
      salary_min: 100,
      follow_up_at: '2026-11-20',
    })
  })

  it('writes null for a field that was cleared', () => {
    expect(toRow({ notes: undefined })).toEqual({ notes: null })
  })

  it('ignores fields that are not in the patch', () => {
    expect(toRow({ position: 3 })).toEqual({ position: 3 })
  })
})

describe('fromRow', () => {
  it('maps columns back and turns nulls into undefined', () => {
    const app = fromRow({
      id: 'abc',
      created_at: '2026-11-01T00:00:00Z',
      company: 'Acme',
      role: 'Dev',
      status: 'applied',
      salary_min: 100,
      salary_max: null,
      position: 0,
      history: [{ status: 'applied', at: '2026-11-02T00:00:00Z' }],
    })
    expect(app.id).toBe('abc')
    expect(app.createdAt).toBe('2026-11-01T00:00:00Z')
    expect(app.salaryMin).toBe(100)
    expect(app.salaryMax).toBe(undefined)
    expect(app.history?.[0].status).toBe('applied')
  })
})
