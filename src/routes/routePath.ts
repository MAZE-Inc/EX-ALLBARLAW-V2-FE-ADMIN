export const ROUTE_PATH = {
  // 로그인
  LOGIN: '/login',

  // 관리자 계정
  ADMIN_MANAGEMENT: '/admin-management',
  ADMIN_REGISTER: 'register',

  // 분류 설정
  CATEGORY_MANAGEMENT: '/category-management',

  // 회원관리
  MEMBER: '/member-member',
  LAWYER_MEMBER: '/member-lawyer',

  // 변호사 관리
  LAWYER_MANAGEMENT: '/lawyer-management',
  LAWYER_DETAIL: 'lawyer/:lawyerId',
  LAWYER_EDIT: 'lawyer/edit/:lawyerId',

  // 분류별 컨텐츠 관리
  CONTENT: '/content',
  CONTENT_BLOG: 'content-blog',
  CONTENT_VIDEO: 'content-video',
  CONTENT_KNOWLEDGE: 'content-knowledge',
  CONTENT_BLOG_EDIT: 'blog-edit',
  CONTENT_VIDEO_EDIT: 'video-edit',

  // 채팅상담
  CHAT_LIST: '/chat-list',

  // 게시판
  BOARD_NOTICE: '/board-notice',
  BOARD_NOTICE_LIST: 'list',
  BOARD_NOTICE_EDIT: 'edit',

  BOARD_FAQ: '/board-faq',
  BOARD_FAQ_EDIT: 'edit',
  BOARD_LEGAL_DICTIONARY: '/board-legalDictionary',
  BOARD_LEGAL_DICTIONARY_EDIT: 'edit',

  // 광고 관리
  AD_LAWFIRM: '/ad-lawfirm',
  AD_LAWFIRM_LIST: 'list',

  AD_LAWFIRM_CREATE: '/ad-lawfirm/create',

  AD_LAWYER: '/ad-lawyer',
  AD_LAWYER_CREATE: '/ad-lawyer/create',
  AD_BANNER: '/ad-banner',

  // 통계
  STATISTICS_LIST: '/statistics-list',
} as const
