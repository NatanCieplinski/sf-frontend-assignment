import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { ClipboardCheck, ClipboardCopy, LogOutIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { StringParam, useQueryParams } from 'use-query-params'
import { useCopyToClipboard, useMediaQuery } from 'usehooks-ts'
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '../components/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/form'
import { Input } from '../components/input'
import { Textarea } from '../components/textarea'
import { auth, db } from '../config/firebase'
import { queryClient } from '../config/react-query'
import { useAuth } from '../providers/AuthProvider'

export const App = () => {
  const { logout } = useAuth()

  return (
    <div className="flex overflow-hidden flex-col gap-8 px-8 pt-8 h-screen md:px-14 md:pt-14 lg:px-20 lg:pt-20">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold">My Quotes</h1>
        <Button
          onClick={() => logout()}
          data-testid="logout"
          size="icon"
          variant="ghost"
        >
          <LogOutIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-10 h-full md:grid md:grid-cols-2">
        <div className="overflow-hidden order-2 h-[calc(100%-152px)] md:order-1 md:h-[calc(100%-72px)]">
          <QuoteSection />
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

const QuoteSection = () => {
  const [queryParam, setQueryParam] = useQueryParams({
    search: StringParam,
  })

  const quoteListQuery = useQuery({
    queryKey: ['quotes', queryParam.search],
    queryFn: async (): Promise<Quote[]> => {
      const searchKeywords = queryParam?.search?.split(' ') ?? []

      const quoteDocuments = await getDocs(
        collection(db, 'users', auth.currentUser!.uid, 'quotes')
      )

      const quotes = quoteDocuments.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Quote[]

      const filteredQuotes = quotes.filter((quote) =>
        searchKeywords.some((keyword) => {
          const lowerCaseKeyword = keyword.toLowerCase()
          return (
            quote.content.toLowerCase().includes(lowerCaseKeyword) ||
            quote.author.toLowerCase().includes(lowerCaseKeyword)
          )
        })
      )

      return searchKeywords.length > 0 ? filteredQuotes : quotes
    },
  })

  return (
    <div className="flex flex-col gap-4 h-full">
      <Input
        placeholder="Search quotes"
        className="w-full"
        onChange={(e) => {
          if (e.target.value === '') return setQueryParam({ search: null })
          setQueryParam({ search: e.target.value })
        }}
        data-testid="search-filter"
      />
      {quoteListQuery.data && (
        <div className="flex overflow-scroll flex-col gap-4 pb-8 h-full md:pb-14 lg:pb-20 no-scrollbar">
          {quoteListQuery.data.map((quote) => (
            <QuoteBox key={quote.id} quote={quote} />
          ))}
        </div>
      )}
    </div>
  )
}

const QuoteBox = ({ quote }: { quote: Quote }) => {
  const [_, copy] = useCopyToClipboard()

  const [wasCopied, setWasCopied] = useState(false)

  const textToCopy = `${quote.content}\n( ${quote.author} )`
  const handleCopy = () => {
    copy(textToCopy)
    setWasCopied(true)
    setTimeout(() => setWasCopied(false), 4000)
  }

  return (
    <div className="flex items-center rounded-md border">
      <div className="flex flex-col gap-2 py-2 px-4 w-full">
        <p
          className="text-sm italic"
          data-testid="quote-content"
        >{`"${quote.content}"`}</p>
        <div className="flex justify-between items-end w-full text-sm font-semibold text-gray-500">
          <p data-testid="quote-author">{`— ${quote.author}`}</p>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={handleCopy}
            data-testid="copy-quote"
          >
            {wasCopied ? (
              <ClipboardCheck className="w-4 h-4" />
            ) : (
              <ClipboardCopy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

const createQuoteSchema = z.object({
  content: z.string().min(1),
  author: z.string().optional(),
})

type CreateQuoteForm = z.infer<typeof createQuoteSchema>

const CreateQuoteForm = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

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

  if (!isDesktop) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="w-full">Add Quote</Button>
        </DrawerTrigger>
        <DrawerContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="px-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea id="content" {...field} />
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
              </div>
              <DrawerFooter className="flex flex-col">
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full" type="button">
                    Cancel
                  </Button>
                </DrawerClose>
                <Button type="submit" variant="secondary" className="w-full">
                  Create
                </Button>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full"
        data-testid="create-quote-form"
      >
        <Card>
          <CardHeader>
            <CardTitle>Add Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea id="content" {...field} />
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
