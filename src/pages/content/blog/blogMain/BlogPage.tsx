import CategorySidebar from '@/components/categorySidebar/CategorySidebar'
import { useCategory } from '@/hooks/queries/useCategory'
import { Button } from 'antd'
import { useState } from 'react'
import styles from './blogPage.module.scss'
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom'

const BlogPage = () => {
  const navigate = useNavigate()
  const { subCategoryId } = useParams()
  const location = useLocation()
  const { data: categoryList } = useCategory()

  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    subCategoryId ? Number(subCategoryId) : null
  )

  // BlogEditor 페이지인지 확인
  const isBlogEditorPage = location.pathname.includes('/edit')

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategory(categoryId)
  }
  const handleSubcategoryClick = (subcategoryId: number) => {
    setSelectedSubcategory(subcategoryId)
    navigate(`${subcategoryId}`)
  }

  const handleRegisterBlog = () => {
    // 서브카테고리가 선택되어 있으면 해당 경로로, 없으면 edit 경로로 이동
    if (selectedSubcategory) {
      navigate(`${selectedSubcategory}/edit`)
    } else {
      navigate('edit')
    }
  }

  return (
    <main className={styles['blog-page']}>
      <header className={styles['blog-page__header']}>
        {!isBlogEditorPage && (
          <>
            <Button type='primary' disabled>
              법률정보 글 등록(Execl)
            </Button>
            <Button type='primary' onClick={handleRegisterBlog}>
              법률정보 글 등록
            </Button>
          </>
        )}
      </header>
      <section className={styles['blog-page__content']}>
        <aside className={styles['blog-page__sidebar']}>
          <CategorySidebar
            categories={categoryList || []}
            selectedMainCategory={selectedMainCategory}
            selectedSubcategory={selectedSubcategory}
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
