import CategorySidebar from '@/components/categorySidebar/CategorySidebar'
import { useCategory } from '@/hooks/queries/useCategory'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import styles from './knowledgePage.module.scss'

const KnowledgePage = () => {
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
    <main className={styles['knowledge-page']}>
      <header className={styles['knowledge-page__header']}></header>
      <section className={styles['knowledge-page__content']}>
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
export default KnowledgePage
