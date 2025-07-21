import React, { useState, useEffect } from 'react'
import { Button, Spin, Alert } from 'antd'
import styles from '@/pages/category/categoryManagement/categoryManagement.module.scss'
import MainCategoryTable, { MainCategoryData } from '@/container/category/mainCategoryTable/MainCategoryTable'
import SubCategoryTable, { SubCategoryData } from '@/container/category/subCategoryTable/SubCategoryTable'
import InputModal from '@/components/inputModal'
import MainCategoryEditor from '@/container/category/MainCategoryEditor'
import { useCategoryManagement } from '@/hooks/useCategoryManagement'
import { useModalHandlers } from '@/hooks/useModalHandlers'

// 목업 데이터 (실제로는 서버에서 받아올 예정)
const mockMainData: MainCategoryData[] = [
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

const mockSubData: SubCategoryData[] = [
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
  // 비동기 데이터 처리를 위한 상태
  const [mainData, setMainData] = useState<MainCategoryData[] | undefined>(undefined)
  const [subData, setSubData] = useState<SubCategoryData[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 데이터 로딩 시뮬레이션 (실제로는 쿼리 훅에서 처리)
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // 비동기 처리 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 성공 시 데이터 설정
        setMainData(mockMainData)
        setSubData(mockSubData)
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
        console.error('데이터 로딩 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // 커스텀 훅으로 상태와 핸들러 분리 - 데이터 주입 방식
  const {
    mainData: processedMainData,
    subData: processedSubData,
    selectedMainCategory,
    handleMainCategoryOrderChange,
    handleMainCategoryClick,
    handleMainCategoryDelete,
    handleSubCategoryOrderChange,
    handleSubCategoryDelete,
  } = useCategoryManagement({
    initialMainData: mainData,
    initialSubData: subData,
  })

  const {
    isSubCategoryModalOpen,
    selectedSubCategory,
    modalMode,
    isMainCategoryEditorOpen,
    mainCategoryEditorMode,
    selectedMainCategoryData,
    handleMainCategoryAdd,
    handleMainCategoryDoubleClick,
    handleMainCategoryEditorCancel,
    handleMainCategoryEditorSubmit,
    handleSubCategoryAdd,
    handleSubCategoryClick,
    handleSubCategoryDoubleClick,
    handleSubCategoryModalCancel,
    handleSubCategoryModalSubmit,
  } = useModalHandlers()

  // 로딩 상태
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size='large' tip='데이터를 불러오는 중...' />
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message='오류 발생'
          description={error}
          type='error'
          showIcon
          action={<Button onClick={() => window.location.reload()}>다시 시도</Button>}
        />
      </div>
    )
  }

  return (
    <main className={styles.categoryManagement}>
      <header>
        <Button className={styles.categoryManagement__button}>전체분류 엑셀저장하기</Button>
      </header>
      <section className={styles.categoryManagement__wrapper}>
        <article>
          <MainCategoryTable
            data={processedMainData}
            onChangeOrder={handleMainCategoryOrderChange}
            onAdd={handleMainCategoryAdd}
            onRowClick={handleMainCategoryClick}
            onRowDoubleClick={handleMainCategoryDoubleClick}
            onDelete={handleMainCategoryDelete}
          />
        </article>
        <article>
          <SubCategoryTable
            data={processedSubData}
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
