import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { Button, Input, message, Spin } from 'antd'
import { PlusOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons'
import DraggableTable from '@/components/draggableTable/DraggableTable'
import { LawyerActivity } from '@/types/lawyerTypes'
import { useLawyerActivity } from '@/hooks/queries/useLawyer'
import styles from './lawyerEditActivity.module.scss'

const { TextArea } = Input

interface ActivityItem extends LawyerActivity {
  id: string
}

export interface LawyerEditActivityRef {
  getFormData: () => LawyerActivity[]
}

interface LawyerEditActivityProps {
  lawyerId?: string
}

const LawyerEditActivity = forwardRef<LawyerEditActivityRef, LawyerEditActivityProps>(({ lawyerId }, ref) => {
  const { data: activityDataFromAPI, isLoading } = useLawyerActivity(Number(lawyerId))

  const [activityData, setActivityData] = useState<ActivityItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // API 데이터로 초기화
  useEffect(() => {
    if (activityDataFromAPI && !isInitialized) {
      // activityDataFromAPI가 배열인지 확인
      const dataArray = Array.isArray(activityDataFromAPI) ? activityDataFromAPI : []

      if (dataArray.length > 0) {
        const initialData = dataArray.map((item: LawyerActivity, index: number) => ({
          ...item,
          id: `api-${index}`,
        }))
        setActivityData(initialData)
      } else {
        // 데이터가 비어있으면 빈 배열 유지
        setActivityData([])
      }
      setIsInitialized(true)
    } else if (!activityDataFromAPI && !isLoading && !isInitialized) {
      // API 호출 실패 또는 데이터가 없는 경우 빈 배열
      setActivityData([])
      setIsInitialized(true)
    }
  }, [activityDataFromAPI, isLoading, isInitialized])

  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null)
  const [contentValue, setContentValue] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')

  // 선택된 항목이 변경될 때 content 업데이트
  const handleActivityClick = (record: ActivityItem) => {
    setSelectedActivity(record)
    setContentValue(record.lawyerActivityContent)
  }

  // 카테고리 이름 더블클릭 핸들러
  const handleCategoryDoubleClick = (record: ActivityItem) => {
    setEditingCategoryId(record.id)
    setEditingCategoryName(record.lawyerActivityCategoryName)
  }

  // 카테고리 이름 인라인 편집 저장
  const handleCategoryNameSave = (id: string) => {
    setActivityData(prev =>
      prev.map(item => (item.id === id ? { ...item, lawyerActivityCategoryName: editingCategoryName } : item))
    )
    setEditingCategoryId(null)
    setEditingCategoryName('')

    // 선택된 항목이 편집 중인 항목이라면 업데이트
    if (selectedActivity?.id === id) {
      setSelectedActivity(prev => (prev ? { ...prev, lawyerActivityCategoryName: editingCategoryName } : null))
    }
    message.success('카테고리 이름이 변경되었습니다.')
  }

  // 카테고리 이름 인라인 편집 취소
  const handleCategoryNameCancel = () => {
    setEditingCategoryId(null)
    setEditingCategoryName('')
  }

  // 우측 테이블 컬럼
  const columns = [
    {
      title: '활동 분류',
      dataIndex: 'lawyerActivityCategoryName',
      render: (text: string, record: ActivityItem) => (
        <div className={styles.categoryCell}>
          {editingCategoryId === record.id ? (
            <Input
              value={editingCategoryName}
              onChange={e => setEditingCategoryName(e.target.value)}
              onPressEnter={() => handleCategoryNameSave(record.id)}
              onBlur={() => handleCategoryNameSave(record.id)}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  handleCategoryNameCancel()
                }
              }}
              autoFocus
              size='small'
              style={{ width: '100%' }}
            />
          ) : (
            <span
              onDoubleClick={() => handleCategoryDoubleClick(record)}
              style={{ cursor: 'pointer', width: '100%', display: 'block' }}
              title='더블클릭하여 편집'
            >
              {text}
            </span>
          )}
        </div>
      ),
    },
    {
      title: '이동',
      width: 50,
      align: 'center' as const,
      render: () => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />,
    },
    {
      title: '삭제',
      width: 50,
      align: 'center' as const,
      render: (_: any, record: ActivityItem) => (
        <Button
          type='text'
          size='small'
          danger
          icon={<DeleteOutlined />}
          onClick={e => {
            e.stopPropagation()
            handleDelete(record.id)
          }}
        />
      ),
    },
  ]

  // 순서 변경 핸들러
  const handleChangeOrder = (newData: ActivityItem[]) => {
    const reorderedData = newData.map((item, index) => ({
      ...item,
      lawyerActivityDisplayOrder: index + 1,
    }))
    setActivityData(reorderedData)
  }

  // 카테고리 추가
  const handleAdd = () => {
    const newItem: ActivityItem = {
      id: Date.now().toString(),
      lawyerActivityCategoryName: '새 카테고리',
      lawyerActivityContent: '',
      lawyerActivityDisplayOrder: activityData.length + 1,
    }
    setActivityData(prev => [...prev, newItem])
    setSelectedActivity(newItem)
    setContentValue('')
    message.success('새 카테고리가 추가되었습니다.')
  }

  // 카테고리 삭제
  const handleDelete = (id: string) => {
    setActivityData(prev => {
      const filtered = prev.filter(item => item.id !== id)
      return filtered.map((item, index) => ({
        ...item,
        lawyerActivityDisplayOrder: index + 1,
      }))
    })

    if (selectedActivity?.id === id) {
      setSelectedActivity(null)
      setContentValue('')
    }

    message.success('삭제되었습니다.')
  }

  useImperativeHandle(ref, () => ({
    getFormData: () => activityData.map(({ id, ...rest }) => rest),
  }))

  if (isLoading) {
    return (
      <div className={styles.lawyerEditActivity}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size='large' />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.lawyerEditActivity}>
      <section className={styles.wrapper}>
        {/* 좌측: 카테고리 리스트 */}
        <article className={styles.leftPanel}>
          <div className={styles.tableWrapper}>
            <DraggableTable
              columns={columns}
              dataSource={activityData}
              rowKey='id'
              onChangeOrder={handleChangeOrder}
              onRowClick={handleActivityClick}
            />
          </div>

          <div className={styles.addButtonWrapper}>
            <Button icon={<PlusOutlined />} onClick={handleAdd} size='middle' style={{ width: '100%' }}>
              추가
            </Button>
          </div>
        </article>

        {/* 우측: 선택된 카테고리 내용 편집 */}
        <article className={styles.rightPanel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.title}>
              {selectedActivity ? <>활동분류 &gt; {selectedActivity.lawyerActivityCategoryName}</> : '활동 내용'}
            </h3>
          </div>

          {selectedActivity ? (
            <div className={styles.editorContent}>
              <div className={styles.formGroup}>
                <TextArea
                  value={contentValue}
                  onChange={e => setContentValue(e.target.value)}
                  onBlur={() => {
                    // 내용이 변경되었을 때 자동 저장
                    if (selectedActivity && contentValue !== selectedActivity.lawyerActivityContent) {
                      setActivityData(prev =>
                        prev.map(item =>
                          item.id === selectedActivity.id ? { ...item, lawyerActivityContent: contentValue } : item
                        )
                      )
                      setSelectedActivity({ ...selectedActivity, lawyerActivityContent: contentValue })
                    }
                  }}
                  placeholder={`활동사항을 입력해 주세요.\n※ 예시 - 대한변호사협회 이사\n         - 법무부 자문위원\n         - ○○대학교 법학과 겸임교수`}
                  rows={8}
                  style={{ resize: 'none' }}
                />
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>좌측에서 카테고리를 선택하거나 추가해주세요.</div>
          )}
        </article>
      </section>
    </div>
  )
})

LawyerEditActivity.displayName = 'LawyerEditActivity'

export default LawyerEditActivity