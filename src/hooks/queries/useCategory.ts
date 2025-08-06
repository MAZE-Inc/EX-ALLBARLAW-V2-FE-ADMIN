import { useQuery } from '@tanstack/react-query'
import { categoryService } from '@/services/categoryService'
import { QUERY_KEY } from '@/constants/query'

export const useCategory = () => {
  return useQuery({
    queryKey: [QUERY_KEY.CATEGORY_LIST],
    queryFn: categoryService.getCategoryList,
    select: data => data.data,
  })
}
