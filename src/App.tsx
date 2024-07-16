import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithPopup,
} from 'firebase/auth'
import { useState } from 'react'
import { Button } from './components/button'
import { auth, provider } from './config/firebase'
import logo from './logo.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen text-white bg-gray-800">
      <img src={logo} className="w-[600px] animate-spin-slow" alt="logo" />
      <h1 className="text-6xl font-bold">Hello Vite + React + Tailwind!</h1>
      <Button
        type="button"
        variant="destructive"
        onClick={() =>
          signInWithPopup(auth, provider).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const userInfo = getAdditionalUserInfo(result)

            console.log(credential)
            console.log(userInfo)
          })
        }
      >
        Login
      </Button>
      <p>
        Edit <code className="p-1 bg-gray-600 rounded-md">App.tsx</code> and
        save to test HMR updates.
      </p>
      <p className="text-sky-500">
        <a
          className="hover:text-sky-700 underline"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {' | '}
        <a
          className="hover:text-sky-700 underline"
          href="https://vitejs.dev/guide/features.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vite Docs
        </a>
        {' | '}
        <a
          className="hover:text-sky-700 underline"
          href="https://tailwindcss.com/docs/installation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tailwind Docs
        </a>
      </p>
    </div>
  )
}

export default App
