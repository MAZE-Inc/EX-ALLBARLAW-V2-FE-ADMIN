# CLAUDE.md - 프로젝트 코딩 규칙

## UI 컴포넌트 규칙

### 엑셀 다운로드 버튼 디자인
엑셀 다운로드 버튼은 다음과 같은 표준 디자인을 따릅니다:

```tsx
import { Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

<Button 
  icon={<DownloadOutlined />}
  onClick={handleExcelDownload}
  disabled={selectedItems.length === 0}
>
  선택 항목 엑셀 다운로드 ({selectedItems.length}건)
</Button>
```

#### 특징:
- `DownloadOutlined` 아이콘 사용
- 선택된 항목이 없을 때 `disabled` 상태
- 버튼 텍스트에 선택된 항목 수 표시
- 형식: "선택 항목 엑셀 다운로드 (N건)"

### 에디터 페이지 기본 레이아웃
모든 에디터 페이지(등록/수정 폼)는 다음과 같은 테이블 형태의 레이아웃을 따릅니다:

#### HTML 구조:
```tsx
<div className={styles.formRow}>
  <div className={styles.labelCol}>
    <label className={styles.label}>라벨명</label>
  </div>
  <div className={styles.inputCol}>
    {/* Input, Select, TextArea 등의 폼 컴포넌트 */}
  </div>
</div>
```

#### SCSS 스타일:
```scss
&__form {
  border-top: 1px solid #d9d9d9;
  
  .formRow {
    display: flex;
    align-items: stretch;
    margin-bottom: 0;
    border-bottom: 1px solid #d9d9d9;
    
    &:last-child {
      margin-bottom: 24px;
    }
    
    // TextArea가 있는 row에 대한 특별 처리 예시
    &:nth-child(3) {
      .labelCol {
        align-items: flex-start;
        padding-top: 20px;
      }
      
      .inputCol {
        align-items: flex-start;
      }
    }
  }

  .labelCol {
    width: 150px;
    flex-shrink: 0;
    padding: 16px;
    background-color: #fafafa;
    border-right: 1px solid #d9d9d9;
    display: flex;
    align-items: center;
    min-height: 56px;
  }

  .inputCol {
    flex: 1;
    padding: 16px;
    display: flex;
    align-items: center;
    min-height: 56px;
  }

  .label {
    display: block;
    margin: 0;
    font-weight: 500;
    text-align: left;
    color: #262626;
    font-size: 14px;
  }
}
```

