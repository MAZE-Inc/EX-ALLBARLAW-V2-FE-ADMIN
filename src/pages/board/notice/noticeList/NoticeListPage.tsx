import { NoticeType } from '@/types/noticeTypes'
import { Table, TableProps } from 'antd'
import styles from './noticeList.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'

const columns: TableProps<NoticeType>['columns'] = [
  {
    title: '구분',
    dataIndex: 'category',
    key: 'category',
    width: 120,
  },
  {
    title: '제목',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '등록일',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 120,
  },
]

const NoticeListPage = () => {
  const navigate = useNavigate()

  const rowSelection = {
    // 체크박스 핸들러
    onSelectAll: (selected: boolean, selectedRows: NoticeType[], changeRows: NoticeType[]) => {
      console.log('onselectall', selected, selectedRows, changeRows)
    },
    onSelect: (record: NoticeType, selected: boolean, selectedRows: NoticeType[]) => {
      console.log('onselect', record, selected, selectedRows)
    },
  }

  const handleRowClick = (record: NoticeType) => {
    const noticeId = record.noticeId
    navigate(`${ROUTE_PATH.BOARD_NOTICE}/${noticeId}`)
  }

  return (
    <section className={styles.noticeList}>
      <Table<NoticeType>
        columns={columns}
        dataSource={data}
        rowKey='noticeId'
        rowSelection={rowSelection}
        onRow={record => {
          return {
            onClick: () => handleRowClick(record),
          }
        }}
        pagination={{
          position: ['bottomCenter'],
        }}
      />
    </section>
  )
}

export default NoticeListPage

const data: NoticeType[] = [
  {
    noticeId: 1,
    category: '공지사항',
    title: '공지사항 1',
    createdAt: '2025-01-01',
  },
  {
    noticeId: 2,
    category: '업데이트',
    title: '이벤트 | 업데이트 1',
    createdAt: '2025-01-01',
  },
  {
    noticeId: 3,
    category: '공지사항',
    title: '공지사항 3',
    createdAt: '2025-01-01',
  },
  {
    noticeId: 4,
    category: '이벤트',
    title: '공지사항 4',
    createdAt: '2025-01-01',
  },
]
