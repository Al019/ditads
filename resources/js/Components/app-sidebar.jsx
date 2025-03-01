import * as React from "react"
import {
  Layers,
  LayoutDashboard,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Link, usePage } from "@inertiajs/react"
import Logo from '../../../public/images/logo.png'
import { NavSurvey } from "./nav-survey"

const navMain = {
  title: "Dashboard",
  route: "admin.dashboard",
  icon: LayoutDashboard,
  url: "/admin/dashboard",
  users: {
    title: "Users",
    icon: Users,
    url: "/admin/users",
    subItems: [
      {
        title: "Enumerators",
        route: "admin.user.enumerator",
        url: "/admin/users/enumerators",
      },
      {
        title: "Viewers",
        route: "admin.user.viewer",
        url: "/admin/users/viewers",
      },
    ],
  },
}

const navSurvey = {
  title: "Surveys",
  route: "admin.survey",
  icon: Layers,
  url: "/admin/surveys",
}

export function AppSidebar({
  ...props
}) {
  const user = usePage().props.auth.user;

  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" as="button" className="w-full">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
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
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSurvey items={navSurvey} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
