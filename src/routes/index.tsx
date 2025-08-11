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
  CategoryManagementPage,
  ChatListPage,
  KnowledgePage,
  KnowledgeList,
  KnowledgeDetail,
  LawyerLayout,
  LegalDictionaryPage,
  MemberPage,
  NoticeDetailPage,
  StatisticsPage,
  VideoPage,
  VideoList,
  VideoDetail,
  NoticeEditPage,
  NoticeListPage,
  FaqLayout,
  FaqListPage,
  FaqDetailPage,
  FaqEditPage,
  NoticeLayout,
  CategoryLayout,
  MemberDetailPage,
  LawyerMemberLayout,
  LawyerMemberPage,
  ContentLayout,
  BlogDetail,
  BlogPage,
  BlogList,
  LawyerListPage,
  BlogEditor,
  VideoEditor,
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
        element: <CategoryLayout />,
        children: [
          {
            path: '',
            element: <CategoryManagementPage />,
          },
        ],
      },
      {
        path: ROUTE_PATH.LAWYER_MANAGEMENT,
        element: <LawyerLayout />,
        children: [
          {
            path: '',
            element: <LawyerListPage />,
          },
        ],
      },
      {
        path: ROUTE_PATH.MEMBER,
        element: <MemberLayout />,
        children: [
          {
            path: '',
            element: <MemberPage />,
          },
          {
            path: ':memberId',
            element: <MemberDetailPage />,
          },
        ],
      },
      {
        path: ROUTE_PATH.CONTENT,
        element: <ContentLayout />,
        children: [
          {
            path: ROUTE_PATH.CONTENT_BLOG,
            element: <BlogPage />,
            children: [
              {
                path: '',
                element: <BlogList />,
              },
              {
                path: ':subCategoryId',
                element: <BlogList />,
              },
              {
                path: ':subCategoryId/:blogCaseId',
                element: <BlogDetail />,
              },
              {
                path: ':subCategoryId/edit',
                element: <BlogEditor />,
              },
            ],
          },
          {
            path: ROUTE_PATH.CONTENT_VIDEO,
            element: <VideoPage />,
            children: [
              {
                path: '',
                element: <VideoList />,
              },
              {
                path: ':subCategoryId',
                element: <VideoList />,
              },
              {
                path: ':subCategoryId/:videoCaseId',
                element: <VideoDetail />,
              },
              {
                path: ':subCategoryId/edit',
                element: <VideoEditor />,
              },
            ],
          },
          {
            path: ROUTE_PATH.CONTENT_KNOWLEDGE,
            element: <KnowledgePage />,
            children: [
              {
                path: '',
                element: <KnowledgeList />,
              },
              {
                path: ':subCategoryId',
                element: <KnowledgeList />,
              },
              {
                path: ':subCategoryId/:knowledgeId',
                element: <KnowledgeDetail />,
              },
            ],
          },
        ],
      },
      {
        path: ROUTE_PATH.CHAT_LIST,
        element: <ChatListPage />,
      },
      {
        path: ROUTE_PATH.LAWYER_MEMBER,
        element: <LawyerMemberLayout />,
        children: [
          {
            path: '',
            element: <LawyerMemberPage />,
          },
        ],
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
