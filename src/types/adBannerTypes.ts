export type MainBanner = {
  mainBannerId: number
  mainBannerName: string
  mainBannerImageUrl: string | null
  mainBannerMobileImageUrl: string | null
  mainBannerStartedAt: string
  mainBannerFinishedAt: string
  mainBannerLink: string | null
  mainBannerDisplayOrder: number
  mainBannerIsActive: boolean
  mainBannerCreatedAt: string
  mainBannerUpdatedAt: string
}

export type CategoryBanner = {
  subMainBannerId: number
  subMainBannerName: string
  subMainBannerImageUrl: string | null
  subMainBannerMobileImageUrl: string | null
  subMainBannerStartedAt: string
  subMainBannerFinishedAt: string
  subMainBannerLink: string | null
  subMainBannerDisplayOrder: number
  subMainBannerIsActive: boolean
  subMainBannerCreatedAt: string
  subMainBannerUpdatedAt: string
}

export type SubCategoryBanner = {
  subBannerId: number
  subBannerName: string
  subBannerImageUrl: string
  subBannerStartedAt: string
  subBannerFinishedAt: string
  subBannerLink: string | null
  subBannerDisplayOrder: number
  subBannerIsActive: boolean
  subBannerCreatedAt: string
  subBannerUpdatedAt: string
}
