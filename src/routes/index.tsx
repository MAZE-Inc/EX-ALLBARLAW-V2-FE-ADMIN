import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import NotFound from '../pages/NotFound'
import MainLayout from '../pages/layout/mainLayout/MainLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [],
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}
