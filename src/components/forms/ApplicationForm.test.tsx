import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ApplicationForm } from './ApplicationForm'
import { toDateInput } from '../../features/applications/dates'
import type { Application } from '../../features/applications/types'

const existing: Application = {
  id: '1',
  company: 'Canonical',
  role: 'Web Frontend Engineer',
  status: 'applied',
  position: 0,
  createdAt: '2026-11-01T00:00:00Z',
}

describe('ApplicationForm', () => {
  it('submits trimmed values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ApplicationForm onSubmit={onSubmit} onCancel={() => {}} />)

    await user.type(screen.getByLabelText(/company/i), '  Acme  ')
    await user.type(screen.getByLabelText(/^role/i), 'Frontend Dev ')
    await user.click(screen.getByRole('button', { name: /add application/i }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ company: 'Acme', role: 'Frontend Dev', status: 'wishlist' }),
    )
  })

  it('rejects a maximum salary below the minimum', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ApplicationForm onSubmit={onSubmit} onCancel={() => {}} />)

    await user.type(screen.getByLabelText(/company/i), 'Acme')
    await user.type(screen.getByLabelText(/^role/i), 'Dev')
    await user.type(screen.getByLabelText(/salary min/i), '100')
    await user.type(screen.getByLabelText(/salary max/i), '50')
    await user.click(screen.getByRole('button', { name: /add application/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/maximum salary/i)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('pre-fills an existing application and can delete it', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(
      <ApplicationForm initial={existing} onSubmit={() => {}} onDelete={onDelete} onCancel={() => {}} />,
    )

    expect(screen.getByLabelText(/company/i)).toHaveValue('Canonical')
    await user.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalled()
  })

  it('uses the applied date the user picks', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ApplicationForm initial={existing} onSubmit={onSubmit} onCancel={() => {}} />)

    fireEvent.change(screen.getByLabelText(/applied on/i), { target: { value: '2026-11-03' } })
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(toDateInput(onSubmit.mock.calls[0][0].appliedAt)).toBe('2026-11-03')
  })

  it('keeps the original timestamp when the applied date is untouched', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const original = '2026-11-03T08:15:30.000Z'
    render(
      <ApplicationForm
        initial={{ ...existing, appliedAt: original }}
        onSubmit={onSubmit}
        onCancel={() => {}}
      />,
    )

    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(onSubmit.mock.calls[0][0].appliedAt).toBe(original)
  })

  it('shows the status history when editing', () => {
    render(
      <ApplicationForm
        initial={{
          ...existing,
          history: [
            { status: 'wishlist', at: '2026-11-01T10:00:00Z' },
            { status: 'applied', at: '2026-11-03T10:00:00Z' },
          ],
        }}
        onSubmit={() => {}}
        onCancel={() => {}}
      />,
    )

    expect(screen.getByRole('heading', { name: /status history/i })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})
