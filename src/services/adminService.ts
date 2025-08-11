import instance from '@/lib/axios'
import { Admin, AdminCreateRequest, AdminListRequest } from '@/types/adminTypes'

export const adminService = {
  getAdminList: async (request: AdminListRequest) => {
    const { skip, take, adminIsActive, adminAccountTypeId } = request

    const params = new URLSearchParams()
    if (skip !== undefined) params.append('skip', skip.toString())
    if (take !== undefined) params.append('take', take.toString())
    if (adminIsActive !== undefined) params.append('adminIsActive', adminIsActive.toString())
    if (adminAccountTypeId !== undefined) params.append('adminAccountTypeId', adminAccountTypeId.toString())

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
}
