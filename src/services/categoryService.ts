// import instance from '@/lib/axios'
import instance from '@/lib/axios'
import {
  CategoryCreateRequest,
  CategoryCreateResponse,
  CategoryList,
  CategoryOrderUpdateRequest,
  CategoryOrderUpdateResponse,
  CategoryUpdateRequest,
  CategoryUpdateResponse,
  SubCategoryCreateRequest,
  SubCategoryCreateResponse,
  SubCategoryOrderUpdateRequest,
  SubCategoryOrderUpdateResponse,
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
  updateCategoryOrder: async (request: CategoryOrderUpdateRequest) =>
    await instance.patch<CategoryOrderUpdateResponse>(`/categories/${request.categoryId}/order`, {
      categoryDisplayOrder: request.categoryDisplayOrder,
    }),
  updateSubCategoryOrder: async (request: SubCategoryOrderUpdateRequest) =>
    await instance.patch<SubCategoryOrderUpdateResponse>(`/subcategories/${request.subcategoryId}/order`, {
      subcategoryDisplayOrder: request.subcategoryDisplayOrder,
    }),
}
