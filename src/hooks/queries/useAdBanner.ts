import { QUERY_KEY } from '@/constants/query'
import { adBannerService } from '@/services/adBannerService'
import { useQuery } from '@tanstack/react-query'

export const useMainBanner = () => {
  return useQuery({
    queryKey: [QUERY_KEY.AD_MAIN_BANNER_LIST],
    queryFn: () => adBannerService.getMainBanners(),
  })
}

export const useCategoryBanner = () => {
  return useQuery({
    queryKey: [QUERY_KEY.AD_CATEGORY_BANNER_LIST],
    queryFn: () => adBannerService.getCategoryBanners(),
  })
}

export const useSubCategoryBanner = () => {
  return useQuery({
    queryKey: [QUERY_KEY.AD_SUB_CATEGORY_BANNER_LIST],
    queryFn: () => adBannerService.getSubCategoryBanners(),
  })
}
