import React, { useState } from 'react'
import { Button, Table, TableProps } from 'antd'
import styles from './lawyerMemberList.module.scss'
import LawyerApprovalModal from '@/components/lawyerApprovalModal/LawyerApprovalModal'

// LawyerInfoListResponse의 lawyerList 항목 타입
export interface LawyerMember {
  lawyerId: number
  lawyerAccount?: string // 아이디 필드 추가 (API에 있다면)
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
  onSelectionChange?: (selectedRows: LawyerMember[]) => void
}

const LawyerMemberList = ({ data, loading, onSort, currentOrderBy, currentSort, onSelectionChange }: LawyerMemberListProps) => {
  const [selectedRows, setSelectedRows] = useState<LawyerMember[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerMember | null>(null)

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

  const handleModalSubmit = (submittedData: any) => {
    console.log('승인정보 저장:', submittedData)
    // 모달은 자체적으로 API 호출 처리
  }

  const columns: TableProps<LawyerMember>['columns'] = [
    {
      title: '아이디',
      dataIndex: 'lawyerAccount',
      render: (account: string | undefined, record: LawyerMember) => account || `lawyer${record.lawyerId}`,
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
        // 승인 상태를 한글로 변환하고 pending일 때 진행 상황 표시
        const getStatusText = (status: string, record: LawyerMember) => {
          switch (status?.toLowerCase()) {
            case 'new':
              return '신규가입'
            case 'approved':
              return '완료'
            case 'pending': {
              // pending일 때 업로드된 서류 개수 계산
              let uploadedCount = 0
              if (record.lawyerLawSchoolDiplomaUrl) uploadedCount++
              if (record.lawyerCertificateUrl) uploadedCount++
              if (record.lawyerBarExamPassDate) uploadedCount++
              return `승인대기중(${uploadedCount}/3)`
            }
            default:
              return status || '-'
          }
        }

        return (
          <div className={styles['approval-cell']}>
            <span>{getStatusText(status, record)}</span>
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
      const newSelectedRows = selected ? selectedRows : []
      setSelectedRows(newSelectedRows)
      onSelectionChange?.(newSelectedRows)
      console.log('전체 선택:', selected, selectedRows)
    },
    onSelect: (record: LawyerMember, selected: boolean) => {
      setSelectedRows(prev => {
        const newSelectedRows = selected 
          ? [...prev, record]
          : prev.filter(row => row.lawyerId !== record.lawyerId)
        onSelectionChange?.(newSelectedRows)
        return newSelectedRows
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
      />
      <LawyerApprovalModal
        open={modalVisible}
        onCancel={handleModalClose}
        onSubmit={handleModalSubmit}
        lawyerId={selectedLawyer?.lawyerId || null}
        defaultValues={{
          lawSchoolDiploma: selectedLawyer?.lawyerLawSchoolDiplomaUrl || undefined,
          lawyerLicense: selectedLawyer?.lawyerCertificateUrl || undefined,
          passingDate: selectedLawyer?.lawyerBarExamPassDate || undefined,
          approvalStatus: selectedLawyer?.lawyerApprovalStatus?.toLowerCase() === 'approved' ? 'approved' : 'pending',
        }}
      />
    </div>
  )
}

export default LawyerMemberList
