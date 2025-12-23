import { useState } from 'react'
import { Table, TableProps, Tabs, TabsProps, ConfigProvider } from 'antd'
import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import styles from './chat.module.scss'
import dayjs from 'dayjs'
import { useChatList } from '@/hooks/queries/useChat'
import { ChatListRequest } from '@/types/chatTypes'
import { Pagination } from '@/components/pagination/Pagination'
import { COLOR } from '@/styles/abstracts/color'

interface ChatTableData {
  key: string
  chatRoomId: number
  userName: string
  userMessageCount: number
  lawyerName: string
  lawyerMessageCount: number
  firstMessageAt: string
  lastMessageAt: string
  status: string
}

const ChatListMenuItems = [
  {
    label: '의뢰인',
    key: 'userName',
  },
  {
    label: '변호사',
    key: 'lawyerName',
  },
]

const ChatListPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'ended'>('all')
  const [orderBy, _setOrderBy] = useState<ChatListRequest['orderBy']>('lastMessageAt')
  const [sort, _setSort] = useState<ChatListRequest['sort']>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>({
    label: '의뢰인',
    key: 'userName',
  })

  const { data: chatListData, isLoading } = useChatList({
    chatRoomPage: currentPage,
    orderBy,
    sort,
    chatRoomStatus: activeTab,
    searchType: selectedItem?.key as ChatListRequest['searchType'],
    searchQuery,
  })

  // API 응답 데이터를 테이블 형식으로 변환
  const tableData: ChatTableData[] = []
  chatListData?.chatRoomList?.forEach(user => {
    user.chatRooms?.forEach(room => {
      tableData.push({
        key: `${room.chatRoomId}`,
        chatRoomId: room.chatRoomId,
        userName: user.userName,
        userMessageCount: room.userMessageCount,
        lawyerName: room.lawyerName,
        lawyerMessageCount: room.lawyerMessageCount,
        firstMessageAt: room.firstMessageAt,
        lastMessageAt: room.lastMessageAt,
        status: room.isEnded ? '종료' : '진행중',
      })
    })
  })

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => setCurrentPage(page)

  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  // 탭 변경 핸들러
  const handleTabChange = (key: string) => {
    setActiveTab(key as 'all' | 'active' | 'ended')
    setCurrentPage(1) // 탭 변경 시 페이지 초기화
  }

  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: '전체',
    },
    {
      key: 'active',
      label: '진행중인 채팅방',
    },
    {
      key: 'ended',
      label: '종료된 채팅방',
    },
  ]

  const columns: TableProps<ChatTableData>['columns'] = [
    {
      title: '채팅No.',
      dataIndex: 'chatRoomId',
      rowScope: 'row',
    },
    {
      title: (
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #f0f0f0' }}>의뢰인</div>
          <div style={{ flex: 1, textAlign: 'center' }}>변호사</div>
        </div>
      ),
      children: [
        {
          title: '의뢰인명',
          dataIndex: 'userName',
          key: 'userName',
        },
        {
          title: '채팅수',
          dataIndex: 'userMessageCount',
          key: 'userMessageCount',
          align: 'center' as const,
        },
        {
          title: '변호사명',
          dataIndex: 'lawyerName',
          key: 'lawyerName',
        },
        {
          title: '채팅수',
          dataIndex: 'lawyerMessageCount',
          key: 'lawyerMessageCount',
          align: 'center' as const,
        },
      ],
    },
    {
      title: '최초 채팅 일시',
      dataIndex: 'firstMessageAt',
      align: 'center' as const,
      render: (value: string) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm') : ''),
    },
    {
      title: '마지막 채팅 일시',
      dataIndex: 'lastMessageAt',
      align: 'center' as const,
      render: (value: string) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm') : ''),
    },
    {
      title: '채팅 종료 여부\n(채팅방 종료)',
      dataIndex: 'status',
      align: 'center' as const,
    },
  ]

  return (
    <div className={styles['chat-list-page']}>
      <SearchHeader
        className={styles['admin-layout__searchHeader']}
        bordered={false}
        menuItems={ChatListMenuItems}
        title='채팅 관리'
        placeholder='선택'
        onSelectionChange={handleSelectionChange}
        onSearch={handleSearch}
        searchPlaceholder='검색어를 입력하세요'
        selectedItem={selectedItem}
      />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: COLOR.GREEN_01,
          },
        }}
      >
        <Tabs defaultActiveKey='all' items={items} onChange={handleTabChange} />
      </ConfigProvider>
      <div className={styles['chat-list-container']}>
        <Table<ChatTableData>
          columns={columns}
          dataSource={tableData}
          rowKey='chatRoomId'
          pagination={false}
          loading={isLoading}
          bordered
          onRow={record => ({
            onClick: () => {
              // 상세 페이지로 이동
              console.log('Chat detail:', record.chatRoomId)
            },
          })}
        />
        {chatListData?.chatRoomTotalPages && (
          <div className={styles['pagination-wrapper']}>
            <Pagination
              currentPage={currentPage}
              totalPages={chatListData.chatRoomTotalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatListPage
