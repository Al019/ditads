"use client"

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
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
import { Link } from "@inertiajs/react";

export function NavMain({
  items
}) {
  const { setOpenMobile } = useSidebar();

  return (
    (<SidebarGroup>
      <SidebarGroupLabel>
        Main
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
        <Collapsible asChild className="group/collapsible" defaultOpen={location.pathname.startsWith(items.users.url) ? true : false}>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={items.users.title}>
                <items.users.icon />
                <span>{items.users.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {items.users.subItems?.map((subItem, index) => (
                  <SidebarMenuSubItem key={index}>
                    <SidebarMenuSubButton asChild isActive={location.pathname.startsWith(subItem.url) ? true : false}>
                      <Link href={route(subItem.route)} onClick={() => setOpenMobile(false)}>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>)
  );
}
