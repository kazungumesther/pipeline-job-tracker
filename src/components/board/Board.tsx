import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { useApplications, useUpdateApplication } from '../../features/applications/hooks'
import { groupByStatus } from '../../features/applications/repository'
import { STATUSES, type Application, type Status } from '../../features/applications/types'
import { Column } from './Column'

interface Props {
  visible: Application[]
  onOpen: (a: Application) => void
}

export function Board({ visible, onOpen }: Props) {
  const { data: all = [] } = useApplications()
  const update = useUpdateApplication()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const groups = groupByStatus(visible)

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) return
    const newStatus = over.id as Status
    const app = all.find((a) => a.id === active.id)
    if (!app || app.status === newStatus) return
    update.mutate({
      id: app.id,
      patch: {
        status: newStatus,
        position: all.filter((a) => a.status === newStatus).length,
        appliedAt:
          newStatus === 'applied' && !app.appliedAt ? new Date().toISOString() : app.appliedAt,
      },
    })
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-6">
        {STATUSES.map((status) => (
          <Column key={status} status={status} applications={groups[status] ?? []} onOpen={onOpen} />
        ))}
      </div>
    </DndContext>
  )
}