import { useEffect, useState } from 'react'
import { useInfiniteKnowledgeList } from '@/hooks/queries/useContent'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import styles from './knowledgeList.module.scss'
import { ROUTE_PATH } from '@/routes/routePath'
import LegalKnowledgeItem from '@/components/legalKnowledgeItem/LegalKnowledgeItem'
import { Divider } from 'antd'
import { Fragment } from 'react/jsx-runtime'

const KnowledgeList = () => {
  const { subCategoryId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchFromUrl = searchParams.get('search') || undefined
  const searchTypeFromUrl = (searchParams.get('searchType') as 'title' | 'lawyerName') || undefined

  const [search, setSearch] = useState(searchFromUrl)
  const [searchType, setSearchType] = useState(searchTypeFromUrl)

  // URL 파라미터가 변경되면 상태 업데이트
  useEffect(() => {
    setSearch(searchFromUrl)
    setSearchType(searchTypeFromUrl)
  }, [searchFromUrl, searchTypeFromUrl])

  const { knowledgeList, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteKnowledgeList({
    subcategoryId: subCategoryId ? Number(subCategoryId) : 'all',
    search,
    searchType,
  })

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.knowledge-list-container',
  })

  const handleClickKnowledge = (knowledgeCaseId: number) =>
    navigate(`${ROUTE_PATH.CONTENT_KNOWLEDGE}/${subCategoryId}/${knowledgeCaseId}`)

  return (
    <main className={styles['knowledge-list']}>
      <section className={`${styles['knowledge-list-container']} knowledge-list-container`}>
        {knowledgeList?.map(knowledge => (
          <Fragment key={knowledge.knowledgeId}>
            <LegalKnowledgeItem
              title={knowledge.knowledgeTitle}
              description={knowledge.summaryContent}
              time={new Date(knowledge.lastMessageAt)}
              lawyerList={knowledge.lawyers || []}
              isLastAnswer={true}
              onClick={() => handleClickKnowledge(knowledge.knowledgeId)}
            />
            <Divider />
          </Fragment>
        ))}
      </section>
    </main>
  )
}

export default KnowledgeList
