import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { memberService } from '@/services/memberService'
import { QUERY_KEY } from '@/constants/query'

interface UpdateMemberStatusParams {
  userId: number
  isActive: boolean
}

export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, isActive }: UpdateMemberStatusParams) => memberService.updateMemberStatus(userId, isActive),
    onSuccess: () => {
      // 멤버 리스트 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MEMBER_LIST] })
      message.success('계정 상태가 업데이트되었습니다.')
    },
    onError: (error: Error) => {
      console.error('계정 상태 업데이트 실패:', error)
      message.error('계정 상태 업데이트에 실패했습니다.')
    },
  })
}
