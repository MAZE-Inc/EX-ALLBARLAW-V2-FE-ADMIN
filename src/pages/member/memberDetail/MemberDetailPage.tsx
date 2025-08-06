import { useLocation } from 'react-router-dom'
import { Member, MemberInfoItem } from '@/types/memberType'
import dayjs from 'dayjs'
import styles from './memberDetail.module.scss'
import MemberInfo from '@/container/member/memberInfo/MemberInfo'
import MemberKeepList from '@/container/member/memberKeepList/MemberKeepList'

const MemberDetailPage = () => {
  const location = useLocation()
  const userInfo = location.state?.userInfo as Member

  if (!userInfo) {
    return <div>사용자 정보를 찾을 수 없습니다.</div>
  }

  const memberInfoItems: MemberInfoItem[] = [
    { label: '아이디', key: 'userAccount' },
    { label: '이메일주소', key: 'userEmail' },
    { label: '인증 전화번호', key: 'userPhone' },
    {
      label: '가입일시',
      key: 'userCreatedAt',
      formatter: (value: string) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm') : ''),
    },
    {
      label: '계정상태',
      key: 'userIsActive',
      formatter: (value: boolean) => (value ? '사용중' : '정지'),
    },
  ]

  return (
    <div className={styles.memberDetail}>
      <MemberInfo title='가입정보' items={memberInfoItems} sectionNumber={1} userInfo={userInfo} />
      <MemberKeepList />
    </div>
  )
}

export default MemberDetailPage
