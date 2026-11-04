import { useMemo, useState } from 'react'
import { Board } from '../components/board/Board'
import { ApplicationForm } from '../components/forms/ApplicationForm'
import { Modal } from '../components/ui/Modal'
import { filterApplications } from '../features/applications/filters'
import {
  useApplications,
  useCreateApplication,
  useDeleteApplication,
  useUpdateApplication,
} from '../features/applications/hooks'
import type { Application, NewApplication } from '../features/applications/types'

type ModalState = { mode: 'closed' } | { mode: 'new' } | { mode: 'edit'; app: Application }

export function BoardPage() {
  const { data = [], isLoading } = useApplications()
  const create = useCreateApplication()
  const update = useUpdateApplication()
  const remove = useDeleteApplication()

  const [query, setQuery] = useState('')
  const [followUpOnly, setFollowUpOnly] = useState(false)
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' })

  const visible = useMemo(
    () => filterApplications(data, { query, followUpOnly }),
    [data, query, followUpOnly],
  )

  const close = () => setModal({ mode: 'closed' })

  function handleSubmit(values: NewApplication) {
    if (modal.mode === 'edit') {
      const { app } = modal
      const position =
        values.status !== app.status
          ? data.filter((a) => a.status === values.status).length
          : app.position
      update.mutate({ id: app.id, patch: { ...values, position } })
    } else {
      create.mutate(values)
    }
    close()
  }

  function handleDelete() {
    if (modal.mode !== 'edit') return
    if (window.confirm(`Delete ${modal.app.role} at ${modal.app.company}?`)) {
      remove.mutate(modal.app.id)
      close()
    }
  }

  return (
    <>
      <header className="flex flex-wrap items-center gap-4 p-6">
        <h1 className="text-2xl font-bold">Pipeline</h1>
        <input
          type="search"
          aria-label="Search applications"
          placeholder="Search company, role, notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-64 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={followUpOnly}
            onChange={(e) => setFollowUpOnly(e.target.checked)}
          />
          Needs follow-up
        </label>
        <button
          onClick={() => setModal({ mode: 'new' })}
          className="ml-auto rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          + Add application
        </button>
      </header>

      {isLoading ? (
        <p className="p-6">Loading…</p>
      ) : (
        <Board visible={visible} onOpen={(app) => setModal({ mode: 'edit', app })} />
      )}

      <Modal
        open={modal.mode !== 'closed'}
        onClose={close}
        title={modal.mode === 'edit' ? 'Edit application' : 'New application'}
      >
        <ApplicationForm
          initial={modal.mode === 'edit' ? modal.app : undefined}
          onSubmit={handleSubmit}
          onDelete={modal.mode === 'edit' ? handleDelete : undefined}
          onCancel={close}
        />
      </Modal>
    </>
  )
}