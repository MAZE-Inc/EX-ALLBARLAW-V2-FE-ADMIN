import { ROUTE_PATH } from '@/routes/routePath'
import { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

export const menuItems: MenuItem[] = [
  {
    key: 'admin',
    label: '관리자 계정',
    children: [
      {
        key: 'admin-management',
        label: '관리자 계정 관리',
      },
      {
        key: 'admin-management/register',
        label: '계정 등록',
      },
    ],
  },
  {
    key: 'category',
    label: '분류 설정',
    children: [{ key: 'category-management', label: '대/소분류 관리' }],
  },
  {
    key: 'member',
    label: '회원관리',
    children: [
      { key: 'member-member', label: '일반 회원' },
      { key: 'member-lawyer', label: '변호사 회원' },
    ],
  },
  {
    key: 'lawyer',
    label: '변호사 관리',
    children: [{ key: 'lawyer-management', label: '변호사 리스트' }],
  },
  {
    key: 'content',
    label: '분류별 컨텐츠 관리',
    children: [
      { key: `${ROUTE_PATH.CONTENT}/${ROUTE_PATH.CONTENT_BLOG}`, label: '블로그글' },
      { key: `${ROUTE_PATH.CONTENT}/${ROUTE_PATH.CONTENT_VIDEO}`, label: '법률영상' },
      { key: `${ROUTE_PATH.CONTENT}/${ROUTE_PATH.CONTENT_KNOWLEDGE}`, label: '법률지식인' },
    ],
  },
  {
    key: 'chat',
    label: '채팅상담',
    children: [{ key: 'chat-list', label: '채팅리스트' }],
  },
  {
    key: 'board',
    label: '게시판',
    children: [
      { key: ROUTE_PATH.BOARD_NOTICE, label: '공지사항' },
      { key: 'board-faq', label: 'FAQ' },
      { key: 'board-legalDictionary', label: '법률 백과사전' },
    ],
  },
  {
    key: 'ad',
    label: '광고 관리',
    children: [
      { key: 'ad-lawfirm', label: '로펌 광고' },
      { key: 'ad-banner', label: '배너 광고' },
      { key: 'ad-lawyer', label: '변호사 광고' },
    ],
  },
  {
    key: 'statistics',
    label: '통계',
    children: [{ key: 'statistics-list', label: '통계 바로가기' }],
  },
]
