import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useRef, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { router, useForm, usePage } from "@inertiajs/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from "sonner"
import { Badge } from "@/Components/ui/badge"
import InputError from "@/Components/input-error"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, MessageSquareMore, MoreHorizontal, Send, Upload } from "lucide-react"
import { Textarea } from "@/Components/ui/textarea"
import Word from '../../../../../../public/images/word.png'

const Rejected = () => {
  const { requests } = usePage().props
  const [search, setSearch] = useState("");
  const formatDateTime = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })
  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(parseFloat(amount))
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const { data, processing, errors, post, reset, setData, setError } = useForm({
    id: null,
    uploaded_file: null
  })
  const [openSubmit, setOpenSubmit] = useState(false)

  const handleOpenSubmit = (id) => {
    if (id) {
      setData('id', id)
    } else {
      reset()
    }
    setOpenSubmit(!openSubmit)
    setError({ uploaded_file: null })
  }

  const handleOpen = (message) => {
    if (message) {
      setMessage(message)
    } else {
      setMessage("")
    }
    setOpen(!open)
  }

  const searchTimeoutRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      router.get(route('client.my.request.rejected'), { search: value }, { preserveState: true });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handlePage = (url) => {
    router.get(url, {}, { preserveState: true })
  }

  const handleResubmit = () => {
    post(route('client.my.request.resubmit.request'), {
      onSuccess: () => {
        handleOpenSubmit()
      }
    })
  }

  return (
    <AuthenticatedLayout title="My Rejected Requests">
      <div className='space-y-4'>
        <div className='w-full sm:max-w-xs'>
          <Input value={search} onChange={handleSearch} placeholder="Search" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Request Number</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Uploaded Document</TableHead>
              <TableHead>Date Requested</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.data.length > 0 ? (
              requests.data.map((request, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {request.request_number}
                  </TableCell>
                  <TableCell>
                    {request.service.name}
                  </TableCell>
                  <TableCell>
                    {request.uploaded_file.split('/').pop()}
                  </TableCell>
                  <TableCell>
                    {formatDateTime(request.created_at)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(request.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(route('journal.download', { file: `uploaded_files/${request.uploaded_file}` }), '_blank')} className="cursor-pointer">
                          <Download />Download Document
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpen(request.message)} className="cursor-pointer">
                          <MessageSquareMore />Show Message
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenSubmit(request.id)} className="cursor-pointer">
                          <Send />Resubmit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {search ? `No matching found for "${search}"` : "No data available."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {requests.data.length > 0 && (
          <div className='flex justify-end'>
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePage(requests.prev_page_url)} className="cursor-pointer" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePage(requests.next_page_url)} className="cursor-pointer" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={() => handleOpen()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message</DialogTitle>
          </DialogHeader>
          <Textarea value={message} />
        </DialogContent>
      </Dialog>

      <Dialog open={openSubmit} onOpenChange={() => handleOpenSubmit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resubmit File</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <div className=" flex items-center space-x-4 rounded-md border p-4">
              <img src={Word} className="size-8" />
              <div className="flex-1 space-y-1">
                {data.uploaded_file ? (
                  <>
                    <p className="text-sm font-medium leading-none">
                      {data.uploaded_file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Word document
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-medium leading-none">
                    No file chosen
                  </p>
                )}
              </div>
              <Button onClick={() => document.getElementById("uploaded_file").click()} size="icon" variant="ghost">
                <Upload />
              </Button>
            </div>
            <input accept=".docx" id="uploaded_file" type="file" onChange={(e) => setData("uploaded_file", e.target.files[0])} hidden />
            <InputError message={errors.uploaded_file} />
          </div>
          <DialogFooter>
            <Button onClick={handleResubmit} disabled={processing}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  )
}

export default Rejected