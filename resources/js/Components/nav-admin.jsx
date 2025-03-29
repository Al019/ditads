import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/Components/ui/collapsible"
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
import { useIsMobile } from "@/hooks/use-mobile"
import { Link } from "@inertiajs/react"
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

const navMain = [
  {
    title: 'Users',
    path: '/admin/users',
    icon: Users,
    items: [
      {
        title: 'Editors',
        path: '/admin/users/editors',
        route: 'admin.user.editor'
      },
      {
        title: 'Clients',
        path: '/admin/users/clients',
        route: 'admin.user.client'
      }
    ]
  }
]

const navJournal = [
  {
    title: 'Services & Payments',
    path: '/admin/services_&_payments',
    icon: FolderCog,
    items: [
      {
        title: 'Services',
        path: '/admin/services_&_payments/services',
        route: 'admin.service&payment.service'
      },
      {
        title: 'Payment Methods',
        path: '/admin/services_&_payments/payment_methods',
        route: 'admin.service&payment.payment.method'
      }
    ]
  },
  {
    title: 'Requests',
    path: '/admin/requests',
    icon: NotebookPen,
    items: [
      {
        title: 'Pending',
        path: '/admin/requests/pending',
        route: 'admin.request.pending'
      },
      {
        title: 'Approved',
        path: '/admin/requests/approved',
        route: 'admin.request.approved'
      },
      {
        title: 'Rejected',
        path: '/admin/requests/rejected',
        route: 'admin.request.rejected'
      },
    ]
  },
  {
    title: 'Assigned Editors',
    path: '/admin/assigned/editors',
    icon: UserPen,
    items: [
      {
        title: 'Pending',
        path: '/admin/assigned/editors/pending',
        route: 'admin.assigned.editor.pending'
      },
      {
        title: 'Approved',
        path: '/admin/assigned/editors/approved',
        route: 'admin.assigned.editor.approved'
      },
      {
        title: 'Rejected',
        path: '/admin/assigned/editors/rejected',
        route: 'admin.assigned.editor.rejected'
      },
    ]
  },
  {
    title: 'Published Documents',
    path: '/admin/published/documents',
    icon: FolderSync,
    items: [
      {
        title: 'Unpaid',
        path: '/admin/published/documents/unpaid',
        route: 'admin.published.document.unpaid'
      },
      {
        title: 'Paid',
        path: '/admin/published/documents/paid',
        route: 'admin.published.document.paid'
      },
    ]
  },
  {
    title: 'Payment Transactions',
    path: '/admin/payments/transactions',
    icon: ClipboardList,
    items: [
      {
        title: 'Pending',
        path: '/admin/payments/transactions/pending',
        route: 'admin.payment.transaction.pending'
      },
      {
        title: 'Approved',
        path: '/admin/payments/transactions/approved',
        route: 'admin.payment.transaction.approved'
      },
      {
        title: 'Rejected',
        path: '/admin/payments/transactions/rejected',
        route: 'admin.payment.transaction.rejected'
      },
    ]
  },
]

export function NavAdmin() {
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
            <SidebarMenuButton tooltip="Dashboard" asChild isActive={location.pathname.startsWith('/admin/dashboard') ? true : false}>
              <Link href={route('admin.dashboard')}>
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
      <SidebarGroup>
        <SidebarGroupLabel>
          Journal
        </SidebarGroupLabel>
        <SidebarMenu>
          {navJournal.map((item, index) => (
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
