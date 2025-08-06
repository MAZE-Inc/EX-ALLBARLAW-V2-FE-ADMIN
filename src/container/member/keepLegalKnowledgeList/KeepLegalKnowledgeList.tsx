import styles from './keepLegalKnowledgeList.module.scss'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import { Divider } from 'antd'

const KeepLegalKnowledgeList = () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  // const array: number[] = [] // 빈 상태 테스트용

  // 빈 상태 체크
  if (array.length === 0) {
    return (
      <div className={styles.keepLegalKnowledgeList}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🤔</div>
          <p className={styles.emptyMessage}>Keep한 법률지식인이 없습니다</p>
          <p className={styles.emptySubMessage}>관심있는 질문을 Keep해보세요!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.keepLegalKnowledgeList}>
      {array.map((item, index) => (
        <>
          <LegalKnowledgeItem
            key={item}
            title='법률정보의 글'
            description={`음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 
    처벌받을 수 있습니다.혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다.
    음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다.
    혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다.`}
            time={new Date()}
            isLastAnswer={true}
            lawyerList={[
              { lawyerId: 1, lawyerProfileImage: 'https://picsum.photos/150/150', lawyerName: '법률정보의 글' },
            ]}
          />
          {index !== array.length - 1 && <Divider />}
        </>
      ))}
    </div>
  )
}

export default KeepLegalKnowledgeList
