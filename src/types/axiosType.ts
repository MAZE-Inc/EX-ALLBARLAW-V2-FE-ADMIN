export type ApiResponse<T> = {
  data: T
  hasNextPage?: boolean
  nextCursor?: number
  nextCursorId?: number
}
