import {
  closestCorners,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useApplications, useReorderApplications } from '../../features/applications/hooks'
import { moveApplication } from '../../features/applications/ordering'
import { groupByStatus } from '../../features/applications/repository'
import { STATUSES, type Application } from '../../features/applications/types'
import { Column } from './Column'

interface Props {
  visible: Application[]
  onOpen: (a: Application) => void
}

export function Board({ visible, onOpen }: Props) {
  const { data: all = [] } = useApplications()
  const reorder = useReorderApplications()

  
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  )
  const groups = groupByStatus(visible)

  
  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) return
    const changes = moveApplication(all, String(active.id), String(over.id))
    if (changes.length > 0) reorder.mutate(changes)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-4 md:p-6">
        {STATUSES.map((status) => (
          <Column key={status} status={status} applications={groups[status] ?? []} onOpen={onOpen} />
        ))}
      </div>
    </DndContext>
  )
}
