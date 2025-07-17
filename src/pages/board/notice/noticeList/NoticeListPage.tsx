import { Button, Table, TableProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { useGetNoticeList } from '@/hooks/queries/useGetNotice'
import { useState, useEffect, useMemo } from 'react'
import { NoticeType, NoticeListResponse } from '@/types/boardTypes'
import React from 'react'
import styles from './noticeList.module.scss'
import dayjs from 'dayjs'

const NoticeListPage = () => {
  const navigate = useNavigate()
  const [noticePage, setNoticePage] = useState(1)
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

  // 응답 데이터를 프론트엔드 타입으로 변환
  const noticeList = useMemo(() => {
    if (!noticeListResponse) return []

    return noticeListResponse.map((notice: NoticeListResponse[number]) => {
      let category: '공지사항' | '이벤트' | '업데이트'
      if (notice.noticeTypeId === 1) category = '공지사항'
      else if (notice.noticeTypeId === 2) category = '이벤트'
      else category = '업데이트'

      return {
        noticeId: notice.noticeId,
        category,
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
