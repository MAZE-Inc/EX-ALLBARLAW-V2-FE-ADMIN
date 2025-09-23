import { useState, useEffect } from 'react'
import { useCategory } from '@/hooks/queries/useCategory'

export const useCategorySelection = (subCategoryId?: string) => {
  const { data: categoryList } = useCategory()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (subCategoryId && categoryList) {
      // 서브카테고리 ID가 있으면 해당하는 카테고리 찾아서 설정
      const parentCategory = categoryList.find(cat =>
        cat.subcategories.some(sub => sub.subcategoryId === Number(subCategoryId))
      )
      if (parentCategory) {
        setSelectedCategoryId(parentCategory.categoryId)
      }
    }
  }, [subCategoryId, categoryList])

  return {
    categoryList,
    selectedCategoryId,
    setSelectedCategoryId,
  }
}