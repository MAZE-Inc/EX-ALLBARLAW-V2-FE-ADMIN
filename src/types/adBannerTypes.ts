export interface MainBanner {
  mainBannerId: number
  mainBannerName: string
  mainBannerImageUrl: string | null
  mainBannerMobileImageUrl: string | null
  mainBannerStartedAt: string
  mainBannerFinishedAt: string
  mainBannerLink?: string
  mainBannerDisplayOrder: number
  mainBannerIsActive: boolean
  mainBannerCreatedAt: string
  mainBannerUpdatedAt: string
}

export interface MainBannerCreate
  extends Omit<MainBanner, 'mainBannerId' | 'mainBannerCreatedAt' | 'mainBannerUpdatedAt'> {
  mainBannerLink?: string
}

export type CategoryBanner = {
  subMainBannerId: number
  subMainBannerName: string
  subMainBannerImageUrl: string | null
  subMainBannerMobileImageUrl: string | null
  subMainBannerStartedAt: string
  subMainBannerFinishedAt: string
  subMainBannerLink?: string | null
  subMainBannerDisplayOrder: number
  subMainBannerIsActive: boolean
  subMainBannerCreatedAt: string
  subMainBannerUpdatedAt: string
  subMainSubCategoryId: number
}

export interface CategoryBannerCreate
  extends Omit<CategoryBanner, 'subMainBannerId' | 'subMainBannerCreatedAt' | 'subMainBannerUpdatedAt'> {
  subMainBannerLink?: string
}

export type SubCategoryBanner = {
  subBannerId: number
  subBannerName: string
  subBannerImageUrl: string
  subBannerStartedAt: string
  subBannerFinishedAt: string
  subBannerLink?: string | null
  subBannerDisplayOrder: number
  subBannerIsActive: boolean
  subBannerCreatedAt: string
  subBannerUpdatedAt: string
  subBannerSubCategoryId: number
}

export interface SubCategoryBannerCreate
  extends Omit<SubCategoryBanner, 'subBannerId' | 'subBannerCreatedAt' | 'subBannerUpdatedAt'> {
  subBannerLink?: string
}
