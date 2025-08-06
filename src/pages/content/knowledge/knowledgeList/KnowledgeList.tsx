import { useInfiniteKnowledgeList } from '@/hooks/queries/useContent'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './knowledgeList.module.scss'
import { ROUTE_PATH } from '@/routes/routePath'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import { Divider } from 'antd'

const KnowledgeList = () => {
  const { subCategoryId } = useParams()
  const navigate = useNavigate()

  const { knowledgeList, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteKnowledgeList({
    subcategoryId: subCategoryId ? Number(subCategoryId) : 'all',
  })

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.knowledge-list-container',
  })

  const handleClickKnowledge = (knowledgeCaseId: number) => {
    console.log(knowledgeCaseId)
    navigate(`${ROUTE_PATH.CONTENT}/${ROUTE_PATH.CONTENT_KNOWLEDGE}/${subCategoryId}/${knowledgeCaseId}`)
  }

  return (
    <main className={styles['knowledge-list']}>
      <section className={`${styles['knowledge-list-container']} knowledge-list-container`}>
        {knowledgeList?.map(knowledge => (
          <>
            <LegalKnowledgeItem
              title={knowledge.knowledgeTitle}
              description={knowledge.summaryContent}
              time={new Date(knowledge.lastMessageAt)}
              lawyerList={knowledge.lawyers || []}
              isLastAnswer={true}
              onClick={() => handleClickKnowledge(knowledge.knowledgeId)}
            />
            <Divider />
          </>
        ))}
      </section>
    </main>
  )
}

export default KnowledgeList
