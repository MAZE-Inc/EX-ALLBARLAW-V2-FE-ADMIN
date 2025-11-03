import React from 'react'
import { Modal, message } from 'antd'
import { useUpdateLawyerRegister } from '@/hooks/queries/useMember'

interface LawyerWithdrawalModalProps {
  open: boolean
  onCancel: () => void
  lawyerId: number | null
  lawyerName: string
}

const LawyerWithdrawalModal: React.FC<LawyerWithdrawalModalProps> = ({ open, onCancel, lawyerId, lawyerName }) => {
  const updateLawyerRegister = useUpdateLawyerRegister({
    onSuccess: () => {
      message.success('탈퇴 처리가 완료되었습니다.')
      onCancel()
    },
    onError: error => {
      message.error('탈퇴 처리에 실패했습니다.')
      console.error(error)
    },
  })

  const handleConfirm = async () => {
    if (!lawyerId) {
      message.error('변호사 ID가 없습니다.')
      return
    }

    try {
      // lawyerWithdrawalStatus를 null로 설정하여 탈퇴 처리
      await updateLawyerRegister.mutateAsync({
        lawyerId,
        request: {
          lawyerWithdrawalStatus: null,
        },
      })
    } catch (error) {
      console.error('탈퇴 처리 오류:', error)
    }
  }

  return (
    <Modal
      title='변호사 탈퇴 처리'
      open={open}
      onCancel={onCancel}
      onOk={handleConfirm}
      okText='탈퇴 처리'
      cancelText='취소'
      confirmLoading={updateLawyerRegister.isPending}
      okButtonProps={{
        danger: true,
      }}
    >
      <p>
        <strong>{lawyerName}</strong> 변호사의 탈퇴를 처리하시겠습니까?
      </p>
      <p style={{ color: '#ff4d4f', marginTop: '8px' }}>이 작업은 취소할 수 없습니다.</p>
    </Modal>
  )
}

export default LawyerWithdrawalModal
