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
import { FilePenLine, LoaderCircle, Plus, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import axios from "axios";

const List = () => {
  const [open, setOpen] = useState(false)
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
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
    clearErrors()
  }

  const handleAdd = () => {
    clearErrors()
    post(route('admin.service&payment.add.service'), {
      onSuccess: () => {
        handleOpen()
        toast.success("Service added successfully.")
      },
    });
  }

  const handleUpdate = () => {
    clearErrors();
    post(route("admin.service&payment.update.service"), {
      onSuccess: () => {
        handleOpen()
        toast.success("Service updated successfully.");
      }, preserveScroll: true
    });
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus ? 1 : 0

    setStatus((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, status: newStatus } : service
      )
    )

    await axios.post(route('admin.service&payment.update.service.status'), { id, status: newStatus })
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
                        onCheckedChange={(val) => handleToggle(service.id, val)}
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

      <Dialog open={open} onOpenChange={() => {
        if (!processing) {
          handleOpen()
        }
      }}>
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
              {processing && <LoaderCircle className="size-4 animate-spin" />}
              {editData ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

List.layout = page => <AuthenticatedLayout children={page} title="Services" />

export default List