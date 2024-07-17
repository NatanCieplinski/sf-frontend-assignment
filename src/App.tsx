import { LogOutIcon } from 'lucide-react'
import { Button } from './components/button'
import { useAuth } from './providers/AuthProvider'

function App() {
  const { user, logout } = useAuth()

  return (
    <div className="flex flex-col gap-8 p-20  h-screen">
      {user && (
        <div className="flex justify-between w-full">
          <h1 className="text-2xl font-bold">My Quotes</h1>
          <Button onClick={() => logout()} data-testid="logout">
            <LogOutIcon />
          </Button>
        </div>
      )}
    </div>
  )
}

export default App
