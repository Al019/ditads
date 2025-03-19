import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { router, useForm, usePage } from "@inertiajs/react"
import { useEffect, useRef, useState } from "react";
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
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Check, CheckCircle, CircleCheck, CircleX, Download, MoreHorizontal, Settings2, Upload, View, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/Components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import InputError from "@/Components/input-error";
import { toast } from "sonner";
import Word from '../../../../../../public/images/word.png'

const Pending = () => {
  const { requests, editors } = usePage().props
  const [search, setSearch] = useState("");
  const formatDateTime = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })
  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(parseFloat(amount))
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(null)
  const { data, errors, processing, post, setData, reset, setError } = useForm({
    request_id: null,
    editor_id: null,
    edited_file: null,
    status: null,
    message: ""
  })

  const handleOpen = (status, request_id) => {
    if (status === 'approved') {
      setStatus(status)
      setData({
        request_id: request_id,
        status: status
      })
    } else if (status === 'rejected') {
      setStatus(status)
      setData({
        request_id: request_id,
        status: status
      })
    } else {
      setStatus(null)
      reset()
    }
    setOpen(!open)
    setError({ edited_file: null, editor_id: null, message: null })
  }

  const searchTimeoutRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      router.get(route('admin.request.pending'), { search: value }, { preserveState: true });
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

  const handleApprove = () => {
    setError({ edited_file: null, editor_id: null })
    post(route('admin.approved.request'), {
      onSuccess: () => {
        handleOpen()
        toast.success('Request approved successfully.')
        router.visit(route('admin.request.approved'))
      }
    })
  }

  const handleReject = () => {
    setError({ message: null })
    post(route('admin.rejected.request'), {
      onSuccess: () => {
        handleOpen()
        toast.success('Request rejected successfully.')
        router.visit(route('admin.request.rejected'))
      }
    })
  }

  return (
    <AuthenticatedLayout title="Pending Requests">
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
                    {request.user.first_name} {request.user.last_name}
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
                          <Settings2 />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(route('journal.download', { file: `uploaded_files/${request.uploaded_file}` }), '_blank')} className="cursor-pointer">
                          <Download />Download Document
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpen('approved', request.id)} className="cursor-pointer">
                          <Check />Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpen('rejected', request.id)} className="cursor-pointer">
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

      <Dialog open={open} onOpenChange={() => handleOpen()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to {status === 'approved' && 'approve' || status === 'rejected' && 'reject'}?</DialogTitle>
          </DialogHeader>
          {status === 'approved' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Upload Edited File</Label>
                <div className=" flex items-center space-x-4 rounded-md border p-4">
                  <img src={Word} className="size-8" />
                  <div className="flex-1 space-y-1">
                    {data.edited_file ? (
                      <>
                        <p className="text-sm font-medium leading-none">
                          {data.edited_file.name}
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
                  <Button onClick={() => document.getElementById("edited_file").click()} size="icon" variant="ghost">
                    <Upload />
                  </Button>
                </div>
                <input accept=".docx" id="edited_file" type="file" onChange={(e) => setData("edited_file", e.target.files[0])} hidden />
                <InputError message={errors.edited_file} />
              </div>
              <div className="space-y-1">
                <Label>Assign Editor</Label>
                <Select value={data.editor_id} onValueChange={(val) => setData('editor_id', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {editors.map((editor, index) => (
                        <SelectItem key={index} value={editor.id}>
                          {editor.first_name} {editor.last_name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <InputError message={errors.editor_id} />
              </div>
            </div>
          )}
          {status === 'rejected' && (
            <div className="space-y-1">
              <Label>Please leave a message</Label>
              <Textarea value={data.message} onChange={(e) => setData('message', e.target.value)} />
              <InputError message={errors.message} />
            </div>
          )}
          <DialogFooter>
            {status === 'approved' && (
              <Button onClick={handleApprove} disabled={processing}>
                Approve
              </Button>
            )}
            {status === 'rejected' && (
              <Button onClick={handleReject} disabled={processing}>
                Reject
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  )
}

export default Pending