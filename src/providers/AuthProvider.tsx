import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { ReactNode, createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { auth, db } from '../config/firebase'

export type UserInfo = {
  email: string
}

class FirebaseError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.code = code
  }
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

  const processAuthentication = () => {
    const userInfo = getAuth().currentUser

    const user = {
      email: (userInfo?.email as string) ?? '',
    }

    setUser(user)
    navigate('/')
  }

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      processAuthentication()
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

      processAuthentication()
    } catch (error) {
      const auth = getAuth()
      const user = auth.currentUser

      if (user) {
        deleteUser(user)
      }

      if (
        error instanceof FirebaseError &&
        error.code === 'auth/email-already-in-use'
      ) {
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
