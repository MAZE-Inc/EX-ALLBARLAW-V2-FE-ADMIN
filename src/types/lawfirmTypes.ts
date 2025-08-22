export type Lawfirm = {
  lawfirmId: number
  lawfirmName: string
  lawfirmEmail: string
  lawfirmContact: string
  lawfirmAddress: string | null
  lawfirmGreetingTitle: string | null
  lawfirmGreetingContent: string | null
  lawfirmHomepageUrl: string | null
  lawfirmLogoImageUrl: string | null
  lawfirmBlogUrl: string | null
  lawfirmViewCount: number
  lawfirmDirects: {
    id: number
    name: string
    link: string
  }[]

  lawfirmImages: {
    id: number
    imageUrl: string
  }[]

  lawfirmCreatedAt: '2025-08-20T03:18:32.340Z'
  lawfirmUpdatedAt: '2025-08-20T03:18:32.340Z'
  lawfirmSubcategoryId: number
}

export type RequestLawfirm = Omit<
  Lawfirm,
  'lawfirmCreatedAt' | 'lawfirmUpdatedAt' | 'lawfirmDirects' | 'lawfirmImages'
> & {
  lawfirmDirects: {
    name: string
    link: string
  }[]
  lawfirmImages: {
    imageUrl: string
  }[]
}

// API 요청용 타입 (선택적 필드는 undefined 허용)
export type LawfirmApiRequest = {
  lawfirmId: number
  lawfirmName: string
  lawfirmEmail: string
  lawfirmContact: string
  lawfirmAddress?: string
  lawfirmGreetingTitle?: string
  lawfirmGreetingContent?: string
  lawfirmHomepageUrl?: string
  lawfirmLogoImageUrl?: string
  lawfirmBlogUrl?: string
  lawfirmViewCount: number
  lawfirmCategoryId?: number
  lawfirmSubcategoryId?: number
  lawfirmDirects: {
    name: string
    link: string
  }[]
  lawfirmImages: {
    imageUrl: string
  }[]
}

export type LawfirmList = {
  lawfirmData: Lawfirm[]
  lawfirmTotal: number
  lawfirmPage: number
  lawfirmTotalPages: number
}

export type LawfirmListRequest = {
  lawfirmPage?: number
  searchQuery?: string
  lawfirmSearchType?: 'name' | 'greeting'
  lawfirmOrderBy?: 'name' | 'createdAt' | 'viewCount'
  lawfirmSort?: 'asc' | 'desc'
}
