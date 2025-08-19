import styles from './lawyerVideo.module.scss'
import { forwardRef } from 'react'
import { LawyerDetailResponse } from '@/types/lawyerTypes'
import { RightOutlined } from '@ant-design/icons'
import { Divider } from 'antd'
import VideoHorizon from '@/components/video/VideoHorizon'

type LawyerVideoProps = {
  videoList: LawyerDetailResponse['videoCases'] | []
  lawyerId: number
  lawyerName: string
}

const LawyerVideo = forwardRef<HTMLElement, LawyerVideoProps>(({ videoList = [], lawyerId, lawyerName }, ref) => {
  const hasVideos = videoList && videoList.length > 0

  const handleMoreVideo = () => {
    window.open(`${import.meta.env.VITE_USER_URL}/search/video?q=${lawyerName}&lawyerId=${lawyerId}`, '_blank')
  }

  return (
    <section ref={ref} className={styles['lawyer-video']} aria-label='변호사의 영상'>
      <header className={styles['lawyer-video__header']}>
        <h3 className={styles['lawyer-video__title']}>변호사의 영상</h3>
        {hasVideos && (
          <button
            type='button'
            className={styles['lawyer-video__button']}
            aria-label='변호사의 영상 더보기'
            onClick={handleMoreVideo}
          >
            더보기
            <RightOutlined />
          </button>
        )}
      </header>
      <Divider style={{ margin: '14px 0' }} />
      {hasVideos ? (
        <ul className={styles['lawyer-video__list']} role='list'>
          {videoList.map((video, index) => (
            <li key={video.videoCaseId}>
              <VideoHorizon
                videoCaseId={video.videoCaseId}
                isKeep={video.isKeep}
                size='small'
                thumbnailUrl={video.thumbnail}
                title={video.title}
                summaryContents={video.summaryContent}
              />
              {index !== videoList.length - 1 && <Divider style={{ margin: '12px 0' }} />}
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles['lawyer-video__empty']}>
          <p className={styles['lawyer-video__empty-text']}>등록된 영상이 없습니다</p>
        </div>
      )}
    </section>
  )
})

LawyerVideo.displayName = 'LawyerVideo'

export default LawyerVideo
