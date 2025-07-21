import { useState, useEffect } from 'react'
import { Modal } from 'antd'
import { MainCategoryData } from '@/container/category/mainCategoryTable/MainCategoryTable'
import { SubCategoryData } from '@/container/category/subCategoryTable/SubCategoryTable'

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

  // 초기 데이터가 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (initialMainData && initialMainData.length > 0) {
      setMainData(initialMainData)
    }
  }, [initialMainData])

  useEffect(() => {
    if (initialSubData && initialSubData.length > 0) {
      setSubData(initialSubData)
    }
  }, [initialSubData])

  // 대분류 관련 핸들러
  const handleMainCategoryOrderChange = (newData: MainCategoryData[]) => {
    setMainData(newData)
    // TODO: 서버 API 호출로 순서 업데이트
  }

  const handleMainCategoryClick = (record: MainCategoryData, index: number) => {
    console.log('대분류 클릭:', record, 'index:', index)
    setSelectedMainCategory(record.mainCategory)
    // TODO: 선택된 대분류에 해당하는 소분류 데이터를 서버에서 가져오기
  }

  const handleMainCategoryDelete = (record: MainCategoryData) => {
    Modal.confirm({
      title: '대분류 삭제',
      content: `"${record.mainCategory}" 대분류를 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      okType: 'danger',
      onOk() {
        console.log('대분류 삭제:', record)
        setMainData(prev => prev.filter(item => item.key !== record.key))
        // TODO: 서버 API 호출로 삭제
      },
    })
  }

  // 소분류 관련 핸들러
  const handleSubCategoryOrderChange = (newData: SubCategoryData[]) => {
    setSubData(newData)
    // TODO: 서버 API 호출로 순서 업데이트
  }

  const handleSubCategoryDelete = (record: SubCategoryData) => {
    Modal.confirm({
      title: '소분류 삭제',
      content: `"${record.subCategory}" 소분류를 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      okType: 'danger',
      onOk() {
        console.log('소분류 삭제:', record)
        setSubData(prev => prev.filter(item => item.key !== record.key))
        // TODO: 서버 API 호출로 삭제
      },
    })
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
  }
}
