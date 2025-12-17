import { Button, Input, Modal, Space, Table, message, Select, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { useCreateVideo, useEditVideo, useGetVideoDetail, useGetYoutubeVideoInfo } from '@/hooks/queries/useContent'
import { VIDEO_HEADER_PORTAL_ID } from '../videoMain/VideoPage'
import { useVideoForm } from '@/hooks/useVideoForm'
import { useLawyerSelection } from '@/hooks/useLawyerSelection'
import { useChannelInfo } from '@/hooks/useChannelInfo'
import { useVideoAiSummaryLogic } from '@/hooks/useVideoAiSummary'
import { useCategorySelection } from '@/hooks/useCategorySelection'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import styles from './VideoEditor.module.scss'
import { YoutubeVideoInfoResponse } from '@/types/videoTypes'
import { formatSubscriberCount } from '@/utils/youtubeUtils'

const TagRender = (props: CustomTagProps) => (
  <Tag closable={props.closable} onClose={props.onClose} style={{ marginRight: 8, marginBottom: 4 }}>
    #{props.label}
  </Tag>
)

const VideoEditor = () => {
  const navigate = useNavigate()
  const { subCategoryId, videoCaseId } = useParams()
  const isEditMode = !!videoCaseId
  const [channelUrl, setChannelUrl] = useState('')
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const container = document.getElementById(VIDEO_HEADER_PORTAL_ID)
    setPortalContainer(container)
  }, [])

  // 커스텀 훅들
  const { formData, setFormData, handleInputChange, isFormValid } = useVideoForm(subCategoryId)
  const { categoryList, selectedCategoryId, setSelectedCategoryId } = useCategorySelection(subCategoryId)
  const lawyerSelection = useLawyerSelection()
  const channelInfo = useChannelInfo()
  const aiSummary = useVideoAiSummaryLogic()
  const { mutate: getYoutubeVideoInfo, isPending: isYoutubeVideoInfoLoading } = useGetYoutubeVideoInfo({
    onSuccess: (data: YoutubeVideoInfoResponse) => {
      setFormData(prev => ({
        ...prev,
        videoCaseTitle: data.title,
        videoCaseThumbnail: data.thumbnail,
      }))
    },
    onError: () => {
      message.error('유튜브 영상정보 불러오기에 실패했습니다. 다시 시도해주세요.')
    },
  })

  // 채널 정보 업데이트
  useEffect(() => {
    if (channelInfo.channelData) {
      setFormData(prev => ({
        ...prev,
        videoCaseSubscriberCount: Number(channelInfo.channelData?.subscriberCount) || 0,
        videoCaseChannelName: channelInfo.channelData?.channelName || '',
        videoCaseHandleName: channelInfo.channelData?.handleName || '',
        videoCaseChannelDescription: channelInfo.channelData?.channelDescription || '',
        videoCaseChannelThumbnail: channelInfo.channelData?.channelThumbnail || '',
      }))
    }
  }, [channelInfo.channelData, setFormData])

  // AI 요약 데이터 업데이트
  useEffect(() => {
    if (aiSummary.summaryData && aiSummary.shouldFetchSummary) {
      // 태그에서 # 기호 제거
      const cleanedTags = (aiSummary.summaryData.tags || []).map((tag: string) =>
        tag.startsWith('#') ? tag.substring(1) : tag
      )

      setFormData(prev => ({
        ...prev,
        videoCaseSummaryContent: aiSummary.summaryData.text,
        videoCaseTags: cleanedTags,
      }))
      message.success('AI 요약이 완료되었습니다.')
      aiSummary.resetSummaryFlag()
    }
  }, [aiSummary.summaryData, aiSummary.shouldFetchSummary, setFormData, aiSummary])

  // Get video detail for edit mode
  const { data: videoDetail } = useGetVideoDetail({
    videoCaseId: Number(videoCaseId),
  })

  // Create video mutation
  const createVideoMutation = useCreateVideo({
    onSuccess: () => {
      message.success('영상정보가 성공적으로 등록되었습니다.')
      navigate(ROUTE_PATH.CONTENT_VIDEO)
    },
    onError: () => {
      message.error('영상정보 등록에 실패했습니다. 다시 시도해주세요.')
    },
  })

  // Edit video mutation for edit mode
  const editVideoMutation = useEditVideo({
    videoCaseId: Number(videoCaseId),
    onSuccess: () => {
      message.success('영상정보가 성공적으로 수정되었습니다.')
      navigate(ROUTE_PATH.CONTENT_VIDEO)
    },
    onError: () => {
      message.error('영상정보 수정에 실패했습니다. 다시 시도해주세요.')
    },
  })

  // 서브카테고리 ID 업데이트
  useEffect(() => {
    if (subCategoryId) {
      setFormData(prev => ({
        ...prev,
        subcategoryId: Number(subCategoryId),
      }))
    }
  }, [subCategoryId, setFormData])

  // Edit 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEditMode && videoDetail && categoryList) {
      // 카테고리 설정
      const parentCategory = categoryList.find(cat =>
        cat.subcategories.some(sub => sub.subcategoryId === videoDetail.subcategoryId)
      )
      if (parentCategory) {
        setSelectedCategoryId(parentCategory.categoryId)
      }

      // 채널 URL 설정
      setChannelUrl(videoDetail.source || '')

      // 폼 데이터 설정
      setFormData({
        subcategoryId: videoDetail.subcategoryId,
        videoCaseTitle: videoDetail.title || '',
        videoCaseSummaryContent: videoDetail.summaryContent || '',
        videoCaseSource: videoDetail.source || '',
        videoCaseThumbnail: videoDetail.thumbnail || '',
        videoCaseChannelDescription: videoDetail.channelDescription || '',
        videoCaseChannelThumbnail: videoDetail.channelThumbnail || '',
        videoCaseHandleName: videoDetail.handleName || '',
        videoCaseChannelName: videoDetail.channelName || '',
        videoCaseTags: videoDetail.tags?.map(tag => tag.name) || [],
        videoCaseLawyerId: videoDetail.lawyerId,
        selectedLawyer: {
          lawyerId: videoDetail.lawyerId,
          lawyerName: videoDetail.lawyerName,
          lawyerLawfirmName: videoDetail.lawfirmName,
          lawyerProfileImage: videoDetail.lawyerProfileImage,
        },
        videoCaseSubscriberCount: videoDetail.subscriberCount || 0,
      })

      // 채널 정보가 로드되었음을 표시
      channelInfo.setChannelInfoFetched(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, videoDetail, categoryList])

  // 변호사 선택 핸들러
  const handleLawyerSelect = (lawyerId: number) => {
    lawyerSelection.handleLawyerSelect(lawyerId, selected => {
      setFormData(prev => ({
        ...prev,
        videoCaseLawyerId: selected.lawyerId,
        selectedLawyer: selected,
      }))
    })
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

    if (isEditMode) {
      // Edit mode - use edit mutation
      const editVideoRequest = {
        videoCaseTitle: formData.videoCaseTitle,
        videoCaseSummaryContent: formData.videoCaseSummaryContent,
        videoCaseSource: formData.videoCaseSource,
        videoCaseThumbnail: formData.videoCaseThumbnail,
        videoCaseChannelDescription: formData.videoCaseChannelDescription,
        videoCaseChannelThumbnail: formData.videoCaseChannelThumbnail,
        videoCaseHandleName: formData.videoCaseHandleName,
        videoCaseChannelName: formData.videoCaseChannelName,
        videoCaseTags: formData.videoCaseTags,
        videoCaseLawyerId: formData.videoCaseLawyerId,
        videoCaseSubcategoryId: formData.subcategoryId,
      }
      editVideoMutation.mutate(editVideoRequest)
    } else {
      // Create mode
      createVideoMutation.mutate(formData)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  // 태그 변경 핸들러
  const handleTagsChange = (values: string[]) => {
    if (values.length <= 10) {
      // 새로운 태그들을 정리 (공백 제거, 중복 제거)
      const cleanedTags = values.map(tag => tag.trim()).filter(tag => tag.length > 0)
      const uniqueTags = Array.from(new Set(cleanedTags))
      handleInputChange('videoCaseTags', uniqueTags)
    } else {
      message.warning('최대 10개까지 등록 가능합니다.')
    }
  }

  return (
    <>
      {portalContainer &&
        createPortal(
          <div className={styles['video-header']}>
            <Button onClick={handleCancel}>취소</Button>
            <Button
              type='primary'
              onClick={handleSave}
              loading={isEditMode ? editVideoMutation.isPending : createVideoMutation.isPending}
              disabled={!isFormValid(channelInfo.isChannelInfoFetched)}
            >
              {isEditMode ? '수정' : '저장'}
            </Button>
          </div>,
          portalContainer
        )}
      <div className={styles.videoEditor}>
        <h1 className={styles.videoEditor__title}>
          <span>♦</span> {isEditMode ? '영상정보수정' : '영상정보입력'}
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
              value={channelUrl}
              onChange={e => setChannelUrl(e.target.value)}
            />
          </div>
        </div>

        {/* 유튜브 채널정보 불러오기 버튼 (별도 섹션) */}
        <div className={styles.fetchButtonSection}>
          <Button
            type='primary'
            size='large'
            className={styles.fetchButton}
            onClick={() => channelInfo.handleFetchChannelInfo(channelUrl)}
            disabled={!channelUrl || channelInfo.isChannelLoading}
            loading={channelInfo.isChannelLoading}
          >
            유튜브 채널정보 불러오기
          </Button>
          {formData.videoCaseChannelName && (
            <div className={styles.channelInfoList}>
              <ul>
                <li>채널 명: {formData.videoCaseChannelName}</li>
                <li>구독자 수: {formatSubscriberCount(formData.videoCaseSubscriberCount)}</li>
                <li>핸들 명: {formData.videoCaseHandleName}</li>
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
              disabled={aiSummary.isSummaryLoading}
              onChange={e => handleInputChange('videoCaseSource', e.target.value)}
            />
            <Button
              type='primary'
              size='large'
              onClick={() => {
                // 유튜브 영상정보와 AI 요약을 동시에 실행
                getYoutubeVideoInfo({ videoUrl: formData.videoCaseSource })
                aiSummary.handleAiSummary(formData.videoCaseSource)
              }}
              loading={aiSummary.isSummaryLoading || isYoutubeVideoInfoLoading}
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
              placeholder={
                isYoutubeVideoInfoLoading || aiSummary.isSummaryLoading ? 'AI 요약중입니다...' : '제목을 입력해주세요.'
              }
              size='large'
              value={formData.videoCaseTitle}
              onChange={e => handleInputChange('videoCaseTitle', e.target.value)}
              disabled={isYoutubeVideoInfoLoading || aiSummary.isSummaryLoading}
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
              placeholder={
                isYoutubeVideoInfoLoading || aiSummary.isSummaryLoading
                  ? 'AI 요약중입니다...'
                  : '영상 내용을 입력해주세요.'
              }
              rows={4}
              value={formData.videoCaseSummaryContent}
              onChange={e => handleInputChange('videoCaseSummaryContent', e.target.value)}
              disabled={isYoutubeVideoInfoLoading || aiSummary.isSummaryLoading}
            />
          </div>
        </div>

        {/* 키워드/태그 */}
        <div className={styles.formRow}>
          <div className={styles.labelCol}>
            <label className={styles.label}>키워드/태그</label>
          </div>
          <div className={styles.inputCol}>
            <Select
              mode='tags'
              size='large'
              placeholder={
                isYoutubeVideoInfoLoading || aiSummary.isSummaryLoading
                  ? 'AI 요약중입니다...'
                  : `키워드를 입력하고 엔터를 누르세요 (${formData.videoCaseTags.length}/10)`
              }
              value={formData.videoCaseTags}
              onChange={handleTagsChange}
              disabled={isYoutubeVideoInfoLoading || aiSummary.isSummaryLoading}
              style={{ width: '100%' }}
              suffixIcon={null} // 화살표 아이콘 숨기기
              tagRender={TagRender}
              dropdownStyle={{ display: 'none' }} // 드롭다운 숨기기
              notFoundContent={null}
              open={false} // 드롭다운 항상 닫기
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
                  value={lawyerSelection.lawyerSearchName}
                  onChange={e => lawyerSelection.setLawyerSearchName(e.target.value)}
                  onPressEnter={lawyerSelection.handleSelectLawyer}
                  className={styles.lawyerInput}
                />
                <Button
                  size='large'
                  onClick={lawyerSelection.handleSelectLawyer}
                  disabled={!lawyerSelection.lawyerSearchName.trim()}
                >
                  검색하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 변호사 검색 모달 */}
      <Modal
        title='변호사 이름 검색'
        open={lawyerSelection.isLawyerModalOpen}
        onCancel={lawyerSelection.handleModalCancel}
        width={900}
        footer={null}
      >
        <div style={{ marginBottom: 16 }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder='변호사 이름을 검색해주세요'
              value={lawyerSelection.modalSearchQuery}
              onChange={e => lawyerSelection.setModalSearchQuery(e.target.value)}
              onPressEnter={lawyerSelection.handleModalSearch}
              size='large'
              style={{ flex: 1 }}
            />
            <Button type='primary' size='large' onClick={lawyerSelection.handleModalSearch} style={{ width: 100 }}>
              검색
            </Button>
          </Space.Compact>
        </div>

        <Table
          dataSource={lawyerSelection.searchData?.lawyerSearchResults || []}
          rowKey='lawyerId'
          loading={lawyerSelection.isLoading}
          pagination={false}
          locale={{
            emptyText: lawyerSelection.modalSearchQuery ? '검색 결과가 없습니다.' : '변호사 이름을 검색해주세요.',
          }}
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
    </>
  )
}

export default VideoEditor
