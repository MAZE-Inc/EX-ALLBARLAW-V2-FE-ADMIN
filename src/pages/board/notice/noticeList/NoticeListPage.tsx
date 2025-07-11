import { Button, Table, TableProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import { useGetNoticeList } from '@/hooks/queries/useGetNoticeList'
import { useState, useEffect, useMemo } from 'react'
import { NoticeType, NoticeListResponse } from '@/types/noticeTypes'
import React from 'react'

const columns: TableProps<NoticeType>['columns'] = [
  {
    title: '카테고리',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '제목',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '작성일',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
]

const NoticeListPage = () => {
  const navigate = useNavigate()
  const [noticePage, setNoticePage] = useState(1)
  const { data: noticeListResponse, isError, error } = useGetNoticeList(noticePage)

  useEffect(() => {
    if (isError) {
      console.error('공지사항 목록을 불러오는데 실패했습니다:', error)
    }
  }, [isError, error])

  // 응답 데이터를 프론트엔드 타입으로 변환
  const noticeList = useMemo(() => {
    if (!noticeListResponse) return []

    console.log('Component Data:', noticeListResponse)
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

  console.log(noticeList)

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: NoticeType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    getCheckboxProps: (record: NoticeType) => ({
      name: record.title,
    }),
  }

  const handleCreateNotice = () => {
    navigate(`${ROUTE_PATH.BOARD_NOTICE}/${ROUTE_PATH.BOARD_NOTICE_EDIT}`)
  }

  return (
    <div>
      <Button onClick={handleCreateNotice}>공지사항 작성</Button>
      <Table<NoticeType>
        columns={columns}
        dataSource={noticeList}
        rowKey='noticeId'
        rowSelection={rowSelection}
        pagination={{
          current: noticePage,
          onChange: setNoticePage,
        }}
      />
    </div>
  )
}

export default NoticeListPage
