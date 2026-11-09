import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { needsFollowUp } from '../../features/applications/filters'
import type { Application } from '../../features/applications/types'

interface Props {
  application: Application
  onOpen: (a: Application) => void
}

export function ApplicationCard({ application, onOpen }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application.id,
  })

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={() => onOpen(application)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpen(application)
      }}
      className={`cursor-grab rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800 ${
        isDragging ? 'relative z-10 opacity-60 shadow-lg' : ''
      }`}
      {...listeners}
      {...attributes}
    >
      <p className="font-medium">{application.role}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{application.company}</p>
      {application.location && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{application.location}</p>
      )}
      {needsFollowUp(application) && (
        <span className="mt-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900 dark:text-amber-100">
          Follow up
        </span>
      )}
    </article>
  )
}
