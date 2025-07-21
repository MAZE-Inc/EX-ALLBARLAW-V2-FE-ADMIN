import React from 'react'
import { Table } from 'antd'
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface DraggableTableProps<T> {
  columns: any[]
  dataSource: T[]
  rowKey: string
  onChangeOrder: (newData: T[]) => void
  onRowClick?: (record: T, index: number) => void
  onRowDoubleClick?: (record: T, index: number) => void
}

function Row(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  })
  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  }
  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />
}

function DraggableTable<T extends { [key: string]: any }>({
  columns,
  dataSource,
  rowKey,
  onChangeOrder,
  onRowClick,
  onRowDoubleClick,
}: DraggableTableProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = dataSource.findIndex(item => item[rowKey] === active.id)
      const newIndex = dataSource.findIndex(item => item[rowKey] === over?.id)
      const newItems = arrayMove(dataSource, oldIndex, newIndex)
      onChangeOrder(newItems)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={dataSource.map(item => item[rowKey])} strategy={verticalListSortingStrategy}>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          size='small'
          components={{ body: { row: Row } }}
          rowKey={rowKey}
          onRow={(record, index) => ({
            onClick: () => {
              if (onRowClick) {
                onRowClick(record, index || 0)
              }
            },
            onDoubleClick: () => {
              if (onRowDoubleClick) {
                onRowDoubleClick(record, index || 0)
              }
            },
          })}
        />
      </SortableContext>
    </DndContext>
  )
}

export default DraggableTable
