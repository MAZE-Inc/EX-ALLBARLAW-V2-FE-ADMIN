import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import NotFound from '../pages/NotFound'
import MainLayout from '../pages/layout/mainLayout/MainLayout'
import { ROUTE_PATH } from './routePath'
import {
  AdBannerPage,
  AdLawfirmPage,
  AdLawyerPage,
  AdminManagementPage,
  AdminRegisterPage,
  BlogPage,
  CategoryManagementPage,
  ChatListPage,
  KnowledgePage,
  LawyerManagementPage,
  LawyerMemberPage,
  LegalDictionaryPage,
  MemberPage,
  NoticeDetailPage,
  StatisticsPage,
  VideoPage,
  NoticeEditPage,
  NoticeListPage,
  FaqLayout,
  FaqListPage,
  FaqDetailPage,
  FaqEditPage,
  NoticeLayout,
} from '@/pages'
import LoginPage from '@/pages/login/LoginPage'
import AdminLayout from '@/pages/admin/adminLayout/AdminLayout'
import MemberLayout from '@/pages/member/memberLayout/MemberLayout'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: ROUTE_PATH.ADMIN_MANAGEMENT,
        element: <AdminLayout />,
        children: [
          {
            path: '',
            element: <AdminManagementPage />,
          },
          {
            path: ROUTE_PATH.ADMIN_REGISTER,
            element: <AdminRegisterPage />,
          },
        ],
      },
      {
        path: ROUTE_PATH.CATEGORY_MANAGEMENT,
        element: <CategoryManagementPage />,
      },
      {
        path: ROUTE_PATH.LAWYER_MANAGEMENT,
        element: <LawyerManagementPage />,
      },
      {
        path: ROUTE_PATH.MEMBER,
        element: <MemberLayout />,
        children: [
          {
            path: '',
            element: <MemberPage />,
          },
        ],
      },
      {
        path: ROUTE_PATH.CONTENT_BLOG,
        element: <BlogPage />,
      },
      {
        path: ROUTE_PATH.CONTENT_VIDEO,
        element: <VideoPage />,
      },
      {
        path: ROUTE_PATH.CONTENT_KNOWLEDGE,
        element: <KnowledgePage />,
      },
      {
        path: ROUTE_PATH.CHAT_LIST,
        element: <ChatListPage />,
      },
      {
        path: ROUTE_PATH.LAWYER_MEMBER,
        element: <LawyerMemberPage />,
      },
      {
        path: ROUTE_PATH.BOARD_NOTICE,
        element: <NoticeLayout />,
        children: [
          {
            path: '',
            element: <NoticeListPage />,
          },
          {
            path: ':noticeId',
            element: <NoticeDetailPage />,
          },
          {
            path: ROUTE_PATH.BOARD_NOTICE_EDIT,
            element: <NoticeEditPage />,
          },
          {
            path: `${ROUTE_PATH.BOARD_NOTICE_EDIT}/:noticeId`,
            element: <NoticeEditPage />,
          },
        ],
      },
      {
        path: ROUTE_PATH.BOARD_FAQ,
        element: <FaqLayout />,
        children: [
          {
            path: '',
            element: <FaqListPage />,
          },
          {
            path: ':faqId',
            element: <FaqDetailPage />,
          },
          {
            path: ROUTE_PATH.BOARD_FAQ_EDIT,
            element: <FaqEditPage />,
          },
          {
            path: `${ROUTE_PATH.BOARD_FAQ_EDIT}/:faqId`,
            element: <FaqEditPage />,
          },
        ],
      },
      {
        path: ROUTE_PATH.BOARD_LEGAL_DICTIONARY,
        element: <LegalDictionaryPage />,
      },
      {
        path: ROUTE_PATH.AD_LAWFIRM,
        element: <AdLawfirmPage />,
      },
      {
        path: ROUTE_PATH.AD_LAWYER,
        element: <AdLawyerPage />,
      },
      {
        path: ROUTE_PATH.AD_BANNER,
        element: <AdBannerPage />,
      },
      {
        path: ROUTE_PATH.STATISTICS_LIST,
        element: <StatisticsPage />,
      },
    ],
  },
  {
    path: ROUTE_PATH.LOGIN,
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}
