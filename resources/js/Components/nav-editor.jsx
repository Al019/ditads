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
  FileInputIcon,
  FolderSync,
  LayoutDashboard,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

const NavEditor = () => {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>
          Main
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem onClick={() => {
            router.visit(route('editor.dashboard'))
            setOpenMobile(false)
          }}>
            <SidebarMenuButton tooltip="Dashboard" isActive={location.pathname.startsWith('/editor/dashboard') ? true : false}>
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible asChild className="group/collapsible" defaultOpen={location.pathname.startsWith('/editor/assigned/documents') ? true : false}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Assigned Documents">
                  <FileInputIcon />
                  <span>Assigned Documents</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('editor.assigned.document.pending'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/editor/assigned/documents/pending') ? true : false}>
                      <span>Pending</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('editor.assigned.document.approved'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/editor/assigned/documents/approved') ? true : false}>
                      <span>Approved</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('editor.assigned.document.rejected'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/editor/assigned/documents/rejected') ? true : false}>
                      <span>Rejected</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          <Collapsible asChild className="group/collapsible" defaultOpen={location.pathname.startsWith('/editor/published') ? true : false}>
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
                    router.visit(route('editor.published.document.pending'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/editor/published/documents/pending') ? true : false}>
                      <span>Pending</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => {
                    router.visit(route('editor.published.document.report'))
                    setOpenMobile(false)
                  }} className="cursor-pointer">
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith('/editor/published/documents/reports') ? true : false}>
                      <span>Reports</span>
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

export default NavEditor