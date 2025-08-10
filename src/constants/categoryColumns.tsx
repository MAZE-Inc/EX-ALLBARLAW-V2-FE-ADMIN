import { Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

// 아이콘 렌더링 함수
export const renderIcons = (icons: string[]) => (
  <div
    style={{
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {icons.map((src, idx) => {
      // URL이 비어있으면 기본 이미지 또는 빈 문자열 처리
      if (!src) return null
      
      // 이미 완전한 URL인 경우 (http://, https://, data: 로 시작)
      const isFullUrl = src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')
      
      // 적절한 src 결정
      const imageSrc = isFullUrl ? src : src.startsWith('/') ? src : `/assets/imgs/${src}`
      
      return (
        <img
          key={idx}
          src={imageSrc}
          alt={`icon${idx}`}
          width={32}
          height={32}
          onError={(e) => {
            console.error(`Failed to load image: ${imageSrc}`)
            e.currentTarget.style.display = 'none'
          }}
        />
      )
    })}
  </div>
)

// 이동 아이콘 렌더링 함수
export const renderMoveIcon = () => <span style={{ cursor: 'grab' }}>≡</span>

// 대분류 이름과 삭제 버튼을 함께 렌더링하는 함수
export const renderMainCategoryWithDelete = (text: string, record: any, onDelete?: (record: any) => void) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span>{text}</span>
    {onDelete && (
      <Button
        type='text'
        size='small'
        onClick={e => {
          e.stopPropagation()
          onDelete(record)
        }}
        style={{
          marginLeft: 8,
          minWidth: 'auto',
          padding: '4px',
          color: '#999',
          border: 'none',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#ff4d4f'
          e.currentTarget.style.backgroundColor = '#fff2f0'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = '#999'
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        icon={<CloseOutlined style={{ fontSize: '12px' }} />}
      />
    )}
  </div>
)

// 소분류 이름과 삭제 버튼을 함께 렌더링하는 함수
export const renderSubCategoryWithDelete = (text: string, record: any, onDelete?: (record: any) => void) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span>{text}</span>
    {onDelete && (
      <Button
        type='text'
        size='small'
        onClick={e => {
          e.stopPropagation()
          onDelete(record)
        }}
        style={{
          marginLeft: 8,
          minWidth: 'auto',
          padding: '4px',
          color: '#999',
          border: 'none',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#ff4d4f'
          e.currentTarget.style.backgroundColor = '#fff2f0'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = '#999'
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        icon={<CloseOutlined style={{ fontSize: '12px' }} />}
      />
    )}
  </div>
)

// 대분류 테이블 컬럼 생성 함수
export const createMainCategoryColumns = (onDelete?: (record: any) => void) => [
  {
    title: '대분류',
    dataIndex: 'mainCategory',
    key: 'mainCategory',
    onHeaderCell: () => ({
      style: { textAlign: 'center' },
    }),
    render: (text: string, record: any) => renderMainCategoryWithDelete(text, record, onDelete),
  },
  {
    title: '아이콘',
    dataIndex: 'icons',
    key: 'icons',
    render: renderIcons,
    width: 150,
    align: 'center' as const,
  },
  {
    title: '소분류',
    dataIndex: 'subCategory',
    key: 'subCategory',
    width: 100,
    align: 'center' as const,
    onHeaderCell: () => ({
      style: { textAlign: 'center' },
    }),
  },
  {
    title: '이동',
    key: 'move',
    width: 100,
    render: renderMoveIcon,
    align: 'center' as const,
  },
]

// 소분류 테이블 컬럼 생성 함수
export const createSubCategoryColumns = (onDelete?: (record: any) => void) => [
  {
    title: '소분류',
    dataIndex: 'subCategory',
    key: 'subCategory',
    render: (text: string, record: any) => renderSubCategoryWithDelete(text, record, onDelete),
  },
  {
    title: '글',
    dataIndex: 'article',
    key: 'article',
    align: 'center' as const,
  },
  {
    title: '영상',
    dataIndex: 'video',
    key: 'video',
    align: 'center' as const,
  },
  {
    title: '지식',
    dataIndex: 'knowledge',
    key: 'knowledge',
    align: 'center' as const,
  },
  {
    title: '변호사',
    dataIndex: 'lawyer',
    key: 'lawyer',
    align: 'center' as const,
  },
  {
    title: '이동',
    key: 'move',
    width: 100,
    render: renderMoveIcon,
    align: 'center' as const,
  },
]

// 기존 컬럼들 (하위 호환성을 위해 유지)
export const MAIN_CATEGORY_COLUMNS = createMainCategoryColumns()
export const SUB_CATEGORY_COLUMNS = createSubCategoryColumns()