#### 특징:
- 테이블 형태의 깔끔한 레이아웃
- 라벨 컬럼은 회색 배경(#fafafa)으로 구분
- 각 행은 border로 구분
- 첫 번째 컬럼의 왼쪽과 마지막 컬럼의 오른쪽 border는 없음
- TextArea 등 높이가 다른 요소는 별도 처리
- 최소 높이 56px로 일관된 행 높이 유지

## 리스트 페이지 테이블 규칙

### 기본 테이블 구조
모든 리스트 페이지의 테이블은 Ant Design의 Table 컴포넌트를 사용하며 다음과 같은 표준을 따릅니다:

```tsx
import { Table, TableProps } from 'antd'

<Table<DataType>
  columns={columns}
  dataSource={data}
  rowSelection={rowSelection}  // 선택 기능이 필요한 경우
  rowKey='id'  // 고유 키 필드
  pagination={false}  // 페이지네이션은 별도 컴포넌트로 관리
  loading={loading}
  onChange={() => {}}  // 정렬은 헤더 클릭으로 처리
  onRow={record => ({
    onClick: () => navigate(`/detail/${record.id}`)  // 행 클릭 시 상세 페이지 이동
  })}
/>
```

### 컬럼 정의 패턴
```tsx
const columns: TableProps<DataType>['columns'] = [
  {
    title: '컬럼명',
    dataIndex: 'fieldName',
    sorter: true,  // 정렬 가능한 컬럼
    sortOrder: getSortOrder('fieldName'),
    onHeaderCell: () => ({
      onClick: () => onSort('fieldName'),
    }),
  },
  // 날짜 형식 렌더링
  {
    title: '날짜',
    dataIndex: 'createdAt',
    render: (value: string) => value ? dayjs(value).format('YY-MM-DD HH:mm') : '',
  },
  // 액션 버튼이 있는 컬럼
  {
    title: '관리',
    render: (_, record) => (
      <Button size='small' onClick={e => handleAction(record, e)}>
        액션
      </Button>
    ),
  },
]
```

### 행 선택 기능
```tsx
const rowSelection = {
  selectedRowKeys: selectedRows.map(row => row.id),
  onSelectAll: (selected: boolean, selectedRows: DataType[]) => {
    const newSelectedRows = selected ? selectedRows : []
    setSelectedRows(newSelectedRows)
    onSelectionChange?.(newSelectedRows)
  },
  onSelect: (record: DataType, selected: boolean) => {
    setSelectedRows(prev => {
      const newSelectedRows = selected 
        ? [...prev, record] 
        : prev.filter(row => row.id !== record.id)
      onSelectionChange?.(newSelectedRows)
      return newSelectedRows
    })
  },
}
```

### 테이블 스타일 (SCSS)
```scss
.list-container {
  :global {
    // 체크박스 스타일
    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: $color-green-02;
      border-color: $color-green-02;
    }

    .ant-checkbox:hover .ant-checkbox-inner {
      border-color: $color-green-02;
    }

    // 테이블 행 호버
    .ant-table-tbody > tr:hover > td {
      background-color: rgba(82, 196, 26, 0.05) !important;
    }

    // 선택된 행
    .ant-table-tbody > tr.ant-table-row-selected > td {
      background-color: rgba(82, 196, 26, 0.1);
    }

    // 정렬 아이콘
    .ant-table-column-sorter-up.active,
    .ant-table-column-sorter-down.active {
      color: $color-green-02;
    }
  }
}
```

### 특징:
- Ant Design Table 컴포넌트 사용
- 행 클릭 시 상세 페이지 이동
- 체크박스를 통한 다중 선택 지원
- 컬럼별 정렬 기능
- 녹색($color-green-02) 테마 색상 사용
- 호버 및 선택 상태 시각적 피드백

### 페이지네이션
모든 리스트 페이지의 페이지네이션은 다음 규칙을 따릅니다:

```tsx
import { Pagination } from '@/components/pagination/Pagination'

{totalPages && (
  <div className={styles['pagination-wrapper']}>
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  </div>
)}
```

#### 페이지네이션 스타일:
```scss
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;  // 항상 우측 정렬
  padding: 16px 0;  // 상하 패딩
}
```

#### 특징:
- 커스텀 Pagination 컴포넌트 사용 (`@/components/pagination/Pagination`)
- 항상 우측 정렬 (`justify-content: flex-end`)
- 상하 16px 패딩
- 테이블 하단에 위치
- 데이터가 있을 때만 표시 (조건부 렌더링)

## 탭 컴포넌트 규칙

### 기본 탭 구조
모든 페이지의 탭은 Ant Design의 Tabs 컴포넌트를 사용하며 다음과 같은 표준을 따릅니다:

```tsx
import { ConfigProvider, Tabs, TabsProps } from 'antd'
import { COLOR } from '@/styles/abstracts/color'

const [activeTab, setActiveTab] = useState<'tab1' | 'tab2'>('tab1')

const handleTabChange = (key: string) => {
  setActiveTab(key as 'tab1' | 'tab2')
  setCurrentPage(1) // 탭 변경 시 페이지 초기화
  // 필요시 다른 상태들도 초기화
}

const items: TabsProps['items'] = [
  {
    key: 'tab1',
    label: '탭1',
  },
  {
    key: 'tab2',
    label: '탭2',
  },
]

// JSX
<ConfigProvider
  theme={{
    token: {
      colorPrimary: COLOR.GREEN_01,
    },
  }}
>
  <Tabs defaultActiveKey='tab1' items={items} onChange={handleTabChange} />
</ConfigProvider>
```

### 탭과 라우팅
탭이 다른 페이지로 이동해야 하는 경우:

```tsx
import { useNavigate, useLocation } from 'react-router-dom'

const navigate = useNavigate()
const location = useLocation()

// 현재 경로에 따라 탭 선택 상태 결정
const getActiveTab = () => {
  if (location.pathname.includes('specific-path')) {
    return 'tab2'
  }
  return 'tab1'
}

const handleTabChange = (key: string) => {
  setActiveTab(key as TabType)
  if (key === 'tab1') {
    navigate(ROUTE_PATH.TAB1)
  } else {
    navigate(ROUTE_PATH.TAB2)
  }
}
```

### 특징:
- Ant Design Tabs 컴포넌트 사용
- ConfigProvider로 녹색($color-green-01) 테마 적용
- 탭 변경 시 페이지 초기화 (currentPage = 1)
- 필요시 라우팅과 연동
- activeKey 대신 defaultActiveKey 사용 (제어 컴포넌트)

## 상세 페이지 정보 출력 규칙

### 기본 디테일 데이터 출력 방식
상세 페이지에서 정보를 표시할 때는 MemberInfo 컴포넌트 패턴을 따릅니다:

#### TypeScript 구조:
```tsx
import { DataType, InfoItem } from '@/types/dataType'
import styles from './dataInfo.module.scss'

interface InfoTableProps {
  title: string
  items: InfoItem[]
  data: DataType
}

const DataInfo = ({ title, items, data }: InfoTableProps) => {
  const getValue = (item: InfoItem) => {
    const value = data[item.key as keyof DataType]
    return item.formatter ? item.formatter(value) : String(value || '')
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.icon}>♦</span>
        {title}
      </h2>

      <div className={styles.infoTable}>
        {items.map(item => (
          <div key={item.key} className={styles.row}>
            <div className={styles.label}>{item.label}</div>
            <div className={styles.value}>{getValue(item)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

#### SCSS 스타일:
```scss
.section {
  margin-bottom: 32px;
}

.sectionTitle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;

  .icon {
    color: $color-green-02;
    font-size: 16px;
  }
}

