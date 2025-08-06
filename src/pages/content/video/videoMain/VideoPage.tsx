import CategorySidebar from '@/components/categorySidebar/CategorySidebar'
import { useCategory } from '@/hooks/queries/useCategory'
import { Button } from 'antd'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import styles from './videoPage.module.scss'

const VideoPage = () => {
  const { data: categoryList } = useCategory()
  const navigate = useNavigate()

  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategory(categoryId)
  }

  const handleSubcategoryClick = (subcategoryId: number) => {
    navigate(`${subcategoryId}`)
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
          selectedSubcategory={null}
          onMainCategoryClick={handleMainCategoryClick}
          onSubcategoryClick={handleSubcategoryClick}
        />
        <Outlet />
      </section>
    </main>
  )
}
export default VideoPage
