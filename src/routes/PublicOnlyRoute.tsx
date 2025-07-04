import React from 'react'
import { Navigate } from 'react-router-dom'
import { TOKEN_KEY } from '@/constants/token'
import { ROUTE_PATH } from './routePath'

interface PublicOnlyRouteProps {
  children: React.ReactNode
}

const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)

  if (token) {
    // 토큰이 있으면 관리자 메인 페이지로 리디렉션
    return <Navigate to={ROUTE_PATH.ADMIN_MANAGEMENT} replace />
  }

  return <>{children}</>
}

export default PublicOnlyRoute
