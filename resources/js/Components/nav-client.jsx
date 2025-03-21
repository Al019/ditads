import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { router } from "@inertiajs/react"
import {
  ChevronRight,
  ClipboardList,
  FolderSync,
  LayoutDashboard,
  Loader,
  NotebookPen,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

export function NavClient() {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>
          Main
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem onClick={() => {
            router.visit(route('client.dashboard'))
            setOpenMobile(false)
          }}>
            <SidebarMenuButton tooltip="Dashboard" isActive={location.pathname.startsWith('/client/dashboard') ? true : false}>
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible asChild className="group/collapsible" defaultOpen={location.pathname.startsWith('/client/my-requests') ? true : false}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="My Requests" isActive={location.pathname.startsWith('/client/my-requests/pending') ? true : false} onClick={() => {
                  router.visit(route('client.my.request.pending'))
                  setOpenMobile(false)
                }}>
                  <NotebookPen />
                  <span>My Requests</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('client.my.request.approved'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/client/my-requests/approved') ? true : false}>
                      <span>Approved</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('client.my.request.rejected'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/client/my-requests/rejected') ? true : false}>
                      <span>Rejected</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          <SidebarMenuItem onClick={() => {
            router.visit(route('client.progress.request'))
            setOpenMobile(false)
          }}>
            <SidebarMenuButton tooltip="Progress Requests" isActive={location.pathname.startsWith('/client/progress/requests') ? true : false}>
              <Loader />
              <span>Progress Requests</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible asChild className="group/collapsible" defaultOpen={location.pathname.startsWith('/client/published/documents') ? true : false}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Published Documents">
                  <FolderSync />
                  <span>Published Documents</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('client.published.document.unpaid'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/client/published/documents/unpaid') ? true : false}>
                      <span>Unpaid</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('client.published.document.paid'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/client/published/documents/paid') ? true : false}>
                      <span>Paid</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          <Collapsible asChild className="group/collapsible" defaultOpen={location.pathname.startsWith('/client/payments/transactions') ? true : false}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Payment Transactions">
                  <ClipboardList />
                  <span>Payment Transactions</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('client.payment.transaction.pending'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/client/payments/transactions/pending') ? true : false}>
                      <span>Pending</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('client.payment.transaction.approved'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/client/payments/transactions/approved') ? true : false}>
                      <span>Approved</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('client.payment.transaction.rejected'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/client/payments/transactions/rejected') ? true : false}>
                      <span>Rejected</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}
