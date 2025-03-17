import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { router, usePage } from "@inertiajs/react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Download, MoreHorizontal, Settings2 } from "lucide-react";

const Approved = () => {
  const { requests } = usePage().props
  const [search, setSearch] = useState("");
  const formatDateTime = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })
  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(parseFloat(amount))

  const searchTimeoutRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      router.get(route('admin.request.approved'), { search: value }, { preserveState: true });
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
    <AuthenticatedLayout title="Approved Requests">
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
    </AuthenticatedLayout>
  )
}

export default Approved