"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "@inertiajs/react";

export function NavSurvey({
  items
}) {
  const { setOpenMobile } = useSidebar();

  return (
    (<SidebarGroup>
      <SidebarGroupLabel>
        Survey
      </SidebarGroupLabel>
      <SidebarMenu>
        <Link href={route(items.route)} onClick={() => setOpenMobile(false)}>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={items.title} isActive={location.pathname.startsWith(items.url) ? true : false}>
              <items.icon />
              <span>{items.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Link>
      </SidebarMenu>
    </SidebarGroup>)
  );
}