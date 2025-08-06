import { Divider } from 'antd'
import styles from './video-summary.module.scss'

type VideoSummaryProps = {
  summary: string
}

const VideoSummary = ({ summary }: VideoSummaryProps) => {
  return (
    <div className={styles['container']}>
      <header>
        <h3 className={styles['title']}>AI 영상 요약</h3>
      </header>
      <Divider style={{ margin: '1rem 0' }} />
      <p className={styles['description']}>{summary}</p>
    </div>
  )
}

export default VideoSummary
