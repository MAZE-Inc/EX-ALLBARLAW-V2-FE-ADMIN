import React from 'react'
import { Modal, Table } from 'antd'
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface DraggableTableModalProps<T> {
  open: boolean
  onCancel: () => void
  title: string
  columns: any[]
  dataSource: T[]
  rowKey: string
  onChangeOrder: (newData: T[]) => void
  addRowRender?: React.ReactNode
  footer?: React.ReactNode
  width?: number | string
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

function DraggableTableModal<T extends { [key: string]: any }>({
  open,
  onCancel,
  title,
  columns,
  dataSource,
  rowKey,
  onChangeOrder,
  addRowRender,
  footer,
  width = 800,
}: DraggableTableModalProps<T>) {
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
    <Modal open={open} onCancel={onCancel} title={title} width={width} footer={footer ?? null}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={dataSource.map(item => item[rowKey])} strategy={verticalListSortingStrategy}>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            size='small'
            components={{ body: { row: Row } }}
            rowKey={rowKey}
          />
        </SortableContext>
      </DndContext>
      {addRowRender}
    </Modal>
  )
}

export default DraggableTableModal
