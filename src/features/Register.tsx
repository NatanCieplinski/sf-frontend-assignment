import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../components/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/form'
import { Input } from '../components/input'
import { useAuth } from '../providers/AuthProvider'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type RegisterForm = z.infer<typeof registerSchema>

export const Register = () => {
  const { register } = useAuth()

  const form = useForm<RegisterForm>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterForm) => {
    register(data.email, data.password)
  }

  return (
    <div className="flex flex-col gap-8 justify-center items-center p-2 w-full h-screen bg-gray-900 sm:p-0 xs:p-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full sm:w-[380px]"
        >
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input id="email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input id="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" variant="secondary" className="w-full">
                Register
              </Button>
              <Button variant="link" asChild>
                <Link to="/login" className="text-sm">
                  Login
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}
