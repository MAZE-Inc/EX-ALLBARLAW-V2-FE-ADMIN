import CategorySidebar from '@/components/categorySidebar/CategorySidebar'
import { useCategory } from '@/hooks/queries/useCategory'
import { Button, message } from 'antd'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import styles from './videoPage.module.scss'

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

  const handleRegisterVideo = () => {
    if (!selectedSubcategory) {
      message.warning('서브카테고리를 선택해주세요.')
      return
    }
    navigate(`${selectedSubcategory}/edit`)
  }

  return (
    <main className={styles['video-page']}>
      <header className={styles['video-page__header']}>
        <Button type='primary' onClick={handleRegisterVideo}>영상정보 글 등록</Button>
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
