import instance from '@/lib/axios'
import { CategoryBanner, MainBanner, SubCategoryBanner } from '@/types/adBannerTypes'

export const adBannerService = {
  getMainBanners: async () => {
    const response = await instance.get<MainBanner[]>('/main-banners/active')
    return response.data
  },
  getCategoryBanners: async () => {
    const response = await instance.get<CategoryBanner[]>('/sub-main-banners/active')
    return response.data
  },
  getSubCategoryBanners: async () => {
    const response = await instance.get<SubCategoryBanner[]>('/sub-banners/active')
    return response.data
  },
}
