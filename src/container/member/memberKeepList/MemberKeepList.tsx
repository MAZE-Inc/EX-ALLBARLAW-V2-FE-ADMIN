import { useState, useMemo } from 'react'
import styles from './memberKeepList.module.scss'
import KeepSidebar from '../keepSidebar/KeepSidebar'
import KeepBlogList from '../keepBlogList/KeepBlogList'
import KeepVideoList from '../keepVideoList/KeepVideoList'
import KeepLegalKnowledgeList from '../keepLegalKnowledgeList/KeepLegalKnowledgeList'
import { useParams } from 'react-router-dom'
import KeepLegalDictionary from '../keepLegalDictionary/KeepLegalDictionary'
import KeepLawyerList from '../keepLawyerList/KeepLawyerList'
import { useMemberKeepCount } from '@/hooks/queries/useMember'

interface KeepButton {
  name: string
  count: number
}

const MemberKeepList = () => {
  const [activeButton, setActiveButton] = useState('법률정보의 글')
  const { memberId } = useParams()
  const { data: keepCount } = useMemberKeepCount(Number(memberId))

  const [sort, setSort] = useState<'asc' | 'desc'>('asc')

  const buttonList: KeepButton[] = useMemo(
    () => [
      { name: '법률정보의 글', count: keepCount?.blogCaseCount || 0 },
      { name: '변호사의 영상', count: keepCount?.videoCaseCount || 0 },
      { name: '법률 지식인', count: keepCount?.knowledgeCount || 0 },
      { name: '변호사', count: keepCount?.lawyerCount || 0 },
      { name: '법률 사전', count: keepCount?.legalTermCount || 0 },
    ],
    [keepCount]
  )

  const renderContent = () => {
    switch (activeButton) {
      case '법률정보의 글':
        return <KeepBlogList userId={Number(memberId)} sort={sort} />
      case '변호사의 영상':
        return <KeepVideoList userId={Number(memberId)} sort={sort} />
      case '법률 지식인':
        return <KeepLegalKnowledgeList userId={Number(memberId)} sort={sort} />
      case '변호사':
        return <KeepLawyerList userId={Number(memberId)} sort={sort} />
      case '법률 사전':
        return <KeepLegalDictionary userId={Number(memberId)} sort={sort} />
      default:
        return <KeepBlogList userId={Number(memberId)} sort={sort} />
    }
  }

  return (
    <main className={`${styles.keepList}`}>
      <header className={styles.keepListHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.icon}>♦</span>
          Keep
        </h2>
        <div className={styles.keepListHeaderRight}>
          <button className={styles.keepListHeaderRightButton} onClick={() => setSort('asc')}>
            최근등록순
          </button>
          <button className={styles.keepListHeaderRightButton} onClick={() => setSort('desc')}>
            과거등록순
          </button>
        </div>
      </header>
      <div className={styles.keepListContainer}>
        <KeepSidebar buttonList={buttonList} activeButton={activeButton} setActiveButton={setActiveButton} />
        <section className={styles.keepListContent}>
          <div className={styles.keepListBody}>{renderContent()}</div>
        </section>
      </div>
    </main>
  )
}

export default MemberKeepList
