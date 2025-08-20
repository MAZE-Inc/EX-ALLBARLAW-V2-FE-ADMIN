import styles from '@/components/video/video-horizon.module.scss'

type VideoHorizonProps = {
  type?: 'default' | 'search' | 'reverse'
  size?: 'xsmall' | 'small' | 'regular' | 'large'
  title?: string
  thumbnailUrl?: string
  isKeep?: boolean
  lawyerName?: string
  lawfirmName?: string
  channelName?: string
  channelThumbnail?: string
  className?: string
  summaryContents?: string
  onClick?: () => void
  videoCaseId?: number
}

const VideoHorizon = ({
  type = 'default',
  size = 'regular',
  thumbnailUrl,
  title,
  lawyerName,
  lawfirmName,
  channelName,
  channelThumbnail,
  className,
  summaryContents,
  onClick,
}: VideoHorizonProps) => {
  const rootClassName = [styles['video-horizon'], styles[type], styles[size]].filter(Boolean).join(' ')

  return (
    <div
      className={`${rootClassName} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <figure className={styles['video-horizon-figure']}>
        <img className={styles.img} src={thumbnailUrl} alt='동영상 썸네일' />
      </figure>
      <section className={styles['video-content-section']}>
        <header className={styles['video-content-section-header']}>
          <h1>{title}</h1>
        </header>
        <p>{summaryContents}</p>
        {lawyerName && (
          <div className={styles['video-content-section-footer']}>
            <span className={styles.lawyer}>
              {lawyerName} 변호사 [{lawfirmName}]
            </span>
            <figure className={styles['video-content-section-footer-figure']}>
              <img src={channelThumbnail} alt='유튜브 채널 이미지' />
              <span className={styles.lawfirm}>{channelName}</span>
            </figure>
          </div>
        )}
      </section>
    </div>
  )
}

export default VideoHorizon
