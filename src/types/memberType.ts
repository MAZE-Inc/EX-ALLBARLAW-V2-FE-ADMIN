export type MemberListRequest = {
  userPage: number
  orderBy: 'account' | 'phone' | 'email' | 'createdAt' | 'isActive'
  sort: 'asc' | 'desc'
  userIsActive: 'all' | 'active' | 'inactive'
  searchQuery?: string
  searchType?: 'account' | 'phone' | 'email'
}

export type Member = {
  userId: number
  userAccount: string
  userPhone: string
  userEmail: string
  userCreatedAt: string
  userIsActive: boolean
  userBanReason: string | null
}

export type MemberListResponse = Member[]

export type MemberAccountManagementRequest = Pick<Member, 'userId' | 'userIsActive'> & {
  userBanReason: string
}

export interface MemberInfoItem {
  label: string
  key: keyof Member | 'formattedCreatedAt' | 'accountStatus'
  formatter?: (value: any) => string
}

export type MemberKeepCountResponse = {
  blogCaseCount: number
  knowledgeCount: number
  lawyerCount: number
  legalTermCount: number
  videoCaseCount: number
}
