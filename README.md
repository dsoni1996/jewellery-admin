# MANAS Admin Panel

Next.js 14 admin dashboard for the MANAS Jewellery backend API.
Runs on **port 3001** (frontend customer app on 3000).

---

## 📁 Structure

```
manas-admin/
├── src/
│   ├── app/
│   │   ├── login/page.jsx           # Login screen
│   │   ├── (admin)/                 # Protected admin area
│   │   │   ├── layout.jsx           # Auth guard + sidebar/header
│   │   │   ├── dashboard/page.jsx   # KPIs, charts, recent orders
│   │   │   ├── products/page.jsx    # Grid + table, add/edit/delete
│   │   │   ├── orders/page.jsx      # Order list + detail + status update
│   │   │   ├── customers/page.jsx   # Customer list
│   │   │   ├── coupons/page.jsx     # Coupon CRUD
│   │   │   ├── reviews/page.jsx     # Approve / delete reviews
│   │   │   ├── analytics/page.jsx   # Revenue, category, payment charts
│   │   │   └── settings/page.jsx    # Store, notifications, security
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx          # Dark sidebar with nav
│   │   │   └── Header.jsx           # Sticky header with search
│   │   └── common/index.jsx         # StatCard, Badge, Modal, Pagination, Toggle
│   ├── lib/api.js                   # All API calls to backend
│   └── styles/globals.css           # CSS variables + base styles
├── .env.local.example
└── next.config.js
```

---

## 🚀 Setup

```bash
cd manas-admin
npm install
cp .env.local.example .env.local    # set NEXT_PUBLIC_API_URL
npm run dev                          # runs on http://localhost:3001
```

Make sure backend is running on `http://localhost:5000` first.

---

## 🔐 Login

- **Phone**: `9000000000`
- **Password**: `Admin@123`

(Run `npm run seed` in `manas-backend` first to create this user)

---

## 📋 Pages

| Page | Features |
|---|---|
| **Dashboard** | Revenue KPIs, area chart, category bars, recent orders, quick actions |
| **Products** | Grid + table view, add/edit modal with all fields, toggle flags, delete |
| **Orders** | Status filter tabs, detail modal, tracking history, update status |
| **Customers** | Search, order count, total spent per customer |
| **Coupons** | Create/edit/delete, usage bar, expiry status |
| **Reviews** | Approve/reject, star rating, filter by status |
| **Analytics** | Revenue trend, category revenue bar, metal mix pie, payment pie, customer growth line |
| **Settings** | Store info, notification toggles, password change, SMTP config |

---

## 🔌 Backend Routes Used

```
GET  /api/admin/stats            → Dashboard KPIs
GET  /api/admin/stats/monthly    → Revenue chart data
GET  /api/admin/stats/categories → Category bar chart
GET  /api/admin/users            → Customers list
GET  /api/products               → Products list
POST /api/products               → Create product
PUT  /api/products/:id           → Update product
DEL  /api/products/:id           → Delete product
GET  /api/orders/admin/all       → All orders
PUT  /api/orders/admin/:id/status → Update order status
```

All admin routes require JWT token with `role: "admin"`.
