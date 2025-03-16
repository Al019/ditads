import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/Components/mode-toggle"
import { useSecurity } from "@/Components/security-modal"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react"
import { useEffect } from "react"

export default function AuthenticatedLayout({ children, title, button, tab }) {
    const user = usePage().props.auth.user;
    const { setOpen } = useSecurity()
    const currentPath = usePage().url

    useEffect(() => {
        const securityAlert = () => {
            if (user.is_default === 0 && currentPath !== "/profile") {
                setOpen(true)
            } else {
                setOpen(false)
            }
        }
        securityAlert()
    }, [user])

    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="sticky top-0 bg-background px-4">
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
                                <div className="flex items-center gap-4">
                                    {button && (
                                        <div className="flex items-center gap-4">
                                            {button}
                                            <Separator orientation="vertical" className="h-4" />
                                        </div>
                                    )}
                                    <ModeToggle />
                                </div>
                            </div>
                        </header>
                        {tab && (
                            <div>
                                {tab}
                            </div>
                        )}
                        <Separator className="w-full" />
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
