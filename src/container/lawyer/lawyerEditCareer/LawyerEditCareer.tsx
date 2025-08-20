import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { Button, Input, message, Spin } from 'antd'
import { PlusOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons'
import DraggableTable from '@/components/draggableTable/DraggableTable'
import { LawyerCareer } from '@/types/lawyerTypes'
import { useLawyerCareer } from '@/hooks/queries/useLawyer'
import styles from './lawyerEditCareer.module.scss'

const { TextArea } = Input

interface CareerItem extends LawyerCareer {
  id: string
}

export interface LawyerEditCareerRef {
  getFormData: () => LawyerCareer[]
}

interface LawyerEditCareerProps {
  lawyerId?: string
}

const LawyerEditCareer = forwardRef<LawyerEditCareerRef, LawyerEditCareerProps>(({ lawyerId }, ref) => {
  const { data: careerDataFromAPI, isLoading } = useLawyerCareer(Number(lawyerId))

  const [careerData, setCareerData] = useState<CareerItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // API 데이터로 초기화
  useEffect(() => {
    if (careerDataFromAPI && !isInitialized) {
      // careerDataFromAPI가 배열인지 확인
      const dataArray = Array.isArray(careerDataFromAPI) ? careerDataFromAPI : []

      if (dataArray.length > 0) {
        const initialData = dataArray.map((item: LawyerCareer, index: number) => ({
          ...item,
          id: `api-${index}`,
        }))
        setCareerData(initialData)
      } else {
        // 데이터가 비어있으면 빈 배열 유지
        setCareerData([])
      }
      setIsInitialized(true)
    } else if (!careerDataFromAPI && !isLoading && !isInitialized) {
      // API 호출 실패 또는 데이터가 없는 경우 빈 배열
      setCareerData([])
      setIsInitialized(true)
    }
  }, [careerDataFromAPI, isLoading, isInitialized])

  const [selectedCareer, setSelectedCareer] = useState<CareerItem | null>(null)
  const [contentValue, setContentValue] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')

  // 선택된 항목이 변경될 때 content 업데이트
  const handleCareerClick = (record: CareerItem) => {
    setSelectedCareer(record)
    setContentValue(record.lawyerCareerContent)
  }

  // 카테고리 이름 더블클릭 핸들러
  const handleCategoryDoubleClick = (record: CareerItem) => {
    setEditingCategoryId(record.id)
    setEditingCategoryName(record.lawyerCareerCategoryName)
  }

  // 카테고리 이름 인라인 편집 저장
  const handleCategoryNameSave = (id: string) => {
    setCareerData(prev =>
      prev.map(item => (item.id === id ? { ...item, lawyerCareerCategoryName: editingCategoryName } : item))
    )
    setEditingCategoryId(null)
    setEditingCategoryName('')

    // 선택된 항목이 편집 중인 항목이라면 업데이트
    if (selectedCareer?.id === id) {
      setSelectedCareer(prev => (prev ? { ...prev, lawyerCareerCategoryName: editingCategoryName } : null))
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
      title: '이력 분류',
      dataIndex: 'lawyerCareerCategoryName',
      render: (text: string, record: CareerItem) => (
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
      render: (_: any, record: CareerItem) => (
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
  const handleChangeOrder = (newData: CareerItem[]) => {
    const reorderedData = newData.map((item, index) => ({
      ...item,
      lawyerCareerDisplayOrder: index + 1,
    }))
    setCareerData(reorderedData)
  }

  // 카테고리 추가
  const handleAdd = () => {
    const newItem: CareerItem = {
      id: Date.now().toString(),
      lawyerCareerCategoryName: '새 카테고리',
      lawyerCareerContent: '',
      lawyerCareerDisplayOrder: careerData.length + 1,
    }
    setCareerData(prev => [...prev, newItem])
    setSelectedCareer(newItem)
    setContentValue('')
    message.success('새 카테고리가 추가되었습니다.')
  }

  // 카테고리 삭제
  const handleDelete = (id: string) => {
    setCareerData(prev => {
      const filtered = prev.filter(item => item.id !== id)
      return filtered.map((item, index) => ({
        ...item,
        lawyerCareerDisplayOrder: index + 1,
      }))
    })

    if (selectedCareer?.id === id) {
      setSelectedCareer(null)
      setContentValue('')
    }

    message.success('삭제되었습니다.')
  }

  useImperativeHandle(ref, () => ({
    getFormData: () => careerData.map(({ id, ...rest }) => rest),
  }))

  if (isLoading) {
    return (
      <div className={styles.lawyerEditCareer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size='large' />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.lawyerEditCareer}>
      <section className={styles.wrapper}>
        {/* 좌측: 카테고리 리스트 */}
        <article className={styles.leftPanel}>
          <div className={styles.tableWrapper}>
            <DraggableTable
              columns={columns}
              dataSource={careerData}
              rowKey='id'
              onChangeOrder={handleChangeOrder}
              onRowClick={handleCareerClick}
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
              {selectedCareer ? <>이력분류 &gt; {selectedCareer.lawyerCareerCategoryName}</> : '이력 내용'}
            </h3>
          </div>

          {selectedCareer ? (
            <div className={styles.editorContent}>
              <div className={styles.formGroup}>
                <TextArea
                  value={contentValue}
                  onChange={e => setContentValue(e.target.value)}
                  onBlur={() => {
                    // 내용이 변경되었을 때 자동 저장
                    if (selectedCareer && contentValue !== selectedCareer.lawyerCareerContent) {
                      setCareerData(prev =>
                        prev.map(item =>
                          item.id === selectedCareer.id ? { ...item, lawyerCareerContent: contentValue } : item
                        )
                      )
                      setSelectedCareer({ ...selectedCareer, lawyerCareerContent: contentValue })
                    }
                  }}
                  placeholder={`이력사항을 연도별로 입력해 주세요.\n※ 예시 - 2021 ~ 2025 : 법률사무소 대표 변호사`}
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

LawyerEditCareer.displayName = 'LawyerEditCareer'

export default LawyerEditCareer
