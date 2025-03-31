import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { HandCoins, MessageSquareMore, ReceiptText, Settings2, Upload } from "lucide-react"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/Components/ui/carousel"

const Rejected = () => {
  const { requests } = usePage().props
  const [search, setSearch] = useState("");
  const formatDateTime = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })
  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(parseFloat(amount))
  const [openShow, setOpenShow] = useState(false)
  const [show, setShow] = useState([])
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const { data, errors, processing, setData, post, reset, clearErrors } = useForm({
    payment_id: null,
    request_number: "",
    reference_number: "",
    receipt: null
  })
  const [payment, setPayment] = useState(null)
  const [openRepay, setOpenRepay] = useState(false)
  const [tab, setTab] = useState("1")
  const [previewReceipt, setPreviewReceipt] = useState(null)

  const handleOpen = (message) => {
    if (message) {
      setMessage(message)
    } else {
      setMessage("")
    }
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

  const handleOpenRepay = (request) => {
    if (request) {
      setData({
        payment_id: request.payment.id,
        request_number: request.request_number
      })
      setPayment(request.payment.payment_method)
    } else {
      reset()
      setPayment(null)
    }
    clearErrors()
    setOpenRepay(!openRepay)
    setTab("1")
  }

  const searchTimeoutRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      router.get(route('client.payment.transaction.rejected'), { search: value }, { preserveState: true });
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

  const handlePay = () => {
    post(route('client.published.document.repay'), {
      onSuccess: () => {
        handleOpenRepay()
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
                        <DropdownMenuItem onClick={() => handleOpen(request.payment.message)} className="cursor-pointer">
                          <MessageSquareMore />Show Message
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenRepay(request)} className="cursor-pointer">
                          <HandCoins />Repay
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

      <Dialog open={open} onOpenChange={() => handleOpen()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message</DialogTitle>
          </DialogHeader>
          <Textarea value={message} readOnly />
        </DialogContent>
      </Dialog>

      <Dialog open={openRepay} onOpenChange={() => handleOpenRepay()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay with {payment?.name}</DialogTitle>
          </DialogHeader>
          {tab === '1' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Account Name</Label>
                  <Input value={payment?.account_name} readOnly />
                </div>
                <div className="space-y-1">
                  <Label>Account Number</Label>
                  <Input value={payment?.account_number} readOnly />
                </div>
              </div>
              {payment?.qr_code && (
                <div className="max-w-[250px] mx-auto h-[300px]">
                  <img src={`/storage/journal/qr_codes/${payment?.qr_code}`} className="object-contain h-full w-full" />
                </div>
              )}
            </>
          )}
          {tab === '2' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Reference Number</Label>
                <Input value={data.reference_number} onChange={(e) => setData('reference_number', e.target.value)} />
                <InputError message={errors.reference_number} />
              </div>
              <div className="space-y-1">
                <Label>Upload Receipt</Label>
                <div className=" flex items-center space-x-4 rounded-md border p-4">
                  <ReceiptText />
                  <div className="flex-1">
                    {data.receipt ? (
                      <p className="text-sm font-medium leading-none">
                        {data.receipt.name}
                      </p>
                    ) : (
                      <p className="text-sm font-medium leading-none">
                        No file chosen
                      </p>
                    )}
                  </div>
                  <Button onClick={() => document.getElementById("receipt").click()} size="icon" variant="ghost">
                    <Upload />
                  </Button>
                </div>
                <input accept=".jpg,.jpeg,.png" id="receipt" type="file" onChange={(e) => {
                  const file = e.target.files[0];
                  setData('receipt', file)
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setPreviewReceipt(imageUrl);
                  } else {
                    setPreviewReceipt(null)
                  }
                }} hidden />
                <InputError message={errors.receipt} />
              </div>
              {previewReceipt && (
                <div className="max-w-[250px] mx-auto h-[300px]">
                  <img src={previewReceipt} className="object-contain h-full w-full" />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {tab === '1' && (
              <Button onClick={() => setTab('2')}>
                Next
              </Button>
            )}
            {tab === '2' && (
              <>
                <Button variant="ghost" onClick={() => setTab('1')}>
                  Back
                </Button>
                <Button onClick={handlePay} disabled={processing}>
                  Pay
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

Rejected.layout = page => <AuthenticatedLayout children={page} title="Rejected Payment Transactions" />

export default Rejected