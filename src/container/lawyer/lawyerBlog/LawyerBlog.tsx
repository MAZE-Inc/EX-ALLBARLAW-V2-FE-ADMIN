import styles from './lawyerBlog.module.scss'
import BlogItem from '@/components/blogItem/BlogItem'
import { forwardRef } from 'react'
import { LawyerDetailResponse } from '@/types/lawyerTypes'
import { Divider } from 'antd'
import { RightOutlined } from '@ant-design/icons'

type LawyerBlogProps = {
  blogList: LawyerDetailResponse['blogCases'] | []
  lawyerId: number
  lawyerName: string
}

const LawyerBlog = forwardRef<HTMLElement, LawyerBlogProps>(({ blogList = [], lawyerId, lawyerName }, ref) => {
  const hasBlogPosts = blogList && blogList.length > 0

  const handleMoreBlog = () => {
    window.open(`${import.meta.env.VITE_USER_URL}/search/blog?q=${lawyerName}&lawyerId=${lawyerId}`, '_blank')
  }

  return (
    <section ref={ref} className={styles['lawyer-blog']} aria-label='법률정보의 글'>
      <header className={styles['lawyer-blog__header']}>
        <h3 className={styles['lawyer-blog__title']}>법률정보의 글</h3>
        {hasBlogPosts && (
          <button
            type='button'
            className={styles['lawyer-blog__button']}
            aria-label='법률정보의 글 더보기'
            onClick={handleMoreBlog}
          >
            더보기
            <RightOutlined />
          </button>
        )}
      </header>
      <Divider style={{ margin: '14px 0' }} />
      {hasBlogPosts ? (
        <ul className={styles['lawyer-blog__list']} role='list'>
          {blogList.map((blog, index) => (
            <li key={blog.blogCaseId + index}>
              <BlogItem item={blog} />
              {index !== blogList.length - 1 && <Divider style={{ margin: '12px 0' }} />}
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles['lawyer-blog__empty']}>
          <p className={styles['lawyer-blog__empty-text']}>등록된 블로그 글이 없습니다</p>
        </div>
      )}
    </section>
  )
})

LawyerBlog.displayName = 'LawyerBlog'

export default LawyerBlog
