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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FilePenLine, Settings2, UserCircle } from "lucide-react";

const List = () => {
  const [open, setOpen] = useState(false)
  const { data, setData, post, processing, errors, reset, setError } = useForm({
    id: null,
    last_name: "",
    first_name: "",
    middle_name: "",
    gender: "",
    email: "",
    commission_price_rate: null,
  })
  const { editors } = usePage().props
  const [search, setSearch] = useState("");
  const [openCommission, setOpenCommission] = useState(false)

  const handleOpenCommission = (editor) => {
    if (editor) {
      setData({
        id: editor.id,
        commission_price_rate: editor.commission_price_rate ? editor.commission_price_rate : null
      })
    } else {
      reset()
    }
    setOpenCommission(!openCommission)
  }

  const handleUpdateCommission = () => {
    post(route('admin.user.update.editor.commission'), {
      onSuccess: () => {
        handleOpenCommission()
      },
    });
  }

  const handleOpen = () => {
    setOpen(!open)
    reset()
    setError({ last_name: null, first_name: null, email: null })
  }

  const handleAdd = () => {
    setError({ last_name: null, first_name: null, email: null })
    post(route('admin.user.add.editor'), {
      onSuccess: () => {
        reset()
        handleOpen()
        toast.success("Editor added successfully.")
      },
    });
  }

  const searchTimeoutRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      router.get(route('admin.user.editor'), { search: value }, { preserveState: true });
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
    <AuthenticatedLayout title="Editors" button={
      <Button onClick={handleOpen}>
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
              <TableHead>Last Name</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Commission Rate</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editors.data.length > 0 ? (
              editors.data.map((editor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {editor.last_name}
                  </TableCell>
                  <TableCell>
                    {editor.first_name}
                  </TableCell>
                  <TableCell>
                    {editor.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={editor.status === 'active' ? 'default' : 'destructive'}>
                      <span className='capitalize'>{editor.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {editor.commission_price_rate ? editor.commission_price_rate : '0'}%
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
                        <DropdownMenuItem className="cursor-pointer">
                          <UserCircle />Show Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenCommission(editor)} className="cursor-pointer">
                          <FilePenLine />Edit Commission Rate
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
        {editors.data.length > 0 && (
          <div className='flex justify-end'>
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePage(editors.prev_page_url)} className="cursor-pointer" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePage(editors.next_page_url)} className="cursor-pointer" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Editor</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div className="space-y-1">
              <Label>Last Name</Label>
              <Input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
              <InputError message={errors.last_name} />
            </div>
            <div className="space-y-1">
              <Label>First Name</Label>
              <Input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
              <InputError message={errors.first_name} />
            </div>
            <div className="space-y-1">
              <Label>Middle Name</Label>
              <Input value={data.middle_name} onChange={(e) => setData('middle_name', e.target.value)} placeholder="Optional" />
            </div>
            <div className="space-y-1">
              <Label>Gender</Label>
              <Select value={data.gender} onValueChange={(val) => setData('gender', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Email Address</Label>
              <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
              <InputError message={errors.email} />
            </div>
            <div className="space-y-1">
              <Label>Commission Rate (%)</Label>
              <Input
                value={data.commission_price_rate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '')
                  if (value.length > 2) value = value.slice(0, 2)
                  setData('commission_price_rate', value);
                }}
              />
              <InputError message={errors.commission_price_rate} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAdd} disabled={processing}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openCommission} onOpenChange={() => setOpenCommission()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Commission Rate</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <Label>Commission Rate (%)</Label>
            <Input
              value={data.commission_price_rate}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '')
                if (value.length > 2) value = value.slice(0, 2)
                setData('commission_price_rate', value);
              }}
            />
            <InputError message={errors.commission_price_rate} />
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateCommission} disabled={processing}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  )
}

export default List