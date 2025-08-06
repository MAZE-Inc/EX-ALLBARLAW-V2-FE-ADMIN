import CategorySidebar from '@/components/categorySidebar/CategorySidebar'
import { useCategory } from '@/hooks/queries/useCategory'
import { Button } from 'antd'
import { useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import styles from './videoPage.module.scss'

const VideoPage = () => {
  const { data: categoryList } = useCategory()
  const navigate = useNavigate()
  const { subCategoryId } = useParams()

  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    subCategoryId ? Number(subCategoryId) : null
  )

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategory(categoryId)
  }

  const handleSubcategoryClick = (subcategoryId: number) => {
    setSelectedSubcategory(subcategoryId)
    navigate(`/content/video/${subcategoryId}`)
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
        <Outlet />
      </section>
    </main>
  )
}
export default VideoPage
