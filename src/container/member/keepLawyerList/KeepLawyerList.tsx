import React from 'react'
import styles from './keepLawyerList.module.scss'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import { Divider } from 'antd'
import { useInfiniteMemberKeepLawyerList } from '@/hooks/queries/useMember'
import EmptyState from '@/components/emptyState/EmptyState'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const KeepLawyerList = ({ userId }: { userId: number }) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMemberKeepLawyerList(userId)

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.keep-lawyer-list-container',
  })

  // 빈 상태 체크
  const isEmpty = !data?.pages || data.pages.every(page => !page?.data || page.data.length === 0)

  if (isEmpty && !isFetchingNextPage) {
    return (
      <div className={styles.keepLawyerList}>
        <EmptyState icon='⚖️' message='Keep한 변호사가 없습니다' />
      </div>
    )
  }

  // const handleClickLawyer = (lawyerId: number) => {
  //   navigate(`/content/content-lawyer/all/${lawyerId}`)
  // }

  return (
    <div className={`${styles.keepLawyerList} keep-lawyer-list-container`}>
      {data?.pages.map(page =>
        page?.data?.map((item, index) => (
          <React.Fragment key={item.lawyerId}>
            <LawyerHorizon
              name={item.lawyerName}
              profileImage={item.lawyerProfileImage}
              description={item.lawyerDescription}
              lawfirm={item.lawfirmName}
              // onClick={() => handleClickLawyer(item.lawyerId)}
            />
            {index !== page.data.length - 1 && <Divider />}
          </React.Fragment>
        ))
      )}
    </div>
  )
}

export default KeepLawyerList
