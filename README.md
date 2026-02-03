# APPAREL

> *Where Apparel Intelligence Meets Elegant Design*

A premium desktop application providing real-time machinery calculation, interactive floor layout planning, and presentation-ready dashboards for apparel industry consultants.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-green.svg)

## ✨ Features

- **Machinery Calculator** - Calculate machine requirements with embroidery-specific parameters
- **Floor Layout Planner** - Drag-and-drop factory floor planning with automatic space calculations
- **Analytics Dashboard** - Presentation-ready dashboards with draggable widgets
- **What-If Scenarios** - Compare up to 4 scenarios side-by-side

## 🛠 Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | TypeScript, React 19, TailwindCSS |
| Desktop | Tauri 2.x (Rust) |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| DevOps | Docker, GitHub Actions |

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/tools/install) (for Tauri)
- [Git](https://git-scm.com/)

### One-Click Setup

**Windows:**
```bash
./setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

```bash
# Clone the repository
git clone https://github.com/your-org/apparel.git
cd apparel

# Install dependencies
npm install

# Start development server (web only)
npm run dev

# Start Tauri desktop app
npm run tauri dev
```

## 📁 Project Structure

```
├── src/
│   ├── components/       # Reusable UI components
│   │   └── ui/           # Design system primitives
│   ├── pages/            # Page-level components
│   ├── layouts/          # App layout wrappers
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API/Backend services
│   ├── stores/           # State management
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Utility functions
│   ├── constants/        # App constants
│   ├── mocks/            # Mock data
│   └── styles/           # Global styles & design tokens
├── src-tauri/            # Tauri (Rust) backend
├── docs/                 # Documentation
└── .github/workflows/    # CI/CD pipelines
```

## 🎨 Design System

APPAREL features an **Apple Vision Pro-inspired** design language:

- 🫧 **Glass Materials** - Translucent surfaces with blur effects
- 🌊 **Soft Boundaries** - Heavily rounded corners (20-28px)
- ✨ **Focus States** - Scale & glow on hover
- 🌓 **Dark/Light Modes** - Full theme support

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run tauri dev` | Start Tauri desktop app |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format with Prettier |
| `npm run type-check` | TypeScript type check |

## 🐳 Docker

```bash
# Start development environment
docker-compose up

# Build image
docker build -t apparel .
```

## 📚 Documentation

- [Product Requirements Document](./docs/prd.md)
- [Requirements Tracker](./docs/requirements-tracker.md)

## 🏗 Development Phases

1. ✅ **Phase 1**: System Skeleton
2. ⬜ **Phase 2**: Domain Model & Contracts
3. ⬜ **Phase 3**: UI/UX Prototype
4. ⬜ **Phase 4**: Database Design
5. ⬜ **Phase 5**: Backend Logic

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

---

Built with ❤️ for the apparel industry
