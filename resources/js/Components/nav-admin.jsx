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
  FolderCog,
  Layers,
  LayoutDashboard,
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
                    router.visit(route('admin.user.enumerator'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/users/enumerators') ? true : false}>
                      <span>Enumerators</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('admin.user.viewer'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/admin/users/viewers') ? true : false}>
                      <span>Viewers</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
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
          Survey
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem onClick={() => {
            router.visit(route('admin.survey'))
            setOpenMobile(false)
          }}>
            <SidebarMenuButton tooltip="Surveys" isActive={location.pathname.startsWith('/admin/surveys') ? true : false}>
              <Layers />
              <span>Surveys</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
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
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}
