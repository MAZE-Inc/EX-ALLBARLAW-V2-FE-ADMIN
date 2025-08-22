import React, { useState } from 'react'
import { Table, TableProps, Button, Image } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useCategoryBanner } from '@/hooks/queries/useAdBanner'
import { CategoryBanner } from '@/types/adBannerTypes'
import styles from './categoryBannerList.module.scss'
import { ROUTE_PATH } from '@/routes/routePath'

const CategoryBannerListPage = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useCategoryBanner()
  const [selectedRows, setSelectedRows] = useState<CategoryBanner[]>([])

  const handleEdit = (record: CategoryBanner) => {
    navigate(`${ROUTE_PATH.AD_BANNER}/category-banner/${record.subMainBannerId}`)
  }

  const columns: TableProps<CategoryBanner>['columns'] = [
    {
      title: 'No.',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '이미지 미리보기',
      dataIndex: 'subMainBannerImageUrl',
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
      dataIndex: 'subMainBannerName',
      render: (name: string) => <span className={styles.bannerName}>{name}</span>,
    },
    {
      title: '배너기간',
      render: (_, record) => (
        <div className={styles.period}>
          {dayjs(record.subMainBannerStartedAt).format('YYYY-MM-DD')} ~<br />
          {dayjs(record.subMainBannerFinishedAt).format('YYYY-MM-DD')}
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
    selectedRowKeys: selectedRows.map(row => row.subMainBannerId),
    onChange: (_: React.Key[], selectedRows: CategoryBanner[]) => {
      setSelectedRows(selectedRows)
    },
  }

  const handleCreate = () => {
    navigate(`${ROUTE_PATH.AD_BANNER}/category-banner/create`)
  }

  return (
    <div className={styles.categoryBannerListPage}>
      <header>
        <Button type='primary' onClick={handleCreate}>
          카테고리 화면 배너 광고 등록하기
        </Button>
      </header>
      <Table<CategoryBanner>
        columns={columns}
        dataSource={data || []}
        rowKey='subMainBannerId'
        rowSelection={rowSelection}
        loading={isLoading}
        pagination={false}
        className={styles.bannerTable}
      />
    </div>
  )
}

export default CategoryBannerListPage
