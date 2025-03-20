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
import { FilePenLine, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const List = () => {
  const [open, setOpen] = useState(false)
  const { data, setData, post, processing, errors, reset, setError } = useForm({
    id: null,
    name: "",
    price: ""
  })
  const { services } = usePage().props
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(() => [...services.data])
  const [editData, setEditData] = useState(false)
  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(parseFloat(amount))

  useEffect(() => {
    setStatus([...services.data])
  }, [services])

  const handleOpen = (service = null) => {
    if (service) {
      setEditData(true)
      setData({
        id: service.id,
        name: service.name,
        price: service.price,
      })
    } else {
      setEditData(false)
      reset()
    }
    setOpen(!open)
    setError({ name: null, price: null })
  }

  const handleAdd = () => {
    setError({ name: null, price: null })
    post(route('admin.service&payment.add.service'), {
      onSuccess: () => {
        handleOpen()
        toast.success("Service added successfully.")
      },
    });
  }

  const handleUpdate = () => {
    setError({ name: null, price: null });
    post(route("admin.service&payment.update.service"), {
      onSuccess: () => {
        handleOpen()
        toast.success("Service updated successfully.");
      }, preserveScroll: true
    });
  };

  const handleToggle = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1

    setStatus((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, status: newStatus } : service
      )
    )

    router.post(route('admin.service&payment.update.service.status'), { id, status: newStatus }, { preserveScroll: true })
  }

  const searchTimeoutRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      router.get(route('admin.service&payment.service'), { search: value }, { preserveState: true });
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
    <AuthenticatedLayout title="Services" button={
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
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.data.length > 0 ? (
              services.data.map((service, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {service.name}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(service.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={status[index]?.status === 1}
                        id={`status-${index}`}
                        onCheckedChange={() => handleToggle(service.id, service.status)}
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
                        <DropdownMenuItem onClick={() => handleOpen(service)} className="cursor-pointer">
                          <FilePenLine />Edit Service
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {search ? `No matching found for "${search}"` : "No data available."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {services.data.length > 0 && (
          <div className='flex justify-end'>
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePage(services.prev_page_url)} className="cursor-pointer" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePage(services.next_page_url)} className="cursor-pointer" />
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
            <DialogTitle>{editData ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
              <InputError message={errors.name} />
            </div>
            <div className="space-y-1">
              <Label>Price</Label>
              <Input type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} />
              <InputError message={errors.price} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={editData ? handleUpdate : handleAdd} disabled={processing}>
              {editData ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  )
}

export default List