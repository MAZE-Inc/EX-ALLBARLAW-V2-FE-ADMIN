import CategorySidebar from '@/components/categorySidebar/CategorySidebar'
import { useCategory } from '@/hooks/queries/useCategory'
import { Button } from 'antd'
import { useState } from 'react'
import styles from './videoPage.module.scss'
import VideoList from '@/container/content/videoList/VideoList'

const VideoPage = () => {
  const { data: categoryList } = useCategory()

  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null)

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategory(categoryId)
  }
  const handleSubcategoryClick = (subcategoryId: number) => {
    setSelectedSubcategory(subcategoryId)
  }

  return (
    <main className={styles['video-page']}>
      <header className={styles['video-page__header']}>
        <Button type='primary'>법률 영상 등록</Button>
      </header>
      <section className={styles['video-page__content']}>
        <CategorySidebar
          categories={categoryList || []}
          selectedMainCategory={selectedMainCategory}
          selectedSubcategory={selectedSubcategory}
          onMainCategoryClick={handleMainCategoryClick}
          onSubcategoryClick={handleSubcategoryClick}
        />
        <VideoList subCategoryId={selectedSubcategory} />
      </section>
    </main>
  )
}
export default VideoPage
