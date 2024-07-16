import { ReactNode } from 'react'
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import App from '../App'
import { Login } from '../features/Login'
import { AuthProvider, useAuth } from '../providers/AuthProvider'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </QueryParamProvider>
    ),
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
])