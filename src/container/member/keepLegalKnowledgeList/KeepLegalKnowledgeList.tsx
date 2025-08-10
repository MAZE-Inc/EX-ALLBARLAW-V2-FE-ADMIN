import React from 'react'
import styles from './keepLegalKnowledgeList.module.scss'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import { Divider } from 'antd'
import { useMemberKeppLegalKnowledgeList } from '@/hooks/queries/useMember'
import EmptyState from '@/components/emptyState/EmptyState'

const KeepLegalKnowledgeList = ({ userId }: { userId: number }) => {
  const { data: legalKnowledgeList } = useMemberKeppLegalKnowledgeList(userId)

  // 빈 상태 체크
  if (legalKnowledgeList?.length === 0) {
    return (
      <div className={styles.keepLegalKnowledgeList}>
        <EmptyState icon='📚' message='Keep한 법률지식이 없습니다' />
      </div>
    )
  }

  return (
    <div className={styles.keepLegalKnowledgeList}>
      {legalKnowledgeList?.map((item, index) => (
        <React.Fragment key={item.knowledgeId}>
          <LegalKnowledgeItem
            title={item.knowledgeTitle}
            description={item.summaryContent}
            time={new Date(item.lastMessageAt)}
            isLastAnswer={true}
            lawyerList={item.lawyers}
          />
          {index !== legalKnowledgeList.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </div>
  )
}

export default KeepLegalKnowledgeList
