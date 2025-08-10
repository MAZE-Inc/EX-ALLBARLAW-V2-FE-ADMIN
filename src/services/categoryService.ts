// import instance from '@/lib/axios'
import instance from '@/lib/axios'
import {
  CategoryCreateRequest,
  CategoryCreateResponse,
  CategoryList,
  CategoryUpdateRequest,
  CategoryUpdateResponse,
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
  updateSubCategory: async (subCategoryId: number, subcategoryName: string) =>
    await instance.patch<SubCategoryCreateResponse>(`/subcategories/${subCategoryId}`, { subcategoryName }),
  deleteSubCategory: async (subCategoryId: number) => await instance.delete(`/subcategories/${subCategoryId}`),
  updateCategory: async (categoryId: number, category: CategoryUpdateRequest) =>
    await instance.patch<CategoryUpdateResponse>(`/categories/${categoryId}`, category),
}
