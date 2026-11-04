import { Board } from './components/board/Board'
import { useApplications, useCreateApplication } from './features/applications/hooks'

export default function App() {
  const { data = [] } = useApplications()
  const create = useCreateApplication()

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold">Pipeline</h1>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          onClick={() =>
            create.mutate({ company: 'Canonical', role: 'Web Frontend Engineer', status: 'wishlist' })
          }
        >
          + Quick add
        </button>
      </header>
      <Board visible={data} onOpen={(a) => console.log('open', a)} />
    </main>
  )
}