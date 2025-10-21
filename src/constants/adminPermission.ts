// 권한 ID 상수
export const ADMIN_PERMISSION_IDS = {
  ADMIN_ACCOUNT_LIST: 1,
  ACCOUNT_REGISTER: 2,
  CATEGORY_MANAGEMENT: 3,
  MEMBER_GENERAL: 4,
  MEMBER_LAWYER: 5,
  LAWYER_LIST: 6,
  CONTENT_BLOG: 7,
  CONTENT_VIDEO: 8,
  CONTENT_KNOWLEDGE: 9,
  CHAT_LIST: 10,
  BOARD_NOTICE: 11,
  BOARD_FAQ: 12,
  BOARD_DICTIONARY: 13,
  AD_LAWFIRM: 14,
  AD_BANNER: 15,
  AD_LAWYER: 16,
  STATISTICS: 17,
} as const

// 권한 이름
export const ADMIN_PERMISSION_NAMES = {
  [ADMIN_PERMISSION_IDS.ADMIN_ACCOUNT_LIST]: '관리자 계정 목록',
  [ADMIN_PERMISSION_IDS.ACCOUNT_REGISTER]: '계정 등록',
  [ADMIN_PERMISSION_IDS.CATEGORY_MANAGEMENT]: '대/소분류 관리',
  [ADMIN_PERMISSION_IDS.MEMBER_GENERAL]: '일반 회원',
  [ADMIN_PERMISSION_IDS.MEMBER_LAWYER]: '변호사 회원',
  [ADMIN_PERMISSION_IDS.LAWYER_LIST]: '변호사 리스트',
  [ADMIN_PERMISSION_IDS.CONTENT_BLOG]: '법률정보 글',
  [ADMIN_PERMISSION_IDS.CONTENT_VIDEO]: '변호사의 영상',
  [ADMIN_PERMISSION_IDS.CONTENT_KNOWLEDGE]: '법률 지식인',
  [ADMIN_PERMISSION_IDS.CHAT_LIST]: '채팅리스트',
  [ADMIN_PERMISSION_IDS.BOARD_NOTICE]: '공지사항',
  [ADMIN_PERMISSION_IDS.BOARD_FAQ]: 'FAQ',
  [ADMIN_PERMISSION_IDS.BOARD_DICTIONARY]: '법률 사전',
  [ADMIN_PERMISSION_IDS.AD_LAWFIRM]: '로펌 광고',
  [ADMIN_PERMISSION_IDS.AD_BANNER]: '배너 광고',
  [ADMIN_PERMISSION_IDS.AD_LAWYER]: '변호사 광고',
  [ADMIN_PERMISSION_IDS.STATISTICS]: '통계 바로가기',
} as const

// 권한 그룹
export const ADMIN_PERMISSION_GROUPS = {
  ADMIN_ACCOUNT: {
    name: '관리자 계정',
    key: 'admin',
    permissions: [ADMIN_PERMISSION_IDS.ADMIN_ACCOUNT_LIST, ADMIN_PERMISSION_IDS.ACCOUNT_REGISTER],
  },
  CATEGORY: {
    name: '분류 설정',
    key: 'category',
    permissions: [ADMIN_PERMISSION_IDS.CATEGORY_MANAGEMENT],
  },
  MEMBER: {
    name: '회원관리',
    key: 'member',
    permissions: [ADMIN_PERMISSION_IDS.MEMBER_GENERAL, ADMIN_PERMISSION_IDS.MEMBER_LAWYER],
  },
  LAWYER: {
    name: '변호사 관리',
    key: 'lawyer',
    permissions: [ADMIN_PERMISSION_IDS.LAWYER_LIST],
  },
  CONTENT: {
    name: '분류별 컨텐츠 관리',
    key: 'content',
    permissions: [
      ADMIN_PERMISSION_IDS.CONTENT_BLOG,
      ADMIN_PERMISSION_IDS.CONTENT_VIDEO,
      ADMIN_PERMISSION_IDS.CONTENT_KNOWLEDGE,
    ],
  },
  CHAT: {
    name: '채팅상담',
    key: 'chat',
    permissions: [ADMIN_PERMISSION_IDS.CHAT_LIST],
  },
  BOARD: {
    name: '게시판',
    key: 'board',
    permissions: [
      ADMIN_PERMISSION_IDS.BOARD_NOTICE,
      ADMIN_PERMISSION_IDS.BOARD_FAQ,
      ADMIN_PERMISSION_IDS.BOARD_DICTIONARY,
    ],
  },
  AD: {
    name: '광고 관리',
    key: 'ad',
    permissions: [ADMIN_PERMISSION_IDS.AD_LAWFIRM, ADMIN_PERMISSION_IDS.AD_BANNER, ADMIN_PERMISSION_IDS.AD_LAWYER],
  },
  STATISTICS: {
    name: '통계',
    key: 'statistics',
    permissions: [ADMIN_PERMISSION_IDS.STATISTICS],
  },
} as const

