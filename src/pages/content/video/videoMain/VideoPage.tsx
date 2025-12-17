import CategorySidebar from '@/components/categorySidebar/CategorySidebar'
import SearchHeader from '@/components/searchHeader/SearchHeader'
import { useCategory } from '@/hooks/queries/useCategory'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import styles from './videoPage.module.scss'

export const VIDEO_HEADER_PORTAL_ID = 'video-header-portal'

const VideoPage = () => {
  const { data: categoryList } = useCategory()
  const navigate = useNavigate()

  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null)

  const handleMainCategoryClick = (categoryId: number) => {
    setSelectedMainCategory(categoryId)
    setSelectedSubcategory(null)
  }

  const handleSubcategoryClick = (subcategoryId: number) => {
    setSelectedSubcategory(subcategoryId)
    navigate(`${subcategoryId}`)
  }

  const handleSearch = (value: string) => {
    setSelectedMainCategory(null)
    setSelectedSubcategory(null)
    navigate(value ? `/content/video?search=${encodeURIComponent(value)}` : '/content/video')
  }

  return (
    <main className={styles['video-page']}>
      <SearchHeader
        title='전체 : 512개가 등록되어 있습니다.'
        placeholder='선택'
        searchPlaceholder='검색어를 입력하세요'
        onSearch={handleSearch}
        bordered={false}
      />
      <header className={styles['video-page__header']}>
        <div id={VIDEO_HEADER_PORTAL_ID} />
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
