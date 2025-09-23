import { useState, useEffect } from 'react'
import { Modal, message } from 'antd'
import { MainCategoryData } from '@/container/category/mainCategoryTable/MainCategoryTable'
import { SubCategoryData } from '@/container/category/subCategoryTable/SubCategoryTable'
import {
  useDeleteCategory,
  useDeleteSubCategory,
  useUpdateCategoryOrder,
  useUpdateSubCategoryOrder,
} from '@/hooks/queries/useCategory'

interface UseCategoryManagementProps {
  initialMainData?: MainCategoryData[] // optional로 변경
  initialSubData?: SubCategoryData[] // optional로 변경
}

export const useCategoryManagement = ({
  initialMainData = [], // 기본값 제공
  initialSubData = [], // 기본값 제공
}: UseCategoryManagementProps) => {
  const [mainData, setMainData] = useState<MainCategoryData[]>([])
  const [subData, setSubData] = useState<SubCategoryData[]>([])
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('')

  const deleteCategoryMutation = useDeleteCategory()
  const deleteSubCategoryMutation = useDeleteSubCategory()
  const updateCategoryOrderMutation = useUpdateCategoryOrder()
  const updateSubCategoryOrderMutation = useUpdateSubCategoryOrder()

  // 초기 데이터가 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (initialMainData && initialMainData.length > 0) {
      setMainData(initialMainData)
    }
  }, [initialMainData])

  useEffect(() => {
    // initialSubData가 undefined가 아니면 설정 (빈 배열도 포함)
    if (initialSubData !== undefined) {
      setSubData(initialSubData)
    }
  }, [initialSubData])

  // 대분류 관련 핸들러
  const handleMainCategoryOrderChange = async (newData: MainCategoryData[]) => {
    // 옵티미스틱 업데이트
    setMainData(newData)

    // 변경된 순서에 따라 displayOrder 업데이트
    try {
      // 각 카테고리의 새로운 순서를 서버에 업데이트
      const updatePromises = newData.map((item, index) => {
        const categoryId = parseInt(item.key)
        const newDisplayOrder = index + 1 // 1부터 시작하는 순서

        // displayOrder가 변경된 경우에만 API 호출
        if (item.displayOrder !== newDisplayOrder) {
          return updateCategoryOrderMutation.mutateAsync({
            categoryId,
            categoryDisplayOrder: newDisplayOrder,
          })
        }
        return Promise.resolve()
      })

      await Promise.all(updatePromises)
      message.success('카테고리 순서가 변경되었습니다.')
    } catch (error) {
      console.error('카테고리 순서 변경 실패:', error)
      message.error('카테고리 순서 변경에 실패했습니다.')
      // 실패 시 원래 데이터로 복원
      if (initialMainData) {
        setMainData(initialMainData)
      }
    }
  }

  const handleMainCategoryClick = (record: MainCategoryData, _index: number) => {
    setSelectedMainCategory(record.mainCategory)
    // 선택된 대분류에 해당하는 소분류 데이터는 이미 initialSubData로 전달됨
  }

  // 선택된 대분류 이름을 외부에서 설정할 수 있는 함수
  const setMainCategorySelection = (categoryName: string) => {
    setSelectedMainCategory(categoryName)
  }

  const handleMainCategoryDelete = (record: MainCategoryData) => {
    Modal.confirm({
      title: '대분류 삭제',
      content: `"${record.mainCategory}" 대분류를 삭제하시겠습니까? 이 대분류에 속한 모든 소분류도 함께 삭제됩니다.`,
      okText: '삭제',
      cancelText: '취소',
      okType: 'danger',
      async onOk() {
        try {
          const categoryId = parseInt(record.key)
          await deleteCategoryMutation.mutateAsync(categoryId)

          // 로컬 상태에서도 제거 (옵티미스틱 업데이트)
          setMainData(prev => prev.filter(item => item.key !== record.key))

          // 선택된 대분류가 삭제된 경우 선택 해제
          if (selectedMainCategory === record.mainCategory) {
            setSelectedMainCategory('')
            setSubData([])
          }

          message.success(`"${record.mainCategory}" 대분류가 삭제되었습니다.`)
        } catch (error) {
          console.error('대분류 삭제 실패:', error)
          message.error('대분류 삭제에 실패했습니다.')
        }
      },
    })
  }

  // 소분류 관련 핸들러
  const handleSubCategoryOrderChange = async (newData: SubCategoryData[]) => {
    // 옵티미스틱 업데이트
    setSubData(newData)

    // 변경된 순서에 따라 displayOrder 업데이트
    try {
      // 각 서브카테고리의 새로운 순서를 서버에 업데이트
      const updatePromises = newData.map((item, index) => {
        const subcategoryId = parseInt(item.key)
        const newDisplayOrder = index + 1 // 1부터 시작하는 순서

        // displayOrder가 변경된 경우에만 API 호출
        if (item.displayOrder !== newDisplayOrder) {
          return updateSubCategoryOrderMutation.mutateAsync({
            subcategoryId,
            subcategoryDisplayOrder: newDisplayOrder,
          })
        }
        return Promise.resolve()
      })

      await Promise.all(updatePromises)
      message.success('소분류 순서가 변경되었습니다.')
    } catch (error) {
      console.error('소분류 순서 변경 실패:', error)
      message.error('소분류 순서 변경에 실패했습니다.')
      // 실패 시 원래 데이터로 복원
      if (initialSubData) {
        setSubData(initialSubData)
      }
    }
  }

  const handleSubCategoryDelete = (record: SubCategoryData) => {
    Modal.confirm({
      title: '소분류 삭제',
      content: `"${record.subCategory}" 소분류를 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      okType: 'danger',
      async onOk() {
        try {
          const subCategoryId = parseInt(record.key)
          await deleteSubCategoryMutation.mutateAsync(subCategoryId)

          // 로컬 상태에서도 제거 (옵티미스틱 업데이트)
          setSubData(prev => prev.filter(item => item.key !== record.key))

          message.success(`"${record.subCategory}" 소분류가 삭제되었습니다.`)
        } catch (error) {
          console.error('소분류 삭제 실패:', error)
          message.error('소분류 삭제에 실패했습니다.')
        }
      },
    })
  }

  // 선택 상태 초기화 함수
  const resetSelection = () => {
    setSelectedMainCategory('')
    setSubData([])
  }

  return {
    // 상태
    mainData,
    subData,
    selectedMainCategory,

    // 핸들러
    handleMainCategoryOrderChange,
    handleMainCategoryClick,
    handleMainCategoryDelete,
    handleSubCategoryOrderChange,
    handleSubCategoryDelete,
    resetSelection,
    setMainCategorySelection,
  }
}
