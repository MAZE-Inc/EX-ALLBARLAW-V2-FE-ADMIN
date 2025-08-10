import React, { useState, useMemo } from 'react'
import { Button, Spin, Alert } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import styles from '@/pages/category/categoryManagement/categoryManagement.module.scss'
import MainCategoryTable, { MainCategoryData } from '@/container/category/mainCategoryTable/MainCategoryTable'
import SubCategoryTable, { SubCategoryData } from '@/container/category/subCategoryTable/SubCategoryTable'
import InputModal from '@/components/inputModal'
import MainCategoryEditor from '@/container/category/MainCategoryEditor'
import { useCategoryManagement } from '@/hooks/useCategoryManagement'
import { useModalHandlers } from '@/hooks/useModalHandlers'
import { useCategory } from '@/hooks/queries/useCategory'
import { useExcelExport } from '@/hooks/useExcelExport'

const CategoryManagementPage: React.FC = () => {
  // React Query로 실제 데이터 가져오기
  const { data: categoryData, isLoading, error } = useCategory()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const { exportCategories } = useExcelExport()

  // 서버 데이터를 컴포넌트 형식으로 변환
  const mainData = useMemo<MainCategoryData[] | undefined>(() => {
    if (!categoryData) return undefined

    return categoryData.map(category => ({
      key: category.categoryId.toString(),
      mainCategory: category.categoryName,
      icons: [category.categoryImageUrl || '', category.categoryClickedImageUrl || ''],
      subCategory: category.categorySubcategoryCount,
    }))
  }, [categoryData])

  const subData = useMemo<SubCategoryData[] | undefined>(() => {
    if (!categoryData || !selectedCategoryId) return undefined

    const selectedCategory = categoryData.find(category => category.categoryId === selectedCategoryId)

    if (!selectedCategory) return undefined

    return selectedCategory.subcategories.map(sub => ({
      key: sub.subcategoryId.toString(),
      subCategory: sub.subcategoryName,
      article: 0, // 실제 API에서 제공되지 않는 데이터는 0으로 초기화
      video: 0,
      knowledge: 0,
      lawyer: 0,
    }))
  }, [categoryData, selectedCategoryId])

  // 커스텀 훅으로 상태와 핸들러 분리 - 데이터 주입 방식
  const {
    mainData: processedMainData,
    subData: processedSubData,
    selectedMainCategory,
    handleMainCategoryOrderChange,
    handleMainCategoryClick: originalHandleMainCategoryClick,
    handleMainCategoryDelete,
    handleSubCategoryOrderChange,
    handleSubCategoryDelete,
  } = useCategoryManagement({
    initialMainData: mainData,
    initialSubData: subData,
  })

  // 대분류 클릭 시 선택된 카테고리 ID 업데이트
  const handleMainCategoryClick = (record: MainCategoryData) => {
    const categoryId = parseInt(record.key)
    setSelectedCategoryId(categoryId)
    originalHandleMainCategoryClick(record, categoryId)
  }

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
  } = useModalHandlers({ selectedCategoryId })

  // 로딩 상태
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size='large' spinning={true} tip='데이터를 불러오는 중...'>
          <div style={{ padding: 50 }} />
        </Spin>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message='오류 발생'
          description={error instanceof Error ? error.message : '데이터를 불러오는 중 오류가 발생했습니다.'}
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
        <Button 
          className={styles.categoryManagement__button}
          icon={<DownloadOutlined />}
          onClick={() => exportCategories(categoryData)}
        >
          전체분류 엑셀저장하기
        </Button>
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
                id: parseInt(selectedMainCategoryData.key),  // 카테고리 ID 추가
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