.infoTable {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
}

.row {
  display: flex;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }

  .label {
    flex: 0 0 140px;
    padding: 12px 16px;
    background-color: #f8f9fa;
    border-right: 1px solid #e0e0e0;
    font-weight: 500;
    color: #333;
    display: flex;
    align-items: center;
  }

  .value {
    flex: 1;
    padding: 12px 16px;
    background-color: #fff;
    color: #666;
    display: flex;
    align-items: center;
  }
}
```

#### 사용 예시:
```tsx
<DataInfo
  title="기본 정보"
  items={[
    { key: 'name', label: '이름' },
    { key: 'email', label: '이메일' },
    { key: 'phone', label: '전화번호', formatter: (value) => formatPhone(value) },
    { key: 'createdAt', label: '등록일', formatter: (value) => dayjs(value).format('YYYY-MM-DD') }
  ]}
  data={userData}
/>
```

### 특징:
- 섹션별로 구분된 정보 표시
- 아이콘(♦)과 제목으로 섹션 구분
- 2열 테이블 구조 (라벨 | 값)
- 라벨 영역은 회색 배경(#f8f9fa)으로 구분
- 각 항목별 포매터 함수 지원
- 재사용 가능한 컴포넌트 구조

## SCSS 규칙

### Import 규칙
SCSS 파일에서는 abstracts를 import하지 않습니다:

```scss
// ❌ 잘못된 예시
@import '@/styles/abstracts/abstracts';

