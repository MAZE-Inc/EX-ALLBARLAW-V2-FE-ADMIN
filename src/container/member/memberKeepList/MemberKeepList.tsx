import { useState } from 'react'
import styles from './memberKeepList.module.scss'
import KeepSidebar from '../keepSidebar/KeepSidebar'
import KeepBlogList from '../keepBlogList/KeepBlogList'
import KeepVideoList from '../keepVideoList/KeepVideoList'
import KeepLegalKnowledgeList from '../keepLegalKnowledgeList/KeepLegalKnowledgeList'
import { useParams } from 'react-router-dom'
import KeepLegalDictionary from '../keepLegalDictionary/KeepLegalDictionary'

const buttonList = ['법률정보의 글', '변호사의 영상', '법률 지식인', '변호사', '법률 사전']

const MemberKeepList = () => {
  const [activeButton, setActiveButton] = useState(buttonList[0])
  const { memberId } = useParams()

  const renderContent = () => {
    switch (activeButton) {
      case buttonList[0]:
        return <KeepBlogList userId={Number(memberId)} />
      case buttonList[1]:
        return <KeepVideoList userId={Number(memberId)} />
      case buttonList[2]:
        return <KeepLegalKnowledgeList userId={Number(memberId)} />
      // case buttonList[3]:
      //   return <MyLawyer />
      case buttonList[4]:
        return <KeepLegalDictionary userId={Number(memberId)} />
      default:
        return <KeepBlogList userId={Number(memberId)} />
    }
  }

  return (
    <main className={`${styles.keepList}`}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.icon}>♦</span>
        Keep
      </h2>
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
