import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { needsFollowUp } from '../../features/applications/filters'
import type { Application } from '../../features/applications/types'

interface Props {
  application: Application
  onOpen: (a: Application) => void
}

export function ApplicationCard({ application, onOpen }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
  })

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      onClick={() => onOpen(application)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpen(application)
      }}
      className={`cursor-grab rounded-lg bg-white p-3 shadow-sm ${
        isDragging ? 'relative z-10 opacity-60 shadow-lg' : ''
      }`}
      {...listeners}
      {...attributes}
    >
      <p className="font-medium">{application.role}</p>
      <p className="text-sm text-gray-600">{application.company}</p>
      {application.location && <p className="text-xs text-gray-500">{application.location}</p>}
      {needsFollowUp(application) && (
        <span className="mt-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
          Follow up
        </span>
      )}
    </article>
  )
}