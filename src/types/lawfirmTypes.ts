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
}

export type CreateLawfirmRequest = Omit<Lawfirm, 'lawfirmCreatedAt' | 'lawfirmUpdatedAt'>

export type LawfirmList = {
  lawfirmData: Lawfirm[]
  lawfirmTotal: number
  lawfirmPage: number
  lawfirmTotalPages: number
}

export type LawfirmListRequest = {
  lawfirmPage?: number
  searchQuery?: number
  lawfirmSearchType?: 'name' | 'greeting'
  lawfirmOrderBy?: 'name' | 'createdAt' | 'viewCount'
  lawfirmSort?: 'asc' | 'desc'
}
