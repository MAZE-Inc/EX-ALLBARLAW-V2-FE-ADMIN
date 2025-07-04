export interface LoginCredentials {
  adminAccount: string
  adminPassword: string
  remember?: boolean
}

export interface AuthResponse {
  accessToken: string
  // NOTE: 필요에 따라 다른 사용자 정보나 토큰 정보를 추가할 수 있습니다.
}
