import * as React from "react"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react"
import Logo from '../../../public/images/logo.png'
import { NavAdmin } from "./nav-admin"
import { NavClient } from "./nav-client"
import NavEditor from "./nav-editor"
import { ModeToggle } from "./mode-toggle"

export function AppSidebar({
  ...props
}) {
  const user = usePage().props.auth.user;

  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <img src={Logo} className="object-contain" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  DITADS
                </span>
                <span className="truncate text-xs capitalize">
                  {user.role === 'admin' ? 'Administrator' : user.role}
                </span>
              </div>
              <ModeToggle />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {user.role === 'admin' && (
        <NavAdmin />
      )}
      {user.role === 'client' && (
        <NavClient />
      )}
      {user.role === 'editor' && (
        <NavEditor />
      )}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
