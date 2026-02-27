# VISION Intelligence
## Product Requirements Document v2.1

> *Precision Calculations for Apparel Industry Consultants*
> 
> **v2.1 Update**: Post-consultant meeting pivot — **accuracy and exact results** take priority over UI aesthetics. Sprint-by-sprint delivery confirmed.

---

# 1. Executive Summary

## 1.1 Problem Statement
Apparel industry consultants at firms like VISION International Consultancy advise investors on setting up new garment factories. During live client meetings, investors ask rapid-fire questions: *"How many machines do I need for 100,000 shirts per month?"*, *"What if I go with innerwear instead?"*, *"How much factory floor space do I need?"*

Currently, consultants answer these questions using **Excel spreadsheets and physical calculators** — keeping their laptop and calculator in front of them, which is a slow, stressful, and error-prone experience. They cannot tell the client "I'll go home and let you know tomorrow" — they must calculate and answer **on the spot**.

What they need is a comprehensive system that delivers **exact, accurate results instantly** for any type of calculation-related question a client can ask. The consultants are clear: **they don't care about fancy UI — they need EXACT RESULTS.**

## 1.2 Solution Overview
**VISION Intelligence** is a premium desktop application that replaces manual Excel-based calculations with an intelligent, real-time computation engine for apparel industry consultants. The system focuses on **new factory planning** — helping consultants advise investors on machinery requirements, production capacity, and floor layout sizing.

> **Important Context**: This application is for consultants helping clients (investors) **start new factories**. It is NOT for managing or maintaining existing production operations.

## 1.3 Key Goals
| Priority | Goal | Success Metric |
|----------|------|----------------|
| **#1** | **Exact Accuracy** | Results match VISION's proven Excel formulas **exactly** |
| **#2** | **Bi-directional Solving** | Solve for ANY variable in the formula (like finding X) |
| **#3** | **Instant Calculations** | < 2 seconds for any machinery/layout computation |
| **#4** | **Live Meeting Ready** | Consultant can answer any client question on-the-spot |
| **#5** | **Data Export** | Export results as PNG, PDF, or Excel for client handoff |

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

## 2.1 Primary: Apparel Industry Consultant
- **Role**: Senior consultant at VISION International Consultancy (or similar firms)
- **Context**: Advises investors on setting up new garment factories
- **Goals**: Instantly answer investor questions about machinery, capacity, and floor space during live meetings
- **Pain Points**: Manual Excel calculations are slow, stressful, and unprofessional during client presentations
- **Tech Level**: Intermediate (comfortable with Excel and business software)

## 2.2 Secondary: Managing Director / Firm Leadership
- **Role**: MD of the consultancy firm
- **Goals**: Review client dashboards, access historical project data, ensure consistency across consultants
- **Pain Points**: Scattered Excel files, no centralized project history
- **Tech Level**: Basic to Intermediate

---

# 3. Core Modules

## 3.1 Module 1: Machine Requirement Calculator

> **🎯 CURRENT SPRINT**: This is the quoted and actively developed module.

### 3.1.1 Overview
Comprehensive calculation engine for determining machinery requirements when planning new apparel factories. Supports three calculation types: **Sewing Machine Requirements**, **Embroidery Capacity**, and **Fusing/Supplementary Machine Capacity**. All calculations support **bi-directional solving** — the consultant can solve for any unknown variable (like finding X in a formula).

> **Real-world context**: An investor says *"I need 100,000 shirts per month — how many machines do I need?"* The consultant enters the parameters and gets an instant answer. Or the investor says *"I have 50 machines — what's my monthly output?"* The system solves it either way.
>
> **Simple Example**: `(No_of_Operators × Working_Hours_in_minutes) / SMV = Target_Quantity`
> — Any variable can be the unknown. The consultant fills in what they know and solves for what they don't.

> **Important**: Consultants manually calculate and feed SMV into the system. The system does NOT need to calculate SMV from Machine Speed (SPM). SPM is only relevant for embroidery machines.

### 3.1.2 Calculation Types

#### Tab 1: Sewing Machine Calculation (Basic)

