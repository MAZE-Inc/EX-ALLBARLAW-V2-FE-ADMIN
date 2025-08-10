import YoutubePlayer from '@/components/youtubePlayer/YoutubePlayer'
import { extractYouTubeVideoId } from '@/utils/youtubeUtils'
import styles from './video-player-container.module.scss'

type VideoPlayerContainerProps = {
  videoUrl?: string
  tags?: { id: number; name: string }[]
  className?: string
  maxWidth?: string | number
}

const VideoPlayerContainer = ({ videoUrl, tags = [], className, maxWidth }: VideoPlayerContainerProps) => {
  // 비디오 URL 유효성 검사
  const isValidVideoUrl = videoUrl && extractYouTubeVideoId(videoUrl)

  // 컨테이너 스타일 - maxWidth가 명시적으로 설정된 경우에만 적용
  const containerStyle = maxWidth ? { width: '100%', maxWidth } : {}

  // 클래스명 조합 - 외부 className이 뒤에 와서 더 높은 우선순위를 가짐
  const wrapperClassName = `${styles['video-player-wrapper']} ${className || ''}`.trim()

  if (!isValidVideoUrl) {
    return (
      <div className={wrapperClassName} style={containerStyle}>
        <div className={styles['video-error']}>
          {!videoUrl ? '비디오를 불러올 수 없습니다.' : '유효하지 않은 YouTube 링크입니다.'}
        </div>
        {tags.length > 0 && (
          <div className={styles['video-tag-list']}>
            {tags.map(tag => (
              <span key={tag.id}>#{tag.name}</span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={wrapperClassName} style={containerStyle}>
      <div className={styles['video-player-container']}>
        <YoutubePlayer url={videoUrl} />
      </div>
      {tags.length > 0 && (
        <div className={styles['video-tag-list']}>
          {tags.map(tag => (
            <span key={tag.id} className={styles['tag-item']}>
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default VideoPlayerContainer
