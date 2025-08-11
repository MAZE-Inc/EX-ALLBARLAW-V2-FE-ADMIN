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

## 기타 규칙
(추후 추가)