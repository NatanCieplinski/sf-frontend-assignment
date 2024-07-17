import { zodResolver } from '@hookform/resolvers/zod'
import { LogOutIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
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

export const App = () => {
  const { user, logout } = useAuth()

  return (
    <div className="flex flex-col gap-8 p-8 h-screen md:p-14 lg:p-20">
      {user && (
        <div className="flex justify-between w-full">
          <h1 className="text-2xl font-bold">My Quotes</h1>
          <Button onClick={() => logout()} data-testid="logout" size="icon">
            <LogOutIcon className="w-4 h-4" />
          </Button>
        </div>
      )}
      <CreateQuoteForm />
    </div>
  )
}

const createQuoteSchema = z.object({
  content: z.string().min(1),
  author: z.string().optional(),
})

type CreateQuoteForm = z.infer<typeof createQuoteSchema>

const CreateQuoteForm = () => {
  const form = useForm<CreateQuoteForm>({
    defaultValues: {
      content: '',
      author: '',
    },
    resolver: zodResolver(createQuoteSchema),
  })

  const onSubmit = (data: CreateQuoteForm) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:w-[380px]"
      >
        <Card>
          <CardHeader>
            <CardTitle>Create Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Input id="content" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input id="author" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" variant="secondary" className="w-full">
              Create
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
