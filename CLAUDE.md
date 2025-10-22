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

## 광고/배너 등록 페이지 패턴

### 개요
모든 광고 및 배너 등록/수정 페이지는 동일한 디자인 패턴과 로직을 따릅니다. 내부 구성 요소만 달라집니다.

### 공통 구조

#### 1. 페이지 레이아웃
```tsx
const [Domain]EditPage = () => {
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id
  
  return (
    <div className={styles.[domain]EditPage}>
      <h1 className={styles.[domain]EditPage__title}>
        <span>♦</span> {isEditMode ? '[도메인] 수정' : '[도메인] 등록'}
      </h1>
      
      <section className={styles.[domain]EditPage__form}>
        {/* 폼 필드들 */}
      </section>
      
      <div className={styles.[domain]EditPage__actions}>
        <Space>
          <Button size='large' onClick={handleCancel}>취소</Button>
          <Button type='primary' size='large' onClick={handleSave}>
            {isEditMode ? '수정' : '저장'}
          </Button>
        </Space>
      </div>
    </div>
  )
}
```

#### 2. 날짜/시간 선택 패턴
모든 광고/배너 페이지에서 동일한 날짜/시간 선택 로직을 사용합니다:

```tsx
// 상태 정의
const [startDate, setStartDate] = useState<Dayjs | null>(null)
const [startHour, setStartHour] = useState<string>('00')
const [startMinute, setStartMinute] = useState<string>('00')
const [endDate, setEndDate] = useState<Dayjs | null>(null)
const [endHour, setEndHour] = useState<string>('23')
const [endMinute, setEndMinute] = useState<string>('59')

// 시간 옵션 생성
const hourOptions = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, '0'),
  label: `${i.toString().padStart(2, '0')}시`,
}))

const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
  value: i.toString().padStart(2, '0'),
  label: `${i.toString().padStart(2, '0')}분`,
}))

// UI 구성
<div className={styles.dateTimeWrapper}>
  <div className={styles.dateTimeRow}>
    <span className={styles.dateLabel}>시작 일시</span>
    <DatePicker
      value={startDate}
      onChange={setStartDate}
      format='YYYY-MM-DD'
      placeholder='날짜 선택'
      suffixIcon={<CalendarOutlined />}
      size='large'
      style={{ width: 150 }}
    />
    <Select value={startHour} onChange={setStartHour} options={hourOptions} size='large' style={{ width: 80 }} />
    <Select value={startMinute} onChange={setStartMinute} options={minuteOptions} size='large' style={{ width: 80 }} />
  </div>
  
  <div className={styles.dateTimeRow}>
    <span className={styles.dateLabel}>종료 일시</span>
    <DatePicker
      value={endDate}
      onChange={setEndDate}
      format='YYYY-MM-DD'
      placeholder='날짜 선택'
      suffixIcon={<CalendarOutlined />}
      size='large'
      style={{ width: 150 }}
    />
    <Select value={endHour} onChange={setEndHour} options={hourOptions} size='large' style={{ width: 80 }} />
    <Select value={endMinute} onChange={setEndMinute} options={minuteOptions} size='large' style={{ width: 80 }} />
  </div>
</div>

// 저장 시 날짜/시간 조합
const startDateTime = startDate
  .set('hour', parseInt(startHour))
  .set('minute', parseInt(startMinute))
  .set('second', 0)
  .toISOString()

const endDateTime = endDate
  .set('hour', parseInt(endHour))
  .set('minute', parseInt(endMinute))
  .set('second', 0)
  .toISOString()
```

