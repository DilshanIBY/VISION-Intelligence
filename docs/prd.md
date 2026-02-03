# APPAREL
## Product Requirements Document v1.0

> *Where Apparel Intelligence Meets Elegant Design*

---

# 1. Executive Summary

## 1.1 Problem Statement
Apparel industry consultants lack specialized software tools to quickly calculate machinery requirements, plan factory floor layouts, and present data-driven recommendations to clients during live business meetings. Current methods rely on manual Excel calculations, which are slow, error-prone, and unprofessional for Industry 4.0 consulting engagements.

## 1.2 Solution Overview
**APPAREL** is a premium desktop application providing real-time machinery calculation, interactive floor layout planning, and presentation-ready dashboards for apparel industry consultants.

## 1.3 Key Goals
| Goal | Success Metric |
|------|----------------|
| Instant Calculations | < 2 seconds for any machinery/layout computation |
| Professional Presentations | Dashboard directly usable in client meetings |
| Accuracy | Zero manual calculation errors |
| User Adoption | Complete workflow in ≤ 5 clicks |

## 1.4 Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend | TypeScript, React, TailwindCSS |
| Desktop | Tauri (Rust) |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| DevOps | Docker, GitHub Actions |

---

# 2. User Personas

## 2.1 Primary: Industry Consultant
- **Role**: Senior consultant at apparel consulting firm
- **Goals**: Quick calculations during client meetings, professional presentations
- **Pain Points**: Manual Excel work, unprofessional tools, slow what-if analysis
- **Tech Level**: Intermediate (comfortable with business software)

## 2.2 Secondary: Factory Planner
- **Role**: In-house planning team at manufacturing facility
- **Goals**: Optimize floor layouts, capacity planning
- **Pain Points**: Trial-and-error layouts, capacity bottlenecks
- **Tech Level**: Basic to Intermediate

---

# 3. Core Modules

## 3.1 Module 1: Machinery Calculator

### 3.1.1 Overview
Calculates machine requirements based on production parameters with special focus on embroidery operations.

### 3.1.2 Input Parameters

#### Basic Machine Calculation
| Parameter | Type | Validation | UI Component |
|-----------|------|------------|--------------|
| Machine Type | Select | Required | Searchable Dropdown |
| Target Quantity | Number | > 0 | Numeric Input + Slider |
| Working Hours/Day | Number | 1-24 | Time Picker |
| Deadline | Date | ≥ Today | Calendar Picker |
| Efficiency Factor | Percentage | 50-100% | Slider with tooltip |

#### Embroidery-Specific Parameters
| Parameter | Type | Validation | UI Component |
|-----------|------|------------|--------------|
| Punch Count | Number | > 0, ≤ 50000 | Numeric + Visual Scale |
| Thread Colors | Number | 1-15 | Color Picker Grid |
| Head Count | Number | 1-21 | Visual Head Selector |
| Machine Speed (SPM) | Number | 100-1200 | Preset + Custom |

### 3.1.3 Output Display
| Output | Visualization |
|--------|---------------|
| Machines Required | Large number + icon grid |
| Production Timeline | Gantt-style bar |
| Daily Output Rate | Progress arc |
| Utilization Rate | Gauge chart |
| Cost Estimate | Currency display with breakdown |

### 3.1.4 What-If Playground
- **Dynamic Sliders**: Adjust any input parameter in real-time
- **Comparison Cards**: Save up to 4 scenarios side-by-side
- **Impact Indicators**: Show +/- changes with color coding

### 3.1.5 Validation Rules
```
RULE: Head Count Capacity
IF target_quantity / available_time > head_count * machine_speed
THEN show_warning("Head count insufficient for target")

RULE: Realistic Timeline  
IF calculated_days < 1
THEN show_info("Consider batching with other orders")

RULE: Color Change Time
IF thread_colors > 8
THEN add_warning("High color count significantly impacts time")
```

---

## 3.2 Module 2: Floor Layout Planner

### 3.2.1 Overview
Visual drag-and-drop factory floor planning with automatic space calculations.

