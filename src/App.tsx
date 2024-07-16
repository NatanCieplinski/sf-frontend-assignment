import { LogOutIcon } from 'lucide-react'
import { Button } from './components/button'
import { useAuth } from './providers/AuthProvider'

function App() {
  const { user, logout } = useAuth()

  return (
    <div className="flex flex-col gap-8 p-20  h-screen">
      {user && (
        <div className="flex justify-between w-full">
          <div className="text-2xl font-bold">Welcome {user.name}</div>
          <Button onClick={() => logout()}>
            <LogOutIcon />
          </Button>
        </div>
      )}
    </div>
  )
}

export default App