#### 3. API 연동 패턴
```tsx
// 수정 모드 데이터 로드
const { data: detail } = use[Domain]Detail(Number(id), isEditMode)

// 등록/수정 뮤테이션
const createMutation = use[Domain]Create(
  () => {
    message.success('[도메인]이 등록되었습니다.')
    navigate(ROUTE_PATH.[DOMAIN])
  },
  () => {
    message.error('[도메인] 등록에 실패했습니다.')
  }
)

const updateMutation = use[Domain]Update(
  Number(id),
  () => {
    message.success('[도메인]이 수정되었습니다.')
    navigate(ROUTE_PATH.[DOMAIN])
  },
  () => {
    message.error('[도메인] 수정에 실패했습니다.')
  }
)

// 데이터 로드 시 폼 자동 채우기
useEffect(() => {
  if (isEditMode && detail) {
    // 날짜/시간 파싱
    const startDateTime = dayjs(detail.startedAt)
    setStartDate(startDateTime)
    setStartHour(startDateTime.format('HH'))
    setStartMinute(startDateTime.format('mm'))
    
    const endDateTime = dayjs(detail.finishedAt)
    setEndDate(endDateTime)
    setEndHour(endDateTime.format('HH'))
    setEndMinute(endDateTime.format('mm'))
    
    // 기타 필드 설정
  }
}, [isEditMode, detail])
```

#### 4. 유효성 검증
```tsx
const handleSave = () => {
  // 필수 항목 체크
  if (!startDate || !endDate) {
    message.warning('노출기간을 선택해주세요.')
    return
  }
  
  // 날짜 유효성 체크
  if (startDate.isAfter(endDate)) {
    message.warning('시작일이 종료일보다 늦을 수 없습니다.')
    return
  }
  
  // 기타 필드 유효성 체크
  
  // API 호출
  const requestData = {
    startedAt: startDateTime,
    finishedAt: endDateTime,
    // 기타 필드
  }
  
  if (isEditMode) {
    updateMutation.mutate(requestData)
  } else {
    createMutation.mutate(requestData)
  }
}
```

### 특징
- 모든 광고/배너 페이지가 동일한 디자인 패턴 공유
- 날짜/시간 선택 로직 재사용
- 등록/수정 모드 자동 구분
- 일관된 유효성 검증 및 에러 처리
- 성공/실패 메시지 표준화

### 적용 페이지
- 변호사 광고 (AdLawyerEditPage)
- 배너 광고 (추가 예정)
- 기타 광고 관련 페이지

## 검색 기능 구현 가이드

### 개요
모든 리스트 페이지의 검색 기능은 URL 기반 상태 관리와 React Query를 조합하여 구현합니다. 검색 UI는 Layout 컴포넌트에서 관리하고, 실제 API 호출과 데이터 처리는 Page 컴포넌트에서 처리합니다.

### 아키텍처 패턴

```
Layout (검색 UI)
  ↓ URL 파라미터 업데이트
URL (?search=keyword&searchType=email)
  ↓ useSearchParams로 읽기
Page (API 호출)
  ↓ React Query
API 서비스
```

### 구현 단계

#### 1. Layout 컴포넌트에 검색 UI 추가

**파일**: `src/pages/[domain]/[domain]Layout/[Domain]Layout.tsx`

