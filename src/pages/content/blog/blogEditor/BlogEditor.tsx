import { Button, Input, Modal, Space, Table, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLawyerSearch } from '@/hooks/queries/useLawyer'
import styles from './BlogEditor.module.scss'

const { TextArea } = Input

const BlogEditor = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    subcategory: '',
    title: '',
    content: '',
    keywords: '',
    lawyer: null as any,
  })
  const [lawyerSearchName, setLawyerSearchName] = useState('')
  const [isLawyerModalOpen, setIsLawyerModalOpen] = useState(false)
  const [_selectedLawyerId, setSelectedLawyerId] = useState<number | null>(null)
  const [modalSearchQuery, setModalSearchQuery] = useState('')
  const [searchTrigger, setSearchTrigger] = useState({ query: '', trigger: 0 })

  // React Query hook for lawyer search
  const { data: searchData, isLoading } = useLawyerSearch({
    searchQuery: searchTrigger.query,
    searchType: 'lawyerName',
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSelectLawyer = () => {
    if (lawyerSearchName.trim()) {
      setModalSearchQuery(lawyerSearchName)
      setSearchTrigger({ query: lawyerSearchName, trigger: Date.now() })
      setIsLawyerModalOpen(true)
    }
  }

  const handleModalSearch = () => {
    if (modalSearchQuery.trim()) {
      setSearchTrigger({ query: modalSearchQuery, trigger: Date.now() })
    }
  }

  const handleLawyerSelect = (lawyerId: number) => {
    const lawyers = searchData?.lawyerSearchResults || []
    const selected = lawyers.find(lawyer => lawyer.lawyerId === lawyerId)
    if (selected) {
      setFormData(prev => ({
        ...prev,
        lawyer: selected,
      }))
      setIsLawyerModalOpen(false)
      setSelectedLawyerId(null)
      setModalSearchQuery('')
      message.success('변호사가 선택되었습니다.')
    }
  }

  const handleModalCancel = () => {
    setIsLawyerModalOpen(false)
    setSelectedLawyerId(null)
    setModalSearchQuery('')
  }

  const handleSave = () => {
    console.log('저장:', formData)
    // TODO: API 호출하여 저장
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className={styles.blogEditor}>
      <section className={styles.blogEditor__form}>
        {/* 블로그 주소 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>블로그 주소</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='네이버 블로그 주소를 입력해주세요.'
              size='large'
              value={formData.subcategory}
              onChange={e => handleInputChange('subcategory', e.target.value)}
            />
          </div>
        </div>

        {/* AI요약하기 버튼 (별도 섹션) */}
        <div className={styles.aiSummarySection}>
          <Button type='primary' size='large' className={styles.aiButton}>
            AI요약하기
          </Button>
        </div>

        {/* 제목 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>제목</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='제목을 입력해주세요.'
              size='large'
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
            />
          </div>
        </div>

        {/* AI요약 내용 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>AI요약 내용</label>
          </div>
          <div className={styles.inputCol}>
            <TextArea
              placeholder='블로그 주소를 입력후, AI요약이 완료되면 내용이 입력되이 됩니다.&#10;변경할 사항이 있다면 직접 변경해 주세요.'
              rows={10}
              value={formData.content}
              onChange={e => handleInputChange('content', e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>
        </div>

        {/* 키워드/태그(콤마로 구분) */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>키워드/태그(콤마로 구분)</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='AI요약과 동시에 키워드/태그가 입력되어 집니다. 최대 10개까지 등록 가능합니다.'
              size='large'
              value={formData.keywords}
              onChange={e => handleInputChange('keywords', e.target.value)}
            />
          </div>
        </div>

        {/* 변호사 선택 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>변호사 선택</label>
          </div>
          <div className={styles.inputCol}>
            <div className={styles.lawyerSection}>
              <div className={styles.lawyerSearchRow}>
                <Input
                  placeholder='변호사 이름'
                  size='large'
                  value={lawyerSearchName}
                  onChange={e => setLawyerSearchName(e.target.value)}
                  onPressEnter={handleSelectLawyer}
                  className={styles.lawyerInput}
                />
                <Button size='large' onClick={handleSelectLawyer} disabled={!lawyerSearchName.trim()}>
                  검색하기
                </Button>
              </div>

              {formData.lawyer && (
                <div className={styles.lawyerInfo}>
                  <div className={styles.lawyerCard}>
                    <img
                      src={formData.lawyer.lawyerProfileImage || '/default-profile.png'}
                      alt={formData.lawyer.lawyerName}
                      className={styles.lawyerImage}
                    />
                    <div className={styles.lawyerDetails}>
                      <ul>
                        <li>로펌 사무실 : {formData.lawyer.lawyerLawfirmName || '-'}</li>
                        <li>변호사 이름 : {formData.lawyer.lawyerName}</li>
                        <li>
                          생년월일/성별 : {formData.lawyer.birthDate || '-'} / {formData.lawyer.gender || '-'}
                        </li>
                        <li>휴대폰 번호 : {formData.lawyer.phone || '-'}</li>
                        <li>주요분야 : {formData.lawyer.specialties || '-'}</li>
                      </ul>
                      <Button type='primary' size='large' className={styles.confirmButton}>
                        변호사/강보 바로가기
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 액션 버튼 */}
      <div className={styles.blogEditor__actions}>
        <Space>
          <Button size='large' onClick={handleCancel}>
            취소
          </Button>
          <Button type='primary' size='large' onClick={handleSave}>
            저장
          </Button>
        </Space>
      </div>

      {/* 변호사 검색 모달 */}
      <Modal title='변호사 이름 검색' open={isLawyerModalOpen} onCancel={handleModalCancel} width={900} footer={null}>
        <div style={{ marginBottom: 16 }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder='변호사 이름을 검색해주세요'
              value={modalSearchQuery}
              onChange={e => setModalSearchQuery(e.target.value)}
              onPressEnter={handleModalSearch}
              size='large'
              style={{ flex: 1 }}
            />
            <Button type='primary' size='large' onClick={handleModalSearch} style={{ width: 100 }}>
              검색
            </Button>
          </Space.Compact>
        </div>

        <Table
          dataSource={searchData?.lawyerSearchResults || []}
          rowKey='lawyerId'
          loading={isLoading}
          pagination={false}
          locale={{ emptyText: modalSearchQuery ? '검색 결과가 없습니다.' : '변호사 이름을 검색해주세요.' }}
          columns={[
            {
              title: '변호사 사진',
              dataIndex: 'lawyerProfileImage',
              key: 'lawyerProfileImage',
              width: 100,
              render: (image: string | null, record: any) => (
                <div
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: '#f0f0f0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: '#999',
                  }}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={record.lawyerName}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
              ),
            },
            {
              title: '변호사명',
              dataIndex: 'lawyerName',
              key: 'lawyerName',
              width: 150,
            },
            {
              title: '소속',
              dataIndex: 'lawyerLawfirmName',
              key: 'lawyerLawfirmName',
              render: (value: string | null) => value || '-',
            },
            {
              title: '가입일자',
              dataIndex: 'lawyerCreatedAt',
              key: 'lawyerCreatedAt',
              width: 120,
              render: (value: string) => {
                if (!value) return '-'
                const date = new Date(value)
                return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
              },
            },
            {
              title: '선택',
              key: 'action',
              width: 100,
              render: (_: any, record: any) => (
                <Button
                  type='primary'
                  onClick={() => handleLawyerSelect(record.lawyerId)}
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                  선택하기
                </Button>
              ),
            },
          ]}
        />
      </Modal>
    </div>
  )
}

export default BlogEditor
