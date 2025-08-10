import React from 'react'
import styles from './keepLegalDictionary.module.scss'
import LegalTermItem from '@/components/legalTermItem/LegalTermItem'
import { Divider } from 'antd'
import { useMemberKeppLegalDictionaryList } from '@/hooks/queries/useMember'
import EmptyState from '@/components/emptyState/EmptyState'

const KeepLegalDictionary = ({ userId }: { userId: number }) => {
  const { data: legalDictionaryList } = useMemberKeppLegalDictionaryList(userId)

  if (legalDictionaryList?.length === 0) {
    return (
      <div className={styles.keepLegalDictionary}>
        <EmptyState icon='📖' message='Keep한 법률용어가 없습니다' />
      </div>
    )
  }

  return (
    <div className={styles.keepLegalDictionary}>
      {legalDictionaryList?.map((item, index) => (
        <React.Fragment key={item.legalTermId}>
          <LegalTermItem
            legalTermId={item.legalTermId}
            koreanName={item.legalTermKoreanName}
            chineseName={item.legalTermChineseName}
            englishName={item.legalTermEnglishName}
            onClick={() => console.log('Legal term clicked:', item.legalTermId)}
          />
          {index !== legalDictionaryList.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </div>
  )
}

export default KeepLegalDictionary