```tsx
import { Outlet, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import SearchHeader, { SearchHeaderMenuItemType } from '@/components/searchHeader/SearchHeader'
import { useState, useEffect } from 'react'
import { ROUTE_PATH } from '@/routes/routePath'

// 1. 검색 타입 메뉴 아이템 정의
export const [domain]MenuItems = [
  { label: '아이디', key: 'account' },
  { label: '이메일주소', key: 'email' },
  { label: '계정이름', key: 'name' },
]

const [Domain]Layout = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  // 2. URL에서 searchType 읽어 초기 선택 아이템 설정
  const [selectedItem, setSelectedItem] = useState<SearchHeaderMenuItemType | null>(() => {
    const searchType = searchParams.get('searchType')
    if (searchType === 'email') {
      return [domain]MenuItems[1]
    } else if (searchType === 'name') {
      return [domain]MenuItems[2]
    }
    return [domain]MenuItems[0] // 기본값: 첫 번째 아이템
  })

  const searchQuery = searchParams.get('search') || ''

  // 3. URL 파라미터 변경 시 selectedItem 동기화
  useEffect(() => {
    const type = searchParams.get('searchType')
    if (type === 'email') {
      setSelectedItem([domain]MenuItems[1])
    } else if (type === 'name') {
      setSelectedItem([domain]MenuItems[2])
    } else {
      setSelectedItem([domain]MenuItems[0])
    }
  }, [searchParams])

  // 4. 검색 타입 선택 핸들러 (API 호출 없음)
  const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
    setSelectedItem(item)
    // 선택만 변경하고 API 호출은 하지 않음 (검색 시에만 호출)
  }

  // 5. 검색 실행 핸들러
  const onSearch = (value: string) => {
    const searchType = (selectedItem?.key as string) || 'account'

    // 등록/수정 페이지에 있다면 리스트 페이지로 이동
    if (location.pathname.includes('register') || location.pathname.includes('edit')) {
      if (value.trim()) {
        navigate(`${ROUTE_PATH.[DOMAIN]_LIST}?search=${value}&searchType=${searchType}`)
      } else {
        navigate(`${ROUTE_PATH.[DOMAIN]_LIST}?searchType=${searchType}`)
      }
    } else {
      // 리스트 페이지에 있다면 현재 페이지에서 검색
      if (value.trim()) {
        setSearchParams({
          search: value,
          searchType: searchType,
        })
      } else {
        setSearchParams({
          searchType: searchType,
        })
      }
    }
  }

  return (
    <div className={styles['[domain]-layout']}>
      <SearchHeader
        menuItems={[domain]MenuItems}
        className={styles['[domain]-layout__searchHeader']}
        bordered={false}
        title='페이지 제목'
        selectedItem={selectedItem}
        onSelectionChange={handleSelectionChange}
        onSearch={onSearch}
        defaultValue={searchQuery}
      />
      <Outlet />
    </div>
  )
}

export default [Domain]Layout
```

**핵심 포인트:**
- 검색 타입 선택은 로컬 state만 변경 (API 호출 X)
- 실제 검색 시에만 URL 파라미터 업데이트
- 등록/수정 페이지에서 검색 시 리스트 페이지로 이동
- `defaultValue`로 URL의 검색어를 SearchHeader에 전달

#### 2. Page 컴포넌트에서 URL 파라미터 읽기

**파일**: `src/pages/[domain]/[domain]Management/[Domain]ManagementPage.tsx`

```tsx
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { use[Domain]List } from '@/hooks/queries/use[Domain]'

const [Domain]ManagementPage = () => {
  const [searchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [orderBy, setOrderBy] = useState<keyof [Domain]>('[domain]CreatedAt')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')

  // 1. URL 파라미터에서 검색어와 검색 타입 추출
  const searchQuery = searchParams.get('search') || undefined
  const searchType = (searchParams.get('searchType') as 'account' | 'email' | 'name' | 'all') || undefined

  // 2. Admin 필드명을 API sortBy 타입으로 매핑 (필요한 경우)
  const getSortBy = (
    field: keyof [Domain]
  ): 'field1' | 'field2' | 'createdAt' | undefined => {
    const mapping: Record<string, 'field1' | 'field2' | 'createdAt'> = {
      [domain]Field1: 'field1',
      [domain]Field2: 'field2',
      [domain]CreatedAt: 'createdAt',
    }
    return mapping[field]
  }

  // 3. React Query로 데이터 가져오기
  const { data: [domain]List, isLoading } = use[Domain]List({
    skip: currentPage - 1,
    take: 10,
    searchQuery: searchQuery,
    searchType: searchType,
    sortBy: getSortBy(orderBy),
    sortOrder: sort,
  })

  // 4. 검색 파라미터가 변경되면 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, searchType])

  // ... 나머지 코드
}
```

**핵심 포인트:**
- `useSearchParams`로 URL에서 검색 파라미터 읽기
- 검색어가 없으면 `undefined` (빈 문자열이 아님)
- 검색 파라미터 변경 시 페이지를 1로 리셋
- 필요시 프론트엔드 필드명을 백엔드 필드명으로 매핑

#### 3. API 서비스 수정

**파일**: `src/services/[domain]Service.ts`

