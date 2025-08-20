import styles from './lawyerLegalKnowledge.module.scss'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import { forwardRef } from 'react'
import { LawyerDetailResponse } from '@/types/lawyerTypes'
import { RightOutlined } from '@ant-design/icons'
import { Divider } from 'antd'

type LawyerLegalKnowledgeProps = {
  knowledgeList: LawyerDetailResponse['consultationRequests'] | []
  lawyerId: number
  lawyerName: string
}

const LawyerLegalKnowledge = forwardRef<HTMLElement, LawyerLegalKnowledgeProps>(
  ({ knowledgeList = [], lawyerId, lawyerName }, ref) => {
    const hasKnowledge = knowledgeList.length > 0

    const handleMoreKnowledge = () => {
      window.open(
        `${import.meta.env.VITE_USER_URL}/search/legal-knowledge?q=${lawyerName}&lawyerId=${lawyerId}`,
        '_blank'
      )
    }

    return (
      <section ref={ref} className={styles['lawyer-legal-knowledge']} aria-label='변호사의 법률 지식'>
        <header className={styles['lawyer-legal-knowledge__header']}>
          <h3 className={styles['lawyer-legal-knowledge__title']}>변호사의 법률 지식</h3>
          {hasKnowledge && (
            <button
              type='button'
              className={styles['lawyer-legal-knowledge__button']}
              aria-label='변호사의 법률 지식 더보기'
              onClick={handleMoreKnowledge}
            >
              더보기
              <RightOutlined />
            </button>
          )}
        </header>
        <Divider style={{ margin: '14px 0' }} />
        {hasKnowledge ? (
          <ul className={styles['lawyer-legal-knowledge__list']} role='list'>
            {knowledgeList.map((knowledge, index) => (
              <li key={knowledge.knowledgeId}>
                <LegalKnowledgeItem
                  title={knowledge.knowledgeTitle}
                  description={knowledge.summaryContent}
                  time={new Date(knowledge.lastMessageAt || '')}
                  isLastAnswer={false}
                  lawyerList={knowledge.lawyers}
                />
                {index !== knowledgeList.length - 1 && <Divider style={{ margin: '24px 0' }} />}
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles['lawyer-legal-knowledge__empty']}>
            <p className={styles['lawyer-legal-knowledge__empty-text']}>등록된 법률 지식이 없습니다</p>
          </div>
        )}
      </section>
    )
  }
)

LawyerLegalKnowledge.displayName = 'LawyerLegalKnowledge'

export default LawyerLegalKnowledge
