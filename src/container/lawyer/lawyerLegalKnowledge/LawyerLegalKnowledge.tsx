import Divider from '@/components/divider/Divider'
import SvgIcon from '@/components/SvgIcon'
import styles from './lawyerLegalKnowledge.module.scss'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import { forwardRef } from 'react'
import { LawyerDetailResponse } from '@/types/lawyerTypes'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '@/stores/searchStore'

type LawyerLegalKnowledgeProps = {
  knowledgeList: LawyerDetailResponse['consultationRequests'] | []
  lawyerId: number
  lawyerName: string
}

const LawyerLegalKnowledge = forwardRef<HTMLElement, LawyerLegalKnowledgeProps>(
  ({ knowledgeList = [], lawyerId, lawyerName }, ref) => {
    const navigate = useNavigate()
    const { setSearchLawyerId, setSearchQuery } = useSearchStore()
    const hasKnowledge = knowledgeList.length > 0

    const handleMoreKnowledge = () => {
      // 검색어는 지우고 변호사 ID만 설정하여 해당 변호사의 모든 법률 지식 표시
      setSearchQuery(lawyerName)
      setSearchLawyerId(lawyerId)
      navigate(`/search/legal-knowledge`)
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
              <SvgIcon name='arrowSmall' className={styles['lawyer-legal-knowledge__button-icon']} size={14} />
            </button>
          )}
        </header>
        <Divider padding={14} />
        {hasKnowledge ? (
          <ul className={styles['lawyer-legal-knowledge__list']} role='list'>
            {knowledgeList.map((knowledge, index) => (
              <li key={knowledge.knowledgeId}>
                <LegalKnowledgeItem
                  knowledgeId={knowledge.knowledgeId}
                  knowledgeKeep={knowledge.isKeep}
                  title={knowledge.knowledgeTitle}
                  description={knowledge.summaryContent}
                  isLastAnswer={false}
                />
                {index !== knowledgeList.length - 1 && (
                  <Divider padding={24} className={styles['lawyer-legal-knowledge__divider']} />
                )}
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
