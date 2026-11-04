export const STATUSES = ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const
export type Status = (typeof STATUSES)[number]

export const STATUS_LABELS: Record<Status, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
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
  appliedAt?: string // ISO date
  followUpAt?: string // ISO date, drives reminders
  position: number // order within a column
  createdAt: string
}

export type NewApplication = Omit<Application, 'id' | 'createdAt' | 'position'>