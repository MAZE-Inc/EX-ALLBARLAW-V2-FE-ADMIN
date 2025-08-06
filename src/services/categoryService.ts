// import instance from '@/lib/axios'
import { CategoryList } from '@/types/categoryTypes'
import axios from 'axios'

export const categoryService = {
  getCategoryList: async () => await axios.get<CategoryList>('https://v2.allbarlawbiz.com/category'),
}
