import SearchHeader from '@/components/searchHeader/SearchHeader'
import { Outlet } from 'react-router-dom'
import { useCategory } from '@/hooks/queries/useCategory'
import { useMemo } from 'react'

const CategoryLayout = () => {
  const { data: categoryData } = useCategory()

  const title = useMemo(() => {
    if (!categoryData) return '전체'

    const mainCategoryCount = categoryData.length
    const subCategoryCount = categoryData.reduce((total, category) => total + category.subcategories.length, 0)

    return `전체 : 대분류 ${mainCategoryCount}개 / 소분류 ${subCategoryCount}개가 등록되어있습니다`
  }, [categoryData])

  return (
    <>
      <SearchHeader placeholder='분류 선택' searchPlaceholder='검색어를 입력하세요' bordered={false} title={title} />
      <Outlet />
    </>
  )
}

export default CategoryLayout
