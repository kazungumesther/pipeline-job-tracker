import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  STATUSES,
  STATUS_LABELS,
  type Application,
  type NewApplication,
  type Status,
} from '../../features/applications/types'

interface Props {
  initial?: Application
  onSubmit: (data: NewApplication) => void
  onDelete?: () => void
  onCancel: () => void
}

const inputClass =
  'mt-1 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700'

export function ApplicationForm({ initial, onSubmit, onDelete, onCancel }: Props) {
  const [values, setValues] = useState({
    company: initial?.company ?? '',
    role: initial?.role ?? '',
    status: (initial?.status ?? 'wishlist') as Status,
    link: initial?.link ?? '',
    location: initial?.location ?? '',
    salaryMin: initial?.salaryMin?.toString() ?? '',
    salaryMax: initial?.salaryMax?.toString() ?? '',
    followUpAt: initial?.followUpAt?.slice(0, 10) ?? '',
    notes: initial?.notes ?? '',
  })
  const [error, setError] = useState('')

  const set =
    (key: keyof typeof values) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }))

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const min = values.salaryMin ? Number(values.salaryMin) : undefined
    const max = values.salaryMax ? Number(values.salaryMax) : undefined
    if (min !== undefined && max !== undefined && max < min) {
      setError('Maximum salary must be at least the minimum.')
      return
    }
    onSubmit({
      company: values.company.trim(),
      role: values.role.trim(),
      status: values.status,
      link: values.link.trim() || undefined,
      location: values.location.trim() || undefined,
      salaryMin: min,
      salaryMax: max,
      followUpAt: values.followUpAt || undefined,
      notes: values.notes.trim() || undefined,
      appliedAt:
        initial?.appliedAt ?? (values.status !== 'wishlist' ? new Date().toISOString() : undefined),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          Company *
          <input required className={inputClass} value={values.company} onChange={set('company')} />
        </label>
        <label className="block text-sm">
          Role *
          <input required className={inputClass} value={values.role} onChange={set('role')} />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          Status
          <select className={inputClass} value={values.status} onChange={set('status')}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Follow up on
          <input type="date" className={inputClass} value={values.followUpAt} onChange={set('followUpAt')} />
        </label>
      </div>

      <label className="block text-sm">
        Job link
        <input type="url" className={inputClass} value={values.link} onChange={set('link')} placeholder="https://" />
      </label>

      <label className="block text-sm">
        Location
        <input className={inputClass} value={values.location} onChange={set('location')} />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">
          Salary min
          <input type="number" min="0" className={inputClass} value={values.salaryMin} onChange={set('salaryMin')} />
        </label>
        <label className="block text-sm">
          Salary max
          <input type="number" min="0" className={inputClass} value={values.salaryMax} onChange={set('salaryMax')} />
        </label>
      </div>

      <label className="block text-sm">
        Notes
        <textarea rows={3} className={inputClass} value={values.notes} onChange={set('notes')} />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="text-sm text-red-600 hover:underline dark:text-red-400"
          >
            Delete
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            {initial ? 'Save' : 'Add application'}
          </button>
        </div>
      </div>
    </form>
  )
}