**Core Formula (from VISION Excel data):**
```
Daily_Output = (No_of_Operators × Working_Minutes_Per_Day × Efficiency) / SMV
Machines_Required = Target_Quantity / (Daily_Output × Working_Days)
```

| Parameter | Type | Validation | UI Component | Direction |
|-----------|------|------------|--------------|-----------|
| Machine Type | Select | Required, CRUD | Searchable Dropdown + Add/Edit | Input only |
| SMV (Standard Minute Value) | Number | > 0 | Numeric Input | Input ↔ Output |
| No. of Operators | Number | ≥ 1 | Numeric Input + Slider | Input ↔ Output |
| Working Hours/Day | Number | 1-24 | Numeric (default 9) | Input |
| Duration | Select | Required | Dropdown: daily/weekly/monthly | Input |
| Working Days | Number | 1-31 | Numeric + Sat/Sun toggle | Input |
| Efficiency Factor | Percentage | 50-100% | Slider (default 80%) | Input |
| Target Quantity | Number | > 0 | Numeric Input + Slider | Input ↔ Output |
| **Machines Required** | Number | Calculated | **Large number display** | **Output ↔ Input** |

**Bi-directional examples:**
- Given Target_Quantity + SMV + Operators → Find **Machines_Required**
- Given Machines_Required + SMV + Operators → Find **Target_Quantity (max output)**
- Given Target_Quantity + Machines → Find **Working_Days needed**

#### Tab 2: Embroidery Capacity Calculation

**Core Formula (from VISION Excel data):**
```
Stitching_Time_Per_Piece = Punch_Count / Machine_Speed
Total_Time_Per_Piece = Stitching_Time + Handling_Time
Available_Minutes_Per_Shift = Shift_Hours × 60 × (Efficiency / 100)
Output_Per_Head_Per_Day = Available_Minutes / Total_Time
Output_Per_Machine_Per_Day = Output_Per_Head × Head_Count
Machines_Required = Order_Quantity / Output_Per_Machine
```

> **Note**: Machine Speed (SPM) is **only relevant for embroidery machines** — it is NOT used in the basic sewing calculation where consultants feed SMV directly.

| Parameter | Type | Validation | UI Component | Direction |
|-----------|------|------------|--------------|-----------|
| Order Quantity | Number | > 0 | Numeric Input | Input ↔ Output |
| Punch Count (stitches/logo) | Number | 1-50,000 | Numeric Input | Input |
| Machine Speed (stitches/min) | Number | 100-1200 | Preset + Custom slider | Input |
| Handling Time Per Piece (min) | Number | ≥ 0 | Numeric Input | Input |
| Shift Hours | Number | 1-24 | Numeric (default 9) | Input |
| Efficiency (%) | Number | 50-100 | Slider (default 80%) | Input |
| Machine Head Count | Number | 1-21 | Visual Head Selector | Input |
| No. of Colors | Number | 1-15 | Numeric counter (no color selection needed) | Input |
| Stitches | Number | > 0 | Numeric Input | Input |
| **Machines Required** | Number | Calculated | **Large number display** | **Output** |

#### Tab 3: Fusing & Supplementary Machine Calculation

**Core Formula (from VISION Excel data):**
```
Available_Seconds = Working_Hours × 3600 × (Efficiency / 100)
Capacity_Per_Machine = Available_Seconds / Seconds_Per_Piece
Machines_Required = Daily_Quantity / Capacity_Per_Machine
```

| Parameter | Type | Validation | UI Component | Direction |
|-----------|------|------------|--------------|-----------|
| Product Category | Select | Required | Dropdown (Trouser/Shirt/T-shirt/Apron/Cap) | Input |
| Fusing Time Per Piece (seconds) | Number | > 0 | Numeric Input | Input |
| Working Hours | Number | 1-24 | Numeric (default 9) | Input |
| Efficiency (%) | Number | 50-100 | Slider (default 90%) | Input |
| Daily Quantity | Number | > 0 | Numeric Input | Input ↔ Output |
| **Machines Required** | Number | Calculated | **Large number display** | **Output** |

### 3.1.3 Machine Type Management (CRUD)
Consultants must be able to create custom machine types per project because:
- Different factories use different machine sets
- Machine types vary by product and operation
- Pre-defined lists cannot cover all scenarios