// ✅ 올바른 예시
// abstracts는 전역에 선언되어 있으므로 import 없이 바로 사용
.element {
  color: $color-green-02;  // 바로 사용 가능
}
```

#### 특징:
- `$color-*` 변수들은 전역에 선언되어 있음
- mixin과 function도 전역에서 사용 가능
- abstracts import는 불필요하며 제거해야 함

### SCSS 함수 사용 규칙
SCSS에서 darken, lighten 등의 색상 조작 함수를 사용하지 않습니다:

```scss
// ❌ 잘못된 예시
&:hover {
  background-color: darken($color-green-02, 10%);
  border-color: lighten($color-green-02, 10%);
}

// ✅ 올바른 예시
&:hover {
  background-color: $color-green-02;
  border-color: $color-green-02;
}
```

#### 특징:
- darken(), lighten() 등의 SCSS 색상 함수 사용 금지
- 색상은 정의된 변수를 그대로 사용
- 호버 효과가 필요한 경우 rgba를 사용한 투명도 조절 권장

## 배너 리스트 페이지 규칙

### 기본 구조
배너 관리 페이지는 탭 구조로 구성되며, 각 탭마다 테이블 형식의 리스트를 표시합니다:

#### 컴포넌트 구조:
```tsx
import React, { useState } from 'react'
import { Table, TableProps, Button, Image } from 'antd'
import dayjs from 'dayjs'
import styles from './bannerList.module.scss'

