import { Suspense } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { InboxPage } from "@/components/inbox/InboxPage"

export default function InboxRoutePage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Suspense fallback={null}>
                    <InboxPage />
                </Suspense>
            </SidebarInset>
        </SidebarProvider>
    )
}