```tsx
// Request 타입에 검색 파라미터 추가
export interface [Domain]ListRequest {
  skip?: number
  take?: number
  searchQuery?: string
  searchType?: 'account' | 'email' | 'name' | 'all'
  sortBy?: 'field1' | 'field2' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  // 기타 필터 파라미터
}

// API 호출 함수
get[Domain]List: async (request: [Domain]ListRequest) => {
  // 1. 모든 파라미터 destructuring
  const { skip, take, searchQuery, searchType, sortBy, sortOrder } = request

  // 2. URLSearchParams 생성
  const params = new URLSearchParams()
  if (skip !== undefined) params.append('skip', skip.toString())
  if (take !== undefined) params.append('take', take.toString())
  if (searchQuery) params.append('searchQuery', searchQuery)
  if (searchType) params.append('searchType', searchType)
  if (sortBy) params.append('sortBy', sortBy)
  if (sortOrder) params.append('sortOrder', sortOrder)

  // 3. API 호출
  const queryString = params.toString()
  const url = `/[domain]${queryString ? `?${queryString}` : ''}`
  const response = await instance.get<[Domain][]>(url)
  return response.data
}
```

**핵심 포인트:**
- 모든 파라미터를 명시적으로 destructuring
- `undefined`가 아닌 값만 URLSearchParams에 추가
- 쿼리 스트링이 있을 때만 `?` 추가

#### 4. React Query 훅 수정

**파일**: `src/hooks/queries/use[Domain].ts`

```tsx
import { useQuery } from '@tanstack/react-query'
import { [domain]Service, [Domain]ListRequest } from '@/services/[domain]Service'
import { QUERY_KEY } from '@/constants/queryKey'

export const use[Domain]List = (request: [Domain]ListRequest) => {
  return useQuery({
    // ⚠️ 중요: queryKey에 모든 파라미터를 명시적으로 포함
    queryKey: [
      QUERY_KEY.[DOMAIN]_LIST,
      {
        skip: request.skip,
        take: request.take,
        searchQuery: request.searchQuery,
        searchType: request.searchType,
        sortBy: request.sortBy,
        sortOrder: request.sortOrder,
        // 기타 필터 파라미터도 모두 포함
      },
    ],
    queryFn: () => [domain]Service.get[Domain]List(request),
  })
}
```

**핵심 포인트:**
- queryKey에 모든 파라미터를 **명시적으로** 포함
- `[QUERY_KEY.[DOMAIN]_LIST, request]`는 작동하지 않음 (객체 참조 비교 문제)
- 각 파라미터를 개별적으로 나열해야 React Query가 변경 감지 가능

### 테스트 체크리스트

구현 후 다음 항목들을 확인하세요:

#### 기본 검색 기능
- [ ] 검색 타입 선택 시 API 호출이 발생하지 않는가?
- [ ] 검색어 입력 후 엔터/검색 버튼 클릭 시 URL이 업데이트되는가?
- [ ] URL 업데이트 후 API가 정상적으로 호출되는가?
- [ ] 검색 결과가 테이블에 정상적으로 표시되는가?
- [ ] 검색어를 지우고 검색하면 전체 리스트가 표시되는가?

#### URL 상태 관리
- [ ] URL에 `?search=keyword&searchType=email` 형태로 파라미터가 추가되는가?
- [ ] 브라우저 뒤로가기 시 이전 검색 상태로 복원되는가?
- [ ] URL을 직접 복사하여 새 탭에서 열면 같은 검색 결과가 표시되는가?

#### 페이지 이동
- [ ] 등록/수정 페이지에서 검색 시 리스트 페이지로 이동하는가?
- [ ] 이동 후 사이드바에서 리스트 메뉴가 선택 상태로 표시되는가?
- [ ] 리스트 페이지에서 검색 시 현재 페이지에서 결과가 업데이트되는가?

#### 페이지네이션 및 정렬
- [ ] 검색 후 페이지가 1로 리셋되는가?
- [ ] 검색 결과에서 정렬이 정상적으로 작동하는가?
- [ ] 검색 결과에서 페이지 이동 후 다시 검색하면 1페이지로 돌아가는가?

