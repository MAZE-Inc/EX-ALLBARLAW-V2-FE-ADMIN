import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import NotFound from '../pages/NotFound'
import MainLayout from '../pages/layout/mainLayout/MainLayout'
import { ROUTE_PATH } from './routePath'
import {
  AdBannerLayout,
  AdLawyerListPage,
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
  LawyerDetailPage,
  BlogEditor,
  VideoEditor,
  LegalTermListPage,
  LegalTermErrorReportList,
  LegalTermDetail,
  LegalTermEdit,
  LawyerEditPage,
  AdLawfirmLayout,
  AdLawfirmListPage,
  AdLawfirmEditPage,
  AdLawyerEditPage,
  MainBannerListPage,
  CategoryBannerListPage,
  SubCategoryBannerListPage,
} from '@/pages'
import LoginPage from '@/pages/login/LoginPage'
import AdminLayout from '@/pages/admin/adminLayout/AdminLayout'
import MemberLayout from '@/pages/member/memberLayout/MemberLayout'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'
import RootRedirect from './RootRedirect'
import MainBannerEditPage from '@/pages/ad/adBanner/mainBannerEdit/MainBannerEditPage'
import CategoryBannerEditPage from '@/pages/ad/adBanner/categoryBannerEdit/CategoryBannerEditPage'
import SubCategoryBannerEditPage from '@/pages/ad/adBanner/subCategoryBannerEdit/SubCategoryBannerEditPage'

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
        index: true,
        element: <RootRedirect />,
      },
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
          {
            path: `${ROUTE_PATH.ADMIN_REGISTER}/:adminId`,
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
        children: [
          {
            path: '',
            element: <LawyerLayout />,
            children: [
              {
                path: '',
                element: <LawyerListPage />,
              },
            ],
          },
          {
            path: ROUTE_PATH.LAWYER_DETAIL,
            element: <LawyerDetailPage />,
          },
          {
            path: ROUTE_PATH.LAWYER_EDIT,
            element: <LawyerEditPage />,
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
              {
                path: 'edit',
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
              {
                path: 'edit',
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
        children: [
          {
            path: '',
            element: <LegalTermListPage />,
          },
          {
            path: 'error-report',
            element: <LegalTermErrorReportList />,
          },
          {
            path: ROUTE_PATH.BOARD_LEGAL_DICTIONARY_EDIT,
            element: <LegalTermEdit />,
          },
          {
            path: `${ROUTE_PATH.BOARD_LEGAL_DICTIONARY_EDIT}/:termId`,
            element: <LegalTermEdit />,
          },
          {
            path: ':termId',
            element: <LegalTermDetail />,
          },
        ],
      },
      {
        path: ROUTE_PATH.AD_LAWFIRM,
        element: <AdLawfirmLayout />,
        children: [
          {
            path: '',
            element: <AdLawfirmListPage />,
          },
        ],
      },
      {
        path: ROUTE_PATH.AD_LAWFIRM_CREATE,
        element: <AdLawfirmEditPage />,
      },
      {
        path: `${ROUTE_PATH.AD_LAWFIRM}/edit/:lawfirmId`,
        element: <AdLawfirmEditPage />,
      },
      {
        path: ROUTE_PATH.AD_LAWYER,
        element: <AdLawyerListPage />,
      },
      {
        path: ROUTE_PATH.AD_LAWYER_CREATE,
        element: <AdLawyerEditPage />,
      },
      {
        path: `${ROUTE_PATH.AD_LAWYER}/edit/:lawyerAdId`,
        element: <AdLawyerEditPage />,
      },
      {
        path: ROUTE_PATH.AD_BANNER,
        element: <AdBannerLayout />,
        children: [
          {
            path: '',
            element: <MainBannerListPage />,
          },
          {
            path: 'main-banner/create',
            element: <MainBannerEditPage />,
          },
          {
            path: 'main-banner/:mainBannerId',
            element: <MainBannerEditPage />,
          },
          {
            path: ROUTE_PATH.AD_BANNER_CATEGORY,
            element: <CategoryBannerListPage />,
          },
          {
            path: 'category-banner/create',
            element: <CategoryBannerEditPage />,
          },
          {
            path: 'category-banner/:categoryBannerId',
            element: <CategoryBannerEditPage />,
          },
          {
            path: ROUTE_PATH.AD_BANNER_SUB_CATEGORY,
            element: <SubCategoryBannerListPage />,
          },
          {
            path: 'sub-category-banner/create',
            element: <SubCategoryBannerEditPage />,
          },
          {
            path: 'sub-category-banner/:subCategoryBannerId',
            element: <SubCategoryBannerEditPage />,
          },
        ],
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
