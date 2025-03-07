import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Switch } from "@/Components/ui/switch";
import { FileImage, FilePenLine } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const List = () => {
  const [open, setOpen] = useState(false)
  const { data, setData, post, patch, processing, errors, reset, setError } = useForm({
    name: "",
    account_name: "",
    account_number: "",
    type: "",
  })
  const { payments } = usePage().props
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(() => [...payments.data])
  const [editData, setEditData] = useState(false)

  useEffect(() => {
    setStatus([...payments.data])
  }, [payments])

  useEffect(() => {
    if (!editData) {
      setData("name", data.type === "cash" ? "Cash" : "")
    }
  }, [data.type, editData])

  const handleOpen = (payment = null) => {
    if (payment) {
      setEditData(true)
      setData({
        id: payment.id,
        name: payment.name,
        account_name: payment.account_name,
        account_number: payment.account_number,
        type: payment.type
      })
    } else {
      setEditData(false)
      reset()
    }
    setOpen(!open)
    setError({ name: null, account_name: null, account_number: null })
  }

  const handleAdd = () => {
    setError({ name: null, account_name: null, account_number: null })
    post(route('admin.service&payment.add.payment.method'), {
      onSuccess: () => {
        reset()
        handleOpen()
        toast.success("Payment method added successfully.")
      },
    });
  }

  const handleUpdate = () => {
    if (!editData) return;

    setError({ name: null, account_name: null, account_number: null })
    patch(route("admin.service&payment.update.payment.method"), {
      onSuccess: () => {
        reset()
        handleOpen()
        toast.success("Payment method updated successfully.");
      }, preserveScroll: true
    });
  };

  const handleToggle = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 2 : 1

    setStatus((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, status: newStatus } : payment
      )
    )

    router.patch(route('admin.service&payment.update.payment.method.status'), { id, status: newStatus }, { preserveScroll: true })
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
    <AuthenticatedLayout title="Payment Methods" button={
      <Button onClick={() => handleOpen()}>
        Add
      </Button>
    }>
      <div className='space-y-4'>
        <div className='w-full sm:max-w-xs'>
          <Input value={search} onChange={handleSearch} placeholder="Search" />
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
                    {payment.account_name === null ? '-' : payment.account_name}
                  </TableCell>
                  <TableCell>
                    {payment.account_number === null ? '-' : payment.account_number}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={status[index]?.status === 1}
                        id={`status-${index}`}
                        onCheckedChange={() => handleToggle(payment.id, payment.status)}
                      />
                      <Label htmlFor={`status-${index}`}>
                        {status[index]?.status === 1 ? "Available" : "Not available"}
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpen(payment)} variant="outline" size="icon">
                      <FilePenLine />
                    </Button>
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

      <Dialog open={open} onOpenChange={() => handleOpen()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editData ? "Edit Payment Method" : "Add Payment Method"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Type</Label>
              <Select value={data.type} onValueChange={(val) => {
                setData("type", val)
                setError({ name: null, account_name: null, account_number: null })
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="e-wallet">E-Wallet</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {data.type === 'cash' && <InputError message={errors.name} />}
            </div>
            {data.type === 'e-wallet' && (
              <>
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                  <InputError message={errors.name} />
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
              </>
            )}
          </div>
          <DialogFooter>
            {data.type && (
              <Button onClick={editData ? handleUpdate : handleAdd} disabled={processing}>
                {editData ? 'Update' : 'Save'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  )
}

export default List