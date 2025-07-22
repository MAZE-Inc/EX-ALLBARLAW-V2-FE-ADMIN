import { Divider } from 'antd'
import styles from './keepBlogList.module.scss'
import BlogItem from '@/components/blogItem/BlogItem'

const KeepBlogList = () => {
  // 실제 데이터가 없을 때를 시뮬레이션하려면 빈 배열로 변경
  // const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // 데이터가 있을 때
  const array: number[] = [] // 데이터가 없을 때 테스트용

  const mockItem = {
    blogCaseId: 1,
    title: '법률정보의 글',
    summaryContent: `음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 
    처벌받을 수 있습니다.혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다.
    음주후 주차장등에서 잠깐 운전하다가 적발될 경우, 처벌받을 수 있습니다.
    혈중알코올 농도가 0.03% 이상이면 음주운전으로 간주되어 처벌대상이 됩니다.`,
    subcategoryId: 1,
    thumbnail: 'https://picsum.photos/400/300',
    lawyerName: '법률정보의 글',
    lawfirmName: '법률정보의 글',
    lawyerId: 1,
    lawyerProfileImage: 'https://picsum.photos/150/150',
    isKeep: true,
  }

  // 빈 상태 체크
  if (array.length === 0) {
    return (
      <div className={styles.keepBlogList}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <p className={styles.emptyMessage}>Keep한 컨텐츠가 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.keepBlogList}>
      {array.map((item, index) => (
        <>
          <BlogItem key={item} item={mockItem} className={styles.blogItem} />
          {index !== array.length - 1 && <Divider />}
        </>
      ))}
    </div>
  )
}

export default KeepBlogList
