<div align="center">

# WorkSpace Pro

### High-Performance Project and Workspace Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Primitives-161618?style=flat-square&logo=radix-ui&logoColor=white)](https://www.radix-ui.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production_Live-0070F3?style=flat-square&logo=vercel)](https://workspace-pro-chi.vercel.app)

<p align="center">
  A production-ready project and workspace management interface engineered with Next.js App Router, React 19, Radix UI, and Tailwind CSS. Built to demonstrate high-density data visualization, accessible interaction primitives, and stateful frontend workflows.
</p>

<p align="center">
  <a href="https://workspace-pro-chi.vercel.app" target="_blank"><strong>Live Demo</strong></a> &bull;
  <a href="https://github.com/anupam-codespace/WorkSpace-Pro" target="_blank"><strong>GitHub Repository</strong></a> &bull;
  <a href="#interactive-modules-and-user-capabilities"><strong>User Interactions</strong></a> &bull;
  <a href="#frontend-technical-specifications"><strong>Frontend Technicalities</strong></a> &bull;
  <a href="#how-to-use-the-application"><strong>How to Use</strong></a> &bull;
  <a href="#getting-started"><strong>Setup Guide</strong></a>
</p>

---

</div>

## Overview

WorkSpace Pro is a full-featured frontend dashboard engineered for cross-functional teams, engineering leads, and project managers. The platform consolidates roadmap planning, weekly task scheduling, client relationship management, and project specification authoring into a unified, responsive single-page architecture.

Rather than relying on static placeholders, WorkSpace Pro implements complete end-to-end user workflows: interactive multi-view representations of project data, physics-based drag-and-drop task sorting, rich-text WYSIWYG specification editing, slide-over detail sheets, multi-faceted filtering, and dark/light mode personalization.

---

## Frontend Technical Specifications

The application is built on modern web standards with an emphasis on performance, type safety, component decoupling, and accessibility.

### 1. Framework and Component Architecture
- **Next.js 16 (App Router)**: Uses layout hierarchies, optimized font delivery (`Geist`), and streaming UI boundaries.
- **React 19**: Employs concurrent rendering patterns, strict typing across component contracts, and optimized state hooks (`useMemo`, `useCallback`, `useTransition`).
- **TypeScript Strict Mode**: Fully typed data models for projects, clients, tasks, filter chips, and user records, eliminating runtime undefined errors.

### 2. Physics-Based Drag-and-Drop Subsystem
- **@dnd-kit/core & @dnd-kit/sortable**: Powers the interactive weekly task planner.
- Uses collision detection algorithms (`closestCorners` / `rectIntersection`) and CSS transform utilities to support smooth 60fps reordering without layout thrashing.
- Accessible keyboard sensors enable keyboard-driven task movement across days of the week.

### 3. Headless Design System & Accessibility
- **Radix UI Headless Primitives**: Forms the foundation of all overlays, dialogs, dropdowns, popovers, tooltips, and slide-over sheets.
- Follows WAI-ARIA authoring practices with proper focus traps, keyboard navigation (`Escape`, arrow keys, tab indexing), and screen reader labeling.
- **Tailwind CSS v4**: Themeable design token system utilizing CSS variables for real-time switching between Light, Dark, and System color schemes via `next-themes`.

### 4. Rich-Text WYSIWYG Engine
- **Tiptap Core**: Headless prose editor integrated inside the project creation wizard.
- Supports structured documentation blocks including headings, formatted paragraphs, bulleted lists, and interactive task checklists with custom CSS typography overrides.

### 5. Multi-Criteria Filtering Engine
- Dynamically parses query states across four independent axes: Team Member/Assignee, Project Status, Priority Level, and Custom Category Tags.
- Real-time bucket count calculation automatically updates available item badges without mutating source datasets.

---

## Interactive Modules and User Capabilities

WorkSpace Pro provides extensive interactive touchpoints across six specialized modules:

### 1. Multi-View Project Dashboard
Users can toggle between four visual layouts representing the exact same project records:
- **Interactive Gantt Timeline**: Visual timeline bars spanning delivery dates. Users can drag duration handles, examine sprint boundaries, and view deliverable milestones against a calendar grid.
- **Kanban Board View**: Column-based task and project tracking grouped by progress stages (`Backlog`, `To Do`, `In Progress`, `Review`, `Done`).
- **Sortable Table View**: High-density data grid displaying status badges, priorities, assignees, client associations, and progress percentages.
- **Visual Card Grid**: Scannable card representation highlighting client badges, progress circles, tag collections, and team avatars.
- **Filter Popover**: Multi-select filter menu allowing users to filter by owner, status, priority, or tags, generating removable filter chips.

