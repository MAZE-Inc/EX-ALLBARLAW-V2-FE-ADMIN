import { useState, useMemo } from 'react'
import { Button, Select } from 'antd'
import { useCategory } from '@/hooks/queries/useCategory'
import styles from './adLawfirmList.module.scss'
import { CategoryList, Subcategory } from '@/types/categoryTypes'
import { DownloadOutlined } from '@ant-design/icons'
import { useLawfirmInfiniteScroll } from '@/hooks/queries/useLawfirm'
import LawfirmHorizon from '@/components/lawfirmHorizon/LawfirmHorizon'
import MultipleImageSlider from '@/components/multipleImageSlider/MultipleImageSlider'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

interface AdLawfirmListHeaderProps {
  subcategories: Subcategory[]
  selectedMainCategory: number | 'all'
  selectedSubCategory: number | 'all'
  handleMainCategoryChange: (value: number | 'all') => void
  handleSubCategoryChange: (value: number | 'all') => void
  categoryData: CategoryList
  handleExcelDownload: () => void
}

const AdLawfirmListHeader = ({
  subcategories,
  selectedMainCategory,
  selectedSubCategory,
  handleMainCategoryChange,
  handleSubCategoryChange,
  categoryData,
  handleExcelDownload,
}: AdLawfirmListHeaderProps) => {
  return (
    <header className={styles['ad-lawfirm-list__header']}>
      <div className={styles['ad-lawfirm-list__filters']}>
        <Select
          className={styles['ad-lawfirm-list__select']}
          value={selectedMainCategory}
          onChange={handleMainCategoryChange}
          placeholder='메인 카테고리'
          style={{ width: 200 }}
        >
          <Select.Option value='all'>전체</Select.Option>
          {categoryData?.map(category => (
            <Select.Option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </Select.Option>
          ))}
        </Select>

        <Select
          className={styles['ad-lawfirm-list__select']}
          value={selectedSubCategory}
          onChange={handleSubCategoryChange}
          placeholder='서브 카테고리'
          style={{ width: 200 }}
          disabled={selectedMainCategory === 'all'}
        >
          <Select.Option value='all'>전체</Select.Option>
          {subcategories.map(subcategory => (
            <Select.Option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
              {subcategory.subcategoryName}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Button icon={<DownloadOutlined />} onClick={handleExcelDownload} disabled={false}>
        {/* 선택 항목 엑셀 다운로드 ({selectedRows.length}건) */}
        선택 항목 엑셀 다운로드
      </Button>
    </header>
  )
}

const AdLawfirmListPage = () => {
  const { data: categoryData } = useCategory()
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | 'all'>('all')
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | 'all'>('all')
  const { lawfirmData, hasNextPage, isFetchingNextPage, fetchNextPage } = useLawfirmInfiniteScroll()

  // 선택된 메인 카테고리의 서브 카테고리 목록 가져오기

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

  const subcategories = useMemo(() => {
    if (selectedMainCategory === 'all' || !categoryData) {
      return []
    }
    const mainCategory = categoryData.find(cat => cat.categoryId === selectedMainCategory)
    return mainCategory?.subcategories || []
  }, [selectedMainCategory, categoryData])

  // 메인 카테고리 변경 핸들러
  const handleMainCategoryChange = (value: number | 'all') => {
    setSelectedMainCategory(value)
    setSelectedSubCategory('all') // 메인 카테고리 변경 시 서브 카테고리 초기화
  }

  // 서브 카테고리 변경 핸들러
  const handleSubCategoryChange = (value: number | 'all') => {
    setSelectedSubCategory(value)
  }

  return (
    <div className={styles['ad-lawfirm-list']}>
      <AdLawfirmListHeader
        handleExcelDownload={() => {}}
        subcategories={subcategories}
        categoryData={categoryData || []}
        selectedMainCategory={selectedMainCategory}
        selectedSubCategory={selectedSubCategory}
        handleMainCategoryChange={handleMainCategoryChange}
        handleSubCategoryChange={handleSubCategoryChange}
      />

      <section className={styles['content-wrapper']}>
        {lawfirmData?.map(lawfirm => {
          const imageList = lawfirm.lawfirmImages.map(image => image.imageUrl)
          const hasImages = imageList && imageList.length > 0

          return (
            <div key={lawfirm.lawfirmId} className={styles['lawfirm-item']}>
              <LawfirmHorizon
                // className={styles['content-wrapper']}
                lawfirmId={lawfirm.lawfirmId}
                lawfirmThumbnail={lawfirm.lawfirmLogoImageUrl || ''}
                blogUrl={lawfirm.lawfirmBlogUrl}
                lawfirmName={lawfirm.lawfirmName}
                title={lawfirm.lawfirmGreetingTitle || ''}
                description={lawfirm.lawfirmGreetingContent || ''}
                address={lawfirm.lawfirmAddress || ''}
                phoneNumber={lawfirm.lawfirmContact}
                homepageUrl={lawfirm.lawfirmHomepageUrl}
                linkList={lawfirm.lawfirmDirects.map(direct => ({
                  lawfirmDirectId: direct.id,
                  lawfirmDirectName: direct.name,
                  lawfirmDirectLink: direct.link,
                }))}
              />
              {hasImages && <MultipleImageSlider imageList={imageList} />}
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default AdLawfirmListPage
