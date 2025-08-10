import React from 'react'
import { Divider } from 'antd'
import styles from './keepBlogList.module.scss'
import BlogItem from '@/components/blogItem/BlogItem'
import { useInfiniteMemberKeepBlogList } from '@/hooks/queries/useMember'
import EmptyState from '@/components/emptyState/EmptyState'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useNavigate } from 'react-router-dom'

const KeepBlogList = ({ userId }: { userId: number }) => {
  const navigate = useNavigate()
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMemberKeepBlogList(userId)

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.keep-blog-list-container',
  })

  // 빈 상태 체크
  const isEmpty = !data?.pages || data.pages.every(page => !page?.data || page.data.length === 0)

  if (isEmpty && !isFetchingNextPage) {
    return (
      <div className={styles.keepBlogList}>
        <EmptyState message='Keep한 컨텐츠가 없습니다' />
      </div>
    )
  }

  const handleClickBlog = (blogCaseId: number) => {
    navigate(`/content/content-blog/all/${blogCaseId}`)
  }

  return (
    <div className={`${styles.keepBlogList} keep-blog-list-container`}>
      {data?.pages.map(page =>
        page?.data?.map((item, index) => (
          <React.Fragment key={item.blogCaseId}>
            <BlogItem item={item} className={styles.blogItem} onClick={() => handleClickBlog(item.blogCaseId)} />
            {index !== page.data.length - 1 && <Divider />}
          </React.Fragment>
        ))
      )}
    </div>
  )
}

export default KeepBlogList
