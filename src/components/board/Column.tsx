import { useDroppable } from '@dnd-kit/core'
import { STATUS_LABELS, type Application, type Status } from '../../features/applications/types'
import { ApplicationCard } from './ApplicationCard'

interface Props {
  status: Status
  applications: Application[]
  onOpen: (a: Application) => void
}

export function Column({ status, applications, onOpen }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <section
      ref={setNodeRef}
      aria-label={`${STATUS_LABELS[status]} column`}
      className={`w-72 shrink-0 rounded-xl p-3 transition-colors ${
        isOver ? 'bg-blue-100 dark:bg-blue-950' : 'bg-gray-100 dark:bg-gray-900'
      }`}
    >
      <h2 className="mb-3 flex justify-between text-sm font-semibold">
        {STATUS_LABELS[status]}
        <span className="text-gray-500 dark:text-gray-400">{applications.length}</span>
      </h2>
      <div className="flex min-h-24 flex-col gap-2">
        {applications.length === 0 && (
          <p className="rounded-lg border border-dashed border-gray-300 p-3 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Nothing here yet
          </p>
        )}
        {applications.map((a) => (
          <ApplicationCard key={a.id} application={a} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
