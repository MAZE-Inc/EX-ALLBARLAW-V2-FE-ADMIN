import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '@/services/categoryService'
import { QUERY_KEY } from '@/constants/query'

export const useCategory = () => {
  return useQuery({
    queryKey: [QUERY_KEY.CATEGORY_LIST],
    queryFn: categoryService.getCategoryList,
    select: data => data.data,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY_LIST] })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY_LIST] })
    },
  })
}

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: categoryService.createSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY_LIST] })
    },
  })
}
