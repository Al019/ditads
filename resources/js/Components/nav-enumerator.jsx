import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { router } from "@inertiajs/react"
import {
  Layers,
  LayoutDashboard,
} from "lucide-react"

export function NavEnumerator() {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>
          Main
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem onClick={() => {
            router.visit(route('enumerator.dashboard'))
            setOpenMobile(false)
          }}>
            <SidebarMenuButton tooltip="Dashboard" isActive={location.pathname.startsWith('/enumerator/dashboard') ? true : false}>
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem onClick={() => {
            router.visit(route('enumerator.survey'))
            setOpenMobile(false)
          }}>
            <SidebarMenuButton tooltip="Surveys" isActive={location.pathname.startsWith('/enumerator/surveys') ? true : false}>
              <Layers />
              <span>Surveys</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}
