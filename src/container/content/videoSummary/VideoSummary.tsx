import { Divider } from 'antd'
import ReactMarkdown from 'react-markdown'
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
      <div className={styles['description']}>
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  )
}

export default VideoSummary
