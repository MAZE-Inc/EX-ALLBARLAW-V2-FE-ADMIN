import { Divider } from 'antd'
import styles from './keepBlogList.module.scss'
import BlogItem from '@/components/blogItem/BlogItem'
import { useMemberKeppBlogList } from '@/hooks/queries/useMember'
import { Fragment } from 'react/jsx-runtime'
import EmptyState from '@/components/emptyState/EmptyState'

const KeepBlogList = ({ userId }: { userId: number }) => {
  const { data: blogList } = useMemberKeppBlogList(userId)

  // 빈 상태 체크
  if (blogList?.length === 0) {
    return (
      <div className={styles.keepBlogList}>
        <EmptyState message='Keep한 컨텐츠가 없습니다' />
      </div>
    )
  }

  return (
    <div className={styles.keepBlogList}>
      {blogList?.map((item, index) => (
        <Fragment key={item.blogCaseId}>
          <BlogItem key={item.blogCaseId} item={item} className={styles.blogItem} />
          {index !== blogList.length - 1 && <Divider />}
        </Fragment>
      ))}
    </div>
  )
}

export default KeepBlogList
