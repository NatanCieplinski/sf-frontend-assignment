import { Toaster } from '@/components/sonner'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ReactNode, useEffect, useState } from 'react'
import { Outlet, createBrowserRouter, useNavigate } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { App } from '../features/App'
import { Login } from '../features/Login'
import { Register } from '../features/Register'
import { AuthProvider } from '../providers/AuthProvider'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const listener = onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        navigate('/login')
      }

      setIsLoading(false)
    })

    return () => listener()
  }, [navigate])

  if (isLoading) return null

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
        <Toaster />
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
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
])
