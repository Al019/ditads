import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
  FolderCog,
  FolderSync,
  LayoutDashboard,
  NotebookPen,
  UserPen,
  Users,
} from "lucide-react"

export function NavAdmin() {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>
          Main
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem onClick={() => {
            router.visit(route('admin.dashboard'))
            setOpenMobile(false)
          }}>
            <SidebarMenuButton tooltip="Dashboard" isActive={location.pathname.startsWith('/admin/dashboard') ? true : false}>
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible asChild className="group/collapsible" defaultOpen={location.pathname.startsWith('/admin/users') ? true : false}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Users">
                  <Users />
                  <span>Users</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.user.editor'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/users/editors') ? true : false}>
                      <span>Editors</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.user.client'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/users/clients') ? true : false}>
                      <span>Clients</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>
          Journal
        </SidebarGroupLabel>
        <SidebarMenu>
          <Collapsible asChild className="group/collapsible" defaultOpen={location.pathname.startsWith('/admin/services_&_payments') ? true : false}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Services & Payments">
                  <FolderCog />
                  <span>Services & Payments</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.service&payment.service'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/services_&_payments/services') ? true : false}>
                      <span>Services</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.service&payment.payment.method'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/services_&_payments/payment_methods') ? true : false}>
                      <span>Payment Methods</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          <Collapsible asChild className="group/collapsible" defaultOpen={location.pathname.startsWith('/admin/requests') ? true : false}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Requests">
                  <NotebookPen />
                  <span>Requests</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.request.pending'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/requests/pending') ? true : false}>
                      <span>Pending</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.request.approved'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/requests/approved') ? true : false}>
                      <span>Approved</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.request.rejected'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/requests/rejected') ? true : false}>
                      <span>Rejected</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          <Collapsible asChild className="group/collapsible" defaultOpen={location.pathname.startsWith('/admin/assigned/editors') ? true : false}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Assigned Editors">
                  <UserPen />
                  <span>Assigned Editors</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.assigned.editor.pending'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/assigned/editors/pending') ? true : false}>
                      <span>Pending</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.assigned.editor.approved'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/assigned/editors/approved') ? true : false}>
                      <span>Approved</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.assigned.editor.rejected'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/assigned/editors/rejected') ? true : false}>
                      <span>Rejected</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          <Collapsible asChild className="group/collapsible" defaultOpen={location.pathname.startsWith('/admin/published/documents') ? true : false}>
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
                    router.visit(route('admin.published.document.unpaid'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/published/documents/unpaid') ? true : false}>
                      <span>Unpaid</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.published.document.paid'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/published/documents/paid') ? true : false}>
                      <span>Paid</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          <Collapsible asChild className="group/collapsible" defaultOpen={location.pathname.startsWith('/admin/payments/transactions') ? true : false}>
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
                    router.visit(route('admin.payment.transaction.pending'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/payments/transactions/pending') ? true : false}>
                      <span>Pending</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.payment.transaction.approved'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/payments/transactions/approved') ? true : false}>
                      <span>Approved</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.payment.transaction.rejected'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/payments/transactions/rejected') ? true : false}>
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
