import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { LogOutIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
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
import { auth, db } from '../config/firebase'
import { queryClient } from '../config/react-query'
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
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <QuoteList />
        </div>
        <div className="order-1 md:order-2">
          <CreateQuoteForm />
        </div>
      </div>
    </div>
  )
}

type Quote = {
  id: string
  content: string
  author: string
}

const QuoteList = () => {
  const query = useQuery({
    queryKey: ['quotes'],
    queryFn: async (): Promise<Quote[]> => {
      const quoteDocuments = await getDocs(
        collection(db, 'users', auth.currentUser!.uid, 'quotes')
      )
      const quotes = quoteDocuments.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      return quotes as Quote[]
    },
  })

  if (!query.data) return null

  return (
    <div className="flex flex-col gap-4">
      {query.data.map((quote) => (
        <QuoteBox key={quote.id} quote={quote} />
      ))}
    </div>
  )
}

const QuoteBox = ({ quote }: { quote: Quote }) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm italic">{`"${quote.content}"`}</p>
      <p className="flex justify-end w-full text-sm font-semibold text-gray-500">
        {`— ${quote.author}`}
      </p>
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

  const onSubmit = async (data: CreateQuoteForm) => {
    try {
      await addDoc(collection(db, 'users', auth.currentUser!.uid, 'quotes'), {
        content: data.content,
        author: data.author,
      })
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    } catch {
      toast.error('Failed to create quote')
    }
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
