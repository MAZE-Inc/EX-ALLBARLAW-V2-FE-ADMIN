import { Button, Table, TableProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { useState, useEffect, useMemo } from 'react'
import { NoticeType, ServerNoticeType } from '@/types/boardTypes'
import React from 'react'
import styles from './noticeList.module.scss'
import dayjs from 'dayjs'
import { useGetNoticeList, useReadNoticeType } from '@/hooks/queries/useNotice'

const NoticeListPage = () => {
  const navigate = useNavigate()
  const [noticePage, setNoticePage] = useState(1)
  const { getTypeName } = useReadNoticeType()

  const { data: noticeListResponse, isError, error } = useGetNoticeList(noticePage)

  useEffect(() => {
    if (isError) {
      console.error('공지사항 목록을 불러오는데 실패했습니다:', error)
    }
  }, [isError, error])

  const handleCreateNotice = () => {
    navigate(`${ROUTE_PATH.BOARD_NOTICE}/${ROUTE_PATH.BOARD_NOTICE_EDIT}`)
  }

  const handleRowClick = (record: NoticeType) => {
    navigate(`${ROUTE_PATH.BOARD_NOTICE}/${record.noticeId}`)
  }

  const noticeList = useMemo(() => {
    if (!noticeListResponse) return []

    return noticeListResponse.map((notice: ServerNoticeType) => {
      return {
        noticeId: notice.noticeId,
        category: getTypeName(notice.noticeTypeId),
        title: notice.noticeTitle,
        createdAt: notice.noticeCreatedAt,
      }
    })
  }, [noticeListResponse])

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: NoticeType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    getCheckboxProps: (record: NoticeType) => ({
      name: record.title,
    }),
  }

  const columns: TableProps<NoticeType>['columns'] = [
    {
      title: '구분',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      width: '15%',
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      width: '60%',
      align: 'center',
    },
    {
      title: '등록 일자',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: (value: string) => (value ? dayjs(value).format('YY-MM-DD') : ''),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Button className={styles.noticeListPage__button} onClick={handleCreateNotice}>
        공지사항 작성
      </Button>
      <Table<NoticeType>
        columns={columns}
        dataSource={noticeList}
        rowKey='noticeId'
        rowSelection={rowSelection}
        onRow={record => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
        pagination={{
          current: noticePage,
          onChange: setNoticePage,
        }}
      />
    </div>
  )
}

export default NoticeListPage
