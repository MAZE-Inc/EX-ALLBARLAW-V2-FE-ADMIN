export type MemberListRequest = {
  userPage: number
  orderBy: 'account' | 'phone' | 'email' | 'createdAt'
  sort: 'asc' | 'desc'
  userIsActive: 'all' | 'active' | 'inactive'
}

export type Member = {
  userId: number
  userAccount: string
  userPhone: string
  userEmail: string
  userCreatedAt: string
  userIsActive: boolean
}

export type MemberListResponse = Member[]
