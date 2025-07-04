import { Table, TableProps } from 'antd'
import styles from './managerList.module.scss'
import React, { useEffect, useState } from 'react'

type Manager = {
  key: React.Key
  accountType: '통합 관리자' | 'CS 관리자'
  userId: string
  email: string
  name: string
  isActive: boolean
}

const columns: TableProps<Manager>['columns'] = [
  {
    title: '계정구분',
    dataIndex: 'accountType',
    key: 'accountType',
    sorter: (a, b) => a.accountType.localeCompare(b.accountType),
  },
  {
    title: '아이디',
    dataIndex: 'userId',
    key: 'userId',
    sorter: (a, b) => a.userId.localeCompare(b.userId),
  },
  {
    title: '이메일 주소',
    dataIndex: 'email',
    key: 'email',
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: '계정이름',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: '계정사용 여부',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (isActive: boolean) => (isActive ? '사용' : '미사용'),
    sorter: (a, b) => Number(a.isActive) - Number(b.isActive),
  },
]

const allManagers: Manager[] = [
  {
    key: 1,
    accountType: '통합 관리자',
    userId: 'admin_master',
    email: 'master@allbarlaw.com',
    name: '김총괄',
    isActive: true,
  },
  {
    key: 2,
    accountType: 'CS 관리자',
    userId: 'cs_manager_01',
    email: 'cs01@allbarlaw.com',
    name: '이친절',
    isActive: true,
  },
  {
    key: 3,
    accountType: 'CS 관리자',
    userId: 'cs_manager_02',
    email: 'cs02@allbarlaw.com',
    name: '박상담',
    isActive: false,
  },
  {
    key: 4,
    accountType: '통합 관리자',
    userId: 'admin_sub',
    email: 'sub_master@allbarlaw.com',
    name: '최부괄',
    isActive: true,
  },
  {
    key: 5,
    accountType: 'CS 관리자',
    userId: 'cs_manager_03',
    email: 'cs03@allbarlaw.com',
    name: '정신속',
    isActive: true,
  },
]

type ManagerListProps = {
  type: 'total' | 'admin-manager' | 'cs-manager'
}

const ManagerList = ({ type }: ManagerListProps) => {
  const [data, setData] = useState<Manager[]>([])

  useEffect(() => {
    if (type === 'admin-manager') {
      setData(allManagers.filter(manager => manager.accountType === '통합 관리자'))
    } else if (type === 'cs-manager') {
      setData(allManagers.filter(manager => manager.accountType === 'CS 관리자'))
    } else {
      setData(allManagers)
    }
  }, [type])

  const rowSelection = {
    onSelectAll: (selected: boolean, selectedRows: Manager[]) => {
      console.log('전체 선택:', selected, selectedRows)
    },
    onSelect: (record: Manager, selected: boolean) => {
      console.log('개별 선택:', record, selected)
    },
  }

  return (
    <div className={styles['manager-list-container']}>
      <Table<Manager>
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        pagination={{
          position: ['bottomCenter'],
        }}
      />
    </div>
  )
}

export default ManagerList
