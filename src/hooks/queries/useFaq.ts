import { useMutation, useQuery } from '@tanstack/react-query'
import { message } from 'antd'
import { faqService } from '@/services/boardService'
import { QUERY_KEY } from '@/constants/query'
import { FaqType } from '@/types/boardTypes'

export const useGetFaqType = () => {
  return useQuery({
    queryKey: [QUERY_KEY.FAQ_TYPE],
    queryFn: async () => {
      const res = await faqService.readFaqType()
      return Array.isArray(res.data) // categoryOptions 형태로 가공
        ? res.data.map((faqType: FaqType) => ({
            label: faqType.faqTypeName,
            value: faqType.faqTypeId,
          }))
        : []
    },
  })
}

export const useCreateFaqType = () => {
  return useMutation({
    mutationFn: (faqTypeName: string) => faqService.createFaqType(faqTypeName),
    onSuccess: (_data, _variables) => {
      message.success('FAQ 분류가 등록되었습니다.')
    },
    onError: (error: Error) => {
      console.error('삭제 실패:', error)
      message.error('FAQ 분류 등록에 실패했습니다.')
    },
  })
}
