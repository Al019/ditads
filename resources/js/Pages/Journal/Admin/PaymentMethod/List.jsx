import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog"
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { router, useForm, usePage } from "@inertiajs/react";
import InputError from "@/Components/input-error";
import { toast } from "sonner"
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
import { Switch } from "@/Components/ui/switch";
import { FilePenLine, LoaderCircle, Plus, QrCode, Settings2, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"

const List = () => {
  const [open, setOpen] = useState(false)
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    name: "",
    account_name: "",
    account_number: "",
    qr_code: null,
    have_qr: "no"
  })
  const { payments } = usePage().props
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(false)
  const [previewQr, setPreviewQr] = useState(null)
  const [status, setStatus] = useState(() => [...payments.data])

  useEffect(() => {
    setStatus([...payments.data])
  }, [payments])

  const handleOpen = (payment = null) => {
    if (payment) {
      setEditData(true)
      setData({
        id: payment.id,
        name: payment.name,
        account_name: payment.account_name,
        account_number: payment.account_number,
        qr_code: payment.qr_code,
        have_qr: payment.qr_code ? 'yes' : 'no'
      })
      if (payment.qr_code) {
        setPreviewQr(`/storage/journal/qr_codes/${payment.qr_code}`)
      } else {
        setPreviewQr(null);
      }
    } else {
      setEditData(false)
      reset()
      setPreviewQr(null)
    }
    setOpen(!open)
    clearErrors()
  }

  const handleAdd = () => {
    clearErrors()
    post(route('admin.service&payment.add.payment.method'), {
      onSuccess: () => {
        handleOpen()
        toast.success("Payment method added successfully.")
      },
    });
  }

  const handleUpdate = () => {
    clearErrors()
    post(route("admin.service&payment.update.payment.method"), {
      onSuccess: () => {
        handleOpen()
        toast.success("Payment method updated successfully.");
      }, preserveScroll: true
    });
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus ? 1 : 0

    setStatus((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, status: newStatus } : payment
      )
    )

    await axios.post(route('admin.service&payment.update.payment.method.status'), { id, status: newStatus })
  }

  const searchTimeoutRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      router.get(route('admin.service&payment.payment.method'), { search: value }, { preserveState: true });
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

  return (
    <>
      <div className='space-y-4'>
        <div className="flex items-center justify-between">
          <div className='w-full sm:max-w-xs'>
            <Input value={search} onChange={handleSearch} placeholder="Search" />
          </div>
          <Button onClick={() => handleOpen()} variant='outline'>
            <Plus />Add
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.data.length > 0 ? (
              payments.data.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {payment.name}
                  </TableCell>
                  <TableCell>
                    {payment.account_name}
                  </TableCell>
                  <TableCell>
                    {payment.account_number}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={status[index]?.status === 1}
                        id={`status-${index}`}
                        onCheckedChange={(val) => handleToggle(payment.id, val)}
                      />
                      <Label htmlFor={`status-${index}`}>
                        {status[index]?.status === 1 ? "Available" : "Unavailable"}
                      </Label>
                    </div>
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
                        <DropdownMenuItem onClick={() => handleOpen(payment)} className="cursor-pointer">
                          <FilePenLine />Edit Payment Method
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {search ? `No matching found for "${search}"` : "No data available."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {payments.data.length > 0 && (
          <div className='flex justify-end'>
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePage(payments.prev_page_url)} className="cursor-pointer" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePage(payments.next_page_url)} className="cursor-pointer" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={() => {
        if (!processing) {
          handleOpen()
        }
      }}>
        <DialogContent className="max-h-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editData ? "Edit Payment Method" : "Add Payment Method"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <InputError message={errors.name} />
              </div>
              <div className="space-y-1">
                <Label>Have a QR Code?</Label>
                <Select value={data.have_qr} onValueChange={(val) => setData('have_qr', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Account Name</Label>
                <Input value={data.account_name} onChange={(e) => setData('account_name', e.target.value)} />
                <InputError message={errors.account_name} />
              </div>
              <div className="space-y-1">
                <Label>Account Number</Label>
                <Input type="number" value={data.account_number} onChange={(e) => setData('account_number', e.target.value)} />
                <InputError message={errors.account_number} />
              </div>
            </div>
            {data.have_qr === 'yes' && (
              <>
                <div className="space-y-1">
                  <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <QrCode />
                    <div className="flex-1">
                      {data.qr_code ? (
                        <p className="text-sm font-medium leading-none">
                          {data.qr_code.name || data.qr_code}
                        </p>
                      ) : (
                        <p className="text-sm font-medium leading-none">
                          No file chosen
                        </p>
                      )}
                    </div>
                    <Button onClick={() => document.getElementById("qr_code").click()} size="icon" variant="ghost">
                      <Upload />
                    </Button>
                  </div>
                  <input accept=".jpg,.jpeg,.png" id="qr_code" type="file" onChange={(e) => {
                    const file = e.target.files[0];
                    setData('qr_code', file)
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setPreviewQr(imageUrl);
                    } else {
                      setPreviewQr(null)
                    }
                  }} hidden />
                  <InputError message={errors.qr_code} />
                </div>
                {previewQr && (
                  <div className="max-w-[250px] mx-auto h-[300px]">
                    <img src={previewQr} className="object-contain h-full w-full" />
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={editData ? handleUpdate : handleAdd} disabled={processing}>
              {processing && <LoaderCircle className="size-4 animate-spin" />}
              {editData ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

List.layout = page => <AuthenticatedLayout children={page} title="Payment Methods" />

export default List