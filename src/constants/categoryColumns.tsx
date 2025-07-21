import React from 'react'

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
    {icons.map((src, idx) => (
      <img
        key={idx}
        src={src.startsWith('/') ? src : `/src/assets/imgs/${src}`}
        alt={`icon${idx}`}
        width={32}
        height={32}
      />
    ))}
  </div>
)

// 이동 아이콘 렌더링 함수
export const renderMoveIcon = () => <span style={{ cursor: 'grab' }}>≡</span>

// 대분류 테이블 컬럼
export const MAIN_CATEGORY_COLUMNS = [
  {
    title: '대분류',
    dataIndex: 'mainCategory',
    key: 'mainCategory',
    onHeaderCell: () => ({
      style: { textAlign: 'center' },
    }),
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

// 소분류 테이블 컬럼
export const SUB_CATEGORY_COLUMNS = [
  {
    title: '소분류',
    dataIndex: 'subCategory',
    key: 'subCategory',
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
