# ⚡ GoalForge — Enterprise Goal Management Platform

> A complete enterprise-grade SaaS application for employee goal management, manager approvals, and quarterly performance tracking.

---

## 🖼️ Preview

| Login | Employee Dashboard | Admin Dashboard |
|---|---|---|
| Premium split-layout with demo quick-access | KPI cards, radial progress, goal list | Org-wide analytics, dept charts, audit feed |

---

## 🏗️ Architecture

```
GOALFORGE/
├── frontend/           ← React + Vite + Tailwind CSS
│   └── src/
│       ├── components/ ← Shared UI (Sidebar, Topbar, AppLayout, ui.jsx)
│       ├── contexts/   ← AuthContext (mock + real backend), ToastContext
│       ├── lib/        ← api.js (Axios), utils.js
│       └── pages/
│           ├── LoginPage.jsx
│           ├── employee/   ← Dashboard, Goals, Checkins, Progress
│           ├── manager/    ← Dashboard, Approvals, Checkins, Analytics, TeamGoals
│           └── admin/      ← Dashboard, Users, Goals, Analytics, Audit, Cycles, Reports
├── backend/            ← Node.js + Express.js REST API
│   ├── config/         ← database.js (PostgreSQL pool)
│   ├── middleware/     ← auth.js (JWT + RBAC)
│   ├── routes/         ← auth, goals, checkins, users, analytics, audit, notifications
│   └── server.js
└── database/
    ├── schema.sql      ← Complete PostgreSQL schema
    └── seed.sql        ← Demo data (users, goals, check-ins, audit logs)
```

---

## 🚀 Quick Start

### Option 1 — Frontend Only (No Backend Needed)
The frontend includes a **mock authentication fallback** — it works 100% without a running backend.

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** and use any demo button to log in.

### Option 2 — Full Stack
```bash
# Terminal 1 — Frontend
cd frontend
npm run dev

# Terminal 2 — Backend
cd backend
npm install
npm start       # or: npm run dev (requires nodemon)
```

### Option 3 — From Root
```bash
npm run dev          # starts frontend
npm run dev:backend  # starts backend
```

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Employee** | alice@goalforge.com | password123 |
| **Manager** | bob@goalforge.com | password123 |
| **Admin / HR** | admin@goalforge.com | password123 |

Or click the **Quick Demo Access** buttons on the login screen.

---

## 🔐 Authentication

- JWT tokens stored in `localStorage`
- Mock login fallback (frontend-only mode, no backend required)
- Role-based route protection (`employee`, `manager`, `admin`)
- Persistent login (refreshes from `localStorage` on mount)
- Logout clears all stored tokens

---

## 📦 Features by Role

### 👷 Employee
- Create, edit, delete draft goals
- Goal form validation: total weightage = 100%, min 10%/goal, max 8 goals
- Submit goal sheet for manager review
- Quarterly check-ins (Q1–Q4 achievement entry)
- Progress dashboard with weighted score and radar chart
- Goals auto-lock after manager approval

### 👔 Manager
- Team dashboard with member progress charts
- Approve / Reject / Request Rework on submissions
- Manager comments per submission
- Team check-in review with per-goal comments
- Analytics: individual performance, thrust area radar, heatmap matrix

### 🛡️ Admin / HR
- User management (CRUD with role assignment)
- Organization-wide goal overview with lock/unlock capability
- Department performance analytics
- Quarter-on-Quarter trend charts
- Audit logs (filterable by action, searchable)
- FY Cycle management with quarter windows
- Export reports (CSV / Excel / PDF)

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 + Custom CSS Variables |
| UI Components | Radix UI primitives |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Auth | JWT + bcryptjs |
| Database | PostgreSQL (via `pg`) |
| Security | Helmet + CORS |

---

## 🗄️ Database Setup (PostgreSQL)

1. Create a database: `createdb goalforge`
2. Run schema: `psql -d goalforge -f database/schema.sql`
3. Seed demo data: `psql -d goalforge -f database/seed.sql`
4. Set `DATABASE_URL` in `backend/.env`

---

## ⚙️ Environment Variables

### `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

### `backend/.env`
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/goalforge
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | Public | Login & get JWT |
| GET | `/api/auth/me` | JWT | Get current user |
| GET | `/api/goals` | JWT | List goals (role-filtered) |
| POST | `/api/goals` | Employee | Create goal |
| PUT | `/api/goals/:id` | JWT | Update goal |
| DELETE | `/api/goals/:id` | Employee | Delete draft goal |
| POST | `/api/goals/:id/submit` | Employee | Submit for review |
| POST | `/api/goals/:id/approve` | Manager | Approve goals |
| POST | `/api/goals/:id/reject` | Manager | Reject goals |
| POST | `/api/goals/:id/rework` | Manager | Return for rework |
| POST | `/api/goals/:id/unlock` | Admin | Unlock approved goal |
| GET | `/api/checkins/goal/:id` | JWT | Get check-ins for goal |
| POST | `/api/checkins` | JWT | Create check-in |
| GET | `/api/users` | Admin/Mgr | List users |
| POST | `/api/users` | Admin | Create user |
| GET | `/api/analytics/employee` | Employee | Personal analytics |
| GET | `/api/analytics/manager` | Manager | Team analytics |
| GET | `/api/analytics/admin` | Admin | Org analytics |
| GET | `/api/audit` | Admin | Audit logs |
| GET | `/api/notifications` | JWT | User notifications |

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel or run: vercel --prod
```

### Backend → Render / Railway
1. Push `backend/` to a Git repo
2. Set environment variables on the platform
3. Start command: `node server.js`

### Database → Neon / Supabase
1. Create a PostgreSQL project
2. Run `database/schema.sql` in the SQL editor
3. Run `database/seed.sql` for demo data
4. Copy the connection string to `DATABASE_URL`

---

## 📊 Progress Calculation

| UoM Type | Formula |
|----------|---------|
| Numeric | `achievement / target × 100` |
| Percentage | `achievement / target × 100` |
| Timeline | `achievement / target × 100` |
| Zero-based | `achievement == 0 ? 100% : 0%` |

---

## 🏆 Hackathon-Ready Features

- ✅ Zero backend dependency (mock mode)
- ✅ 3 fully distinct role experiences
- ✅ Beautiful dark enterprise UI
- ✅ Complete goal lifecycle (Draft → Submit → Approve → Lock → Check-in)
- ✅ Real-time toast notifications
- ✅ Interactive charts (Bar, Line, Area, Pie, Radar, Radial)
- ✅ Audit trail with full event history
- ✅ Collapsible sidebar
- ✅ Search + filter on all tables
- ✅ Inline modal forms
- ✅ Responsive design

---

*Built with ⚡ by GoalForge Team*
