export interface Category {
  categoryId: number
  categoryName: string
}

export interface Subcategory {
  subcategoryId: number
  subcategoryName: string
  subcategoryDisplayOrder?: number
  subcategoryBlogCaseCount: number
  subcategoryVideoCaseCount: number
  subcategoryKnowledgeCount: number
  subcategoryLawyerCount: number
}

type CategoryInfo = {
  categoryId: number
  categoryName: string
  categoryImageUrl: string
  categoryClickedImageUrl: string
  categoryCreatedAt: string
  categorySubcategoryCount: number
  isUncategorized: boolean
  categoryDisplayOrder: number
  subcategories: Subcategory[]
}

export type CategoryList = CategoryInfo[]

export type CategoryCreateRequest = {
  categoryName: string
  categoryImageUrl: string
  categoryClickedImageUrl: string
}

export type CategoryCreateResponse = {
  categoryId: number
  categoryName: string
}

export type CategoryUpdateRequest = {
  categoryName: string
  categoryImageUrl: string
  categoryClickedImageUrl: string
}

export type CategoryUpdateResponse = CategoryInfo

export type SubCategoryCreateRequest = {
  subcategoryName: string
  subcategoryCategoryId: number
}

export type SubCategoryCreateResponse = {
  subcategoryId: number
  subcategoryName: string
  subcategoryCategoryId: number | null
  subcategoryCategoryName: string
  subcategoryCreatedAt: string
}

export type CategoryOrderUpdateRequest = {
  categoryId: number
  categoryDisplayOrder: number
}

export type CategoryOrderUpdateResponse = CategoryInfo

export type SubCategoryOrderUpdateRequest = {
  subcategoryId: number
  subcategoryDisplayOrder: number
}

export type SubCategoryOrderUpdateResponse = {
  subcategoryId: number
  subcategoryName: string
  subcategoryCategoryId: number | null
  subcategoryDisplayOrder: number
  subcategoryCategoryName: string
  subcategoryCreatedAt: string
  subcategoryBlogCaseCount: number
  subcategoryVideoCaseCount: number
  subcategoryKnowledgeCount: number
  subcategoryLawyerCount: number
}