| Feature | Description |
|---------|-------------|
| Add Machine Type | Name, category, default SMV, default efficiency |
| Edit Machine Type | Modify any property |
| Remove Machine Type | Soft-delete (hide from dropdowns) |
| Per-Project | Machine types are scoped to the active project |
| Import/Presets | Start with VISION's standard machine list |

### 3.1.4 Output Display
| Output | Visualization |
|--------|---------------|
| Machines Required | Large number + machine icon grid |
| Daily Output | Progress bar with target comparison |
| Utilization Rate | Gauge chart (0-100%) |
| Cost Estimate | Currency display with breakdown bar |

> **Removed from v1.0/v2.0**: Production Timeline (Gantt), Deadline picker, Machine Speed (SPM) from sewing tab — not relevant for new factory planning. Consultants feed SMV directly.

### 3.1.5 What-If Playground
- **Dynamic Parameters**: Adjust any input and see results update in real-time
- **Scenario Comparison**: Save up to 4 scenarios side-by-side
- **Delta Indicators**: Show +/- changes from baseline with color coding
- **Quick Toggle**: "What if 80% efficiency instead of 85%?" — instant comparison

### 3.1.6 Data Export
| Format | Contents |
|--------|----------|
| PNG | Screenshot of calculation results with branding |
| PDF | Full report with inputs, outputs, and breakdown |
| Excel | Raw data in spreadsheet format (familiar to consultants) |

### 3.1.7 Validation Rules
```
RULE: Operator Capacity
IF (operators × working_minutes / SMV × efficiency) < target_quantity / working_days
THEN show_warning("Insufficient operators for target quantity")

RULE: Embroidery Head Utilization
IF output_per_machine > practical_max_capacity
THEN show_warning("Consider reducing target or adding machines")

RULE: Efficiency Range
IF efficiency > 95%
THEN show_info("Efficiency above 95% is rarely achievable in practice")
```

---

## 3.2 Module 2: Floor Layout Calculator

### 3.2.1 Overview
Calculates production section sizes and arrangements based on available floor space, product type, and machinery requirements. Unlike a design tool, this is a **visual calculator** — it computes the optimal section sizes and renders them proportionally for the consultant to discuss with the investor.

> **Note**: Consultants have qualified AutoCAD professionals for detailed layout design. This module focuses on **instant calculations** during meetings — "Given this much space, how many machines can fit? What sections do I need?"

### 3.2.2 Real-World Scenarios
1. *"I have 500 sqm per floor — what sections do I need for shirts, and how big should each be?"*
2. *"Using this land, what is the maximum production floor I can build?"*
3. *"I have 3 floors of 400 sqm each — can I fit cutting + sewing + packing on one floor?"*

### 3.2.3 Input Parameters
| Parameter | Type | Validation | UI Component | Category |
|-----------|------|------------|--------------|----------|
| Product Type | Select | Required | Visual Card Select | Product |
| Land Size (W × L) | Number pair | > 0 | Dimension Input (meters) | Area |
| Production Floor Size (W × L) | Number pair | > 0 | Dimension Input (meters) | Area |
| Number of Floors Available | Number | 1-10 | Floor Stack Visual | Area |
| Machine Size (W × L) | Number pair | > 0 | Dimension Input (meters) | Machines |
| Number of Machines | Number | ≥ 1 | Numeric Input | Machines |
| Operator Working Space (W × L) | Number pair | > 0 | Dimension Input (meters) | Operators |
| Number of Operators | Number | ≥ 1 | Numeric Input | Operators |

> **Changed from v1.0**: All dimensions use **Width × Length** (not Height). Removed Working_Hours (not relevant for space calculation).

### 3.2.4 Output Results
| Output | Description |
|--------|-------------|
| Required Sections | List of production sections based on Product_Type |
| Section Sizes | Calculated area for each section (m²) |
| Section Proportions | Visual rendering showing relative sizes |
| Floor Assignments | Which sections fit on which floors |

