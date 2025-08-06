import BlogItem from '@/components/blogItem/BlogItem'
import { useInfiniteBlogList } from '@/hooks/queries/useContent'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import styles from './blogList.module.scss'
import { Divider } from 'antd'
import { ROUTE_PATH } from '@/routes/routePath'
import { useNavigate, useParams } from 'react-router-dom'

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

  return (
    <main className={styles['blog-list']}>
      <section className={`${styles['blog-list-container']} blog-list-container`}>
        {data?.pages.map(page =>
          page.data.map(blog => (
            <>
              <BlogItem key={blog.blogCaseId} item={blog} onClick={() => handleClickBlog(blog.blogCaseId)} />
              <Divider style={{ margin: 0 }} />
            </>
          ))
        )}
      </section>
    </main>
  )
}

export default BlogList
