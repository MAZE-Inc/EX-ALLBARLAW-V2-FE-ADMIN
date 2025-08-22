import React, { useState } from 'react'
import { Table, TableProps, Button, Image } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useMainBanner } from '@/hooks/queries/useAdBanner'
import { MainBanner } from '@/types/adBannerTypes'
import styles from './mainBannerList.module.scss'
import { ROUTE_PATH } from '@/routes/routePath'

const MainBannerListPage = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useMainBanner()
  const [selectedRows, setSelectedRows] = useState<MainBanner[]>([])

  const handleEdit = (record: MainBanner) => {
    navigate(`${ROUTE_PATH.AD_BANNER}/main-banner/${record.mainBannerId}`)
  }

  const columns: TableProps<MainBanner>['columns'] = [
    {
      title: 'No.',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '이미지 미리보기',
      dataIndex: 'mainBannerImageUrl',
      width: 300,
      render: (imageUrl: string | null) =>
        imageUrl ? (
          <div className={styles.imagePreview}>
            <Image src={imageUrl} alt='배너 이미지' style={{ maxWidth: '100%', height: 'auto', maxHeight: '80px' }} />
          </div>
        ) : (
          <div className={styles.noImage}>이미지 없음</div>
        ),
    },
    {
      title: '배너이름',
      dataIndex: 'mainBannerName',
      render: (name: string) => <span className={styles.bannerName}>{name}</span>,
    },
    {
      title: '배너기간',
      render: (_, record) => (
        <div className={styles.period}>
          {dayjs(record.mainBannerStartedAt).format('YYYY-MM-DD')} ~<br />
          {dayjs(record.mainBannerFinishedAt).format('YYYY-MM-DD')}
        </div>
      ),
    },
    {
      title: '관리',
      width: 100,
      render: (_, record) => (
        <Button type='primary' size='small' onClick={() => handleEdit(record)} className={styles.editButton}>
          배너관리
        </Button>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedRows.map(row => row.mainBannerId),
    onChange: (_: React.Key[], selectedRows: MainBanner[]) => {
      setSelectedRows(selectedRows)
    },
  }

  const handleCreate = () => {
    navigate(`${ROUTE_PATH.AD_BANNER}/main-banner/create`)
  }

  return (
    <div className={styles.mainBannerListPage}>
      <header>
        <Button type='primary' onClick={handleCreate}>
          메인 화면 배너 광고 등록하기
        </Button>
      </header>
      <Table<MainBanner>
        columns={columns}
        dataSource={data || []}
        rowKey='mainBannerId'
        rowSelection={rowSelection}
        loading={isLoading}
        pagination={false}
        className={styles.bannerTable}
      />
    </div>
  )
}

export default MainBannerListPage
