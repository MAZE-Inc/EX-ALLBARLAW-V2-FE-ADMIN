import CategorySidebar from '@/components/categorySidebar/CategorySidebar'
import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { useCategory } from '@/hooks/queries/useCategory'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import styles from './knowledgePage.module.scss'
import { useCountKnowledge } from '@/hooks/queries/useContent'
import { CONTENT_MENU } from '@/constants/content'

const KnowledgePage = () => {
  const { data: categoryList } = useCategory()
  const navigate = useNavigate()

  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null)
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>({
    label: '제목',
    key: 'title',
  })

  const { data: countKnowledge } = useCountKnowledge({
    subcategoryId: 'all',
    recentDays: 'all',
  })

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategory(categoryId)
    setSelectedSubcategory(null)
  }

  const handleSubcategoryClick = (subcategoryId: number) => {
    setSelectedSubcategory(subcategoryId)
    navigate(`${subcategoryId}`)
  }

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => setSelectedItem(item)

  const handleSearch = (value: string) => {
    setSelectedMainCategory(null)
    setSelectedSubcategory(null)
    const params = new URLSearchParams()
    if (value) params.set('search', value)
    if (selectedItem?.key) params.set('searchType', String(selectedItem.key))
    navigate(`/content/knowledge?${params.toString()}`)
  }

  return (
    <main className={styles['knowledge-page']}>
      <SearchHeader
        title={`전체 : ${(countKnowledge ?? 0).toLocaleString()}개가 등록되어 있습니다.`}
        placeholder='선택'
        menuItems={CONTENT_MENU}
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
        searchPlaceholder='검색어를 입력하세요'
        onSearch={handleSearch}
        bordered={false}
      />
      <section className={styles['knowledge-page__content']}>
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
export default KnowledgePage
