import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog"
import { useEffect, useRef, useState } from "react"
import { router, useForm, usePage } from "@inertiajs/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination"
import InputError from "@/Components/input-error"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Check, LoaderCircle, ReceiptText, Settings2, X } from "lucide-react"
import { Label } from "@/Components/ui/label"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog"
import { Textarea } from "@/Components/ui/textarea"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/Components/ui/carousel"

const Pending = () => {
  const { requests } = usePage().props
  const [search, setSearch] = useState("");
  const formatDateTime = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })
  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(parseFloat(amount))
  const [openShow, setOpenShow] = useState(false)
  const [show, setShow] = useState([])
  const { data, errors, processing, setData, post, reset, clearErrors } = useForm({
    id: null,
    message: null,
    status: null
  })
  const [open, setOpen] = useState(false)

  const handleOpen = (id, status) => {
    if (id || status) {
      setData({
        id: id,
        status: status
      })
    } else {
      reset()
    }
    clearErrors()
    setOpen(!open)
  }

  const handleOpenShow = (payment) => {
    if (payment) {
      setShow(payment)
    } else {
      setShow([])
    }
    setOpenShow(!openShow)
  }

  const searchTimeoutRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      router.get(route('admin.payment.transaction.pending'), { search: value }, { preserveState: true });
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

  const handleStatus = () => {
    clearErrors()
    post(route('admin.payment.transaction.update.status'), {
      onSuccess: () => {
        handleOpen()
      }
    })
  }

  return (
    <>
      <div className='space-y-4'>
        <div className='w-full sm:max-w-xs'>
          <Input value={search} onChange={handleSearch} placeholder="Search" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Request Number</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Mode of Payment</TableHead>
              <TableHead>Pay At</TableHead>
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
                    {request.user.first_name} {request.user.last_name}
                  </TableCell>
                  <TableCell>
                    {request.service.name}
                  </TableCell>
                  <TableCell>
                    {request.payment.payment_method.name}
                  </TableCell>
                  <TableCell>
                    {formatDateTime(request.payment.created_at)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(request.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <Settings2 />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenShow(request.payment.receipt)} className="cursor-pointer">
                          <ReceiptText />Show Receipt
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpen(request.id, 'approved')} className="cursor-pointer">
                          <Check />Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpen(request.id, 'rejected')} className="cursor-pointer">
                          <X />Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
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

      <Dialog open={openShow} onOpenChange={() => handleOpenShow()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>
          <Carousel>
            <CarouselContent>
              {show?.map((d, i) => (
                <CarouselItem key={i}>
                  <div className="space-y-4 px-2">
                    <div className="space-y-1">
                      <Label>Reference Number</Label>
                      <Input value={d.reference_number} readOnly />
                    </div>
                    <div className="max-w-[250px] mx-auto h-[300px]">
                      <img src={`/storage/journal/receipts/${d.receipt_image}`} className="object-contain h-full w-full" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </DialogContent>
      </Dialog>

      <AlertDialog open={open} onOpenChange={() => {
        if (!processing) {
          handleOpen()
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to {data.status === 'approved' && 'approve' || data.status === 'rejected' && 'reject'}?</AlertDialogTitle>
          </AlertDialogHeader>
          {data.status === 'rejected' && (
            <div className="space-y-1">
              <Label>Please leave a message</Label>
              <Textarea value={data.message} onChange={(e) => setData('message', e.target.value)} />
              <InputError message={errors.message} />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <Button onClick={handleStatus} disabled={processing}>
              {processing && <LoaderCircle className="size-4 animate-spin" />}
              {data.status === 'approved' && 'Approve' || data.status === 'rejected' && 'Reject'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

Pending.layout = page => <AuthenticatedLayout children={page} title="Pending Payment Transactions" />

export default Pending