// 권한 ID로 그룹 키 찾기
export const getGroupKeyByPermissionId = (permissionId: number): string | null => {
  for (const group of Object.values(ADMIN_PERMISSION_GROUPS)) {
    if ((group.permissions as readonly number[]).includes(permissionId)) {
      return group.key
    }
  }
  return null
}

// 사용자가 특정 그룹에 접근 가능한지 확인
export const hasGroupAccess = (userPermissions: number[], groupKey: string): boolean => {
  const group = Object.values(ADMIN_PERMISSION_GROUPS).find(g => g.key === groupKey)
  if (!group) return false

  return group.permissions.some(permissionId => userPermissions.includes(permissionId))
}

// 사용자가 특정 권한을 가지고 있는지 확인
export const hasPermission = (userPermissions: number[], permissionId: number): boolean => {
  return userPermissions.includes(permissionId)
}

// 권한 ID별 기본 경로 매핑
export const PERMISSION_ROUTE_MAP: Record<number, string> = {
  [ADMIN_PERMISSION_IDS.ADMIN_ACCOUNT_LIST]: '/admin-management',
  [ADMIN_PERMISSION_IDS.ACCOUNT_REGISTER]: '/admin-management/register',
  [ADMIN_PERMISSION_IDS.CATEGORY_MANAGEMENT]: '/category-management',
  [ADMIN_PERMISSION_IDS.MEMBER_GENERAL]: '/member-member',
  [ADMIN_PERMISSION_IDS.MEMBER_LAWYER]: '/member-lawyer',
  [ADMIN_PERMISSION_IDS.LAWYER_LIST]: '/lawyer-management',
  [ADMIN_PERMISSION_IDS.CONTENT_BLOG]: '/content/content-blog',
  [ADMIN_PERMISSION_IDS.CONTENT_VIDEO]: '/content/content-video',
  [ADMIN_PERMISSION_IDS.CONTENT_KNOWLEDGE]: '/content/content-knowledge',
  [ADMIN_PERMISSION_IDS.CHAT_LIST]: '/chat-list',
  [ADMIN_PERMISSION_IDS.BOARD_NOTICE]: '/board-notice',
  [ADMIN_PERMISSION_IDS.BOARD_FAQ]: '/board-faq',
  [ADMIN_PERMISSION_IDS.BOARD_DICTIONARY]: '/board-legalDictionary',
  [ADMIN_PERMISSION_IDS.AD_LAWFIRM]: '/ad-lawfirm',
  [ADMIN_PERMISSION_IDS.AD_BANNER]: '/ad-banner',
  [ADMIN_PERMISSION_IDS.AD_LAWYER]: '/ad-lawyer',
  [ADMIN_PERMISSION_IDS.STATISTICS]: '/statistics-list',
} as const