### 3.2.2 Input Parameters
| Parameter | Type | Validation | UI Component |
|-----------|------|------------|--------------|
| Total Operators | Number | 10-10000 | Slider + Input |
| Product Type | Select | Required | Visual Card Select |
| Working Hours | Number | 1-24 | Time Picker |
| Building Floors | Number | 1-10 | Floor Stack Visual |
| Floor Dimensions | Number | > 0 | Dimension Input |

### 3.2.3 Product Type Categories
| Type | Code | Space Modifier | Departments |
|------|------|----------------|-------------|
| Innerwear | IW | 0.85x | Standard |
| Outerwear | OW | 1.15x | + Heavy Cutting |
| Casual | CS | 1.0x | Standard |
| Wash & Casual | WC | 1.25x | + Wash Bay |
| Sportswear | SW | 1.1x | + Sublimation |

### 3.2.4 Department Space Rules
| Department | Base Formula | Min Area |
|------------|--------------|----------|
| Warehouse | operators × 0.8 m² | 100 m² |
| Cutting | sewing_area × 0.25 | 50 m² |
| Sewing | operators × 6 m² | 200 m² |
| Embroidery | machines × 15 m² | 30 m² |
| Finishing | sewing_area × 0.18 | 40 m² |
| Packing | sewing_area × 0.12 | 30 m² |
| Utilities | total × 0.08 | 20 m² |

### 3.2.5 Visual Floor Planner Features
- **Drag & Drop Departments**: Place colored blocks on grid
- **Auto-Snap**: Departments snap to grid alignment
- **Flow Arrows**: Visual material flow indicators
- **Collision Detection**: Prevent overlapping departments
- **Multi-Floor View**: 3D isometric or floor tabs
- **Zoom & Pan**: Canvas navigation controls
- **Export**: PNG/PDF for presentations

### 3.2.6 Bottleneck Detection
```
RULE: Cutting-Sewing Balance
IF cutting_capacity > sewing_capacity * 1.2
THEN highlight_bottleneck("Cutting", "Over-capacity vs Sewing")

RULE: Finishing Constraint
IF finishing_area < sewing_area * 0.15
THEN highlight_bottleneck("Finishing", "Undersized for production")

RULE: Flow Efficiency
IF department_adjacency_score < 0.7
THEN suggest_optimization("Consider rearranging for better flow")
```

---

## 3.3 Module 3: Analytics Dashboard

### 3.3.1 Overview
Presentation-ready dashboards with draggable widgets for live client meetings.

### 3.3.2 Dashboard Components (Widgets)

| Widget | Type | Data Source | Size Options |
|--------|------|-------------|--------------|
| KPI Card | Static | Any metric | 1x1, 2x1 |
| Gauge Chart | Dynamic | Utilization | 1x1 |
| Bar Chart | Comparative | Multi-scenario | 2x2, 3x2 |
| Timeline | Temporal | Production schedule | 3x1, 4x1 |
| Floor Map | Visual | Layout planner | 2x2, 3x3 |
| Cost Breakdown | Detailed | Calculations | 2x2 |
| Comparison Table | Data | Scenarios | 2x2, 3x2 |

### 3.3.3 Dashboard Customization
- **Drag to Reposition**: Move widgets freely
- **Resize Handles**: Adjust widget dimensions
- **Widget Library**: Add new widgets from palette
- **Theme Presets**: Quick-apply color schemes
- **Save Layouts**: Store named dashboard configurations
- **Presentation Mode**: Full-screen, auto-cycle option

### 3.3.4 Data Visualization Principles
| Data Type | Visualization Style |
|-----------|---------------------|
| Percentages | Gauge, Progress Bar, Donut |
| Counts | Large Number, Icon Grid |
| Comparisons | Side-by-Side Cards, Bar Chart |
| Trends | Line Chart, Sparkline |
| Hierarchies | Treemap, Nested Cards |
| Geographic | Floor Map, Regional Heatmap |

---

# 4. UI/UX Design System

## 4.1 Design Philosophy: Apple Vision Pro Inspired

APPAREL's interface draws heavy inspiration from **Apple Vision Pro's visionOS** design language, creating an immersive, spatial, and premium experience on desktop.

