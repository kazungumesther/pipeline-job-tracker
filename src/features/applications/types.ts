export const STATUSES = ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const
export type Status = (typeof STATUSES)[number]

export const STATUS_LABELS: Record<Status, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
}

export interface StatusChange {
  status: Status
  at: string // ISO timestamp of when the application entered this status
}

export interface Application {
  id: string
  company: string
  role: string
  status: Status
  link?: string
  location?: string
  salaryMin?: number
  salaryMax?: number
  notes?: string
  appliedAt?: string // ISO date, drives the weekly chart
  followUpAt?: string // yyyy-MM-dd, drives reminders
  position: number // order within a column
  createdAt: string
  history?: StatusChange[] // every status the application has been in, oldest first
}

export type NewApplication = Omit<Application, 'id' | 'createdAt' | 'position'>
