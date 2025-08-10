import React from 'react'
import BlogItem from '@/components/blogItem/BlogItem'
import { useInfiniteBlogList } from '@/hooks/queries/useContent'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import styles from './blogList.module.scss'
import { Divider } from 'antd'
import { ROUTE_PATH } from '@/routes/routePath'
import { useNavigate, useParams } from 'react-router-dom'
import EmptyState from '@/components/emptyState/EmptyState'

const BlogList = () => {
  const navigate = useNavigate()
  const { subCategoryId } = useParams<{ subCategoryId: string }>()

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteBlogList({
    subcategoryId: subCategoryId ? Number(subCategoryId) : 'all',
  })

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.blog-list-container',
  })

  const handleClickBlog = (blogCaseId: number) => {
    navigate(`${ROUTE_PATH.CONTENT}/${ROUTE_PATH.CONTENT_BLOG}/${subCategoryId}/${blogCaseId}`)
  }

  // 데이터가 없는 경우 체크
  const isEmpty = !data?.pages || data.pages.every(page => page.data.length === 0)

  if (isEmpty && !isFetchingNextPage) {
    return (
      <main className={styles['blog-list']}>
        <section className={styles['blog-list-container']}>
          <EmptyState icon='📄' message='블로그 컨텐츠가 없습니다' />
        </section>
      </main>
    )
  }

  return (
    <main className={styles['blog-list']}>
      <section className={`${styles['blog-list-container']} blog-list-container`}>
        {data?.pages.map(page =>
          page.data.map(blog => (
            <React.Fragment key={blog.blogCaseId}>
              <BlogItem item={blog} onClick={() => handleClickBlog(blog.blogCaseId)} />
              <Divider style={{ margin: 0 }} />
            </React.Fragment>
          ))
        )}
      </section>
    </main>
  )
}

export default BlogList