#### React Query 캐싱
- [ ] 같은 검색어로 재검색 시 캐시된 데이터가 즉시 표시되는가?
- [ ] 다른 검색어로 검색 시 새로운 API 호출이 발생하는가?
- [ ] 검색 타입을 변경하고 검색 시 새로운 API 호출이 발생하는가?

### 일반적인 오류와 해결 방법

#### 1. 검색이 전혀 작동하지 않음
**증상**: 검색어를 입력하고 검색해도 결과가 바뀌지 않음

**원인**: React Query의 queryKey가 파라미터 변경을 감지하지 못함

**해결**:
```tsx
// ❌ 잘못된 예시
queryKey: [QUERY_KEY.LIST, request]

// ✅ 올바른 예시
queryKey: [
  QUERY_KEY.LIST,
  {
    searchQuery: request.searchQuery,
    searchType: request.searchType,
    // 모든 파라미터를 명시적으로 나열
  },
]
```

#### 2. API에 검색 파라미터가 전달되지 않음
**증상**: 네트워크 탭에서 확인 시 쿼리 스트링에 검색 파라미터가 없음

**원인**: 서비스 함수에서 파라미터를 destructuring하지 않았거나 URLSearchParams에 추가하지 않음

**해결**:
```tsx
// ❌ 잘못된 예시
get[Domain]List: async (request: [Domain]ListRequest) => {
  const { skip, take } = request // searchQuery, searchType 누락!
  // ...
}

// ✅ 올바른 예시
get[Domain]List: async (request: [Domain]ListRequest) => {
  const { skip, take, searchQuery, searchType, sortBy, sortOrder } = request
  const params = new URLSearchParams()
  if (searchQuery) params.append('searchQuery', searchQuery)
  if (searchType) params.append('searchType', searchType)
  // ...
}
```

#### 3. 검색 타입 선택 시 불필요한 API 호출 발생
**증상**: 드롭다운에서 검색 타입을 변경할 때마다 API가 호출됨

**원인**: `handleSelectionChange`에서 URL을 업데이트함

**해결**:
```tsx
// ❌ 잘못된 예시
const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
  setSelectedItem(item)
  setSearchParams({ searchType: item.key }) // URL 업데이트 → API 호출!
}

// ✅ 올바른 예시
const handleSelectionChange = (item: SearchHeaderMenuItemType) => {
  setSelectedItem(item)
  // 선택만 변경하고 API 호출은 하지 않음 (검색 시에만 호출)
}
```

#### 4. 등록/수정 페이지에서 검색 시 사이드바가 업데이트되지 않음
**증상**: 검색 후 리스트 페이지로 이동했지만 사이드바에서 등록/수정 메뉴가 여전히 선택됨

**원인**: `selectedKeys` 계산 로직이 MainLayout에 있지 않음

**해결**: MainLayout에서 `useMemo`로 `selectedKeys`를 계산하고 Sidebar에 props로 전달
```tsx
// MainLayout.tsx
const selectedKeys = useMemo(() => {
  const pathname = location.pathname
  const normalizedPath = pathname.startsWith('/') ? pathname.slice(1) : pathname
  // 매칭 로직
  return [matchedKey]
}, [location.pathname])

<Sidebar selectedKeys={selectedKeys} />
```

#### 5. 검색 후 페이지가 리셋되지 않음
**증상**: 3페이지에서 검색하면 결과는 바뀌지만 여전히 3페이지에 머물러 있음

**원인**: 검색 파라미터 변경 시 `currentPage`를 리셋하지 않음

**해결**:
```tsx
useEffect(() => {
  setCurrentPage(1)
}, [searchQuery, searchType])
```

### 참고 구현

완전한 구현 예시는 다음 파일을 참고하세요:
- Layout: `src/pages/admin/adminLayout/AdminLayout.tsx`
- Page: `src/pages/admin/adminManagement/AdminManagementPage.tsx`
- Service: `src/services/adminService.ts`
- Hook: `src/hooks/queries/useGetAdminList.ts`

## 기타 규칙
(추후 추가)