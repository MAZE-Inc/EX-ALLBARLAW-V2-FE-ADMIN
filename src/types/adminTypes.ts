export type AdminListRequest = {
  skip?: number
  take?: number
  adminIsActive?: boolean
  adminAccountTypeId?: number
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
}

export type AdminCreateRequest = Omit<Admin, 'adminId' | 'adminCreatedAt' | 'adminUpdatedAt'> & {
  adminPassword: string
  adminPasswordRepeat: string
}

export type MemberListResponse = Admin[]