### Core Vision Pro Design Principles
| Principle | Implementation |
|-----------|----------------|
| **Spatial Design** | Layered UI with depth, floating panels, z-axis hierarchy |
| **Glass Materials** | Translucent surfaces with blur, light-reactive backgrounds |
| **Soft Boundaries** | Heavily rounded corners (20-28px radius), no harsh edges |
| **Ambient Lighting** | Subtle gradients that respond to content, glow effects |
| **Focus States** | Prominent hover/selection states with scale & glow |
| **Typography** | SF Pro-inspired clean sans-serif, generous letter-spacing |
| **Depth & Shadow** | Multi-layer shadows creating floating effect |
| **Minimalism** | Icon-first navigation, hidden complexity |

## 4.2 Color Palette

### Light Mode
| Role | Color | Hex |
|------|-------|-----|
| Primary | Deep Blue | #1E40AF |
| Secondary | Teal | #0D9488 |
| Accent | Amber | #F59E0B |
| Background | Off-White | #F8FAFC |
| Surface | White | #FFFFFF |
| Glass | White 60% | rgba(255,255,255,0.6) |
| Text Primary | Slate 900 | #0F172A |
| Text Secondary | Slate 500 | #64748B |
| Success | Green | #10B981 |
| Warning | Orange | #F97316 |
| Error | Red | #EF4444 |

### Dark Mode
| Role | Color | Hex |
|------|-------|-----|
| Primary | Light Blue | #60A5FA |
| Secondary | Teal Light | #2DD4BF |
| Accent | Amber | #FBBF24 |
| Background | Slate 950 | #020617 |
| Surface | Slate 900 | #0F172A |
| Glass | Slate 800 40% | rgba(30,41,59,0.4) |
| Text Primary | White | #FFFFFF |
| Text Secondary | Slate 400 | #94A3B8 |

## 4.3 Component Library

### Navigation
| Component | Description |
|-----------|-------------|
| Sidebar | Collapsible, icon+text, nested groups |
| Top Bar | Breadcrumb, search, quick actions |
| Tab Bar | Underline style, scrollable |
| Context Menu | Right-click actions |

### Inputs
| Component | Description |
|-----------|-------------|
| Text Input | Floating label, validation states |
| Number Input | +/- buttons, slider sync option |
| Select | Searchable, grouped options |
| Date Picker | Calendar popup, range support |
| Time Picker | 12/24hr, duration mode |
| Slider | Range, marks, value tooltip |
| Color Picker | Grid selection for threads |
| Toggle | Animated switch |

### Display
| Component | Description |
|-----------|-------------|
| Card | Glassmorphic surface, header actions |
| Stat Card | Large value, trend indicator |
| Badge | Status, count displays |
| Progress | Bar, circular, stepped |
| Gauge | Semi-circle, value indicator |
| Chart | Recharts-based components |
| Table | Sortable, filterable, virtualized |
| Toast | Notification popups |

### Interactive
| Component | Description |
|-----------|-------------|
| Modal | Centered, backdrop blur |
| Drawer | Side panel, resizable |
| Dropdown | Positioned portal |
| Tooltip | Delayed, positioned |
| Popover | Click-triggered content |
| Drag Handle | Grip indicator |

## 4.4 Layout Patterns

### Main Application Shell (Vision Pro Inspired)
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ╭─────────────────────────────────────────────────────────╮   │
│  │  � APPAREL              🔍          ☀️  👤  ⚙️         │   │ ← Floating Top Bar
│  ╰─────────────────────────────────────────────────────────╯   │
│                                                                 │
│  ╭──────╮                                                      │
│  │  📊  │    ╭────────────────────────────────────────────╮   │
│  │  🔧  │    │                                            │   │
│  │  📐  │    │     ╭─────────────╮  ╭─────────────╮       │   │
│  │  📈  │    │     │ Glass Card  │  │ Glass Card  │       │   │
│  │ ──── │    │     │  (floating) │  │  (floating) │       │   │
│  │  ⚙️  │    │     ╰─────────────╯  ╰─────────────╯       │   │
│  ╰──────╯    │                                            │   │
│    ↑         │         Main Content (Blurred BG)          │   │
│  Pill Dock   ╰────────────────────────────────────────────╯   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Layout Elements
| Element | Vision Pro Style |
|---------|------------------|
| Sidebar | Pill-shaped dock, icon-only default, expands on hover |
| Top Bar | Floating capsule with blur, not edge-attached |
| Cards | Floating with heavy border-radius, glass background |
| Modals | Centered floating panels with backdrop blur |
| Buttons | Rounded, subtle gradients, scale on hover |

