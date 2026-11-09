import type { NewApplication } from './types'

const DAY = 24 * 60 * 60 * 1000

// Fictional companies, with dates spread over several weeks so the analytics
// charts have something to show. Used by the "Load sample data" button.
export function buildSampleApplications(now = new Date()): NewApplication[] {
  const daysAgo = (n: number) => new Date(now.getTime() - n * DAY)
  const iso = (d: Date) => d.toISOString()
  const day = (d: Date) => d.toISOString().slice(0, 10)

  return [
    {
      company: 'Brightside Labs',
      role: 'Frontend Engineer',
      status: 'wishlist',
      location: 'Remote',
      link: 'https://example.com/jobs/frontend',
    },
    {
      company: 'Northwind Apps',
      role: 'React Developer',
      status: 'wishlist',
      location: 'Nairobi',
    },
    {
      company: 'Lumen Health',
      role: 'Web Developer',
      status: 'applied',
      location: 'Mombasa',
      appliedAt: iso(daysAgo(10)),
      followUpAt: day(daysAgo(3)),
      notes: 'Applied through the careers page. No reply yet.',
    },
    {
      company: 'Orbit Payments',
      role: 'Frontend Developer',
      status: 'applied',
      location: 'Remote',
      appliedAt: iso(daysAgo(2)),
      followUpAt: day(new Date(now.getTime() + 5 * DAY)),
    },
    {
      company: 'Fieldnote',
      role: 'Flutter Developer',
      status: 'interview',
      location: 'Nairobi',
      appliedAt: iso(daysAgo(16)),
      salaryMin: 60000,
      salaryMax: 80000,
      notes: 'Technical round on Thursday.',
    },
    {
      company: 'Kite Studio',
      role: 'UI Engineer',
      status: 'offer',
      location: 'Remote',
      appliedAt: iso(daysAgo(30)),
      salaryMin: 70000,
      salaryMax: 90000,
    },
    {
      company: 'Tidewater Systems',
      role: 'Junior Web Developer',
      status: 'rejected',
      appliedAt: iso(daysAgo(23)),
    },
  ]
}
