import { Navigate } from 'react-router-dom'
import { useAdminProfile } from '@/hooks/queries/useAdmin'
import { PERMISSION_ROUTE_MAP } from '@/constants/adminPermission'
import { ROUTE_PATH } from './routePath'

/**
 * 루트 경로(/)에서 사용자의 첫 번째 권한 페이지로 자동 리다이렉트하는 컴포넌트
 */
const RootRedirect = () => {
  const { data: adminProfile, isLoading } = useAdminProfile()

  // 로딩 중이면 빈 화면 표시
  if (isLoading) {
    return null
  }

  // 프로필이 없거나 권한이 없으면 로그인 페이지로
  if (!adminProfile || !adminProfile.adminSubMenus || adminProfile.adminSubMenus.length === 0) {
    return <Navigate to={ROUTE_PATH.LOGIN} replace />
  }

  // 첫 번째 권한의 subMenuId 가져오기
  const firstPermissionId = adminProfile.adminSubMenus[0].subMenuId

  // 권한 ID에 해당하는 경로 찾기
  const targetRoute = PERMISSION_ROUTE_MAP[firstPermissionId]

  // 매핑된 경로가 있으면 해당 경로로, 없으면 관리자 계정 관리로
  return <Navigate to={targetRoute || ROUTE_PATH.ADMIN_MANAGEMENT} replace />
}

export default RootRedirect
