import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { lawyerService } from '@/services/lawyerService'
import {
  LawyerCareer,
  LawyerUpdateRequest,
  LawyerListRequest,
  LawyerSearchRequest,
  LawyerActivity,
} from '@/types/lawyerTypes'
import { QUERY_KEY } from '@/constants/query'

export const useLawyerSearch = (request: LawyerSearchRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_SEARCH, request],
    queryFn: () => lawyerService.searchLawyer(request),
    enabled: !!request.searchQuery && request.searchQuery.trim().length > 0,
  })
}

export const useLawyerList = (request: LawyerListRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_LIST, request],
    queryFn: () => lawyerService.getLawyerList(request),
  })
}

export const useLawyerDetail = (lawyerId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_DETAIL, lawyerId],
    queryFn: () => lawyerService.getLawyerDetail(lawyerId),
  })
}

export const useLawyerBasicInfo = (lawyerId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_BASIC_INFO, lawyerId],
    queryFn: () => lawyerService.getLawyerBasicInfo(lawyerId),
  })
}

export const useLawyerBasicInfoUpdate = (lawyerId: number, onSuccess: () => void, onError: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LawyerUpdateRequest) => lawyerService.updateLawyerBasicInfo(lawyerId, data),
    onSuccess: () => {
      onSuccess()
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LAWYER_BASIC_INFO, lawyerId] })
    },
    onError: () => {
      onError()
    },
  })
}

export const useLawyerCareer = (lawyerId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_CAREER, lawyerId],
    queryFn: () => lawyerService.getLawyerCareer(lawyerId),
    select: data => data.lawyerCareers,
  })
}

export const useLawyerCareerUpdate = (lawyerId: number, onSuccess: () => void, onError: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LawyerCareer[]) => lawyerService.updateLawyerCareer(lawyerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LAWYER_CAREER, lawyerId] })
      onSuccess()
    },
    onError: () => {
      onError()
    },
  })
}

export const useLawyerActivity = (lawyerId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_ACTIVITY, lawyerId],
    queryFn: () => lawyerService.getLawyerActivity(lawyerId),
    select: data => data.lawyerActivities,
  })
}

export const useLawyerActivityUpdate = (lawyerId: number, onSuccess: () => void, onError: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LawyerActivity[]) => lawyerService.updateLawyerActivity(lawyerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LAWYER_ACTIVITY, lawyerId] })
      onSuccess()
    },
    onError: () => {
      onError()
    },
  })
}
