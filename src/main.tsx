import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConfigProvider, message } from 'antd'
import { COLOR } from '@/styles/abstracts/color'
import './styles/main.scss'
import Router from '@/routes'

// antd message와 Modal의 z-index 설정
message.config({
  top: 100,
  duration: 3,
  maxCount: 3,
  prefixCls: 'ant-message',
  getContainer: () => document.body,
})

// Modal.config is deprecated - removed

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5분
      placeholderData: (previousData: unknown) => previousData, // 이전 데이터를 placeholder로 사용
    },
  },
})

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: COLOR.GREEN_01, // #20BF62
        colorPrimaryHover: COLOR.GREEN_HOVER, // #20BF62
      },
    }}
  >
    <QueryClientProvider client={queryClient}>
      <Router />
      {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />} */}
    </QueryClientProvider>
  </ConfigProvider>
  // </StrictMode>
)
