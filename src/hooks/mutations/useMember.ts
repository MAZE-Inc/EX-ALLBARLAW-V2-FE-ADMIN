import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { memberService } from '@/services/memberService'
import { QUERY_KEY } from '@/constants/query'

interface UpdateMemberStatusParams {
  userId: number
  isActive: boolean
  userBanReason?: string
}

export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, isActive, userBanReason }: UpdateMemberStatusParams) =>
      memberService.updateMemberStatus(userId, isActive, userBanReason),
    onSuccess: () => {
      // 멤버 리스트 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MEMBER_LIST] })
    },
    onError: (error: Error) => {
      console.error('계정 상태 업데이트 실패:', error)
      message.error('계정 상태 업데이트에 실패했습니다.')
    },
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (userId: number) => memberService.resetPassword(userId),
    onSuccess: () => {
      message.success('비밀번호가 초기화되었습니다.')
    },
    onError: (error: Error) => {
      console.error('비밀번호 초기화 실패:', error)
      message.error('비밀번호 초기화에 실패했습니다.')
    },
  })
}
