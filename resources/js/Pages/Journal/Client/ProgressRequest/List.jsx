import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { useEffect, useRef, useState } from "react"
import { router, usePage } from "@inertiajs/react"
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
import { FileCheck2, FilePen, UserPen } from "lucide-react"
import { Separator } from "@/Components/ui/separator"

const List = () => {
  const { requests } = usePage().props
  const [search, setSearch] = useState("");

  const searchTimeoutRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      router.get(route('client.progress.request'), { search: value }, { preserveState: true });
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
        <div className='w-full sm:max-w-xs'>
          <Input value={search} onChange={handleSearch} placeholder="Search" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="text-center">Progress Status</TableHead>
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
                    <div className="space-y-4">
                      <h1 className="text-center">{request.uploaded_file.split('/').pop()}</h1>
                      <div className="grid grid-cols-5 place-items-center gap-y-4">
                        <Button variant={request.assign_editor ? 'default' : 'outline'} size="icon">
                          <UserPen />
                        </Button>
                        <Separator />
                        <Button variant={request.assign_editor?.published_at ? 'default' : 'outline'} size="icon" disabled={request.assign_editor ? false : true}>
                          <FilePen />
                        </Button>
                        <Separator />
                        <Button variant={request.payment ? 'default' : 'outline'} size="icon" disabled={request.assign_editor?.published_at ? false : true}>
                          <FileCheck2 />
                        </Button>
                        <p className="text-center">
                          {request.assign_editor ? `Editor: ${request.assign_editor.user.first_name} ${request.assign_editor.user.last_name}` : 'Waiting for Editor'}
                        </p>
                        <div></div>
                        {request.assign_editor && (
                          <p className="text-center">
                            {request.assign_editor.published_at ? 'Published' : 'Publishing'}
                          </p>
                        )}
                        <div></div>
                        {request.assign_editor?.published_at && (
                          <p className="text-center">
                            {request.payment ? 'Paid' : 'Paying'}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
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
    </>
  )
}

List.layout = page => <AuthenticatedLayout children={page} title="Progress Requests" />

export default List