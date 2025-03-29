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
} from "@/Components/ui/sidebar"
import { Link } from "@inertiajs/react"
import {
  ChevronRight,
  FileInputIcon,
  FolderSync,
  LayoutDashboard,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

const navMain = [
  {
    title: 'Assigned Documents',
    path: '/editor/assigned/documents',
    icon: FileInputIcon,
    items: [
      {
        title: 'Pending',
        path: '/editor/assigned/documents/pending',
        route: 'editor.assigned.document.pending'
      },
      {
        title: 'Approved',
        path: '/editor/assigned/documents/approved',
        route: 'editor.assigned.document.approved'
      },
      {
        title: 'Rejected',
        path: '/editor/assigned/documents/rejected',
        route: 'editor.assigned.document.rejected'
      },
    ]
  },
  {
    title: 'Published Documents',
    path: '/editor/published/documents',
    icon: FolderSync,
    items: [
      {
        title: 'Pending',
        path: '/editor/published/documents/pending',
        route: 'editor.published.document.pending'
      },
      {
        title: 'Reports',
        path: '/editor/published/documents/reports',
        route: 'editor.published.document.report'
      },
    ]
  },
]

const NavEditor = () => {
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>
          Main
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem onClick={() => {
            if (isMobile) {
              setOpenMobile(false)
            }
          }}>
            <SidebarMenuButton tooltip="Dashboard" asChild isActive={location.pathname.startsWith('/editor/dashboard') ? true : false}>
              <Link href={route('editor.dashboard')}>
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {navMain.map((item, index) => (
            <Collapsible key={index} asChild className="group/collapsible" defaultOpen={location.pathname.startsWith(item.path) ? true : false}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    <item.icon />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem, subIndex) => (
                      <SidebarMenuSubItem key={subIndex} onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false)
                        }
                      }} className="cursor-pointer">
                        <SidebarMenuSubButton asChild isActive={location.pathname.startsWith(subItem.path) ? true : false}>
                          <Link href={route(subItem.route)}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}

export default NavEditor