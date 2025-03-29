import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog"
import { useEffect, useRef, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
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
import { toast } from "sonner"
import InputError from "@/Components/input-error"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Download, LoaderCircle, MoreHorizontal, Plus, Upload } from "lucide-react"
import Word from '../../../../../../public/images/word.png'

const Pending = () => {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState("1")
  const { services, requests } = usePage().props
  const { data, processing, errors, post, reset, setData, clearErrors } = useForm({
    service_id: "",
    uploaded_file: null
  })
  const [search, setSearch] = useState("");
  const formatDateTime = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })
  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(parseFloat(amount))

  const handleOpen = () => {
    setOpen(!open)
    setTab("1")
    reset()
    clearErrors()
  }

  const searchTimeoutRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      router.get(route('client.my.request.pending'), { search: value }, { preserveState: true });
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

  const handleSubmit = () => {
    clearErrors()
    post(route('client.my.request.submit.request'), {
      onSuccess: () => {
        handleOpen()
        toast.success('Request submitted successfully.')
      }
    })
  }

  return (
    <>
      <div className='space-y-4'>
        <div className="flex items-center justify-between">
          <div className='w-full sm:max-w-xs'>
            <Input value={search} onChange={handleSearch} placeholder="Search" />
          </div>
          <Button onClick={handleOpen} variant='outline'>
            <Plus />Request
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">#</TableHead>
                <TableHead className="whitespace-nowrap">Request Number</TableHead>
                <TableHead className="whitespace-nowrap">Service</TableHead>
                <TableHead className="whitespace-nowrap">Uploaded Document</TableHead>
                <TableHead className="whitespace-nowrap">Date Requested</TableHead>
                <TableHead className="whitespace-nowrap">Amount</TableHead>
                <TableHead className="whitespace-nowrap">Action</TableHead>
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
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(route('journal.download', { file: `uploaded_files/${request.uploaded_file}` }), '_blank')} className="cursor-pointer">
                            <Download />Download Document
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
        </div>
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

      <Dialog open={open} onOpenChange={() => {
        if (!processing) {
          handleOpen()
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {tab === "1" && "Step 1: Select a Service"}
              {tab === "2" && "Step 2: File Naming"}
              {tab === "3" && "Step 3: Word Formatting"}
              {tab === "4" && "Step 4: Abstract"}
              {tab === "5" && "Step 5: Upload Your File"}
            </DialogTitle>
          </DialogHeader>
          {tab === "1" && (
            <div>
              <Select value={data.service_id} onValueChange={(val) => setData("service_id", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {services.map((service, index) => (
                      <SelectItem key={index} value={service.id}>
                        {service.name} ({formatCurrency(service.price)})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogDescription>
            {tab === "2" && (
              <div className="text-justify">
                Choose a descriptive and standardized file name that includes essential information. A common format is to use the following elements separated by underscores:
                <br />
                <br />
                Author(s) last name(s)
                <br />
                Publication year
                <br />
                Title of the paper (shortened if necessary)
                <br />
                <br />
                <p className="text-center font-medium">Smith_Jones_2023_Research_Paper.docx</p>
              </div>
            )}
            {tab === "3" && (
              <div className="text-justify">
                Ensure that your word file adheres to these formatting standards:
                <br />
                <br />
                Use a standard paper size, typically A4 (8.5 x 11) or letter (8.5 x 11).
                <br />
                Use a readable font, such as Times New Roman, Arial, or similar, with a size of 12-point.
                <br />
                Maintain consistent margins (1-inch or 2.54 cm) on all sides.
                <br />
                Include page numbers at the bottom or top of the page.
              </div>
            )}
            {tab === "4" && (
              <div className="text-justify">
                Include a concise abstract at the beginning of the paper. The abstract should summarize the research, methods, key findings, and conclusions in a clear and concise manner (usually 150-250 words).
              </div>
            )}
            {tab === "5" && (
              <div className="text-justify">
                When you reach this step, use the file input field to select your word file. Ensure the file is in word format for compatibility. Once selected, proceed to the next step.
                <br />
                <br />
                <p className="text-center font-medium">That's it! Your word file is ready for upload. If you have any questions or encounter issues during the process, feel free to reach out for assistance. Happy uploading!</p>
                <br />
                <div className="space-y-1">
                  <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <img src={Word} className="size-8" />
                    <div className="flex-1 space-y-1">
                      {data.uploaded_file ? (
                        <>
                          <p className="text-sm font-medium leading-none">
                            {data.uploaded_file.name}
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
                    <Button onClick={() => document.getElementById("uploaded_file").click()} size="icon" variant="ghost">
                      <Upload />
                    </Button>
                  </div>
                  <input accept=".docx" id="uploaded_file" type="file" onChange={(e) => setData("uploaded_file", e.target.files[0])} hidden />
                  <InputError message={errors.uploaded_file} />
                </div>
              </div>
            )}
          </DialogDescription>
          <DialogFooter>
            <div className="flex gap-2 items-center justify-end">
              {(tab === "1" && data.service_id) && (
                <Button onClick={() => setTab("2")}>
                  Next
                </Button>
              )}
              {tab === "2" && (
                <>
                  <Button variant="secondary" onClick={() => setTab("1")}>
                    Back
                  </Button>
                  <Button onClick={() => setTab("3")}>
                    Next
                  </Button>
                </>
              )}
              {tab === "3" && (
                <>
                  <Button variant="secondary" onClick={() => setTab("2")}>
                    Back
                  </Button>
                  <Button onClick={() => setTab("4")}>
                    Next
                  </Button>
                </>
              )}
              {tab === "4" && (
                <>
                  <Button variant="secondary" onClick={() => setTab("3")}>
                    Back
                  </Button>
                  <Button onClick={() => setTab("5")}>
                    Next
                  </Button>
                </>
              )}
              {tab === "5" && (
                <>
                  <Button variant="secondary" onClick={() => setTab("4")}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={processing}>
                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                    Submit
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

Pending.layout = page => <AuthenticatedLayout children={page} title="My Requests" />

export default Pending