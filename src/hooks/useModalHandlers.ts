import { useState } from 'react'
import { MainCategoryData } from '@/container/category/mainCategoryTable/MainCategoryTable'
import { SubCategoryData } from '@/container/category/subCategoryTable/SubCategoryTable'

export const useModalHandlers = () => {
  // 소분류 모달 상태
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryData | null>(null)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')

  // 대분류 에디터 모달 상태
  const [isMainCategoryEditorOpen, setIsMainCategoryEditorOpen] = useState(false)
  const [mainCategoryEditorMode, setMainCategoryEditorMode] = useState<'add' | 'edit'>('add')
  const [selectedMainCategoryData, setSelectedMainCategoryData] = useState<MainCategoryData | null>(null)

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

  const handleSubCategoryModalSubmit = (inputValue: string) => {
    if (modalMode === 'add') {
      console.log('소분류 추가:', inputValue)
      // TODO: 서버 API 호출로 소분류 추가
    } else {
      console.log('소분류 수정:', selectedSubCategory, '새 이름:', inputValue)
      // TODO: 서버 API 호출로 소분류 이름 수정
    }
    setIsSubCategoryModalOpen(false)
    setSelectedSubCategory(null)
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
