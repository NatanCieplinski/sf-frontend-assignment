import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../components/button'
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
    <div className="flex flex-col gap-8 justify-center items-center w-full h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button>Login</Button>
        </form>
      </Form>
    </div>
  )
}
