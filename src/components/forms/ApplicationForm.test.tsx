import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ApplicationForm } from './ApplicationForm'
import type { Application } from '../../features/applications/types'

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
    const existing: Application = {
      id: '1',
      company: 'Canonical',
      role: 'Web Frontend Engineer',
      status: 'applied',
      position: 0,
      createdAt: '2026-11-01T00:00:00Z',
    }
    render(
      <ApplicationForm initial={existing} onSubmit={() => {}} onDelete={onDelete} onCancel={() => {}} />,
    )

    expect(screen.getByLabelText(/company/i)).toHaveValue('Canonical')
    await user.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalled()
  })
})
