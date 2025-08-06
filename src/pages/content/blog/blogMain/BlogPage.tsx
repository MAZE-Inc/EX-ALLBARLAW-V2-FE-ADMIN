import CategorySidebar from '@/components/categorySidebar/CategorySidebar'
import { useCategory } from '@/hooks/queries/useCategory'
import { Button } from 'antd'
import { useState } from 'react'
import styles from './blogPage.module.scss'
import { Outlet, useNavigate } from 'react-router-dom'

const BlogPage = () => {
  const navigate = useNavigate()
  const { data: categoryList } = useCategory()

  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategory(categoryId)
  }
  const handleSubcategoryClick = (subcategoryId: number) => {
    navigate(`${subcategoryId}`)
  }

  return (
    <main className={styles['blog-page']}>
      <header className={styles['blog-page__header']}>
        <Button type='primary'>법률정보 글 등록(Execl)</Button>
        <Button type='primary'>법률정보 글 등록</Button>
      </header>
      <section className={styles['blog-page__content']}>
        <aside className={styles['blog-page__sidebar']}>
          <CategorySidebar
            categories={categoryList || []}
            selectedMainCategory={selectedMainCategory}
            selectedSubcategory={null}
            onMainCategoryClick={handleMainCategoryClick}
            onSubcategoryClick={handleSubcategoryClick}
          />
        </aside>
        <Outlet />
      </section>
    </main>
  )
}
export default BlogPage
