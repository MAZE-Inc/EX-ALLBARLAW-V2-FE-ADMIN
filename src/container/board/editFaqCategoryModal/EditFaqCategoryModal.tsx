import React, { useState } from 'react'
import { Modal, Form, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import styles from './editFaqCategoryModal.module.scss'

type EditFaqCategoryModalProps = {
  isModalVisible: boolean
  onCancle: () => void
}

interface FaqCategory {
  key: string
  id: number
  name: string
  description: string
  order: number
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

// 드래그 가능한 테이블 행 컴포넌트
const Row: React.FC<Readonly<RowProps>> = props => {
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

// 햄버거 아이콘 컴포넌트
const HamburgerIcon = () => <div className={styles['hamburger-icon']}>≡</div>

const EditFaqCategoryModal = ({ isModalVisible, onCancle }: EditFaqCategoryModalProps) => {
  const [form] = Form.useForm()
  const [categories, setCategories] = useState<FaqCategory[]>([
    { key: '1', id: 1, name: '회원가입', description: '회원가입 관련 FAQ', order: 1 },
    { key: '2', id: 2, name: '로그인', description: '로그인 관련 FAQ', order: 2 },
    { key: '3', id: 3, name: '결제', description: '결제 관련 FAQ', order: 3 },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setCategories(items => {
        const oldIndex = items.findIndex(item => item.key === active.id)
        const newIndex = items.findIndex(item => item.key === over?.id)

        const newItems = arrayMove(items, oldIndex, newIndex)

        // order 값 업데이트
        return newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }))
      })
    }
  }

  const columns: ColumnsType<FaqCategory> = [
    {
      title: 'FAQ 분류',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '이동',
      dataIndex: 'description',
      key: 'description',
      width: 80,
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
      render: () => <HamburgerIcon />,
    },
  ]

  const handleCancel = () => {
    form.resetFields()
    onCancle()
  }

  return (
    <Modal title='FAQ 분류 설정' open={isModalVisible} onCancel={handleCancel} width={800}>
      <div className={styles.editFaqCategoryModal}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories.map(item => item.key)} strategy={verticalListSortingStrategy}>
            <Table
              columns={columns}
              dataSource={categories}
              pagination={false}
              size='small'
              components={{
                body: { row: Row },
              }}
              rowKey='key'
            />
          </SortableContext>
        </DndContext>
      </div>
    </Modal>
  )
}

export default EditFaqCategoryModal
