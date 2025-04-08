import { AppSidebar } from "@/Components/app-sidebar"
import { useSecurity } from "@/Components/security-modal"
import { Button } from "@/Components/ui/button"
import { Separator } from "@/Components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar"
import { router, usePage } from "@inertiajs/react"
import { Bell } from "lucide-react"
import { useEffect, useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/Components/ui/sheet"
import { ModeToggle } from "@/Components/mode-toggle"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import axios from "axios"
import { formatDistanceToNow } from 'date-fns';
import { toast } from "sonner"

export default function AuthenticatedLayout({ children, title }) {
    const user = usePage().props.auth.user;
    const { setOpen } = useSecurity()
    const currentPath = usePage().url
    const [openNotif, setOpenNotif] = useState(false)
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        const securityAlert = () => {
            if (user.is_default === 1 && currentPath !== '/settings/password') {
                setOpen(true)
            } else {
                setOpen(false)
            }
        }
        securityAlert()
    }, [user])

    const getNotif = async () => {
        await axios.get(route('notification'))
            .then(({ data }) => {
                setNotifications(data)
            })
    }

    useEffect(() => {
        Echo.private(`notification.${user.id}`)
            .listen('NotificationEvent', () => {
                getNotif()
                toast.info("You've received a new notification")
            })
        getNotif()
    }, [user.id])

    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="overflow-x-hidden">
                    <div className="border-b bg-background px-4">
                        <header className="h-16 shrink-0 grid grid-cols-2 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                            <div className="flex items-center justify-start gap-2">
                                <div>
                                    <SidebarTrigger className="-ml-1" />
                                </div>
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <span className="text-base font-medium text-blue-gray-800 break-words line-clamp-2">
                                    {title}
                                </span>
                            </div>
                            <div className="flex items-center justify-end">
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Button onClick={() => setOpenNotif(true)} size="icon" variant="ghost">
                                            <Bell />
                                        </Button>
                                        <div className={`absolute top-0 right-0 size-2 rounded-full bg-destructive ${notifications.some(notif => notif.is_read !== 1) ? '' : 'hidden'}`}></div>
                                    </div>
                                    <ModeToggle />
                                </div>
                            </div>
                        </header>
                    </div>
                    <div className="overflow-x-auto w-full max-w-7xl mx-auto flex flex-1 flex-col gap-4 p-4">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>

            <Sheet open={openNotif} onOpenChange={() => setOpenNotif(false)}>
                <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Notifications</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-3">
                        {notifications.map((notif, index) => {
                            var href = ''
                            if (notif.type === 'request') {
                                if (user.role === 'admin') {
                                    href = `/admin/requests/${notif.status}`
                                } else if (user.role === 'client') {
                                    href = `/client/my-requests/${notif.status}`
                                }
                            } else if (notif.type === 'assign') {
                                if (user.role === 'admin') {
                                    href = `/admin/assigned/editors/${notif.status}`
                                } else if (user.role === 'editor') {
                                    href = `/editor/assigned/documents/${notif.status}`
                                }
                            } else if (notif.type === 'progress') {
                                if (user.role === 'client') {
                                    href = `/client/progress/requests`
                                }
                            } else if (notif.type === 'publish') {
                                if (user.role === 'admin') {
                                    href = `/admin/published/documents/unpaid`
                                } else if (user.role === 'client') {
                                    href = `/client/published/documents/unpaid`
                                }
                            } else if (notif.type === 'payment') {
                                if (user.role === 'admin') {
                                    href = `/admin/payments/transactions/${notif.status}`
                                } else if (user.role === 'client') {
                                    href = `/client/payments/transactions/${notif.status}`
                                }
                            }

                            return (
                                <Alert onClick={async () => {
                                    router.visit(href)
                                    setOpenNotif(false)
                                    if (notif.is_read === 0) {
                                        await axios.post(route('notification.read'), { id: notif.id })
                                            .then(() => {
                                                getNotif()
                                            })
                                    }
                                }} key={index} className={`cursor-pointer ${notif.is_read === 0 ? 'bg-muted' : ''}`}>
                                    <AlertDescription>
                                        {notif.message}.
                                    </AlertDescription>
                                    <div className="flex justify-end mt-2">
                                        <span>{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}</span>
                                    </div>
                                </Alert>
                            )
                        })}
                    </div>
                </SheetContent>
            </Sheet>

        </div>
    );
}