### 3.2.5 Visual Calculator Canvas
The canvas is a **static, contained view** (not an infinite scrollable canvas):
- Fit-to-container rendering (no scroll, no zoom required)
- Proportional section blocks showing calculated sizes
- Width × Length labels on each section
- Sections can be repositioned within the floor boundary
- Sections can have width/length adjusted (while maintaining calculated area)
- Percentage indicators: "Cutting takes 25% of floor area"
- Color-coded by section type (consistent with department palette)

### 3.2.6 Product Type → Section Mapping
| Product Type | Required Sections |
|-------------|-------------------|
| Innerwear | Cutting, Sewing, Finishing & Packing, Stores |
| Outerwear | Cutting, Sewing, Embroidery, Finishing & Packing, Stores, Heavy Cutting |
| Casual | Cutting, Sewing, Finishing & Packing, Stores |
| Sportswear | Cutting, Sewing, Sublimation, Finishing & Packing, Stores |

> **Note**: Exact section formulas will be provided by VISION consultancy team in Excel format.

---

## 3.3 Module 3: Client Dashboard

> **⏳ FUTURE SPRINT**: Exact requirements will be provided by the VISION consultancy team. The below is a preliminary outline.

### 3.3.1 Overview
A presentation-ready dashboard designed to be shown directly to the investor (client) during meetings. Displays all calculated data in a professional, easy-to-understand format.

### 3.3.2 Core Dashboard Elements (Preliminary)
| Element | Description |
|---------|-------------|
| Machine Summary | All machine types needed with quantities per category |
| Cost Estimation | Total and per-category cost breakdown |
| Production Capacity | Expected output at different efficiency levels |
| Floor Summary | Section overview with area utilization |

### 3.3.3 Features (Preliminary)
- **Project-scoped**: Each dashboard is tied to a specific client project
- **Export**: PDF, PNG for client handoff
- **Presentation Mode**: Full-screen, clean layout for projector/screen sharing

> **⚠️ Requirements TBD**: The VISION consultancy team will provide exact CLIENT DASHBOARD requirements in a future sprint. Implementation will not begin until those requirements are received.

---

## 3.4 Module 4: Analytics & History

> **⏳ FUTURE SPRINT**: Exact requirements will be provided by the VISION consultancy team. The below is a preliminary outline.

### 3.4.1 Overview
Centralized storage for all calculations, projects, and historical data. Replaces the scattered Excel files consultants currently use. This module serves as a secure, single database where consultants can store and retrieve all client project data.

### 3.4.2 Core Capabilities (Preliminary)
| Capability | Description |
|-----------|-------------|
| Project History | Search and retrieve calculations from past client projects |
| Client Lookup | Filter by client/garment-factory to see all related calculations |
| Product Type Filter | "Show me all projects we've done for innerwear" |
| Calculation Log | Timestamped record of every calculation performed |
| Data Reuse | Load a past calculation as a starting point for a new project |

### 3.4.3 Use Case
*"A new client asks the same question a previous client asked 6 months ago. The consultant searches for the old project, finds the exact calculation, and shares it — with adjustments for the new client's parameters."*

> **⚠️ Requirements TBD**: The VISION consultancy team will provide exact ANALYTICS & HISTORY requirements (historical data structure, database schema for lookups) in a future sprint. Implementation will not begin until those requirements are received.

---

# 4. UI/UX Design System

> **Priority Note (v2.1)**: Based on consultant feedback, **accuracy and functional correctness take absolute priority** over visual aesthetics. The design system should serve the calculations, not distract from them. Consultants need clean, readable interfaces that help them answer client questions quickly and confidently.

## 4.1 Design Philosophy: Apple Vision Pro Inspired

