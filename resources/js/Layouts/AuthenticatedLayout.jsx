import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/Components/mode-toggle"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function AuthenticatedLayout({ children, title, button }) {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar variant="floating" />
                <SidebarInset>
                    <div className="sticky top-0 bg-background">
                        <header className="h-16 shrink-0 grid grid-cols-2 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4">
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
