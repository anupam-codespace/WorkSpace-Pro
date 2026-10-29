import { Suspense } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { MyTasksPage } from "@/components/tasks/MyTasksPage"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function TasksPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Suspense fallback={null}>
          <MyTasksPage />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