VISION's interface draws inspiration from **Apple Vision Pro's visionOS** design language, creating a clean, professional experience on desktop — while keeping **calculation accuracy and speed** as the primary focus.

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
| Dimension Input | Width × Length pair input (meters) |
| Slider | Range, marks, value tooltip |
| Toggle | Animated switch (Sat/Sun working days) |
| Duration Select | Daily/Weekly/Monthly dropdown |
| Machine Type CRUD | Add/Edit/Delete machine types per project |

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
│  │  � VISION              🔍          ☀️  👤  ⚙️         │   │ ← Floating Top Bar
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
│ │  85% Eff   │ │  80% Eff ↓  │ │  90% Eff ↑  │         │
│ │  500/day   │ │  400/day ↓  │ │  700/day ↑  │         │
│ └─────────────┘ └─────────────┘ └─────────────┘         │
├──────────────────────────────────────────────────────────┤
│ PARAMETERS                                               │
│ ┌────────────────────────────────────────────────────┐  │
│ │ SMV             [====●==========] 24.5            │  │
│ │ Operators       [==●============] 90              │  │
│ │ Efficiency      [=======●=======] 80%             │  │
│ │ Working Hours   [===●===========] 9               │  │
│ │ Working Days    [========●======] 26              │  │
│ └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## 5.2 Visual Floor Calculator

### Features
- **Static Canvas**: Contained view, no infinite scroll/zoom required
- **Section Blocks**: Proportionally sized based on calculated areas
- **Repositioning**: Drag sections within floor boundary
- **Dimension Adjustment**: Adjust width/length while maintaining calculated area
- **Percentage Labels**: Shows each section's share of total floor area
- **Multi-Floor**: Tab view for each floor level
- **Export**: PNG/PDF for presentations

### Section Blocks
| Section | Color | Shape |
|---------|-------|-------|
| Cutting | Orange | Rectangle |
| Sewing | Blue | Large Rectangle |
| Embroidery | Purple | Rectangle |
| Finishing & Packing | Green | Rectangle |
| Stores | Teal | Rectangle |
| Sublimation | Pink | Rectangle |

### Interaction Flow
```
1. Set Parameters (product type, floor dimensions, operators, machines)
2. System calculates required section areas
3. Section blocks render proportionally within floor boundary
4. Consultant can reposition blocks within the floor
5. Consultant can adjust width/length (maintaining area)
6. Percentage labels update in real-time
7. Export or save calculation
```

---

# 6. Data Validation & Business Rules

## 6.1 Input Validation Matrix

| Field | Type | Rules | Error Message |
|-------|------|-------|---------------|
| smv | float | > 0 | "SMV must be greater than 0" |
| operators | int | ≥ 1 | "At least 1 operator required" |
| punch_count | int | 1-50000 | "Punch count must be between 1-50,000" |
| thread_colors | int | 1-15 | "Maximum 15 thread colors supported" |
| head_count | int | 1-21 | "Head count must be 1-21" |
| target_quantity | int | ≥1 | "Quantity must be at least 1" |
| working_hours | float | 1-24 | "Working hours must be 1-24" |
| working_days | int | 1-31 | "Working days must be 1-31" |
| efficiency | float | 0.5-1.0 | "Efficiency must be 50-100%" |
| floor_width | float | > 0 | "Floor width must be positive" |
| floor_length | float | > 0 | "Floor length must be positive" |

## 6.2 Business Rule Engine

