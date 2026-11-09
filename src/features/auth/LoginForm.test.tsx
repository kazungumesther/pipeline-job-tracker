import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('hides the password by default and lets the user show and hide it', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const password = screen.getByLabelText('Password')
    expect(password).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: /show password/i }))
    expect(password).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: /hide password/i }))
    expect(password).toHaveAttribute('type', 'password')
  })
})
