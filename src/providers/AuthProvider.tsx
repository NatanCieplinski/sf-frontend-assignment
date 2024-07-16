import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { auth, provider } from '../config/firebase'

export type UserInfo = {
  name: string
  surname: string
  email: string
}

const AuthContext = createContext<{
  user: UserInfo | null
  login: () => void
  logout: () => void
} | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<UserInfo | null>(null)

  const login = () => {
    signInWithPopup(auth, provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const userInfo = getAdditionalUserInfo(result)

      console.log(credential)
      console.log(userInfo)

      const user = {
        name: (userInfo?.profile?.given_name as string) ?? '',
        surname: (userInfo?.profile?.family_name as string) ?? '',
        email: (userInfo?.profile?.email as string) ?? '',
      }

      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))

      if (credential?.accessToken) {
        localStorage.setItem('token', credential.accessToken)
      }
      navigate('/')
    })
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (!token || !user) {
      if (location.pathname !== '/login') {
        login()
      }

      return
    }

    setUser(JSON.parse(user))
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
