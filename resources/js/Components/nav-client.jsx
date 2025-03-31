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
  ClipboardList,
  FolderSync,
  LayoutDashboard,
  Loader,
  NotebookPen,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

const navMain = [
  {
    title: 'My Requests',
    path: '/client/my-requests',
    icon: NotebookPen,
    items: [
      {
        title: 'Pending',
        path: '/client/my-requests/pending',
        route: 'client.my.request.pending'
      },
      {
        title: 'Approved',
        path: '/client/my-requests/approved',
        route: 'client.my.request.approved'
      },
      {
        title: 'Rejected',
        path: '/client/my-requests/rejected',
        route: 'client.my.request.rejected'
      },
    ]
  },
  {
    title: 'Published Documents',
    path: '/client/published/documents',
    icon: FolderSync,
    items: [
      {
        title: 'Unpaid',
        path: '/client/published/documents/unpaid',
        route: 'client.published.document.unpaid'
      },
      {
        title: 'Paid',
        path: '/client/published/documents/paid',
        route: 'client.published.document.paid'
      },
    ]
  },
  {
    title: 'Payment Transactions',
    path: '/client/payments/transactions',
    icon: ClipboardList,
    items: [
      {
        title: 'Pending',
        path: '/client/payments/transactions/pending',
        route: 'client.payment.transaction.pending'
      },
      {
        title: 'Approved',
        path: '/client/payments/transactions/approved',
        route: 'client.payment.transaction.approved'
      },
      {
        title: 'Rejected',
        path: '/client/payments/transactions/rejected',
        route: 'client.payment.transaction.rejected'
      },
    ]
  },
]

export function NavClient() {
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const currentPath = window.location.pathname;

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
            <SidebarMenuButton tooltip="Dashboard" asChild isActive={currentPath.startsWith('/client/dashboard') ? true : false}>
              <Link href={route('client.dashboard')}>
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {navMain.map((item, index) => (
            <Collapsible key={index} asChild className="group/collapsible" defaultOpen={currentPath.startsWith(item.path) ? true : false}>
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
                        <SidebarMenuSubButton asChild isActive={currentPath.startsWith(subItem.path) ? true : false}>
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
          <SidebarMenuItem onClick={() => {
            if (isMobile) {
              setOpenMobile(false)
            }
          }}>
            <SidebarMenuButton tooltip="Progress Requests" asChild isActive={currentPath.startsWith('/client/progress/requests') ? true : false}>
              <Link href={route('client.progress.request')}>
                <Loader />
                <span>Progress Requests</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}
