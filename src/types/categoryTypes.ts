export interface Category {
  categoryId: number
  categoryName: string
}

export interface Subcategory {
  subcategoryId: number
  subcategoryName: string
}

type CategoryInfo = {
  categoryId: number
  categoryName: string
  categoryImageUrl: string
  categoryClickedImageUrl: string
  categoryCreatedAt: string
  categorySubcategoryCount: number
  isUncategorized: boolean
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
