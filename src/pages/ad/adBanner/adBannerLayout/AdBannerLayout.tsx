import { useState, useEffect } from 'react'
import { Tabs, ConfigProvider } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { COLOR } from '@/styles/abstracts/color'
import { ROUTE_PATH } from '@/routes/routePath'
import styles from './adBanner.module.scss'

const AdBannerLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('main')

  // 현재 경로에 따라 활성 탭 설정
  useEffect(() => {
    if (location.pathname.includes('category-main') || location.pathname.includes('category-banner')) {
      setActiveTab('categoryMain')
    } else if (location.pathname.includes('sub-category') || location.pathname.includes('sub-category-banner')) {
      setActiveTab('categorySubMain')
    } else {
      setActiveTab('main')
    }
  }, [location.pathname])

  const handleTabChange = (key: string) => {
    setActiveTab(key)
    if (key === 'main') {
      navigate(ROUTE_PATH.AD_BANNER)
    } else if (key === 'categoryMain') {
      navigate(`${ROUTE_PATH.AD_BANNER_CATEGORY}`)
    } else if (key === 'categorySubMain') {
      navigate(`${ROUTE_PATH.AD_BANNER_SUB_CATEGORY}`)
    }
  }

  // const handleCancel = () => {
  //   navigate(-1)
  // }

  // const handleSave = () => {
  //   // TODO: 각 탭별 저장 로직 구현
  //   console.log('Saving tab:', activeTab)
  // }

  const items = [
    {
      label: '메인화면',
      key: 'main',
    },
    {
      label: '분류별 메인',
      key: 'categoryMain',
    },
    {
      label: '분류별 서브메인',
      key: 'categorySubMain',
    },
  ]

  return (
    <div className={styles.adBannerPage}>
      <header className={styles['adBannerPage__header']}>
        {/* <h1 className={styles['adBannerPage__header-title']}>배너 관리</h1>
        <div className={styles['adBannerPage__header-actions']}>
          <Button size='large' onClick={handleCancel}>
            취소
          </Button>
          <Button type='primary' size='large' onClick={handleSave}>
            저장
          </Button>
        </div> */}
      </header>

      <main className={styles['adBannerPage__main']}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: COLOR.GREEN_01,
            },
          }}
        >
          <Tabs
            items={items}
            activeKey={activeTab}
            onChange={handleTabChange}
            className={styles['adBannerPage__tabs']}
          />
          <Outlet />
        </ConfigProvider>
      </main>
    </div>
  )
}

export default AdBannerLayout
