import { Button, Input, Modal, Space, Table, message, Select } from 'antd'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLawyerSearch } from '@/hooks/queries/useLawyer'
import { useCreateVideo, useGetVideoChannelInfo } from '@/hooks/queries/useContent'
import { useVideoAiSummary } from '@/hooks/queries/useAiSummary'
import { useCategory } from '@/hooks/queries/useCategory'
import styles from './VideoEditor.module.scss'
import { GetVideoChannelInfoResponse } from '@/types/videoTypes'

const VideoEditor = () => {
  const navigate = useNavigate()
  const { subCategoryId } = useParams()
  const { data: categoryList } = useCategory()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined)
  const [formData, setFormData] = useState({
    subcategoryId: subCategoryId ? Number(subCategoryId) : 0,
    videoCaseTitle: '',
    videoCaseSummaryContent: '',
    videoCaseSource: '',
    videoCaseThumbnail: '',
    videoCaseChannelDescription: '',
    videoCaseChannelThumbnail: '',
    videoCaseHandleName: '',
    videoCaseChannelName: '',
    videoCaseTags: [] as string[],
    videoCaseLawyerId: 0,
  })
  const [lawyerSearchName, setLawyerSearchName] = useState('')
  const [isLawyerModalOpen, setIsLawyerModalOpen] = useState(false)
  const [_selectedLawyerId, setSelectedLawyerId] = useState<number | null>(null)
  const [modalSearchQuery, setModalSearchQuery] = useState('')
  const [searchTrigger, setSearchTrigger] = useState({ query: '', trigger: 0 })
  const [isChannelInfoFetched, setIsChannelInfoFetched] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [shouldFetchSummary, setShouldFetchSummary] = useState(false)
  const [summaryUrl, setSummaryUrl] = useState('')

  const { mutate: channelInfo } = useGetVideoChannelInfo({
    onSuccess: (data: GetVideoChannelInfoResponse) => {
      setFormData(prev => ({
        ...prev,
        videoCaseChannelName: data.channelName,
        videoCaseHandleName: data.handleName,
        videoCaseChannelDescription: data.channelDescription,
        videoCaseChannelThumbnail: data.channelThumbnail,
      }))
      setSubscriberCount(data.subscriberCount)
      setIsChannelInfoFetched(true)
    },
    onError: () => {
      message.error('채널 정보 불러오기에 실패했습니다. 다시 시도해주세요.')
    },
  })

  // AI Summary hook
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useVideoAiSummary(
    { url: summaryUrl },
    {
      enabled: false, // 수동으로 refetch할 것이므로 기본적으로 비활성화
    }
  )

  // AI 요약 데이터 받아온 후 처리
  useEffect(() => {
    if (summaryData && shouldFetchSummary) {
      setFormData(prev => ({
        ...prev,
        videoCaseSummaryContent: summaryData.text,
        videoCaseTags: summaryData.tags || [],
      }))
      message.success('AI 요약이 완료되었습니다.')
      setShouldFetchSummary(false)
    }
  }, [summaryData, shouldFetchSummary])

  // React Query hook for lawyer search
  const { data: searchData, isLoading } = useLawyerSearch({
    searchQuery: searchTrigger.query,
    searchType: 'lawyerName',
  })

  // Create video mutation
  const createVideoMutation = useCreateVideo({
    onSuccess: () => {
      message.success('영상정보가 성공적으로 등록되었습니다.')
      navigate(-1)
    },
    onError: () => {
      message.error('영상정보 등록에 실패했습니다. 다시 시도해주세요.')
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
        subcategoryId: Number(subCategoryId),
      }))
    }
  }, [subCategoryId, categoryList])

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
        videoCaseLawyerId: selected.lawyerId,
        selectedLawyer: selected, // 표시용으로 변호사 정보 저장
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

  const handleFetchChannelInfo = () => {
    if (!formData.videoCaseSource) {
      message.warning('유튜브 채널 정보를 입력해주세요.')
      return
    }

    channelInfo({ channelUrl: formData.videoCaseSource })
  }

  const handleAiSummary = async () => {
    if (!formData.videoCaseSource) {
      message.warning('먼저 유튜브 URL을 입력해주세요.')
      return
    }

    setShouldFetchSummary(true)
    setSummaryUrl(formData.videoCaseSource)

    // URL이 설정된 후 refetch 실행
    setTimeout(() => {
      refetchSummary()
    }, 100)
  }

  const handleSave = () => {
    // Validation
    if (!formData.videoCaseSource) {
      message.warning('유튜브 채널 정보를 입력해주세요.')
      return
    }
    if (!formData.videoCaseTitle) {
      message.warning('영상 제목을 입력해주세요.')
      return
    }
    if (!formData.videoCaseSummaryContent) {
      message.warning('유튜브 영상정보를 입력해주세요.')
      return
    }
    if (!formData.videoCaseLawyerId) {
      message.warning('변호사를 선택해주세요.')
      return
    }
    if (!formData.subcategoryId) {
      message.warning('카테고리를 선택해주세요.')
      return
    }

    // formData를 그대로 전달
    createVideoMutation.mutate(formData)
  }

  const handleCancel = () => {
    navigate(-1)
  }

  // Check if all required fields are filled
  const isFormValid = () => {
    return !!(
      (
        formData.videoCaseSource &&
        formData.videoCaseTitle &&
        formData.videoCaseSummaryContent &&
        formData.videoCaseLawyerId &&
        formData.subcategoryId &&
        isChannelInfoFetched
      ) // YouTube channel info must be fetched
    )
  }

  return (
    <div className={styles.videoEditor}>
      <h1 className={styles.videoEditor__title}>
        <span>♦</span> 영상정보입력
      </h1>
      <section className={styles.videoEditor__form}>
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
                  setFormData(prev => ({ ...prev, subcategoryId: 0 }))
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
                value={formData.subcategoryId || undefined}
                onChange={value => {
                  handleInputChange('subcategoryId', value || 0)
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

        {/* 유튜브 채널 정보 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>유튜브 채널 정보</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='유튜브 채널 홈화면의 경로를 입력해주세요.'
              size='large'
              value={formData.videoCaseSource}
              onChange={e => handleInputChange('videoCaseSource', e.target.value)}
            />
          </div>
        </div>

        {/* 유튜브 채널정보 불러오기 버튼 (별도 섹션) */}
        <div className={styles.fetchButtonSection}>
          <Button
            type='primary'
            size='large'
            className={styles.fetchButton}
            onClick={handleFetchChannelInfo}
            disabled={!formData.videoCaseSource}
          >
            유튜브 채널정보 불러오기
          </Button>
          {formData.videoCaseChannelName && (
            <div className={styles.channelInfoList}>
              <ul>
                <li>채널 명: {formData.videoCaseChannelName}</li>
                <li>구독자 수: {subscriberCount}명</li>
                <li>핸들 명: @{formData.videoCaseHandleName}</li>
                <li>채널 설명: {formData.videoCaseChannelDescription}</li>
              </ul>
            </div>
          )}
        </div>

        {/* 유튜브 영상정보 (URL) */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>유튜브 영상정보</label>
          </div>
          <div className={styles.inputCol} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Input
              placeholder='유튜브 URL을 입력해주세요.'
              size='large'
              value={formData.videoCaseSource}
              onChange={e => handleInputChange('videoCaseSource', e.target.value)}
            />
            <Button
              type='primary'
              size='large'
              onClick={handleAiSummary}
              loading={isSummaryLoading}
              disabled={!formData.videoCaseSource}
            >
              AI요약하기
            </Button>
          </div>
        </div>

        {/* 영상 제목 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>영상 제목</label>
          </div>
          <div className={styles.inputCol}>
            <Input
              placeholder='제목을 입력해주세요.'
              size='large'
              value={formData.videoCaseTitle}
              onChange={e => handleInputChange('videoCaseTitle', e.target.value)}
            />
          </div>
        </div>

        {/* 영상 내용 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>영상 내용</label>
          </div>
          <div className={styles.inputCol}>
            <Input.TextArea
              placeholder='영상 내용을 입력해주세요.'
              rows={4}
              value={formData.videoCaseSummaryContent}
              onChange={e => handleInputChange('videoCaseSummaryContent', e.target.value)}
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
              placeholder='키워드/태그를 입력해주세요. 최대 10개까지 등록 가능합니다.'
              size='large'
              value={formData.videoCaseTags.join(', ')}
              onChange={e => {
                const tags = e.target.value
                  .split(',')
                  .map(tag => tag.trim())
                  .filter(tag => tag.length > 0)
                handleInputChange('videoCaseTags', tags)
              }}
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
            </div>
          </div>
        </div>
      </section>

      {/* 액션 버튼 */}
      <div className={styles.videoEditor__actions}>
        <Space>
          <Button size='large' onClick={handleCancel}>
            취소
          </Button>
          <Button
            type='primary'
            size='large'
            onClick={handleSave}
            loading={createVideoMutation.isPending}
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

export default VideoEditor
