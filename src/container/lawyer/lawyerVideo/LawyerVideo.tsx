import Divider from '@/components/divider/Divider'
import SvgIcon from '@/components/SvgIcon'
import styles from './lawyerVideo.module.scss'
import VideoHorizon from '@/components/video/VideoHorizon'
import { forwardRef } from 'react'
import { LawyerDetailResponse } from '@/types/lawyerTypes'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '@/stores/searchStore'

type LawyerVideoProps = {
  videoList: LawyerDetailResponse['videoCases'] | []
  lawyerId: number
  lawyerName: string
}

const LawyerVideo = forwardRef<HTMLElement, LawyerVideoProps>(({ videoList = [], lawyerId, lawyerName }, ref) => {
  const navigate = useNavigate()
  const { setSearchLawyerId, setSearchQuery } = useSearchStore()
  const hasVideos = videoList && videoList.length > 0

  const handleMoreVideo = () => {
    setSearchQuery(lawyerName)
    setSearchLawyerId(lawyerId)
    navigate(`/search/video`)
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
            <SvgIcon name='arrowSmall' className={styles['lawyer-video__button-icon']} size={14} />
          </button>
        )}
      </header>
      <Divider padding={14} />
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
              {index !== videoList.length - 1 && <Divider padding={12} className={styles['lawyer-video__divider']} />}
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
