import {
  useApplications,
  useCreateApplication,
  useDeleteApplication,
} from './features/applications/hooks'

export default function App() {
  const { data = [], isLoading } = useApplications()
  const create = useCreateApplication()
  const remove = useDeleteApplication()

  return (
    <main className="min-h-screen bg-white p-6 text-gray-900">
      <h1 className="text-2xl font-bold text-blue-600">Pipeline</h1>
      <button
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
        onClick={() =>
          create.mutate({ company: 'Canonical', role: 'Web Frontend Engineer', status: 'wishlist' })
        }
      >
        + Quick add
      </button>

      {isLoading && <p className="mt-4">Loading…</p>}
      <ul className="mt-4 space-y-2">
        {data.map((a) => (
          <li key={a.id} className="flex items-center gap-3">
            {a.role} at {a.company} ({a.status})
            <button className="text-sm text-red-600" onClick={() => remove.mutate(a.id)}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}