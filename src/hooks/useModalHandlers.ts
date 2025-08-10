import { useState } from 'react'
import { message } from 'antd'
import { MainCategoryData } from '@/container/category/mainCategoryTable/MainCategoryTable'
import { SubCategoryData } from '@/container/category/subCategoryTable/SubCategoryTable'
import { useCreateSubCategory, useUpdateSubCategory } from '@/hooks/queries/useCategory'

interface UseModalHandlersProps {
  selectedCategoryId: number | null
}

export const useModalHandlers = ({ selectedCategoryId }: UseModalHandlersProps = { selectedCategoryId: null }) => {
  // 소분류 모달 상태
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryData | null>(null)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')

  // 대분류 에디터 모달 상태
  const [isMainCategoryEditorOpen, setIsMainCategoryEditorOpen] = useState(false)
  const [mainCategoryEditorMode, setMainCategoryEditorMode] = useState<'add' | 'edit'>('add')
  const [selectedMainCategoryData, setSelectedMainCategoryData] = useState<MainCategoryData | null>(null)
  
  // API 훅
  const createSubCategoryMutation = useCreateSubCategory()
  const updateSubCategoryMutation = useUpdateSubCategory()

  // 대분류 관련 모달 핸들러
  const handleMainCategoryAdd = () => {
    console.log('대분류 추가 버튼 클릭')
    setMainCategoryEditorMode('add')
    setSelectedMainCategoryData(null)
    setIsMainCategoryEditorOpen(true)
  }

  const handleMainCategoryDoubleClick = (record: MainCategoryData, index: number) => {
    console.log('대분류 더블클릭:', record, 'index:', index)
    setMainCategoryEditorMode('edit')
    setSelectedMainCategoryData(record)
    setIsMainCategoryEditorOpen(true)
  }

  const handleMainCategoryEditorCancel = () => {
    setIsMainCategoryEditorOpen(false)
    setSelectedMainCategoryData(null)
  }

  const handleMainCategoryEditorSubmit = (data: { name: string; onImage: File | null; offImage: File | null }) => {
    if (mainCategoryEditorMode === 'add') {
      console.log('대분류 등록:', data)
      // TODO: 서버 API 호출로 대분류 추가
    } else {
      console.log('대분류 수정:', selectedMainCategoryData, '새 데이터:', data)
      // TODO: 서버 API 호출로 대분류 수정
    }
    setIsMainCategoryEditorOpen(false)
    setSelectedMainCategoryData(null)
  }

  // 소분류 관련 모달 핸들러
  const handleSubCategoryAdd = () => {
    console.log('소분류 추가 버튼 클릭')
    setModalMode('add')
    setSelectedSubCategory(null)
    setIsSubCategoryModalOpen(true)
  }

  const handleSubCategoryClick = (record: SubCategoryData, index: number) => {
    console.log('소분류 클릭:', record, 'index:', index)
    setModalMode('edit')
    setSelectedSubCategory(record)
    setIsSubCategoryModalOpen(true)
  }

  const handleSubCategoryDoubleClick = (record: SubCategoryData, index: number) => {
    console.log('소분류 더블클릭:', record, 'index:', index)
    // TODO: 더블클릭 시 원하는 동작 구현 (예: 수정 모달 열기)
  }

  const handleSubCategoryModalCancel = () => {
    setIsSubCategoryModalOpen(false)
    setSelectedSubCategory(null)
  }

  const handleSubCategoryModalSubmit = async (inputValue: string) => {
    if (!inputValue.trim()) {
      message.warning('소분류 이름을 입력해주세요.')
      return
    }

    if (modalMode === 'add') {
      if (!selectedCategoryId) {
        message.warning('먼저 대분류를 선택해주세요.')
        return
      }

      try {
        await createSubCategoryMutation.mutateAsync({
          subcategoryName: inputValue,
          subcategoryCategoryId: selectedCategoryId,
        })
        message.success(`"${inputValue}" 소분류가 등록되었습니다.`)
        setIsSubCategoryModalOpen(false)
        setSelectedSubCategory(null)
      } catch (error) {
        console.error('소분류 추가 실패:', error)
        message.error('소분류 추가에 실패했습니다.')
      }
    } else {
      if (!selectedSubCategory) {
        message.warning('수정할 소분류가 선택되지 않았습니다.')
        return
      }

      try {
        const subCategoryId = parseInt(selectedSubCategory.key)
        await updateSubCategoryMutation.mutateAsync({
          subCategoryId,
          subcategoryName: inputValue,
        })
        message.success(`소분류가 "${inputValue}"로 수정되었습니다.`)
        setIsSubCategoryModalOpen(false)
        setSelectedSubCategory(null)
      } catch (error) {
        console.error('소분류 수정 실패:', error)
        message.error('소분류 수정에 실패했습니다.')
      }
    }
  }

  return {
    // 소분류 모달 상태
    isSubCategoryModalOpen,
    selectedSubCategory,
    modalMode,

    // 대분류 에디터 모달 상태
    isMainCategoryEditorOpen,
    mainCategoryEditorMode,
    selectedMainCategoryData,

    // 대분류 모달 핸들러
    handleMainCategoryAdd,
    handleMainCategoryDoubleClick,
    handleMainCategoryEditorCancel,
    handleMainCategoryEditorSubmit,

    // 소분류 모달 핸들러
    handleSubCategoryAdd,
    handleSubCategoryClick,
    handleSubCategoryDoubleClick,
    handleSubCategoryModalCancel,
    handleSubCategoryModalSubmit,
  }
}
