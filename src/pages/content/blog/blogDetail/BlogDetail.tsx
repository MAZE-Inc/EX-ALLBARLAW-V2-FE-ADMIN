import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import DetailHeader from '@/container/content/detailHeader/DetailHeader'
import { useGetBlogDetail, useDeleteBlog } from '@/hooks/queries/useContent'
import styles from './blogDetail.module.scss'
import { COLOR } from '@/styles/abstracts/color'
import { getBlogDetailText } from '@/utils/blogTextFormatter'
import { Button, Empty, Modal, message } from 'antd'
import { LinkOutlined, FileTextOutlined } from '@ant-design/icons'
import { BLOG_HEADER_PORTAL_ID } from '../blogMain/BlogPage'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'

const BlogDetail = () => {
  const { blogCaseId } = useParams<{ blogCaseId: string }>()
  const navigate = useNavigate()
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const container = document.getElementById(BLOG_HEADER_PORTAL_ID)
    setPortalContainer(container)
  }, [])
  const { data: blogDetail } = useGetBlogDetail({ blogCaseId: Number(blogCaseId) })
  const { summary, lawyerPart } = getBlogDetailText(blogDetail?.summaryContent || '')

  const handleBlogOpen = () => {
    if (blogDetail?.source) {
      window.open(blogDetail.source, '_blank')
    }
  }

  const handleRegisterBlog = () => {
    navigate(`${ROUTE_PATH.CONTENT_BLOG}/edit`)
  }

  const handleEditBlog = () => {
    navigate(`${ROUTE_PATH.CONTENT_BLOG}/edit/${blogCaseId}`)
  }

  const deleteBlogMutation = useDeleteBlog({
    blogCaseId: Number(blogCaseId),
    onSuccess: () => {
      message.success('블로그가 삭제되었습니다.')
      navigate(ROUTE_PATH.CONTENT_BLOG)
    },
    onError: () => {
      message.error('블로그 삭제에 실패했습니다.')
    },
  })

  const handleDeleteBlog = () => {
    Modal.confirm({
      title: '블로그 삭제',
      content: '정말로 이 블로그를 삭제하시겠습니까?',
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: { danger: true },
      onOk: () => {
        deleteBlogMutation.mutate()
      },
    })
  }

  return (
    <>
      {portalContainer &&
        createPortal(
          <div className={styles['blog-header']}>
            <Button onClick={handleEditBlog}>수정</Button>
            <Button danger onClick={handleDeleteBlog} loading={deleteBlogMutation.isPending}>삭제</Button>
            <Button type='primary' disabled>
              법률정보 글 등록(Excel)
            </Button>
            <Button type='primary' onClick={handleRegisterBlog}>
              법률정보 글 등록
            </Button>
          </div>,
          portalContainer
        )}
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
    </>
  )
}

export default BlogDetail
