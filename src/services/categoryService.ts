// import instance from '@/lib/axios'
import instance from '@/lib/axios'
import { CategoryCreateRequest, CategoryCreateResponse, CategoryList } from '@/types/categoryTypes'

export const categoryService = {
  getCategoryList: async () => await instance.get<CategoryList>('/categories'),
  createCategory: async (category: CategoryCreateRequest) =>
    await instance.post<CategoryCreateResponse>('/categories', category),
}
