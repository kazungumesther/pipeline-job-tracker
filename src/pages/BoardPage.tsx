import { useMemo, useRef, useState } from 'react'
import { Board } from '../components/board/Board'
import { ApplicationForm } from '../components/forms/ApplicationForm'
import { Modal } from '../components/ui/Modal'
import { downloadCsv } from '../features/applications/csv'
import { filterApplications } from '../features/applications/filters'
import {
  useApplications,
  useCreateApplication,
  useDeleteApplication,
  useUpdateApplication,
} from '../features/applications/hooks'
import { buildSampleApplications } from '../features/applications/sampleData'
import type { Application, NewApplication } from '../features/applications/types'
import { useHotkeys } from '../hooks/useHotkeys'

type ModalState = { mode: 'closed' } | { mode: 'new' } | { mode: 'edit'; app: Application }

const kbd =
  'rounded border border-gray-300 px-1 font-mono text-[11px] dark:border-gray-700'

export function BoardPage() {
  const { data = [], isLoading, isError, refetch } = useApplications()
  const create = useCreateApplication()
  const update = useUpdateApplication()
  const remove = useDeleteApplication()

  const [query, setQuery] = useState('')
  const [followUpOnly, setFollowUpOnly] = useState(false)
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' })
  const [seeding, setSeeding] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const visible = useMemo(
    () => filterApplications(data, { query, followUpOnly }),
    [data, query, followUpOnly],
  )

  const close = () => setModal({ mode: 'closed' })

  useHotkeys(
    {
      n: () => setModal({ mode: 'new' }),
      '/': () => searchRef.current?.focus(),
    },
    modal.mode === 'closed',
  )

  function handleSubmit(values: NewApplication) {
    create.reset()
    update.reset()
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
      remove.reset()
      remove.mutate(modal.app.id)
      close()
    }
  }

  async function loadSamples() {
    create.reset()
    setSeeding(true)
    try {
    
      for (const sample of buildSampleApplications()) {
        await create.mutateAsync(sample)
      }
    } catch {
      
    } finally {
      setSeeding(false)
    }
  }

  const saveFailed = create.isError || update.isError || remove.isError

  return (
    <>
      <header className="flex flex-wrap items-center gap-3 p-4 md:p-6">
        <input
          ref={searchRef}
          type="search"
          aria-label="Search applications"
          placeholder="Search company, role, notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setQuery('')
              e.currentTarget.blur()
            }
          }}
          className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm sm:w-64 dark:border-gray-700"
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
          onClick={() => downloadCsv(data)}
          disabled={data.length === 0}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Export CSV
        </button>
        <button
          onClick={() => setModal({ mode: 'new' })}
          className="ml-auto rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add application
        </button>
        <p className="hidden w-full text-xs text-gray-500 md:block dark:text-gray-400">
          Shortcuts: <kbd className={kbd}>N</kbd> new application · <kbd className={kbd}>/</kbd> search ·{' '}
          <kbd className={kbd}>Esc</kbd> close
        </p>
      </header>

      {saveFailed && (
        <p
          role="alert"
          className="mx-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 md:mx-6 dark:bg-red-950 dark:text-red-200"
        >
          Couldn’t save your last change. Please try again.
        </p>
      )}

      {isLoading ? (
        <p className="p-6">Loading…</p>
      ) : isError ? (
        <div
          role="alert"
          className="m-4 rounded-xl border border-red-300 p-4 text-sm md:m-6 dark:border-red-800"
        >
          Couldn’t load your applications.{' '}
          <button onClick={() => refetch()} className="underline">
            Retry
          </button>
        </div>
      ) : data.length === 0 ? (
        <div className="mx-4 rounded-xl border border-dashed border-gray-300 p-8 text-center md:mx-6 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Your board is empty</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Add the first job you’re interested in, or load a few sample applications to look around.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setModal({ mode: 'new' })}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Add your first application
            </button>
            <button
              onClick={loadSamples}
              disabled={seeding}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-60 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              {seeding ? 'Loading…' : 'Load sample data'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {visible.length === 0 && (
            <p className="px-4 text-sm text-gray-600 md:px-6 dark:text-gray-400">
              No applications match your search or filter.
            </p>
          )}
          <Board visible={visible} onOpen={(app) => setModal({ mode: 'edit', app })} />
        </>
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
