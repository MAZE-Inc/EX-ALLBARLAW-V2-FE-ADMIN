import BlogItem from '@/components/blogItem/BlogItem'
import { useInfiniteBlogList } from '@/hooks/queries/useContent'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import styles from './blogList.module.scss'

interface BlogListProps {
  subCategoryId: number | null
}

const BlogList = ({ subCategoryId = null }: BlogListProps) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteBlogList({
    subcategoryId: subCategoryId ?? 'all',
  })

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.blog-list-container',
  })

  return (
    <main className={styles['blog-list']}>
      <header></header>
      <section className={`${styles['blog-list-container']} blog-list-container`}>
        {data?.pages.map(page => page.data.map(blog => <BlogItem key={blog.blogCaseId} item={blog} />))}
      </section>
    </main>
  )
}

export default BlogList
