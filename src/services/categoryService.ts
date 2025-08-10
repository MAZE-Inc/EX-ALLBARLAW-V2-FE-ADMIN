// import instance from '@/lib/axios'
import instance from '@/lib/axios'
import {
  CategoryCreateRequest,
  CategoryCreateResponse,
  CategoryList,
  SubCategoryCreateRequest,
  SubCategoryCreateResponse,
} from '@/types/categoryTypes'

export const categoryService = {
  getCategoryList: async () => await instance.get<CategoryList>('/categories'),
  createCategory: async (category: CategoryCreateRequest) =>
    await instance.post<CategoryCreateResponse>('/categories', category),
  deleteCategory: async (categoryId: number) => await instance.delete(`/categories/${categoryId}`),
  createSubCategory: async (subCategory: SubCategoryCreateRequest) =>
    await instance.post<SubCategoryCreateResponse>('/subcategories', subCategory),
}
