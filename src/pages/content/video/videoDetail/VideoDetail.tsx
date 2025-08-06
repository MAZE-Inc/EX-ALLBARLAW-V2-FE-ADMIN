import { useParams } from 'react-router-dom'
import styles from './video-detail.module.scss'
import { useGetVideoDetail } from '@/hooks/queries/useContent'
import DetailHeader from '@/container/content/detailHeader/DetailHeader'
import VideoPlayerContainer from '@/container/content/videoPlayerContainer/VideoPlayerContainer'
import VidoeInfo from '@/container/content/videoInfo/VidoeInfo'
import VideoSummary from '@/container/content/videoSummary/VideoSummary'

const VideoDetail = () => {
  const { videoCaseId } = useParams()
  const { data: videoDetail } = useGetVideoDetail({ videoCaseId: Number(videoCaseId) })
  console.log('Video Detail Data:', videoDetail)

  return (
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
  )
}

export default VideoDetail
