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
import { Check, Download, FileUp, Settings2, Upload, X } from "lucide-react"
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
import InputError from "@/Components/input-error"
import { Label } from "@/Components/ui/label"
import PDF from '../../../../../../public/images/pdf.png'
import { toast } from "sonner"

const Pending = () => {
  const { assigns } = usePage().props
  const [search, setSearch] = useState("");
  const { data, errors, processing, setData, post, reset, setError } = useForm({
    id: null,
    published_file: null
  })
  const [open, setOpen] = useState(false)

  const handleOpen = (id = null) => {
    if (id) {
      setData('id', id)
    } else {
      reset()
    }
    setError({ published_file: null })
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
      router.get(route('editor.published.document.pending'), { search: value }, { preserveState: true });
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

  const handlePublish = () => {
    setError({ published_file: null })
    post(route('editor.published.document.publish'), {
      onSuccess: () => {
        handleOpen()
        toast.success('Document published successfully.')
      }
    })
  }

  return (
    <AuthenticatedLayout title="Pending Published Documents">
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
              <TableHead>Edited Document</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assigns.data.length > 0 ? (
              assigns.data.map((assign, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {assign.request.request_number}
                  </TableCell>
                  <TableCell>
                    {assign.request.user.first_name} {assign.request.user.last_name}
                  </TableCell>
                  <TableCell>
                    {assign.request.service.name}
                  </TableCell>
                  <TableCell>
                    {assign.edited_file.split('/').pop()}
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
                        <DropdownMenuItem onClick={() => window.open(route('journal.download', { file: `edited_files/${assign.edited_file}` }), '_blank')} className="cursor-pointer">
                          <Download />Download Document
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpen(assign.id)} className="cursor-pointer">
                          <FileUp />Publish
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
        {assigns.data.length > 0 && (
          <div className='flex justify-end'>
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePage(assigns.prev_page_url)} className="cursor-pointer" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePage(assigns.next_page_url)} className="cursor-pointer" />
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
            <DialogTitle>Are you sure you want to publish?</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <Label>Upload Published File</Label>
            <div className=" flex items-center space-x-4 rounded-md border p-4">
              <img src={PDF} className="size-8" />
              <div className="flex-1 space-y-1">
                {data.published_file ? (
                  <>
                    <p className="text-sm font-medium leading-none">
                      {data.published_file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-medium leading-none">
                    No file chosen
                  </p>
                )}
              </div>
              <Button onClick={() => document.getElementById("published_file").click()} size="icon" variant="ghost">
                <Upload />
              </Button>
            </div>
            <input accept=".pdf" id="published_file" type="file" onChange={(e) => setData("published_file", e.target.files[0])} hidden />
            <InputError message={errors.published_file} />
          </div>
          <DialogFooter>
            <Button onClick={handlePublish} disabled={processing}>
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AuthenticatedLayout>
  )
}

export default Pending