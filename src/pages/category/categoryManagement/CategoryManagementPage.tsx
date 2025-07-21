import React, { useState } from 'react'
import { Button } from 'antd'
import styles from '@/pages/category/categoryManagement/categoryManagement.module.scss'
import MainCategoryTable, { MainCategoryData } from '@/container/category/mainCategoryTable/MainCategoryTable'
import SubCategoryTable, { SubCategoryData } from '@/container/category/subCategoryTable/SubCategoryTable'

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

  // 대분류 관련 핸들러
  const handleMainCategoryAdd = () => {
    console.log('대분류 추가')
    // TODO: 서버 API 호출
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
    // TODO: 더블클릭 시 원하는 동작 구현 (예: 수정 모달 열기)
  }

  // 소분류 관련 핸들러
  const handleSubCategoryAdd = () => {
    console.log('소분류 추가')
    // TODO: 서버 API 호출
  }

  const handleSubCategoryOrderChange = (newData: SubCategoryData[]) => {
    setSubData(newData)
    // TODO: 서버 API 호출로 순서 업데이트
  }

  const handleSubCategoryClick = (record: SubCategoryData, index: number) => {
    console.log('소분류 클릭:', record, 'index:', index)
    // TODO: 클릭 시 원하는 동작 구현
  }

  const handleSubCategoryDoubleClick = (record: SubCategoryData, index: number) => {
    console.log('소분류 더블클릭:', record, 'index:', index)
    // TODO: 더블클릭 시 원하는 동작 구현 (예: 수정 모달 열기)
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
          />
        </article>
      </section>
    </main>
  )
}

export default CategoryManagementPage
