import { useParams } from 'react-router-dom'
import styles from './video-detail.module.scss'

const VideoDetail = () => {
  const { subCategoryId, videoCaseId } = useParams()

  return (
    <div className={styles['video-detail']}>
      <h1>Video Detail</h1>
      <p>Subcategory ID: {subCategoryId}</p>
      <p>Video Case ID: {videoCaseId}</p>
      {/* TODO: 비디오 상세 정보 구현 */}
    </div>
  )
}

export default VideoDetail