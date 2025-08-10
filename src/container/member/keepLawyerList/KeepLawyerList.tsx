import React from 'react'
import styles from './keepLawyerList.module.scss'
import LawyerHorizon from '@/components/lawyer/LawyerHorizon'
import { Divider } from 'antd'
import { useMemberKeppLawyerList } from '@/hooks/queries/useMember'
import EmptyState from '@/components/emptyState/EmptyState'

const KeepLawyerList = ({ userId }: { userId: number }) => {
  const { data: lawyerList } = useMemberKeppLawyerList(userId)

  console.log(lawyerList)

  // 빈 상태 체크
  if (lawyerList?.length === 0) {
    return (
      <div className={styles.keepLawyerList}>
        <EmptyState icon='⚖️' message='Keep한 변호사가 없습니다' />
      </div>
    )
  }

  return (
    <div className={styles.keepLawyerList}>
      {lawyerList?.map((item, index) => (
        <React.Fragment key={item.lawyerId}>
          <LawyerHorizon
            name={item.lawyerName}
            profileImage={item.lawyerProfileImage}
            description={item.lawyerDescription}
            lawfirm={item.lawfirmName}
            onClick={() => console.log('Lawyer clicked:', item.lawyerId)}
          />
          {index !== lawyerList.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </div>
  )
}

export default KeepLawyerList