### 2. Weekly Task Planner (My Tasks)
- **Personalized Filter**: Automatically filters tasks assigned to the current user (Anupam) across all active workspaces.
- **Drag-and-Drop Organization**: Users can pick up task cards and move them between different days of the week to reschedule workloads.
- **One-Click Completion**: Checkbox triggers that instantly toggle task completion states with visual strike-through feedback.
- **Quick Create Task Modal**: Floating modal for creating new tasks with priority dropdowns, assignee selectors, and status pickers.

### 3. Multi-Step Project Creation Wizard
- **Guided Stepper**: Structured four-step wizard covering Intent Definition, Ownership Assignment, Success Metric Tracking, and Final Review.
- **WYSIWYG Scoping**: Interactive text editor for authoring rich project descriptions, bullet points, and deliverables directly within the wizard modal.
- **Team Assignment**: Dynamic dropdown for selecting project leads and team members with automatic avatar and initial generation.

### 4. Deep-Dive Project Workspace
Clicking any project opens a comprehensive detail view equipped with four contextual tabs:
- **Workstream Tab**: Clear demarcation of in-scope vs. out-of-scope objectives, key deliverables, and client outcomes.
- **Tasks Tab**: Itemized project task lists with status badges, assignee avatars, and filter tabs.
- **Notes Tab**: Grid of project meeting notes and technical briefs. Users can click to open a rich modal preview or trigger note creation modals.
- **Assets & Files Tab**: Document repository organizing Figma designs, ZIP archives, and PDF specifications with file-type recognition icons.

### 5. Client Relationship Management (CRM)
- **Client Directory**: Track active, prospect, and enterprise accounts along with industry classifications and locations.
- **Slide-Over Detail Drawer**: Clicking any client opens a non-disruptive right-side sheet containing client contact details, notes, contract history, and linked projects.
- **Client Creation Modal**: Dedicated wizard to add new client accounts, contact emails, and assigned account leads.

### 6. Workspace Settings and Preferences
- **Appearance Settings**: One-click toggle between Dark Mode, Light Mode, and System Default.
- **Profile Management**: Profile name and email updates (`anupamsaha.work@gmail.com`) with avatar image previews.
- **Teammate Administration**: View active workspace members, role assignments (Admin, Member), and invite configurations.

---

## How to Use the Application

Follow this guide to explore the primary workflows of WorkSpace Pro:

### Step 1: Navigating and Filtering Projects
1. Launch the dashboard at [https://workspace-pro-chi.vercel.app](https://workspace-pro-chi.vercel.app).
2. Use the view toggle buttons in the top toolbar to switch between **Table**, **Timeline**, **Board**, and **Card** views.
3. Click the **Filter** button to open the filter popover. Select filters (e.g., Priority: High or Status: Active) and click **Apply** to see filtered results with dynamic chips.
4. Click the search bar (`Cmd+K` / `Ctrl+K`) to filter projects in real-time by name or client.

### Step 2: Managing Tasks with Drag-and-Drop
1. Navigate to **My Tasks** from the left-hand navigation sidebar.
2. In the weekly planner board, click and hold any task card to drag it to a new day column (Monday through Friday).
3. Click the checkbox next to any task to mark it as complete.
4. Click the **+ New Task** button to open the quick-create modal, enter task details, set priority, and save.

### Step 3: Launching a Project via the Wizard
1. Click the **New Project** button located in the top navigation or sidebar.
2. Step through the wizard: define project name and intent, author description details in the rich text editor, assign ownership to team members, set metric targets, and verify summary data in the review screen.
3. Submit the wizard to add the newly scoped project to your active project catalog.

### Step 4: Accessing Client Accounts
1. Select **Clients** from the navigation sidebar.
2. Click any client row to trigger the slide-over detail drawer on the right side of the screen.
3. Review primary contact emails, account status, location details, and associated project lists without navigating away from the current view.

---

## Technical Stack Summary

- **Core Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & Layout**: Tailwind CSS v4, PostCSS
- **Headless UI Primitives**: Radix UI (Dialog, Dropdown Menu, Popover, Sheet, Tabs, Tooltip, Collapsible, Accordion)
- **Drag-and-Drop Interaction**: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- **Text Editing**: Tiptap Core, StarterKit, TaskList extensions
- **Iconography**: Phosphor Icons, Lucide React
- **Notifications**: Sonner Toaster
- **Deployment & Hosting**: Vercel Production Infrastructure

---

## Getting Started

### Prerequisites
- Node.js version 18.0.0 or higher
- npm, pnpm, or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anupam-codespace/WorkSpace-Pro.git
   cd WorkSpace-Pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Building for Production

Compile and bundle the production application:
```bash
npm run build
npm start
```

---
---

