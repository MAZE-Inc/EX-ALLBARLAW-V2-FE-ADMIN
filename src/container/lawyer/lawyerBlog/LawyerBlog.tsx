import Divider from '@/components/divider/Divider'
import styles from './lawyerBlog.module.scss'
import BlogItem from '@/components/blogItem/BlogItem'
import SvgIcon from '@/components/SvgIcon'
import { forwardRef } from 'react'
import { LawyerDetailResponse } from '@/types/lawyerTypes'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '@/stores/searchStore'

type LawyerBlogProps = {
  blogList: LawyerDetailResponse['blogCases'] | []
  lawyerId: number
  lawyerName: string
}

const LawyerBlog = forwardRef<HTMLElement, LawyerBlogProps>(({ blogList = [], lawyerId, lawyerName }, ref) => {
  const navigate = useNavigate()
  const { setSearchLawyerId, setSearchQuery } = useSearchStore()
  const hasBlogPosts = blogList && blogList.length > 0

  const handleMoreBlog = () => {
    // 검색어는 지우고 변호사 ID만 설정하여 해당 변호사의 모든 글 표시
    setSearchQuery(lawyerName)
    setSearchLawyerId(lawyerId)

    navigate(`/search/blog`)
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
            <SvgIcon name='arrowSmall' className={styles['lawyer-blog__button-icon']} size={14} />
          </button>
        )}
      </header>
      <Divider padding={14} />
      {hasBlogPosts ? (
        <ul className={styles['lawyer-blog__list']} role='list'>
          {blogList.map((blog, index) => (
            <li key={blog.blogCaseId + index}>
              <BlogItem item={blog} type='small' />
              {index !== blogList.length - 1 && <Divider padding={12} className={styles['lawyer-blog__divider']} />}
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
