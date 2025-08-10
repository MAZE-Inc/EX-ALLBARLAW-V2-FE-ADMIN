import * as XLSX from 'xlsx'
import { CategoryList } from '@/types/categoryTypes'

interface ExcelRow {
  '대분류 ID': number
  '대분류명': string
  '소분류 ID'?: number
  '소분류명'?: string
  '생성일시': string
}

/**
 * 카테고리 데이터를 엑셀 파일로 다운로드
 * @param categoryData - 카테고리 데이터 배열
 * @param fileName - 다운로드할 파일명 (기본값: categories)
 */
export const exportCategoriesToExcel = (categoryData: CategoryList, fileName: string = 'categories') => {
  try {
    // 엑셀 데이터 준비
    const excelData: ExcelRow[] = []
    
    categoryData.forEach(category => {
      // 소분류가 있는 경우
      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach(sub => {
          excelData.push({
            '대분류 ID': category.categoryId,
            '대분류명': category.categoryName,
            '소분류 ID': sub.subcategoryId,
            '소분류명': sub.subcategoryName,
            '생성일시': category.categoryCreatedAt || new Date().toISOString(),
          })
        })
      } else {
        // 소분류가 없는 경우 대분류만 추가
        excelData.push({
          '대분류 ID': category.categoryId,
          '대분류명': category.categoryName,
          '생성일시': category.categoryCreatedAt || new Date().toISOString(),
        })
      }
    })
    
    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    
    // 컬럼 너비 설정
    const columnWidths = [
      { wch: 12 }, // 대분류 ID
      { wch: 20 }, // 대분류명
      { wch: 12 }, // 소분류 ID
      { wch: 20 }, // 소분류명
      { wch: 20 }, // 생성일시
    ]
    worksheet['!cols'] = columnWidths
    
    // 워크북 생성
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '카테고리')
    
    // 현재 날짜를 파일명에 추가
    const date = new Date()
    const dateString = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
      date.getDate()
    ).padStart(2, '0')}`
    
    // 파일 다운로드
    XLSX.writeFile(workbook, `${fileName}_${dateString}.xlsx`)
    
    return true
  } catch (error) {
    console.error('엑셀 다운로드 실패:', error)
    throw error
  }
}

/**
 * JSON 데이터를 엑셀 파일로 다운로드하는 범용 함수
 * @param data - JSON 데이터
 * @param fileName - 다운로드할 파일명
 * @param sheetName - 시트명 (기본값: Sheet1)
 */
export const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  fileName: string,
  sheetName: string = 'Sheet1'
) => {
  try {
    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(data)
    
    // 워크북 생성
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    
    // 현재 날짜를 파일명에 추가
    const date = new Date()
    const dateString = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
      date.getDate()
    ).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`
    
    // 파일 다운로드
    XLSX.writeFile(workbook, `${fileName}_${dateString}.xlsx`)
    
    return true
  } catch (error) {
    console.error('엑셀 다운로드 실패:', error)
    throw error
  }
}