## 4.5 Iconography
| Category | Style | Library |
|----------|-------|---------|
| Navigation | Outlined, 24px | Lucide React |
| Actions | Filled on hover | Lucide React |
| Status | Solid, colorized | Custom SVG |
| Apparel-Specific | Custom illustrated | Custom SVG |

---

# 5. Interactive Features & Playgrounds

## 5.1 What-If Scenario Engine

### Features
- **Live Calculation**: Results update as inputs change
- **Scenario Slots**: Save/compare up to 4 scenarios
- **Delta Indicators**: Show change from baseline
- **Undo/Redo**: History of parameter changes
- **Share Scenario**: Export as shareable link/file

### UI Layout
```
┌──────────────────────────────────────────────────────────┐
│ WHAT-IF SCENARIO PLAYGROUND                     [Save]   │
├──────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────┐ │
│ │  Baseline   │ │ Scenario A  │ │ Scenario B  │ │ [+] │ │
│ │  ────────   │ │  ────────   │ │  ────────   │ └─────┘ │
│ │  5 Machines │ │  3 Machines │ │  7 Machines │         │
│ │  $50,000    │ │  $30,000 ↓  │ │  $70,000 ↑  │         │
│ │  15 days    │ │  25 days ↑  │ │  10 days ↓  │         │
│ └─────────────┘ └─────────────┘ └─────────────┘         │
├──────────────────────────────────────────────────────────┤
│ PARAMETERS                                               │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Quantity        [====●==========] 10,000           │  │
│ │ Head Count      [==●============] 6                │  │
│ │ Punch Count     [=======●=======] 5,000            │  │
│ │ Thread Colors   [●==============] 2                │  │
│ │ Deadline        [📅 Mar 15, 2026]                  │  │
│ └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## 5.2 Visual Floor Planner

### Features
- **Grid Canvas**: Zoomable, pannable workspace
- **Department Palette**: Drag department blocks to canvas
- **Auto-Size**: Departments sized by calculated area
- **Connection Lines**: Show material flow paths
- **Validation Overlay**: Highlight bottlenecks in red
- **Multi-Floor**: Tab or 3D view for vertical factories
- **Templates**: Pre-built layouts for common configurations
- **Measurement Tool**: Distance and area calculations

### Department Blocks
| Dept | Icon | Color | Shape |
|------|------|-------|-------|
| Warehouse | 📦 | Yellow | Rectangle |
| Cutting | ✂️ | Orange | Rectangle |
| Sewing | 🧵 | Blue | Large Rectangle |
| Embroidery | 🎨 | Purple | Square |
| Finishing | ✅ | Green | Rectangle |
| Packing | 📤 | Teal | Rectangle |
| Utilities | ⚡ | Gray | Irregular |

### Interaction Flow
```
1. Set Parameters (operators, product type, floors)
2. System calculates required areas
3. Department blocks appear in palette with sizes
4. User drags blocks to floor grid
5. System shows warnings for:
   - Overlapping departments
   - Flow inefficiencies
   - Capacity imbalances
6. User adjusts until validation passes
7. Export or save layout
```

---

# 6. Data Validation & Business Rules

## 6.1 Input Validation Matrix

| Field | Type | Rules | Error Message |
|-------|------|-------|---------------|
| punch_count | int | 1-50000 | "Punch count must be between 1-50,000" |
| thread_colors | int | 1-15 | "Maximum 15 thread colors supported" |
| head_count | int | 1-21 | "Head count must be 1-21" |
| target_quantity | int | ≥1 | "Quantity must be at least 1" |
| deadline | date | ≥today | "Deadline cannot be in the past" |
| working_hours | float | 0.5-24 | "Working hours must be 0.5-24" |
| efficiency | float | 0.5-1.0 | "Efficiency must be 50-100%" |
| operators | int | 1-10000 | "Operators must be 1-10,000" |
| floor_area | float | >0 | "Floor area must be positive" |

## 6.2 Business Rule Engine

### Capacity Validation
```typescript
interface CapacityValidation {
  rule: "HEAD_COUNT_CAPACITY";
  check: (params) => {
    const maxOutput = params.headCount * params.machineSpeed * params.workingHours;
    const requiredOutput = params.targetQuantity / params.availableDays;
    return maxOutput >= requiredOutput;
  };
  severity: "error" | "warning";
  message: string;
}
```

### Bottleneck Detection Rules
| Rule ID | Condition | Severity | Action |
|---------|-----------|----------|--------|
| BTN-001 | cutting_output > sewing_input * 1.2 | Warning | Highlight cutting block |
| BTN-002 | sewing_output > finishing_input * 1.3 | Warning | Highlight finishing block |
| BTN-003 | embroidery_capacity < required | Error | Block submission |
| BTN-004 | packing_area < sewing_area * 0.1 | Warning | Suggest expansion |

### Flow Efficiency Scoring
```
adjacency_score = Σ(connected_departments) / total_connections
flow_score = Σ(distance_weights) / optimal_distance
efficiency = (adjacency_score * 0.6) + (flow_score * 0.4)

