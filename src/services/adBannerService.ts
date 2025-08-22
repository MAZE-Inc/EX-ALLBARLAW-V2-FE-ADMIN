import instance from '@/lib/axios'
import {
  CategoryBanner,
  CategoryBannerCreate,
  MainBanner,
  MainBannerCreate,
  SubCategoryBanner,
  SubCategoryBannerCreate,
} from '@/types/adBannerTypes'

export const adBannerService = {
  getMainBanners: async () => {
    const response = await instance.get<MainBanner[]>('/main-banners')
    return response.data
  },
  createMainBanner: async (mainBanner: MainBannerCreate) => {
    const response = await instance.post<MainBanner>('/main-banners', mainBanner)
    return response.data
  },
  updateMainBanner: async (mainBannerId: number, mainBanner: MainBanner) => {
    const response = await instance.patch<MainBanner>(`/main-banners/${mainBannerId}`, mainBanner)
    return response.data
  },
  getMainBanner: async (mainBannerId: number) => {
    const response = await instance.get<MainBanner>(`/main-banners/${mainBannerId}`)
    return response.data
  },
  getCategoryBanners: async () => {
    const response = await instance.get<CategoryBanner[]>('/sub-main-banners')
    return response.data
  },
  getCategoryBanner: async (categoryBannerId: number) => {
    const response = await instance.get<CategoryBanner>(`/sub-main-banners/${categoryBannerId}`)
    return response.data
  },
  createCategoryBanner: async (categoryBanner: CategoryBannerCreate) => {
    const response = await instance.post<CategoryBanner>('/sub-main-banners', categoryBanner)
    return response.data
  },
  updateCategoryBanner: async (categoryBannerId: number, categoryBanner: CategoryBanner) => {
    const response = await instance.patch<CategoryBanner>(`/sub-main-banners/${categoryBannerId}`, categoryBanner)
    return response.data
  },

  getSubCategoryBanners: async () => {
    const response = await instance.get<SubCategoryBanner[]>('/sub-banners')
    return response.data
  },
  getSubCategoryBanner: async (subCategoryBannerId: number) => {
    const response = await instance.get<SubCategoryBanner>(`/sub-banners/${subCategoryBannerId}`)
    return response.data
  },
  createSubCategoryBanner: async (subCategoryBanner: SubCategoryBannerCreate) => {
    const response = await instance.post<SubCategoryBanner>('/sub-banners', subCategoryBanner)
    return response.data
  },
  updateSubCategoryBanner: async (subCategoryBannerId: number, subCategoryBanner: SubCategoryBanner) => {
    const response = await instance.patch<SubCategoryBanner>(`/sub-banners/${subCategoryBannerId}`, subCategoryBanner)
    return response.data
  },
}