const BannerListPage = () => {
  const { data, isLoading } = useBannerHook()
  const [selectedRows, setSelectedRows] = useState<BannerType[]>([])

  const columns: TableProps<BannerType>['columns'] = [
    {
      title: 'No.',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '이미지 미리보기',
      dataIndex: 'bannerImageUrl',
      width: 300,
      render: (imageUrl: string | null) =>
        imageUrl ? (
          <div className={styles.imagePreview}>
            <Image src={imageUrl} alt='배너 이미지' style={{ maxWidth: '100%', height: 'auto', maxHeight: '80px' }} />
          </div>
        ) : (
          <div className={styles.noImage}>이미지 없음</div>
        ),
    },
    {
      title: '배너이름',
      dataIndex: 'bannerName',
      render: (name: string) => <span className={styles.bannerName}>{name}</span>,
    },
    {
      title: '배너기간',
      render: (_, record) => (
        <div className={styles.period}>
          {dayjs(record.bannerStartedAt).format('YYYY-MM-DD')} ~<br />
          {dayjs(record.bannerFinishedAt).format('YYYY-MM-DD')}
        </div>
      ),
    },
    {
      title: '관리',
      width: 100,
      render: (_, record) => (
        <Button type='primary' size='small' onClick={() => handleEdit(record)} className={styles.editButton}>
          배너관리
        </Button>
      ),
    },
  ]

  return (
    <div className={styles.bannerListPage}>
      <Table<BannerType>
        columns={columns}
        dataSource={data || []}
        rowKey='bannerId'
        rowSelection={rowSelection}
        loading={isLoading}
        pagination={false}
        className={styles.bannerTable}
      />
    </div>
  )
}
```

#### SCSS 스타일:
```scss
.bannerListPage {
  padding: 24px 0;

  .bannerTable {
    background: #fff;
    border-radius: 4px;

    :global {
      .ant-table-thead > tr > th {
        background: #fafafa;
        font-weight: 600;
        text-align: center;
      }

      .ant-table-tbody > tr > td {
        text-align: center;
        vertical-align: middle;
      }
    }
  }

  .imagePreview {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
  }

  .period {
    line-height: 1.5;
    color: #595959;
    font-size: 13px;
  }

  .editButton {
    background-color: $color-green-02;
    border-color: $color-green-02;
    
    &:hover {
      opacity: 0.9;
    }
  }
}
```

### 특징:
- 테이블 컬럼: No. / 이미지 미리보기 / 배너이름 / 배너기간 / 관리
- 이미지는 최대 높이 80px로 제한
- 날짜는 YYYY-MM-DD 형식으로 표시
- 배너기간은 시작일~종료일을 두 줄로 표시
- 관리 버튼은 녹색 테마 적용
- PC/모바일 노출 클릭수 컬럼은 제외

## 무한스크롤 구현 규칙

### 개요
무한스크롤은 `@tanstack/react-query`의 `useInfiniteQuery`와 커스텀 훅 `useInfiniteScroll`을 조합하여 구현합니다.

### 1. React Query 무한 쿼리 훅 생성 (서비스 기반)

#### 서비스가 제공될 때 훅 생성 프로세스:

1. **서비스 분석**: Request/Response 타입 확인
2. **useInfiniteQuery 훅 생성**: 서비스를 기반으로 무한 쿼리 훅 작성
3. **커서 파라미터 매핑**: Response의 커서 필드를 다음 페이지 파라미터로 변환

#### 기본 템플릿:
```tsx
// hooks/queries/use[Domain].ts
export const useInfinite[Domain]List = (
  request: Omit<[Domain]ListRequest, 'cursor' | 'cursorId'>
) => {
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEY.[DOMAIN]_LIST, 'infinite', ...Object.values(request)],
    queryFn: ({ pageParam }) =>
      [domain]Service.get[Domain]List({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    enabled: true, // 필요시 조건 추가
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
    getNextPageParam: (lastPage) => {
      // Response 구조에 따라 조정
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
  })

  return {
    ...query,
    hasNextPage: query.data?.pages[query.data.pages.length - 1]?.hasNextPage ?? false,
  }
}
```

#### 실제 예시 (BlogList):
```tsx
// hooks/queries/useContent.ts
export const useInfiniteBlogList = (request: Omit<BlogListRequest, 'cursor' | 'cursorId'>) => {
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEY.BLOG_LIST, 'infinite', request.subcategoryId, request.orderBy],
    queryFn: ({ pageParam }) =>
      contentService.getBlogList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    enabled: request.subcategoryId !== undefined,
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
    getNextPageParam: lastPage => {
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
  })

  return {
    ...query,
    hasNextPage: query.data?.pages[query.data.pages.length - 1]?.hasNextPage ?? false,
  }
}
```

#### Response 타입별 getNextPageParam 패턴:

**패턴 1: 커서 기반**
```tsx
getNextPageParam: (lastPage) => {
  if (!lastPage.hasNextPage) return undefined
  return {
    cursor: lastPage.nextCursor,
    cursorId: lastPage.nextCursorId,
  }
}
```

**패턴 2: 페이지 번호 기반**
```tsx
getNextPageParam: (lastPage, allPages) => {
  if (!lastPage.hasMore) return undefined
  return allPages.length + 1
}
```

**패턴 3: 오프셋 기반**
```tsx
getNextPageParam: (lastPage, allPages) => {
  const loadedCount = allPages.reduce((sum, page) => sum + page.data.length, 0)
  if (loadedCount >= lastPage.totalCount) return undefined
  return { offset: loadedCount }
}
```

### 2. useInfiniteScroll 커스텀 훅

#### 전체 코드:
```tsx
// hooks/useInfiniteScroll.ts
import { useCallback, useEffect } from 'react'

interface UseInfiniteScrollProps {
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage: () => void
  containerSelector?: string
}

