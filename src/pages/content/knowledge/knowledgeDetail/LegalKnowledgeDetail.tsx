import { useParams } from 'react-router-dom'
import styles from './legal-knowledge-detail.module.scss'
// import ConsultationContentCard from '@/components/consultationContentCard/ConsultationContentCard'
// import LawyerResponse from '@/container/legalKnowledge/LawyerResponse'
// import ContentsRecommender from '@/components/aiRecommender/ContentsRecommender'
// import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import { getRelativeTimeString } from '@/utils/date'
import { useGetKnowledgeDetail } from '@/hooks/queries/useContent'
import DetailHeader from '@/container/content/detailHeader/DetailHeader'
import ConsultationContentCard from '@/components/consultationContentCard/ConsultationContentCard'
import LawyerResponse from '@/container/content/lawyerResponse/LawyerResponse'

const LegalKnowledgeDetail = () => {
  const { knowledgeId } = useParams<{ knowledgeId: string }>()

  const { data } = useGetKnowledgeDetail({ knowledgeId: Number(knowledgeId) })

  const handleShare = () => {
    console.log('공유하기 - 법률 지식:', knowledgeId)
    // 실제 공유 로직 구현
  }

  const handleSave = () => {
    console.log('저장하기 - 법률 지식:', knowledgeId)
    // 실제 저장 로직 구현
  }

  return (
    <main>
      <header>
        <DetailHeader title={data?.knowledgeTitle || ''} />
      </header>
      <article className={styles['detail-body']}>
        <ConsultationContentCard
          content={data?.knowledgeDescription}
          tags={data?.tags}
          lastAnswerTime={data?.lastMessageAt ? getRelativeTimeString(data.lastMessageAt) : ''}
          onShare={handleShare}
          onSave={handleSave}
        />
        {data?.lawyers && (
          <section>
            <LawyerResponse lawyers={data?.lawyers} />
          </section>
        )}
      </article>
    </main>
  )
}

export default LegalKnowledgeDetail
