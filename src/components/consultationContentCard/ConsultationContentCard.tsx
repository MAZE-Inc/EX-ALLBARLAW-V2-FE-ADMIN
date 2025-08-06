import { Card, Divider } from 'antd'
import ReactMarkdown from 'react-markdown'
import styles from './consultation-content-card.module.scss'
import { markdownComponents } from '@/utils/markdownComponents'

interface ConsultationContentCardProps {
  title?: string
  content?: string
  lastAnswerTime?: string
  onShare?: () => void
  onSave?: () => void
  isSaved?: boolean
  className?: string
  tags?: string[]
}

const ConsultationContentCard = ({
  title = '상담 내용',
  content,
  lastAnswerTime = '3시간전',
  tags,
  className,
}: ConsultationContentCardProps) => {
  return (
    <div className={styles['consultation-content-card']}>
      <Card className={`${styles['card-container']} ${className || ''}`}>
        <header className={styles['card-header']}>
          <h4>{title}</h4>
          <div className={styles['card-header-meta']}>
            <span className={styles['last-answer-time']}>
              <strong>{lastAnswerTime}</strong> 마지막 답변
            </span>
          </div>
        </header>
        <Divider />
        <div className={styles['card-content']}>
          <ReactMarkdown components={markdownComponents}>{content || '내용이 없습니다.'}</ReactMarkdown>
        </div>
      </Card>
      <div className={styles['tag-list']}>
        {tags?.map(tag => (
          <div className={styles['tag-item']}>
            <span className={styles['tag-item-text']}>#{tag}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConsultationContentCard
