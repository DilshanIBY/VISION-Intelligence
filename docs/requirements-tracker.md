# VISION Intelligence Requirements Tracker
> **Single Source of Truth** for all project requirements

**Last Updated**: 2026-02-27  
**Current Phase**: Phase 3 - UI/UX Prototype (Mostly Complete) → Phase 5 Sprint 1 (Machine Calculator) next  
**Overall Progress**: 48%  
**PRD Version**: v2.1 (Post-consultant meeting update)

---

## Legend

### Status Icons
| Icon | Status | Applies To |
|------|--------|------------|
| ⬜ | To Do | All |
| 🔄 | In Progress | All |
| 🧪 | In Code Test | Backend |
| 🧑‍💻 | In User Test | UI, Backend |
| ✅ | Done | All |
| ⏸️ | Paused | All |

### Traceability Keys
- **PRD**: Section reference in `docs/prd.md`
- **UI**: User interface component/page
- **DB**: Database table/relationship
- **BE**: Backend endpoint/service

---

# Phase 1: System Skeleton
> **Focus**: Project structure only, no business logic

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P1-001** | Tauri + React + TypeScript project initialization | §11, Phase 1 | UI, BE | ✅ Done |
| **P1-002** | Docker development environment (one-click setup) | §9.1, §11 | BE | ✅ Done |
| **P1-003** | Folder structure following clean architecture | §11, Phase 1 | UI, BE | ✅ Done |
| **P1-004** | Base configuration files (ESLint, Prettier, TypeScript) | §11, Phase 1 | UI, BE | ✅ Done |
| **P1-005** | Empty page shells with routing | §11, Phase 1 | UI | ✅ Done |
| **P1-006** | Design system file structure | §4, §11 | UI | ✅ Done |
| **P1-007** | CI/CD pipeline skeleton (GitHub Actions) | §9.2, §11 | BE | ✅ Done |
| **P1-008** | Professional installers for all platforms (CR) | §9.2, §11 | BE | ✅ Done |

> **CR Note**: P1-008 added via Change Request (2026-02-03) - Windows .msi/.exe, macOS .dmg, Linux .deb/.AppImage

### Phase 1 Exit Criteria
- [x] Project runs in Docker without errors
- [x] All routes navigate correctly (empty pages)
- [x] Build pipeline passes
- [x] Release workflow generates professional installers (CR)


---

# Phase 2: Domain Model & Contracts
> **Focus**: Define the core domain before any implementation

## 2.1 Entities

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P2-ENT-001** | Machine entity interface | §11, Phase 2 | UI, DB, BE | ✅ Done |
| **P2-ENT-002** | Calculation entity interface | §7.1, §11 | UI, DB, BE | ✅ Done |
| **P2-ENT-003** | FloorLayout entity interface | §7.1, §11 | UI, DB, BE | ✅ Done |
| **P2-ENT-004** | Dashboard entity interface | §7.1, §11 | UI, DB, BE | ✅ Done |
| **P2-ENT-005** | Scenario entity interface | §7.1, §11 | UI, DB, BE | ✅ Done |
| **P2-ENT-006** | Project entity interface | §7.1, §11 | UI, DB, BE | ✅ Done |
| **P2-ENT-007** | Organization entity interface | §7.1, §11 | UI, DB, BE | ✅ Done |
| **P2-ENT-008** | User entity interface | §7.1, §11 | UI, DB, BE | ✅ Done |
| **P2-ENT-009** | DashboardWidget entity interface | §7.1, §11 | UI, DB, BE | ✅ Done |
| **P2-ENT-010** | MachineType entity interface | §7.1, §11 | UI, DB, BE | ✅ Done |

## 2.2 States & State Transitions

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P2-STA-001** | Project state machine (draft → active → completed → archived) | §11, Phase 2 | UI, DB, BE | ✅ Done |
| **P2-STA-002** | Calculation state machine (pending → processing → completed → error) | §11, Phase 2 | UI, DB, BE | ✅ Done |
| **P2-STA-003** | FloorLayout state machine (editing → validated → exported) | §11, Phase 2 | UI, DB, BE | ✅ Done |

## 2.3 Events & Triggers

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P2-EVT-001** | Real-time update event definitions | §5.4, §11 | UI, BE | ✅ Done |
| **P2-EVT-002** | Calculation trigger events | §11, Phase 2 | UI, BE | ✅ Done |
| **P2-EVT-003** | Layout validation trigger events | §11, Phase 2 | UI, BE | ✅ Done |

## 2.4 API Contracts

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P2-API-001** | Calculations API contract (machinery, embroidery, layout) | §8.1, §8.2 | BE | ✅ Done |
| **P2-API-002** | Scenarios API contract | §8.1 | BE | ✅ Done |
| **P2-API-003** | Floor Layouts API contract | §8.1 | BE | ✅ Done |
| **P2-API-004** | Dashboards API contract | §8.1 | BE | ✅ Done |
| **P2-API-005** | Projects API contract | §8.1 | BE | ✅ Done |
| **P2-API-006** | Users/Auth API contract | §8.1 | BE | ✅ Done |

## 2.5 Validation Schemas

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P2-VAL-001** | Basic machine calculation input validation | §6.1 | UI, BE | ✅ Done |
| **P2-VAL-002** | Embroidery parameters validation | §6.1 | UI, BE | ✅ Done |
| **P2-VAL-003** | Floor layout input validation | §6.1 | UI, BE | ✅ Done |
| **P2-VAL-004** | Project/Organization validation | §6.1 | UI, BE | ✅ Done |

## 2.6 Type Definitions

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P2-TYP-001** | Shared types between frontend and backend | §11, Phase 2 | UI, BE | ✅ Done |

### Phase 2 Exit Criteria
- [x] All entities have TypeScript interfaces
- [x] All API contracts documented
- [x] State machines defined and documented

---

# Phase 3: UI/UX Prototype
> **Focus**: All pages, windows, flows, and states with mock data only  
> **Agile Loop**: Dev → Build → User Test (browser) → Dev

## 3.1 Design System Components

### 3.1.1 Core Visual Elements

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P3-DS-000** | Global CSS integration & loading | §4.1, §4.2 | UI | ✅ Done |
| **P3-DS-001** | Color palette implementation (Light Mode) | §4.2 | UI | ✅ Done |
| **P3-DS-002** | Color palette implementation (Dark Mode) | §4.2 | UI | ✅ Done |
| **P3-DS-003** | Typography system (SF Pro-inspired) | §4.1 | UI | ✅ Done |
| **P3-DS-004** | Glassmorphism effects (blur, transparency) | §4.1 | UI | ✅ Done |
| **P3-DS-005** | Soft boundaries (rounded corners 20-28px) | §4.1 | UI | ✅ Done |
| **P3-DS-006** | Multi-layer shadows (floating effect) | §4.1 | UI | ✅ Done |
| **P3-DS-007** | Focus states (scale & glow on hover) | §4.1 | UI | ✅ Done |

### 3.1.2 Navigation Components

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P3-NAV-001** | Sidebar (pill-shaped dock, collapsible) | §4.3, §4.4 | UI | ✅ Done |
| **P3-NAV-002** | Top Bar (floating capsule with blur) | §4.3, §4.4 | UI | ✅ Done |
| **P3-NAV-003** | Tab Bar (underline style, scrollable) | §4.3 | UI | ✅ Done |
| **P3-NAV-004** | Breadcrumb navigation | §4.3 | UI | ✅ Done |
| **P3-NAV-005** | Context Menu (right-click actions) | §4.3 | UI | ✅ Done |

### 3.1.3 Input Components

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P3-INP-001** | Text Input (floating label, validation) | §4.3 | UI | ✅ Done |
| **P3-INP-002** | Number Input (+/- buttons, slider sync) | §4.3 | UI | ✅ Done |
| **P3-INP-003** | Select (searchable, grouped options) | §4.3 | UI | ✅ Done |
| **P3-INP-004** | ~~Date Picker (calendar popup, range)~~ | §4.3 | UI | ❌ Removed (v2.0) |
| **P3-INP-005** | ~~Time Picker (12/24hr, duration mode)~~ | §4.3 | UI | ❌ Removed (v2.0) |
| **P3-INP-006** | Slider (range, marks, value tooltip) | §4.3 | UI | ✅ Done |
| **P3-INP-007** | ~~Color Picker (grid selection for threads)~~ | §4.3, §3.1 | UI | ❌ Removed (v2.0) — thread colors now number counter |
| **P3-INP-008** | Toggle (animated switch — Sat/Sun) | §4.3 | UI | ✅ Done |
| **P3-INP-009** | Dimension Input (Width × Length pair) | §4.3 | UI | ✅ Done (v2.0) |
| **P3-INP-010** | Duration Select (Daily/Weekly/Monthly) | §4.3 | UI | ✅ Done (v2.0) |
| **P3-INP-011** | Machine Type CRUD (Add/Edit/Delete per project) | §3.1.3 | UI | ✅ Done (v2.0 mock) |

### 3.1.4 Display Components

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P3-DIS-001** | Card (glassmorphic surface, header actions) | §4.3 | UI | ✅ Done |
| **P3-DIS-002** | Stat Card (large value, trend indicator) | §4.3 | UI | ✅ Done |
| **P3-DIS-003** | Badge (status, count displays) | §4.3 | UI | ✅ Done |
| **P3-DIS-004** | Progress (bar, circular, stepped) | §4.3 | UI | ✅ Done |
| **P3-DIS-005** | Gauge Chart (semi-circle, value indicator) | §4.3, §3.3 | UI | ✅ Done |
| **P3-DIS-006** | Bar Chart (Recharts-based) | §4.3, §3.3 | UI | ✅ Done |
| **P3-DIS-007** | Line Chart (Recharts-based) | §4.3, §3.3 | UI | ✅ Done |
| **P3-DIS-008** | Table (sortable, filterable, virtualized) | §4.3 | UI | ✅ Done |
| **P3-DIS-009** | Toast (notification popups) | §4.3 | UI | ✅ Done |

### 3.1.5 Interactive Components

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P3-INT-001** | Modal (centered, backdrop blur) | §4.3 | UI | ✅ Done |
| **P3-INT-002** | Drawer (side panel, resizable) | §4.3 | UI | ✅ Done |
| **P3-INT-003** | Dropdown (positioned portal) | §4.3 | UI | ✅ Done |
| **P3-INT-004** | Tooltip (delayed, positioned) | §4.3 | UI | ✅ Done |
| **P3-INT-005** | Popover (click-triggered content) | §4.3 | UI | ✅ Done |
| **P3-INT-006** | Drag Handle (grip indicator) | §4.3 | UI | ✅ Done |

## 3.2 Core Pages

### 3.2.1 Dashboard (Home)

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P3-PG-DASH-001** | Dashboard home page layout | §3.3, §4.4 | UI | ✅ Done |
| **P3-PG-DASH-002** | KPI Card widget | §3.3.2 | UI | ✅ Done |
| **P3-PG-DASH-003** | Gauge Chart widget | §3.3.2 | UI | ✅ Done |
| **P3-PG-DASH-004** | Bar Chart widget | §3.3.2 | UI | ✅ Done |
| **P3-PG-DASH-005** | Timeline widget | §3.3.2 | UI | ✅ Done |
| **P3-PG-DASH-006** | Floor Map widget | §3.3.2 | UI | ✅ Done |
| **P3-PG-DASH-007** | Cost Breakdown widget | §3.3.2 | UI | ✅ Done |
| **P3-PG-DASH-008** | Comparison Table widget | §3.3.2 | UI | ✅ Done |
| **P3-PG-DASH-009** | Widget library palette | §3.3.3 | UI | ✅ Done |
| **P3-PG-DASH-010** | Drag to reposition widgets | §3.3.3 | UI | ✅ Done |
| **P3-PG-DASH-011** | Resize widget handles | §3.3.3 | UI | ✅ Done |
| **P3-PG-DASH-012** | Theme presets | §3.3.3 | UI | ⬜ To Do |
| **P3-PG-DASH-013** | Save dashboard layouts | §3.3.3 | UI | ✅ Done |
| **P3-PG-DASH-014** | Presentation mode (full-screen) | §3.3.3 | UI | ✅ Done |

### 3.2.2 Machinery Calculator

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P3-PG-CALC-001** | Machine Requirement Calculator page layout | §3.1 | UI | ✅ Done |
| **P3-PG-CALC-002** | Machine Type searchable dropdown (with CRUD) | §3.1.2, §3.1.3 | UI | ✅ Done |
| **P3-PG-CALC-003** | Target Quantity input + slider | §3.1.2 | UI | ✅ Done |
| **P3-PG-CALC-004** | Working Hours/Day number input | §3.1.2 | UI | ✅ Done |
| **P3-PG-CALC-005** | ~~Deadline calendar picker~~ | §3.1.2 | UI | ❌ Removed (v2.0) |
| **P3-PG-CALC-006** | Efficiency Factor slider with tooltip | §3.1.2 | UI | ✅ Done |
| **P3-PG-CALC-007** | Punch Count input + visual scale (embroidery) | §3.1.2 | UI | ✅ Done |
| **P3-PG-CALC-008** | ~~Thread Colors picker grid (embroidery)~~ — now number counter | §3.1.2 | UI | ✅ Done (v2.0) |
| **P3-PG-CALC-009** | Head Count visual selector (embroidery) | §3.1.2 | UI | ✅ Done |
| **P3-PG-CALC-010** | ~~Machine Speed SPM preset + custom~~ (sewing: removed — consultants feed SMV directly; embroidery: retained in embroidery tab) | §3.1.2 | UI | ❌ Removed (v2.1) |
| **P3-PG-CALC-011** | Machines Required output (large number + icons) | §3.1.4 | UI | ✅ Done |
| **P3-PG-CALC-012** | ~~Production Timeline output (Gantt bar)~~ | §3.1.4 | UI | ❌ Removed (v2.0) |
| **P3-PG-CALC-013** | Daily Output Rate output (progress bar) | §3.1.4 | UI | ✅ Done |
| **P3-PG-CALC-014** | Utilization Rate output (gauge chart) | §3.1.4 | UI | ✅ Done |
| **P3-PG-CALC-015** | Cost Estimate output (currency + breakdown) | §3.1.4 | UI | ✅ Done |
| **P3-PG-CALC-016** | What-If dynamic sliders (real-time update) | §3.1.5, §5.1 | UI | ✅ Done |
| **P3-PG-CALC-017** | Comparison cards (up to 4 scenarios) | §3.1.5, §5.1 | UI | ✅ Done |
| **P3-PG-CALC-018** | Impact indicators (+/- color coding) | §3.1.5, §5.1 | UI | ✅ Done |
| **P3-PG-CALC-019** | Validation warnings display | §3.1.7 | UI | ✅ Done |
| **P3-PG-CALC-020** | SMV (Standard Minute Value) input + slider | §3.1.2 | UI | ✅ Done (v2.0) |
| **P3-PG-CALC-021** | Number of Operators input + slider | §3.1.2 | UI | ✅ Done (v2.0) |
| **P3-PG-CALC-022** | Duration dropdown (daily/weekly/monthly) | §3.1.2 | UI | ✅ Done (v2.0) |
| **P3-PG-CALC-023** | Working Days input + Sat/Sun toggle | §3.1.2 | UI | ✅ Done (v2.0) |
| **P3-PG-CALC-024** | Fusing tab (Product Category, Time/Piece, Daily Qty) | §3.1.2 | UI | ✅ Done (v2.0) |
| **P3-PG-CALC-025** | Handling Time Per Piece (embroidery) | §3.1.2 | UI | ✅ Done (v2.0) |
| **P3-PG-CALC-026** | Data Export (PNG/PDF/Excel) | §3.1.6 | UI | ✅ Done |

### 3.2.3 Floor Layout Calculator

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P3-PG-FLOOR-001** | Floor layout calculator page layout | §3.2 | UI | ✅ Done |
| **P3-PG-FLOOR-002** | Total Operators slider + input | §3.2.3 | UI | ✅ Done |
| **P3-PG-FLOOR-003** | Product Type visual card select | §3.2.3 | UI | ✅ Done |
| **P3-PG-FLOOR-004** | ~~Working Hours time picker~~ | §3.2 | UI | ❌ Removed (v2.0) |
| **P3-PG-FLOOR-005** | Building Floors stack visual | §3.2.3 | UI | ✅ Done |
| **P3-PG-FLOOR-006** | Floor Dimensions input (Width × Length) | §3.2.3 | UI | ✅ Done |
| **P3-PG-FLOOR-007** | Static canvas (fit-to-container, no scroll) | §3.2.5 | UI | ✅ Done (v2.0) |
| **P3-PG-FLOOR-008** | Section blocks (proportional rendering) | §3.2.5 | UI | ✅ Done |
| **P3-PG-FLOOR-009** | Section blocks with colors | §3.2.5 | UI | ✅ Done |
| **P3-PG-FLOOR-010** | Auto-snap to grid | §3.2.5 | UI | ✅ Done |
| **P3-PG-FLOOR-011** | ~~Flow arrows (material flow)~~ | §3.2 | UI | ⏸️ Deferred |
| **P3-PG-FLOOR-012** | ~~Collision detection~~ | §3.2 | UI | ⏸️ Deferred |
| **P3-PG-FLOOR-013** | Multi-floor view (tabs) | §3.2.5 | UI | ✅ Done |
| **P3-PG-FLOOR-014** | ~~Zoom & pan canvas~~ (now static fit-to-container) | §3.2.5 | UI | ❌ Removed (v2.0) |
| **P3-PG-FLOOR-015** | Export layout (PNG/PDF) | §3.2.5 | UI | ✅ Done |
| **P3-PG-FLOOR-016** | ~~Templates (pre-built layouts)~~ | §3.2 | UI | ⏸️ Deferred |
| **P3-PG-FLOOR-017** | ~~Measurement tool~~ | §3.2 | UI | ⏸️ Deferred |
| **P3-PG-FLOOR-018** | ~~Bottleneck detection overlay~~ | §3.2 | UI | ⏸️ Deferred |
| **P3-PG-FLOOR-019** | Percentage labels (section share of total area) | §3.2.5 | UI | ✅ Done (v2.0) |

### 3.2.4 Client Dashboard (⏳ Requirements TBD)

> **Note (v2.1)**: Exact requirements will be provided by VISION consultancy team in a future sprint. UI prototype exists but backend implementation is **blocked** until requirements are received.

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P3-PG-ANAL-001** | Analytics dashboard page layout | §3.3 | UI | ✅ Done |
| **P3-PG-ANAL-002** | Presentation mode (full-screen, auto-cycle) | §3.3.3 | UI | ✅ Done |

### 3.2.5 Settings & Profile

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P3-PG-SET-001** | Settings page layout | §11, Phase 3 | UI | ✅ Done |
| **P3-PG-SET-002** | User profile management UI | §11, Phase 3 | UI | ✅ Done |
| **P3-PG-SET-003** | Theme switcher (Dark/Light) | §4.2 | UI | ✅ Done |
| **P3-PG-SET-004** | Organization settings | §11, Phase 5 | UI | ✅ Done |

## 3.3 UI States & Themes

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P3-ST-001** | Loading states (skeleton loaders) | §11, Phase 3 | UI | ✅ Done |
| **P3-ST-002** | Empty states (no data illustrations) | §11, Phase 3 | UI | ✅ Done |
| **P3-ST-003** | Error states (error messages) | §11, Phase 3 | UI | ✅ Done |
| **P3-ST-004** | Success states (confirmations) | §11, Phase 3 | UI | ✅ Done |
| **P3-ST-005** | Dark mode full implementation | §4.2, §11 | UI | ✅ Done |
| **P3-ST-006** | Light mode full implementation | §4.2, §11 | UI | ✅ Done |

## 3.4 Animations & Transitions

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P3-ANI-001** | Micro-interactions (hover, click) | §4.1, §11 | UI | ✅ Done |
| **P3-ANI-002** | Page transitions | §11, Phase 3 | UI | ✅ Done |
| **P3-ANI-003** | Modal/drawer animations | §11, Phase 3 | UI | ✅ Done |

## 3.5 Mock Data

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P3-MOCK-001** | Mock data files for all components | §11, Phase 3 | UI | ✅ Done |
| **P3-MOCK-002** | Mock calculation results | §11, Phase 3 | UI | ✅ Done |
| **P3-MOCK-003** | Mock floor layouts | §11, Phase 3 | UI | ✅ Done |
| **P3-MOCK-004** | Mock dashboard configurations | §11, Phase 3 | UI | ✅ Done |

### Phase 3 Exit Criteria
- [x] All pages navigable and visually complete
- [x] User can interact with all UI elements (mock responses)
- [x] Dark/Light mode works on all pages
- [x] User testing validates UX flow

---

# Phase 4: Database Design
> **Focus**: Complete database implementation in Supabase

## 4.1 Tables

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P4-TBL-001** | organizations table | §7.1 | DB | ⬜ To Do |
| **P4-TBL-002** | users table | §7.1 | DB | ⬜ To Do |
| **P4-TBL-003** | projects table | §7.1 | DB | ⬜ To Do |
| **P4-TBL-004** | calculations table | §7.1 | DB | ⬜ To Do |
| **P4-TBL-005** | scenarios table | §7.1 | DB | ⬜ To Do |
| **P4-TBL-006** | floor_layouts table | §7.1 | DB | ⬜ To Do |
| **P4-TBL-007** | dashboards table | §7.1 | DB | ⬜ To Do |
| **P4-TBL-008** | dashboard_widgets table | §7.1 | DB | ⬜ To Do |
| **P4-TBL-009** | machine_types table | §7.1 | DB | ⬜ To Do |

## 4.2 Relationships & Constraints

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P4-REL-001** | All foreign key relationships | §7.1 | DB | ⬜ To Do |
| **P4-REL-002** | Cascade delete rules | §7.1 | DB | ⬜ To Do |
| **P4-REL-003** | NOT NULL constraints | §7.1 | DB | ⬜ To Do |
| **P4-REL-004** | CHECK constraints | §7.1 | DB | ⬜ To Do |
| **P4-REL-005** | UNIQUE constraints | §7.1 | DB | ⬜ To Do |

## 4.3 Indexes

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P4-IDX-001** | Performance indexes for common queries | §11, Phase 4 | DB | ⬜ To Do |

## 4.4 Row Level Security

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P4-RLS-001** | Organization isolation policy | §7.2 | DB | ⬜ To Do |
| **P4-RLS-002** | User access policies | §7.2 | DB | ⬜ To Do |

## 4.5 Migrations & Seed Data

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P4-MIG-001** | Versioned migration files | §11, Phase 4 | DB | ⬜ To Do |
| **P4-SEED-001** | Initial machine_types seed data | §11, Phase 4 | DB | ⬜ To Do |
| **P4-SEED-002** | Sample data for testing | §11, Phase 4 | DB | ⬜ To Do |

### Phase 4 Exit Criteria
- [ ] All tables created in Supabase
- [ ] RLS policies active and tested
- [ ] Seed data loaded successfully
- [ ] Migration scripts documented

---

# Phase 5: Backend Logic
> **Focus**: Feature implementation with full integration  
> **Agile Loop**: Dev → Code Test (unit/integration) → Build → User Test (browser + real data) → Dev

## 5.1 Authentication & User Management

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P5-AUTH-001** | Supabase Auth integration | §11, Phase 5 | BE | ⬜ To Do |
| **P5-AUTH-002** | User profile management | §11, Phase 5 | BE | ⬜ To Do |
| **P5-AUTH-003** | Organization context | §11, Phase 5 | BE | ⬜ To Do |
| **P5-AUTH-004** | Role-based access control | §7.1, §11 | BE | ⬜ To Do |

## 5.2 Machinery Calculator (✅ QUOTED — Sprint 1)

> **Timeline**: 6 weeks (3 × 2-week sprints) as per quotation `UNIQUE/2026/Q-021`  
> **Budget**: LKR 250,000  
> **Priority**: This is the quoted and actively developed deliverable

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P5-CALC-001** | Basic machine calculation engine | §3.1, §8.1 | BE | ⬜ To Do |
| **P5-CALC-002** | Embroidery calculation (with head count logic) | §3.1.2, §8.2 | BE | ⬜ To Do |
| **P5-CALC-003** | Validation rule engine | §6.1, §6.2 | BE | ⬜ To Do |
| **P5-CALC-004** | What-If scenario management | §5.1, §8.1 | BE | ⬜ To Do |
| **P5-CALC-005** | Results persistence (save calculations) | §7.1, §8.1 | DB, BE | ⬜ To Do |
| **P5-CALC-006** | POST /api/calculations/machinery endpoint | §8.1 | BE | ⬜ To Do |
| **P5-CALC-007** | POST /api/calculations/embroidery endpoint | §8.1 | BE | ⬜ To Do |
| **P5-CALC-008** | GET /api/calculations/:id endpoint | §8.1 | BE | ⬜ To Do |
| **P5-CALC-009** | GET /api/calculations/project/:projectId endpoint | §8.1 | BE | ⬜ To Do |

## 5.3 Floor Layout Calculator (Separate Quotation)

> **Note (v2.1)**: Will be quoted separately after Sprint 1 (Machine Calculator) completion.

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P5-FLOOR-001** | Space calculation engine | §3.2.4, §11 | BE | ⬜ To Do |
| **P5-FLOOR-002** | Department positioning logic | §5.2 | BE | ⬜ To Do |
| **P5-FLOOR-003** | Bottleneck detection algorithms | §3.2.6, §6.2 | BE | ⬜ To Do |
| **P5-FLOOR-004** | Flow efficiency scoring | §6.2 | BE | ⬜ To Do |
| **P5-FLOOR-005** | Layout save/load operations | §8.1 | DB, BE | ⬜ To Do |
| **P5-FLOOR-006** | Export (PNG/PDF) | §3.2.5, §8.1 | BE | ⬜ To Do |
| **P5-FLOOR-007** | POST /api/layouts endpoint | §8.1 | BE | ⬜ To Do |
| **P5-FLOOR-008** | GET /api/layouts/:id endpoint | §8.1 | BE | ⬜ To Do |
| **P5-FLOOR-009** | PUT /api/layouts/:id endpoint | §8.1 | BE | ⬜ To Do |
| **P5-FLOOR-010** | DELETE /api/layouts/:id endpoint | §8.1 | BE | ⬜ To Do |
| **P5-FLOOR-011** | POST /api/layouts/:id/validate endpoint | §8.1 | BE | ⬜ To Do |
| **P5-FLOOR-012** | POST /api/layouts/:id/export endpoint | §8.1 | BE | ⬜ To Do |
| **P5-FLOOR-013** | POST /api/calculations/layout endpoint | §8.1 | BE | ⬜ To Do |

## 5.4 Client Dashboard (⏳ Requirements TBD)

> **Note (v2.1)**: Exact requirements to be provided by VISION consultancy team. Implementation blocked until received.

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P5-DASH-001** | Dashboard CRUD operations | §8.1, §11 | DB, BE | ⬜ To Do |
| **P5-DASH-002** | Widget data binding | §3.3.2 | BE | ⬜ To Do |
| **P5-DASH-003** | Real-time updates (Supabase Realtime) | §11, Phase 5 | BE | ⬜ To Do |
| **P5-DASH-004** | Presentation mode logic | §3.3.3 | BE | ⬜ To Do |
| **P5-DASH-005** | Dashboard templates | §3.3.3 | DB, BE | ⬜ To Do |
| **P5-DASH-006** | GET /api/dashboards endpoint | §8.1 | BE | ⬜ To Do |
| **P5-DASH-007** | POST /api/dashboards endpoint | §8.1 | BE | ⬜ To Do |
| **P5-DASH-008** | GET /api/dashboards/:id endpoint | §8.1 | BE | ⬜ To Do |
| **P5-DASH-009** | PUT /api/dashboards/:id endpoint | §8.1 | BE | ⬜ To Do |
| **P5-DASH-010** | DELETE /api/dashboards/:id endpoint | §8.1 | BE | ⬜ To Do |
| **P5-DASH-011** | POST /api/dashboards/:id/duplicate endpoint | §8.1 | BE | ⬜ To Do |

## 5.5 Scenarios

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P5-SCEN-001** | POST /api/scenarios endpoint | §8.1 | BE | ⬜ To Do |
| **P5-SCEN-002** | GET /api/scenarios/:calculationId endpoint | §8.1 | BE | ⬜ To Do |
| **P5-SCEN-003** | PUT /api/scenarios/:id endpoint | §8.1 | BE | ⬜ To Do |
| **P5-SCEN-004** | DELETE /api/scenarios/:id endpoint | §8.1 | BE | ⬜ To Do |
| **P5-SCEN-005** | POST /api/scenarios/compare endpoint | §8.1 | BE | ⬜ To Do |

## 5.6 Projects & Data Management

> **Note (v2.1)**: Analytics sprint separated from Dashboard sprint. Exact analytics requirements TBD.

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P5-PROJ-001** | Project CRUD operations | §8.1, §11 | DB, BE | ⬜ To Do |
| **P5-PROJ-002** | Calculation history | §11, Phase 5 | DB, BE | ⬜ To Do |
| **P5-PROJ-003** | Data export/import | §11, Phase 5 | BE | ⬜ To Do |
| **P5-PROJ-004** | Search functionality | §11, Phase 5 | BE | ⬜ To Do |

## 5.7 UI-Backend Integration

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P5-INT-001** | Connect Machinery Calculator to backend | §3.1 | UI, BE | ⬜ To Do |
| **P5-INT-002** | Connect Floor Layout Planner to backend | §3.2 | UI, BE | ⬜ To Do |
| **P5-INT-003** | Connect Analytics Dashboard to backend | §3.3 | UI, BE | ⬜ To Do |
| **P5-INT-004** | Connect Settings/Profile to backend | §11, Phase 5 | UI, BE | ⬜ To Do |
| **P5-INT-005** | Replace mock data with real API calls | §11, Phase 5 | UI, BE | ⬜ To Do |

