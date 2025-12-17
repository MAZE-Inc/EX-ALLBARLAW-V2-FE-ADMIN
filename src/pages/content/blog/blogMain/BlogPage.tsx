import CategorySidebar from '@/components/categorySidebar/CategorySidebar'
import SearchHeader from '@/components/searchHeader/SearchHeader'
import { useCategory } from '@/hooks/queries/useCategory'
import { useState } from 'react'
import styles from './blogPage.module.scss'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useCountBlog } from '@/hooks/queries/useContent'

export const BLOG_HEADER_PORTAL_ID = 'blog-header-portal'

const BlogPage = () => {
  const navigate = useNavigate()
  const { subCategoryId } = useParams()
  const { data: categoryList } = useCategory()
  const { data: countBlog } = useCountBlog('all', 'all')

  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    subCategoryId ? Number(subCategoryId) : null
  )

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategory(categoryId)
  }
  const handleSubcategoryClick = (subcategoryId: number) => {
    setSelectedSubcategory(subcategoryId)
    navigate(`${subcategoryId}`)
  }

  const handleSearch = (value: string) => {
    setSelectedMainCategory(null)
    setSelectedSubcategory(null)
    navigate(value ? `/content/blog?search=${encodeURIComponent(value)}` : '/content/blog')
  }

  return (
    <main className={styles['blog-page']}>
      <SearchHeader
        title={`전체 : ${(countBlog ?? 0).toLocaleString()}개가 등록되어 있습니다.`}
        placeholder='선택'
        searchPlaceholder='검색어를 입력하세요'
        onSearch={handleSearch}
        bordered={false}
      />
      <header className={styles['blog-page__header']}>
        <div id={BLOG_HEADER_PORTAL_ID} />
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
