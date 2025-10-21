export type AdminListRequest = {
  skip?: number
  take?: number
  adminIsActive?: boolean
  adminAccountTypeId?: number
  searchQuery?: string
  searchType?: 'account' | 'email' | 'name' | 'all'
  sortBy?: 'accountType' | 'account' | 'email' | 'name' | 'isActive' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export type AdminSubMenu = {
  subMenuId: number
  subMenuName: string
  subMenuMainMenuId: number
  subMenuMainMenu: {
    mainMenuId: number
    mainMenuName: string
  }
}

export type Admin = {
  adminId: number
  adminAccount: string
  adminEmail: string
  adminName: string
  adminAccountTypeId: number
  adminIsActive: boolean
  adminCreatedAt: string
  adminUpdatedAt: string
  adminSubMenus?: AdminSubMenu[]
}

export type AdminCreateRequest = Omit<Admin, 'adminId' | 'adminCreatedAt' | 'adminUpdatedAt'> & {
  adminPassword: string
  adminPasswordRepeat: string
  subMenuIds: number[]
}

export type MemberListResponse = Admin[]
