import { ROUTE_PATH } from '@/routes/routePath'
import { MenuProps } from 'antd'
import { ADMIN_PERMISSION_IDS } from './adminPermission'

export interface ExtendedMenuItem {
  key: string
  label: string
  permissionId?: number
  children?: ExtendedMenuItem[]
}

type MenuItem = Required<MenuProps>['items'][number]

export const menuItemsWithPermissions: ExtendedMenuItem[] = [
  {
    key: 'admin',
    label: '관리자 계정',
    children: [
      {
        key: 'admin-management',
        label: '관리자 계정 관리',
        permissionId: ADMIN_PERMISSION_IDS.ADMIN_ACCOUNT_LIST,
      },
      {
        key: 'admin-management/register',
        label: '계정 등록',
        permissionId: ADMIN_PERMISSION_IDS.ACCOUNT_REGISTER,
      },
    ],
  },
  {
    key: 'category',
    label: '분류 설정',
    children: [
      { 
        key: 'category-management', 
        label: '대/소분류 관리',
        permissionId: ADMIN_PERMISSION_IDS.CATEGORY_MANAGEMENT,
      }
    ],
  },
  {
    key: 'member',
    label: '회원관리',
    children: [
      { 
        key: 'member-member', 
        label: '일반 회원',
        permissionId: ADMIN_PERMISSION_IDS.MEMBER_GENERAL,
      },
      { 
        key: 'member-lawyer', 
        label: '변호사 회원',
        permissionId: ADMIN_PERMISSION_IDS.MEMBER_LAWYER,
      },
    ],
  },
  {
    key: 'lawyer',
    label: '변호사 관리',
    children: [
      { 
        key: 'lawyer-management', 
        label: '변호사 리스트',
        permissionId: ADMIN_PERMISSION_IDS.LAWYER_LIST,
      }
    ],
  },
  {
    key: 'content',
    label: '분류별 컨텐츠 관리',
    children: [
      { 
        key: `${ROUTE_PATH.CONTENT}/${ROUTE_PATH.CONTENT_BLOG}`, 
        label: '블로그글',
        permissionId: ADMIN_PERMISSION_IDS.CONTENT_BLOG,
      },
      { 
        key: `${ROUTE_PATH.CONTENT}/${ROUTE_PATH.CONTENT_VIDEO}`, 
        label: '법률영상',
        permissionId: ADMIN_PERMISSION_IDS.CONTENT_VIDEO,
      },
      { 
        key: `${ROUTE_PATH.CONTENT}/${ROUTE_PATH.CONTENT_KNOWLEDGE}`, 
        label: '법률지식인',
        permissionId: ADMIN_PERMISSION_IDS.CONTENT_KNOWLEDGE,
      },
    ],
  },
  {
    key: 'chat',
    label: '채팅상담',
    children: [
      { 
        key: 'chat-list', 
        label: '채팅리스트',
        permissionId: ADMIN_PERMISSION_IDS.CHAT_LIST,
      }
    ],
  },
  {
    key: 'board',
    label: '게시판',
    children: [
      { 
        key: ROUTE_PATH.BOARD_NOTICE, 
        label: '공지사항',
        permissionId: ADMIN_PERMISSION_IDS.BOARD_NOTICE,
      },
      { 
        key: 'board-faq', 
        label: 'FAQ',
        permissionId: ADMIN_PERMISSION_IDS.BOARD_FAQ,
      },
      { 
        key: 'board-legalDictionary', 
        label: '법률 백과사전',
        permissionId: ADMIN_PERMISSION_IDS.BOARD_DICTIONARY,
      },
    ],
  },
  {
    key: 'ad',
    label: '광고 관리',
    children: [
      { 
        key: 'ad-lawfirm', 
        label: '로펌 광고',
        permissionId: ADMIN_PERMISSION_IDS.AD_LAWFIRM,
      },
      { 
        key: 'ad-banner', 
        label: '배너 광고',
        permissionId: ADMIN_PERMISSION_IDS.AD_BANNER,
      },
      { 
        key: 'ad-lawyer', 
        label: '변호사 광고',
        permissionId: ADMIN_PERMISSION_IDS.AD_LAWYER,
      },
    ],
  },
  {
    key: 'statistics',
    label: '통계',
    children: [
      { 
        key: 'statistics-list', 
        label: '통계 바로가기',
        permissionId: ADMIN_PERMISSION_IDS.STATISTICS,
      }
    ],
  },
]

// 권한에 따라 필터링된 메뉴 아이템 생성
export const filterMenuItemsByPermissions = (
  items: ExtendedMenuItem[],
  userPermissions: number[]
): MenuItem[] => {
  return items.reduce<MenuItem[]>((filtered, item) => {
    if (item.children) {
      // 자식 메뉴 필터링
      const filteredChildren = item.children.filter(child => 
        !child.permissionId || userPermissions.includes(child.permissionId)
      )
      
      // 접근 가능한 자식이 있는 경우에만 부모 메뉴 표시
      if (filteredChildren.length > 0) {
        filtered.push({
          key: item.key,
          label: item.label,
          children: filteredChildren.map(child => ({
            key: child.key,
            label: child.label,
          })),
        })
      }
    } else if (!item.permissionId || userPermissions.includes(item.permissionId)) {
      // 권한이 없거나 사용자가 해당 권한을 가진 경우
      filtered.push({
        key: item.key,
        label: item.label,
      })
    }
    
    return filtered
  }, [])
}

// 기본 메뉴 아이템 (권한 체크 없이 모든 메뉴 표시)
export const menuItems: MenuItem[] = menuItemsWithPermissions.map(item => ({
  key: item.key,
  label: item.label,
  children: item.children?.map(child => ({
    key: child.key,
    label: child.label,
  })),
}))
