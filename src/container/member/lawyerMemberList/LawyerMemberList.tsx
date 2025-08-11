import React, { useState } from 'react'
import { Button, Table, TableProps } from 'antd'
import styles from './lawyerMemberList.module.scss'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/routes/routePath'
import LawyerApprovalModal from '@/components/lawyerApprovalModal/LawyerApprovalModal'

// LawyerInfoListResponse의 lawyerList 항목 타입
interface LawyerMember {
  lawyerId: number
  lawyerAccount?: string  // 아이디 필드 추가 (API에 있다면)
  lawyerEmail: string
  lawyerName: string
  lawyerContact: string | null
  lawyerLawfirmName: string | null
  lawyerLawfirmContact: string
  lawyerBarExamNumber: number
  lawyerApprovalStatus: string
  lawyerLawSchoolDiplomaUrl: string | null
  lawyerCertificateUrl: string | null
  lawyerBarExamPassDate: string | null
  lawyerCreatedAt: string
}

interface LawyerMemberListProps {
  data: LawyerMember[]
  loading?: boolean
  onSort: (field: string) => void
  currentOrderBy: string
  currentSort: 'asc' | 'desc'
}

const LawyerMemberList = ({ data, loading, onSort, currentOrderBy, currentSort }: LawyerMemberListProps) => {
  const [selectedRows, setSelectedRows] = useState<LawyerMember[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerMember | null>(null)
  const navigate = useNavigate()

  // Convert API sort type to Ant Design sort type
  const getSortOrder = (field: string) => {
    if (field !== currentOrderBy) return undefined
    return currentSort === 'asc' ? 'ascend' : 'descend'
  }

  const handleApprovalInfo = (lawyer: LawyerMember, e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지
    setSelectedLawyer(lawyer)
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setSelectedLawyer(null)
  }

  const handleModalSubmit = (data: any) => {
    console.log('승인정보 저장:', data)
    // API 호출 로직 추가
    handleModalClose()
  }

  const columns: TableProps<LawyerMember>['columns'] = [
    {
      title: '아이디',
      dataIndex: 'lawyerId',  // lawyerAccount가 API에 없다면 lawyerId 사용
      render: (id: number) => `lawyer${id}`,  // 또는 실제 아이디 필드가 있다면 그것을 사용
      sorter: true,
      sortOrder: getSortOrder('account'),
      onHeaderCell: () => ({
        onClick: () => onSort('account'),
      }),
    },
    {
      title: '이메일 주소',
      dataIndex: 'lawyerEmail',
      sorter: true,
      sortOrder: getSortOrder('email'),
      onHeaderCell: () => ({
        onClick: () => onSort('email'),
      }),
    },
    {
      title: '변호사 이름',
      dataIndex: 'lawyerName',
      sorter: true,
      sortOrder: getSortOrder('name'),
      onHeaderCell: () => ({
        onClick: () => onSort('name'),
      }),
    },
    {
      title: '연락처',
      dataIndex: 'lawyerContact',
      render: (contact: string | null) => contact || '-',
      sorter: true,
      sortOrder: getSortOrder('phone'),
      onHeaderCell: () => ({
        onClick: () => onSort('phone'),
      }),
    },
    {
      title: '소속',
      dataIndex: 'lawyerLawfirmName',
      render: (lawfirm: string | null) => lawfirm || '-',
      sorter: true,
      sortOrder: getSortOrder('office'),
      onHeaderCell: () => ({
        onClick: () => onSort('office'),
      }),
    },
    {
      title: '출신 시험',
      dataIndex: 'lawyerBarExamNumber',
      render: (examNumber: number) => `${examNumber}회`,
      align: 'center' as const,
      sorter: true,
      sortOrder: getSortOrder('exam'),
      onHeaderCell: () => ({
        onClick: () => onSort('exam'),
      }),
    },
    {
      title: '승인여부',
      dataIndex: 'lawyerApprovalStatus',
      render: (status: string, record: LawyerMember) => {
        // 승인 상태를 한글로 변환
        const getStatusText = (status: string) => {
          switch (status?.toLowerCase()) {
            case 'new':
              return '신규 가입'
            case 'approved':
              return '승인 완료'
            case 'pending':
              return '승인 대기중'
            default:
              return status || '-'
          }
        }
        
        return (
          <div className={styles['approval-cell']}>
            <span>{getStatusText(status)}</span>
            <Button size='small' onClick={e => handleApprovalInfo(record, e)}>
              승인정보
            </Button>
          </div>
        )
      },
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedRows.map(row => row.lawyerId),
    onSelectAll: (selected: boolean, selectedRows: LawyerMember[]) => {
      setSelectedRows(selected ? selectedRows : [])
      console.log('전체 선택:', selected, selectedRows)
    },
    onSelect: (record: LawyerMember, selected: boolean) => {
      setSelectedRows(prev => {
        if (selected) {
          return [...prev, record]
        } else {
          return prev.filter(row => row.lawyerId !== record.lawyerId)
        }
      })
      console.log('개별 선택:', record, selected)
    },
    getCheckboxProps: (record: LawyerMember) => ({
      name: record.lawyerAccount,
    }),
  }

  return (
    <div className={styles['lawyer-member-list-container']}>
      <Table<LawyerMember>
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        rowKey='lawyerId'
        pagination={false}
        loading={loading}
        onChange={() => {}} // 정렬은 헤더 클릭으로 처리
        onRow={record => ({
          onClick: () => navigate(`${ROUTE_PATH.LAWYER_MEMBER}/${record.lawyerId}`, { state: { lawyerInfo: record } }),
        })}
      />
      <LawyerApprovalModal
        open={modalVisible}
        onCancel={handleModalClose}
        onSubmit={handleModalSubmit}
        defaultValues={{
          approvalStatus: selectedLawyer?.lawyerApprovalStatus === 'approved' ? 'approved' : 'pending',
        }}
      />
    </div>
  )
}

export default LawyerMemberList