## 5.8 Testing

| ID | Requirement | PRD Ref | Traceability | Status |
|----|-------------|---------|--------------|--------|
| **P5-TEST-001** | Unit tests for calculation functions (Vitest) | §11, Phase 5 | BE | ⬜ To Do |
| **P5-TEST-002** | Integration tests for API endpoints (Vitest + Supabase) | §11, Phase 5 | BE | ⬜ To Do |
| **P5-TEST-003** | E2E tests for critical flows (Playwright) | §11, Phase 5 | UI, BE | ⬜ To Do |

### Phase 5 Exit Criteria
- [ ] All features functional with real database
- [ ] Unit test coverage > 80% on core logic
- [ ] E2E tests pass for critical flows
- [ ] User testing validates functionality
- [ ] Production builds work on Windows/Mac/Linux

---

# Progress Summary

| Phase | Total | ⬜ To Do | 🔄 In Progress | ❌ Removed | ⏸️ Deferred | ✅ Done | % Complete |
|-------|-------|---------|----------------|-----------|-------------|--------|------------|
| Phase 1: Skeleton | 8 | 0 | 0 | 0 | 0 | 8 | 100% |
| Phase 2: Domain | 22 | 0 | 0 | 0 | 0 | 22 | 100% |
| Phase 3: UI/UX | 84 | 1 | 0 | 7 | 4 | 72 | 86% |
| Phase 4: Database | 15 | 15 | 0 | 0 | 0 | 0 | 0% |
| Phase 5: Backend | 48 | 48 | 0 | 0 | 0 | 0 | 0% |
| **TOTAL** | **177** | **64** | **0** | **7** | **4** | **102** | **58%** |

---

# Change Log

| Date | Version | Changes | By |
|------|---------|---------|----| 
| 2026-02-03 | 1.6 | Identified Global CSS loading issue, added P3-DS-000 | Agent |
| 2026-02-03 | 1.1 | Phase 1: System Skeleton completed (P1-001 to P1-007) | Agent |
| 2026-02-03 | 1.2 | CR: Added P1-008 - Professional installers for all platforms | Agent |
| 2026-02-03 | 1.3 | Phase 2.1: Entities completed (P2-ENT-001 to P2-ENT-010) | Agent |
| 2026-02-03 | 1.4 | Phase 2.2: State Machines completed (P2-STA-001 to P2-STA-003) | Agent |
| 2026-02-03 | 1.5 | Phase 2.3: Events & Triggers completed (P2-EVT-001 to P2-EVT-003) | Agent |
| 2026-02-27 | 2.0 | **v2.0 Pivot**: Renamed to VISION Intelligence. Marked removed items (Deadline, Color Picker, SPM basic, Production Timeline, Working Hours floor). Added new items (SMV, Operators, Duration, Working Days, Fusing tab, Machine CRUD). Updated Floor Layout to Calculator. Updated progress. | Agent |
| 2026-02-27 | 2.1 | **v2.1 Post-Consultant Meeting**: Machine Speed SPM removed from sewing tab (P3-PG-CALC-010). Dashboard & Analytics marked as "Requirements TBD — Future Sprint". Sprint ordering updated (Dashboard=Sprint 3, Analytics=Sprint 4, Auth=Sprint 5). Accuracy prioritized over UI aesthetics. Machine Calculator marked as ✅ QUOTED active module. | Agent |
| 2026-02-27 | 2.2 | **UI Refinements**: Added Excel export option to ExportPanel (P3-PG-CALC-026 ✅). Fixed TopBar logo styling — replaced blue bg-primary/shadow-glow-primary with red-harmonious white bg + red ring/glow. | Agent |


---

# Notes for Future Chats

> **Agent Instructions**:
> 1. Read both `docs/prd.md` and this Requirements Tracker
> 2. Identify the current project step and progress from this tracker
> 3. Continue work from the **next valid step** (first ⬜ To Do in current phase)
> 4. Update this tracker accordingly after completing work
> 5. **DO NOT** repeat completed work
> 6. **DO NOT** skip steps or phases

### Status Update Rules
- **UI requirements**: ⬜ → 🔄 → 🧑‍💻 → ✅ (or ⏸️)
- **Backend requirements**: ⬜ → 🔄 → 🧪 → 🧑‍💻 → ✅ (or ⏸️)
- **Other requirements**: ⬜ → 🔄 → ✅ (or ⏸️)
