export type NavItemId = "inbox" | "my-tasks" | "projects" | "clients" | "performance"

export type SidebarFooterItemId = "settings" | "templates" | "help"

export type NavItem = {
    id: NavItemId
    label: string
    badge?: number
    isActive?: boolean
}

export type ActiveProjectSummary = {
    id: string
    name: string
    color: string
    progress: number
}

export type SidebarFooterItem = {
    id: SidebarFooterItemId
    label: string
}

export const navItems: NavItem[] = [
    { id: "inbox", label: "Inbox", badge: 24 },
    { id: "my-tasks", label: "My task" },
    { id: "projects", label: "Projects", isActive: true },
    { id: "clients", label: "Clients" },
    { id: "performance", label: "Performance" },
]

export const activeProjects: ActiveProjectSummary[] = [
    { id: "ai-learning", name: "AI Learning Platform", color: "var(--chart-5)", progress: 25 },
    { id: "fintech-app", name: "Fintech Mobile App", color: "var(--chart-3)", progress: 80 },
    { id: "ecommerce-admin", name: "E-commerce Admin", color: "var(--chart-3)", progress: 65 },
    { id: "healthcare-app", name: "Healthcare Booking App", color: "var(--chart-2)", progress: 10 },
]

export const footerItems: SidebarFooterItem[] = [
    { id: "settings", label: "Settings" },
    { id: "templates", label: "Templates" },
    { id: "help", label: "Help" },
]
