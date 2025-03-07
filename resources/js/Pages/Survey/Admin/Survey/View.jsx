import { Button } from "@/Components/ui/button"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { router, usePage } from "@inertiajs/react"
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
import { Input } from "@/Components/ui/input"
import { CircleX, Loader2, PlusCircle } from "lucide-react"

const tabs = ["Responses", "Assignments"]

const View = () => {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [open, setOpen] = useState(false)
  const { survey_id, notAssignEnumerators, assignEnumerators } = usePage().props
  const [notAssignSearch, notAssignSetSearch] = useState("");
  const [assignSearch, assignSetSearch] = useState("");
  const [processing, setProcessing] = useState({})

  const searchTimeoutRef = useRef(null);

  const handleNotAssignSearch = (e) => {
    const value = e.target.value;
    notAssignSetSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      router.get(route('admin.survey.view', { survey_id }), { notAssignEnumeratorSearch: value }, { preserveState: true });
    }, 1000);
  };

  const handleAssignSearch = (e) => {
    const value = e.target.value;
    assignSetSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      router.get(route('admin.survey.view', { survey_id }), { assignEnumeratorSearch: value }, { preserveState: true });
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

  const handleAssign = (enumerator_id) => {
    router.post(route('admin.survey.assign.enumerator', { survey_id, enumerator_id }), {}, {
      onStart: () => {
        setProcessing((prev) => ({ ...prev, [enumerator_id]: true }))
      },
      onFinish: () => {
        setProcessing((prev) => ({ ...prev, [enumerator_id]: false }))
      }
    })
  }

  const handleRemoveAssign = (enumerator_id) => {
    router.delete(route('admin.survey.remove.assign.enumerator', { survey_id, enumerator_id }), {
      onStart: () => {
        setProcessing((prev) => ({ ...prev, [enumerator_id]: true }))
      },
      onFinish: () => {
        setProcessing((prev) => ({ ...prev, [enumerator_id]: false }))
      }
    })
  }

  return (
    <Tabs defaultValue={activeTab}>
      <AuthenticatedLayout button={
        activeTab === "Assignments" && (
          <Button onClick={() => setOpen(true)}>
            Assign
          </Button>
        )
      } tab={
        <div className="flex justify-center mb-2">
          <TabsList>
            {tabs.map((tab, index) => (
              <TabsTrigger key={index} value={tab} onClick={() => setActiveTab(tab)}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      }>
        <TabsContent value="Responses">

        </TabsContent>
        <TabsContent value="Assignments">
          <div className='space-y-4'>
            <div className='w-full sm:max-w-xs'>
              <Input value={assignSearch} onChange={handleAssignSearch} placeholder="Search" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Responses</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignEnumerators.data.length > 0 ? (
                  assignEnumerators.data.map((enumerator, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        {enumerator.last_name}
                      </TableCell>
                      <TableCell>
                        {enumerator.first_name}
                      </TableCell>
                      <TableCell>
                        {enumerator.response_count}
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleRemoveAssign(enumerator.id)} variant="destructive" size="icon" disabled={processing[enumerator.id]}>
                          {processing[enumerator.id] ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <CircleX />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {assignSearch ? `No matching found for "${assignSearch}"` : "No data available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {assignEnumerators.data.length > 0 && (
              <div className='flex justify-end'>
                <div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious onClick={() => handlePage(assignEnumerators.prev_page_url)} className="cursor-pointer" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext onClick={() => handlePage(assignEnumerators.next_page_url)} className="cursor-pointer" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <Dialog open={open} onOpenChange={() => setOpen(false)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign Enumerator</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='w-full sm:max-w-xs'>
                <Input value={notAssignSearch} onChange={handleNotAssignSearch} placeholder="Search" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notAssignEnumerators.data.length > 0 ? (
                    notAssignEnumerators.data.map((enumerator, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          {enumerator.last_name}
                        </TableCell>
                        <TableCell>
                          {enumerator.first_name}
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleAssign(enumerator.id)} size="icon" disabled={processing[enumerator.id]}>
                            {processing[enumerator.id] ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <PlusCircle />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        {notAssignSearch ? `No matching found for "${notAssignSearch}"` : "No data available."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {notAssignEnumerators.data.length > 0 && (
                <div className='flex justify-end'>
                  <div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious onClick={() => handlePage(notAssignEnumerators.prev_page_url)} className="cursor-pointer" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext onClick={() => handlePage(notAssignEnumerators.next_page_url)} className="cursor-pointer" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </AuthenticatedLayout>
    </Tabs>
  )
}

export default View