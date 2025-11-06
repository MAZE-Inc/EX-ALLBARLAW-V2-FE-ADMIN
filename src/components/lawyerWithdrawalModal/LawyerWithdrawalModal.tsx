import React from 'react'
import { Modal, message } from 'antd'
import { useLawyerWithdrawalInfo } from '@/hooks/queries/useMember'

interface LawyerWithdrawalModalProps {
  open: boolean
  onCancel: () => void
  withdrawalId: number | null
  lawyerName: string
}

const LawyerWithdrawalModal: React.FC<LawyerWithdrawalModalProps> = ({ open, onCancel, withdrawalId }) => {
  const { data: withdrawalInfo, isLoading: isWithdrawalInfoLoading } = useLawyerWithdrawalInfo(withdrawalId ?? 0)
  console.log(withdrawalInfo)

  const handleConfirm = async () => {
    if (!withdrawalId) {
      message.error('변호사 ID가 없습니다.')
      return
    }
  }

  return (
    <Modal
      title='탈퇴 처리'
      open={open}
      onCancel={onCancel}
      onOk={handleConfirm}
      okText='탈퇴 처리'
      cancelText='취소'
      confirmLoading={isWithdrawalInfoLoading}
      okButtonProps={{
        danger: true,
      }}
    ></Modal>
  )
}

export default LawyerWithdrawalModal
