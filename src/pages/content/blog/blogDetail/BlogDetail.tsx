// import styles from '@/pages/blog/blog-detail.module.scss'
import { useParams } from 'react-router-dom'
import DetailHeader from '@/container/content/detailHeader/DetailHeader'
import { useGetBlogDetail } from '@/hooks/queries/useContent'
import styles from './blogDetail.module.scss'
import { COLOR } from '@/styles/abstracts/color'
import { getBlogDetailText } from '@/utils/blogTextFormatter'
import { Button, Empty } from 'antd'
import { LinkOutlined, FileTextOutlined } from '@ant-design/icons'

const BlogDetail = () => {
  const { blogCaseId } = useParams<{ blogCaseId: string }>()
  const { data: blogDetail } = useGetBlogDetail({ blogCaseId: Number(blogCaseId) })
  const { summary, lawyerPart } = getBlogDetailText(blogDetail?.summaryContent || '')

  const handleBlogOpen = () => {
    if (blogDetail?.source) {
      window.open(blogDetail.source, '_blank')
    }
  }

  return (
    <div className={styles['blog-detail']}>
      <DetailHeader title={blogDetail?.title || ''} />
      <section className={styles['blog-detail-container']}>
        <div className={styles['blog-detail-content']}>
          <div className={styles['blog-detail-content-wrapper']}>
            <section>
              <h2 style={{ color: COLOR.GREEN_01 }}>AI 요약</h2>
              <hr className={styles['line-driver']} />
              <p className={styles.summary}>{summary}</p>
            </section>
            <section>
              <h2>변호사 선임의 필요성</h2>
              <hr className={styles['line-driver']} />
              {lawyerPart.length > 0 ? (
                <ul className={styles['lawyer-list']}>
                  {lawyerPart.map((item, index) => (
                    <li key={index} className={styles['lawyer-item']}>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty
                  image={<FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
                  description='변호사 선임 필요성에 대한 내용이 없습니다'
                  style={{ padding: '2rem 0' }}
                />
              )}
            </section>
            <section>
              <hr className={styles['line-driver']} style={{ margin: 0 }} />
              <div className={styles['tag-list']}>
                {blogDetail?.tags.map(tag => (
                  <span key={tag.id}>#{tag.name}</span>
                ))}
              </div>
            </section>
            <section className={styles['blog-button-section']}>
              <Button
                type='primary'
                icon={<LinkOutlined />}
                onClick={handleBlogOpen}
                disabled={!blogDetail?.source}
                size='large'
              >
                블로그 바로가기
              </Button>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogDetail
