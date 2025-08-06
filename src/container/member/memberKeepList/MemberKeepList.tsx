import { useState } from 'react'
import styles from './memberKeepList.module.scss'
import KeepSidebar from '../keepSidebar/KeepSidebar'
import KeepBlogList from '../keepBlogList/KeepBlogList'
import KeepVideoList from '../keepVideoList/KeepVideoList'
import KeepLegalKnowledgeList from '../keepLegalKnowledgeList/KeepLegalKnowledgeList'

const buttonList = ['법률정보의 글', '변호사의 영상', '법률 지식인', '변호사', '법률 사전']

const MemberKeepList = () => {
  const [activeButton, setActiveButton] = useState(buttonList[0])

  const renderContent = () => {
    switch (activeButton) {
      case buttonList[0]:
        return <KeepBlogList />
      case buttonList[1]:
        return <KeepVideoList />
      case buttonList[2]:
        return <KeepLegalKnowledgeList />
      // case buttonList[3]:
      //   return <MyLawyer />
      // case buttonList[4]:
      // return <MyLegalDictionary />
      default:
        return <KeepBlogList />
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
