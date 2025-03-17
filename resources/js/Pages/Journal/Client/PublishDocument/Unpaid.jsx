import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
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
import { useEffect, useRef, useState } from "react"
import { Input } from "@/Components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Banknote, Check, Download, HandCoins, PhilippinePeso, ReceiptText, Settings2, Upload, Wallet, X } from "lucide-react"
import { Button } from "@/Components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/Components/ui/label"
import InputError from "@/Components/input-error"

const Unpaid = () => {
  const { requests, payments } = usePage().props
  const [search, setSearch] = useState("");
  const formatDateTime = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })
  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(parseFloat(amount))
  const [open, setOpen] = useState(false)
  const { data, errors, processing, setData, post, reset, setError } = useForm({
    id: null,
    payment_method_id: null,
    type: null,
    reference_number: "",
    receipt: null
  })
  const [tab, setTab] = useState("1")
  const payment = payments.find(payment => payment.id === data.payment_method_id)
  const [previewReceipt, setPreviewReceipt] = useState(null)

  const handleOpen = (id) => {
    if (id) {
      setData('id', id)
    } else {
      reset()
      setPreviewReceipt(null)
    }
    setError({ reference_number: null, receipt: null })
    setOpen(!open)
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
      router.get(route('client.published.document.unpaid'), { search: value }, { preserveState: true });
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
    post(route('client.published.document.pay'), {
      onSuccess: () => {
        handleOpen()
      }
    })
  }

  return (
    <AuthenticatedLayout title="Unpaid Published Documents">
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
              <TableHead>Published Document</TableHead>
              <TableHead>Published At</TableHead>
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
                    {request.assign_editor.published_file.split('/').pop()}
                  </TableCell>
                  <TableCell>
                    {formatDateTime(request.assign_editor.published_at)}
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
                        <DropdownMenuItem onClick={() => handleOpen(request.id)} className="cursor-pointer">
                          <HandCoins />Pay
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
        <DialogContent className="max-h-full overflow-y-auto">
          <DialogHeader>
            {tab === '1' && <DialogTitle>Select Payment Method</DialogTitle>}
            {tab === '2' && (
              <>
                {data.type === 'cash' && (
                  <>
                    <DialogTitle>Pay with Cash</DialogTitle>
                    <DialogDescription>Note: You must pay in cash at the DITADS office.</DialogDescription>
                  </>
                )}
                {data.type === 'e-wallet' && (
                  <DialogTitle>Select E-Wallet</DialogTitle>
                )}
              </>
            )}
            {tab === '3' && <DialogTitle>Pay with {payment?.name}</DialogTitle>}
          </DialogHeader>
          {tab === '1' && (
            <div className="grid grid-cols-2 gap-6">
              <Card className={`cursor-pointer hover:bg-accent hover:text-accent-foreground ${data.type === 'cash' ? 'ring-2 ring-primary' : ''}`} onClick={() => setData('type', 'cash')}>
                <div className="flex flex-col items-center space-y-2 p-4">
                  <Banknote />
                  <CardTitle>Cash</CardTitle>
                </div>
              </Card>
              <Card className={`cursor-pointer hover:bg-accent hover:text-accent-foreground ${data.type === 'e-wallet' ? 'ring-2 ring-primary' : ''}`} onClick={() => setData('type', 'e-wallet')}>
                <div className="flex flex-col items-center space-y-2 p-4">
                  <Wallet />
                  <CardTitle>E-Wallet</CardTitle>
                </div>
              </Card>
            </div>
          )}
          {tab === '2' && (
            <>
              {data.type === 'cash' && (
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.037637426731!2d124.59567327352237!3d8.49572149711157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fff3bb5ad3a1dd%3A0xd7dd14c89de28c9b!2sMetro%20Square!5e0!3m2!1sen!2sph!4v1742094579878!5m2!1sen!2sph" width="100%" height="300" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              )}
              {data.type === 'e-wallet' && (
                <div className="space-y-4">
                  <Select value={data.payment_method_id || ''} onValueChange={(val) => setData('payment_method_id', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {payments.map((payment, index) => (
                        <SelectItem key={index} value={payment.id}>
                          {payment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {data.payment_method_id && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label>Account Name</Label>
                          <Input value={payment?.account_name} />
                        </div>
                        <div className="space-y-1">
                          <Label>Account Number</Label>
                          <Input value={payment?.account_number} />
                        </div>
                      </div>
                      {payment?.qr_code && (
                        <div className="max-w-[250px] mx-auto h-[300px]">
                          <img src={`/storage/journal/qr_codes/${payment?.qr_code}`} className="object-contain h-full w-full" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
          {tab === '3' && (
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
          {data.type && (
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
                  {data.type === 'e-wallet' && (
                    <>
                      {data.payment_method_id && (
                        <Button onClick={() => setTab('3')}>
                          Next
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}
              {tab === '3' && (
                <>
                  <Button variant="ghost" onClick={() => setTab('2')}>
                    Back
                  </Button>
                  <Button onClick={handlePay} disabled={processing}>
                    Pay
                  </Button>
                </>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

    </AuthenticatedLayout>
  )
}

export default Unpaid