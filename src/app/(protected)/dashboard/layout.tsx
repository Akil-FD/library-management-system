import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset className="flex flex-col min-h-0">
                <SiteHeader />

                <main className="flex flex-1 min-h-0 overflow-hidden">
                    <div className="flex flex-1 min-h-0">
                        <div className="flex flex-1 min-h-0 overflow-hidden">
                            <div className="h-[100%] w-full p-5 box-border">

                              {children}

                            </div>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}