### Capacity Validation
```typescript
interface CapacityValidation {
  rule: "OPERATOR_CAPACITY";
  check: (params) => {
    const dailyOutput = (params.operators * params.workingMinutes * params.efficiency) / params.smv;
    const requiredDaily = params.targetQuantity / params.workingDays;
    return dailyOutput >= requiredDaily;
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
| category | enum | 'sewing', 'embroidery', 'cutting', 'finishing', 'fusing' |
| default_smv | float | SMV for the machine type |
| default_efficiency | float | |
| specifications | jsonb | |
| project_id | uuid | FK → projects, nullable (null = global preset) |
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

### Sewing Machine Calculation Request
```json
{
  "projectId": "uuid",
  "parameters": {
    "machineTypeId": "mt-001",
    "smv": 24.5,
    "numberOfOperators": 90,
    "workingHoursPerDay": 9,
    "duration": "monthly",
    "workingDays": 26,
    "efficiencyFactor": 0.80,
    "targetQuantity": 40000
  }
}
```

### Sewing Machine Calculation Response
```json
{
  "id": "calc-uuid",
  "type": "sewing",
  "results": {
    "machinesRequired": 90,
    "dailyOutput": 1585,
    "utilizationRate": 0.80,
    "costEstimate": 48500,
    "validation": {
      "status": "valid",
      "warnings": [],
      "errors": []
    }
  },
  "createdAt": "2026-02-27T08:30:00Z"
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
echo "� VISION Development Setup"
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
interface VisionPlugin {
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

## Phase 3: UI/UX Prototype ✅ (Current Phase — Mostly Complete)
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
- [x] **Design System Components**: All Vision Pro-inspired components
- [x] **Machine Requirement Calculator**: 3-tab UI (Sewing/Embroidery/Fusing), VISION formulas, What-If playground
- [x] **Floor Layout Calculator**: Visual section calculator, static canvas
- [x] **Client Dashboard**: Presentation-ready layout
- [x] **Analytics & History**: Project history and data reuse
- [x] **All UI States**: Loading, empty, error, success
- [x] **Dark/Light Mode**: Full theme implementation
- [x] **Animations & Transitions**: Micro-interactions, page transitions

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
  - machine_types (with default_smv, project_id — seed data from VISION preset list)
- [ ] **Relationships**: All foreign keys and cascades
- [ ] **Constraints**: NOT NULL, CHECK, UNIQUE as needed
- [ ] **Indexes**: Performance indexes for common queries
- [ ] **Row Level Security**: Organization isolation policies
- [ ] **Migrations**: Versioned migration files
- [ ] **Seed Data**: VISION standard machine types, sample project data

### Exit Criteria
- All tables created in Supabase
- RLS policies active and tested
- Seed data loaded successfully
- Migration scripts documented

---

## Phase 5: Backend Logic (Sprint-Based Delivery)
**Focus**: Feature implementation with full integration, delivered in agile sprints

> **Delivery Model (v2.1)**: Consultants prefer sprint-by-sprint (feature-by-feature) delivery with review at each stage. Each sprint must produce a **working, testable feature** before proceeding to the next.

### Sprint 1: Machine Requirement Calculator (✅ QUOTED — Active Module)
> **Timeline**: 6 weeks (3 × 2-week sprints) as per quotation `UNIQUE/2026/Q-021`
> **Budget**: LKR 250,000 (see quotation for breakdown)
> **Priority**: This is the quoted and actively developed deliverable

| Sprint | Deliverable |
|--------|-------------|
| Sprint 1.1 | Sewing calculation engine + VISION formulas + bi-directional solving + database persistence |
| Sprint 1.2 | Embroidery + Fusing calculation engines + validation rules + bi-directional solving |
| Sprint 1.3 | Machine type CRUD + What-If scenarios + data export (PNG/PDF/Excel) |

### Sprint 2: Floor Layout Calculator (Separate Quotation)
> **Status**: Will be quoted separately after Sprint 1 completion

| Sprint | Deliverable |
|--------|-------------|
| Sprint 2.1 | Section sizing engine + product type → section mapping |
| Sprint 2.2 | Visual rendering + repositioning + export |

### Sprint 3: Client Dashboard (⏳ Requirements TBD)
> **Status**: Exact requirements to be provided by VISION consultancy team

| Sprint | Deliverable |
|--------|-------------|
| Sprint 3.1 | Client dashboard with project-scoped data |

### Sprint 4: Analytics & History (⏳ Requirements TBD)
> **Status**: Exact requirements to be provided by VISION consultancy team

| Sprint | Deliverable |
|--------|-------------|
| Sprint 4.1 | Analytics & history — search, filter, data reuse |

### Sprint 5: Authentication & Integration
| Sprint | Deliverable |
|--------|-------------|
| Sprint 5.1 | Supabase Auth + user profiles + organization context |
| Sprint 5.2 | Replace all mock data with real API calls |

### Agile Loop
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Dev → Code Test → Build → User Test → Dev            │
│         (unit/integration)  (browser + real data)       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

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

**Document Version**: 2.1  
**Last Updated**: 2026-02-27  
**Status**: Active  
**Change Note (v2.1)**: Post-consultant meeting update — emphasis on accuracy over UI, sprint-by-sprint delivery, Machine Speed (SPM) removed from sewing tab, Dashboard & Analytics marked as future requirements TBD.
