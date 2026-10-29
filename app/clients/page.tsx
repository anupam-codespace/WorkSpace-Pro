import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ClientsContent } from "@/components/clients-content"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Suspense fallback={null}>
          <ClientsContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
