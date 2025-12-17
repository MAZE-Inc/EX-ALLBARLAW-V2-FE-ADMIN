import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './video-detail.module.scss'
import { useGetVideoDetail, useDeleteVideo } from '@/hooks/queries/useContent'
import DetailHeader from '@/container/content/detailHeader/DetailHeader'
import VideoPlayerContainer from '@/container/content/videoPlayerContainer/VideoPlayerContainer'
import VidoeInfo from '@/container/content/videoInfo/VidoeInfo'
import VideoSummary from '@/container/content/videoSummary/VideoSummary'
import { Button, Modal, message } from 'antd'
import { VIDEO_HEADER_PORTAL_ID } from '../videoMain/VideoPage'
import { ROUTE_PATH } from '@/routes/routePath'

const VideoDetail = () => {
  const { videoCaseId } = useParams()
  const navigate = useNavigate()
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const container = document.getElementById(VIDEO_HEADER_PORTAL_ID)
    setPortalContainer(container)
  }, [])

  const { data: videoDetail } = useGetVideoDetail({ videoCaseId: Number(videoCaseId) })
  console.log('Video Detail Data:', videoDetail)

  const handleRegisterVideo = () => {
    navigate(`${ROUTE_PATH.CONTENT_VIDEO}/edit`)
  }

  const handleEditVideo = () => {
    navigate(`${ROUTE_PATH.CONTENT_VIDEO}/edit/${videoCaseId}`)
  }

  const deleteVideoMutation = useDeleteVideo({
    videoCaseId: Number(videoCaseId),
    onSuccess: () => {
      message.success('영상이 삭제되었습니다.')
      navigate(ROUTE_PATH.CONTENT_VIDEO)
    },
    onError: () => {
      message.error('영상 삭제에 실패했습니다.')
    },
  })

  const handleDeleteVideo = () => {
    Modal.confirm({
      title: '영상 삭제',
      content: '정말로 이 영상을 삭제하시겠습니까?',
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: () => {
        deleteVideoMutation.mutate()
      },
    })
  }

  return (
    <>
      {portalContainer &&
        createPortal(
          <div className={styles['video-header']}>
            <Button onClick={handleEditVideo}>수정</Button>
            <Button danger onClick={handleDeleteVideo} loading={deleteVideoMutation.isPending}>삭제</Button>
            <Button type='primary' onClick={handleRegisterVideo}>
              영상정보 글 등록
            </Button>
          </div>,
          portalContainer
        )}
      <div className={styles['video-detail']}>
      <DetailHeader title={videoDetail?.title || ''} />
      <section className={styles['video-detail-container']}>
        <div className={styles['video-detail-lawyer']}>
          <figure className={styles['video-detail-lawyer-image']}>
            <img src={videoDetail?.lawyerProfileImage || ''} alt='변호사 프로필' />
          </figure>
          <div className={styles['video-detail-lawyer-content']}>
            <span className={styles['video-detail-lawyer-name']}>{videoDetail?.lawyerName || ''} 변호사</span>
            <span className={styles['video-detail-lawyer-lawfirm']}>{videoDetail?.lawfirmName || ''}</span>
          </div>
        </div>

        <VideoPlayerContainer videoUrl={videoDetail?.source} tags={videoDetail?.tags} />
        <div className={styles['video-detail-content']}>
          <VidoeInfo
            channelThumbnail={videoDetail?.channelThumbnail || ''}
            channelName={videoDetail?.channelName || ''}
            handleName={videoDetail?.handleName || ''}
            subscriberCount={videoDetail?.subscriberCount || 0}
            channelDescription={videoDetail?.channelDescription || ''}
            source={videoDetail?.source || ''}
          />
          <VideoSummary summary={videoDetail?.summaryContent || ''} />
        </div>
      </section>
      </div>
    </>
  )
}

export default VideoDetail
