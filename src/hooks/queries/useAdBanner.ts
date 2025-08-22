import { QUERY_KEY } from '@/constants/query'
import { adBannerService } from '@/services/adBannerService'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  CategoryBanner,
  CategoryBannerCreate,
  MainBanner,
  MainBannerCreate,
  SubCategoryBanner,
  SubCategoryBannerCreate,
} from '@/types/adBannerTypes'
import { useQueryClient } from '@tanstack/react-query'

export const useMainBanner = () => {
  return useQuery({
    queryKey: [QUERY_KEY.AD_MAIN_BANNER_LIST],
    queryFn: () => adBannerService.getMainBanners(),
  })
}

export const useMainBannerDetail = (mainBannerId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.AD_MAIN_BANNER_DETAIL, mainBannerId],
    queryFn: () => adBannerService.getMainBanner(mainBannerId),
  })
}

export const useCreateMainBanner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mainBanner: MainBannerCreate) => adBannerService.createMainBanner(mainBanner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.AD_MAIN_BANNER_LIST] })
    },
  })
}

export const useUpdateMainBanner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mainBanner: MainBanner) => adBannerService.updateMainBanner(mainBanner.mainBannerId, mainBanner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.AD_MAIN_BANNER_LIST] })
    },
  })
}

export const useCategoryBanner = () => {
  return useQuery({
    queryKey: [QUERY_KEY.AD_CATEGORY_BANNER_LIST],
    queryFn: () => adBannerService.getCategoryBanners(),
  })
}

export const useCategoryBannerDetail = (categoryBannerId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.AD_CATEGORY_BANNER_DETAIL, categoryBannerId],
    queryFn: () => adBannerService.getCategoryBanner(categoryBannerId),
  })
}

export const useCreateCategoryBanner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (categoryBanner: CategoryBannerCreate) => adBannerService.createCategoryBanner(categoryBanner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.AD_CATEGORY_BANNER_LIST] })
    },
  })
}

export const useUpdateCategoryBanner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (categoryBanner: CategoryBanner) =>
      adBannerService.updateCategoryBanner(categoryBanner.subMainBannerId, categoryBanner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.AD_CATEGORY_BANNER_DETAIL] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.AD_CATEGORY_BANNER_LIST] })
    },
  })
}

export const useSubCategoryBanner = () => {
  return useQuery({
    queryKey: [QUERY_KEY.AD_SUB_CATEGORY_BANNER_LIST],
    queryFn: () => adBannerService.getSubCategoryBanners(),
  })
}

export const useSubCategoryBannerDetail = (subCategoryBannerId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.AD_SUB_CATEGORY_BANNER_DETAIL, subCategoryBannerId],
    queryFn: () => adBannerService.getSubCategoryBanner(subCategoryBannerId),
  })
}

export const useCreateSubCategoryBanner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (subCategoryBanner: SubCategoryBannerCreate) =>
      adBannerService.createSubCategoryBanner(subCategoryBanner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.AD_SUB_CATEGORY_BANNER_LIST] })
    },
  })
}

export const useUpdateSubCategoryBanner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (subCategoryBanner: SubCategoryBanner) =>
      adBannerService.updateSubCategoryBanner(subCategoryBanner.subBannerId, subCategoryBanner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.AD_SUB_CATEGORY_BANNER_DETAIL] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.AD_SUB_CATEGORY_BANNER_LIST] })
    },
  })
}
