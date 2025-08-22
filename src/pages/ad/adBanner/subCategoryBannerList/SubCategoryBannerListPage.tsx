import React, { useState } from 'react'
import { Table, TableProps, Button, Image } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useSubCategoryBanner } from '@/hooks/queries/useAdBanner'
import { SubCategoryBanner } from '@/types/adBannerTypes'
import styles from './subCategoryBannerList.module.scss'

const SubCategoryBannerListPage = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useSubCategoryBanner()
  const [selectedRows, setSelectedRows] = useState<SubCategoryBanner[]>([])

  const handleEdit = (record: SubCategoryBanner) => {
    navigate(`/ad-banner/sub-category-banner/${record.subBannerId}`)
  }

  const handleCreate = () => {
    navigate('/ad-banner/sub-category-banner/create')
  }

  const columns: TableProps<SubCategoryBanner>['columns'] = [
    {
      title: 'No.',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '이미지 미리보기',
      dataIndex: 'subBannerImageUrl',
      width: 300,
      render: (imageUrl: string) =>
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
      dataIndex: 'subBannerName',
      render: (name: string) => <span className={styles.bannerName}>{name}</span>,
    },
    {
      title: '배너기간',
      render: (_, record) => (
        <div className={styles.period}>
          {dayjs(record.subBannerStartedAt).format('YYYY-MM-DD')} ~<br />
          {dayjs(record.subBannerFinishedAt).format('YYYY-MM-DD')}
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
    selectedRowKeys: selectedRows.map(row => row.subBannerId),
    onChange: (_: React.Key[], selectedRows: SubCategoryBanner[]) => {
      setSelectedRows(selectedRows)
    },
  }

  return (
    <div className={styles.subCategoryBannerListPage}>
      <header className={styles.subCategoryBannerListPage__header}>
        <Button type='primary' onClick={handleCreate}>
          서브 카테고리 배너 광고 등록하기
        </Button>
      </header>
      <Table<SubCategoryBanner>
        columns={columns}
        dataSource={data || []}
        rowKey='subBannerId'
        rowSelection={rowSelection}
        loading={isLoading}
        pagination={false}
        className={styles.bannerTable}
      />
    </div>
  )
}

export default SubCategoryBannerListPage