export const useInfiniteScroll = ({
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  containerSelector = '.lawyer-selection-container',
}: UseInfiniteScrollProps) => {
  const handleScroll = useCallback(() => {
    const scrollContainer = document.querySelector(containerSelector) as HTMLElement
    if (!scrollContainer) return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer

    // 스크롤이 끝에서 100px 이내에 도달했을 때 다음 페이지 로드
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, containerSelector])

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const scrollContainer = document.querySelector(containerSelector)
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }
    return undefined
  }, [handleScroll, containerSelector])

  // 초기 로드 및 데이터 변경 시 스크롤 체크
  useEffect(() => {
    // hasNextPage가 true일 때만 체크
    if (hasNextPage && !isFetchingNextPage) {
      // DOM 업데이트를 기다린 후 체크
      const timeoutId = setTimeout(() => {
        const scrollContainer = document.querySelector(containerSelector) as HTMLElement
        if (!scrollContainer) return

        const hasScroll = scrollContainer.scrollHeight > scrollContainer.clientHeight

        // 스크롤이 없고, 다음 페이지가 있고, 로딩중이 아니면 추가 로드
        if (!hasScroll && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, containerSelector])

  return { handleScroll }
}
```

#### 핵심 기능:
1. **스크롤 감지**: 스크롤이 하단 100px 이내 도달 시 다음 페이지 로드
2. **자동 로드**: 컨테이너에 스크롤이 없을 때 자동으로 다음 페이지 로드
3. **중복 방지**: `isFetchingNextPage` 체크로 중복 호출 방지

### 3. 컴포넌트에서 사용

#### 구현 예시:
```tsx
// pages/content/blog/blogList/BlogList.tsx
const BlogList = () => {
  const navigate = useNavigate()
  const { subCategoryId } = useParams<{ subCategoryId: string }>()

  // 1. 무한 쿼리 사용
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteBlogList({
    subcategoryId: subCategoryId ? Number(subCategoryId) : 'all',
  })

  // 2. 무한스크롤 훅 적용
  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    containerSelector: '.blog-list-container',  // 스크롤 컨테이너 선택자
  })

  // 3. 빈 데이터 처리
  const isEmpty = !data?.pages || data.pages.every(page => page.data.length === 0)

  if (isEmpty && !isFetchingNextPage) {
    return (
      <main className={styles['blog-list']}>
        <section className={styles['blog-list-container']}>
          <EmptyState icon='📄' message='블로그 컨텐츠가 없습니다' />
        </section>
      </main>
    )
  }

  // 4. 데이터 렌더링
  return (
    <main className={styles['blog-list']}>
      <section className={`${styles['blog-list-container']} blog-list-container`}>
        {data?.pages.map(page =>
          page.data.map(blog => (
            <React.Fragment key={blog.blogCaseId}>
              <BlogItem item={blog} onClick={() => handleClickBlog(blog.blogCaseId)} />
              <Divider style={{ margin: 0 }} />
            </React.Fragment>
          ))
        )}
      </section>
    </main>
  )
}
```

#### 중요 포인트:
1. **스크롤 컨테이너 클래스**: CSS 클래스와 JS 선택자를 모두 포함
2. **빈 데이터 처리**: 데이터가 없을 때 EmptyState 표시
3. **페이지 매핑**: `data?.pages.map()`으로 모든 페이지 데이터 렌더링

### 4. CSS 스타일 설정

#### 스크롤 컨테이너 스타일:
```scss
.blog-list-container {
  height: calc(100vh - 200px);  // 적절한 높이 설정
  overflow-y: auto;              // 스크롤 활성화
  position: relative;
}
```

### 5. API Response 타입

#### 서버 응답 구조:
```tsx
interface BlogListResponse {
  data: BlogItem[]
  hasNextPage: boolean
  nextCursor?: number
  nextCursorId?: number
}
```

### 구현 체크리스트

무한스크롤 구현 시 다음 사항을 확인하세요:

- [ ] `useInfiniteQuery` 훅 생성
- [ ] `getNextPageParam` 로직 구현
- [ ] `useInfiniteScroll` 훅 적용
- [ ] 스크롤 컨테이너 선택자 지정
- [ ] 빈 데이터 상태 처리
- [ ] 스크롤 컨테이너 CSS (height, overflow-y)
- [ ] 로딩 상태 표시 (선택사항)

## 기타 규칙
(추후 추가)