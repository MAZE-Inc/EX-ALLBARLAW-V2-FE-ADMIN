import styles from './video-thumbnail.module.scss'

type VideoThumbnailProps = {
  size: 'x-small' | 'small' | 'large' | 'text'
  imgUrl?: string
  title?: string
  lawyerName?: string
  description?: string
  onClick?: () => void
}

const VideoThumbnail = ({ size = 'small', imgUrl, title, description, lawyerName, onClick }: VideoThumbnailProps) => {
  return (
    <div
      className={`${styles.container} ${styles[size]}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <figure>
        <img src={imgUrl} alt={title} className={styles.image} />
      </figure>
      <div className={styles.content}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {lawyerName && <p className={styles['lawyer-name']}>{lawyerName} 변호사</p>}
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  )
}

export default VideoThumbnail
