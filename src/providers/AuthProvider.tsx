import {
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { auth } from '../config/firebase'

export type UserInfo = {
  name: string
  surname: string
  email: string
}

const AuthContext = createContext<{
  user: UserInfo | null
  login: (email: string, password: string) => void
  register: (email: string, password: string) => void
  logout: () => void
} | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserInfo | null>(null)

  const processAuthentication = (userCredential: UserCredential) => {
    const credential = GoogleAuthProvider.credentialFromResult(userCredential)
    const userInfo = getAdditionalUserInfo(userCredential)

    console.log(credential, userInfo)

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
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password)
      processAuthentication(response)
    } catch {
      toast.error('Error logging in', { duration: Infinity })
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      processAuthentication(response)
    } catch {
      toast.error('Error registering', { duration: Infinity })
    }
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
      return
    }

    setUser(JSON.parse(user))
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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
