import React from 'react'
import { Navigate } from 'react-router-dom'
import { TOKEN_KEY } from '@/constants/token'
import { ROUTE_PATH } from './routePath'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)

  if (!token) {
    // 토큰이 없으면 로그인 페이지로 리디렉션
    return <Navigate to={ROUTE_PATH.LOGIN} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
