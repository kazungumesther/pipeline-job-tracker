import { useState } from 'react'
import { ThemeToggle } from './components/ui/ThemeToggle'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { BoardPage } from './pages/BoardPage'

type Tab = 'board' | 'analytics'

export default function App() {
  const [tab, setTab] = useState<Tab>('board')

  const tabClass = (t: Tab) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium ${
      tab === t
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <nav
        className="flex flex-wrap items-center gap-2 border-b border-gray-200 px-4 py-3 md:px-6 dark:border-gray-800"
        aria-label="Main"
      >
        <span className="mr-4 text-xl font-bold">Pipeline</span>
        <button
          className={tabClass('board')}
          aria-current={tab === 'board' ? 'page' : undefined}
          onClick={() => setTab('board')}
        >
          Board
        </button>
        <button
          className={tabClass('analytics')}
          aria-current={tab === 'analytics' ? 'page' : undefined}
          onClick={() => setTab('analytics')}
        >
          Analytics
        </button>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </nav>
      {tab === 'board' ? <BoardPage /> : <AnalyticsPage />}
    </main>
  )
}