IF efficiency < 0.6 THEN severity = "error"
IF efficiency < 0.8 THEN severity = "warning"
IF efficiency >= 0.8 THEN severity = "success"
```

---

# 7. Database Schema (Supabase)

## 7.1 Core Tables

### organizations
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default uuid_generate_v4() |
| name | varchar(255) | NOT NULL |
| created_at | timestamptz | default now() |
| settings | jsonb | default '{}' |

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, FK → auth.users |
| organization_id | uuid | FK → organizations |
| role | enum | 'admin', 'consultant', 'viewer' |
| preferences | jsonb | default '{}' |
| created_at | timestamptz | default now() |

### projects
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| organization_id | uuid | FK → organizations |
| name | varchar(255) | NOT NULL |
| client_name | varchar(255) | |
| status | enum | 'draft', 'active', 'completed', 'archived' |
| metadata | jsonb | |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |

### calculations
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| project_id | uuid | FK → projects |
| type | enum | 'machinery', 'embroidery', 'layout' |
| inputs | jsonb | NOT NULL |
| outputs | jsonb | NOT NULL |
| created_by | uuid | FK → users |
| created_at | timestamptz | default now() |

### scenarios
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| calculation_id | uuid | FK → calculations |
| name | varchar(100) | |
| parameters | jsonb | NOT NULL |
| results | jsonb | NOT NULL |
| is_baseline | boolean | default false |
| created_at | timestamptz | default now() |

### floor_layouts
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| project_id | uuid | FK → projects |
| name | varchar(100) | |
| parameters | jsonb | operators, product_type, etc. |
| layout_data | jsonb | Department positions, sizes |
| validation_status | enum | 'valid', 'warnings', 'errors' |
| thumbnail | text | Base64 or storage path |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |

### dashboards
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| project_id | uuid | FK → projects, nullable |
| user_id | uuid | FK → users |
| name | varchar(100) | NOT NULL |
| layout | jsonb | Widget positions, sizes |
| is_template | boolean | default false |
| created_at | timestamptz | default now() |

### dashboard_widgets
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| dashboard_id | uuid | FK → dashboards |
| type | varchar(50) | Widget type identifier |
| position | jsonb | {x, y, w, h} |
| config | jsonb | Widget-specific config |
| data_source | jsonb | Query or calculation reference |

### machine_types
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| name | varchar(100) | NOT NULL |
| category | enum | 'sewing', 'embroidery', 'cutting', 'finishing' |
| default_speed | int | |
| default_efficiency | float | |
| specifications | jsonb | |
| is_active | boolean | default true |

## 7.2 Row Level Security
```sql
-- Users can only access their organization's data
CREATE POLICY "org_isolation" ON projects
  FOR ALL USING (
    organization_id = (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );
```

---

# 8. API Contracts

## 8.1 RESTful Endpoints

### Calculations
```
POST   /api/calculations/machinery
POST   /api/calculations/embroidery  
POST   /api/calculations/layout
GET    /api/calculations/:id
GET    /api/calculations/project/:projectId
```

### Scenarios
```
POST   /api/scenarios
GET    /api/scenarios/:calculationId
PUT    /api/scenarios/:id
DELETE /api/scenarios/:id
POST   /api/scenarios/compare
```

### Floor Layouts
```
POST   /api/layouts
GET    /api/layouts/:id
PUT    /api/layouts/:id
DELETE /api/layouts/:id
POST   /api/layouts/:id/validate
POST   /api/layouts/:id/export
```

### Dashboards
```
GET    /api/dashboards
POST   /api/dashboards
GET    /api/dashboards/:id
PUT    /api/dashboards/:id
DELETE /api/dashboards/:id
POST   /api/dashboards/:id/duplicate
```

## 8.2 Request/Response Examples

### Embroidery Calculation Request
```json
{
  "projectId": "uuid",
  "parameters": {
    "punchCount": 5000,
    "threadColors": 3,
    "headCount": 12,
    "machineSpeed": 800,
    "targetQuantity": 10000,
    "workingHoursPerDay": 8,
    "deadline": "2026-03-15",
    "efficiencyFactor": 0.85
  }
}
```

### Embroidery Calculation Response
```json
{
  "id": "calc-uuid",
  "type": "embroidery",
  "results": {
    "machinesRequired": 4,
    "totalProductionDays": 12,
    "dailyOutput": 834,
    "utilizationRate": 0.92,
    "timePerPiece": {
      "stitching": 6.25,
      "colorChanges": 1.5,
      "total": 7.75
    },
    "validation": {
      "status": "valid",
      "warnings": [],
      "errors": []
    }
  },
  "createdAt": "2026-02-02T18:30:00Z"
}
```

---

# 9. DevOps & Deployment

## 9.1 Docker Development Setup

### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    depends_on:
      - supabase
  
  supabase:
    image: supabase/postgres:latest
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: postgres
```

### One-Click Setup Script
```bash
# setup.sh
#!/bin/bash
echo "� APPAREL Development Setup"
docker-compose up -d
npm install
npm run dev
```

## 9.2 Tauri Production Builds

### Build Matrix
| Platform | Target | Artifact |
|----------|--------|----------|
| Windows | x86_64-pc-windows-msvc | .msi, .exe |
| macOS | x86_64-apple-darwin | .dmg, .app |
| macOS ARM | aarch64-apple-darwin | .dmg, .app |
| Linux | x86_64-unknown-linux-gnu | .deb, .AppImage |

### CI/CD Pipeline (GitHub Actions)
```yaml
name: Build & Release
on:
  push:
    tags: ['v*']

jobs:
  build:
    strategy:
      matrix:
        platform: [windows-latest, macos-latest, ubuntu-latest]
    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - name: Install Rust
        uses: dtolnay/rust-action@stable
      - name: Build Tauri
        run: pnpm tauri build
      - name: Upload Artifacts
        uses: actions/upload-artifact@v4
```

## 9.3 Environment Configuration
```
# .env.example
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
APP_ENV=development
LOG_LEVEL=debug
```

---

# 10. Scalability & Future Expansion

## 10.1 Extensibility Architecture

### Plugin System (Future)
```typescript
interface ApparelPlugin {
  id: string;
  name: string;
  version: string;
  calculators?: Calculator[];
  widgets?: DashboardWidget[];
  validators?: ValidationRule[];
}
```

### Feature Flags
| Flag | Description | Default |
|------|-------------|---------|
| ENABLE_MULTI_FLOOR | 3D floor planning | true |
| ENABLE_EXPORT_PDF | PDF report generation | true |
| ENABLE_REAL_TIME_SYNC | Live collaboration | false |
| ENABLE_AI_SUGGESTIONS | ML-powered recommendations | false |

## 10.2 Planned Future Modules

| Module | Description | Priority |
|--------|-------------|----------|
| Order Management | Track client orders and deadlines | P1 |
| Costing Engine | Detailed cost breakdowns and quotes | P1 |
| Resource Scheduling | Gantt-chart based planning | P2 |
| Supplier Database | Machine and material suppliers | P2 |
| Report Builder | Custom report templates | P2 |
| Mobile Companion | View-only mobile app | P3 |
| AI Optimizer | ML-based layout suggestions | P3 |

## 10.3 Integration Points
| System | Protocol | Use Case |
|--------|----------|----------|
| ERP Systems | REST/SOAP | Sync orders, inventory |
| CAD Software | File Import | Import floor plans |
| Excel | Import/Export | Legacy data migration |
| PowerBI | Embed | Advanced analytics |

---

# 11. Implementation Phases

The development follows a structured agile workflow with clear phase boundaries and testing loops.

---

## Phase 1: System Skeleton
**Focus**: Project structure only, no business logic

### Deliverables
- [ ] Tauri + React + TypeScript project initialization
- [ ] Docker development environment (one-click setup)
- [ ] Folder structure following clean architecture
- [ ] Base configuration files (ESLint, Prettier, TypeScript)
- [ ] Empty page shells with routing
- [ ] Design system file structure
- [ ] CI/CD pipeline skeleton

### Exit Criteria
- Project runs in Docker without errors
- All routes navigate correctly (empty pages)
- Build pipeline passes

---

## Phase 2: Domain Model & Contracts
**Focus**: Define the core domain before any implementation

### Deliverables
- [ ] **Entities**: All domain objects (Machine, Calculation, Layout, Dashboard, etc.)
- [ ] **States & Transitions**: State machines for projects, calculations, layouts
- [ ] **Events & Triggers**: Event definitions for real-time updates
- [ ] **API Contracts**: OpenAPI/TypeScript interfaces for all endpoints
- [ ] **Validation Schemas**: Zod/Yup schemas for all inputs
- [ ] **Type Definitions**: Shared types between frontend and backend

### Key Domain Entities
```typescript
// Core Entities
interface Machine { id, name, category, speed, efficiency, headCount? }
interface Calculation { id, type, inputs, outputs, validation }
interface FloorLayout { id, departments[], flowPaths[], validationStatus }
interface Dashboard { id, widgets[], layout, theme }
interface Scenario { id, name, parameters, results, isBaseline }
```

### State Machines
```
Project: draft → active → completed → archived
Calculation: pending → processing → completed → error
Layout: editing → validated → exported
```

### Exit Criteria
- All entities have TypeScript interfaces
- All API contracts documented
- State machines defined and documented

---

## Phase 3: UI/UX Prototype
**Focus**: All pages, windows, flows, and states with mock data only

### Agile Loop
```
┌─────────────────────────────────────┐
│                                     │
│   Dev → Build → User Test → Dev    │
│         (verify in browser)         │
│                                     │
└─────────────────────────────────────┘
```

### Deliverables
- [ ] **Design System Components**: All Vision Pro-inspired components
  - Glass cards, floating panels, pill navigation
  - Input components (sliders, pickers, selectors)
  - Data visualization components (gauges, charts, progress)
  - Interactive elements (drag handles, tooltips, modals)
- [ ] **Core Pages**:
  - Dashboard (home with widgets)
  - Machinery Calculator (with What-If playground)
  - Floor Layout Planner (visual drag & drop)
  - Analytics Dashboard (presentation mode)
  - Settings & Profile
- [ ] **All UI States**: Loading, empty, error, success
- [ ] **Dark/Light Mode**: Full theme implementation
- [ ] **Responsive Layouts**: Desktop-optimized with density options
- [ ] **Animations & Transitions**: Micro-interactions, page transitions

### Mock Data Strategy
- All components use static JSON mock data
- Mock data files in `/src/mocks/`
- No API calls or database connections

### Exit Criteria
- All pages navigable and visually complete
- User can interact with all UI elements (mock responses)
- Dark/Light mode works on all pages
- User testing validates UX flow

---

## Phase 4: Database Design
**Focus**: Complete database implementation in Supabase

### Deliverables
- [ ] **Tables**: All tables as defined in Section 7
  - organizations, users, projects
  - calculations, scenarios
  - floor_layouts, dashboards, dashboard_widgets
  - machine_types (seed data)
- [ ] **Relationships**: All foreign keys and cascades
- [ ] **Constraints**: NOT NULL, CHECK, UNIQUE as needed
- [ ] **Indexes**: Performance indexes for common queries
- [ ] **Row Level Security**: Organization isolation policies
- [ ] **Migrations**: Versioned migration files
- [ ] **Seed Data**: Initial machine types, sample data for testing

### Exit Criteria
- All tables created in Supabase
- RLS policies active and tested
- Seed data loaded successfully
- Migration scripts documented

---

## Phase 5: Backend Logic
**Focus**: Feature implementation with full integration

### Agile Loop
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Dev → Code Test → Build → User Test → Dev            │
│         (unit/integration)  (browser + real data)       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Deliverables by Feature Group

#### 5.1 Authentication & User Management
- [ ] Supabase Auth integration
- [ ] User profile management
- [ ] Organization context
- [ ] Role-based access

#### 5.2 Machinery Calculator
- [ ] Basic machine calculation engine
- [ ] Embroidery calculation (with head count logic)
- [ ] Validation rule engine
- [ ] What-If scenario management
- [ ] Results persistence

#### 5.3 Floor Layout Planner
- [ ] Space calculation engine
- [ ] Department positioning logic
- [ ] Bottleneck detection algorithms
- [ ] Flow efficiency scoring
- [ ] Layout save/load operations
- [ ] Export (PNG/PDF)

#### 5.4 Analytics Dashboard
- [ ] Dashboard CRUD operations
- [ ] Widget data binding
- [ ] Real-time updates (Supabase Realtime)
- [ ] Presentation mode logic
- [ ] Dashboard templates

#### 5.5 Projects & Data Management
- [ ] Project CRUD
- [ ] Calculation history
- [ ] Data export/import
- [ ] Search functionality

### Testing Strategy
| Test Type | Tool | Coverage Target |
|-----------|------|----------------|
| Unit Tests | Vitest | Core calculation functions |
| Integration | Vitest + Supabase | API endpoints |
| E2E | Playwright | Critical user flows |
| User Testing | Manual | All features in browser |

### Exit Criteria
- All features functional with real database
- Unit test coverage > 80% on core logic
- E2E tests pass for critical flows
- User testing validates functionality
- Production builds work on Windows/Mac/Linux

---

# 12. Appendices

## A. Glossary
| Term | Definition |
|------|------------|
| Punch | Single stitch in embroidery |
| Head Count | Number of needle heads on embroidery machine |
| SPM | Stitches Per Minute (machine speed) |
| SMV | Standard Minute Value |
| Embellishment | Decoration added to garment (embroidery, print, etc.) |
| Bottleneck | Production constraint limiting overall output |

## B. Machine Reference
| Machine | Category | Typical Speed | Heads |
|---------|----------|---------------|-------|
| Single Needle Lockstitch | Sewing | 5000 SPM | 1 |
| Overlock | Sewing | 7000 SPM | 1 |
| Barudan | Embroidery | 800-1200 SPM | 6-21 |
| SWF | Embroidery | 850-1100 SPM | 4-15 |
| Brother | Embroidery | 900-1200 SPM | 6-12 |

## C. Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Calculation Time | < 2s | Performance benchmark |
| User Task Completion | > 95% | User testing |
| Client Meeting Usage | > 80% | Analytics |
| Error Rate | < 1% | Error tracking |
| User Satisfaction | > 4.5/5 | NPS Survey |

---

**Document Version**: 1.1  
**Last Updated**: 2026-02-03  
**Status**: Draft - Pending Approval
