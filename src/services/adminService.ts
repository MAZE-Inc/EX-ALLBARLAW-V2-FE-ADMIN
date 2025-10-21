import instance from '@/lib/axios'
import { Admin, AdminCreateRequest, AdminListRequest } from '@/types/adminTypes'

export const adminService = {
  getAdminList: async (request: AdminListRequest) => {
    const { skip, take, adminIsActive, adminAccountTypeId, searchQuery, searchType, sortBy, sortOrder } = request

    const params = new URLSearchParams()
    if (skip !== undefined) params.append('skip', skip.toString())
    if (take !== undefined) params.append('take', take.toString())
    if (adminIsActive !== undefined) params.append('adminIsActive', adminIsActive.toString())
    if (adminAccountTypeId !== undefined) params.append('adminAccountTypeId', adminAccountTypeId.toString())
    if (searchQuery) params.append('searchQuery', searchQuery)
    if (searchType) params.append('searchType', searchType)
    if (sortBy) params.append('sortBy', sortBy)
    if (sortOrder) params.append('sortOrder', sortOrder)

    // 쿼리스트링 생성
    const queryString = params.toString()
    const url = `/admin${queryString ? `?${queryString}` : ''}`

    const response = await instance.get<Admin[]>(url)

    return response.data
  },
  registerAdmin: async (request: AdminCreateRequest) => {
    const response = await instance.post('/admin', request)
    return response.data
  },

  getAdminProfile: async () => {
    const response = await instance.get('/admin/profile')
    return response.data
  },

  patchAdmin: async (adminId: number, request: AdminCreateRequest) => {
    const response = await instance.patch(`/admin/${adminId}`, request)
    return response.data
  },
}
