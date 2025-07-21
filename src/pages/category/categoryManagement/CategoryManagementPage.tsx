import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import styles from '@/pages/category/categoryManagement/categoryManagement.module.scss'
import MainCategoryTable, { MainCategoryData } from '@/container/category/mainCategoryTable/MainCategoryTable'
import SubCategoryTable, { SubCategoryData } from '@/container/category/subCategoryTable/SubCategoryTable'
import InputModal from '@/components/inputModal'
import MainCategoryEditor from '@/container/category/MainCategoryEditor'

// 초기 데이터 (추후 서버에서 받아올 예정)
const initialMainData: MainCategoryData[] = [
  {
    key: '1',
    mainCategory: '민사',
    icons: ['allbarlaw-logo.png', 'react.svg'],
    subCategory: 5,
  },
  {
    key: '2',
    mainCategory: '형사',
    icons: ['allbarlaw-logo.png', 'react.svg'],
    subCategory: 3,
  },
]

const initialSubData: SubCategoryData[] = [
  {
    key: '1',
    subCategory: '손해배상',
    article: 12,
    video: 3,
    knowledge: 5,
    lawyer: 2,
  },
  {
    key: '2',
    subCategory: '사기',
    article: 7,
    video: 1,
    knowledge: 2,
    lawyer: 1,
  },
]

const CategoryManagementPage: React.FC = () => {
  const [mainData, setMainData] = useState<MainCategoryData[]>(initialMainData)
  const [subData, setSubData] = useState<SubCategoryData[]>(initialSubData)
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('')
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryData | null>(null)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [isMainCategoryEditorOpen, setIsMainCategoryEditorOpen] = useState(false)
  const [mainCategoryEditorMode, setMainCategoryEditorMode] = useState<'add' | 'edit'>('add')
  const [selectedMainCategoryData, setSelectedMainCategoryData] = useState<MainCategoryData | null>(null)

  // 대분류 관련 핸들러
  const handleMainCategoryAdd = () => {
    console.log('대분류 추가 버튼 클릭')
    setMainCategoryEditorMode('add')
    setSelectedMainCategoryData(null)
    setIsMainCategoryEditorOpen(true)
  }

  const handleMainCategoryOrderChange = (newData: MainCategoryData[]) => {
    setMainData(newData)
    // TODO: 서버 API 호출로 순서 업데이트
  }

  const handleMainCategoryClick = (record: MainCategoryData, index: number) => {
    console.log('대분류 클릭:', record, 'index:', index)
    setSelectedMainCategory(record.mainCategory)
    // TODO: 선택된 대분류에 해당하는 소분류 데이터를 서버에서 가져오기
  }

  const handleMainCategoryDoubleClick = (record: MainCategoryData, index: number) => {
    console.log('대분류 더블클릭:', record, 'index:', index)
    setMainCategoryEditorMode('edit')
    setSelectedMainCategoryData(record)
    setIsMainCategoryEditorOpen(true)
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
  const handleSubCategoryAdd = () => {
    console.log('소분류 추가 버튼 클릭')
    setModalMode('add')
    setSelectedSubCategory(null)
    setIsSubCategoryModalOpen(true)
  }

  const handleSubCategoryOrderChange = (newData: SubCategoryData[]) => {
    setSubData(newData)
    // TODO: 서버 API 호출로 순서 업데이트
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

  // 소분류 모달 관련 핸들러
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

  // 대분류 에디터 모달 관련 핸들러
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

  return (
    <main className={styles.categoryManagement}>
      <header>
        <Button className={styles.categoryManagement__button}>전체분류 엑셀저장하기</Button>
      </header>
      <section className={styles.categoryManagement__wrapper}>
        <article>
          <MainCategoryTable
            data={mainData}
            onChangeOrder={handleMainCategoryOrderChange}
            onAdd={handleMainCategoryAdd}
            onRowClick={handleMainCategoryClick}
            onRowDoubleClick={handleMainCategoryDoubleClick}
            onDelete={handleMainCategoryDelete}
          />
        </article>
        <article>
          <SubCategoryTable
            data={subData}
            onChangeOrder={handleSubCategoryOrderChange}
            onAdd={handleSubCategoryAdd}
            onRowClick={handleSubCategoryClick}
            onRowDoubleClick={handleSubCategoryDoubleClick}
            mainCategory={selectedMainCategory}
            onDelete={handleSubCategoryDelete}
          />
        </article>
      </section>

      <InputModal
        title={modalMode === 'add' ? '소분류 등록' : '분류명 변경'}
        open={isSubCategoryModalOpen}
        onCancel={handleSubCategoryModalCancel}
        onSubmit={handleSubCategoryModalSubmit}
        placeholder='소분류 이름을 입력해주세요.'
        label='소분류 이름'
        submitButtonText={modalMode === 'add' ? '등록하기' : '수정하기'}
        cancelButtonText='취소'
        defaultValue={modalMode === 'edit' ? selectedSubCategory?.subCategory : ''}
      />

      <MainCategoryEditor
        title={mainCategoryEditorMode === 'add' ? '대분류 등록' : '대분류 수정'}
        open={isMainCategoryEditorOpen}
        onCancel={handleMainCategoryEditorCancel}
        onSubmit={handleMainCategoryEditorSubmit}
        defaultValues={
          mainCategoryEditorMode === 'edit' && selectedMainCategoryData
            ? {
                name: selectedMainCategoryData.mainCategory,
                onImage: selectedMainCategoryData.icons[0] || '',
                offImage: selectedMainCategoryData.icons[1] || '',
              }
            : undefined
        }
      />
    </main>
  )
}

export default CategoryManagementPage
