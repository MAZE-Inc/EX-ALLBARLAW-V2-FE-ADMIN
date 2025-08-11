import React from 'react'
import styles from './keepLegalDictionary.module.scss'
import LegalTermItem from '@/components/legalTermItem/LegalTermItem'
import { Divider } from 'antd'
import { useInfiniteMemberKeepLegalDictionaryList } from '@/hooks/queries/useMember'
import EmptyState from '@/components/emptyState/EmptyState'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const KeepLegalDictionary = ({ userId, sort }: { userId: number; sort: 'asc' | 'desc' }) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMemberKeepLegalDictionaryList(
    userId,
    sort
  )

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.keep-legal-dictionary-container',
  })

  // 빈 상태 체크
  const isEmpty = !data?.pages || data.pages.every(page => !page?.data || page.data.length === 0)

  if (isEmpty && !isFetchingNextPage) {
    return (
      <div className={styles.keepLegalDictionary}>
        <EmptyState icon='📖' message='Keep한 법률용어가 없습니다' />
      </div>
    )
  }

  return (
    <div className={`${styles.keepLegalDictionary} keep-legal-dictionary-container`}>
      {data?.pages.map(page =>
        page?.data?.map((item, index) => (
          <React.Fragment key={item.legalTermId}>
            <LegalTermItem
              legalTermId={item.legalTermId}
              koreanName={item.legalTermKoreanName}
              chineseName={item.legalTermChineseName}
              englishName={item.legalTermEnglishName}
              onClick={() => console.log('Legal term clicked:', item.legalTermId)}
            />
            {index !== page.data.length - 1 && <Divider />}
          </React.Fragment>
        ))
      )}
    </div>
  )
}

export default KeepLegalDictionary
