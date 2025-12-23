import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ConfigProvider, Tabs, TabsProps, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import SearchHeader, { SearchHeaderMenuItemType } from '../../../../components/searchHeader/SearchHeader'
import styles from './legalDictionaryLayout.module.scss'
import { ROUTE_PATH } from '@/routes/routePath'
// import { noticeMenuItems } from '@/constants/board'
import { useReadNoticeCount } from '@/hooks/queries/useNotice'
import { COLOR } from '@/styles/abstracts/color'
import { LegalDictionaryProvider, useLegalDictionary } from '@/contexts/LegalDictionaryContext'
import { useExcelExport } from '@/hooks/useExcelExport'

export const LEGAL_DICTIONARY_HEADER_PORTAL_ID = 'legal-dictionary-header-portal'

const LegalDictionaryMenuItems = [
  {
    label: '한글 용어명',
    key: 'korean',
  },
  {
    label: '영문 용어명',
    key: 'english',
  },
  {
    label: '한문 용어명',
    key: 'chinese',
  },
]

const LegalDictionaryLayoutContent = () => {
  const { selectedLegalTerms, selectedReports } = useLegalDictionary()
  const { exportData } = useExcelExport()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>({
    label: '한글 용어명',
    key: 'korean',
  })

  const { data: noticeCount } = useReadNoticeCount()

  // 현재 경로에 따라 탭 선택 상태 결정
  const getActiveTab = () => {
    if (location.pathname.includes('error-report')) {
      return 'error-report'
    }
    return 'dictionary'
  }

  // 디테일 페이지인지 확인
  const isDetailPage = () => {
    const pathSegments = location.pathname.split('/')
    const lastSegment = pathSegments[pathSegments.length - 1]
    // 숫자로만 이루어진 경우 디테일 페이지로 판단
    return /^\d+$/.test(lastSegment)
  }

  // 편집 페이지인지 확인
  const isEditPage = () => {
    return location.pathname.includes('/edit')
  }

  // URL 경로 기반으로 activeTab 결정 (state 대신 직접 계산)
  const activeTab = getActiveTab()

  const handleExcelDownload = () => {
    if (activeTab === 'dictionary') {
      if (selectedLegalTerms.length === 0) return

      const excelData = selectedLegalTerms.map(term => ({
        '한글 용어명': term.koreanName,
        '영문 용어명': term.englishName,
        '한문 용어명': term.chineseName,
      }))

      exportData(excelData, '법률용어', '법률용어목록')
    } else {
      if (selectedReports.length === 0) return

      const excelData = selectedReports.map(report => ({
        신고번호: report.id,
        용어명: report.koreanName,
        신고유형: report.reportType,
        상태: report.status,
        신고일시: report.createdAt,
      }))

      exportData(excelData, '오류신고', '오류신고내역')
    }
  }

  const getSelectedCount = () => {
    return activeTab === 'dictionary' ? selectedLegalTerms.length : selectedReports.length
  }

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
  }

  const handleSearch = (value: string) => {
    const params = new URLSearchParams()
    if (value) params.set('searchQuery', value)
    if (selectedItem?.key) params.set('searchType', String(selectedItem.key))
    navigate(`${ROUTE_PATH.BOARD_LEGAL_DICTIONARY}?${params.toString()}`)
  }

  const handleTabChange = (key: string) => {
    if (key === 'dictionary') {
      navigate(ROUTE_PATH.BOARD_LEGAL_DICTIONARY)
    } else {
      navigate(`${ROUTE_PATH.BOARD_LEGAL_DICTIONARY}/error-report`)
    }
  }

  const items: TabsProps['items'] = [
    {
      key: 'dictionary',
      label: '법률백과',
    },
    {
      key: 'error-report',
      label: '오류신고내역',
    },
  ]

  return (
    <div className={styles.noticeListPage}>
      <SearchHeader
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
        placeholder='분류 선택'
        searchPlaceholder='검색어를 입력하세요'
        onSearch={handleSearch}
        menuItems={LegalDictionaryMenuItems}
        bordered={false}
        title={`전체 : ${noticeCount?.total}개가 등록되어 있습니다.`}
        className={styles.noticeListPage__searchHeader}
      />
      <header className={styles.legalDictionaryLayout__header}>
        <div id={LEGAL_DICTIONARY_HEADER_PORTAL_ID} />
      </header>
      {!isDetailPage() && !isEditPage() && (
        <div style={{ padding: '0 24px' }}>
          <div className={styles['button-wrapper']}>
            <Button icon={<DownloadOutlined />} onClick={handleExcelDownload} disabled={getSelectedCount() === 0}>
              선택 항목 엑셀 다운로드 ({getSelectedCount()}건)
            </Button>
            <Button
              onClick={() => navigate(`${ROUTE_PATH.BOARD_LEGAL_DICTIONARY}/${ROUTE_PATH.BOARD_LEGAL_DICTIONARY_EDIT}`)}
            >
              법률용어 추가
            </Button>
          </div>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: COLOR.GREEN_01,
              },
            }}
          >
            <Tabs activeKey={activeTab} items={items} onChange={handleTabChange} />
          </ConfigProvider>
        </div>
      )}
      <div className={styles.legalDictionaryLayout__container}>
        <Outlet />
      </div>
    </div>
  )
}

const LegalDictionaryLayout = () => {
  return (
    <LegalDictionaryProvider>
      <LegalDictionaryLayoutContent />
    </LegalDictionaryProvider>
  )
}

export default LegalDictionaryLayout
