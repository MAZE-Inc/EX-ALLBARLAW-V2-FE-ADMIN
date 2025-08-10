import React from 'react'
import styles from './keepLegalKnowledgeList.module.scss'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import { Divider } from 'antd'
import { useInfiniteMemberKeepLegalKnowledgeList } from '@/hooks/queries/useMember'
import EmptyState from '@/components/emptyState/EmptyState'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useNavigate } from 'react-router-dom'

const KeepLegalKnowledgeList = ({ userId }: { userId: number }) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMemberKeepLegalKnowledgeList(userId)
  const navigate = useNavigate()

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.keep-legal-knowledge-list-container',
  })

  // 빈 상태 체크
  const isEmpty = !data?.pages || data.pages.every(page => !page?.data || page.data.length === 0)

  if (isEmpty && !isFetchingNextPage) {
    return (
      <div className={styles.keepLegalKnowledgeList}>
        <EmptyState icon='📚' message='Keep한 법률지식이 없습니다' />
      </div>
    )
  }

  const handleClickLegalKnowledge = (knowledgeId: number) => {
    navigate(`/content/content-knowledge/all/${knowledgeId}`)
  }

  return (
    <div className={`${styles.keepLegalKnowledgeList} keep-legal-knowledge-list-container`}>
      {data?.pages.map(page =>
        page?.data?.map((item, index) => (
          <React.Fragment key={item.knowledgeId}>
            <LegalKnowledgeItem
              onClick={() => handleClickLegalKnowledge(item.knowledgeId)}
              title={item.knowledgeTitle}
              description={item.summaryContent}
              time={new Date(item.lastMessageAt)}
              isLastAnswer={true}
              lawyerList={item.lawyers}
            />
            {index !== page.data.length - 1 && <Divider />}
          </React.Fragment>
        ))
      )}
    </div>
  )
}

export default KeepLegalKnowledgeList
