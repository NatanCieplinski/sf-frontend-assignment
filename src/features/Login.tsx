import { Button } from '../components/button'
import { useAuth } from '../providers/AuthProvider'

export const Login = () => {
  const { login } = useAuth()

  console.log('rendering')

  return (
    <div className="flex flex-col gap-8 justify-center items-center w-full h-screen">
      <Button type="button" onClick={() => login()}>
        Login
      </Button>
    </div>
  )
}
