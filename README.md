<div align="center">

# ⚡ WorkSpace Pro

### High-Performance Project & Workspace Management Dashboard UI

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Primitives-161618?style=for-the-badge&logo=radix-ui&logoColor=white)](https://www.radix-ui.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-0070F3?style=for-the-badge&logo=vercel)](https://workspace-pro-chi.vercel.app)

<p align="center">
  A state-of-the-art, feature-dense project and workspace management frontend engineered with <strong>Next.js App Router</strong>, <strong>React 19</strong>, <strong>shadcn/ui</strong>, and <strong>Tailwind CSS</strong>. Crafted as a premier showcase of modern UI engineering, micro-interactions, responsive design systems, and multi-view data visualization.
</p>

<p align="center">
  <a href="https://workspace-pro-chi.vercel.app" target="_blank"><strong>🌐 Live Demo</strong></a> •
  <a href="#-key-features"><strong>Explore Features</strong></a> •
  <a href="#-architecture--component-breakdown"><strong>Architecture</strong></a> •
  <a href="#-ui-design-system--interaction-patterns"><strong>Design System</strong></a> •
  <a href="#-getting-started"><strong>Run Locally</strong></a> •
  <a href="#-author--contact"><strong>Author</strong></a>
</p>

---

</div>

## 📌 Overview

**WorkSpace Pro** is a comprehensive, production-grade frontend architecture for modern team collaboration, task planning, client relationship tracking, and project delivery. Built with an obsessive focus on user experience, ergonomics, keyboard navigation, and pixel-level polish, it provides the foundation for scalable SaaS products and enterprise internal tooling.

### Why this project stands out
- **Zero Placeholder Polish**: Implements real-world workflows including multi-view dashboards, draggable Gantt timelines, interactive weekly task boards, rich text documentation, and slide-over drawers.
- **Enterprise Component Hierarchy**: Cleanly decoupled business logic, presentation components, mock data stores, and custom hooks.
- **Production-Ready Frontend**: 100% type-safe TypeScript interfaces, full dark/light theme switching, responsive sidebar state persistence, and accessible Radix UI primitives.

---

## 🚀 Key Features

### 1. 🗂️ Multi-View Project Dashboard
Switch seamlessly between multiple representations of the same underlying project dataset:
- **List / Table View**: Sortable rows, progress bars, status indicators, and priority badges.
- **Interactive Gantt Timeline View**: Visual timeline representation with draggable duration bars, milestone checkpoints, and sprint windows.
- **Kanban Board View**: Column-based workflow grouped by progress stages (`Backlog`, `To Do`, `In Progress`, `Review`, `Done`).
- **Visual Grid Card View**: Scannable project cards showcasing client tags, delivery deadlines, avatar groups, and progress metrics.
- **Multi-Faceted Filter System**: Dynamic query engine supporting filtering by Member/Owner, Status, Priority, and Custom Tags with instant badge chips.

### 2. 📝 Deep-Dive Project Workspace
Each project features a dedicated detail portal with dedicated contextual tabs:
- **Workstream Tab**: In-scope vs. out-of-scope objectives, key deliverables, and client milestone timelines.
- **Interactive Tasks Tab**: Status-categorized task checklist with one-click toggles and assignee indicators.
- **Meeting Notes & Specs**: Embedded rich document cards with modal previews, download actions, and creation modals.
- **Assets & File Repository**: File manager supporting Figma links, ZIP archives, PDF documentation, and media assets with quick upload modal flows.

### 3. 🎯 Task Execution & "My Tasks" Weekly Board
- **Personalized Task Hub**: Filter tasks specifically assigned to the active user (**Anupam**) across all active projects.
- **Weekly Drag & Drop Board**: Built using `@dnd-kit/core` and `@dnd-kit/sortable` for fluid, physics-based task reprioritization across days of the week.
- **Quick Create Task Modal**: Contextual modal for rapid task entry with status, priority, and due-date selectors.

### 4. 🧙 Multi-Step Project Creation Wizard
- **Guided Stepper Interface**: Step-by-step creation flow (`General Details` ➔ `Ownership & Team` ➔ `Success Metrics` ➔ `Final Review`).
- **Rich Text Project Description**: Integrated **Tiptap** WYSIWYG editor with support for headings, bold/italic, lists, and task checklists.
- **Ownership Assignment**: Dynamic assignment matching team members, initials, and email addresses.

### 5. 👥 Client CRM & Account Overview
- **Client Directory**: Track active, prospect, and enterprise client relationships with industry tags and account owners.
- **Slide-Over Detail Drawer**: Comprehensive side sheet displaying client metadata, internal notes, associated projects, and contact channels.
- **Client Creation Wizard**: Quick-onboarding modal for new client accounts and account executive assignments.

### 6. ⚙️ Workspace Preferences & System Settings
- **Theme Customizer**: Smooth switching between Light Mode, Dark Mode, and System Theme preferences via `next-themes`.
- **Profile & Account Management**: Profile photo management, name, email updates, and notification settings.
- **Workspace Configuration**: Workspace identifier, name configuration, and teammate role administration.

---

## 🏗️ Architecture & Component Breakdown

```
WorkSpace-Pro/
├── app/                              # Next.js App Router directory
│   ├── layout.tsx                    # Root layout with fonts, theme provider & toast toaster
│   ├── page.tsx                      # Main dashboard controller with active view state
│   ├── globals.css                   # Global styles, Tailwind v4 imports & theme tokens
│   ├── icon.png                      # App favicon asset
│   └── apple-touch-icon.png          # iOS home screen touch icon
│
├── components/                       # Modular UI Components
│   ├── app-sidebar.tsx               # Collapsible navigation sidebar with user profile menu
│   ├── projects-content.tsx          # Main project view container (Table / Timeline / Board / Cards)
│   ├── clients-content.tsx           # Client directory layout and filter controllers
│   ├── performance-content.tsx       # Team velocity and workload analytics dashboard
│   ├── project-timeline.tsx          # Timeline Gantt chart with day/month grid
│   ├── project-board-view.tsx        # Kanban board container
│   ├── project-cards-view.tsx        # Grid card layout
│   │
│   ├── clients/                      # Client CRM module
│   │   ├── ClientDetailsDrawer.tsx   # Slide-over client summary sheet
│   │   ├── ClientDetailsPage.tsx     # Full-page client view
│   │   ├── ClientStatusBadge.tsx     # Color-coded client status badge
│   │   └── ClientWizard.tsx          # Client creation/edit wizard
│   │
│   ├── projects/                     # Project details sub-system
│   │   ├── ProjectDetailsPage.tsx    # Project detail view wrapper
│   │   ├── ProjectHeader.tsx         # Breadcrumbs, title, priority and actions bar
│   │   ├── WorkstreamTab.tsx         # Deliverables, scope, and objectives
│   │   ├── ProjectTasksTab.tsx       # Project task list and status toggles
│   │   ├── NotesTab.tsx              # Meeting notes, rich snippets, and modals
│   │   └── AssetsFilesTab.tsx        # File management, asset cards, and links
│   │
│   ├── project-wizard/               # Multi-step project creation wizard
│   │   ├── ProjectWizard.tsx         # Modal controller and state orchestrator
│   │   ├── Stepper.tsx               # Progress indicator header
│   │   ├── ProjectDescriptionEditor  # Tiptap rich-text WYSIWYG editor
│   │   └── steps/                    # Individual step controllers
│   │
│   ├── tasks/                        # Task planning and execution
│   │   ├── MyTasksPage.tsx           # User-centric task management page
│   │   ├── TaskWeekBoardView.tsx     # Drag-and-drop weekly planner (@dnd-kit)
│   │   ├── TaskQuickCreateModal.tsx  # Fast task creation dialogue
│   │   └── task-helpers.tsx          # Filter counting and task utilities
│   │
│   ├── inbox/                        # Notification and activity center
│   │   └── InboxPage.tsx             # Notification feed with status filters
│   │
│   ├── settings/                     # User & Workspace preferences
│   │   └── SettingsDialog.tsx        # Account, appearance, and teammate settings
│   │
│   └── ui/                           # Reusable design-system primitives (Radix + Tailwind)
│       ├── button.tsx, dialog.tsx, dropdown-menu.tsx, input.tsx, popover.tsx,
│       ├── sidebar.tsx, sheet.tsx, table.tsx, tabs.tsx, tooltip.tsx, sonner.tsx...
│
├── lib/                              # Utilities and Mock Data Layer
│   ├── utils.ts                      # Class-name merging helper (clsx + tailwind-merge)
│   ├── assets/avatars.ts             # Dynamic avatar resolver
│   └── data/                         # Decoupled mock database
│       ├── projects.ts               # Core project seed data & filter counters
│       ├── project-details.ts        # In-depth project scopes, tasks, files & notes
│       ├── clients.ts                # Client accounts and industry segments
│       └── sidebar.ts                # Sidebar menu hierarchy and project shortcuts
│
└── public/                           # Static assets, vector icons & user avatar
    └── avatar-profile.jpg            # User profile image
```

---

## 🎨 UI Design System & Interaction Patterns

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | Framework powering client rendering, dynamic layouts, and static optimization |
| **React 19** | Latest concurrent features, optimized hooks, and component lifecycle |
| **Tailwind CSS v4** | Rapid, themeable utility styling with modern CSS variables |
| **Radix UI Primitives** | WAI-ARIA compliant headless primitives (Dialog, Dropdown, Popover, Tabs, Tooltip, Sheet) |
| **@dnd-kit** | Physics-based, accessible drag-and-drop interaction engine |
| **Tiptap Editor** | Headless, extensible rich-text editing framework |
| **Phosphor Icons & Lucide** | Cohesive, modern iconography tailored for SaaS dashboards |
| **Sonner** | Clean, accessible toast notifications |

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anupam-codespace/WorkSpace-Pro.git
   cd WorkSpace-Pro
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

To create an optimized production build:
```bash
npm run build
npm start
```

---

## 👨‍💻 Author & Contact

**Anupam Saha**  
*Front-End & UI/UX Developer*

- **Email**: [anupamsaha.work@gmail.com](mailto:anupamsaha.work@gmail.com)
- **GitHub**: [@anupam-codespace](https://github.com/anupam-codespace)
- **Repository**: [WorkSpace-Pro](https://github.com/anupam-codespace/WorkSpace-Pro)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
