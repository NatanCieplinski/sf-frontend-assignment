import {
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  deleteUser,
  getAdditionalUserInfo,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { auth, db } from '../config/firebase'

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
    console.log(userCredential)

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

      const uid = response.user?.uid
      await setDoc(doc(db, 'users', uid), { email })

      processAuthentication(response)
    } catch (error) {
      const auth = getAuth()
      const user = auth.currentUser

      if (user) {
        deleteUser(user)
      }

      console.log({ error })

      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use', { duration: 8000 })
      } else {
        toast.error('Error registering', { duration: 8000 })
      }
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
