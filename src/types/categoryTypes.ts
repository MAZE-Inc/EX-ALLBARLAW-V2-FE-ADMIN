export interface Category {
  categoryId: number
  categoryName: string
}

export interface Subcategory {
  subcategoryId: number
  subcategoryName: string
}

interface SubcategoryInfo extends Subcategory {
  isUncategorized: boolean
  categoryId: number
}

type CategoryInfo = {
  categoryId: number
  categoryName: string
  imageUrl: string
  clickedImageUrl: string
  isUncategorized: boolean
  subcategories: SubcategoryInfo[]
}

export type CategoryList = CategoryInfo[]
