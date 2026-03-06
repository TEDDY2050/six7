# VORTEX ARENA — Gaming Arena Management System

## Complete Project Documentation

**Version:** 1.0  
**Date:** March 4, 2026  
**Platform:** Web Application (MERN Stack)

---

# Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Installation & Setup](#4-installation--setup)
5. [Database Design](#5-database-design)
6. [User Roles & Permissions](#6-user-roles--permissions)
7. [Frontend Pages & Features](#7-frontend-pages--features)
   - 7.1 [Landing Page](#71-landing-page)
   - 7.2 [Authentication (Login & Register)](#72-authentication-login--register)
   - 7.3 [Admin Dashboard](#73-admin-dashboard)
   - 7.4 [User Management](#74-user-management)
   - 7.5 [Game Management](#75-game-management)
   - 7.6 [Station Management](#76-station-management)
   - 7.7 [Session Management](#77-session-management)
   - 7.8 [Floor Map (Live View)](#78-floor-map-live-view)
   - 7.9 [Booking Management](#79-booking-management)
   - 7.10 [Payment / Billing Management](#710-payment--billing-management)
   - 7.11 [Reports & Analytics](#711-reports--analytics)
   - 7.12 [Settings & Data Export](#712-settings--data-export)
   - 7.13 [Customer Portal](#713-customer-portal)
   - 7.14 [Staff Portal](#714-staff-portal)
8. [API Reference](#8-api-reference)
9. [Security Features](#9-security-features)
10. [Deployment Guide](#10-deployment-guide)
11. [Future Enhancements](#11-future-enhancements)
12. [Appendix](#12-appendix)

---

# 1. Project Overview

**Vortex Arena** is a full-stack web-based gaming arena management system designed for gaming cafés, esports lounges, and entertainment venues. It provides a comprehensive solution for managing every aspect of a gaming arena — from customer bookings and station management to billing, session tracking, and analytics.

## Key Features

- **Multi-Role Access** — Admin, Staff, and Customer dashboards with role-based permissions
- **Real-Time Station Management** — Track station availability, usage, and status in real-time
- **Interactive Floor Map** — Visual representation of all gaming stations with live status
- **Smart Booking System** — Customers can browse games, select stations, and book time slots
- **Integrated Billing** — Automatic bill generation with support for Cash, UPI, Card, and Online payments
- **Session Management** — Start, extend, and end gaming sessions with automatic pricing
- **Reports & Analytics** — Daily, monthly, and custom date range reports with CSV export
- **Data Export** — Download booking and billing data as CSV files for offline use
- **Dark Theme UI** — Premium cyberpunk-inspired dark theme with smooth animations
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile devices

## Target Users

| Role | Description |
|------|-------------|
| **Admin** | Full access to all features — manages users, games, stations, bookings, payments, reports, and settings |
| **Staff** | Operational access — manages sessions, bookings, and payments during daily operations |
| **Customer** | Self-service access — browses games, books slots, views bookings, and manages profile |

---

# 2. Technology Stack

## Frontend

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library for building component-based interfaces |
| **Vite** | Build tool and development server |
| **React Router v6** | Client-side routing and navigation |
| **Framer Motion** | Smooth page transitions and micro-animations |
| **Lucide React** | Modern icon library |
| **Axios** | HTTP client for API communication |
| **React Hot Toast** | Beautiful toast notifications |
| **Tailwind-style Classes** | Custom CSS with dark theme design system |

## Backend

| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web framework for REST API |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Mongoose** | MongoDB object data modeling (ODM) |
| **JSON Web Tokens (JWT)** | Stateless authentication |
| **bcryptjs** | Password hashing and verification |
| **CORS** | Cross-Origin Resource Sharing middleware |

## Development Tools

| Tool | Purpose |
|------|---------|
| **npm** | Package manager |
| **Git** | Version control |
| **MongoDB Atlas** | Cloud database hosting |

---

# 3. System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Admin Panel  │  │ Staff Panel  │  │Customer Portal│  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬───────┘  │
│         └────────────────┼──────────────────┘           │
│                          │ HTTP/REST                     │
└──────────────────────────┼──────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────┐
│                   BACKEND (Express.js)                   │
│  ┌──────────┐  ┌─────────┐  ┌──────────┐  ┌─────────┐  │
│  │   Auth   │  │Bookings │  │ Payments │  │Sessions │  │
│  │  Routes  │  │ Routes  │  │  Routes  │  │ Routes  │  │
│  └──────────┘  └─────────┘  └──────────┘  └─────────┘  │
│  ┌──────────┐  ┌─────────┐  ┌──────────┐  ┌─────────┐  │
│  │  Users   │  │  Games  │  │ Stations │  │Dashboard│  │
│  │  Routes  │  │ Routes  │  │  Routes  │  │ Routes  │  │
│  └──────────┘  └─────────┘  └──────────┘  └─────────┘  │
│  ┌──────────┐                                           │
│  │ Reports  │   Middleware: JWT Auth + Role Guards       │
│  │  Routes  │                                           │
│  └──────────┘                                           │
└──────────────────────────┼──────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────┐
│                  DATABASE (MongoDB Atlas)                 │
│  ┌──────┐ ┌──────┐ ┌────────┐ ┌───────┐ ┌───────────┐  │
│  │Users │ │Games │ │Stations│ │Booking│ │  Sessions  │  │
│  └──────┘ └──────┘ └────────┘ └───────┘ └───────────┘  │
│  ┌──────────┐                                           │
│  │ Payments │                                           │
│  └──────────┘                                           │
└─────────────────────────────────────────────────────────┘
```

## Folder Structure

```
arena/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Game.js            # Game schema
│   │   ├── Station.js         # Station schema
│   │   ├── Booking.js         # Booking schema
│   │   ├── Session.js         # Session schema
│   │   └── Payment.js         # Payment schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── users.js           # User CRUD routes
│   │   ├── games.js           # Game CRUD routes
│   │   ├── stations.js        # Station CRUD routes
│   │   ├── bookings.js        # Booking management routes
│   │   ├── sessions.js        # Session management routes
│   │   ├── payments.js        # Payment/billing routes
│   │   ├── dashboard.js       # Dashboard statistics routes
│   │   └── reports.js         # Reports & CSV export routes
│   ├── server.js              # Express app entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── common/        # Shared UI components
│   │   │       ├── AuthLayout.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── CustomerLayout.jsx
│   │   │       ├── ErrorBoundary.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── MainLayout.jsx
│   │   │       ├── Navbar.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── StatCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Authentication state
│   │   │   └── BookingContext.jsx  # Booking state
│   │   ├── pages/
│   │   │   ├── admin/             # Admin panel pages
│   │   │   ├── customer/          # Customer portal pages
│   │   │   ├── staff/             # Staff portal pages
│   │   │   ├── auth/              # Login & Register
│   │   │   ├── LandingPage.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js             # Axios API service layer
│   │   ├── App.jsx                # Route definitions
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles & theme
│   ├── .env
│   └── package.json
│
└── docs/
    ├── screenshots/           # Application screenshots
    └── documentation.md       # This file
```

---

# 4. Installation & Setup

## Prerequisites

- **Node.js** v18+ installed
- **npm** v9+ installed
- **MongoDB Atlas** account (or local MongoDB instance)
- **Git** installed

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd arena
```

## Step 2: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
JWT_SECRET=your-super-secret-jwt-key
ADMIN_EMAIL=admin@gamearena.com
ADMIN_PASSWORD=admin123
```

Start the backend server:

```bash
npm run dev
```

The API server will start on `http://localhost:5000`.

## Step 3: Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or `http://localhost:5173`).

## Step 4: Default Admin Account

After setup, you can log in with the default admin credentials:

| Field | Value |
|-------|-------|
| Email | `admin@gamearena.com` |
| Password | `admin123` |

---

# 5. Database Design

## Entity Relationship Overview

The application uses 6 MongoDB collections (models):

```
Users ──┐
        ├── Bookings ──── Payments
Games ──┤
        │
Stations┤
        │
        └── Sessions ──── Payments
```

## 5.1 User Model

| Field | Type | Constraints |
|-------|------|-------------|
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, lowercase, email format |
| `password` | String | Required, min 6 characters (hashed) |
| `phone` | String | Optional, trimmed |
| `role` | String | Enum: `admin`, `staff`, `customer` (default: customer) |
| `createdAt` | Date | Auto-generated timestamp |
| `updatedAt` | Date | Auto-generated timestamp |

## 5.2 Game Model

| Field | Type | Constraints |
|-------|------|-------------|
| `title` | String | Required, trimmed |
| `genre` | String | Optional, trimmed |
| `description` | String | Optional, trimmed |
| `image` | String | Optional (URL), trimmed |
| `platform` | String | Optional, trimmed |
| `createdAt` | Date | Auto-generated timestamp |

## 5.3 Station Model

| Field | Type | Constraints |
|-------|------|-------------|
| `name` | String | Required, trimmed |
| `type` | String | Required, trimmed (e.g., PC, Console, VR, Simulator) |
| `pricePerHour` | Number | Required, min 0 |
| `status` | String | Enum: `Available`, `In Use`, `Offline` (default: Available) |
| `createdAt` | Date | Auto-generated timestamp |

## 5.4 Booking Model

| Field | Type | Constraints |
|-------|------|-------------|
| `user` | ObjectId → User | Required |
| `game` | ObjectId → Game | Required |
| `station` | ObjectId → Station | Required |
| `bookingDate` | String | Required (date string) |
| `bookingTime` | String | Required (time string) |
| `duration` | Number | Required, min 1 hour |
| `totalPrice` | Number | Auto-calculated (station rate × duration) |
| `status` | String | Enum: `pending`, `confirmed`, `active`, `completed`, `cancelled` |
| `createdAt` | Date | Auto-generated timestamp |

## 5.5 Session Model

| Field | Type | Constraints |
|-------|------|-------------|
| `booking` | ObjectId → Booking | Optional (walk-in sessions have no booking) |
| `customerName` | String | Optional (for walk-in customers) |
| `station` | ObjectId → Station | Required |
| `user` | ObjectId → User | Optional |
| `game` | ObjectId → Game | Optional |
| `startTime` | Date | Default: current time |
| `endTime` | Date | Set when session ends |
| `duration` | Number | Duration in minutes |
| `totalAmount` | Number | Default: 0 |
| `status` | String | Enum: `active`, `completed`, `extended` |

## 5.6 Payment Model

| Field | Type | Constraints |
|-------|------|-------------|
| `booking` | ObjectId → Booking | Optional |
| `session` | ObjectId → Session | Optional |
| `user` | ObjectId → User | Optional |
| `customerName` | String | Optional, trimmed |
| `amount` | Number | Required, min 0 |
| `method` | String | Enum: `cash`, `card`, `upi`, `online` (default: cash) |
| `status` | String | Enum: `pending`, `completed`, `refunded`, `failed` |
| `transactionId` | String | Auto-generated unique ID |
| `paidAmount` | Number | Default: 0 |
| `description` | String | Auto-generated from booking details |
| `createdAt` | Date | Auto-generated timestamp |

---

# 6. User Roles & Permissions

## Permission Matrix

| Feature | Admin | Staff | Customer |
|---------|:-----:|:-----:|:--------:|
| View Dashboard | ✅ | ✅ | ✅ |
| Manage Users (CRUD) | ✅ | ❌ | ❌ |
| Manage Games (CRUD) | ✅ | ❌ | ❌ |
| Manage Stations (CRUD) | ✅ | ❌ | ❌ |
| View Floor Map | ✅ | ❌ | ❌ |
| Start/End Sessions | ✅ | ✅ | ❌ |
| View All Bookings | ✅ | ✅ | ❌ |
| Create Booking (Self) | ✅ | ❌ | ✅ |
| View Own Bookings | ✅ | ❌ | ✅ |
| Manage Payments/Billing | ✅ | ✅ | ❌ |
| View Reports | ✅ | ❌ | ❌ |
| Export Data (CSV) | ✅ | ❌ | ❌ |
| Settings / Data Export | ✅ | ❌ | ❌ |
| Manage Own Profile | ✅ | ✅ | ✅ |

---

# 7. Frontend Pages & Features

---

## 7.1 Landing Page

The landing page is the public-facing homepage of Vortex Arena. It showcases the gaming arena's offerings and encourages visitors to register or book a slot.

![Landing Page](screenshots/01_landing.png)

### Features
- **Hero Section** — Eye-catching heading with gradient text, call-to-action buttons ("Book Now" & "Register")
- **Live Station Count** — Real-time display of total available gaming stations
- **Game Showcase** — Dynamically loaded list of available games from the database
- **Feature Highlights** — Key selling points (variety of platforms, competitive pricing, walk-in friendly)
- **Smart Navigation** — "Book Now" redirects logged-in users directly to booking page; guests are sent to login with auto-redirect back
- **Responsive Design** — Optimized layout for mobile, tablet, and desktop

### Technical Details
- Fetches live station and game data via API on page load
- Uses Framer Motion for smooth scroll-based animations
- Gradient text effects using CSS custom properties

---

## 7.2 Authentication (Login & Register)

### Login Page

![Login Page](screenshots/02_login.png)

The login page provides a clean, centered authentication form with the arena's dark theme.

### Features
- **Email & Password** input fields with validation
- **Form Validation** — Real-time error messages for empty fields, invalid email format, and short passwords
- **Loading State** — Button shows spinner during API call
- **Smart Redirect** — After login, users are redirected to their role-specific dashboard (`/admin`, `/staff`, or `/customer`)
- **URL Redirect Support** — If user was redirected from a protected page, they return there after login (via `?redirect=` query param)
- **Registration Link** — Quick link to sign-up page

### Register Page
- **Full Registration Form** — Name, Email, Phone, Password, and Confirm Password fields
- **Role Assignment** — New users are registered as `customer` by default
- **Duplicate Check** — Prevents registration with existing email addresses
- **Auto-Login** — Users are automatically logged in after successful registration

### Technical Details
- JWT token stored in `localStorage` for persistent session
- Auth state managed via React Context (`AuthContext`)
- Axios interceptor automatically attaches token to all API requests
- 401 responses trigger automatic logout and redirect to login

---

## 7.3 Admin Dashboard

![Admin Dashboard](screenshots/03_dashboard.png)

The admin dashboard provides a comprehensive overview of the arena's daily operations at a glance.

### Key Sections

#### Stat Cards (Top Row)
| Card | Description |
|------|-------------|
| **Today's Revenue** | Total revenue collected today with count of pending payments |
| **Active Sessions** | Number of currently active gaming sessions with station utilization |
| **Pending Collection** | Total amount of unpaid bills pending collection (clickable → Billing page) |
| **Total Bookings** | Lifetime booking count with total registered users |

#### Live Sessions Panel
- Real-time list of all active gaming sessions
- Shows station name, customer name, game title, duration, and time elapsed
- Green pulsing indicator when sessions are active
- "View All" link to full session management page

#### Pending Collection Panel
- Quick view of unpaid bills ordered by amount
- Shows customer name, description, and amount due
- "Collect" button redirects to Payment management
- Orange badge indicates count of pending items

#### Station Usage Chart
- Bar chart showing utilization percentage per station type (PC, Console, Simulator, VR)
- Shows in-use vs total stations with percentage labels

#### Weekly Revenue Chart
- Visual bar chart of last 7 days' revenue
- Animated bars with hover labels showing exact amounts

#### Top Games
- Ranking of most-booked games with gradient progress bars
- Medal icons (🥇🥈🥉) for top 3

#### Recent Activity Feed
- Chronological list of recent actions (bookings, session starts/ends, cancellations)
- Relative timestamps ("5m ago", "2h ago")
- Color-coded icons per activity type

### Quick Action Buttons
- **Sessions** — Jump to session management
- **Billing** — Jump to billing/payment page
- **Bookings** — Jump to booking management

---

## 7.4 User Management

![User Management](screenshots/04_users.png)

Administrators can view, create, edit, and delete all users in the system.

### Features
- **User Table** — Paginated list showing name, email, phone, role, and registration date
- **Search** — Filter users by name or email in real-time
- **Role Filter** — Quick filter tabs for All, Admin, Staff, Customer
- **Add User** — Modal form to create new users with role assignment
- **Edit User** — Inline editing of user details and role
- **Delete User** — Confirmation dialog before permanent deletion
- **Role Badges** — Color-coded role indicators (Admin = purple, Staff = blue, Customer = green)

### Technical Details
- API: `GET /api/users`, `POST /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id`
- Only accessible by admin role (server-side authorization)
- Passwords are hashed with bcrypt before storage

---

## 7.5 Game Management

![Game Management](screenshots/05_games.png)

Manage the catalog of games available across all gaming stations.

### Features
- **Game Grid** — Visual cards showing game title, genre, platform, and image
- **Add Game** — Modal form with fields for title, genre, description, image URL, and platform
- **Edit Game** — Click any game card to modify its details
- **Delete Game** — Remove games from the catalog
- **Platform Tags** — Visual indicators for each game's platform (PC, PlayStation, Xbox, etc.)
- **Search & Filter** — Search by title or filter by genre/platform

### Technical Details
- API: `GET /api/games`, `POST /api/games`, `PUT /api/games/:id`, `DELETE /api/games/:id`
- Game images can be external URLs or uploaded assets
- Games are referenced in bookings and sessions

---

## 7.6 Station Management

![Station Management](screenshots/06_stations.png)

Complete control over all gaming stations in the arena.

### Features
- **Station Table** — List of all stations with name, type, price per hour, and current status
- **Status Indicators** — Color-coded badges:
  - 🟢 **Available** — Station is free
  - 🔴 **In Use** — Station has an active session
  - ⚫ **Offline** — Station is disabled/under maintenance
- **Add Station** — Create new stations with name, type (PC/Console/VR/Simulator), and pricing
- **Edit Station** — Modify station details and pricing
- **Status Toggle** — Quickly mark stations as Available, In Use, or Offline
- **Delete Station** — Remove stations from the system
- **Price Display** — Shows hourly rate in ₹ (Indian Rupees)

### Technical Details
- API: `GET /api/stations`, `POST /api/stations`, `PUT /api/stations/:id`, `PATCH /api/stations/:id/status`
- Station status auto-updates when sessions start/end
- Pricing is used to auto-calculate booking and session costs

---

## 7.7 Session Management

![Session Management](screenshots/07_sessions.png)

The session management page provides operational control over gaming sessions — this is the primary tool used during daily operations.

### Features
- **Station Grid View** — Visual card layout showing every station
- **One-Click Start** — Click any available station to start a new session via a modal
- **Start Session Modal** — Form with:
  - Customer Name (walk-in) or select registered user
  - Game selection dropdown
  - Duration selection
  - Auto-calculated pricing
- **End Session** — Click active station to end the session and auto-generate billing
- **Extend Session** — Add more time to an active session
- **Status Color Coding**:
  - Green border + pulse = Available
  - Red border = In Use (shows customer, game, and time remaining)
  - Gray = Offline
- **Session Timer** — Live countdown showing remaining time for active sessions
- **Auto Refresh** — Station data refreshes periodically

### Technical Details
- API: `POST /api/sessions/start`, `POST /api/sessions/:id/end`, `POST /api/sessions/:id/extend`
- Starting a session auto-marks the station as "In Use"
- Ending a session marks station as "Available" and creates a payment record
- Walk-in sessions don't require a pre-existing booking

---

## 7.8 Floor Map (Live View)

![Floor Map](screenshots/08_floormap.png)

An interactive visual map of the entire gaming arena showing real-time status of every station.

### Features
- **Visual Station Layout** — Each station rendered as a card in a grid layout
- **Real-Time Status** — Stations show live status with color coding:
  - Green glow = Available (FREE)
  - Red glow = In Use (shows customer name, game, and time remaining)
  - Dark = Offline
- **Station Type Icons** — Visual icons per station type (Monitor, Gamepad, Headset, etc.)
- **Type-Based Styling** — Different gradient colors per station type (PC = blue, Console = purple, VR = pink, Simulator = orange)
- **Session Details** — Active stations show:
  - Customer name
  - Current game
  - Time remaining (countdown)
- **Fullscreen Mode** — Toggle fullscreen for large-screen monitoring
- **Auto-Refresh** — Data refreshes every 30 seconds
- **Station Count Summary** — Header showing total, available, in-use, and offline counts

### Use Cases
- Perfect for displaying on a large TV/monitor in the arena
- Staff can quickly identify available stations for walk-in customers
- Owners can monitor arena utilization at a glance

---

## 7.9 Booking Management

![Booking Management](screenshots/09_bookings.png)

Comprehensive management of all customer bookings.

### Features
- **Booking Table** — Full list with customer name, game, station, date/time, duration, price, and status
- **Status Tabs** — Quick filter by status: All, Pending, Confirmed, Active, Completed, Cancelled
- **Search** — Filter bookings by customer name, game title, or station name
- **Session Actions** — Context-sensitive action buttons per booking:
  - Pending: Start Session / Cancel
  - Confirmed: Start Session
  - Active: End Session
- **Booking Detail Slide-Over** — Click "View" to open a side panel with complete booking information:
  - Customer details (name, email)
  - Game and station info
  - Date, time, duration, price
  - Status badge
  - Creation timestamp
- **Status Badges** — Color-coded pills:
  - 🟡 Pending | 🔵 Confirmed | 🟢 Active | 🟣 Completed | 🔴 Cancelled

### Booking Flow
1. Customer creates a booking via the Customer Portal
2. Booking appears as **Pending** in the admin panel
3. Staff/Admin clicks **Start Session** → Status becomes **Active**
4. Staff/Admin clicks **End Session** → Status becomes **Completed**
5. Payment is auto-generated when booking is created

---

## 7.10 Payment / Billing Management

![Billing Management](screenshots/10_payments.png)

The billing page manages all financial transactions for the arena.

### Features
- **Date-Based View** — Filter billing records by specific date (defaults to today)
- **Customer Bills Table** — Detailed table with columns:
  - Sr.No, Name, Description, Time, Total, Payment Method, Paid Amount, Remaining, Status, Actions
- **Edit / Collect Modal** — Click any bill to open a detailed modal with:
  - Description field (auto-generated from booking details)
  - Total Amount (editable)
  - Amount Paid (editable, partial payments supported)
  - Remaining amount (auto-calculated with color coding)
  - Payment Method selector (Cash, UPI, Card, Online) with visual icons
  - "Save Changes" and "Collect Full Amount" buttons
- **Payment Status** — Badges show:
  - ✅ **Paid** — Amount fully collected
  - ⚠️ **Pending** — Outstanding balance
- **Payment Methods** — 4 supported methods with icons:
  - 💵 Cash | 📱 UPI | 💳 Card | 🌐 Online

### Technical Details
- API: `GET /api/payments`, `PUT /api/payments/:id`, `PATCH /api/payments/:id/collect`
- Payments auto-created when bookings are made
- Supports partial payments (track paid vs remaining)
- Payment method can be changed at collection time

---

## 7.11 Reports & Analytics

![Reports Page](screenshots/11_reports.png)

Comprehensive analytics and reporting for arena performance tracking.

### Features

#### Report Modes (Tab Selector)
| Mode | Description |
|------|-------------|
| **Daily** | View stats for a specific date with detailed booking table |
| **Monthly** | Aggregate monthly statistics (revenue, bookings, sessions, payments) |
| **Custom Range** | Specify start/end dates for custom period analysis |

#### Statistics Cards
- **Total Revenue** — Revenue for the selected period (₹ formatted)
- **Bookings** — Total booking count
- **Sessions** — Total session count
- **Payments** — Total completed payment count

#### Weekly Revenue Chart
- Animated bar chart showing day-by-day revenue for the last 7 days
- Hover tooltips showing exact amounts
- Gradient bars (purple → blue)

#### Top Games Ranking
- Bar chart showing most-booked games
- Medal icons for top 3 (🥇🥈🥉)
- Gradient progress bars with booking counts

#### Daily Bookings Table (Daily Mode Only)
- Full table of bookings for the selected date
- Columns: #, Customer, Game, Station, Time, Duration, Price, Status
- Animated row entrance
- Color-coded status badges

#### CSV Export Buttons
- **Bookings CSV** — Download all bookings for the selected period as CSV
- **Billing CSV** — Download all billing records for the selected period as CSV
- Downloads use the date range from the current report mode

### Technical Details
- API: `GET /api/reports/daily`, `GET /api/reports/monthly`, `GET /api/reports/custom`
- CSV Export: `GET /api/reports/export/bookings`, `GET /api/reports/export/payments`
- Dashboard extras (weekly revenue, top games) loaded from: `GET /api/dashboard/revenue`, `GET /api/dashboard/popular-games`

---

## 7.12 Settings & Data Export

![Settings Page](screenshots/12_settings.png)

The settings page provides data management features, primarily focused on data export.

### Data Export Section

#### Date Range Selection
- **From** and **To** date pickers to define the export period
- Defaults to last 30 days
- Human-readable date summary below the pickers

#### Export Cards

| Card | Description |
|------|-------------|
| **Booking Data** | Export all bookings with: Customer, Email, Phone, Game, Station, Date, Time, Duration, Price, Status |
| **Billing Data** | Export all billing with: Customer, Description, Amount, Paid, Remaining, Method, Status, Transaction ID |

#### How it Works
1. Select a date range using the From/To pickers
2. Click "Download CSV" on either card
3. A CSV file is generated server-side and streamed to the browser
4. File automatically downloads to your PC's Downloads folder
5. Open in Excel, Google Sheets, or any spreadsheet application

#### CSV File Format
- Proper CSV escaping for special characters (commas, quotes, newlines)
- Headers included as first row
- Dates formatted in Indian locale (en-IN)
- Currency in ₹ (Indian Rupees)

### Technical Details
- Frontend uses `reportService.exportReport()` with `responseType: 'blob'`
- Backend generates CSV using string concatenation (no external dependencies)
- Files are named `{type}_export_{date}.csv`
- Proper HTTP headers: `Content-Type: text/csv`, `Content-Disposition: attachment`

---

## 7.13 Customer Portal

The customer portal provides a self-service experience for arena customers.

### Customer Dashboard (`/customer`)
- Welcome message with customer's name
- Quick stats: Total bookings, Upcoming bookings, Amount spent
- Recent bookings list
- Quick action buttons to book a new slot

### Book Slot (`/customer/book`)
- **Step 1: Choose Game** — Browse available games with visual cards
- **Step 2: Choose Station** — Select from available stations matching the game's platform
- **Step 3: Select Date & Time** — Date picker and time slot selection
- **Step 4: Choose Duration** — 1-4 hour options with calculated pricing
- **Step 5: Confirm** — Review booking summary and confirm
- Auto-creates booking and redirects to "My Bookings"

### My Bookings (`/customer/bookings`)
- List of all personal bookings sorted by date
- Status badges (Pending, Confirmed, Active, Completed, Cancelled)
- Cancel button for pending bookings
- Booking detail view

### My Profile (`/customer/profile`)
- View and edit personal information (name, email, phone)
- Change password functionality

---

## 7.14 Staff Portal

The staff portal provides operational tools for arena employees.

### Staff Dashboard (`/staff`)
- Operational overview similar to admin dashboard
- Focus on active sessions and pending collections

### Session Management (`/staff/sessions`)
- Same session management interface as admin
- Start, end, and extend gaming sessions
- Walk-in customer support

### Staff Bookings (`/staff/bookings`)
- View and manage customer bookings
- Start/end sessions from bookings

### Staff Payments (`/staff/payments`)
- View and collect payments
- Edit billing details

---

# 8. API Reference

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login and get JWT token |
| GET | `/auth/me` | Private | Get current user profile |
| PUT | `/auth/profile` | Private | Update profile |
| POST | `/auth/logout` | Private | Logout (client-side) |

### User Routes (`/api/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users` | Admin | Get all users |
| GET | `/users/:id` | Admin | Get user by ID |
| POST | `/users` | Admin | Create new user |
| PUT | `/users/:id` | Admin | Update user |
| DELETE | `/users/:id` | Admin | Delete user |

### Game Routes (`/api/games`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/games` | Public | Get all games |
| GET | `/games/:id` | Public | Get game by ID |
| POST | `/games` | Admin | Create game |
| PUT | `/games/:id` | Admin | Update game |
| DELETE | `/games/:id` | Admin | Delete game |

### Station Routes (`/api/stations`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/stations` | Public | Get all stations |
| GET | `/stations/:id` | Public | Get station by ID |
| GET | `/stations/available` | Public | Get available stations |
| POST | `/stations` | Admin | Create station |
| PUT | `/stations/:id` | Admin | Update station |
| DELETE | `/stations/:id` | Admin | Delete station |
| PATCH | `/stations/:id/status` | Admin/Staff | Update station status |

### Booking Routes (`/api/bookings`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/bookings` | Admin/Staff | Get all bookings |
| GET | `/bookings/my` | Private | Get own bookings |
| GET | `/bookings/:id` | Private | Get booking by ID |
| POST | `/bookings` | Private | Create booking |
| PUT | `/bookings/:id` | Admin/Staff | Update booking |
| DELETE | `/bookings/:id` | Private | Cancel booking |
| POST | `/bookings/:id/start` | Admin/Staff | Start session |
| POST | `/bookings/:id/end` | Admin/Staff | End session |

### Session Routes (`/api/sessions`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/sessions/active` | Admin/Staff | Get active sessions |
| GET | `/sessions/:id` | Admin/Staff | Get session by ID |
| POST | `/sessions/start` | Admin/Staff | Start new session |
| POST | `/sessions/:id/end` | Admin/Staff | End session |
| POST | `/sessions/:id/extend` | Admin/Staff | Extend session |

### Payment Routes (`/api/payments`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/payments` | Admin/Staff | Get all payments |
| GET | `/payments/:id` | Admin/Staff | Get payment by ID |
| POST | `/payments` | Admin/Staff | Create payment |
| POST | `/payments/process/:bookingId` | Admin/Staff | Process booking payment |
| PUT | `/payments/:id` | Admin/Staff | Update payment |
| PATCH | `/payments/:id/collect` | Admin/Staff | Collect payment |

### Dashboard Routes (`/api/dashboard`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard/stats` | Admin/Staff | Get dashboard stats |
| GET | `/dashboard/revenue` | Admin/Staff | Get revenue data |
| GET | `/dashboard/popular-games` | Admin/Staff | Get popular games |
| GET | `/dashboard/station-usage` | Admin/Staff | Get station usage |
| GET | `/dashboard/activities` | Admin/Staff | Get recent activities |

### Report Routes (`/api/reports`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/reports/daily` | Admin | Get daily report |
| GET | `/reports/monthly` | Admin | Get monthly report |
| GET | `/reports/custom` | Admin | Get custom range report |
| GET | `/reports/export/:type` | Admin | Export data as CSV |

---

# 9. Security Features

## Authentication & Authorization

| Feature | Implementation |
|---------|---------------|
| **Password Hashing** | bcrypt with salt rounds = 10 |
| **JWT Tokens** | 7-day expiry, signed with secret key |
| **Role-Based Access** | Server-side middleware checks user role before route handler |
| **Protected Routes** | Frontend ProtectedRoute component prevents unauthorized access |
| **Auto-Logout** | 401 responses auto-clear token and redirect to login |

## Data Validation

| Feature | Implementation |
|---------|---------------|
| **Input Validation** | Mongoose schema validators (required, min, max, enum, regex) |
| **Email Format** | Regex validation on both frontend and backend |
| **Password Strength** | Minimum 6 characters enforced |
| **Duplicate Prevention** | Unique email constraint prevents duplicate accounts |
| **CORS** | Enabled via `cors` middleware |

## Frontend Security

| Feature | Implementation |
|---------|---------------|
| **Token Storage** | localStorage (cleared on logout) |
| **Auth Context** | Central state management for authentication |
| **Route Guards** | ProtectedRoute component checks auth + role before rendering |
| **Public Routes** | Redirect authenticated users away from login/register |

---

# 10. Deployment Guide

## Environment Variables

### Backend (`.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-production-secret-key
```

### Frontend (`.env`)

```env
VITE_API_URL=https://your-api-domain.com/api
```

## Production Build

### Frontend

```bash
cd frontend
npm run build
```

This generates a `dist/` folder with optimized static files.

### Backend

```bash
cd backend
npm start
```

## Deployment Options

| Platform | Type | Notes |
|----------|------|-------|
| **Vercel** | Frontend | Free hosting for React apps |
| **Render** | Backend + Frontend | Free tier available, auto-deploy from Git |
| **Railway** | Full Stack | Easy deployment with environment variables |
| **DigitalOcean** | VPS | Full control, requires manual setup |
| **AWS EC2** | VPS | Scalable, production-grade |

## Recommended Production Setup

1. Deploy backend to **Render** or **Railway** with environment variables
2. Deploy frontend to **Vercel** with `VITE_API_URL` pointing to backend
3. Use **MongoDB Atlas** for database (already cloud-hosted)
4. Set up a **custom domain** for professional branding
5. Enable **HTTPS** on both frontend and backend

---

# 11. Future Enhancements

| Feature | Description | Priority |
|---------|-------------|----------|
| **Email Notifications** | Send booking confirmations and reminders via email | High |
| **Payment Gateway** | Integrate Razorpay/Stripe for online payments | High |
| **Membership Plans** | Monthly/yearly subscription plans with discounts | Medium |
| **Tournament Mode** | Organize and manage esports tournaments | Medium |
| **Loyalty Program** | Points-based rewards for frequent customers | Medium |
| **SMS Alerts** | Session expiry alerts and booking reminders via SMS | Medium |
| **Multi-Branch** | Support for multiple arena locations | Low |
| **Inventory** | Track hardware inventory (controllers, headsets, etc.) | Low |
| **Analytics Dashboard** | Advanced charts with trend analysis and predictions | Low |
| **Mobile App** | React Native companion app for customers | Low |

---

# 12. Appendix

## A. Default Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@gamearena.com` | `admin123` |

## B. Common API Response Formats

### Success Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65a...",
    "name": "Admin User",
    "email": "admin@gamearena.com",
    "role": "admin"
  }
}
```

### Error Response
```json
{
  "message": "Invalid email or password"
}
```

### Validation Error
```json
{
  "message": "Name is required, Email is required"
}
```

## C. CSV Export Columns

### Bookings CSV
```
Sr.No, Customer, Email, Phone, Game, Station, Date, Time, Duration (hrs), Price (₹), Status, Created At
```

### Payments CSV
```
Sr.No, Customer, Description, Amount (₹), Paid (₹), Remaining (₹), Method, Status, Transaction ID, Created At
```

## D. Color Theme Reference

| Token | Value | Usage |
|-------|-------|-------|
| `dark-50` | Background | Main page background |
| `dark-100` | Surface | Cards and panels |
| `dark-200` | Elevated | Input fields and modals |
| `dark-300` | Border | Subtle borders |
| `primary-500` | Purple | Primary actions and active states |
| `neon-blue` | Cyan | Secondary highlights |
| `neon-green` | Green | Success states and availability |
| `neon-pink` | Pink | Accent highlights |

---

## E. Application Screenshots Gallery

Below is a complete visual walkthrough of every page in the Vortex Arena application.

---

### Screenshot 1 — Landing Page

The public homepage showcasing the gaming arena with a hero section, available games, and call-to-action buttons.

![Landing Page](screenshots/01_landing.png)

---

### Screenshot 2 — Login Page

Clean authentication form with email/password fields, validation, and registration link.

![Login Page](screenshots/02_login.png)

---

### Screenshot 3 — Admin Dashboard

Comprehensive overview with stat cards, live sessions, pending payments, station usage, weekly revenue chart, top games, and activity feed.

![Admin Dashboard](screenshots/03_dashboard.png)

---

### Screenshot 4 — User Management

Table view of all registered users with search, role filters, and CRUD operations.

![User Management](screenshots/04_users.png)

---

### Screenshot 5 — Game Management

Visual card grid of all games in the catalog with add/edit/delete capabilities.

![Game Management](screenshots/05_games.png)

---

### Screenshot 6 — Station Management

All gaming stations listed with type, pricing, real-time status, and management controls.

![Station Management](screenshots/06_stations.png)

---

### Screenshot 7 — Session Management

Interactive station grid for starting, ending, and extending gaming sessions with real-time status.

![Session Management](screenshots/07_sessions.png)

---

### Screenshot 8 — Floor Map (Live View)

Visual map of the entire arena with color-coded station status, session details, and fullscreen mode.

![Floor Map](screenshots/08_floormap.png)

---

### Screenshot 9 — Booking Management

Full booking table with status tabs, search, session actions, and detailed booking slide-over panel.

![Booking Management](screenshots/09_bookings.png)

---

### Screenshot 10 — Payment / Billing Management

Date-based billing view with payment collection, method selection, partial payments, and status tracking.

![Billing Management](screenshots/10_payments.png)

---

### Screenshot 11 — Reports & Analytics

Multi-mode reporting (Daily/Monthly/Custom Range) with stat cards, revenue chart, top games, and CSV export.

![Reports Page](screenshots/11_reports.png)

---

### Screenshot 12 — Settings & Data Export

Data export interface with date range selection and download cards for Booking CSV and Billing CSV files.

![Settings Page](screenshots/12_settings.png)

---

**End of Documentation**

*Vortex Arena — Built with ❤️ using the MERN Stack*
