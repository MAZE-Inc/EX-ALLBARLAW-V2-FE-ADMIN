import { useCallback } from 'react'
import { message } from 'antd'
import { exportCategoriesToExcel, exportToExcel } from '@/utils/excelExport'
import { CategoryList } from '@/types/categoryTypes'

/**
 * 엑셀 다운로드 기능을 제공하는 커스텀 훅
 */
export const useExcelExport = () => {
  /**
   * 카테고리 데이터를 엑셀로 다운로드
   */
  const exportCategories = useCallback((categoryData: CategoryList | undefined) => {
    if (!categoryData || categoryData.length === 0) {
      message.warning('다운로드할 데이터가 없습니다.')
      return
    }

    try {
      exportCategoriesToExcel(categoryData, '전체분류')
      message.success('엑셀 파일이 다운로드되었습니다.')
    } catch (error) {
      console.error('엑셀 다운로드 실패:', error)
      message.error('엑셀 다운로드에 실패했습니다.')
    }
  }, [])

  /**
   * 범용 엑셀 다운로드 함수
   */
  const exportData = useCallback(<T extends Record<string, any>>(data: T[], fileName: string, sheetName?: string) => {
    if (!data || data.length === 0) {
      message.warning('다운로드할 데이터가 없습니다.')
      return
    }

    try {
      exportToExcel(data, fileName, sheetName)
      message.success('엑셀 파일이 다운로드되었습니다.')
    } catch (error) {
      console.error('엑셀 다운로드 실패:', error)
      message.error('엑셀 다운로드에 실패했습니다.')
    }
  }, [])

  return {
    exportCategories,
    exportData,
  }
}
