import { Button, Input, Modal, Space, Table, Upload, message, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLawyerSearch } from '@/hooks/queries/useLawyer'
import { useCreateBlog } from '@/hooks/queries/useContent'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useCategory } from '@/hooks/queries/useCategory'
import styles from './BlogEditor.module.scss'

const { TextArea } = Input

const BlogEditor = () => {
  const navigate = useNavigate()
  const { subCategoryId } = useParams()
  const { data: categoryList } = useCategory()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined)
  const [formData, setFormData] = useState({
    blogUrl: '',
    subcategoryId: subCategoryId || '',
    title: '',
    content: '',
    keywords: '',
    lawyer: null as any,
    thumbnail: '',
  })
  const [lawyerSearchName, setLawyerSearchName] = useState('')
  const [isLawyerModalOpen, setIsLawyerModalOpen] = useState(false)
  const [_selectedLawyerId, setSelectedLawyerId] = useState<number | null>(null)
  const [modalSearchQuery, setModalSearchQuery] = useState('')
  const [searchTrigger, setSearchTrigger] = useState({ query: '', trigger: 0 })
  const [thumbnailFileList, setThumbnailFileList] = useState<any[]>([])

  // React Query hook for lawyer search
  const { data: searchData, isLoading } = useLawyerSearch({
    searchQuery: searchTrigger.query,
    searchType: 'lawyerName',
  })

  // File upload hook for thumbnail
  const { uploadFile } = useFileUpload()

  // Create blog mutation
  const createBlogMutation = useCreateBlog({
    onSuccess: () => {
      message.success('블로그가 성공적으로 등록되었습니다.')
      navigate(-1)
    },
    onError: () => {
      message.error('블로그 등록에 실패했습니다. 다시 시도해주세요.')
    },
  })

  useEffect(() => {
    if (subCategoryId && categoryList) {
      // 서브카테고리 ID가 있으면 해당하는 카테고리 찾아서 설정
      const parentCategory = categoryList.find(cat =>
        cat.subcategories.some(sub => sub.subcategoryId === Number(subCategoryId))
      )
      if (parentCategory) {
        setSelectedCategoryId(parentCategory.categoryId)
      }
      setFormData(prev => ({
        ...prev,
        subcategoryId: subCategoryId,
      }))
    }
  }, [subCategoryId, categoryList])

  useEffect(() => {
    // If there's an existing thumbnail URL, set up the file list for display
    if (formData.thumbnail) {
      setThumbnailFileList([
        {
          uid: '-1',
          name: 'thumbnail.png',
          status: 'done',
          url: formData.thumbnail,
        },
      ])
    }
  }, [formData.thumbnail])

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

  const handleAISummary = () => {
    if (!formData.blogUrl) {
      message.warning('블로그 주소를 입력해주세요.')
      return
    }

    // Mock AI summary
    message.loading('AI 요약 중...', 1.5)

    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        title: '부동산 매매계약 시 꼭 확인해야 할 법적 체크리스트',
        content: `이 글은 부동산 매매계약을 체결할 때 반드시 확인해야 할 법적 사항들을 체계적으로 정리한 내용입니다.

1. 소유권 확인
- 등기부등본 상 소유자 확인
- 공유지분 관계 파악
- 신탁등기 여부 확인

2. 권리관계 확인
- 근저당, 전세권, 가압류 등 제한물권 확인
- 임차인 현황 및 대항력 확인
- 유치권 존재 여부 파악

3. 공법상 제한 확인
- 토지이용계획확인서 검토
- 건축물대장 확인
- 개발행위허가 제한 여부

4. 계약서 작성 시 주의사항
- 특약사항 명확히 기재
- 하자담보책임 기간 설정
- 위약금 및 손해배상 조항 검토

5. 잔금 지급 시 확인사항
- 등기 이전 절차 확인
- 세금 정산 내역 검토
- 명도 시기 및 방법 확정`,
        keywords: '부동산매매, 등기부등본, 근저당권, 전세권, 가압류, 계약서작성, 특약사항, 하자담보책임',
      }))
      message.success('AI 요약이 완료되었습니다.')
    }, 1500)
  }

  const handleThumbnailUpload = async (options: any) => {
    const { file, onSuccess, onError } = options
    try {
      const result = await uploadFile(file, { folder: 'thumbnail/blog' })
      if (result?.fileUrl) {
        setFormData(prev => ({
          ...prev,
          thumbnail: result.fileUrl,
        }))
        onSuccess(result.fileUrl)
        message.success('썸네일 이미지가 업로드되었습니다.')
      }
    } catch (error) {
      onError(error)
      message.error('썸네일 업로드에 실패했습니다.')
    }
  }

  const handleThumbnailChange = (info: any) => {
    setThumbnailFileList(info.fileList)
  }

  const handleThumbnailRemove = () => {
    setFormData(prev => ({
      ...prev,
      thumbnail: '',
    }))
    setThumbnailFileList([])
  }

  const handleSave = () => {
    // Validation
    if (!formData.blogUrl) {
      message.warning('블로그 주소를 입력해주세요.')
      return
    }
    if (!formData.title) {
      message.warning('제목을 입력해주세요.')
      return
    }
    if (!formData.content) {
      message.warning('AI요약 내용을 입력해주세요.')
      return
    }
    if (!formData.lawyer) {
      message.warning('변호사를 선택해주세요.')
      return
    }
    if (!formData.subcategoryId) {
      message.warning('카테고리를 선택해주세요.')
      return
    }

    // Prepare tags array from keywords string
    const tagsArray = formData.keywords
      ? formData.keywords
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      : []

    // Create blog request
    const createBlogRequest = {
      blogCaseId: Date.now(), // Temporary ID, should be generated by backend
      blogCaseTitle: formData.title,
      blogCaseSummaryContent: formData.content,
      blogCaseSource: formData.blogUrl,
      blogCaseTags: tagsArray,
      blogCaseLawyerId: formData.lawyer.lawyerId,
      subcategoryId: Number(formData.subcategoryId),
      blogCaseThumbnail: formData.thumbnail || '',
    }

    createBlogMutation.mutate(createBlogRequest)
  }

  const handleCancel = () => {
    navigate(-1)
  }

  // Check if all required fields are filled
  const isFormValid = () => {
    return !!(
      formData.blogUrl &&
      formData.title &&
      formData.content &&
      formData.thumbnail &&
      formData.lawyer &&
      formData.subcategoryId
    )
  }

  return (
    <div className={styles.blogEditor}>
      <h1 className={styles.blogEditor__title}>
        <span>♦</span> 법률정보 글 입력
      </h1>
      <section className={styles.blogEditor__form}>
        {/* 카테고리 선택 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>카테고리 선택</label>
          </div>
          <div className={styles.inputCol}>
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <Select
                placeholder='대분류 선택'
                value={selectedCategoryId}
                onChange={value => {
                  setSelectedCategoryId(value)
                  // 대분류 변경 시 서브카테고리 초기화
                  setFormData(prev => ({ ...prev, subcategoryId: '' }))
                }}
                style={{ width: 200 }}
                size='large'
              >
                {categoryList?.map(cat => (
                  <Select.Option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </Select.Option>
                ))}
              </Select>
              <Select
                placeholder='소분류 선택'
                value={formData.subcategoryId ? Number(formData.subcategoryId) : undefined}
                onChange={value => {
                  handleInputChange('subcategoryId', value?.toString() || '')
                }}
                disabled={!selectedCategoryId}
                style={{ width: 200 }}
                size='large'
              >
                {categoryList
                  ?.find(cat => cat.categoryId === selectedCategoryId)
                  ?.subcategories?.map(sub => (
                    <Select.Option key={sub.subcategoryId} value={sub.subcategoryId}>
                      {sub.subcategoryName}
                    </Select.Option>
                  ))}
              </Select>
            </div>
          </div>
        </div>

        {/* 블로그 주소 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>블로그 주소</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='네이버 블로그 주소를 입력해주세요.'
              size='large'
              value={formData.blogUrl}
              onChange={e => handleInputChange('blogUrl', e.target.value)}
            />
          </div>
        </div>

        {/* AI요약하기 버튼 (별도 섹션) */}
        <div className={styles.aiSummarySection}>
          <Button
            type='primary'
            size='large'
            className={styles.aiButton}
            onClick={handleAISummary}
            disabled={!formData.blogUrl}
          >
            AI요약하기
          </Button>
        </div>

        {/* 썸네일 이미지 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>썸네일 이미지</label>
          </div>
          <div className={styles.inputCol}>
            <Upload
              listType='picture-card'
              fileList={thumbnailFileList}
              customRequest={handleThumbnailUpload}
              onChange={handleThumbnailChange}
              onRemove={handleThumbnailRemove}
              maxCount={1}
              accept='image/*'
            >
              {thumbnailFileList.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>이미지 업로드</div>
                </div>
              )}
            </Upload>
            <div style={{ marginTop: 8, marginLeft: 10, color: '#8c8c8c', fontSize: 12 }}>
              * 권장 사이즈: 800 x 450px (16:9 비율)
            </div>
          </div>
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
                        변호사정보 바로가기
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
          <Button
            type='primary'
            size='large'
            onClick={handleSave}
            loading={createBlogMutation.isPending}
            disabled={!isFormValid()}
          >
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
                return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
                  date.getDate()
                ).padStart(2, '0')}`
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
