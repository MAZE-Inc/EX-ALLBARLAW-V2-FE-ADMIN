import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { faqService } from '@/services/boardService'
import { QUERY_KEY } from '@/constants/query'
import { FaqEditRequest, FaqType } from '@/types/boardTypes'

export const useReadFaqType = () => {
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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (faqTypeName: string) => faqService.createFaqType(faqTypeName),
    onSuccess: (_data, _variables) => {
      message.success('FAQ 분류가 등록되었습니다.')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FAQ_TYPE] })
    },
    onError: (error: Error) => {
      console.error('삭제 실패:', error)
      message.error('FAQ 분류 등록에 실패했습니다.')
    },
  })
}

export const useReadFaq = (faqPage: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.FAQ_LIST, faqPage],
    queryFn: async () => {
      const res = await faqService.readFaq(faqPage)
      return res.data.faqs
    },
  })
}

export const useCreateFaq = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (faq: FaqEditRequest) => faqService.createFaq(faq),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FAQ_LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FAQ_COUNT] })
    },
    onError: (error: Error) => {
      console.error('FAQ 등록 실패:', error)
      message.error('FAQ 등록에 실패했습니다.')
    },
  })
}

export const useReadFaqDetail = (faqId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.FAQ_DETAIL, faqId],
    queryFn: async () => {
      const res = await faqService.readFaqDetail(faqId)
      return res.data
    },
  })
}

export const useDeleteFaq = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (faqId: number) => faqService.deleteFaq(faqId),
    onSuccess: () => {
      message.success('FAQ가 삭제되었습니다.')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FAQ_LIST] })
    },
    onError: (error: Error) => {
      console.error('FAQ 삭제 실패:', error)
      message.error('FAQ 삭제에 실패했습니다.')
    },
  })
}

export const useUpdateFaq = (faqId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (faq: FaqEditRequest) => faqService.updateFaq(faqId, faq),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FAQ_LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FAQ_DETAIL, faqId] })
    },
    onError: (error: Error) => {
      console.error('FAQ 수정 실패:', error)
      message.error('FAQ 수정에 실패했습니다.')
    },
  })
}

export const useReadFaqCount = () => {
  return useQuery({
    queryKey: [QUERY_KEY.FAQ_COUNT],
    queryFn: async () => {
      const res = await faqService.readFaqCount()
      return res.data
    },
  })
}
