import { describe, it, expect } from 'vitest'
import { toCsv } from './csv'
import type { Application } from './types'

const app = (over: Partial<Application> = {}): Application => ({
  id: '1',
  company: 'Acme',
  role: 'Dev',
  status: 'applied',
  position: 0,
  createdAt: '2026-11-01T00:00:00Z',
  ...over,
})

describe('toCsv', () => {
  it('writes a header and one row per application', () => {
    const lines = toCsv([
      app({ location: 'Nairobi', salaryMin: 100, appliedAt: '2026-11-03T10:00:00Z' }),
    ]).split('\r\n')

    expect(lines).toHaveLength(2)
    expect(lines[0]).toBe(
      'Company,Role,Status,Location,Link,Salary min,Salary max,Applied,Follow up,Notes',
    )
    expect(lines[1]).toBe('Acme,Dev,applied,Nairobi,,100,,2026-11-03,,')
  })

  it('quotes commas, quotes and newlines', () => {
    const csv = toCsv([app({ notes: 'Said "hi", then\nleft' })])
    expect(csv).toContain('"Said ""hi"", then\nleft"')
  })

  it('neutralises spreadsheet formulas', () => {
    const csv = toCsv([app({ company: '=SUM(A1:A9)' })])
    expect(csv).toContain("'=SUM(A1:A9)")
  })
})
