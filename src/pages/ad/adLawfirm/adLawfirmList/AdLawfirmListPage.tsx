import { useState, useMemo } from 'react'
import { Button, Select, Switch, message, Checkbox } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCategory } from '@/hooks/queries/useCategory'
import styles from './adLawfirmList.module.scss'
import { CategoryList, Subcategory } from '@/types/categoryTypes'
import { DownloadOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useLawfirmInfiniteScroll } from '@/hooks/queries/useLawfirm'
import LawfirmHorizon from '@/components/lawfirmHorizon/LawfirmHorizon'
import MultipleImageSlider from '@/components/multipleImageSlider/MultipleImageSlider'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useExcelExport } from '@/hooks/useExcelExport'
import { Lawfirm } from '@/types/lawfirmTypes'
import { ROUTE_PATH } from '@/routes/routePath'

interface AdLawfirmListHeaderProps {
  subcategories: Subcategory[]
  selectedMainCategory: number | 'all'
  selectedSubCategory: number | 'all'
  handleMainCategoryChange: (value: number | 'all') => void
  handleSubCategoryChange: (value: number | 'all') => void
  categoryData: CategoryList
  handleExcelDownload: () => void
  selectedCount: number
  isDownloadDisabled: boolean
}

const AdLawfirmListHeader = ({
  subcategories,
  selectedMainCategory,
  selectedSubCategory,
  handleMainCategoryChange,
  handleSubCategoryChange,
  categoryData,
  handleExcelDownload,
  selectedCount,
  isDownloadDisabled,
}: AdLawfirmListHeaderProps) => {
  const navigate = useNavigate()

  const handleCreateLawfirm = () => {
    navigate('create')
  }

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
      <div className={styles['ad-lawfirm-list__actions']}>
        <Button onClick={handleCreateLawfirm}>로펌 광고 등록하기</Button>
        <Button icon={<DownloadOutlined />} onClick={handleExcelDownload} disabled={isDownloadDisabled}>
          선택 항목 엑셀 다운로드 ({selectedCount}건)
        </Button>
      </div>
    </header>
  )
}

const AdLawfirmListPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: categoryData } = useCategory()
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | 'all'>('all')
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | 'all'>('all')
  const [selectedLawfirms, setSelectedLawfirms] = useState<Lawfirm[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  
  // URL에서 검색 파라미터 가져오기
  const searchQuery = searchParams.get('search') || undefined
  const searchType = (searchParams.get('searchType') as 'name' | 'greeting') || 'name'
  
  const { lawfirmData, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading, error } = useLawfirmInfiniteScroll({
    searchQuery,
    lawfirmSearchType: searchType,
  })
  const { exportData } = useExcelExport()

  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.infinite-scroll-container',
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
    setSelectedSubCategory('all')
  }

  // 서브 카테고리 변경 핸들러
  const handleSubCategoryChange = (value: number | 'all') => {
    setSelectedSubCategory(value)
  }

  // 법무법인 클릭 핸들러
  const handleLawfirmClick = (lawfirm: Lawfirm) => {
    if (isSelectionMode) {
      // 선택 모드: 선택/해제 토글
      const isSelected = selectedLawfirms.some(item => item.lawfirmId === lawfirm.lawfirmId)
      if (isSelected) {
        setSelectedLawfirms(prev => prev.filter(item => item.lawfirmId !== lawfirm.lawfirmId))
      } else {
        setSelectedLawfirms(prev => [...prev, lawfirm])
      }
    } else {
      // 일반 모드: 상세 페이지로 이동
      navigate(`${ROUTE_PATH.AD_LAWFIRM}/edit/${lawfirm.lawfirmId}`)
    }
  }

  const handleSelectionModeChange = (checked: boolean) => {
    setIsSelectionMode(checked)
    if (!checked) {
      // 선택 모드 OFF 시 선택 초기화
      setSelectedLawfirms([])
    }
    message.info(checked ? '선택 모드가 활성화되었습니다' : '선택 모드가 비활성화되었습니다')
  }

  // 엑셀 다운로드 핸들러
  const handleExcelDownload = () => {
    if (selectedLawfirms.length === 0) return

    const excelData = selectedLawfirms.map(lawfirm => ({
      '법무법인 ID': lawfirm.lawfirmId,
      법무법인명: lawfirm.lawfirmName,
      주소: lawfirm.lawfirmAddress || '',
      연락처: lawfirm.lawfirmContact || '',
      홈페이지: lawfirm.lawfirmHomepageUrl || '',
      블로그: lawfirm.lawfirmBlogUrl || '',
      '인사말 제목': lawfirm.lawfirmGreetingTitle || '',
      '인사말 내용': lawfirm.lawfirmGreetingContent || '',
      등록일: lawfirm.lawfirmCreatedAt || '',
    }))

    exportData(excelData, '법무법인_목록', '법무법인')
  }

  return (
    <div className={`${styles['ad-lawfirm-list']} infinite-scroll-container`}>
      <AdLawfirmListHeader
        handleExcelDownload={handleExcelDownload}
        subcategories={subcategories}
        categoryData={categoryData || []}
        selectedMainCategory={selectedMainCategory}
        selectedSubCategory={selectedSubCategory}
        handleMainCategoryChange={handleMainCategoryChange}
        handleSubCategoryChange={handleSubCategoryChange}
        selectedCount={selectedLawfirms.length}
        isDownloadDisabled={selectedLawfirms.length === 0}
      />

      <section className={styles['content-wrapper']}>
        <div className={styles['selection-mode-bar']}>
          <div className={styles['selection-mode']}>
            {isSelectionMode && (
              <>
                <Checkbox
                  checked={lawfirmData && selectedLawfirms.length === lawfirmData.length && lawfirmData.length > 0}
                  indeterminate={
                    selectedLawfirms.length > 0 && lawfirmData && selectedLawfirms.length < lawfirmData.length
                  }
                  onChange={e => {
                    if (e.target.checked && lawfirmData) {
                      setSelectedLawfirms(lawfirmData)
                    } else {
                      setSelectedLawfirms([])
                    }
                  }}
                >
                  전체 선택
                </Checkbox>
                {selectedLawfirms.length > 0 && (
                  <span className={styles['selection-count']}>({selectedLawfirms.length}개 선택됨)</span>
                )}
                <div className={styles['divider']} />
              </>
            )}
            <Switch
              checked={isSelectionMode}
              onChange={handleSelectionModeChange}
              checkedChildren={<CheckCircleOutlined />}
              unCheckedChildren={<CheckCircleOutlined />}
            />
            <span className={styles['selection-mode-label']}>{isSelectionMode ? '선택 모드 ON' : '선택 모드 OFF'}</span>
          </div>
        </div>
        {isLoading && <div>로딩 중...</div>}
        {error && <div>에러가 발생했습니다: {error.message}</div>}
        {lawfirmData?.map(lawfirm => {
          const imageList = lawfirm.lawfirmImages.map(image => image.imageUrl)
          const hasImages = imageList && imageList.length > 0

          const isSelected = selectedLawfirms.some(item => item.lawfirmId === lawfirm.lawfirmId)

          return (
            <div
              key={lawfirm.lawfirmId}
              className={`${styles['lawfirm-item']} ${isSelected ? styles['lawfirm-item--selected'] : ''} ${
                isSelectionMode ? styles['lawfirm-item--selection-mode'] : ''
              }`}
              onClick={() => handleLawfirmClick(lawfirm)}
            >
              <LawfirmHorizon
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
        {isFetchingNextPage && <div>더 많은 데이터를 불러오는 중...</div>}
      </section>
    </div>
  )
}

export default AdLawfirmListPage
