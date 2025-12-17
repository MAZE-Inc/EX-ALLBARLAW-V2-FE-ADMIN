import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import BlogItem from '@/components/blogItem/BlogItem'
import { useInfiniteBlogList } from '@/hooks/queries/useContent'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import styles from './blogList.module.scss'
import { Button, Divider } from 'antd'
import { ROUTE_PATH } from '@/routes/routePath'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import EmptyState from '@/components/emptyState/EmptyState'
import { BLOG_HEADER_PORTAL_ID } from '../blogMain/BlogPage'

const BlogList = () => {
  const navigate = useNavigate()
  const { subCategoryId } = useParams<{ subCategoryId: string }>()
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') || undefined
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const container = document.getElementById(BLOG_HEADER_PORTAL_ID)
    setPortalContainer(container)
  }, [])

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteBlogList({
    subcategoryId: subCategoryId ? Number(subCategoryId) : 'all',
    search,
  })

  const handleRegisterBlog = () => {
    if (subCategoryId) {
      navigate(`${subCategoryId}/edit`)
    } else {
      navigate('edit')
    }
  }

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.blog-list-container',
  })

  const handleClickBlog = (blogCaseId: number) => {
    navigate(`${ROUTE_PATH.CONTENT_BLOG}/${subCategoryId}/${blogCaseId}`)
  }

  // 데이터가 없는 경우 체크
  const isEmpty = !data?.pages || data.pages.every(page => page.data.length === 0)

  if (isEmpty && !isFetchingNextPage) {
    return (
      <main className={styles['blog-list']} style={{ display: 'flex', flex: 1 }}>
        <section
          className={styles['blog-list-container']}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <EmptyState
            icon={search ? '🔍' : '📄'}
            message={search ? `'${search}' 검색 결과가 없습니다` : '블로그 컨텐츠가 없습니다'}
          />
        </section>
      </main>
    )
  }

  return (
    <>
      {portalContainer &&
        createPortal(
          <>
            <Button type='primary' disabled>
              법률정보 글 등록(Excel)
            </Button>
            <Button type='primary' onClick={handleRegisterBlog}>
              법률정보 글 등록
            </Button>
          </>,
          portalContainer
        )}
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
    </>
  )
}

export default BlogList
